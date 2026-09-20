import { Quote } from 'lucide-react';
import { useLang } from '../i18n.jsx';

export default function Testimonials() {
  const { t } = useLang();
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {t.testimonials.map((item) => (
        <figure
          key={item.name}
          className="card-hover rounded-xl border border-line bg-card p-5"
        >
          <Quote size={18} className="text-accent" />
          <blockquote className="mt-3 text-sm leading-relaxed text-muted">
            {item.text}
          </blockquote>
          <figcaption className="mt-4">
            <p className="text-sm font-medium">{item.name}</p>
            <p className="text-xs text-muted">{item.role}</p>
          </figcaption>
        </figure>
      ))}
    </div>
  );
}
