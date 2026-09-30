import { useEffect, useRef, useState } from 'react';
import { useLang } from '../i18n.jsx';
import { showToast } from './Toast.jsx';

export default function Section({ id, title, count, children }) {
  const { t } = useLang();
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node || typeof IntersectionObserver === 'undefined') {
      setVisible(true);
      return undefined;
    }

    // Jika section sudah terlihat saat mount, langsung tampilkan.
    const rect = node.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
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
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const copyLink = () => {
    const url = `${window.location.origin}${window.location.pathname}#${id}`;
    if (navigator.clipboard) navigator.clipboard.writeText(url);
    showToast(t.ui.linkCopied);
  };

  return (
    <section id={id} className="scroll-mt-24">
      <div ref={ref} className={`reveal ${visible ? 'reveal-visible' : ''}`}>
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
