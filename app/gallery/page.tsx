import Image from "next/image";
import styles from "./page.module.css";

const photos = [
  { src: "/images/gallery/proposal-1.jpg", alt: "Proposal" },
  { src: "/images/gallery/proposal-2.jpg", alt: "Proposal" },
  { src: "/images/gallery/proposal-3.jpg", alt: "Proposal" },
  { src: "/images/gallery/engagement-1.jpg", alt: "Enagagement" },
  { src: "/images/gallery/rome-1.jpg", alt: "Rome" },
  { src: "/images/gallery/rome-2.jpg", alt: "Rome" },
  { src: "/images/gallery/rome-3.jpg", alt: "Rome" },
  { src: "/images/gallery/rome-4.jpg", alt: "Rome" },
];

export default function GalleryPage() {
  return (
    <div className={styles.page}>
      <h1 className={styles.heading}>Gallery</h1>

      <div className={styles.grid}>
        {photos.map((photo) => (
          <div key={photo.src} className={styles.item}>
            <Image
              src={photo.src}
              alt={photo.alt}
              width={800}
              height={600}
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className={styles.image}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
