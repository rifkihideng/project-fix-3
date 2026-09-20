import { useEffect, useState } from 'react';

let toastTimer;

export function showToast(message) {
  window.dispatchEvent(new CustomEvent('app-toast', { detail: message }));
}

export default function Toast() {
  const [toast, setToast] = useState(null);

  useEffect(() => {
    const onToast = (event) => {
      setToast(event.detail);
      clearTimeout(toastTimer);
      toastTimer = setTimeout(() => setToast(null), 2200);
    };
    window.addEventListener('app-toast', onToast);
    return () => {
      window.removeEventListener('app-toast', onToast);
      clearTimeout(toastTimer);
    };
  }, []);

  if (!toast) return null;

  return (
    <div className="toast" role="status" aria-live="polite">
      {toast}
    </div>
  );
}
