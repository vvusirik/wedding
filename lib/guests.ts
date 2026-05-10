import { google } from "googleapis";

interface GuestRecord {
    firstName: string;
    lastName: string;
    tags: string[];
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
    const iFirst = headers.indexOf("first_name");
    const iLast = headers.indexOf("last_name");
    const iTags = headers.indexOf("tags");
    if (iFirst < 0 || iLast < 0 || iTags < 0) {
        throw new Error(
            `guest sheet missing required columns. need first_name, last_name, tags. got: ${headers.join(", ")}`,
        );
    }
    return rows
        .slice(1)
        .map((row): GuestRecord | null => {
            const first = String(row[iFirst] ?? "").trim();
            const last = String(row[iLast] ?? "").trim();
            if (!first && !last) return null;
            const tags = String(row[iTags] ?? "")
                .split(",")
                .map((t) => t.trim().toLowerCase())
                .filter((t) => t.length > 0);
            return { firstName: first, lastName: last, tags };
        })
        .filter((g): g is GuestRecord => g !== null);
}

async function fetchFromSheet(): Promise<GuestRecord[]> {
    const raw = process.env.GOOGLE_SERVICE_ACCOUNT_JSON;
    const sheetId = process.env.GUEST_SHEET_ID;
    const range = process.env.GUEST_SHEET_RANGE ?? DEFAULT_RANGE;

    if (!raw) throw new Error("GOOGLE_SERVICE_ACCOUNT_JSON env var is not set");
    if (!sheetId) throw new Error("GUEST_SHEET_ID env var is not set");

    const credentials = JSON.parse(raw);
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

export async function lookup(
    firstName: string,
    lastName: string,
): Promise<string[] | null> {
    const guests = await load();
    const match = guests.find(
        (g) =>
            g.firstName.toLowerCase() === firstName.toLowerCase() &&
            g.lastName.toLowerCase() === lastName.toLowerCase(),
    );
    return match ? match.tags : null;
}
