import Image from "next/image";
import { notFound } from "next/navigation";
import { hasExistingRsvp, lookupParty } from "../../../lib/guests";
import styles from "./page.module.css";
import { RsvpForm } from "./rsvp-form";

type PageProps = { params: Promise<{ slug: string }> };

function joinNames(names: string[]): string {
    if (names.length === 0) return "";
    if (names.length === 1) return names[0];
    if (names.length === 2) return `${names[0]} & ${names[1]}`;
    return `${names.slice(0, -1).join(", ")} & ${names[names.length - 1]}`;
}

export default async function RsvpSlugPage({ params }: PageProps) {
    const { slug } = await params;
    const [party, alreadySubmitted] = await Promise.all([
        lookupParty(slug),
        hasExistingRsvp(slug),
    ]);
    if (party.length === 0) notFound();

    const firstNames = party.map((g) => g.firstName);

    return (
        <div className={styles.page}>
            <h1 className={styles.heading}>Hello, {joinNames(firstNames)}</h1>
            <p className={styles.intro}>
                We&rsquo;re so excited to celebrate with you. Please let us know if you
                can make it.
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
                party={party.map((g) => ({
                    firstName: g.firstName,
                    lastName: g.lastName,
                    tags: g.tags,
                }))}
            />
        </div>
    );
}
