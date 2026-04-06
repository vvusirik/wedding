import styles from "./page.module.css";

export default function RegistryPage() {
  return (
    <div className={styles.page}>
      <h1 className={styles.heading}>Registry</h1>
      <div className={styles.divider} />
      <p className={styles.intro}>
        Your attendance is the greatest gift you could give us! Please refrain
        from bringing physical gifts as we won&rsquo;t be able to take items
        back to New York.
      </p>
      <div className={styles.subdivider} />
      <p className={styles.intro}>
        If you are feeling especially generous and truly insist, you may gift us
        in the Indian tradition of Shagun, an envelope with an odd numbered
        amount of dollars that symbolize good fortune.
      </p>
      {/* TODO: icon */}
    </div>
  );
}
