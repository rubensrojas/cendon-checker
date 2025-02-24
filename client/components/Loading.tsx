'use client';

import { useState, useEffect } from 'react';

const texts = [
  'Carregando derrotas...',
  'Carregando tiltadas...',
  'Carregando feeds...',
  'Carregando pings...',
];

const Loading = () => {
  const [text, setText] = useState(texts[0]);

  useEffect(() => {
    setText(texts[Math.floor(Math.random() * texts.length)]);
    const interval = setInterval(() => {
      setText(texts[Math.floor(Math.random() * texts.length)]);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-white"></div>
      <p className="text-white text-2xl font-bold mt-4">
        {text}
      </p>
    </div>
  );
};

export default Loading;
