// Placeholder photos — replace with real images in /public/gallery/
const placeholderPhotos = Array.from({ length: 12 }, (_, i) => ({
  id: i + 1,
  alt: `Wedding photo ${i + 1}`,
}));

export default function GalleryPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-16">
      <h1 className="font-script text-6xl text-terracotta text-center mb-2">Gallery</h1>
      <div className="w-16 h-px bg-terracotta mx-auto mb-4" />
      <p className="text-center text-taupe mb-12">
        Photos will be added soon. Check back after the wedding!
      </p>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {placeholderPhotos.map((photo) => (
          <div
            key={photo.id}
            className="aspect-square bg-cream rounded-lg flex items-center justify-center text-taupe/60 text-sm border border-cream/60"
            aria-label={photo.alt}
          >
            <span className="font-script text-2xl text-cream/80">♥</span>
          </div>
        ))}
      </div>
    </div>
  );
}
