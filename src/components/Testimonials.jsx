import { Quote } from 'lucide-react';
import { useLang } from '../i18n.jsx';
import Carousel from './Carousel.jsx';

export default function Testimonials() {
  const { t } = useLang();

  return (
    <Carousel
      items={t.testimonials}
      itemKey={(item) => item.name}
      cardClassName="w-[min(100%,40rem)]"
      ariaLabel={(item) => `Tampilkan testimoni ${item.name}`}
      renderItem={(item) => (
        <figure className="card-hover flex h-full w-full flex-col rounded-xl border border-line bg-card p-6">
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
        </figure>
      )}
    />
  );
}
