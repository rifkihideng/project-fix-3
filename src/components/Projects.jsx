import { ArrowUpRight } from 'lucide-react';
import { useLang } from '../i18n.jsx';
import { TechIcon } from './icons.jsx';
import TiltCard from './TiltCard.jsx';

export default function Projects() {
  const { t } = useLang();
  const isOddCount = t.projects.length % 2 === 1;
  return (
    <div className="grid auto-rows-fr gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {t.projects.map((project, index) => (
        <TiltCard
          key={project.name}
          as={project.link ? 'a' : 'div'}
          {...(project.link ? { href: project.link, target: '_blank', rel: 'noreferrer' } : {})}
          className={`card-hover group flex h-full flex-col rounded-xl border border-line bg-card p-5 ${
            isOddCount && index === t.projects.length - 1
              ? 'sm:col-span-2 lg:col-span-1'
              : ''
          }`}
        >
            <div className="flex items-start justify-between gap-3">
              <h3 className="min-w-0 font-semibold">{project.name}</h3>
              <span className="flex shrink-0 items-center gap-1.5 text-xs text-muted">
                {project.year}
                {project.link && (
                  <ArrowUpRight
                    size={14}
                    className="transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-foreground"
                  />
                )}
              </span>
            </div>
            <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">
              {project.description}
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {project.tech.map((tech) => (
                <span
                  key={tech}
                  className="flex items-center gap-1.5 rounded-full border border-line bg-background px-2.5 py-1 text-xs text-muted"
                >
                  <TechIcon name={tech} size={12} spin />
                  {tech}
                </span>
              ))}
            </div>
        </TiltCard>
      ))}
    </div>
  );
}
