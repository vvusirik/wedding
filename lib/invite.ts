import * as fs from "fs";
import * as path from "path";

export function buildInviteHtml({
    envelopeName,
    members,
}: {
    envelopeName?: string;
    members: Array<{ firstName: string; lastName: string }>;
}): string {
    const template = fs.readFileSync(path.join(process.cwd(), "emails/invitation.html"), "utf-8");

    let greeting: string;
    if (envelopeName) {
        greeting = envelopeName;
    } else {
        greeting =
            members
                .map((m) => m.firstName)
                .filter(Boolean)
                .join(" & ") ||
            members[0]?.firstName ||
            "Guest";
    }

    return template
        .replace(/\{\{GREETING\}\}/g, greeting)
        .replace(/\{\{WEBSITE_URL\}\}/g, "https://vishalandhanna.com");
}
