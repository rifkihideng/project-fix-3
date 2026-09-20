import { BrandIcon } from './icons.jsx';
import { useLang } from '../i18n.jsx';

export default function Footer() {
  const { t } = useLang();
  return (
    <footer className="border-t border-line">
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-5 px-5 py-10 text-center">
        <span className="monogram">{t.site.monogram}</span>
        <div>
          <p className="font-medium">{t.site.name}</p>
          <p className="mt-1 text-sm text-muted">{t.site.tagline}</p>
        </div>

        <div className="flex gap-2">
          {t.socials.map((item) => (
            <a
              key={item.id}
              href={item.href}
              target="_blank"
              rel="noreferrer"
              aria-label={item.label}
              className="rounded-lg border border-line bg-card p-2.5 text-muted transition hover:bg-soft hover:text-foreground"
            >
              <BrandIcon id={item.id} size={16} />
            </a>
          ))}
        </div>

        <p className="text-xs text-muted">
          © {new Date().getFullYear()} {t.site.name} · {t.ui.footerBuilt}
        </p>
      </div>
    </footer>
  );
}
