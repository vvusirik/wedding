import { buildInviteHtml } from "../../../../lib/invite";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const firstName = searchParams.get("firstName") ?? "Guest";
    const envelopeName = searchParams.get("envelopeName") ?? undefined;

    const html = buildInviteHtml({ envelopeName, members: [{ firstName, lastName: "" }] });
    return new Response(html, { headers: { "Content-Type": "text/html" } });
}
