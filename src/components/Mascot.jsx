import { useEffect, useRef } from 'react';

// Peta pixel 12 x 16: kucing pixel sederhana.
// '.' = transparan, K = outline, W = wajah, E = rongga mata, P = hidung.
const PALETTE = {
  K: '#1f2430',
  W: '#f7f3ea',
  E: '#ece2d3',
  B: '#1f2430',
  P: '#f472b6',
};

const PIXELS = [
  '............',
  '..K......K..',
  '..KK....KK..',
  '.KWWK..KWWK.',
  'KWWWWKKWWWWK',
  'KWEEEWWEEEWK',
  'KWEEEWWEEEWK',
  'KWEEEPPEEEWK',
  'KWWWWWWWWWWK',
  '.KWWWWWWWWK.',
  '..KWWWWWWK..',
  '...KKKKKK...',
  '..KWWWWWWK..',
  '..KWWWWWWK..',
  '..KWWWWWWK..',
  '..KKKKKKKK..',
];

// Posisi dasar pupil (di tengah rongga mata 3x3).
const LEFT_EYE = { x: 3, y: 6 };
const RIGHT_EYE = { x: 8, y: 6 };

export default function Mascot() {
  const wrapRef = useRef(null);
  const leftPupilRef = useRef(null);
  const rightPupilRef = useRef(null);
  const centerRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (typeof window === 'undefined') return undefined;
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return undefined;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;

    const measure = () => {
      const el = wrapRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      centerRef.current = {
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2,
      };
    };
    measure();

    let raf = 0;
    const onMove = (event) => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const dx = event.clientX - centerRef.current.x;
        const dy = event.clientY - centerRef.current.y;
        const threshold = 24; // zona mati agar pupil tidak bergetar
        const ox = dx > threshold ? 1 : dx < -threshold ? -1 : 0;
        const oy = dy > threshold ? 1 : dy < -threshold ? -1 : 0;
        if (leftPupilRef.current) {
          leftPupilRef.current.setAttribute('transform', `translate(${ox} ${oy})`);
        }
        if (rightPupilRef.current) {
          rightPupilRef.current.setAttribute('transform', `translate(${ox} ${oy})`);
        }
      });
    };

    window.addEventListener('mousemove', onMove, { passive: true });
    window.addEventListener('resize', measure);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('resize', measure);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div ref={wrapRef} className="mascot" aria-hidden="true">
      <svg
        viewBox="0 0 12 16"
        width="48"
        height="64"
        shapeRendering="crispEdges"
        xmlns="http://www.w3.org/2000/svg"
      >
        {PIXELS.map((row, y) =>
          [...row].map((px, x) =>
            px === '.' ? null : (
              <rect key={`${x}-${y}`} x={x} y={y} width={1} height={1} fill={PALETTE[px]} />
            )
          )
        )}
        <rect
          ref={leftPupilRef}
          x={LEFT_EYE.x}
          y={LEFT_EYE.y}
          width={1}
          height={1}
          fill={PALETTE.B}
        />
        <rect
          ref={rightPupilRef}
          x={RIGHT_EYE.x}
          y={RIGHT_EYE.y}
          width={1}
          height={1}
          fill={PALETTE.B}
        />
      </svg>
    </div>
  );
}
