import { useEffect, useState } from 'react';

export default function Preloader() {
  const [progress, setProgress] = useState(0);
  const [hide, setHide] = useState(false);
  const [gone, setGone] = useState(false);

  useEffect(() => {
    // Lewati preloader untuk pengguna yang memilih mengurangi animasi.
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setGone(true);
      return undefined;
    }

    let value = 0;
    const duration = 1600;
    const step = 25;
    const increment = 100 / (duration / step);

    const timer = setInterval(() => {
      value += increment;
      if (value >= 100) {
        value = 100;
        clearInterval(timer);
        setProgress(100);
        setTimeout(() => setHide(true), 250);
        setTimeout(() => setGone(true), 800);
      } else {
        setProgress(Math.round(value));
      }
    }, step);

    return () => clearInterval(timer);
  }, []);

  if (gone) return null;

  return (
    <div className={`preloader ${hide ? 'preloader-hide' : ''}`} aria-hidden="true">
      <div className="preloader-inner">
        <span className="preloader-code">&lt;/&gt;</span>
        <div className="preloader-progress">
          <span className="preloader-bar" style={{ width: `${progress}%` }} />
        </div>
        <span className="preloader-percent">{progress}%</span>
      </div>
    </div>
  );
}
