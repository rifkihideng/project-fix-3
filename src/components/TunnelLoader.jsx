import { useEffect, useRef, useState } from 'react';
import {
  animate,
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from 'framer-motion';
import { useLang } from '../i18n.jsx';

const SPRING_CONFIG = { stiffness: 60, damping: 25, mass: 0.5 };

// Palet gradasi mengikuti aksen situs (amber → pink → violet).
const CARD_GRADIENTS = [
  'linear-gradient(135deg, #f59e0b, #ec4899)',
  'linear-gradient(135deg, #ec4899, #8b5cf6)',
  'linear-gradient(135deg, #8b5cf6, #f59e0b)',
  'linear-gradient(135deg, #f59e0b, #8b5cf6)',
  'linear-gradient(135deg, #ec4899, #f59e0b)',
  'linear-gradient(135deg, #8b5cf6, #ec4899)',
  'linear-gradient(135deg, #f59e0b, #d946ef)',
  'linear-gradient(135deg, #d946ef, #8b5cf6)',
  'linear-gradient(135deg, #8b5cf6, #f59e0b)',
];

// Huruf inisial nama untuk tiap kartu.
const CARD_LABELS = ['R', 'I', 'F', 'K', 'I', 'A', 'R', 'D', 'I'];

function useCameraParallax(enabled) {
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const x = useSpring(rawX, SPRING_CONFIG);
  const y = useSpring(rawY, SPRING_CONFIG);

  useEffect(() => {
    if (!enabled) return undefined;
    const onMove = (event) => {
      rawX.set((event.clientX / window.innerWidth - 0.5) * 2);
      rawY.set((event.clientY / window.innerHeight - 0.5) * 2);
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => window.removeEventListener('pointermove', onMove);
  }, [enabled, rawX, rawY]);

  return { x, y };
}

function TunnelCard({ card, progress, pointer, total, stage }) {
  const staggerSpan = 0.55;
  const start = (card.index / total) * (1 - staggerSpan);
  const end = start + staggerSpan;

  const localProgress = useTransform(progress, [start, end], [0, 1]);

  const farZ = stage.isMobile ? -1200 : -1700;
  const nearZ = stage.isMobile ? 350 : 500;
  const z = useTransform(localProgress, [0, 1], [farZ, nearZ]);

  const opacity = useTransform(localProgress, [0, 0.18, 0.82, 0.98], [0, 1, 1, 0]);

  const cardWidth = stage.isMobile
    ? Math.max(130, Math.min(180, stage.width * 0.38))
    : Math.max(180, Math.min(270, stage.width * 0.18));

  const baseX = card.angleCos * (stage.width * card.radiusFactorX);
  const baseY = card.angleSin * (stage.height * card.radiusFactorY);
  const panStrength = stage.isMobile ? 20 : 45;

  const transform = useTransform(
    [z, pointer.x, pointer.y],
    ([currZ, px, py]) => {
      const offsetX = baseX - px * panStrength;
      const offsetY = baseY - py * panStrength;
      return `translate3d(calc(-50% + ${offsetX}px), calc(-50% + ${offsetY}px), ${currZ}px) rotateZ(${card.rotationZ}deg)`;
    }
  );

  return (
    <motion.div
      style={{ width: cardWidth, transform, opacity, zIndex: card.index + 1 }}
      className="absolute left-1/2 top-1/2 aspect-[4/5] select-none will-change-transform"
    >
      <div
        className="relative h-full w-full overflow-hidden rounded-2xl shadow-2xl shadow-black/40 ring-1 ring-black/10 dark:ring-white/15"
        style={{ background: card.gradient }}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="font-display text-6xl font-bold tracking-tighter text-white/95 drop-shadow-md">
            {card.label}
          </span>
        </div>
        <div className="absolute inset-x-0 bottom-0 flex items-center justify-between p-4">
          <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/80">
            {card.monogram}
          </span>
          <span className="font-mono text-[10px] tracking-widest text-white/60">
            {String(card.index + 1).padStart(2, '0')}
          </span>
        </div>
      </div>
    </motion.div>
  );
}

export default function TunnelLoader() {
  const { t } = useLang();
  const monogram = t.site.monogram || 'RA';

  const containerRef = useRef(null);
  const reduce = useReducedMotion();

  // Langsung selesai bila pengguna memilih mengurangi animasi.
  const [phase, setPhase] = useState(() =>
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
      ? 'done'
      : 'loading'
  );

  const [stage, setStage] = useState({ width: 1440, height: 900, isMobile: false });

  useEffect(() => {
    const update = () =>
      setStage({
        width: window.innerWidth,
        height: window.innerHeight,
        isMobile: window.innerWidth < 768,
      });
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  const rawProgress = useMotionValue(0);
  const smoothProgress = useSpring(rawProgress, {
    stiffness: 80,
    damping: 30,
    restDelta: 0.0001,
  });

  // Autoplay: progress 0 → 1 lalu fade out.
  useEffect(() => {
    if (reduce) {
      setPhase('done');
      return undefined;
    }
    const controls = animate(rawProgress, 1, {
      duration: 2.4,
      ease: [0.22, 1, 0.36, 1],
      onComplete: () => setPhase('fading'),
    });
    return () => controls.stop();
  }, [reduce, rawProgress]);

  useEffect(() => {
    if (phase !== 'fading') return undefined;
    const timer = setTimeout(() => setPhase('done'), 700);
    return () => clearTimeout(timer);
  }, [phase]);

  const pointer = useCameraParallax(!reduce && phase === 'loading');

  const titleScale = useTransform(smoothProgress, [0, 0.5, 1], [0.7, 1, 1.35]);
  const titleOpacity = useTransform(smoothProgress, [0, 0.12, 0.85, 1], [0.25, 1, 1, 0]);
  const percent = useTransform(smoothProgress, (value) => `${Math.min(100, Math.round(value * 100))}%`);

  const cards = CARD_GRADIENTS.map((gradient, i) => {
    const goldenAngle = i * 137.5 * (Math.PI / 180);
    return {
      gradient,
      monogram,
      label: CARD_LABELS[i % CARD_LABELS.length],
      angleCos: Math.cos(goldenAngle),
      angleSin: Math.sin(goldenAngle),
      radiusFactorX: 0.28 + (i % 3) * 0.08,
      radiusFactorY: 0.26 + (i % 2) * 0.09,
      rotationZ: (i % 2 === 0 ? 1 : -1) * (3 + (i % 5) * 2),
      index: i,
    };
  });

  if (phase === 'done') return null;

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className={`tunnel-loader ${phase === 'fading' ? 'tunnel-loader-hide' : ''}`}
      style={{
        perspective: stage.isMobile ? '900px' : '1200px',
        transformStyle: 'preserve-3d',
      }}
    >
      {/* Latar grid + glow */}
      <div className="tunnel-grid pointer-events-none absolute inset-0" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(245,158,11,0.14)_0%,transparent_70%)]" />

      {/* Cincin pemandu kedalaman */}
      <div className="pointer-events-none absolute h-[48vmin] w-[48vmin] rounded-full border border-accent/20" />
      <div className="pointer-events-none absolute h-[76vmin] w-[76vmin] rounded-full border border-dashed border-line" />

      {/* Teks tengah */}
      <motion.div
        style={{ scale: titleScale, opacity: titleOpacity }}
        className="pointer-events-none absolute inset-0 z-0 flex flex-col items-center justify-center px-6 text-center"
      >
        <p className="mb-4 font-mono text-xs uppercase tracking-[0.4em] text-accent">
          {t.site.name}
        </p>
        <h1 className="bg-gradient-to-b from-accent via-accent to-[#ec4899] bg-clip-text text-6xl font-bold leading-[0.9] tracking-tighter text-transparent sm:text-8xl md:text-9xl">
          {monogram}
        </h1>
      </motion.div>

      {/* Indikator persentase */}
      <motion.div className="absolute inset-x-0 bottom-8 z-20 flex flex-col items-center gap-2">
        <motion.span className="font-mono text-xs uppercase tracking-[0.3em] text-muted">
          {percent}
        </motion.span>
        <div className="h-6 w-px bg-gradient-to-b from-accent to-transparent" />
      </motion.div>

      {/* Bidang 3D untuk kartu */}
      <div className="pointer-events-none absolute inset-0" style={{ transformStyle: 'preserve-3d' }}>
        {cards.map((card) => (
          <TunnelCard
            key={card.index}
            card={card}
            progress={smoothProgress}
            pointer={pointer}
            total={cards.length}
            stage={stage}
          />
        ))}
      </div>
    </div>
  );
}
