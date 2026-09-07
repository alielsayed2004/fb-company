'use client';

import React, { useRef, useState, useSyncExternalStore } from 'react';
import Image from 'next/image';
import { motion, useMotionValue, useSpring, useTransform, useScroll, useReducedMotion } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';

export default function InteractiveEarthFocus() {
  const { locale } = useLanguage();
  const isAr = locale === 'ar';
  const shouldReduceMotion = useReducedMotion();
  const containerRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  const isMounted = useSyncExternalStore(() => () => {}, () => true, () => false);

  // Pointer tracking (-1 to +1)
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Springs for refined institutional weight and smoothness
  const springConfig = { damping: 26, stiffness: 85, mass: 0.85 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  // 3D Rotations (±3 degrees horizontal, ±2 degrees vertical)
  const rotateY = useTransform(smoothX, [-1, 1], [-3.5, 3.5]);
  const rotateX = useTransform(smoothY, [-1, 1], [2.5, -2.5]);

  // Depth translations (Globe: ~8px, Orbit: ~12px counter)
  const globeTranslateX = useTransform(smoothX, [-1, 1], [-8, 8]);
  const globeTranslateY = useTransform(smoothY, [-1, 1], [-5, 5]);
  const orbitTranslateX = useTransform(smoothX, [-1, 1], [6, -6]);
  const orbitTranslateY = useTransform(smoothY, [-1, 1], [5, -5]);

  // Scroll parallax connection
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start']
  });

  // 8-12 degrees scroll rotation and <=18px vertical shift
  const scrollRotate = useTransform(scrollYProgress, [0, 1], [-6, 6]);
  const scrollGlobeY = useTransform(scrollYProgress, [0, 1], [16, -16]);
  const scrollOrbitY = useTransform(scrollYProgress, [0, 1], [-8, 8]);

  const handlePointerMove = (e) => {
    if (shouldReduceMotion || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const y = ((e.clientY - rect.top) / rect.height) * 2 - 1;
    mouseX.set(Math.max(-1, Math.min(1, x)));
    mouseY.set(Math.max(-1, Math.min(1, y)));
  };

  const handlePointerLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
    setIsHovered(false);
  };

  // Entrance reveal sequence
  const stageVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] }
    }
  };

  const globeVariants = {
    hidden: { opacity: 0, y: 18, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 1.1, delay: 0.15, ease: [0.22, 1, 0.36, 1] }
    }
  };

  const orbitVariants = {
    hidden: { opacity: 0, scale: 0.92 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 1.2, delay: 0.4, ease: 'easeOut' }
    }
  };

  const targetVariants = {
    hidden: { scale: 0, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: { duration: 0.7, delay: 0.75, ease: [0.22, 1, 0.36, 1] }
    }
  };

  return (
    <motion.div
      ref={containerRef}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-60px' }}
      variants={stageVariants}
      onPointerMove={handlePointerMove}
      onPointerEnter={() => setIsHovered(true)}
      onPointerLeave={handlePointerLeave}
      className="relative w-full max-w-[620px] mx-auto flex flex-col items-center justify-center select-none cursor-default group"
      style={{ perspective: 1200 }}
      role="img"
      aria-label={isAr
        ? "مجسم ثلاثي الأبعاد للكرة الأرضية يركز على جمهورية مصر العربية كمحور استراتيجي لشركة F.B لإدارة الأصول وتوفير المواقع"
        : "Interactive 3D globe highlighting Egypt as F.B Company's strategic location focus."
      }
    >
      {/* 3D Visual Stage Canvas */}
      <div className="relative w-full max-w-[540px] md:max-w-[560px] aspect-square flex items-center justify-center">

        {/* LAYER 1: Pure Transparent 3D Globe with Matte Institutional Aesthetic */}
        <motion.div
          variants={globeVariants}
          style={{
            rotateX: shouldReduceMotion ? 0 : rotateX,
            rotateY: shouldReduceMotion ? 0 : rotateY,
            rotateZ: shouldReduceMotion ? 0 : scrollRotate,
            x: shouldReduceMotion ? 0 : globeTranslateX,
            y: shouldReduceMotion ? 0 : scrollGlobeY,
            transformStyle: 'preserve-3d',
          }}
          className="relative w-full h-full flex items-center justify-center pointer-events-none"
        >
          {/* Subtle Ambient Behind-Globe Soft Glow */}
          <div className="absolute w-[400px] sm:w-[460px] h-[400px] sm:h-[460px] rounded-full bg-[#53B379]/15 blur-3xl pointer-events-none -z-10" />

          {/* Standalone 3D Matte Earth Visual Asset (User-Provided Transparent Cut) */}
          <div className="relative w-[440px] sm:w-[500px] md:w-[550px] aspect-[565/510] drop-shadow-[0_22px_42px_rgba(0,37,38,0.22)]">
            <Image
              src="/images/earth-egypt-focus-cropped.png"
              alt="F.B Company Global Perspective with Strategic Focus on Egypt"
              fill
              priority
              sizes="(max-width: 768px) 100vw, 550px"
              className="object-contain object-center transition-transform duration-700"
            />
          </div>

          {/* Cast Ground Shadow Under Globe */}
          <div className="absolute -bottom-3 w-[340px] sm:w-[420px] h-[28px] bg-[#002526]/18 blur-xl rounded-[100%] pointer-events-none -z-10" />

          {/* LAYER 2: Overlay Geometric Orbit Lines & Planetary Coordinate Network */}
          <motion.div
            variants={orbitVariants}
            style={{
              x: shouldReduceMotion ? 0 : orbitTranslateX,
              y: shouldReduceMotion ? 0 : scrollOrbitY,
            }}
            className="absolute inset-0 w-full h-full pointer-events-none"
          >
            <svg 
              viewBox="0 0 440 440" 
              className="w-full h-full overflow-visible"
              preserveAspectRatio="xMidYMid meet"
            >
              <defs>
                <linearGradient id="orbitGlowGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#8BD7AE" stopOpacity="0.85" />
                  <stop offset="50%" stopColor="#53B379" stopOpacity="0.45" />
                  <stop offset="100%" stopColor="#0C6B52" stopOpacity="0.1" />
                </linearGradient>
              </defs>

              {/* Dynamic Outer Orbit Ellipse Arc */}
              <motion.path
                d="M 60,260 C 90,370 330,390 390,270 C 430,190 370,100 280,60"
                fill="none"
                stroke="url(#orbitGlowGradient)"
                strokeWidth="1.2"
                strokeDasharray="4 4"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 0.7 }}
                transition={{ duration: 2.2, delay: 0.5, ease: 'easeInOut' }}
              />

              {/* Upper Diagonal Orbit Stream */}
              <motion.path
                d="M 120,90 C 200,45 360,80 410,160"
                fill="none"
                stroke="#8BD7AE"
                strokeWidth="0.9"
                strokeOpacity="0.4"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.8, delay: 0.7, ease: 'easeOut' }}
              />

              {/* Orbital Beacon Satellite Node */}
              <motion.circle
                cx="370"
                cy="125"
                r="2.8"
                fill="#FFFFFF"
                stroke="#8BD7AE"
                strokeWidth="1.2"
                animate={shouldReduceMotion ? {} : { scale: [1, 1.4, 1], opacity: [0.6, 1, 0.6] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              />
            </svg>
          </motion.div>

          {/* LAYER 3: Egypt Strategic Targeting Marker & Concentric Pulse Rings */}
          {/* Coordinates anchored precisely onto Cairo / Egypt position (50.8%, 38.6%) */}
          <div 
            className="absolute left-[50.8%] top-[38.6%] -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none"
            style={{ transform: 'translateZ(15px)' }}
          >
            <motion.div
              variants={targetVariants}
              className="relative flex items-center justify-center"
            >
              {/* Outer Pulse Wave (Ring 3) */}
              <motion.div
                className="absolute w-22 sm:w-28 h-22 sm:h-28 rounded-full border border-fb-green/35 pointer-events-none"
                animate={shouldReduceMotion ? {} : { scale: [0.85, 1.45, 0.85], opacity: [0.45, 0.05, 0.45] }}
                transition={{ duration: 3.6, repeat: Infinity, ease: 'easeInOut' }}
              />

              {/* Middle Precision Ring (Ring 2) */}
              <motion.div
                className="absolute w-14 sm:w-16 h-14 sm:h-16 rounded-full border border-[#8BD7AE]/70 pointer-events-none"
                animate={shouldReduceMotion ? {} : { scale: isHovered ? [1, 1.25, 1] : [0.9, 1.15, 0.9], opacity: [0.75, 0.35, 0.75] }}
                transition={{ duration: isHovered ? 1.8 : 2.6, repeat: Infinity, ease: 'easeInOut' }}
              />

              {/* Inner Focus Reticle (Ring 1) */}
              <div className="absolute w-6.5 h-6.5 rounded-full border border-white/90 shadow-[0_0_12px_rgba(139,215,174,0.7)]" />

              {/* Core Beacon Center (Egypt Pinpoint) */}
              <div className="relative w-2.5 h-2.5 rounded-full bg-white shadow-[0_0_8px_#FFFFFF]">
                <div className="absolute inset-0 rounded-full bg-fb-green animate-ping opacity-75" />
              </div>
            </motion.div>
          </div>

        </motion.div>
      </div>

    </motion.div>
  );
}
