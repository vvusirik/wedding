import styles from './page.module.css';

const placeholderPhotos = Array.from({ length: 12 }, (_, i) => ({
  id: i + 1,
  alt: `Wedding photo ${i + 1}`,
}));

export default function GalleryPage() {
  return (
    <div className={styles.page}>
      <h1 className={styles.heading}>Gallery</h1>
      <div className={styles.divider} />
      <p className={styles.subtitle}>
        Photos will be added soon. Check back after the wedding!
      </p>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {placeholderPhotos.map((photo) => (
          <div
            key={photo.id}
            className={`${styles.placeholder} aspect-square border border-forest/30`}
            aria-label={photo.alt}
          >
            <span className={`${styles.placeholderIcon} text-forest/60`}>♥</span>
          </div>
        ))}
      </div>
    </div>
  );
}
