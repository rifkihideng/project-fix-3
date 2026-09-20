import { Check } from 'lucide-react';
import { useLang } from '../i18n.jsx';
import TiltCard from './TiltCard.jsx';

export default function Packages() {
  const { t, lang } = useLang();
  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {t.packages.map((pkg) => {
          const waHref = `https://wa.me/${t.site.whatsapp}?text=${encodeURIComponent(
            lang === 'id'
              ? `Halo, saya tertarik dengan paket ${pkg.name} (${pkg.price}).`
              : `Hi, I'm interested in the ${pkg.name} package (${pkg.price}).`
          )}`;

          return (
            <TiltCard
              key={pkg.name}
              as="div"
              className="card-hover flex flex-col rounded-xl border border-line bg-card p-5"
            >
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
            </TiltCard>
          );
        })}
      </div>
      <p className="mt-4 text-xs leading-relaxed text-muted">{t.ui.packagesNote}</p>
    </>
  );
}
