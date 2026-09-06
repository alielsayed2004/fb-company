'use client';
import { useEffect, useState, useSyncExternalStore } from 'react';
import { motion, useSpring, useMotionValue } from 'framer-motion';

export default function CustomCursor() {
  const [cursorState, setCursorState] = useState('default'); // 'default', 'hover'
  const [isVisible, setIsVisible] = useState(false);
  
  const isTouch = useSyncExternalStore(
    (callback) => {
      if (typeof window === 'undefined') return () => {};
      const media = window.matchMedia('(pointer: coarse)');
      media.addEventListener('change', callback);
      return () => media.removeEventListener('change', callback);
    },
    () => (typeof window !== 'undefined' ? (window.matchMedia('(pointer: coarse)').matches || 'ontouchstart' in window) : false),
    () => false
  );

  // Smooth Spring physics for the trailing ring
  const springConfig = { damping: 28, stiffness: 450, mass: 0.4 };
  const cursorX = useSpring(-100, springConfig);
  const cursorY = useSpring(-100, springConfig);

  // Zero-rerender motion values for inner dot
  const dotX = useMotionValue(-100);
  const dotY = useMotionValue(-100);

  useEffect(() => {
    if (isTouch) return;

    let lastTarget = null;

    const onMouseMove = (e) => {
      if (!isVisible) setIsVisible(true);
      
      // Update motion values directly without triggering React re-renders
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      dotX.set(e.clientX);
      dotY.set(e.clientY);

      // Only check DOM hierarchy when the hovered element changes
      if (e.target !== lastTarget) {
        lastTarget = e.target;
        if (e.target && e.target.closest) {
          const isInteractive = Boolean(
            e.target.closest('a, button, [role="button"], input, select, textarea, .cursor-pointer')
          );
          setCursorState((prev) => (prev !== (isInteractive ? 'hover' : 'default') ? (isInteractive ? 'hover' : 'default') : prev));
        }
      }
    };

    const onMouseLeave = () => {
      setIsVisible(false);
    };

    const onMouseEnter = () => {
      setIsVisible(true);
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    document.addEventListener('mouseleave', onMouseLeave, { passive: true });
    document.addEventListener('mouseenter', onMouseEnter, { passive: true });

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseleave', onMouseLeave);
      document.removeEventListener('mouseenter', onMouseEnter);
    };
  }, [cursorX, cursorY, dotX, dotY, isVisible, isTouch]);

  if (isTouch) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[9999] overflow-hidden select-none will-change-transform">
      {/* 1. Inner Precision Dot */}
      <motion.div
        className="fixed top-0 left-0 w-2 h-2 rounded-full bg-fb-green z-50 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
        style={{
          x: dotX,
          y: dotY,
          opacity: isVisible ? 1 : 0,
        }}
      />

      {/* 2. Trailing Reactive Spring Ring */}
      <motion.div
        className="fixed top-0 left-0 -translate-x-1/2 -translate-y-1/2 rounded-full pointer-events-none"
        style={{
          x: cursorX,
          y: cursorY,
          opacity: isVisible ? 1 : 0,
        }}
        animate={{
          scale: cursorState === 'hover' ? 1.35 : 1,
          width: cursorState === 'hover' ? 38 : 26,
          height: cursorState === 'hover' ? 38 : 26,
          backgroundColor: cursorState === 'hover' ? 'rgba(83, 183, 121, 0.15)' : 'rgba(83, 183, 121, 0.04)',
          borderColor: cursorState === 'hover' ? '#53B779' : 'rgba(83, 183, 121, 0.35)',
          borderWidth: '1px',
          boxShadow: cursorState === 'hover' ? '0 0 15px rgba(83, 183, 121, 0.25)' : 'none',
        }}
        transition={{ type: 'spring', damping: 28, stiffness: 450, mass: 0.4 }}
      />
    </div>
  );
}
