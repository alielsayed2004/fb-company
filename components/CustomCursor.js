'use client';
import { useEffect, useState, useSyncExternalStore } from 'react';
import { motion, useSpring } from 'framer-motion';

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
  const springConfig = { damping: 25, stiffness: 400, mass: 0.5 };
  const cursorX = useSpring(-100, springConfig);
  const cursorY = useSpring(-100, springConfig);

  // Fast direct position for inner dot
  const [dotPos, setDotPos] = useState({ x: -100, y: -100 });

  useEffect(() => {
    if (isTouch) return;

    const onMouseMove = (e) => {
      if (!isVisible) setIsVisible(true);
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      setDotPos({ x: e.clientX, y: e.clientY });

      // Determine hover target type
      const target = e.target;
      if (!target) return;

      const interactiveElement = target.closest('a, button, [role="button"], input, select, textarea, .cursor-pointer');

      if (interactiveElement) {
        setCursorState('hover');
      } else {
        setCursorState('default');
      }
    };

    const onMouseLeave = () => {
      setIsVisible(false);
    };

    const onMouseEnter = () => {
      setIsVisible(true);
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    document.addEventListener('mouseleave', onMouseLeave);
    document.addEventListener('mouseenter', onMouseEnter);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseleave', onMouseLeave);
      document.removeEventListener('mouseenter', onMouseEnter);
    };
  }, [cursorX, cursorY, isVisible, isTouch]);

  if (isTouch) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[9999] overflow-hidden select-none">
      {/* 1. Inner Precision Dot */}
      <motion.div
        className="fixed top-0 left-0 w-2 h-2 rounded-full bg-fb-green z-50 -translate-x-1/2 -translate-y-1/2"
        style={{
          x: dotPos.x,
          y: dotPos.y,
          opacity: isVisible ? 1 : 0,
        }}
        transition={{ duration: 0.05 }}
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
          scale: cursorState === 'hover' ? 1.3 : 1,
          width: cursorState === 'hover' ? 36 : 28,
          height: cursorState === 'hover' ? 36 : 28,
          backgroundColor: cursorState === 'hover' ? 'rgba(83, 183, 121, 0.15)' : 'rgba(83, 183, 121, 0.05)',
          borderColor: cursorState === 'hover' ? '#53B779' : 'rgba(83, 183, 121, 0.35)',
          borderWidth: '1px',
          boxShadow: cursorState === 'hover' ? '0 0 15px rgba(83, 183, 121, 0.3)' : 'none',
        }}
        transition={{ type: 'spring', damping: 25, stiffness: 400, mass: 0.5 }}
      />
    </div>
  );
}
