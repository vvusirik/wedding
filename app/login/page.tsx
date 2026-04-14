"use client";

import { useState } from "react";
import styles from "./page.module.css";

export default function LoginPage() {
  const [error, setError] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(false);
    const formData = new FormData(e.currentTarget);
    const res = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password: formData.get("password") }),
    });
    const data = await res.json();
    if (data.success) {
      window.location.href = "/";
    } else {
      setError(true);
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <h1 className={styles.heading}>Vishal &amp; Hanna</h1>
        <div className={styles.divider} />
        <form onSubmit={handleSubmit}>
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
