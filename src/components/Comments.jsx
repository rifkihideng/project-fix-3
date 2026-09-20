import { useEffect, useState } from 'react';
import { Send } from 'lucide-react';
import { testimonials } from '../data/portfolio.js';

const STORAGE_KEY = 'portfolio-comments';

const SEED = testimonials.map((item) => ({
  name: item.name,
  text: item.text,
  time: null,
}));

function formatDate(iso) {
  return new Date(iso).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export default function Comments() {
  const [comments, setComments] = useState(SEED);
  const [name, setName] = useState('');
  const [text, setText] = useState('');

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setComments(JSON.parse(stored));
    } catch {
      /* abaikan */
    }
  }, []);

  const submit = (event) => {
    event.preventDefault();
    const trimmedText = text.trim();
    if (!trimmedText) return;

    const comment = {
      name: name.trim() || 'Anonim',
      text: trimmedText,
      time: new Date().toISOString(),
    };
    const next = [comment, ...comments];
    setComments(next);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      /* abaikan */
    }
    setName('');
    setText('');
  };

  return (
    <div className="space-y-5">
      <form
        onSubmit={submit}
        className="space-y-3 rounded-xl border border-line bg-card p-4"
      >
        <input
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="Nama kamu"
          maxLength={40}
          className="w-full rounded-lg border border-line bg-background px-3 py-2 text-sm outline-none transition focus:border-accent"
        />
        <textarea
          value={text}
          onChange={(event) => setText(event.target.value)}
          placeholder="Tulis komentar..."
          rows={3}
          maxLength={500}
          className="w-full resize-none rounded-lg border border-line bg-background px-3 py-2 text-sm outline-none transition focus:border-accent"
        />
        <div className="flex items-center justify-between gap-3">
          <span className="text-xs text-muted">{text.length}/500</span>
          <button
            type="submit"
            className="btn-accent"
          >
            <Send size={14} />
            Kirim
          </button>
        </div>
      </form>

      <div className="max-h-96 space-y-3 overflow-y-auto pr-1">
        {comments.map((comment, i) => (
          <div key={`${comment.time}-${i}`} className="card-hover rounded-xl border border-line bg-card p-4">
            <div className="flex items-center justify-between gap-2">
              <span className="text-sm font-medium">{comment.name}</span>
              {comment.time && (
                <span className="shrink-0 text-xs text-muted">{formatDate(comment.time)}</span>
              )}
            </div>
            <p className="mt-1.5 text-sm leading-relaxed text-muted">{comment.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
