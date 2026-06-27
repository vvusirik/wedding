import { NextResponse } from "next/server";
import { google } from "googleapis";

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

export async function GET() {
    const { credentials, sheetId } = readEnv();
    const sheets = getSheetsClient(credentials);

    const [guestRes, rsvpRes, logRes] = await Promise.all([
        sheets.spreadsheets.values.get({ spreadsheetId: sheetId, range: "A:Z" }),
        sheets.spreadsheets.values
            .get({ spreadsheetId: sheetId, range: "RSVPs!B:B" })
            .catch(() => ({ data: { values: [] } })),
        sheets.spreadsheets.values
            .get({ spreadsheetId: sheetId, range: "InviteLog!A:B" })
            .catch(() => ({ data: { values: [] } })),
    ]);

    const guestRows = guestRes.data.values ?? [];
    if (guestRows.length === 0) return NextResponse.json([]);

    const headers = guestRows[0].map(norm);
    const col = (name: string) => headers.indexOf(name);

    const iSlug = col("slug");
    const iEmail = col("email");
    const iEnvelope = col("envelopename");
    const iTags = col("tags");
    const iFirst1 = col("firstname");
    const iLast1 = col("lastname");
    const personCols: Array<{ first: number; last: number }> = [];
    if (iFirst1 >= 0 && iLast1 >= 0) personCols.push({ first: iFirst1, last: iLast1 });
    for (let n = 2; n <= 4; n++) {
        const f = headers.findIndex((h) => h === `firstname${n}`);
        const l = headers.findIndex((h) => h === `lastname${n}`);
        if (f >= 0 && l >= 0) personCols.push({ first: f, last: l });
    }

    const rsvpSlugs = new Set(
        (rsvpRes.data.values ?? [])
            .slice(1)
            .map((r) =>
                String(r[0] ?? "")
                    .trim()
                    .toLowerCase(),
            )
            .filter(Boolean),
    );
    const sentSlugs = new Set(
        (logRes.data.values ?? [])
            .slice(1)
            .map((r) =>
                String(r[1] ?? "")
                    .trim()
                    .toLowerCase(),
            )
            .filter(Boolean),
    );

    const parties = guestRows
        .slice(1)
        .map((row) => {
            const slug = String(row[iSlug] ?? "")
                .trim()
                .toLowerCase();
            const email = String(row[iEmail] ?? "").trim();
            const envelopeName = iEnvelope >= 0 ? String(row[iEnvelope] ?? "").trim() : "";
            const tags =
                iTags >= 0
                    ? String(row[iTags] ?? "")
                          .split(",")
                          .map((t) => t.trim())
                          .filter(Boolean)
                    : [];

            const members = personCols
                .map(({ first, last }) => ({
                    firstName: String(row[first] ?? "").trim(),
                    lastName: String(row[last] ?? "").trim(),
                }))
                .filter((m) => m.firstName || m.lastName);

            if (members.length === 0 || !slug) return null;

            const status = rsvpSlugs.has(slug)
                ? "rsvp_received"
                : sentSlugs.has(slug)
                  ? "sent"
                  : "not_sent";

            return {
                slug,
                email,
                envelopeName,
                tags,
                head: members[0],
                otherMembers: members.slice(1),
                status,
            };
        })
        .filter(Boolean);

    return NextResponse.json(parties);
}
