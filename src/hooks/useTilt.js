import { useEffect, useRef } from 'react';

export function useTilt(maxTilt = 6) {
  const ref = useRef(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return undefined;
    if (typeof window !== 'undefined' && window.matchMedia('(hover: none)').matches) {
      return undefined;
    }

    const onMove = (event) => {
      const rect = node.getBoundingClientRect();
      const px = (event.clientX - rect.left) / rect.width - 0.5;
      const py = (event.clientY - rect.top) / rect.height - 0.5;
      node.style.transform = `perspective(700px) rotateX(${(-py * maxTilt).toFixed(2)}deg) rotateY(${(px * maxTilt).toFixed(2)}deg) translateY(-3px)`;
    };

    const onLeave = () => {
      node.style.transform = '';
    };

    node.addEventListener('mousemove', onMove);
    node.addEventListener('mouseleave', onLeave);
    return () => {
      node.removeEventListener('mousemove', onMove);
      node.removeEventListener('mouseleave', onLeave);
    };
  }, [maxTilt]);

  return ref;
}
