import DoodleCrewFooter from './DoodleCrewFooter.jsx';
import { useLang } from '../i18n.jsx';

const NAV_IDS = ['about', 'experience', 'projects', 'skills', 'packages'];

export default function Footer() {
  const { t, lang } = useLang();
  const year = new Date().getFullYear();
  const isEn = lang === 'en';

  const crew = [
    { kind: 'yeti', letter: 0, seat: 'front', offset: -0.32, name: 'Bruno', says: isEn ? 'Hi! Got a project?' : 'Halo! Ada proyek?' },
    { kind: 'bird', letter: 1, seat: 'top', offset: 0.02, name: 'Pip', says: isEn ? 'Follow my GitHub!' : 'Follow GitHub saya!' },
    { kind: 'mushroom', letter: 2, seat: 'front', offset: 0.12, name: 'Morel', says: isEn ? 'Fiber optics are fun!' : 'Fiber optic, seru!' },
    { kind: 'cat', letter: 4, seat: 'front', offset: 0.42, flip: true, name: 'Patch', says: isEn ? 'Arr. Nice cursor.' : 'Arr. Kursor keren.' },
  ];

  return (
    <DoodleCrewFooter
      wordmark="RIFKI"
      brand={t.site.name}
      blurb={t.site.tagline}
      tagline={t.site.status}
      columns={[
        { title: t.ui.menu, links: NAV_IDS.map((id) => ({ label: t.ui.nav[id], href: `#${id}` })) },
      ]}
      actions={[
        { label: isEn ? 'Contact me' : 'Hubungi Saya', href: `https://wa.me/${t.site.whatsapp}`, icon: 'bolt', variant: 'solid' },
        { label: 'GitHub', href: t.socials.find((s) => s.id === 'github')?.href, icon: 'star', variant: 'outline' },
      ]}
      copyright={`© ${year} ${t.site.name} · ${t.ui.footerBuilt}`}
      socials={t.socials.map((s) => ({ label: s.label, href: s.href }))}
      legal={[]}
      crew={crew}
      palette={{ accent: '#f59e0b' }}
    />
  );
}

