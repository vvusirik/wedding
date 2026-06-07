import { NextResponse } from "next/server";
import { getWritableSheetsClient, lookupParty } from "../../../lib/guests";
import { sendRsvpConfirmation } from "../../../lib/email";

const RSVP_SHEET_NAME = "RSVPs";

type SubmittedMember = {
    firstName: string;
    lastName: string;
    attending: boolean;
    eventsAttending: string[];
};

type Body = {
    slug: string;
    email: string;
    dietaryNotes: string;
    songRequest: string;
    message: string;
    members: SubmittedMember[];
};

function isString(x: unknown): x is string {
    return typeof x === "string";
}

function validate(body: unknown): Body | string {
    if (!body || typeof body !== "object") return "invalid body";
    const b = body as Record<string, unknown>;
    if (!isString(b.slug) || !b.slug.trim()) return "missing slug";
    if (!isString(b.email)) return "missing email";
    if (!isString(b.dietaryNotes)) return "missing dietaryNotes";
    if (!isString(b.songRequest)) return "missing songRequest";
    if (!isString(b.message)) return "missing message";
    if (!Array.isArray(b.members) || b.members.length === 0) return "missing members";
    for (const m of b.members) {
        if (!m || typeof m !== "object") return "invalid member";
        const mm = m as Record<string, unknown>;
        if (!isString(mm.firstName) || !isString(mm.lastName)) return "member name missing";
        if (typeof mm.attending !== "boolean") return "member.attending must be boolean";
        if (!Array.isArray(mm.eventsAttending) || !mm.eventsAttending.every(isString))
            return "member.eventsAttending must be string[]";
    }
    return body as Body;
}

export async function POST(request: Request) {
    let parsed: unknown;
    try {
        parsed = await request.json();
    } catch {
        return NextResponse.json({ ok: false, error: "invalid json" }, { status: 400 });
    }

    const validated = validate(parsed);
    if (typeof validated === "string") {
        return NextResponse.json({ ok: false, error: validated }, { status: 400 });
    }
    const body = validated;

    const slug = body.slug.trim().toLowerCase();
    const party = await lookupParty(slug);
    if (party.length === 0) {
        return NextResponse.json({ ok: false, error: "unknown party" }, { status: 404 });
    }

    const partyKeys = new Set(
        party.map((g) => `${g.firstName.toLowerCase()}|${g.lastName.toLowerCase()}`),
    );
    for (const m of body.members) {
        const key = `${m.firstName.toLowerCase()}|${m.lastName.toLowerCase()}`;
        if (!partyKeys.has(key)) {
            return NextResponse.json(
                { ok: false, error: `member ${m.firstName} ${m.lastName} not in party` },
                { status: 400 },
            );
        }
    }

    const timestamp = new Date().toISOString();
    const rows = body.members.map((m) => [
        timestamp,
        slug,
        m.firstName,
        m.lastName,
        m.attending ? "yes" : "no",
        m.eventsAttending.join(", "),
        body.dietaryNotes,
        body.songRequest,
        body.email,
        body.message,
    ]);

    try {
        const { sheets, spreadsheetId } = await getWritableSheetsClient();
        await sheets.spreadsheets.values.append({
            spreadsheetId,
            range: `${RSVP_SHEET_NAME}!A:J`,
            valueInputOption: "USER_ENTERED",
            insertDataOption: "INSERT_ROWS",
            requestBody: { values: rows },
        });
    } catch (err) {
        console.error("rsvp append failed:", err);
        const message = err instanceof Error ? err.message : "sheets write failed";
        return NextResponse.json({ ok: false, error: message }, { status: 500 });
    }

    const accepted = body.members.some((m) => m.attending);
    await sendRsvpConfirmation({
        to: body.email,
        partyNames: body.members.map((m) => m.firstName),
        accepted,
        members: body.members,
        dietaryNotes: body.dietaryNotes,
        songRequest: body.songRequest,
    });

    return NextResponse.json({ ok: true, count: rows.length });
}
