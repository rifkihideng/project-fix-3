import { useState } from 'react';
import { ArrowUpRight, Award } from 'lucide-react';
import { useLang } from '../i18n.jsx';
import TiltCard from './TiltCard.jsx';
import PdfModal from './PdfModal.jsx';

export default function Awards() {
  const { t } = useLang();
  const [preview, setPreview] = useState(null);

  return (
    <>
      <div className="space-y-3">
        {t.awards.map((item) => (
          <TiltCard
            key={item.title}
            as={item.link ? 'button' : 'div'}
            {...(item.link ? { type: 'button', onClick: () => setPreview(item) } : {})}
            className="card-hover flex w-full items-center gap-4 rounded-xl border border-line bg-card p-4 text-left"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent-soft text-accent">
              <Award size={18} />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="truncate font-medium">{item.title}</h3>
              <p className="text-sm text-muted">{item.issuer}</p>
            </div>
            <span className="shrink-0 text-sm text-muted">{item.year}</span>
            {item.link && <ArrowUpRight size={14} className="shrink-0 text-muted" />}
          </TiltCard>
        ))}
      </div>

      {preview && (
        <PdfModal
          src={preview.link}
          title={preview.title}
          onClose={() => setPreview(null)}
        />
      )}
    </>
  );
}
