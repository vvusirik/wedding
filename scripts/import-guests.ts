/**
 * One-time script to import guests from AddressBook.csv into the Guests sheet.
 * Appends rows; does not overwrite existing data.
 *
 * Usage:
 *   npx tsx scripts/import-guests.ts ~/Downloads/wedding_files/AddressBook.csv
 */

import * as fs from "fs";
import * as path from "path";
import { google } from "googleapis";

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------

// Use GUEST_SHEET_RANGE env var to derive sheet name, or fall back to no prefix (first sheet)
const SHEET_NAME = process.env.GUEST_SHEET_RANGE?.includes("!")
    ? process.env.GUEST_SHEET_RANGE.split("!")[0]
    : "";

// ---------------------------------------------------------------------------
// CSV parsing
// ---------------------------------------------------------------------------

function parseCsv(raw: string): Record<string, string>[] {
    const lines = raw.split(/\r?\n/).filter((l) => l.trim());
    if (lines.length < 2) return [];

    const headers = splitCsvLine(lines[0]).map((h) => h.trim());
    return lines.slice(1).map((line) => {
        const vals = splitCsvLine(line);
        const row: Record<string, string> = {};
        headers.forEach((h, i) => {
            row[h] = (vals[i] ?? "").trim();
        });
        return row;
    });
}

function splitCsvLine(line: string): string[] {
    const result: string[] = [];
    let current = "";
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
        const ch = line[i];
        if (ch === '"') {
            inQuotes = !inQuotes;
        } else if (ch === "," && !inQuotes) {
            result.push(current);
            current = "";
        } else {
            current += ch;
        }
    }
    result.push(current);
    return result;
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
    const csvPath = process.argv[2];
    if (!csvPath) {
        console.error("Usage: npx tsx scripts/import-guests.ts <path-to-csv>");
        process.exit(1);
    }

    const raw = fs.readFileSync(path.resolve(csvPath), "utf-8");
    const rows = parseCsv(raw);

    // Filter out "Not On Mailing List" entries and rows with no name
    const guests = rows.filter((r) => {
        const status = r["The Wedding of Hanna and Vishal"] ?? "";
        if (status === "Not On Mailing List") return false;
        const firstName = r["First Name"] ?? "";
        const lastName = r["Last Name"] ?? "";
        if (!firstName && !lastName) return false;
        return true;
    });

    console.log(`Found ${guests.length} guests to import (filtered from ${rows.length} rows)`);

    // ---------------------------------------------------------------------------
    // Connect to Sheets
    // ---------------------------------------------------------------------------
    const raw_env = process.env.GOOGLE_SERVICE_ACCOUNT_JSON;
    const sheetId = process.env.GUEST_SHEET_ID;
    if (!raw_env) throw new Error("GOOGLE_SERVICE_ACCOUNT_JSON not set");
    if (!sheetId) throw new Error("GUEST_SHEET_ID not set");

    const auth = new google.auth.GoogleAuth({
        credentials: JSON.parse(raw_env),
        scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });
    const sheets = google.sheets({ version: "v4", auth });

    // Read existing headers to find column positions
    const headerRes = await sheets.spreadsheets.values.get({
        spreadsheetId: sheetId,
        range: `${SHEET_NAME ? SHEET_NAME + "!" : ""}1:1`,
    });
    const existingHeaders = (headerRes.data.values?.[0] ?? []).map((h: string) =>
        h.trim().toLowerCase(),
    );
    console.log("Existing headers:", existingHeaders);

    // Ensure email column exists — add it if not
    let emailColIdx = existingHeaders.indexOf("email");
    if (emailColIdx < 0) {
        emailColIdx = existingHeaders.length;
        const colLetter = String.fromCharCode(65 + emailColIdx);
        await sheets.spreadsheets.values.update({
            spreadsheetId: sheetId,
            range: `${SHEET_NAME ? SHEET_NAME + "!" : ""}${colLetter}1`,
            valueInputOption: "USER_ENTERED",
            requestBody: { values: [["email"]] },
        });
        console.log(`Added 'email' header at column ${colLetter}`);
        existingHeaders.push("email");
    }

    const iFirst = existingHeaders.findIndex((h) => h.replace(/[\s_]/g, "") === "firstname");
    const iLast = existingHeaders.findIndex((h) => h.replace(/[\s_]/g, "") === "lastname");
    const iPlusFirst = existingHeaders.findIndex((h) => h.replace(/[\s_]/g, "") === "plusonefirstname");
    const iPlusLast = existingHeaders.findIndex((h) => h.replace(/[\s_]/g, "") === "plusonelastname");
    const iTags = existingHeaders.indexOf("tags");
    const iSlug = existingHeaders.indexOf("slug");
    const iEmail = existingHeaders.indexOf("email");

    const numCols = existingHeaders.length;

    // Parse first linked contact into first/last name
    function parsePlusOne(linked: string): { first: string; last: string } {
        if (!linked.trim()) return { first: "", last: "" };
        // Take first entry before ";"
        const first = linked.split(";")[0].trim();
        // Strip email in "<...>"
        const name = first.replace(/<[^>]*>/g, "").trim();
        const parts = name.split(/\s+/);
        return { first: parts[0] ?? "", last: parts.slice(1).join(" ") };
    }

    // Build rows aligned to existing columns
    const appendRows = guests.map((g) => {
        const row = Array(numCols).fill("");
        if (iFirst >= 0) row[iFirst] = g["First Name"] ?? "";
        if (iLast >= 0) row[iLast] = g["Last Name"] ?? "";
        if (iTags >= 0) row[iTags] = "";
        if (iSlug >= 0) row[iSlug] = "";
        if (iEmail >= 0) row[iEmail] = g["Email"] ?? "";
        const plusOne = parsePlusOne(g["Linked Contacts"] ?? "");
        if (iPlusFirst >= 0) row[iPlusFirst] = plusOne.first;
        if (iPlusLast >= 0) row[iPlusLast] = plusOne.last;
        return row;
    });

    await sheets.spreadsheets.values.append({
        spreadsheetId: sheetId,
        range: `${SHEET_NAME ? SHEET_NAME + "!" : ""}A:A`,
        valueInputOption: "USER_ENTERED",
        insertDataOption: "INSERT_ROWS",
        requestBody: { values: appendRows },
    });

    console.log(`✓ Imported ${appendRows.length} guests into ${SHEET_NAME} tab`);
}

// Load .env.local
const envPath = path.join(process.cwd(), ".env.local");
if (fs.existsSync(envPath)) {
    const envLines = fs.readFileSync(envPath, "utf-8").split(/\r?\n/);
    for (const line of envLines) {
        const match = line.match(/^([^=]+)=(.*)$/);
        if (match) {
            let val = match[2];
            // Strip surrounding straight or curly quotes
            val = val.replace(/^['"'"']|['"'"']$/g, "");
            process.env[match[1]] = val;
        }
    }
}

main().catch((err) => {
    console.error(err);
    process.exit(1);
});
