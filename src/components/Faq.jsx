import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { useLang } from '../i18n.jsx';

export default function Faq() {
  const { t } = useLang();
  const [open, setOpen] = useState(0);

  return (
    <div className="space-y-3">
      {t.faqs.map((faq, i) => {
        const isOpen = open === i;
        return (
          <div key={faq.question} className="card-hover rounded-xl border border-line bg-card">
            <button
              type="button"
              onClick={() => setOpen(isOpen ? -1 : i)}
              aria-expanded={isOpen}
              className="flex w-full items-center justify-between gap-4 p-4 text-left"
            >
              <span className="font-medium">{faq.question}</span>
              <ChevronDown
                size={16}
                className={`shrink-0 text-muted transition-transform duration-300 ${
                  isOpen ? 'rotate-180' : ''
                }`}
              />
            </button>
            {isOpen && (
              <div className="px-4 pb-4 text-sm leading-relaxed text-muted">{faq.answer}</div>
            )}
          </div>
        );
      })}
    </div>
  );
}
