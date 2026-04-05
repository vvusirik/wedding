export default function Home() {
  return (
    <section className="grid grid-rows-2 min-h-[calc(100vh-4rem)] bg-cream relative overflow-hidden">
      {/* Background image with sepia filter — isolated so filter doesn't affect children */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: "url(/images/hero.jpg)",
          backgroundSize: "cover",
          backgroundPosition: "65% center",
          backgroundRepeat: "no-repeat",
        }}
      />
      {/* Warm sepia overlay to boost text legibility */}
      {/* TODO match fonts to save the date */}
      <div className="absolute inset-0 bg-foreground/60" />

      <div className="relative z-10 text-center px-6 flex flex-col items-center justify-center">
        <h1 className="font-script text-7xl sm:text-9xl text-terracotta leading-tight">
          Hanna &amp; Vishal
        </h1>
        <p className="mt-4 text-2xl sm:text-3xl text-terracotta tracking-widest uppercase">
          are getting married!
        </p>
        <div className="mt-10 w-24 h-px bg-terracotta mx-auto" />
        <div className="font-serif mt-8 flex flex-col items-center gap-1 text-terracotta text-5xl">
          <span>The Bowden in Keller, TX</span>
          <span>October 17, 2026</span>
        </div>
      </div>
    </section>
  );
}
