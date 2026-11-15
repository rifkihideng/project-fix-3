import { useEffect, useRef, useState } from 'react';
import { useLang } from '../i18n.jsx';
import GlassFolder from './ui/GlassFolder.jsx';
import PdfModal from './PdfModal.jsx';

const FOLDER_WIDTH = 340;
const FOLDER_GAP = 32;
const ART_PRESETS = ['glacier', 'verdant'];

export default function Awards() {
  const { t } = useLang();
  const [preview, setPreview] = useState(null);
  const [tone, setTone] = useState(() =>
    typeof document !== 'undefined' && document.documentElement.classList.contains('dark')
      ? 'dark'
      : 'light'
  );
  const containerRef = useRef(null);
  const [folderWidth, setFolderWidth] = useState(FOLDER_WIDTH);

  // keep the folder's glass tone in sync with the site theme
  useEffect(() => {
    const update = () =>
      setTone(document.documentElement.classList.contains('dark') ? 'dark' : 'light');
    update();
    const observer = new MutationObserver(update);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  // keep the folders side by side when they fit, stacked and full-width when they don't
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const update = () => {
      const containerWidth = el.clientWidth;
      const count = t.awards.length;
      const fits =
        containerWidth >= FOLDER_WIDTH * count + FOLDER_GAP * (count - 1);
      setFolderWidth(fits ? FOLDER_WIDTH : Math.min(FOLDER_WIDTH, containerWidth));
    };
    update();
    const observer = new ResizeObserver(update);
    observer.observe(el);
    return () => observer.disconnect();
  }, [t.awards.length]);

  return (
    <>
      <div ref={containerRef} className="flex flex-wrap items-start justify-center" style={{ gap: FOLDER_GAP }}>
        {t.awards.map((item, index) => (
          <GlassFolder
            key={item.title}
            label={item.issuer}
            meta={item.year}
            tone={tone}
            art={ART_PRESETS[index % ART_PRESETS.length]}
            seed={3 + index * 7}
            action="none"
            width={folderWidth}
            appearDelay={index * 140}
            files={[{ name: item.title, meta: 'PDF', award: item }]}
            onFileSelect={(file) => {
              if (file.award?.link) setPreview(file.award);
            }}
          />
        ))}
      </div>
      <p className="mt-6 text-center font-mono text-[11px] uppercase tracking-[0.18em] text-muted">
        {t.ui.hoverToOpen}
      </p>

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
