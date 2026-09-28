import { Quote } from 'lucide-react';
import { useLang } from '../i18n.jsx';

export default function Testimonials() {
  const { t } = useLang();
  return (
    <div className="flex flex-wrap justify-center gap-4">
      {t.testimonials.map((item) => (
        <figure
          key={item.name}
          className="card-hover flex w-full flex-col rounded-xl border border-line bg-card p-5 sm:w-[calc(50%-0.5rem)] lg:w-[calc(33.333%-0.667rem)]"
        >
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-accent-soft text-accent">
            <Quote size={18} />
          </span>
          <blockquote className="mt-3 flex-1 text-sm leading-relaxed text-muted">
            {item.text}
          </blockquote>
          <figcaption className="mt-4 flex items-center gap-3 border-t border-line pt-4">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-soft text-sm font-semibold">
              {item.name.charAt(0)}
            </span>
            <span className="min-w-0">
              <p className="truncate text-sm font-medium">{item.name}</p>
              <p className="truncate text-xs text-muted">{item.role}</p>
            </span>
          </figcaption>
        </figure>
      ))}
    </div>
  );
}
