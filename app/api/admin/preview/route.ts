import * as fs from "fs";
import * as path from "path";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const firstName = searchParams.get("firstName") ?? "Guest";

    const template = fs.readFileSync(path.join(process.cwd(), "emails/invitation.html"), "utf-8");
    const html = template
        .replace(/\{\{FIRST_NAME\}\}/g, firstName)
        .replace(/\{\{WEBSITE_URL\}\}/g, "https://vishalandhanna.com");

    return new Response(html, { headers: { "Content-Type": "text/html" } });
}
