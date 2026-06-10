import Image from "next/image";
import { cookies } from "next/headers";
import styles from "./page.module.css";

type ScheduleEvent = {
    tag: string;
    title: string;
    time: string;
    location: string;
    description?: string;
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
            tag: "morning_ceremony",
            title: "Baraat",
            time: "10 AM",
            location: "Entrance",
            description:
                "Kick off the wedding with us! We'll welcome the groom during Baraat as he rides in with live music and dancing.",
        },
        {
            tag: "morning_ceremony",
            title: "Wedding Ceremony",
            time: "11 AM",
            location: "Ballroom",
            description:
                "The Vusirikala family cordially invites you to join Vishal and Hanna-Mae as they perform Indian wedding rituals under the Mandapam.",
        },
        {
            tag: "morning_ceremony",
            title: "Lunch",
            time: "1 PM",
            location: "Main Hall",
            description: "South Indian Vegetarian",
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
            tag: "evening_ceremony",
            title: "Wedding Ceremony",
            time: "5 PM",
            location: "Chapel",
            description:
                "The Greenfield family invites you to join Vishal and Hanna for a Jewish wedding ceremony under the chuppah. The ceremony includes a sharing of blessings, exchange of rings, and the breaking of the glass.",
        },
        {
            tag: "reception",
            title: "Cocktail Hour",
            time: "6 PM",
            location: "Patio",
            description:
                "Please join us for drinks and hors d'oeuvres immediately following the ceremony. We look forward to mingling and celebrating this joyful moment with you before the evening festivities begin.",
        },
        {
            tag: "reception",
            title: "Reception",
            time: "7 PM",
            location: "Ballroom",
            description:
                "Dance and dine with us! Please join us for dinner, speeches, and special performances as we honor the newlyweds and wrap up the evening with a memorable send-off for Vishal and Hanna-Mae.",
        },
    ],
};

function Panel({
    panel,
    variant,
}: {
    panel: PanelData;
    variant: "morning" | "evening";
}) {
    return (
        <div className={`${styles.panel} ${styles[variant]}`}>
            <div className={styles.panelContent}>
                <h2 className={styles.panelTitle}>{panel.title}</h2>
                <div className={styles.eventList}>
                    {panel.events.map((event) => (
                        <div key={event.title} className={styles.eventItem}>
                            <span className={styles.eventTitle}>{event.title}</span>
                            <p className={styles.eventLocation}>
                                {event.time} · {event.location}
                            </p>
                            {event.description && (
                                <p className={styles.eventDescription}>{event.description}</p>
                            )}
                        </div>
                    ))}
                </div>
            </div>
            <div className={styles.illustrationSlot}>
                {panel.illustration && (
                    <Image
                        src={panel.illustration.src}
                        alt={panel.illustration.alt}
                        width={300}
                        height={300}
                        style={{ width: "100%", height: "auto" }}
                    />
                )}
            </div>
        </div>
    );
}

export default async function SchedulePage() {
    const cookieStore = await cookies();
    const guestRaw = cookieStore.get("wedding-guest")?.value;
    const tags: string[] = guestRaw ? (JSON.parse(guestRaw).tags ?? []) : [];

    const visibleMorning = {
        ...morning,
        events: morning.events.filter((e) => tags.includes(e.tag)),
    };
    const visibleEvening = {
        ...evening,
        events: evening.events.filter((e) => tags.includes(e.tag)),
    };

    return (
        <div className={styles.page}>
            <h1 className={styles.heading}>Schedule</h1>
            <div className={styles.panels}>
                {visibleMorning.events.length > 0 && (
                    <Panel panel={visibleMorning} variant="morning" />
                )}
                {visibleEvening.events.length > 0 && (
                    <Panel panel={visibleEvening} variant="evening" />
                )}
            </div>
        </div>
    );
}
