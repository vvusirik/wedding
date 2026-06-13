import Image from "next/image";
import Link from "next/link";
import styles from "./page.module.css";

export default function Home() {
    return (
        <>
            <section className={styles.hero}>
                <div className={styles.heroBg} />
                <div className={styles.heroOverlay} />
                <div className={styles.heroContent}>
                    <p className={styles.heroInvite}>
                        You are warmly invited to the wedding of
                    </p>
                    <h1 className={styles.heroTitle}>Vishal &amp; Hanna</h1>
                    <div className={styles.heroDetails}>
                        <span>The Bowden</span>
                        <span>Keller, TX</span>
                        <span>October 17, 2026</span>
                    </div>
                </div>
                <div className={styles.scrollIndicator} aria-hidden="true">
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="6 9 12 15 18 9" />
                    </svg>
                </div>
            </section>

            <section className={styles.about}>
                <div className={styles.aboutInner}>
                    <div className={styles.aboutPhotoWrap}>
                        <Image
                            src="/images/story.jpg"
                            alt="Vishal and Hanna"
                            width={600}
                            height={800}
                            className={styles.aboutPhoto}
                        />
                    </div>
                    <div className={styles.aboutText}>
                        <p className={styles.aboutBlurb}>
                            We met in high school in Plano, TX and stayed close friends for
                            many years even though we moved to different states. Six years
                            ago, we got a chance to reconnect. Since then, we've been on some
                            adventures, grown together, and called many cities home (San
                            Francisco, Seattle, Philadelphia, New York). We love all these
                            places, but most of all, we're excited to come home to Dallas and
                            celebrate with you!
                        </p>
                        <Link href="/rsvp" className={styles.aboutButton}>
                            Kindly RSVP
                        </Link>
                    </div>
                </div>
            </section>
        </>
    );
}
