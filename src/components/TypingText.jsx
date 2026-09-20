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
    <span>
      {text.slice(0, count)}
      <span className="typing-caret" aria-hidden="true" />
    </span>
  );
}
