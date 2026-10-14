'use client';

import { useEffect, useRef, useState } from 'react';

// Renders the final value in the server HTML (correct without JavaScript, for crawlers and AI).
// After hydration, if the number is visible and the user allows motion, it counts up once.
export default function StatCounter({ value, duration = 1200 }) {
  const text = String(value ?? '');
  const target = parseInt(text.replace(/[^0-9]/g, ''), 10);
  const [display, setDisplay] = useState(text);
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || !Number.isFinite(target) || target <= 0) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (!('IntersectionObserver' in window)) return;

    const format = (n) => text.replace(/[0-9][0-9,٬.]*/, n.toLocaleString('en-US'));
    let frame;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      observer.disconnect();
      const start = performance.now();
      const tick = (now) => {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        setDisplay(format(Math.round(target * eased)));
        if (progress < 1) frame = requestAnimationFrame(tick);
      };
      frame = requestAnimationFrame(tick);
    }, { threshold: 0.4 });

    observer.observe(el);
    return () => {
      observer.disconnect();
      if (frame) cancelAnimationFrame(frame);
    };
  }, [text, target, duration]);

  return (
    <span ref={ref} dir="ltr" className="tabular-nums">
      {display}
    </span>
  );
}
