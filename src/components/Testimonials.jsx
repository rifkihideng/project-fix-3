import { useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import { useLang } from '../i18n.jsx';

export default function Testimonials() {
  const { t } = useLang();
  const items = t.testimonials;
  const [index, setIndex] = useState(0);
  const touchStartX = useRef(null);

  // Auto-play otomatis setiap 4 detik.
  useEffect(() => {
    if (items.length <= 1) return undefined;
    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % items.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [items.length]);

  const prev = () => setIndex((i) => (i - 1 + items.length) % items.length);
  const next = () => setIndex((i) => (i + 1) % items.length);

  const onTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const onTouchEnd = (e) => {
    if (touchStartX.current == null) return;
    const delta = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(delta) > 40) {
      if (delta < 0) next();
      else prev();
    }
    touchStartX.current = null;
  };

  return (
    <div className="mx-auto max-w-2xl">
      <div
        className="overflow-hidden"
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        <div
          className="flex transition-transform duration-500 ease-out"
          style={{ transform: `translateX(-${index * 100}%)` }}
        >
          {items.map((item) => (
            <figure key={item.name} className="w-full shrink-0 px-1 py-1">
              <div className="card-hover flex h-full flex-col rounded-xl border border-line bg-card p-6">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-accent-soft text-accent">
                  <Quote size={20} />
                </span>
                <blockquote className="mt-4 flex-1 text-base leading-relaxed text-muted">
                  {item.text}
                </blockquote>
                <figcaption className="mt-6 flex items-center gap-3 border-t border-line pt-4">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-soft text-sm font-semibold">
                    {item.name.charAt(0)}
                  </span>
                  <span className="min-w-0">
                    <p className="truncate text-sm font-medium">{item.name}</p>
                    <p className="truncate text-xs text-muted">{item.role}</p>
                  </span>
                </figcaption>
              </div>
            </figure>
          ))}
        </div>
      </div>

      <div className="mt-5 flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          {items.map((item, i) => (
            <button
              key={item.name}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`Tampilkan testimoni ${item.name}`}
              className={`h-2 rounded-full transition-all ${
                i === index ? 'w-6 bg-accent' : 'w-2 bg-soft hover:bg-muted'
              }`}
            />
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
