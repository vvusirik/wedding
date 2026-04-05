export default function Home() {
  return (
    <section
      className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] bg-cream relative"
      // TODO: Replace bg-cream with a background image once provided:
      // style={{ backgroundImage: 'url(/images/hero.jpg)', backgroundSize: 'cover', backgroundPosition: 'center' }}
    >
      {/* Overlay — uncomment when background image is added */}
      {/* <div className="absolute inset-0 bg-black/40" /> */}

      <div className="relative z-10 text-center px-6">
        <h1 className="font-script text-7xl sm:text-9xl text-terracotta leading-tight">
          Hanna &amp; Vishal
        </h1>
        <p className="mt-4 text-2xl sm:text-3xl text-foreground/80 tracking-widest uppercase">
          are getting married!
        </p>
        <div className="mt-8 flex flex-col items-center gap-1 text-taupe text-lg">
          <span>Date · Location</span>
          <span className="text-sm tracking-wide">Details coming soon</span>
        </div>
        <div className="mt-10 w-24 h-px bg-terracotta mx-auto" />
      </div>
    </section>
  );
}
