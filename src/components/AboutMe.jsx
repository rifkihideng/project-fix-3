import { useLang } from '../i18n.jsx';

export default function AboutMe() {
  const { t } = useLang();

  return (
    <div className="rounded-xl border border-line bg-card p-6">
      <div className="space-y-4 text-sm leading-relaxed text-muted sm:text-base">
        {t.aboutStory.map((paragraph, i) => (
          <p key={i}>{paragraph}</p>
        ))}
      </div>
      <div className="mt-6 flex flex-wrap items-center gap-2">
        <span className="text-xs font-medium text-muted">{t.ui.aboutTools}:</span>
        {t.favoriteTools.map((tool) => (
          <span
            key={tool}
            className="rounded-md border border-line bg-soft px-2 py-1 text-xs text-foreground"
          >
            {tool}
          </span>
        ))}
      </div>
    </div>
  );
}
