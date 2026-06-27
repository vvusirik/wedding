import { NextResponse } from "next/server";
import { google } from "googleapis";
import { Resend } from "resend";
import { buildInviteHtml } from "../../../../lib/invite";

function readEnv() {
    const raw = process.env.GOOGLE_SERVICE_ACCOUNT_JSON;
    const sheetId = process.env.GUEST_SHEET_ID;
    if (!raw) throw new Error("GOOGLE_SERVICE_ACCOUNT_JSON not set");
    if (!sheetId) throw new Error("GUEST_SHEET_ID not set");
    return { credentials: JSON.parse(raw), sheetId };
}

export async function POST(request: Request) {
    const { firstName, email, slug, envelopeName, members } = await request.json();
    if (!firstName || !email || !slug) {
        return NextResponse.json({ ok: false, error: "missing fields" }, { status: 400 });
    }

    const html = buildInviteHtml({ envelopeName, members: members ?? [{ firstName, lastName: "" }] });

    const resend = new Resend(process.env.RESEND_API_KEY);
    const from = process.env.RESEND_FROM_EMAIL
        ? `Vishal & Hanna <${process.env.RESEND_FROM_EMAIL}>`
        : "onboarding@resend.dev";

    const { error } = await resend.emails.send({
        from,
        to: email,
        subject: "You're Invited – Vishal & Hanna",
        html,
    });

    if (error) {
        return NextResponse.json({ ok: false, error: String(error) }, { status: 500 });
    }

    // Log to InviteLog sheet
    try {
        const { credentials, sheetId } = readEnv();
        const auth = new google.auth.GoogleAuth({
            credentials,
            scopes: ["https://www.googleapis.com/auth/spreadsheets"],
        });
        const sheets = google.sheets({ version: "v4", auth });

        // Create InviteLog tab if it doesn't exist
        const meta = await sheets.spreadsheets.get({ spreadsheetId: sheetId });
        const hasLog = meta.data.sheets?.some((s) => s.properties?.title === "InviteLog");
        if (!hasLog) {
            await sheets.spreadsheets.batchUpdate({
                spreadsheetId: sheetId,
                requestBody: { requests: [{ addSheet: { properties: { title: "InviteLog" } } }] },
            });
            await sheets.spreadsheets.values.update({
                spreadsheetId: sheetId,
                range: "InviteLog!A1:D1",
                valueInputOption: "USER_ENTERED",
                requestBody: { values: [["timestamp", "slug", "first_name", "email"]] },
            });
        }

        await sheets.spreadsheets.values.append({
            spreadsheetId: sheetId,
            range: "InviteLog!A:D",
            valueInputOption: "USER_ENTERED",
            insertDataOption: "INSERT_ROWS",
            requestBody: { values: [[new Date().toISOString(), slug, firstName, email]] },
        });
    } catch (logErr) {
        console.error("InviteLog write failed:", logErr);
    }

    return NextResponse.json({ ok: true });
}
