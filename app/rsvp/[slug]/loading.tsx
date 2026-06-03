import styles from "./loading.module.css";

export default function RsvpLoading() {
    return (
        <div className={styles.page}>
            <div className={styles.spinner} aria-label="Loading…" />
        </div>
    );
}
