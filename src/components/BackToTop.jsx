import { useEffect, useState } from 'react';
import { ArrowUp } from 'lucide-react';
import { useLang } from '../i18n.jsx';

export default function BackToTop() {
  const { t } = useLang();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      aria-label={t.ui.backToTop}
      className={`back-to-top ${visible ? 'back-to-top-visible' : ''}`}
    >
      <ArrowUp size={18} />
    </button>
  );
}
