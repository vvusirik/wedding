import styles from "./page.module.css";

export default function RsvpPage() {
  return (
    <div className={styles.page}>
      <h1 className={styles.heading}>Responde Sil Vous Plait</h1>
      <p className={styles.intro}>
        Please RSVP using the following link by July 1st.
      </p>

      <div className={styles.buttonWrapper}>
        <a href="https://withjoy.com/hanna-and-vishal/rsvp" className={styles.button} target="_blank" rel="noopener noreferrer">
          RSVP
        </a>
      </div>
    </div>
  );
}
