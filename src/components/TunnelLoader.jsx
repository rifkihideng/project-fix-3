import { useEffect, useRef, useState } from 'react';
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from 'framer-motion';

const IMAGES = [
  { src: 'https://cdn.21st.dev/assets/mirror/c3/c3fbd2afa140223999a441b32ed986f61d473930002708df805a81532a326aac.jpg', title: 'Chroma I' },
  { src: 'https://cdn.21st.dev/assets/mirror/9d/9d8b2f675a5814476ada3736ce439bcda23c5c389e0ebf9b25d8a0c09f3bbcfe.jpg', title: 'Prism III' },
  { src: 'https://cdn.21st.dev/assets/mirror/8b/8bb738bf2f00d7f7ed3c3ec034adb9938ad38f4be4ac191d632a6a11ad525574.jpg', title: 'Ether IV' },
  { src: 'https://cdn.21st.dev/assets/mirror/ac/ac5ac700b188d7ef16ee9dab868098b59f15c440db3f71d4e8c03262a3287577.jpg', title: 'Quantum V' },
  { src: 'https://cdn.21st.dev/assets/mirror/ef/ef25eff6ce655fba459b3b7e7711524dc92499aa18f6c7dbea9a0fcc56a8f908.jpg', title: 'Nebula VI' },
  { src: 'https://cdn.21st.dev/assets/mirror/f2/f28b370a5dcbf76240f1504579c4b05fc0ff0bb990a42aff8dc2f73a5dc46072.jpg', title: 'Cyber VII' },
  { src: 'https://cdn.21st.dev/assets/mirror/f2/f26a1eac85704dda924820392dedfb72d51d8261d35354f83b35d683617295f3.jpg', title: 'Flux VIII' },
  { src: 'https://cdn.21st.dev/assets/mirror/77/7755d23eaaa0aa5b403343f44afa7a29b2d06d3065fe54c602b14ba01d00f2aa.jpg', title: 'Aether IX' },
  { src: 'https://cdn.21st.dev/assets/mirror/65/657317761fe9058a1d43711b13c543a71eb5199b7a5d9abf4c28479674e39cf7.jpg', title: 'Chroma X' },
];

const TUNNEL_CARDS = IMAGES.map((item, i) => {
  const goldenAngle = i * 137.5 * (Math.PI / 180);
  const radiusFactorX = 0.28 + (i % 3) * 0.08;
  const radiusFactorY = 0.26 + (i % 2) * 0.09;

  return {
    item,
    angleCos: Math.cos(goldenAngle),
    angleSin: Math.sin(goldenAngle),
    radiusFactorX,
    radiusFactorY,
    rotationZ: (i % 2 === 0 ? 1 : -1) * (3 + (i % 5) * 2),
    index: i,
  };
});

const SPRING_CONFIG = { stiffness: 60, damping: 25, mass: 0.5 };

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
      className="pointer-events-auto absolute left-1/2 top-1/2 aspect-[4/5] cursor-pointer select-none will-change-transform"
    >
      <div className="group relative h-full w-full overflow-hidden rounded-2xl bg-neutral-200 shadow-2xl shadow-neutral-950/20 ring-1 ring-black/10 transition-all duration-500 hover:shadow-indigo-500/25 hover:ring-indigo-500/70 dark:bg-neutral-900 dark:shadow-black/90 dark:ring-white/15 dark:hover:ring-indigo-400/70">
        <img
          src={card.item.src}
          alt={card.item.title}
          draggable={false}
          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
        />
        <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/80 via-black/10 to-transparent p-4 sm:p-5">
          <span className="font-mono text-xs uppercase tracking-widest text-white/95 drop-shadow-md sm:text-sm">
            {card.item.title}
          </span>
        </div>
      </div>
    </motion.div>
  );
}

