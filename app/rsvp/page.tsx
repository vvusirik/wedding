import Image from "next/image";
import styles from "./page.module.css";

export default function RsvpPage() {
    return (
        <div className={styles.page}>
            <h1 className={styles.heading}>Responde Sil Vous Plait</h1>
            <div className={styles.envelopeWrap}>
                <a
                    href="https://withjoy.com/hanna-and-vishal/rsvp"
                    className={styles.envelopeLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="RSVP"
                >
                    <Image
                        src="/images/envelope.png"
                        alt=""
                        width={800}
                        height={494}
                        className={styles.envelope}
                    />
                </a>
            </div>
            <p className={styles.reminder}>Please RSVP by July 1st.</p>
        </div>
    );
}
