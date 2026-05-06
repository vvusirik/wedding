import Image from "next/image";
import styles from "./page.module.css";

const morning = {
    label: "Morning",
    title: "Morning Ceremony",
    illustration: { src: "/images/icons/haldi2.png", alt: "Haldi illustration" },
    date: "Saturday, October 17, 2026",
    events: [
        {
            title: "Baraat",
            time: "10 AM",
            location: "Entrance",
            description:
                "Kick off the wedding with us in style! We'll welcome the groom during Baraat as he rides in with live music and dancing.",
        },
        {
            title: "Wedding Ceremony",
            time: "11 AM",
            location: "Main Hall",
            description:
                "The Vusirikala family invites you to join as Vishal and Hanna take part in traditional Indian wedding rituals under the Mandaap in the main hall of the Bowden.",
        },
        {
            title: "Lunch",
            time: "1 PM",
            location: "Main Hall",
        },
    ],
};

const evening = {
    label: "Evening",
    title: "Evening Ceremony",
    illustration: null,
    date: "Saturday, October 17, 2026",
    events: [
        {
            title: "Wedding Ceremony",
            time: "5 PM",
            location: "Chapel",
            description:
                "The Greenfield family invites you to join Vishal and Hanna for a Jewish wedding ceremony under the chuppah. The ceremony includes the signing of the ketubah (marriage contract), exchange of rings, and the breaking of the glass.",
        },
        {
            title: "Cocktail Hour",
            time: "6 PM",
            location: "Patio",
            description:
                "Come mingle with us and other guests following the Jewish ceremony! Light snacks and drinks will be provided.",
        },
        {
            title: "Reception",
            time: "7 PM",
            location: "The Bowden",
            description:
                "Dance and dine with us as we end the night with dinner, speeches, a few performances, and a sendoff for Vishal and Hanna!",
        },
    ],
};

function Panel({
    panel,
    variant,
}: {
    panel: typeof morning;
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
                            <p className={styles.eventLocation}>{event.time} · {event.location}</p>
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

export default function SchedulePage() {
    return (
        <div className={styles.page}>
            <h1 className={styles.heading}>Schedule</h1>
            <div className={styles.panels}>
                <Panel panel={morning} variant="morning" />
                <Panel panel={evening} variant="evening" />
            </div>
        </div>
    );
}
