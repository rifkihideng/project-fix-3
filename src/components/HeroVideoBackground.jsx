// src/components/HeroVideoBackground.jsx
// Background video untuk Hero — video + noise + gradient overlay.
// Diambil dari PrismaHero, dipakai sebagai lapisan background konten Hero.
export default function HeroVideoBackground({ src }) {
  return (
    <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden" aria-hidden="true">
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 h-full w-full object-cover"
        src={src}
      />
      <div className="noise-overlay pointer-events-none absolute inset-0 opacity-[0.7] mix-blend-overlay" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/60" />
    </div>
  );
}
