import { useEffect, useState } from 'react';

export default function TypingText({ text, speed = 45 }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    setCount(0);
    let i = 0;
    const timer = setInterval(() => {
      i += 1;
      setCount(i);
      if (i >= text.length) clearInterval(timer);
    }, speed);
    return () => clearInterval(timer);
  }, [text, speed]);

  return (
    <span className="relative inline-block max-w-full">
      {/* Ghost teks penuh: reservasi ruang agar tidak ada layout shift saat mengetik */}
      <span className="invisible" aria-hidden="true">
        {text}
        <span className="typing-caret" />
      </span>
      <span className="absolute inset-0">
        {text.slice(0, count)}
        <span className="typing-caret" aria-hidden="true" />
      </span>
    </span>
  );
}
