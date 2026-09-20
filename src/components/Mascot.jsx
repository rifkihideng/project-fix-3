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
    let idleTimer = 0;

    const setOffset = (ox, oy) => {
      if (leftPupilRef.current) {
        leftPupilRef.current.setAttribute('transform', `translate(${ox} ${oy})`);
      }
      if (rightPupilRef.current) {
        rightPupilRef.current.setAttribute('transform', `translate(${ox} ${oy})`);
      }
    };

    const lookAt = (clientX, clientY) => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const dx = clientX - centerRef.current.x;
        const dy = clientY - centerRef.current.y;
        const threshold = 24; // zona mati agar pupil tidak bergetar
        const ox = dx > threshold ? 1 : dx < -threshold ? -1 : 0;
        const oy = dy > threshold ? 1 : dy < -threshold ? -1 : 0;
        setOffset(ox, oy);
      });
    };

    const onMouseMove = (event) => lookAt(event.clientX, event.clientY);

    // Di layar sentuh tidak ada kursor, jadi ikuti sentuhan jari.
    const onTouch = (event) => {
      const touch = event.touches && event.touches[0];
      if (touch) lookAt(touch.clientX, touch.clientY);
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('touchstart', onTouch, { passive: true });
    window.addEventListener('touchmove', onTouch, { passive: true });
    window.addEventListener('resize', measure);
    window.addEventListener('orientationchange', measure);

    // Di perangkat sentuh, beri animasi "melirik" agar maskot tetap hidup
    // meski belum disentuh.
    const isTouch = !window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    if (isTouch) {
      const glances = [
        [0, 0],
        [1, 0],
        [0, -1],
        [-1, 0],
        [0, 1],
        [0, 0],
      ];
      let glanceIndex = 0;
      idleTimer = window.setInterval(() => {
        glanceIndex = (glanceIndex + 1) % glances.length;
        setOffset(glances[glanceIndex][0], glances[glanceIndex][1]);
      }, 2800);
    }

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('touchstart', onTouch);
      window.removeEventListener('touchmove', onTouch);
      window.removeEventListener('resize', measure);
      window.removeEventListener('orientationchange', measure);
      if (idleTimer) window.clearInterval(idleTimer);
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
