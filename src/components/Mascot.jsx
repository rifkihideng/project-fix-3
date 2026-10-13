import { useEffect, useRef, useState } from 'react';
import { Mascot as PageMascot } from 'page-mascot';

const TOUCH_DIRECTIONS = [
  'right',
  'down-right',
  'down',
  'down-left',
  'left',
  'up-left',
  'up',
  'up-right',
];

// Maskot interaktif (page-mascot) di pojok kiri bawah.
// Sheet arah & ekspresi disimpan di public/mascots.
export default function Mascot() {
  const mascotRef = useRef(null);
  const lastUpdateRef = useRef(0);
  const [touchDirection, setTouchDirection] = useState(null);

  useEffect(() => {
    const onTouchMove = (event) => {
      // Batasi pembaruan arah agar kepala tidak berubah terlalu cepat/jittery.
      const now = Date.now();
      if (now - lastUpdateRef.current < 90) return;
      lastUpdateRef.current = now;

      const touch = event.touches[0];
      if (!touch) return;
      const button = mascotRef.current?.querySelector('button');
      if (!button) return;

      const bounds = button.getBoundingClientRect();
      const dx = touch.clientX - (bounds.left + bounds.width / 2);
      const dy = touch.clientY - (bounds.top + bounds.height / 2);
      const distance = Math.hypot(dx, dy);
      const direction =
        distance < 28
          ? 'center'
          : TOUCH_DIRECTIONS[
              (Math.round(Math.atan2(dy, dx) / (Math.PI / 4)) + 8) % 8
            ];

      setTouchDirection((current) =>
        current === direction ? current : direction,
      );
    };

    const reset = () => {
      lastUpdateRef.current = 0;
      setTouchDirection(null);
    };

    window.addEventListener('touchmove', onTouchMove, { passive: true });
    window.addEventListener('touchend', reset);
    window.addEventListener('touchcancel', reset);
    return () => {
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', reset);
      window.removeEventListener('touchcancel', reset);
    };
  }, []);

  return (
    <div
      ref={mascotRef}
      className="mascot"
      data-touch-direction={touchDirection ?? undefined}
    >
      <PageMascot
        directions="/mascots/cap-directions.webp"
        reactions="/mascots/cap-reactions.webp"
        label="mascot"
        size={110}
      />
    </div>
  );
}