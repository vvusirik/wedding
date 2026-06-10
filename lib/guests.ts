import { google, sheets_v4 } from "googleapis";

export interface GuestRecord {
    firstName: string;
    lastName: string;
    tags: string[];
    slug: string;
    envelopeName?: string;
}

const CACHE_TTL_MS = 5 * 60 * 1000;
const DEFAULT_RANGE = "A:Z";

let cache: { data: GuestRecord[]; expiresAt: number } | null = null;
let inflight: Promise<GuestRecord[]> | null = null;

function normalizeHeader(h: string): string {
    return h.trim().toLowerCase().replace(/\s+/g, "_");
}

function parseRows(rows: string[][]): GuestRecord[] {
    if (rows.length === 0) return [];
    const headers = rows[0].map(normalizeHeader);
    const norm = (h: string) => h.replace(/[\s_]/g, "");

    // Locate name column pairs: person 1 uses first_name/last_name,
    // persons 2–4 use first_name_2/last_name_2, etc.
    const nameColumns: Array<{ first: number; last: number }> = [];
    const i1First = headers.findIndex((h) => norm(h) === "firstname");
    const i1Last = headers.findIndex((h) => norm(h) === "lastname");
    if (i1First >= 0 && i1Last >= 0) nameColumns.push({ first: i1First, last: i1Last });
    for (let n = 2; n <= 4; n++) {
        const iFirst = headers.findIndex((h) => norm(h) === `firstname${n}`);
        const iLast = headers.findIndex((h) => norm(h) === `lastname${n}`);
        if (iFirst >= 0 && iLast >= 0) nameColumns.push({ first: iFirst, last: iLast });
    }

    const iTags = headers.indexOf("tags");
    const iSlug = headers.indexOf("slug");
    const iEnvelope = headers.indexOf("envelope_name");
    if (i1First < 0 || i1Last < 0 || iTags < 0) {
        throw new Error(
            `guest sheet missing required columns. need first_name, last_name, tags. got: ${headers.join(", ")}`,
        );
    }

    const records: GuestRecord[] = [];
    for (const row of rows.slice(1)) {
        const tags = String(row[iTags] ?? "")
            .split(",")
            .map((t) => t.trim().toLowerCase())
            .filter((t) => t.length > 0);
        const slug = iSlug >= 0 ? String(row[iSlug] ?? "").trim().toLowerCase() : "";
        const envelopeName = iEnvelope >= 0 ? String(row[iEnvelope] ?? "").trim() : undefined;
        for (const { first: fi, last: li } of nameColumns) {
            const firstName = String(row[fi] ?? "").trim();
            const lastName = String(row[li] ?? "").trim();
            if (!firstName && !lastName) continue;
            records.push({ firstName, lastName, tags, slug, ...(envelopeName ? { envelopeName } : {}) });
        }
    }
    return records;
}

function readEnv(): { credentials: object; sheetId: string; range: string } {
    const raw = process.env.GOOGLE_SERVICE_ACCOUNT_JSON;
    const sheetId = process.env.GUEST_SHEET_ID;
    const range = process.env.GUEST_SHEET_RANGE ?? DEFAULT_RANGE;
    if (!raw) throw new Error("GOOGLE_SERVICE_ACCOUNT_JSON env var is not set");
    if (!sheetId) throw new Error("GUEST_SHEET_ID env var is not set");
    return { credentials: JSON.parse(raw), sheetId, range };
}

async function fetchFromSheet(): Promise<GuestRecord[]> {
    const { credentials, sheetId, range } = readEnv();
    const auth = new google.auth.GoogleAuth({
        credentials,
        scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
    });
    const sheets = google.sheets({ version: "v4", auth });
    const res = await sheets.spreadsheets.values.get({
        spreadsheetId: sheetId,
        range,
    });
    return parseRows(res.data.values ?? []);
}

async function load(): Promise<GuestRecord[]> {
    const now = Date.now();
    if (cache && cache.expiresAt > now) return cache.data;
    if (inflight) return inflight;

    inflight = fetchFromSheet()
        .then((data) => {
            cache = { data, expiresAt: Date.now() + CACHE_TTL_MS };
            return data;
        })
        .catch((err) => {
            if (cache) {
                console.warn("guests: refresh failed, serving stale cache:", err);
                return cache.data;
            }
            throw err;
        })
        .finally(() => {
            inflight = null;
        });
    return inflight;
}

export async function lookupGuest(
    firstName: string,
    lastName: string,
): Promise<GuestRecord | null> {
    const guests = await load();
    const fn = firstName.toLowerCase();
    const ln = lastName.toLowerCase();
    return (
        guests.find(
            (g) => g.firstName.toLowerCase() === fn && g.lastName.toLowerCase() === ln,
        ) ?? null
    );
}

export async function lookupParty(slug: string): Promise<GuestRecord[]> {
    const normalized = slug.trim().toLowerCase();
    if (!normalized) return [];
    const guests = await load();
    return guests.filter((g) => g.slug === normalized);
}

/** Returns a write-scope Sheets client + spreadsheetId. For use in API routes
 * that need to append to RSVPs (or any other sheet writes). */
export async function getWritableSheetsClient(): Promise<{
    sheets: sheets_v4.Sheets;
    spreadsheetId: string;
}> {
    const { credentials, sheetId } = readEnv();
    const auth = new google.auth.GoogleAuth({
        credentials,
        scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });
    const sheets = google.sheets({ version: "v4", auth });
    return { sheets, spreadsheetId: sheetId };
}

/** True if any row in the RSVPs tab has the given slug. */
export async function hasExistingRsvp(slug: string): Promise<boolean> {
    const normalized = slug.trim().toLowerCase();
    if (!normalized) return false;
    const { sheets, spreadsheetId } = await getWritableSheetsClient();
    const res = await sheets.spreadsheets.values.get({
        spreadsheetId,
        range: "RSVPs!B:B",
    });
    const values = res.data.values ?? [];
    return values
        .slice(1) // skip header
        .some((row) => String(row[0] ?? "").trim().toLowerCase() === normalized);
}
