import { useEffect, useRef } from 'react';

export default function CursorGlow() {
  const ringRef = useRef(null);
  const dotRef = useRef(null);

  useEffect(() => {
    if (typeof window === 'undefined') return undefined;
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return undefined;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;

    let mouseX = -100;
    let mouseY = -100;
    let ringX = -100;
    let ringY = -100;
    let raf = 0;
    let running = false;

    const onMove = (event) => {
      mouseX = event.clientX;
      mouseY = event.clientY;
      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${event.clientX}px, ${event.clientY}px) translate(-50%, -50%)`;
      }
      if (!running) {
        running = true;
        raf = requestAnimationFrame(loop);
      }
    };

    const onOver = (event) => {
      const interactive = event.target.closest('a, button, [role="button"], input, textarea');
      ringRef.current?.classList.toggle('is-hover', Boolean(interactive));
    };

    const loop = () => {
      ringX += (mouseX - ringX) * 0.18;
      ringY += (mouseY - ringY) * 0.18;
      if (ringRef.current) {
        ringRef.current.style.transform = `translate(${ringX}px, ${ringY}px) translate(-50%, -50%)`;
      }
      // Hentikan loop saat ring sudah menempel pada kursor untuk menghemat CPU.
      if (Math.abs(mouseX - ringX) < 0.5 && Math.abs(mouseY - ringY) < 0.5) {
        running = false;
        return;
      }
      raf = requestAnimationFrame(loop);
    };

    window.addEventListener('mousemove', onMove, { passive: true });
    window.addEventListener('mouseover', onOver, { passive: true });

    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseover', onOver);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div aria-hidden="true">
      <div ref={ringRef} className="cursor-ring" style={{ transform: 'translate(-100px, -100px)' }} />
      <div ref={dotRef} className="cursor-dot" style={{ transform: 'translate(-100px, -100px)' }} />
    </div>
  );
}
