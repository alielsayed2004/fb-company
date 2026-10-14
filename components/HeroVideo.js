'use client';

import { useEffect, useState } from 'react';

// Background hero video that never competes with the first paint:
// the poster image renders immediately (server HTML), and the video is attached only after the
// page has finished loading. Skipped for visitors who prefer reduced motion or have Data Saver on.
export default function HeroVideo({ src, poster, className = '', onError }) {
  const [showVideo, setShowVideo] = useState(false);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (navigator.connection && navigator.connection.saveData) return;

    let idleId;
    const start = () => {
      const idle = window.requestIdleCallback || ((cb) => setTimeout(cb, 200));
      idleId = idle(() => setShowVideo(true));
    };
    if (document.readyState === 'complete') start();
    else window.addEventListener('load', start, { once: true });

    return () => {
      window.removeEventListener('load', start);
      if (idleId && window.cancelIdleCallback) window.cancelIdleCallback(idleId);
    };
  }, []);

  if (showVideo) {
    return (
      <video
        key={src}
        src={src}
        poster={poster}
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        aria-hidden="true"
        onError={onError}
        className={className}
      />
    );
  }

  if (!poster) return null;

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={poster} alt="" aria-hidden="true" fetchPriority="high" decoding="async" className={className} />
  );
}
