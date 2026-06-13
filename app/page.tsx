import styles from "./page.module.css";

export default function Home() {
    return (
        <section className={styles.hero}>
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
        </section>
    );
}
