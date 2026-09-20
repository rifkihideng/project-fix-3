import { useEffect, useState } from 'react';
import {
  Briefcase,
  Check,
  Clock,
  Copy,
  Mail,
  MapPin,
  Phone,
  User,
} from 'lucide-react';
import { BrandIcon } from './icons.jsx';
import TypingText from './TypingText.jsx';
import RotatingAvatar from './RotatingAvatar.jsx';
import { showToast } from './Toast.jsx';
import { useLang } from '../i18n.jsx';

function CopyButton({ value }) {
  const { t } = useLang();
  const [copied, setCopied] = useState(false);

  const copy = () => {
    if (navigator.clipboard) navigator.clipboard.writeText(value);
    setCopied(true);
    showToast(`${t.ui.copied} ${value}`);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <button
      type="button"
      onClick={copy}
      className="ml-auto rounded-md p-1 text-muted transition hover:bg-soft hover:text-foreground"
      aria-label={t.ui.copy}
    >
      {copied ? <Check size={14} className="text-online" /> : <Copy size={14} />}
    </button>
  );
}

function OverviewRow({ icon: Icon, label, value, href, copy }) {
  const content = href ? (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="text-foreground underline-offset-4 transition hover:underline"
    >
      {value}
    </a>
  ) : (
    <span className="text-foreground">{value}</span>
  );

  return (
    <div className="flex items-center gap-3 py-2">
      <Icon size={15} className="shrink-0 text-muted" />
      <span className="min-w-0 text-sm text-muted">{label}</span>
      <span className="min-w-0 truncate text-sm">{content}</span>
      {copy && <CopyButton value={value} />}
    </div>
  );
}

function LiveClock() {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 30000);
    return () => clearInterval(timer);
  }, []);
  const time = now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
  return <span className="text-foreground">{time}</span>;
}

// Statistik GitHub asli (repositori & followers).
function GithubCard() {
  const { t } = useLang();
  const username =
    t.socials.find((s) => s.id === 'github')?.href?.split('/').pop() || 'rifkihideng';
  const [stats, setStats] = useState(null);

  useEffect(() => {
    let active = true;
    fetch(`https://api.github.com/users/${username}`)
      .then((response) => response.json())
      .then((data) => {
        if (active && data && typeof data.public_repos === 'number') {
          setStats({
            repos: data.public_repos,
            followers: data.followers,
            following: data.following,
          });
        }
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, [username]);

  return (
    <div>
      <h2 className="mb-3 text-sm font-semibold">{t.ui.github}</h2>
      <a
        href={t.socials.find((s) => s.id === 'github')?.href}
        target="_blank"
        rel="noreferrer"
        className="block"
      >
        <div className="grid grid-cols-3 gap-3 text-center">
          <div>
            <p className="text-xl font-bold text-accent">{stats ? stats.repos : '—'}</p>
            <p className="text-xs text-muted">{t.ui.githubRepos}</p>
          </div>
          <div>
            <p className="text-xl font-bold text-accent">{stats ? stats.followers : '—'}</p>
            <p className="text-xs text-muted">{t.ui.githubFollowers}</p>
          </div>
          <div>
            <p className="text-xl font-bold text-accent">{stats ? stats.following : '—'}</p>
            <p className="text-xs text-muted">{t.ui.githubFollowing}</p>
          </div>
        </div>
        <p className="mt-3 text-center text-xs text-muted">
          @{username} — {t.ui.githubVisit}
        </p>
      </a>
    </div>
  );
}

export default function Hero() {
  const { t } = useLang();

  return (
    <section id="top" className="grid grid-cols-[minmax(0,1fr)] gap-12 pt-12 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:pt-20">
      {/* Kolom profil */}
      <div className="animate-rise min-w-0">
        <div className="relative inline-block">
          <div className="hero-glow absolute -inset-6 rounded-full" aria-hidden="true" />
          <div className="avatar-ring relative inline-block">
            <div className="flex h-28 w-28 items-center justify-center rounded-full bg-background text-3xl font-bold text-accent sm:h-32 sm:w-32 sm:text-4xl">
              {t.site.avatars && t.site.avatars.length > 0 ? (
                <RotatingAvatar photos={t.site.avatars} alt={t.site.name} />
              ) : t.site.avatar ? (
                <img src={t.site.avatar} alt={t.site.name} className="h-full w-full rounded-full object-cover" />
              ) : (
                t.site.monogram
              )}
            </div>
          </div>
        </div>

        <h1 className="mt-6 text-3xl font-bold tracking-tight sm:text-4xl">{t.site.name}</h1>
        <p className="mt-2 text-muted">
          <TypingText text={t.site.tagline} />
        </p>

        <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-line bg-card px-3 py-1 text-xs text-muted">
          <span className="relative flex h-2 w-2">
            <span className="pulse-soft absolute inline-flex h-full w-full rounded-full bg-online" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-online" />
          </span>
          {t.site.status}
        </div>

        <div className="mt-6 flex flex-wrap gap-2">
          {t.socials.map((item) => (
            <a
              key={item.id}
              href={item.href}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 rounded-lg border border-line bg-card px-3 py-2 text-sm text-muted transition hover:bg-soft hover:text-foreground"
            >
              <BrandIcon id={item.id} size={16} />
              <span>{item.label}</span>
            </a>
          ))}
        </div>
      </div>

      {/* Kolom overview & about */}
      <div className="animate-rise min-w-0" style={{ animationDelay: '80ms' }}>
        <div className="rounded-xl border border-line bg-card p-5">
          <h2 className="mb-2 text-sm font-semibold">{t.ui.overview}</h2>
          <div className="divide-y divide-line">
            <OverviewRow icon={Briefcase} label={t.ui.role} value={t.site.role} />
            <OverviewRow icon={MapPin} label={t.ui.location} value={t.site.location} />
            <OverviewRow icon={Clock} label={t.ui.time} value={<LiveClock />} />
            <OverviewRow icon={Mail} label={t.ui.email} value={t.site.email} copy={t.site.email} />
            <OverviewRow icon={Phone} label={t.ui.phone} value={t.site.phone} copy={t.site.phone} />
            <OverviewRow icon={User} label={t.ui.pronouns} value={t.site.pronouns} />
          </div>
        </div>

        <div className="mt-4 rounded-xl border border-line bg-card p-5">
          <h2 className="mb-3 text-sm font-semibold">About</h2>
          <ul className="space-y-2 text-sm leading-relaxed text-muted">
            {t.about.map((line, i) => (
              <li key={i} className="flex gap-2">
                <span className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-accent" />
                <span>{line}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-4 rounded-xl border border-line bg-card p-5">
          <GithubCard />
        </div>
      </div>
    </section>
  );
}
