import { Router } from 'lucide-react';
import { useLang } from '../i18n.jsx';
import { TechIcon } from './icons.jsx';

function ToolIcon({ name }) {
  if (name === 'MikroTik') return <Router size={15} className="spin-slow" />;
  return <TechIcon name={name} size={15} spin />;
}

function ToolBadge({ name }) {
  return (
    <span className="flex shrink-0 items-center gap-2 rounded-full border border-line bg-card px-3.5 py-1.5 text-sm text-muted">
      <ToolIcon name={name} />
      {name}
    </span>
  );
}

export default function Tools() {
  const { t } = useLang();
  return (
    <div className="marquee">
      <div className="marquee-track">
        <div className="marquee-group">
          {t.tools.map((tool) => (
            <ToolBadge key={tool} name={tool} />
          ))}
        </div>
        <div className="marquee-group" aria-hidden="true">
          {t.tools.map((tool) => (
            <ToolBadge key={`${tool}-dup`} name={tool} />
          ))}
        </div>
      </div>
    </div>
  );
}
