import { Resend } from "resend";
import * as fs from "fs";

const envLines = fs.readFileSync(".env.local", "utf-8").split(/\r?\n/);
for (const line of envLines) {
    const match = line.match(/^([^=]+)=(.*)$/);
    if (match) {
        let v = match[2].replace(/^[''''']|[''''']$/g, "");
        process.env[match[1]] = v;
    }
}

const [,, firstName, email] = process.argv;

if (!firstName || !email) {
    console.error("Usage: npx tsx scripts/send-invite.ts <firstName> <email>");
    process.exit(1);
}

const template = fs.readFileSync("emails/invitation.html", "utf-8");
const websiteUrl = "https://vishalandhanna.com";

const html = template
    .replace(/\{\{FIRST_NAME\}\}/g, firstName)
    .replace(/\{\{WEBSITE_URL\}\}/g, websiteUrl);

const resend = new Resend(process.env.RESEND_API_KEY);
const from = process.env.RESEND_FROM_EMAIL
    ? `Vishal & Hanna <${process.env.RESEND_FROM_EMAIL}>`
    : "onboarding@resend.dev";

async function main() {
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
