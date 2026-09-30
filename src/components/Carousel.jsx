import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

// Carousel coverflow: kartu aktif di tengah, kartu samping mengecil & memudar.
// Mendukung autoplay, drag/swipe (mouse & sentuh), dan loop mulus ke depan.
export default function Carousel({
  items,
  renderItem,
  itemKey = (item, i) => i,
  interval = 4000,
  className = '',
  cardClassName = '',
  ariaLabel = () => 'slide',
}) {
  const count = items.length;
  const slides = count > 1 ? [...items, items[0]] : items;

  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [instant, setInstant] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);
  const [reduced, setReduced] = useState(false);

  const viewportRef = useRef(null);
  const [center, setCenter] = useState(0);
  const [step, setStep] = useState(0);
  const drag = useRef({ active: false, startX: 0, dx: 0, pointerId: null });

  // Reset posisi saat data (mis. ganti bahasa) berubah.
  useEffect(() => {
    setIndex(0);
  }, [items]);

  useEffect(() => {
    if (typeof window === 'undefined') return undefined;
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduced(mq.matches);
    const onChange = (event) => setReduced(event.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  // Ukur lebar kartu + gap agar kartu aktif selalu presisi di tengah.
  useLayoutEffect(() => {
    const measure = () => {
      const vp = viewportRef.current;
      if (!vp) return;
      const card = vp.querySelector('[data-carousel-card]');
      const track = vp.querySelector('[data-carousel-track]');
      if (!card || !track) return;
      const gap = parseFloat(getComputedStyle(track).gap) || 0;
      const cardWidth = card.getBoundingClientRect().width;
      setStep(cardWidth + gap);
      setCenter(vp.clientWidth / 2 - cardWidth / 2);
    };
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, []);

  const next = () => {
    setInstant(false);
    setIndex((i) => i + 1);
  };
  const prev = () => {
    setInstant(false);
    setIndex((i) => (i - 1 + count) % count);
  };

  // Saat mencapai kartu klon di ujung, lompat diam-diam ke kartu 0 (loop mulus).
  useEffect(() => {
    if (index !== count) return undefined;
    const timer = setTimeout(() => {
      setInstant(true);
      setIndex(0);
      requestAnimationFrame(() => requestAnimationFrame(() => setInstant(false)));
    }, 700);
    return () => clearTimeout(timer);
  }, [index, count]);

  // Autoplay.
  useEffect(() => {
    if (count <= 1 || paused || reduced) return undefined;
    const timer = setInterval(next, interval);
    return () => clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [count, paused, reduced, interval]);

  const onPointerDown = (event) => {
    drag.current = { active: true, startX: event.clientX, dx: 0, pointerId: event.pointerId };
    event.currentTarget.setPointerCapture?.(event.pointerId);
    setDragging(true);
    setPaused(true);
  };
  const onPointerMove = (event) => {
    if (!drag.current.active) return;
    drag.current.dx = event.clientX - drag.current.startX;
    setDragOffset(drag.current.dx);
  };
  const endDrag = () => {
    if (!drag.current.active) return;
    drag.current.active = false;
    setDragging(false);
    setDragOffset(0);
    const dx = drag.current.dx;
    if (Math.abs(dx) > 60) {
      if (dx < 0) next();
      else prev();
    }
    setPaused(false);
  };

  const offset = center - index * step + dragOffset;
  const activeDot = ((index % count) + count) % count;

  return (
    <div
      className={className}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div ref={viewportRef} className="relative overflow-hidden">
        <div
          data-carousel-track
          className={`flex touch-pan-y gap-4 ${
            dragging || instant
              ? ''
              : 'transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]'
          }`}
          style={{
            transform: `translateX(${offset}px)`,
            cursor: dragging ? 'grabbing' : 'grab',
          }}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
        >
          {slides.map((item, i) => {
            const isActive = i === index;
            const distance = Math.abs(i - index);
            const near = distance <= 1;
            return (
              <div
                key={i}
                data-carousel-card={i === 0 ? 'true' : undefined}
                aria-hidden={!isActive}
                className={`${cardClassName} flex shrink-0 select-none`}
                style={{
                  opacity: isActive ? 1 : near ? 0.45 : 0,
                  transform: `scale(${isActive ? 1 : 0.9})`,
                  transition: 'opacity 0.6s ease, transform 0.6s ease',
                }}
              >
                {renderItem(item, i)}
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-6 flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          {items.map((item, i) => (
            <button
              key={i}
              type="button"
              onClick={() => {
                setInstant(false);
                setIndex(i);
              }}
              aria-label={ariaLabel(item)}
              className={`relative h-2 overflow-hidden rounded-full transition-all ${
                activeDot === i ? 'w-8 bg-soft' : 'w-2 bg-soft hover:bg-muted'
              }`}
            >
              {activeDot === i && (
                <span
                  key={activeDot}
                  className="carousel-dot-fill absolute inset-y-0 left-0 rounded-full bg-accent"
                  style={{
                    animationDuration: `${interval}ms`,
                    animationPlayState: paused ? 'paused' : 'running',
                  }}
                />
              )}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={prev}
            aria-label="Sebelumnya"
            className="btn-accent-icon"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            type="button"
            onClick={next}
            aria-label="Berikutnya"
            className="btn-accent-icon"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
