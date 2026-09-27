import { NextResponse } from "next/server";
import { google, sheets_v4 } from "googleapis";

const SEATING_SHEET_NAME = "SeatingChart";

function readEnv() {
    const raw = process.env.GOOGLE_SERVICE_ACCOUNT_JSON;
    const sheetId = process.env.GUEST_SHEET_ID;
    if (!raw) throw new Error("GOOGLE_SERVICE_ACCOUNT_JSON not set");
    if (!sheetId) throw new Error("GUEST_SHEET_ID not set");
    return { credentials: JSON.parse(raw), sheetId };
}

function norm(h: string) {
    return h.trim().toLowerCase().replace(/[\s_]/g, "");
}

function getSheetsClient(credentials: object) {
    const auth = new google.auth.GoogleAuth({
        credentials,
        scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });
    return google.sheets({ version: "v4", auth });
}

export interface Person {
    id: string;
    firstName: string;
    lastName: string;
    partySlug: string;
    partyLabel: string;
}

export interface SeatingTable {
    id: string;
    name: string;
    guestIds: string[];
}

async function getPeople(sheets: sheets_v4.Sheets, sheetId: string): Promise<Person[]> {
    const res = await sheets.spreadsheets.values.get({ spreadsheetId: sheetId, range: "A:Z" });
    const rows = res.data.values ?? [];
    if (rows.length === 0) return [];

    const headers = rows[0].map(norm);
    const col = (name: string) => headers.indexOf(name);
    const iSlug = col("slug");
    const iEnvelope = col("envelopename");

    const personCols: Array<{ first: number; last: number }> = [];
    const i1f = col("firstname");
    const i1l = col("lastname");
    if (i1f >= 0 && i1l >= 0) personCols.push({ first: i1f, last: i1l });
    for (let n = 2; n <= 4; n++) {
        const f = headers.findIndex((h) => h === `firstname${n}`);
        const l = headers.findIndex((h) => h === `lastname${n}`);
        if (f >= 0 && l >= 0) personCols.push({ first: f, last: l });
    }

    const people: Person[] = [];
    for (const row of rows.slice(1)) {
        const slug = String(row[iSlug] ?? "").trim().toLowerCase();
        if (!slug) continue;
        const envelopeName = iEnvelope >= 0 ? String(row[iEnvelope] ?? "").trim() : "";

        const members = personCols
            .map(({ first, last }) => ({
                firstName: String(row[first] ?? "").trim(),
                lastName: String(row[last] ?? "").trim(),
            }))
            .filter((m) => m.firstName || m.lastName);

        const partyLabel =
            envelopeName || members.map((m) => m.firstName).filter(Boolean).join(" & ");

        members.forEach((m, idx) => {
            people.push({
                id: `${slug}__${idx}`,
                firstName: m.firstName,
                lastName: m.lastName,
                partySlug: slug,
                partyLabel: partyLabel || `${m.firstName} ${m.lastName}`,
            });
        });
    }
    return people;
}

async function getTables(sheets: sheets_v4.Sheets, sheetId: string): Promise<SeatingTable[]> {
    const meta = await sheets.spreadsheets.get({ spreadsheetId: sheetId });
    const hasSheet = meta.data.sheets?.some((s) => s.properties?.title === SEATING_SHEET_NAME);
    if (!hasSheet) return [];

    const res = await sheets.spreadsheets.values.get({
        spreadsheetId: sheetId,
        range: `${SEATING_SHEET_NAME}!A:C`,
    });
    const rows = (res.data.values ?? []).slice(1); // skip header

    const tableOrder: string[] = [];
    const byId = new Map<string, SeatingTable>();
    for (const row of rows) {
        const tableId = String(row[0] ?? "").trim();
        const tableName = String(row[1] ?? "").trim();
        const guestId = String(row[2] ?? "").trim();
        if (!tableId) continue;

        if (!byId.has(tableId)) {
            byId.set(tableId, { id: tableId, name: tableName || tableId, guestIds: [] });
            tableOrder.push(tableId);
        }
        if (guestId) byId.get(tableId)!.guestIds.push(guestId);
    }
    return tableOrder.map((id) => byId.get(id)!);
}

export async function GET() {
    try {
        const { credentials, sheetId } = readEnv();
        const sheets = getSheetsClient(credentials);
        const [people, tables] = await Promise.all([
            getPeople(sheets, sheetId),
            getTables(sheets, sheetId),
        ]);
        return NextResponse.json({ people, tables });
    } catch (err) {
        return NextResponse.json(
            { error: err instanceof Error ? err.message : "failed to load seating data" },
            { status: 500 },
        );
    }
}

export async function POST(request: Request) {
    const { tables } = (await request.json()) as { tables: SeatingTable[] };
    if (!Array.isArray(tables)) {
        return NextResponse.json({ ok: false, error: "tables must be an array" }, { status: 400 });
    }

    try {
        const { credentials, sheetId } = readEnv();
        const sheets = getSheetsClient(credentials);

        const meta = await sheets.spreadsheets.get({ spreadsheetId: sheetId });
        const hasSheet = meta.data.sheets?.some((s) => s.properties?.title === SEATING_SHEET_NAME);
        if (!hasSheet) {
            await sheets.spreadsheets.batchUpdate({
                spreadsheetId: sheetId,
                requestBody: {
                    requests: [{ addSheet: { properties: { title: SEATING_SHEET_NAME } } }],
                },
            });
        }

        // Clear existing content, then rewrite in full (small dataset, simplest correct approach)
        await sheets.spreadsheets.values.clear({
            spreadsheetId: sheetId,
            range: `${SEATING_SHEET_NAME}!A:C`,
        });

        const values: string[][] = [["table_id", "table_name", "guest_id"]];
        for (const table of tables) {
            if (table.guestIds.length === 0) {
                values.push([table.id, table.name, ""]);
            } else {
                for (const guestId of table.guestIds) {
                    values.push([table.id, table.name, guestId]);
                }
            }
        }

        await sheets.spreadsheets.values.update({
            spreadsheetId: sheetId,
            range: `${SEATING_SHEET_NAME}!A1`,
            valueInputOption: "USER_ENTERED",
            requestBody: { values },
        });

        return NextResponse.json({ ok: true });
    } catch (err) {
        return NextResponse.json(
            { ok: false, error: err instanceof Error ? err.message : "failed to save seating chart" },
            { status: 500 },
        );
    }
}
