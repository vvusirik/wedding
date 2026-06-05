"use client";

import Image from "next/image";
import { useState, useEffect, useCallback } from "react";
import styles from "./page.module.css";

const photos = [
  { src: "/images/gallery/proposal-1.jpg", alt: "Proposal" },
  { src: "/images/gallery/proposal-2.jpg", alt: "Proposal" },
  { src: "/images/gallery/proposal-3.jpg", alt: "Proposal" },
  { src: "/images/gallery/engagement-1.jpg", alt: "Engagement" },
  { src: "/images/gallery/rome-1.jpg", alt: "Rome" },
  { src: "/images/gallery/rome-2.jpg", alt: "Rome" },
  { src: "/images/gallery/rome-3.jpg", alt: "Rome" },
  { src: "/images/gallery/rome-4.jpg", alt: "Rome" },
];

const featuredPhotos = photos.filter((p) => p.alt === "Proposal").slice(0, 2);
const otherPhotos = photos.filter((p) => !featuredPhotos.includes(p));

export default function GalleryPage() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const close = useCallback(() => setActiveIndex(null), []);
  const prev = useCallback(
    () => setActiveIndex((i) => (i !== null ? (i - 1 + photos.length) % photos.length : null)),
    []
  );
  const next = useCallback(
    () => setActiveIndex((i) => (i !== null ? (i + 1) % photos.length : null)),
    []
  );

  useEffect(() => {
    if (activeIndex === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") prev();
      else if (e.key === "ArrowRight") next();
      else if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [activeIndex, prev, next, close]);

  useEffect(() => {
    document.body.style.overflow = activeIndex !== null ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [activeIndex]);

  return (
    <div className={styles.background}><div className={styles.page}>
      <div className={styles.featured}>
        {featuredPhotos.map((photo) => {
          const i = photos.indexOf(photo);
          return (
            <div key={photo.src} className={`${styles.item} ${styles.featuredItem}`} onClick={() => setActiveIndex(i)}>
              <div className={styles.imageWrap}>
                <Image
                  src={photo.src}
                  alt={photo.alt}
                  width={800}
                  height={600}
                  sizes="(max-width: 640px) 100vw, 50vw"
                  className={styles.image}
                />
              </div>
            </div>
          );
        })}
      </div>

      <div className={styles.grid}>
        {otherPhotos.map((photo) => {
          const i = photos.indexOf(photo);
          return (
            <div key={photo.src} className={styles.item} onClick={() => setActiveIndex(i)}>
              <div className={styles.imageWrap}>
                <Image
                  src={photo.src}
                  alt={photo.alt}
                  width={800}
                  height={600}
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className={styles.image}
                />
              </div>
            </div>
          );
        })}
      </div>

      {activeIndex !== null && (
        <div className={styles.lightbox} onClick={close}>
          <button className={styles.close} onClick={close} aria-label="Close">
            ×
          </button>
          <button
            className={`${styles.nav} ${styles.navPrev}`}
            onClick={(e) => { e.stopPropagation(); prev(); }}
            aria-label="Previous photo"
          >
            ‹
          </button>
          <div className={styles.lightboxContent} onClick={(e) => e.stopPropagation()}>
            <Image
              src={photos[activeIndex].src}
              alt={photos[activeIndex].alt}
              width={1600}
              height={1200}
              style={{ maxWidth: "90vw", maxHeight: "85vh", width: "auto", height: "auto" }}
              priority
            />
          </div>
          <button
            className={`${styles.nav} ${styles.navNext}`}
            onClick={(e) => { e.stopPropagation(); next(); }}
            aria-label="Next photo"
          >
            ›
          </button>
          <div className={styles.counter}>
            {activeIndex + 1} / {photos.length}
          </div>
        </div>
      )}
    </div></div>
  );
}
