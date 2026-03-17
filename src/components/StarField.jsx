import { useEffect, useRef } from 'react';

export default function StarField() {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const count = 180;
    for (let i = 0; i < count; i++) {
      const star = document.createElement('div');
      star.className = 'star';
      const size = Math.random() < 0.8 ? 1.5 : Math.random() < 0.9 ? 2.5 : 3.5;
      star.style.cssText = `
        width: ${size}px;
        height: ${size}px;
        left: ${Math.random() * 100}%;
        top: ${Math.random() * 100}%;
        --duration: ${2 + Math.random() * 4}s;
        --delay: ${Math.random() * 5}s;
        opacity: ${0.1 + Math.random() * 0.5};
      `;
      container.appendChild(star);
    }
    return () => { if (container) container.innerHTML = ''; };
  }, []);

  return <div ref={containerRef} className="stars-bg" aria-hidden="true" />;
}
