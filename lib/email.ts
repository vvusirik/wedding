import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM = process.env.RESEND_FROM_EMAIL ?? "onboarding@resend.dev";

const EVENT_LABELS: Record<string, string> = {
    morning: "Indian Ceremony",
    evening: "Jewish Ceremony",
    reception: "Reception",
};

const EVENT_META: Record<string, string> = {
    morning:
        "Saturday Oct 17 &nbsp;&middot;&nbsp; 10 AM &nbsp;&middot;&nbsp; Main Hall",
    evening:
        "Saturday Oct 17 &nbsp;&middot;&nbsp; 5 PM &nbsp;&middot;&nbsp; Chapel",
    reception:
        "Saturday Oct 17 &nbsp;&middot;&nbsp; 7 PM &nbsp;&middot;&nbsp; The Bowden",
};

type Member = {
    firstName: string;
    lastName: string;
    attending: boolean;
    eventsAttending: string[];
};

type RsvpEmailData = {
    to: string;
    partyNames: string[];
    accepted: boolean;
    members: Member[];
    dietaryNotes: string;
    songRequest: string;
};

function renderEventRows(members: Member[]): string {
    const eventToNames: Record<string, string[]> = {};
    for (const m of members) {
        for (const ev of m.eventsAttending) {
            if (!eventToNames[ev]) eventToNames[ev] = [];
            eventToNames[ev].push(m.firstName);
        }
    }

    const order = ["morning", "evening", "reception"];
    const rows = order
        .filter((ev) => eventToNames[ev]?.length)
        .map(
            (ev, i, arr) => `
      <tr>
        <td style="padding:12px 0;${i < arr.length - 1 ? "border-bottom:1px solid #f0e8dc;" : ""}">
          <p style="margin:0;font-size:16px;color:#2c2317;">${EVENT_LABELS[ev]}</p>
          <p style="margin:2px 0 0;font-size:13px;color:#7a6e5f;">${EVENT_META[ev]}</p>
        </td>
        <td align="right" style="padding:12px 0;${i < arr.length - 1 ? "border-bottom:1px solid #f0e8dc;" : ""}vertical-align:middle;">
          <span style="font-size:14px;color:#2c2317;">${eventToNames[ev].join(", ")}</span>
        </td>
      </tr>`,
        )
        .join("");

    return rows;
}

function renderOptionalSection(label: string, value: string): string {
    if (!value.trim()) return "";
    return `
      <p style="margin:0 0 12px;font-family:'Cormorant Garamond',Georgia,serif;font-size:13px;font-weight:600;letter-spacing:0.14em;text-transform:uppercase;color:#dd523f;">
        ${label}
      </p>
      <p style="margin:0 0 32px;font-size:16px;color:#2c2317;line-height:1.7;">${value}</p>`;
}

function buildHtml({
    partyNames,
    accepted,
    members,
    dietaryNotes,
    songRequest,
}: RsvpEmailData): string {
    const greeting = partyNames.join(" &amp; ");
    const attending = members.filter((m) => m.attending);

    const bodyContent = accepted
        ? `
      <p style="margin:0 0 24px;font-size:16px;color:#2c2317;line-height:1.7;">
        Dear <strong>${greeting}</strong>,
      </p>
      <p style="margin:0 0 32px;font-size:16px;color:#2c2317;line-height:1.7;">
        Thank you for your RSVP — we're so excited to celebrate with you! Here's a summary of your response.
      </p>

      <p style="margin:0 0 12px;font-family:'Cormorant Garamond',Georgia,serif;font-size:13px;font-weight:600;letter-spacing:0.14em;text-transform:uppercase;color:#dd523f;">
        Events
      </p>
      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:32px;">
        ${renderEventRows(attending)}
      </table>

      ${renderOptionalSection("Dietary Notes", dietaryNotes)}
      ${renderOptionalSection("Song Request", songRequest)}

      <hr style="border:none;border-top:1px solid #d4c4a8;margin:0 0 32px;" />
      <p style="margin:0 0 8px;font-size:16px;color:#2c2317;line-height:1.7;">
        If you need to make any changes, use the link from your invitation to resubmit your RSVP.
      </p>`
        : `
      <p style="margin:0 0 24px;font-size:16px;color:#2c2317;line-height:1.7;">
        Dear <strong>${greeting}</strong>,
      </p>
      <p style="margin:0 0 32px;font-size:16px;color:#2c2317;line-height:1.7;">
        Thank you for letting us know — we'll miss you and hope to see you again soon.
      </p>
      <hr style="border:none;border-top:1px solid #d4c4a8;margin:0 0 32px;" />
      <p style="margin:0 0 8px;font-size:16px;color:#2c2317;line-height:1.7;">
        If your plans change, use the link from your invitation to update your RSVP.
      </p>`;

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1.0" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400&family=Lato:wght@300;400&display=swap" rel="stylesheet" />
</head>
<body style="margin:0;padding:0;background-color:#f5ede2;font-family:'Lato',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#f5ede2;padding:48px 16px;">
    <tr><td align="center">
      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:560px;background-color:#ffffff;border-top:4px solid #dd523f;">
        <tr>
          <td style="padding:48px 48px 0;">
            <p style="margin:0 0 4px;font-family:'Cormorant Garamond',Georgia,serif;font-size:13px;letter-spacing:0.18em;text-transform:uppercase;color:#7a6e5f;">
              Vishal &amp; Hanna
            </p>
            <h1 style="margin:0 0 8px;font-family:'Cormorant Garamond',Georgia,serif;font-size:36px;font-weight:400;color:#2c2317;line-height:1.2;">
              ${accepted ? "We have your RSVP!" : "We'll miss you."}
            </h1>
            <p style="margin:0 0 32px;font-family:'Cormorant Garamond',Georgia,serif;font-style:italic;font-size:18px;color:#7a6e5f;line-height:1.5;">
              October 17, 2026 &nbsp;&middot;&nbsp; The Bowden, Keller TX
            </p>
            <hr style="border:none;border-top:1px solid #d4c4a8;margin:0 0 32px;" />
            ${bodyContent}
            <p style="margin:0 0 48px;font-size:16px;color:#2c2317;line-height:1.7;">
              With love,<br />
              <span style="font-family:'Cormorant Garamond',Georgia,serif;font-size:22px;">Vishal &amp; Hanna</span>
            </p>
          </td>
        </tr>
        <tr>
          <td style="background-color:#2c2317;padding:24px 48px;">
            <p style="margin:0;font-size:12px;color:#d4c4a8;letter-spacing:0.1em;text-transform:uppercase;text-align:center;">
              The Bowden &nbsp;&middot;&nbsp; 1775 Keller Pkwy, Keller TX 76248 &nbsp;&middot;&nbsp; October 17, 2026
            </p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

export async function sendRsvpConfirmation(data: RsvpEmailData): Promise<void> {
    if (!data.to.trim()) return;

    const accepted = data.accepted;
    const subject = accepted
        ? "Your RSVP is confirmed – Vishal & Hanna"
        : "We'll miss you – Vishal & Hanna";

    const html = buildHtml(data);

    const { error } = await resend.emails.send({
        from: FROM,
        to: data.to,
        subject,
        html,
    });

    if (error) {
        // Non-fatal: log but don't block the RSVP response
        console.error("resend error:", error);
    }
}
