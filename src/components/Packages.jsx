import { useEffect, useRef, useState } from 'react';
import { Check, ChevronLeft, ChevronRight } from 'lucide-react';
import { useLang } from '../i18n.jsx';
import TiltCard from './TiltCard.jsx';

export default function Packages() {
  const { t, lang } = useLang();
  const items = t.packages;
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [step, setStep] = useState(0);
  const trackRef = useRef(null);
  const touchStartX = useRef(null);

  // Ukur lebar satu kartu + gap agar pergeseran tepat.
  useEffect(() => {
    const measure = () => {
      const track = trackRef.current;
      if (!track) return;
      const first = track.querySelector(':scope > *');
      if (!first) return;
      const gap = parseFloat(getComputedStyle(track).gap) || 0;
      setStep(first.getBoundingClientRect().width + gap);
    };
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, []);

  // Auto-slide setiap 4 detik, berhenti saat disentuh/hover.
  useEffect(() => {
    if (items.length <= 1 || paused) return undefined;
    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % items.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [items.length, paused]);

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
    <>
      <div
        className="overflow-hidden"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        <div
          ref={trackRef}
          className="flex gap-4 transition-transform duration-500 ease-out"
          style={{ transform: `translateX(-${index * step}px)` }}
        >
          {items.map((pkg) => {
            const waHref = `https://wa.me/${t.site.whatsapp}?text=${encodeURIComponent(
              lang === 'id'
                ? `Halo, saya tertarik dengan paket ${pkg.name} (${pkg.price}).`
                : `Hi, I'm interested in the ${pkg.name} package (${pkg.price}).`
            )}`;

            return (
              <TiltCard
                key={pkg.name}
                as="div"
                className="card-hover flex w-[280px] shrink-0 flex-col rounded-xl border border-line bg-card p-5 sm:w-[320px]"
              >
                <h3 className="font-semibold">{pkg.name}</h3>
                <p className="mt-1 text-lg font-bold text-accent">{pkg.price}</p>
                <p className="mt-2 text-sm leading-relaxed text-muted">{pkg.description}</p>

                <ul className="mt-4 flex-1 space-y-2">
                  {pkg.features.map((feature) => (
                    <li key={feature} className="flex gap-2 text-sm text-muted">
                      <Check size={14} className="mt-0.5 shrink-0 text-accent" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <a
                  href={waHref}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-accent mt-5"
                >
                  {t.ui.orderPackage}
                </a>
              </TiltCard>
            );
          })}
        </div>
      </div>

      <div className="mt-5 flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          {items.map((pkg, i) => (
            <button
              key={pkg.name}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`Lihat paket ${pkg.name}`}
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

      <p className="mt-4 text-xs leading-relaxed text-muted">{t.ui.packagesNote}</p>
    </>
  );
}
