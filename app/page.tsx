import styles from "./page.module.css";

export default function Home() {
  return (
    <section className={styles.hero}>
      {/* Background image — isolated so filter doesn't affect children */}
      <div className={styles.heroBg} />
      {/* Warm overlay to boost text legibility */}
      {/* TODO match fonts to save the date */}
      <div className={styles.heroOverlay} />
      <div className={styles.heroContent}>
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
