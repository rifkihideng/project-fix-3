import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Award,
  Briefcase,
  Copy,
  ExternalLink,
  Home,
  Moon,
  Search,
  Sparkles,
  Sun,
} from 'lucide-react';
import { useLang } from '../i18n.jsx';

function scrollToId(id) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

export default function CommandPalette({ onClose, theme, onToggleTheme }) {
  const { t } = useLang();
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(0);
  const inputRef = useRef(null);
  const listRef = useRef(null);

  const actions = useMemo(() => {
    const github = t.socials.find((s) => s.id === 'github');
    return [
      { id: 'home', title: t.ui.palette.home, icon: Home, run: () => scrollToId('top') },
      { id: 'experience', title: t.ui.nav.experience, icon: Briefcase, run: () => scrollToId('experience') },
      { id: 'projects', title: t.ui.nav.projects, icon: Sparkles, run: () => scrollToId('projects') },
      { id: 'awards', title: t.ui.sections.awards, icon: Award, run: () => scrollToId('awards') },
      { id: 'theme', title: theme === 'dark' ? t.ui.palette.themeToLight : t.ui.palette.themeToDark, icon: theme === 'dark' ? Sun : Moon, run: onToggleTheme },
      { id: 'email', title: t.ui.palette.copyEmail, subtitle: t.site.email, icon: Copy, run: () => navigator.clipboard?.writeText(t.site.email) },
      { id: 'github', title: t.ui.palette.openGithub, subtitle: t.ui.palette.githubProfile, icon: ExternalLink, run: () => window.open(github?.href, '_blank') },
    ];
  }, [theme, onToggleTheme, t]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return actions;
    return actions.filter((action) =>
      `${action.title} ${action.subtitle ?? ''}`.toLowerCase().includes(q)
    );
  }, [actions, query]);

  useEffect(() => {
    inputRef.current?.focus();
    const onKey = (event) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  useEffect(() => {
    setActive(0);
  }, [query]);

  useEffect(() => {
    const el = listRef.current?.children?.[active];
    el?.scrollIntoView({ block: 'nearest' });
  }, [active]);

  const run = (action) => {
    action.run?.();
    onClose();
  };

  const handleKeyDown = (event) => {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setActive((i) => Math.min(i + 1, filtered.length - 1));
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      setActive((i) => Math.max(i - 1, 0));
    } else if (event.key === 'Enter') {
      const action = filtered[active];
      if (action) run(action);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center px-4 pt-[16vh]" onClick={onClose}>
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" aria-hidden="true" />
      <div
        className="animate-scale relative w-full max-w-lg overflow-hidden rounded-xl border border-line bg-background shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-center gap-3 border-b border-line px-4">
          <Search size={16} className="text-muted" />
          <input
            ref={inputRef}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={t.ui.palette.placeholder}
            className="h-12 w-full bg-transparent text-sm outline-none placeholder:text-muted"
          />
          <kbd>Esc</kbd>
        </div>

        <div ref={listRef} className="max-h-72 overflow-y-auto p-2">
          {filtered.length === 0 && (
            <p className="px-3 py-10 text-center text-sm text-muted">{t.ui.palette.noResult}</p>
          )}
          {filtered.map((action, index) => (
            <button
              key={action.id}
              type="button"
              onClick={() => run(action)}
              onMouseEnter={() => setActive(index)}
              className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition ${
                index === active ? 'bg-soft' : ''
              }`}
            >
              <action.icon size={16} className="shrink-0 text-muted" />
              <span className="min-w-0 flex-1 truncate">{action.title}</span>
              {action.subtitle && (
                <span className="truncate text-xs text-muted">{action.subtitle}</span>
              )}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3 border-t border-line px-4 py-2 text-xs text-muted">
          <span><kbd>↑↓</kbd> navigasi</span>
          <span><kbd>↵</kbd> pilih</span>
          <span><kbd>Esc</kbd> tutup</span>
        </div>
      </div>
    </div>
  );
}
