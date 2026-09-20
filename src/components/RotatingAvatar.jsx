import { useEffect, useState } from 'react';

export default function RotatingAvatar({ photos, alt, interval = 4500 }) {
  const [index, setIndex] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(media.matches);
    const onChange = (event) => setReducedMotion(event.matches);
    media.addEventListener('change', onChange);
    return () => media.removeEventListener('change', onChange);
  }, []);

  useEffect(() => {
    if (reducedMotion) return undefined;
    if (!photos || photos.length <= 1) return undefined;
    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % photos.length);
    }, interval);
    return () => clearInterval(timer);
  }, [photos, interval, reducedMotion]);

  if (!photos || photos.length === 0) return null;

  return (
    <div className="relative h-full w-full overflow-hidden rounded-full">
      {photos.map((photo, i) => (
        <img
          key={photo}
          src={photo}
          alt={i === index ? alt : ''}
          className={`absolute inset-0 h-full w-full rounded-full object-cover transition-opacity duration-1000 ease-in-out ${
            i === index ? 'opacity-100' : 'opacity-0'
          }`}
        />
      ))}
    </div>
  );
}
