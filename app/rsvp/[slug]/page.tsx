import Image from "next/image";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { hasExistingRsvp, lookupParty } from "../../../lib/guests";
import styles from "./page.module.css";
import { RsvpForm } from "./rsvp-form";

type PageProps = { params: Promise<{ slug: string }> };

export default async function RsvpSlugPage({ params }: PageProps) {
    const { slug } = await params;
    const [party, alreadySubmitted] = await Promise.all([
        lookupParty(slug),
        hasExistingRsvp(slug),
    ]);
    if (party.length === 0) notFound();

    // Put the logged-in guest first if we can identify them
    const cookieStore = await cookies();
    const guestRaw = cookieStore.get("wedding-guest")?.value;
    let loggedInFirst = "";
    let loggedInLast = "";
    if (guestRaw) {
        try {
            const parsed = JSON.parse(guestRaw);
            if (parsed.firstName && parsed.lastName) {
                loggedInFirst = parsed.firstName.trim().toLowerCase();
                loggedInLast = parsed.lastName.trim().toLowerCase();
            }
        } catch { /* fall through */ }
    }
    const loggedInIdx = party.findIndex(
        (g) =>
            g.firstName.toLowerCase() === loggedInFirst &&
            g.lastName.toLowerCase() === loggedInLast,
    );
    const sorted =
        loggedInIdx > 0
            ? [party[loggedInIdx], ...party.filter((_, i) => i !== loggedInIdx)]
            : party;

    return (
        <div className={styles.page}>
            <p className={styles.dear}>Dear</p>
            <h1 className={styles.heading}>
                {sorted.map((g, i) => (
                    <span key={`${g.firstName}-${g.lastName}`}>
                        {i > 0 && <span className={styles.ampersand}>&amp;</span>}
                        <span className={styles.guestName}>{g.firstName} {g.lastName}</span>
                    </span>
                ))}
            </h1>
            <p className={styles.intro}>
                We&rsquo;re excited to celebrate with you!<br />
                Let us know if you can make it.
            </p>
            <div className={styles.envelopeWrap}>
                <Image
                    src="/images/envelope-no-text.png"
                    alt=""
                    width={800}
                    height={494}
                    className={styles.envelope}
                    priority
                />
            </div>
            <RsvpForm
                slug={slug}
                alreadySubmitted={alreadySubmitted}
                party={sorted.map((g) => ({
                    firstName: g.firstName,
                    lastName: g.lastName,
                    tags: g.tags,
                }))}
            />
        </div>
    );
}
