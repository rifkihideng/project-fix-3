// src/components/HeroVideoBackground.jsx
// Background video full-page (fixed) — video + noise + gradient overlay.
// Diambil dari PrismaHero, dipakai sebagai lapisan background seluruh halaman.
export default function HeroVideoBackground({ src }) {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden="true">
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 h-full w-full object-cover"
        src={src}
      />
      {/* Scrim gelap agar video tidak menabrak teks di atasnya. */}
      <div className="pointer-events-none absolute inset-0 bg-black/60" />
      <div className="noise-overlay pointer-events-none absolute inset-0 opacity-40 mix-blend-overlay" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/70" />
    </div>
  );
}
