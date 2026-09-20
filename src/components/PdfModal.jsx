import { useEffect } from 'react';
import { X } from 'lucide-react';
import { useLang } from '../i18n.jsx';

export default function PdfModal({ src, title, onClose }) {
  const { t } = useLang();

  useEffect(() => {
    const onKey = (event) => {
      if (event.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  return (
    <div
      className="modal-backdrop animate-fade"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <div className="modal-content animate-scale" onClick={(event) => event.stopPropagation()}>
        <div className="modal-header">
          <span className="truncate">{title}</span>
          <button type="button" className="modal-close" onClick={onClose} aria-label={t.ui.close}>
            <X size={16} />
          </button>
        </div>
        <iframe src={src} title={title} className="modal-iframe" />
      </div>
    </div>
  );
}
