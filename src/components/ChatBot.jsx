import { useEffect, useRef, useState } from 'react';
import { MessageCircle, Send, X } from 'lucide-react';
import { useLang } from '../i18n.jsx';

export default function ChatBot() {
  const { lang } = useLang();

  const labels =
    lang === 'id'
      ? {
          title: 'Asisten AI',
          placeholder: 'Tulis pesan...',
          send: 'Kirim',
          greeting: 'Halo! 👋 Ada yang bisa saya bantu seputar layanan Rifki?',
          offline:
            'Server chatbot belum aktif. Jalankan `node server.js` dan isi GROQ_API_KEY di file .env.',
          chips: ['Paket & harga', 'Layanan jaringan', 'Cara order'],
        }
      : {
          title: 'AI Assistant',
          placeholder: 'Type a message...',
          send: 'Send',
          greeting: "Hi! 👋 How can I help you with Rifki's services?",
          offline:
            'The chatbot server is offline. Run `node server.js` and set GROQ_API_KEY in the .env file.',
          chips: ['Packages & pricing', 'Network services', 'How to order'],
        };

  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { id: 0, role: 'assistant', text: labels.greeting },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [online, setOnline] = useState(true);
  const listRef = useRef(null);

  // Saat bahasa diganti, reset percakapan agar sapaan & balasan mengikuti bahasa terpilih.
  useEffect(() => {
    setMessages([{ id: 0, role: 'assistant', text: labels.greeting }]);
    setInput('');
  }, [lang]);

  useEffect(() => {
    fetch('/api/health')
      .then((res) => setOnline(res.ok))
      .catch(() => setOnline(false));
  }, []);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, loading]);

  const send = async (preset) => {
    const value = (preset ?? input).trim();
    if (!value || loading) return;

    const userMsg = { id: Date.now(), role: 'user', text: value };
    const next = [...messages, userMsg];
    setMessages(next);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lang,
          messages: next.map((m) => ({ role: m.role, content: m.text })),
        }),
      });
      if (!res.ok) throw new Error('bad status');
      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        { id: Date.now(), role: 'assistant', text: data.reply },
      ]);
      setOnline(true);
    } catch {
      setMessages((prev) => [
        ...prev,
        { id: Date.now(), role: 'assistant', text: labels.offline },
      ]);
      setOnline(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Tombol buka/tutup */}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label={labels.title}
        className="chat-fab"
      >
        {open ? <X size={22} /> : <MessageCircle size={22} />}
        {!open && !online && (
          <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full border-2 border-card bg-red-500" />
        )}
      </button>

      {open && (
        <div className="chat-panel" role="dialog" aria-label={labels.title}>
          <div className="flex items-center justify-between border-b border-line px-4 py-3">
            <div className="flex items-center gap-2.5">
              <span className="monogram">AI</span>
              <div>
                <p className="text-sm font-semibold leading-tight">{labels.title}</p>
                <p className="flex items-center gap-1.5 text-xs text-muted">
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${online ? 'bg-online' : 'bg-red-500'}`}
                  />
                  {online ? 'Online' : 'Offline'}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Tutup"
              className="rounded-md p-1.5 text-muted transition hover:bg-soft hover:text-foreground"
            >
              <X size={16} />
            </button>
          </div>

          <div ref={listRef} className="flex-1 space-y-3 overflow-y-auto p-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`max-w-[85%] whitespace-pre-wrap px-3.5 py-2.5 text-sm leading-relaxed ${
                  msg.role === 'user'
                    ? 'chat-bubble-user ml-auto'
                    : 'chat-bubble-bot'
                }`}
              >
                {msg.text}
              </div>
            ))}
            {loading && (
              <div className="chat-bubble-bot inline-flex w-max gap-1 px-3.5 py-3">
                <span className="typing-dot" />
                <span className="typing-dot" />
                <span className="typing-dot" />
              </div>
            )}
          </div>

          <div className="border-t border-line p-3">
            <div className="mb-2 flex flex-wrap gap-1.5">
              {labels.chips.map((chip) => (
                <button
                  key={chip}
                  type="button"
                  onClick={() => send(chip)}
                  className="rounded-full border border-line bg-background px-3 py-1 text-xs text-muted transition hover:border-accent/60 hover:text-foreground"
                >
                  {chip}
                </button>
              ))}
            </div>
            <form
              className="flex items-center gap-2"
              onSubmit={(event) => {
                event.preventDefault();
                send();
              }}
            >
              <input
                value={input}
                onChange={(event) => setInput(event.target.value)}
                placeholder={labels.placeholder}
                className="min-w-0 flex-1 rounded-lg border border-line bg-background px-3 py-2 text-sm outline-none transition focus:border-accent"
              />
              <button
                type="submit"
                disabled={!input.trim() || loading}
                className="btn-accent-icon"
                aria-label={labels.send}
              >
                <Send size={15} />
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
