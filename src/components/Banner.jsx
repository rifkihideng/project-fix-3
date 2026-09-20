import { useEffect, useState } from 'react';
import { Command, Languages, Menu, Moon, Sun, X } from 'lucide-react';
import { BrandIcon } from './icons.jsx';
import { useLang } from '../i18n.jsx';

const NAV_IDS = ['about', 'experience', 'projects', 'awards', 'tools', 'skills', 'packages', 'testimonials', 'faq'];

export default function Banner({ theme, onToggleTheme, onOpenPalette }) {
  const { t, lang, toggleLang } = useLang();
  const github = t.socials.find((s) => s.id === 'github');
  const [active, setActive] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      let current = '';
      for (const id of NAV_IDS) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= 120) current = id;
      }
      setActive((prev) => (prev === current ? prev : current));
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-5xl items-center gap-3 px-5">
        <a href="#top" className="flex items-center gap-2.5">
          {t.site.avatar ? (
            <img
              src={t.site.avatar}
              alt={t.site.name}
              className="h-[26px] w-[26px] rounded-[7px] object-cover"
            />
          ) : (
            <span className="monogram">{t.site.monogram}</span>
          )}
          <span className="hidden text-sm font-semibold tracking-tight min-[400px]:inline">{t.site.name}</span>
        </a>

        <nav className="ml-6 hidden items-center gap-1 lg:flex">
          {NAV_IDS.map((id) => (
            <a
              key={id}
              href={`#${id}`}
              className={`whitespace-nowrap rounded-md px-2 py-1 text-sm transition ${
                active === id
                  ? 'bg-soft text-foreground'
                  : 'text-muted hover:bg-soft/60 hover:text-foreground'
              }`}
            >
              {t.ui.nav[id]}
            </a>
          ))}
        </nav>

        <button
          type="button"
          onClick={onOpenPalette}
          aria-label={t.ui.openPalette}
          className="ml-auto hidden items-center gap-2 rounded-lg border border-line bg-card px-2.5 py-1.5 text-sm text-muted transition hover:bg-soft lg:flex"
        >
          <Command size={14} />
          <kbd className="hidden sm:inline-flex">Ctrl K</kbd>
        </button>

        {github && (
          <a
            href={github.href}
            target="_blank"
            rel="noreferrer"
            aria-label={t.ui.github}
            className="flex items-center gap-1.5 rounded-lg border border-line bg-card px-2.5 py-1.5 text-sm text-muted transition hover:bg-soft"
          >
            <BrandIcon id="github" size={15} />
          </a>
        )}

        <button
          type="button"
          onClick={toggleLang}
          aria-label={t.ui.langLabel}
          title={t.ui.langLabel}
          className="flex items-center gap-1.5 rounded-lg border border-line bg-card px-2 py-1.5 text-xs font-medium text-muted transition hover:bg-soft hover:text-foreground"
        >
          <Languages size={14} />
          <span className="hidden sm:inline">{lang === 'id' ? 'EN' : 'ID'}</span>
        </button>

        <button
          type="button"
          onClick={onToggleTheme}
          className="rounded-lg border border-line bg-card p-2 text-muted transition hover:bg-soft"
          aria-label={t.ui.toggleTheme}
        >
          {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
        </button>

        <button
          type="button"
          onClick={() => setMenuOpen((open) => !open)}
          aria-label="Menu"
          className="rounded-lg border border-line bg-card p-2 text-muted transition hover:bg-soft lg:hidden"
        >
          {menuOpen ? <X size={16} /> : <Menu size={16} />}
        </button>
      </div>

      <nav
        aria-hidden={!menuOpen}
        className={`mobile-menu lg:hidden ${menuOpen ? 'mobile-menu-open' : ''}`}
      >
        <div className="flex flex-col gap-1 border-b border-line bg-background px-5 py-3">
          {NAV_IDS.map((id) => (
            <a
              key={id}
              href={`#${id}`}
              onClick={() => setMenuOpen(false)}
              className="rounded-md px-3 py-2 text-sm text-muted transition hover:bg-soft hover:text-foreground"
            >
              {t.ui.nav[id]}
            </a>
          ))}
        </div>
      </nav>
    </header>
  );
}