export default function TunnelLoader() {
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

  // Majukan progress secara manual (scroll wheel/trackpad & geser layar sentuh).
  // Saat mencapai ujung (1), kunci dan mulai fade out.
  const finishedRef = useRef(false);
  const advanceRef = useRef(() => {});
  advanceRef.current = (delta) => {
    if (finishedRef.current) return;
    const next = Math.min(1, Math.max(0, rawProgress.get() + delta));
    rawProgress.set(next);
    if (next >= 1) {
      finishedRef.current = true;
      setPhase('fading');
    }
  };

  // Scroll wheel / trackpad (desktop).
  useEffect(() => {
    const el = containerRef.current;
    if (!el || reduce) return undefined;
    const onWheel = (event) => {
      event.preventDefault();
      advanceRef.current(event.deltaY * 0.0008);
    };
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, [reduce]);

  // Geser (swipe) vertikal di layar sentuh.
  useEffect(() => {
    const el = containerRef.current;
    if (!el || reduce) return undefined;
    let lastY = null;
    const onStart = (event) => {
      lastY = event.touches[0]?.clientY ?? null;
    };
    const onMove = (event) => {
      const y = event.touches[0]?.clientY;
      if (lastY == null || y == null) return;
      const deltaY = lastY - y;
      lastY = y;
      advanceRef.current(deltaY * 0.003);
    };
    const onEnd = () => {
      lastY = null;
    };
    el.addEventListener('touchstart', onStart, { passive: true });
    el.addEventListener('touchmove', onMove, { passive: true });
    el.addEventListener('touchend', onEnd);
    el.addEventListener('touchcancel', onEnd);
    return () => {
      el.removeEventListener('touchstart', onStart);
      el.removeEventListener('touchmove', onMove);
      el.removeEventListener('touchend', onEnd);
      el.removeEventListener('touchcancel', onEnd);
    };
  }, [reduce]);

  useEffect(() => {
    if (phase !== 'fading') return undefined;
    const timer = setTimeout(() => setPhase('done'), 700);
    return () => clearTimeout(timer);
  }, [phase]);

  const pointer = useCameraParallax(!reduce && phase === 'loading');

  const titleScale = useTransform(smoothProgress, [0, 0.5, 1], [0.7, 1, 1.35]);
  const titleOpacity = useTransform(smoothProgress, [0, 0.12, 0.85, 1], [0.25, 1, 1, 0]);
  const promptOpacity = useTransform(smoothProgress, [0, 0.12], [1, 0]);

  if (phase === 'done') return null;

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className={`tunnel-loader ${phase === 'fading' ? 'tunnel-loader-hide' : ''} flex select-none items-center justify-center bg-neutral-50 text-neutral-900 dark:bg-neutral-950 dark:text-white`}
      style={{
        perspective: stage.isMobile ? '900px' : '1200px',
        transformStyle: 'preserve-3d',
      }}
    >
      {/* Immersive background grid & glow */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] opacity-70 [background-size:28px_28px] [mask-image:radial-gradient(ellipse_70%_70%_at_50%_50%,#000_60%,transparent_100%)] dark:bg-[radial-gradient(#1e1b4b_1px,transparent_1px)] dark:opacity-65" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.15)_0%,transparent_70%)] dark:bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.2)_0%,transparent_75%)]" />

      {/* Depth ring guides */}
      <div className="pointer-events-none absolute h-[48vmin] w-[48vmin] rounded-full border border-indigo-500/15 dark:border-indigo-400/10" />
      <div className="pointer-events-none absolute h-[76vmin] w-[76vmin] rounded-full border border-dashed border-neutral-300/60 dark:border-white/10" />

      {/* Central anchor typography */}
      <motion.div
        style={{ scale: titleScale, opacity: titleOpacity }}
        className="pointer-events-none z-0 flex max-w-xl flex-col items-center px-6 text-center"
      >
        <p className="mb-4 font-mono text-xs uppercase tracking-[0.4em] text-indigo-600 dark:text-indigo-400">
          Warp Drive Sequence
        </p>
        <h1 className="bg-gradient-to-b from-neutral-950 via-neutral-800 to-neutral-400 bg-clip-text text-5xl font-bold leading-[0.9] tracking-tighter text-transparent dark:from-white dark:via-white dark:to-white/40 sm:text-7xl md:text-8xl">
          INTO THE
          <br />
          ETHER.
        </h1>
        <p className="mt-4 max-w-[36ch] text-sm font-light text-neutral-600 dark:text-neutral-400 sm:text-base">
          Scroll your trackpad or mouse wheel to fly through the spatial 3D corridor.
        </p>
      </motion.div>

      {/* Scroll prompt */}
      <motion.div
        style={{ opacity: promptOpacity }}
        className="pointer-events-none absolute bottom-8 z-20 flex flex-col items-center gap-2 font-mono text-xs uppercase tracking-[0.3em] text-neutral-500 dark:text-neutral-400"
      >
        <span>Scroll to Explore</span>
        <div className="h-6 w-px bg-gradient-to-b from-indigo-500 to-transparent" />
      </motion.div>

      {/* 3D z-space plane */}
      <div className="pointer-events-none absolute inset-0" style={{ transformStyle: 'preserve-3d' }}>
        {TUNNEL_CARDS.map((card) => (
          <TunnelCard
            key={card.index}
            card={card}
            progress={smoothProgress}
            pointer={pointer}
            total={TUNNEL_CARDS.length}
            stage={stage}
          />
        ))}
      </div>
    </div>
  );
}
