import { Check } from 'lucide-react';
import { useLang } from '../i18n.jsx';
import Carousel from './Carousel.jsx';

export default function Packages() {
  const { t, lang } = useLang();

  return (
    <>
      <Carousel
        items={t.packages}
        itemKey={(pkg) => pkg.name}
        cardClassName="w-[min(100%,22rem)]"
        ariaLabel={(pkg) => `Lihat paket ${pkg.name}`}
        renderItem={(pkg) => {
          const waHref = `https://wa.me/${t.site.whatsapp}?text=${encodeURIComponent(
            lang === 'id'
              ? `Halo, saya tertarik dengan paket ${pkg.name} (${pkg.price}).`
              : `Hi, I'm interested in the ${pkg.name} package (${pkg.price}).`
          )}`;

          return (
            <div className="card-hover flex h-full w-full flex-col rounded-xl border border-line bg-card p-5">
              <h3 className="font-semibold">{pkg.name}</h3>
              <p className="mt-1 text-lg font-bold text-accent">{pkg.price}</p>
              <p className="mt-2 text-sm leading-relaxed text-muted">{pkg.description}</p>

              <ul className="mt-4 flex-1 space-y-2">
                {pkg.features.map((feature) => (
                  <li key={feature} className="flex gap-2 text-sm text-muted">
                    <Check size={14} className="mt-0.5 shrink-0 text-accent" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <a
                href={waHref}
                target="_blank"
                rel="noreferrer"
                className="btn-accent mt-5"
              >
                {t.ui.orderPackage}
              </a>
            </div>
          );
        }}
      />
      <p className="mt-4 text-xs leading-relaxed text-muted">{t.ui.packagesNote}</p>
    </>
  );
}
