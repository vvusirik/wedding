import { Resend } from "resend";
import * as fs from "fs";
import * as path from "path";
import { google } from "googleapis";

// Load .env.local
const envLines = fs.readFileSync(".env.local", "utf-8").split(/\r?\n/);
for (const line of envLines) {
    const match = line.match(/^([^=]+)=(.*)$/);
    if (match) process.env[match[1]] = match[2].replace(/^[''''']|[''''']$/g, "");
}

const DRY_RUN = process.argv.includes("--dry-run");
const ONLY_SLUGS = process.argv
    .filter((a) => !a.startsWith("--") && !a.match(/node|tsx|send-reminder/))
    .map((s) => s.toLowerCase());
const WEBSITE_URL = "https://vishalandhanna.com";
const SUBJECT = "A Reminder from Vishal & Hanna";

const norm = (h: string) => h.trim().toLowerCase().replace(/[\s_]/g, "");

interface Party {
    slug: string;
    email: string;
    greeting: string;
}

async function getDeclinedSlugs(): Promise<Set<string>> {
    const raw = process.env.GOOGLE_SERVICE_ACCOUNT_JSON!;
    const sheetId = process.env.GUEST_SHEET_ID!;
    const auth = new google.auth.GoogleAuth({
        credentials: JSON.parse(raw),
        scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
    });
    const sheets = google.sheets({ version: "v4", auth });
    const res = await sheets.spreadsheets.values.get({ spreadsheetId: sheetId, range: "RSVPs!A:E" });
    const rows = (res.data.values ?? []).slice(1); // skip header

    // Group by slug: track latest timestamp and whether anyone is attending
    const bySlug = new Map<string, { latestTs: string; anyAttending: boolean }>();
    for (const row of rows) {
        const ts = String(row[0] ?? "").trim();
        const slug = String(row[1] ?? "").trim().toLowerCase();
        const attending = String(row[4] ?? "").trim().toLowerCase() === "yes";
        if (!slug) continue;

        const existing = bySlug.get(slug);
        if (!existing || ts > existing.latestTs) {
            bySlug.set(slug, { latestTs: ts, anyAttending: attending });
        } else if (ts === existing.latestTs) {
            bySlug.set(slug, { ...existing, anyAttending: existing.anyAttending || attending });
        }
    }

    const declined = new Set<string>();
    for (const [slug, { anyAttending }] of bySlug) {
        if (!anyAttending) declined.add(slug);
    }
    return declined;
}

async function getParties(): Promise<Party[]> {
    const raw = process.env.GOOGLE_SERVICE_ACCOUNT_JSON!;
    const sheetId = process.env.GUEST_SHEET_ID!;
    const auth = new google.auth.GoogleAuth({
        credentials: JSON.parse(raw),
        scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
    });
    const sheets = google.sheets({ version: "v4", auth });
    const res = await sheets.spreadsheets.values.get({ spreadsheetId: sheetId, range: "A:Z" });
    const rows = res.data.values ?? [];
    if (rows.length === 0) return [];

    const headers = rows[0].map(norm);
    const col = (name: string) => headers.indexOf(name);

    const iSlug = col("slug");
    const iEmail = col("email");
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

    return rows
        .slice(1)
        .map((row): Party | null => {
            const slug = String(row[iSlug] ?? "").trim().toLowerCase();
            const email = String(row[iEmail] ?? "").trim();
            if (!slug || !email) return null;

            const envelopeName = iEnvelope >= 0 ? String(row[iEnvelope] ?? "").trim() : "";
            const members = personCols
                .map(({ first, last }) => ({
                    firstName: String(row[first] ?? "").trim(),
                    lastName: String(row[last] ?? "").trim(),
                }))
                .filter((m) => m.firstName);

            const greeting =
                envelopeName ||
                members.map((m) => m.firstName).join(" & ") ||
                "Guest";

            return { slug, email, greeting };
        })
        .filter((p): p is Party => p !== null);
}

