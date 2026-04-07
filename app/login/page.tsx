import { login } from "./actions";
import styles from "./page.module.css";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <h1 className={styles.heading}>Vishal &amp; Hanna</h1>
        <form action={login}>
          <input
            className={styles.input}
            type="password"
            name="password"
            placeholder="Password"
            autoFocus
            autoComplete="current-password"
          />
          <button className={styles.button} type="submit">
            Enter
          </button>
        </form>

        {error && (
          <p className={styles.error}>Incorrect password. Try again.</p>
        )}
      </div>
    </div>
  );
}
