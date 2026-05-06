"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import styles from "./page.module.css";

function LoginForm() {
  const searchParams = useSearchParams();
  const [error, setError] = useState(searchParams.get("error") === "1");

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    const formData = new FormData(e.currentTarget);
    const firstName = (formData.get("firstName") as string).trim();
    const lastName = (formData.get("lastName") as string).trim();
    if (!firstName || !lastName) {
      e.preventDefault();
      setError(true);
    }
    // else: allow native form submission to proceed
  }

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <h1 className={styles.heading}>Vishal &amp; Hanna</h1>
        <div className={styles.divider} />
        <form method="POST" action="/api/login" onSubmit={handleSubmit}>
          <div className={styles.nameRow}>
            <input
              className={`${styles.input} ${styles.inputName}`}
              type="text"
              name="firstName"
              placeholder="First name"
              autoFocus
              autoComplete="given-name"
              required
            />
            <input
              className={`${styles.input} ${styles.inputName}`}
              type="text"
              name="lastName"
              placeholder="Last name"
              autoComplete="family-name"
              required
            />
          </div>
          <input
            className={styles.input}
            type="password"
            name="password"
            placeholder="Password"
            autoComplete="current-password"
            required
          />
          <button className={styles.button} type="submit">
            Enter
          </button>
        </form>
        {error && (
          <p className={styles.error}>We couldn&apos;t find your name or the password was incorrect. Please try again or contact us for help.</p>
        )}
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