async function logSent(slugs: string[]) {
    const raw = process.env.GOOGLE_SERVICE_ACCOUNT_JSON!;
    const sheetId = process.env.GUEST_SHEET_ID!;
    const auth = new google.auth.GoogleAuth({
        credentials: JSON.parse(raw),
        scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });
    const sheets = google.sheets({ version: "v4", auth });

    // Create ReminderLog tab if needed
    const meta = await sheets.spreadsheets.get({ spreadsheetId: sheetId });
    const hasLog = meta.data.sheets?.some((s) => s.properties?.title === "ReminderLog");
    if (!hasLog) {
        await sheets.spreadsheets.batchUpdate({
            spreadsheetId: sheetId,
            requestBody: { requests: [{ addSheet: { properties: { title: "ReminderLog" } } }] },
        });
        await sheets.spreadsheets.values.update({
            spreadsheetId: sheetId,
            range: "ReminderLog!A1:C1",
            valueInputOption: "USER_ENTERED",
            requestBody: { values: [["timestamp", "slug", "email"]] },
        });
    }

    const ts = new Date().toISOString();
    // We don't have email in scope here, just log slug
    await sheets.spreadsheets.values.append({
        spreadsheetId: sheetId,
        range: "ReminderLog!A:C",
        valueInputOption: "USER_ENTERED",
        insertDataOption: "INSERT_ROWS",
        requestBody: { values: slugs.map((s) => [ts, s, ""]) },
    });
}

async function main() {
    const template = fs.readFileSync(path.join(process.cwd(), "emails/reminder.html"), "utf-8");
    const [allParties, declinedSlugs] = await Promise.all([getParties(), getDeclinedSlugs()]);

    const skipped = allParties.filter((p) => declinedSlugs.has(p.slug));
    let parties = allParties.filter((p) => !declinedSlugs.has(p.slug));
    if (ONLY_SLUGS.length > 0) parties = parties.filter((p) => ONLY_SLUGS.includes(p.slug));

    if (skipped.length > 0) {
        console.log(`Skipping ${skipped.length} declined parties:`);
        for (const p of skipped) console.log(`  ✗ ${p.greeting} <${p.email}>`);
        console.log();
    }

    if (parties.length === 0) {
        console.log("No parties to contact.");
        return;
    }

    console.log(`${DRY_RUN ? "[DRY RUN] " : ""}${parties.length} parties to contact:\n`);

    if (DRY_RUN) {
        const outDir = path.join(process.cwd(), "reminder-preview");
        fs.mkdirSync(outDir, { recursive: true });

        for (const party of parties) {
            const html = template
                .replace(/\{\{GREETING\}\}/g, party.greeting)
                .replace(/\{\{WEBSITE_URL\}\}/g, WEBSITE_URL);
            const file = path.join(outDir, `${party.slug}.html`);
            fs.writeFileSync(file, html);
            console.log(`  ${party.greeting} <${party.email}> → reminder-preview/${party.slug}.html`);
        }

        console.log(`\nPreviews written to reminder-preview/. Open any file in a browser to check.`);
        console.log(`Re-run without --dry-run to send.`);
        return;
    }

    const resend = new Resend(process.env.RESEND_API_KEY);
    const from = process.env.RESEND_FROM_EMAIL
        ? `Vishal & Hanna <${process.env.RESEND_FROM_EMAIL}>`
        : "onboarding@resend.dev";

    const sent: string[] = [];
    const failed: string[] = [];

    for (const party of parties) {
        const html = template
            .replace(/\{\{GREETING\}\}/g, party.greeting)
            .replace(/\{\{WEBSITE_URL\}\}/g, WEBSITE_URL);

        const { data, error } = await resend.emails.send({
            from,
            to: party.email,
            subject: SUBJECT,
            html,
        });

        if (error) {
            console.error(`  ✗ ${party.greeting} <${party.email}>: ${error.message}`);
            failed.push(party.slug);
        } else {
            console.log(`  ✓ ${party.greeting} <${party.email}> (id: ${data?.id})`);
            sent.push(party.slug);
        }
    }

    console.log(`\nDone. ${sent.length} sent, ${failed.length} failed.`);

    if (sent.length > 0) {
        await logSent(sent);
        console.log(`Logged ${sent.length} entries to ReminderLog sheet.`);
    }
}

main();
