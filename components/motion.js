'use client';

import { createElement, forwardRef } from 'react';
import { motion as framerMotion } from 'framer-motion';

// Drop-in replacement for `motion` from framer-motion, so content is never hidden in the server HTML.
//
// - Entrance animations on mount (initial + animate, e.g. the hero) render as plain, visible elements.
// - Scroll reveals (whileInView / variants) render visible with a `data-reveal` attribute. The inline
//   script in the root layout (lib/reveal.js) fades them in only when JavaScript runs, IntersectionObserver
//   exists and the visitor allows motion. Without JavaScript everything stays visible.
// - Real framer-motion is still used for interactive or state-driven animation: exit/AnimatePresence,
//   layout, hover/tap gestures, MotionValue styles (parallax) and `animate` without `initial`.
const MOTION_PROPS = [
  'initial', 'animate', 'exit', 'whileInView', 'whileHover', 'whileTap', 'whileFocus', 'whileDrag',
  'variants', 'viewport', 'transition', 'custom', 'layout', 'layoutId', 'onAnimationComplete', 'onAnimationStart',
];

const isMotionValue = (v) => v && typeof v === 'object' && typeof v.get === 'function' && typeof v.on === 'function';

function needsFramer(props) {
  if (props.exit !== undefined || props.layout || props.layoutId) return true;
  if (props.whileHover || props.whileTap || props.whileFocus || props.drag) return true;
  if (props.animate !== undefined && props.initial === undefined) return true;
  if (props.style && Object.values(props.style).some(isMotionValue)) return true;
  return false;
}

const cache = new Map();

function createMotionComponent(tag) {
  const Framer = framerMotion[tag];
  const Component = forwardRef(function MotionElement(props, ref) {
    if (needsFramer(props)) {
      return <Framer ref={ref} {...props} />;
    }
    const domProps = { ...props };
    for (const key of MOTION_PROPS) delete domProps[key];
    const isMountAnimation = props.animate !== undefined && props.whileInView === undefined;
    const isReveal = !isMountAnimation && (props.whileInView !== undefined || props.variants !== undefined);
    if (isReveal) domProps['data-reveal'] = '';
    return createElement(tag, { ref, ...domProps });
  });
  Component.displayName = `motion.${String(tag)}`;
  return Component;
}

export const motion = new Proxy({}, {
  get(_, tag) {
    if (!cache.has(tag)) cache.set(tag, createMotionComponent(tag));
    return cache.get(tag);
  },
});
