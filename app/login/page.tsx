"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import styles from "./page.module.css";

type AnimState =
  | "idle"
  | "card-out"
  | "images-in"
  | "images-hold"
  | "images-out";

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState(false);
  const [animState, setAnimState] = useState<AnimState>("idle");
  const [imagesSlid, setImagesSlid] = useState(false);

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
      setAnimState("card-out");
    } else {
      setError(true);
    }
  }

  // Advance animation stages
  useEffect(() => {
    if (animState === "card-out") {
      const t = setTimeout(() => setAnimState("images-in"), 300);
      return () => clearTimeout(t);
    }
    if (animState === "images-in") {
      // tiny delay so overlay renders before we trigger the CSS transition
      const slide = setTimeout(() => setImagesSlid(true), 20);
      const next = setTimeout(() => setAnimState("images-hold"), 620);
      return () => {
        clearTimeout(slide);
        clearTimeout(next);
      };
    }
    if (animState === "images-hold") {
      const t = setTimeout(() => setAnimState("images-out"), 500);
      return () => clearTimeout(t);
    }
    if (animState === "images-out") {
      const t = setTimeout(() => {
        window.location.href = "/";
      }, 400);
      return () => clearTimeout(t);
    }
  }, [animState, router]);

  const showOverlay =
    animState === "images-in" ||
    animState === "images-hold" ||
    animState === "images-out";

  return (
    <div className={styles.page}>
      {/* Login card — fades out on success */}
      <div
        className={`${styles.card} ${animState !== "idle" ? styles.cardFadeOut : ""}`}
      >
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

      {/* Animation overlay */}
      {showOverlay && (
        <div
          className={`${styles.animOverlay} ${animState === "images-out" ? styles.animOverlayFadeOut : ""}`}
        >
          <div
            className={`${styles.imageRow} ${imagesSlid ? styles.imagesVisible : ""}`}
          >
            <img
              src="/images/groom-profile.png"
              className={styles.groomImage}
              alt="Groom"
            />
            <img
              src="/images/bride-profile.png"
              className={styles.brideImage}
              alt="Bride"
            />
          </div>
        </div>
      )}
    </div>
  );
}

