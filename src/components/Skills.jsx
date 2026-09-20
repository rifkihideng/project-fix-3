import { useEffect, useRef, useState } from 'react';
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

function useCountUp(target, start, duration = 1000) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!start) return undefined;
    let raf;
    const t0 = performance.now();
    const tick = (now) => {
      const progress = Math.min(1, (now - t0) / duration);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(eased * target));
      if (progress < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, start, duration]);

  return value;
}

function SkillBar({ name, level, start, delay }) {
  const value = useCountUp(level, start);

  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between text-sm">
        <span className="flex items-center gap-2 font-medium">
          <SkillIcon name={name} />
          {name}
        </span>
        <span className="tabular-nums text-muted">{value}%</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-soft">
        <div
          className="h-full rounded-full"
          style={{
            width: start ? `${level}%` : '0%',
            background: 'linear-gradient(90deg, #f59e0b, #ec4899)',
            transition: `width 1s ease ${delay}s`,
          }}
        />
      </div>
    </div>
  );
}

export default function Skills() {
  const { t } = useLang();
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node || typeof IntersectionObserver === 'undefined') {
      setVisible(true);
      return undefined;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className="space-y-8">
      {t.skillGroups.map((group) => (
        <div key={group.title}>
          <h3 className="mb-4 text-xs font-semibold uppercase tracking-wider text-muted">
            {group.title}
          </h3>
          <div className="grid gap-x-8 gap-y-4 sm:grid-cols-2">
            {group.skills.map((skill, i) => (
              <SkillBar
                key={skill.name}
                name={skill.name}
                level={skill.level}
                start={visible}
                delay={i * 0.1}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
