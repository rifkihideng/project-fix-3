import { useLang } from '../i18n.jsx';
import TiltCard from './TiltCard.jsx';

export default function Experience() {
  const { t } = useLang();
  return (
    <div className="relative space-y-6 pl-10">
      <div className="absolute bottom-4 left-[19.5px] top-4 w-px bg-line" aria-hidden="true" />
      {t.experience.map((job) => (
        <div key={`${job.company}-${job.period}`} className="relative">
          <span className="absolute -left-[28px] top-2.5 flex h-4 w-4 items-center justify-center rounded-full border border-accent bg-background">
            <span className="h-1.5 w-1.5 rounded-full bg-accent" />
          </span>
          <TiltCard
            as="article"
            className="card-hover rounded-xl border border-line bg-card p-5"
          >
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h3 className="font-semibold">{job.role}</h3>
              <span className="text-sm text-muted">{job.period}</span>
            </div>
            <div className="mt-1 flex items-center gap-2">
              {job.logo && (
                <img
                  src={job.logo}
                  alt={`${job.company} logo`}
                  className="h-6 w-auto object-contain"
                />
              )}
              <p className="text-sm font-medium text-accent">{job.company}</p>
            </div>
            <p className="mt-2 text-sm leading-relaxed text-muted">{job.description}</p>

            {job.points && job.points.length > 0 && (
              <ul className="mt-3 space-y-1.5">
                {job.points.map((point) => (
                  <li key={point} className="flex gap-2 text-sm text-muted">
                    <span className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-accent" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            )}

            {job.tech && job.tech.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {job.tech.map((tech) => (
                  <span
                    key={tech}
                    className="rounded-full border border-line bg-background px-2.5 py-0.5 text-xs text-muted"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            )}
          </TiltCard>
        </div>
      ))}
    </div>
  );
}
