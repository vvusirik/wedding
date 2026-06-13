import Image from "next/image";
import { cookies } from "next/headers";
import styles from "./page.module.css";
import { LookbookLink } from "./lookbook-link";

type ScheduleEvent = {
    tag: string;
    title: string;
    time: string;
    location: string;
    description?: string;
    lookbookUrl?: string;
    lookbookLabel?: string;
    mobileIllustration?: { src: string; alt: string };
};

type PanelData = {
    title: string;
    illustration: { src: string; alt: string } | null;
    events: ScheduleEvent[];
};

const morning: PanelData = {
    title: "Morning",
    illustration: { src: "/images/icons/dhol.png", alt: "Dhol illustration" },
    events: [
        {
            tag: "morning",
            title: "Baraat",
            time: "10 AM",
            location: "Entrance",
            description:
                "Help us welcome the groom during Baraat as he rides in with live music and dancing.",
        },
        {
            tag: "morning",
            title: "Indian Ceremony",
            time: "11 AM",
            location: "Ballroom",
            description:
                "The Vusirikala family cordially invites you to join Vishal and Hanna-Mae as they perform Indian wedding rituals under the Mandapam. Muhurtum at 12:21 PM.",
            lookbookUrl: "/images/indian_ceremony_lookbook.png",
            lookbookLabel: "Baraat & Indian Ceremony Attire",
        },
        {
            tag: "morning",
            title: "Lunch",
            time: "1 PM",
            location: "Ballroom",
            description:
                "We will be serving a South Indian vegetarian lunch following the morning ceremony.",
            mobileIllustration: {
                src: "/images/icons/dhol.png",
                alt: "Dhol illustration",
            },
        },
    ],
};

const evening: PanelData = {
    title: "Evening",
    illustration: {
        src: "/images/icons/glasses.png",
        alt: "Glasses illustration",
    },
    events: [
        {
            tag: "evening",
            title: "Jewish Ceremony",
            time: "5 PM",
            location: "Chapel",
            description:
                "The Greenfield family invites you to join Vishal and Hanna for a wedding ceremony under the chuppah. The ceremony includes a sharing of blessings, exchange of rings, and the breaking of the glass.",
        },
        {
            tag: "evening",
            title: "Cocktail Hour",
            time: "6 PM",
            location: "Patio",
            description:
                "Please join us for drinks and hors d'oeuvres immediately following the ceremony. We look forward to mingling and celebrating this joyful moment with you before the evening festivities begin.",
        },
        {
            tag: "evening",
            title: "Reception",
            time: "7 PM",
            location: "Ballroom",
            description:
                "Dance and dine with us! Please join us for dinner, speeches, and special performances as we honor the newlyweds and wrap up the evening with a memorable send-off for Vishal and Hanna-Mae.",
            mobileIllustration: {
                src: "/images/icons/glasses.png",
                alt: "Glasses illustration",
            },
        },
    ],
};

export default async function SchedulePage() {
    const cookieStore = await cookies();
    const guestRaw = cookieStore.get("wedding-guest")?.value;
    const tags: string[] = guestRaw ? (JSON.parse(guestRaw).tags ?? []) : [];

    const allEvents = [
        ...morning.events.filter((e) => tags.includes(e.tag)),
        ...evening.events.filter((e) => tags.includes(e.tag)),
    ];

    const illustrations = [morning, evening]
        .filter((p) => p.illustration && p.events.some((e) => tags.includes(e.tag)))
        .map((p) => p.illustration!);

    return (
        <div className={styles.page}>
            <h1 className={styles.heading}>Schedule</h1>
            <div className={styles.panel}>
                <div className={styles.panelContent}>
                    <h2 className={styles.panelTitle}>October 17, 2026</h2>
                    <div className={styles.eventList}>
                        {allEvents.map((event) => (
                            <div key={`${event.tag}-${event.title}`}>
                                <div className={styles.eventItem}>
                                    <span className={styles.eventTitle}>{event.title}</span>
                                    <p className={styles.eventLocation}>
                                        {event.time} · {event.location}
                                    </p>
                                    {event.description && (
                                        <p className={styles.eventDescription}>
                                            {event.description}
                                        </p>
                                    )}
                                    {event.lookbookUrl && event.lookbookLabel && (
                                        <LookbookLink src={event.lookbookUrl} label={event.lookbookLabel} />
                                    )}
                                </div>
                                {event.mobileIllustration && (
                                    <div className={styles.mobileIllustration}>
                                        <Image
                                            src={event.mobileIllustration.src}
                                            alt={event.mobileIllustration.alt}
                                            width={120}
                                            height={120}
                                            style={{ width: "100%", height: "auto" }}
                                        />
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
                {illustrations.length > 0 && (
                    <div className={styles.illustrationSlot}>
                        {illustrations.map((ill) => (
                            <div key={ill.src} className={styles.illustrationHalf}>
                                <Image
                                    src={ill.src}
                                    alt={ill.alt}
                                    width={300}
                                    height={300}
                                    style={{ width: "100%", height: "auto" }}
                                />
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
