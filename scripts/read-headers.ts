import { google } from "googleapis";
import * as fs from "fs";

const envLines = fs.readFileSync(".env.local", "utf-8").split(/\r?\n/);
for (const line of envLines) {
    const match = line.match(/^([^=]+)=(.*)$/);
    if (match) { let v = match[2].replace(/^['''‘’]|['''‘’]$/g, ""); process.env[match[1]] = v; }
}

async function main() {
    const auth = new google.auth.GoogleAuth({ credentials: JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_JSON!), scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"] });
    const sheets = google.sheets({ version: "v4", auth });
    const res = await sheets.spreadsheets.values.get({ spreadsheetId: process.env.GUEST_SHEET_ID!, range: "1:2" });
    res.data.values?.forEach((row, i) => console.log(`Row ${i}:`, row));
}
main();
