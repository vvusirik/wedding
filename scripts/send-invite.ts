import { Resend } from "resend";
import * as fs from "fs";
import { google } from "googleapis";

const envLines = fs.readFileSync(".env.local", "utf-8").split(/\r?\n/);
for (const line of envLines) {
    const match = line.match(/^([^=]+)=(.*)$/);
    if (match) {
        let v = match[2].replace(/^[''''']|[''''']$/g, "");
        process.env[match[1]] = v;
    }
}

const [,, firstName, email, slugArg] = process.argv;

if (!firstName || !email) {
    console.error("Usage: npx tsx scripts/send-invite.ts <firstName> <email> [slug]");
    process.exit(1);
}

import { buildInviteHtml } from "../lib/invite";

async function getPartyData(slug: string) {
    const raw = process.env.GOOGLE_SERVICE_ACCOUNT_JSON!;
    const sheetId = process.env.GUEST_SHEET_ID!;
    const auth = new google.auth.GoogleAuth({ credentials: JSON.parse(raw), scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"] });
    const sheets = google.sheets({ version: "v4", auth });
    const res = await sheets.spreadsheets.values.get({ spreadsheetId: sheetId, range: "A:Z" });
    const rows = res.data.values ?? [];
    if (rows.length === 0) return null;

    const norm = (h: string) => h.trim().toLowerCase().replace(/[\s_]/g, "");
    const headers = rows[0].map(norm);
    const iSlug = headers.indexOf("slug");
    const iEnvelope = headers.indexOf("envelopename");
    const personCols: Array<{ first: number; last: number }> = [];
    const i1f = headers.findIndex((h) => h === "firstname");
    const i1l = headers.findIndex((h) => h === "lastname");
    if (i1f >= 0 && i1l >= 0) personCols.push({ first: i1f, last: i1l });
    for (let n = 2; n <= 4; n++) {
        const f = headers.findIndex((h) => h === `firstname${n}`);
        const l = headers.findIndex((h) => h === `lastname${n}`);
        if (f >= 0 && l >= 0) personCols.push({ first: f, last: l });
    }

    const row = rows.slice(1).find((r) => String(r[iSlug] ?? "").trim().toLowerCase() === slug.toLowerCase());
    if (!row) return null;

    const envelopeName = iEnvelope >= 0 ? String(row[iEnvelope] ?? "").trim() : undefined;
    const members = personCols
        .map(({ first, last }) => ({ firstName: String(row[first] ?? "").trim(), lastName: String(row[last] ?? "").trim() }))
        .filter((m) => m.firstName || m.lastName);

    return { envelopeName, members };
}

async function main() {
    let html: string;
    if (slugArg) {
        const partyData = await getPartyData(slugArg);
        if (partyData) {
            html = buildInviteHtml(partyData);
        } else {
            html = buildInviteHtml({ members: [{ firstName, lastName: "" }] });
        }
    } else {
        html = buildInviteHtml({ members: [{ firstName, lastName: "" }] });
    }

    const resend = new Resend(process.env.RESEND_API_KEY);
    const from = process.env.RESEND_FROM_EMAIL
        ? `Vishal & Hanna <${process.env.RESEND_FROM_EMAIL}>`
        : "onboarding@resend.dev";

    const { data, error } = await resend.emails.send({
        from,
        to: email,
        subject: "You're Invited – Vishal & Hanna",
        html,
    });

    if (error) {
        console.error("Failed to send:", error);
        process.exit(1);
    }

    console.log(`✓ Sent to ${firstName} <${email}> (id: ${data?.id})`);
}

main();
