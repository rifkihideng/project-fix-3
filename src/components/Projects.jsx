import { ArrowUpRight } from 'lucide-react';
import { useLang } from '../i18n.jsx';
import { TechIcon } from './icons.jsx';
import Carousel from './Carousel.jsx';

export default function Projects() {
  const { t } = useLang();

  return (
    <Carousel
      items={t.projects}
      itemKey={(item) => item.name}
      interval={6000}
      cardClassName="w-[min(100%,36rem)]"
      ariaLabel={(item) => item.name}
      renderItem={(project) => (
        <a
          href={project.link}
          target="_blank"
          rel="noreferrer"
          className="card-hover group flex h-full w-full flex-col rounded-xl border border-line bg-card p-6"
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
        </a>
      )}
    />
  );
}
