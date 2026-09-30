import { Braces, Cable, Router, Wifi } from 'lucide-react';
import { useLang } from '../i18n.jsx';
import { TechIcon } from './icons.jsx';

function SkillIcon({ name }) {
  const key = (name || '').toLowerCase();
  if (key.includes('fiber')) return <Cable size={15} className="spin-slow" />;
  if (key.includes('wifi') || key.includes('jaringan')) return <Wifi size={15} className="spin-slow" />;
  if (key.includes('mikrotik')) return <Router size={15} className="spin-slow" />;
  if (key.includes('html')) return <Braces size={15} className="spin-slow" />;
  return <TechIcon name={name} size={15} spin />;
}

export default function Skills() {
  const { t } = useLang();

  return (
    <div className="space-y-8">
      {t.skillGroups.map((group) => (
        <div key={group.title}>
          <h3 className="mb-4 text-xs font-semibold uppercase tracking-wider text-muted">
            {group.title}
          </h3>
          <div className="flex flex-wrap gap-2">
            {group.skills.map((skill) => (
              <span
                key={skill.name}
                className="flex items-center gap-2 rounded-full border border-line bg-card px-3.5 py-1.5 text-sm text-foreground"
              >
                <SkillIcon name={skill.name} />
                {skill.name}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
