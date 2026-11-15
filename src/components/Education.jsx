import { useLang } from '../i18n.jsx';
import TiltCard from './TiltCard.jsx';

export default function Education() {
  const { t } = useLang();
  return (
    <div className="relative space-y-6 pl-10">
      <div className="absolute bottom-4 left-[19.5px] top-4 w-px bg-line" aria-hidden="true" />
      {t.education.map((item) => (
        <div key={`${item.school}-${item.period}`} className="relative">
          <span className="absolute -left-[28px] top-2.5 flex h-4 w-4 items-center justify-center rounded-full border border-accent bg-background">
            <span className="h-1.5 w-1.5 rounded-full bg-accent" />
          </span>
          <TiltCard
            as="article"
            className="card-hover rounded-xl border border-line bg-card p-5"
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-3">
                {item.logo && (
                  <img
                    src={item.logo}
                    alt={`${item.school} logo`}
                    loading="lazy"
                    decoding="async"
                    className="h-10 w-10 shrink-0 rounded-md border border-line bg-background object-contain p-0.5"
                  />
                )}
                <h3 className="font-semibold">{item.school}</h3>
              </div>
              <span className="text-sm text-muted">{item.period}</span>
            </div>
            <p className="mt-1 text-sm font-medium text-accent">{item.major}</p>
            {item.description && (
              <p className="mt-2 text-sm leading-relaxed text-muted">{item.description}</p>
            )}
          </TiltCard>
        </div>
      ))}
    </div>
  );
}
