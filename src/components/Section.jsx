import { useRef } from 'react';
import { useLang } from '../i18n.jsx';
import { showToast } from './Toast.jsx';
import { gsap, useGSAP } from '../lib/gsap';

export default function Section({ id, title, count, children }) {
  const { t } = useLang();
  const ref = useRef(null);

  useGSAP(
    () => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        return;
      }

      const trigger = {
        trigger: ref.current,
        start: 'top 85%',
        once: true,
      };

      gsap.fromTo(
        ref.current,
        { autoAlpha: 0, y: 30 },
        { autoAlpha: 1, y: 0, duration: 1, ease: 'power2.out', scrollTrigger: trigger }
      );

      gsap.fromTo(
        ref.current.children,
        { autoAlpha: 0, y: 20 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.9,
          ease: 'power2.out',
          stagger: 0.15,
          scrollTrigger: trigger,
        }
      );
    },
    { scope: ref }
  );

  const copyLink = () => {
    const url = `${window.location.origin}${window.location.pathname}#${id}`;
    if (navigator.clipboard) navigator.clipboard.writeText(url);
    showToast(t.ui.linkCopied);
  };

  return (
    <section id={id} className="scroll-mt-24">
      <div ref={ref}>
        <div className="section-heading">
          <h2>
            {title}
            {count != null && <sup>({count})</sup>}
          </h2>
          <button
            type="button"
            onClick={copyLink}
            className="rounded-md px-1.5 py-0.5 text-muted transition hover:bg-soft hover:text-foreground"
            title={t.ui.copySection}
          >
            #
          </button>
        </div>
        {children}
      </div>
    </section>
  );
}
