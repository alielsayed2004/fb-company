'use client';

import React, { useRef, useState, useSyncExternalStore } from 'react';
import { motion, useMotionValue, useSpring, useTransform, useScroll, useReducedMotion } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';

export default function EagleOfForesight() {
  const { locale } = useLanguage();
  const isAr = locale === 'ar';
  const shouldReduceMotion = useReducedMotion();
  const stageRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  const isMounted = useSyncExternalStore(() => () => {}, () => true, () => false);

  // Pointer position motion values (-1 to +1)
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth springs for fluid, institutional weight
  const springConfig = { damping: 26, stiffness: 90, mass: 0.8 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  // 3D Rotations (±3 degrees as per spec)
  const rotateX = useTransform(smoothY, [-1, 1], [3, -3]);
  const rotateY = useTransform(smoothX, [-1, 1], [-3, 3]);

  // Platform rotation (moves opposite by 1-2 degrees)
  const platformRotateX = useTransform(smoothY, [-1, 1], [-1.5, 1.5]);
  const platformRotateY = useTransform(smoothX, [-1, 1], [1.5, -1.5]);

  // Depths (Eagle 12px, Platform 5px)
  const eagleTranslateX = useTransform(smoothX, [-1, 1], [-8, 8]);
  const eagleTranslateY = useTransform(smoothY, [-1, 1], [-6, 6]);
  const platformTranslateX = useTransform(smoothX, [-1, 1], [3, -3]);
  const platformTranslateY = useTransform(smoothY, [-1, 1], [3, -3]);

  // Wing subtle differential parallax
  const leftWingX = useTransform(smoothX, [-1, 1], [-5, 3]);
  const rightWingX = useTransform(smoothX, [-1, 1], [-3, 5]);

  // Scroll parallax connection
  const { scrollYProgress } = useScroll({
    target: stageRef,
    offset: ['start end', 'end start']
  });

  const scrollPlatformY = useTransform(scrollYProgress, [0, 1], [15, -18]);
  const scrollEagleY = useTransform(scrollYProgress, [0, 1], [-8, 10]);

  const handlePointerMove = (e) => {
    if (shouldReduceMotion || !stageRef.current) return;
    const rect = stageRef.current.getBoundingClientRect();
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

  // Staggered entrance animation variants
  const stageVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1, 
      transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } 
    }
  };

  const platformVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { duration: 0.8, delay: 0.15, ease: [0.22, 1, 0.36, 1] } 
    }
  };

  const eagleBodyVariants = {
    hidden: { opacity: 0, y: 12, scale: 0.96 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1, 
      transition: { duration: 0.9, delay: 0.3, ease: [0.22, 1, 0.36, 1] } 
    }
  };

  const wingLeftVariants = {
    hidden: { opacity: 0, x: 15, scale: 0.95 },
    visible: { 
      opacity: 1, 
      x: 0, 
      scale: 1, 
      transition: { duration: 0.8, delay: 0.45, ease: [0.22, 1, 0.36, 1] } 
    }
  };

  const wingRightVariants = {
    hidden: { opacity: 0, x: -15, scale: 0.95 },
    visible: { 
      opacity: 1, 
      x: 0, 
      scale: 1, 
      transition: { duration: 0.8, delay: 0.54, ease: [0.22, 1, 0.36, 1] } 
    }
  };

  const routeLineVariants = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: { 
      pathLength: 1, 
      opacity: 0.85, 
      transition: { duration: 1.2, delay: 0.65, ease: 'easeInOut' } 
    }
  };

  const nodeVariants = (i) => ({
    hidden: { scale: 0, opacity: 0 },
    visible: { 
      scale: 1, 
      opacity: 1, 
      transition: { duration: 0.5, delay: 0.85 + i * 0.14, ease: 'easeOut' } 
    }
  });

  const captionVariants = {
    hidden: { opacity: 0, y: 6 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { duration: 0.6, delay: 1.25, ease: 'easeOut' } 
    }
  };

  return (
    <motion.div
      ref={stageRef}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-60px' }}
      variants={stageVariants}
      onPointerMove={handlePointerMove}
      onPointerEnter={() => setIsHovered(true)}
      onPointerLeave={handlePointerLeave}
      className="relative w-full max-w-[560px] mx-auto rounded-3xl bg-gradient-to-b from-[#06261F] via-[#003B3C] to-[#041D17] border border-fb-teal/30 p-6 sm:p-8 md:p-10 shadow-[0_20px_50px_rgba(0,37,38,0.35)] overflow-hidden select-none cursor-default group"
      style={{ perspective: 1200 }}
      role="img"
      aria-label={isAr 
        ? "نسر الرؤية الاستشرافية ثلاثي الأبعاد لشركة F.B لإدارة الأصول وتوفير المواقع التجارية في مصر"
        : "Abstract geometric eagle representing F.B Company's location intelligence and commercial opportunity sourcing."
      }
    >
      {/* Background Stage: Matte Institutional Atmosphere & Grid */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-fb-green/10 via-transparent to-black/40 pointer-events-none" />
      
      {/* Subtle Architectural Coordinate Grid */}
      <div 
        className="absolute inset-0 opacity-[0.05] pointer-events-none" 
        style={{
          backgroundImage: 'linear-gradient(to right, #8BD7AE 1px, transparent 1px), linear-gradient(to bottom, #8BD7AE 1px, transparent 1px)',
          backgroundSize: '28px 28px'
        }} 
      />

      {/* Ambient Focal Glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-fb-green/15 rounded-full blur-3xl pointer-events-none" />

      {/* 3D Scene Root Canvas */}
      <div className="relative w-full aspect-[4/3.4] flex items-center justify-center">
        
        {/* LAYER 1: Commercial Corridor Platform (Moves subtly in reverse) */}
        <motion.div
          variants={platformVariants}
          style={{
            rotateX: shouldReduceMotion ? 0 : platformRotateX,
            rotateY: shouldReduceMotion ? 0 : platformRotateY,
            x: shouldReduceMotion ? 0 : platformTranslateX,
            y: shouldReduceMotion ? 0 : scrollPlatformY,
            transformStyle: 'preserve-3d',
          }}
          className="absolute bottom-4 sm:bottom-6 w-full max-w-[420px] h-[130px] flex items-center justify-center pointer-events-none"
        >
          <svg viewBox="0 0 420 140" className="w-full h-full drop-shadow-[0_12px_24px_rgba(0,0,0,0.6)]">
            <defs>
              <linearGradient id="platformTop" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#0A4D3E" />
                <stop offset="50%" stopColor="#063D31" />
                <stop offset="100%" stopColor="#03241C" />
              </linearGradient>
              <linearGradient id="platformSideLeft" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#06352B" />
                <stop offset="100%" stopColor="#021A14" />
              </linearGradient>
              <linearGradient id="platformSideRight" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#04261F" />
                <stop offset="100%" stopColor="#01100C" />
              </linearGradient>
              <linearGradient id="corridorGlow" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#53B379" stopOpacity="0.1" />
                <stop offset="50%" stopColor="#8BD7AE" stopOpacity="0.95" />
                <stop offset="100%" stopColor="#53B379" stopOpacity="0.2" />
              </linearGradient>
            </defs>

            {/* Isometric Pedestal Base: Top Face */}
            <polygon 
              points="210,18 390,62 210,106 30,62" 
              fill="url(#platformTop)" 
              stroke="#53B379" 
              strokeWidth="1.2" 
              strokeOpacity="0.35"
            />

            {/* Isometric Pedestal Base: Left Front Edge */}
            <polygon 
              points="30,62 210,106 210,126 30,82" 
              fill="url(#platformSideLeft)" 
              stroke="#53B379" 
              strokeWidth="0.8" 
              strokeOpacity="0.2"
            />

            {/* Isometric Pedestal Base: Right Front Edge */}
            <polygon 
              points="210,106 390,62 390,82 210,126" 
              fill="url(#platformSideRight)" 
              stroke="#53B379" 
              strokeWidth="0.8" 
              strokeOpacity="0.2"
            />

            {/* Inner Corridor Guidance Grid Lines */}
            <line x1="120" y1="40" x2="300" y2="84" stroke="#8BD7AE" strokeWidth="0.8" strokeOpacity="0.2" strokeDasharray="3 3" />
            <line x1="300" y1="40" x2="120" y2="84" stroke="#8BD7AE" strokeWidth="0.8" strokeOpacity="0.2" strokeDasharray="3 3" />
            
            {/* LAYER 5: The Pale-Green/White Route Line */}
            <motion.path
              d="M 55,68 Q 140,88 210,64 T 365,58"
              fill="none"
              stroke="url(#corridorGlow)"
              strokeWidth="2.4"
              strokeLinecap="round"
              variants={routeLineVariants}
            />

            {/* LAYER 6: Three Opportunity Nodes (Location Signals) */}
            {/* Node 1: Left Axis Entry */}
            <g transform="translate(100, 75)">
              <motion.circle 
                r="10" 
                fill="#8BD7AE" 
                fillOpacity="0.18"
                animate={shouldReduceMotion ? {} : { scale: [1, 1.45, 1], opacity: [0.3, 0.05, 0.3] }}
                transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
              />
              <motion.circle 
                custom={0} 
                variants={nodeVariants(0)} 
                r="3.5" 
                fill="#8BD7AE" 
                stroke="#FFFFFF" 
                strokeWidth="1.2" 
              />
            </g>

            {/* Node 2: Center Prime Hub (Apex Location - Brightens on Hover) */}
            <g transform="translate(210, 64)">
              <motion.circle 
                r="14" 
                fill="#53B379" 
                fillOpacity={isHovered ? 0.45 : 0.22}
                animate={shouldReduceMotion ? {} : { scale: isHovered ? [1.1, 1.7, 1.1] : [1, 1.5, 1], opacity: [0.4, 0.1, 0.4] }}
                transition={{ duration: isHovered ? 1.8 : 2.6, repeat: Infinity, ease: 'easeInOut' }}
              />
              <motion.circle 
                custom={1} 
                variants={nodeVariants(1)} 
                r={isHovered ? "5" : "4.2"} 
                fill={isHovered ? "#FFFFFF" : "#53B379"} 
                stroke="#8BD7AE" 
                strokeWidth="1.5" 
                style={{ filter: isHovered ? 'drop-shadow(0 0 6px #8BD7AE)' : 'none' }}
              />
            </g>

            {/* Node 3: Right Corridor Target */}
            <g transform="translate(320, 60)">
              <motion.circle 
                r="10" 
                fill="#8BD7AE" 
                fillOpacity="0.18"
                animate={shouldReduceMotion ? {} : { scale: [1, 1.45, 1], opacity: [0.3, 0.05, 0.3] }}
                transition={{ duration: 3.4, repeat: Infinity, delay: 0.8, ease: 'easeInOut' }}
              />
              <motion.circle 
                custom={2} 
                variants={nodeVariants(2)} 
                r="3.5" 
                fill="#8BD7AE" 
                stroke="#FFFFFF" 
                strokeWidth="1.2" 
              />
            </g>
          </svg>
        </motion.div>

        {/* LAYER 2, 3, 4: Faceted Geometric Eagle Sculpture */}
        <motion.div
          variants={eagleBodyVariants}
          style={{
            rotateX: shouldReduceMotion ? 0 : rotateX,
            rotateY: shouldReduceMotion ? 0 : rotateY,
            x: shouldReduceMotion ? 0 : eagleTranslateX,
            y: shouldReduceMotion ? 0 : scrollEagleY,
            transformStyle: 'preserve-3d',
          }}
          className="relative w-[300px] sm:w-[350px] md:w-[380px] h-[250px] sm:h-[280px] flex items-center justify-center z-20 pointer-events-none"
        >
          <svg 
            viewBox="0 0 380 280" 
            className="w-full h-full overflow-visible drop-shadow-[0_16px_32px_rgba(0,0,0,0.55)]"
          >
            <defs>
              {/* Matte Architectural Gradients - Strict Brand Palette */}
              <linearGradient id="headFacetLeft" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FFFFFF" />
                <stop offset="60%" stopColor="#E2ECE8" />
                <stop offset="100%" stopColor="#B3D8CB" />
              </linearGradient>
              <linearGradient id="headFacetRight" x1="100%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#D4E4DE" />
                <stop offset="60%" stopColor="#96C7B6" />
                <stop offset="100%" stopColor="#6DAF9A" />
              </linearGradient>
              <linearGradient id="beakFacet" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#8BD7AE" />
                <stop offset="100%" stopColor="#419E67" />
              </linearGradient>
              <linearGradient id="chestPrimary" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#0C6B52" />
                <stop offset="60%" stopColor="#063D31" />
                <stop offset="100%" stopColor="#02211A" />
              </linearGradient>
              <linearGradient id="chestLight" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#53B379" />
                <stop offset="100%" stopColor="#0C6B52" />
              </linearGradient>
              <linearGradient id="chestDark" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#063D31" />
                <stop offset="100%" stopColor="#011612" />
              </linearGradient>
              <linearGradient id="wingPrimaryLeft" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#53B379" />
                <stop offset="40%" stopColor="#0C6B52" />
                <stop offset="100%" stopColor="#063D31" />
              </linearGradient>
              <linearGradient id="wingPrimaryRight" x1="100%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#0C6B52" />
                <stop offset="50%" stopColor="#063D31" />
                <stop offset="100%" stopColor="#021E18" />
              </linearGradient>
              <linearGradient id="wingTipHighlight" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#8BD7AE" />
                <stop offset="100%" stopColor="#53B379" />
              </linearGradient>
            </defs>

            {/* === LEFT WING ASSEMBLY === */}
            <motion.g 
              variants={wingLeftVariants}
              style={{ x: shouldReduceMotion ? 0 : leftWingX }}
            >
              {/* Upper Primary Wing Plane */}
              <polygon 
                points="190,105 130,55 35,45 105,108 165,122" 
                fill="url(#wingPrimaryLeft)" 
                stroke="#8BD7AE" 
                strokeWidth="0.8" 
                strokeOpacity="0.45" 
              />
              {/* Leading Top Feather Facet */}
              <polygon 
                points="130,55 35,45 15,62 85,92 105,108" 
                fill="url(#wingTipHighlight)" 
                stroke="#FFFFFF" 
                strokeWidth="0.6" 
                strokeOpacity="0.4" 
              />
              {/* Mid Wing Tier Facet 1 */}
              <polygon 
                points="105,108 35,45 8,80 75,130 145,138" 
                fill="#0C6B52" 
                stroke="#8BD7AE" 
                strokeWidth="0.7" 
                strokeOpacity="0.3" 
              />
              {/* Mid Wing Tier Facet 2 */}
              <polygon 
                points="145,138 75,130 20,118 68,162 160,154" 
                fill="#063D31" 
                stroke="#53B379" 
                strokeWidth="0.7" 
                strokeOpacity="0.25" 
              />
              {/* Lower Flight Feathers */}
              <polygon 
                points="160,154 68,162 45,160 85,188 175,172" 
                fill="#04261F" 
                stroke="#53B379" 
                strokeWidth="0.6" 
                strokeOpacity="0.2" 
              />
              {/* Deep Inner Under-Wing Shadow */}
              <polygon 
                points="175,172 85,188 78,198 120,214 185,188" 
                fill="#021713" 
                stroke="#8BD7AE" 
                strokeWidth="0.5" 
                strokeOpacity="0.15" 
              />
            </motion.g>

            {/* === RIGHT WING ASSEMBLY === */}
            <motion.g 
              variants={wingRightVariants}
              style={{ x: shouldReduceMotion ? 0 : rightWingX }}
            >
              {/* Upper Primary Wing Plane */}
              <polygon 
                points="190,105 250,55 345,45 275,108 215,122" 
                fill="url(#wingPrimaryRight)" 
                stroke="#8BD7AE" 
                strokeWidth="0.8" 
                strokeOpacity="0.35" 
              />
              {/* Leading Top Feather Facet */}
              <polygon 
                points="250,55 345,45 365,62 295,92 275,108" 
                fill="#0C6B52" 
                stroke="#8BD7AE" 
                strokeWidth="0.6" 
                strokeOpacity="0.35" 
              />
              {/* Mid Wing Tier Facet 1 */}
              <polygon 
                points="275,108 345,45 372,80 305,130 235,138" 
                fill="#063D31" 
                stroke="#53B379" 
                strokeWidth="0.7" 
                strokeOpacity="0.25" 
              />
              {/* Mid Wing Tier Facet 2 */}
              <polygon 
                points="235,138 305,130 360,118 312,162 220,154" 
                fill="#04261F" 
                stroke="#53B379" 
                strokeWidth="0.7" 
                strokeOpacity="0.2" 
              />
              {/* Lower Flight Feathers */}
              <polygon 
                points="220,154 312,162 335,160 295,188 205,172" 
                fill="#021E18" 
                stroke="#53B379" 
                strokeWidth="0.6" 
                strokeOpacity="0.2" 
              />
              {/* Deep Inner Under-Wing Shadow */}
              <polygon 
                points="205,172 295,188 302,198 260,214 195,188" 
                fill="#01100C" 
                stroke="#8BD7AE" 
                strokeWidth="0.5" 
                strokeOpacity="0.15" 
              />
            </motion.g>

            {/* === TAIL / PERCHING BASE FACETS === */}
            <polygon 
              points="190,195 168,238 190,252 212,238" 
              fill="#03241C" 
              stroke="#53B379" 
              strokeWidth="0.8" 
              strokeOpacity="0.3" 
            />
            <polygon 
              points="168,238 152,246 172,256 190,252" 
              fill="#021813" 
              stroke="#53B379" 
              strokeWidth="0.6" 
              strokeOpacity="0.2" 
            />
            <polygon 
              points="212,238 228,246 208,256 190,252" 
              fill="#01120E" 
              stroke="#53B379" 
              strokeWidth="0.6" 
              strokeOpacity="0.2" 
            />

            {/* === EAGLE TORSO & CHEST (Faceted Armor Plates) === */}
            {/* Center Spine Upper */}
            <polygon 
              points="190,95 174,124 190,148 206,124" 
              fill="url(#chestLight)" 
              stroke="#FFFFFF" 
              strokeWidth="0.8" 
              strokeOpacity="0.5" 
            />
            {/* Left Breast Plate */}
            <polygon 
              points="190,95 174,124 152,142 165,122" 
              fill="#53B379" 
              stroke="#8BD7AE" 
              strokeWidth="0.7" 
              strokeOpacity="0.4" 
            />
            {/* Right Breast Plate */}
            <polygon 
              points="190,95 206,124 228,142 215,122" 
              fill="#0C6B52" 
              stroke="#8BD7AE" 
              strokeWidth="0.7" 
              strokeOpacity="0.35" 
            />
            {/* Mid Sternum Left */}
            <polygon 
              points="174,124 190,148 182,185 158,162 152,142" 
              fill="#0C6B52" 
              stroke="#53B379" 
              strokeWidth="0.7" 
              strokeOpacity="0.3" 
            />
            {/* Mid Sternum Right */}
            <polygon 
              points="206,124 190,148 198,185 222,162 228,142" 
              fill="#063D31" 
              stroke="#53B379" 
              strokeWidth="0.7" 
              strokeOpacity="0.25" 
            />
            {/* Lower Abdomen Center */}
            <polygon 
              points="190,148 182,185 190,205 198,185" 
              fill="url(#chestPrimary)" 
              stroke="#8BD7AE" 
              strokeWidth="0.8" 
              strokeOpacity="0.4" 
            />
            {/* Lower Flank Left */}
            <polygon 
              points="182,185 190,205 172,228 162,192" 
              fill="#042820" 
              stroke="#53B379" 
              strokeWidth="0.6" 
              strokeOpacity="0.2" 
            />
            {/* Lower Flank Right */}
            <polygon 
              points="198,185 190,205 208,228 218,192" 
              fill="#021A15" 
              stroke="#53B379" 
              strokeWidth="0.6" 
              strokeOpacity="0.2" 
            />

            {/* === HEAD & BEAK SCULPTURE (Foresight Intelligence Apex) === */}
            {/* Neck Collar */}
            <polygon 
              points="190,82 178,98 190,105 202,98" 
              fill="#DCE8E3" 
              stroke="#FFFFFF" 
              strokeWidth="0.8" 
              strokeOpacity="0.6" 
            />
            {/* Head Left Crown */}
            <polygon 
              points="190,44 172,62 178,98 190,82" 
              fill="url(#headFacetLeft)" 
              stroke="#FFFFFF" 
              strokeWidth="0.9" 
              strokeOpacity="0.7" 
            />
            {/* Head Right Crown */}
            <polygon 
              points="190,44 208,62 202,98 190,82" 
              fill="url(#headFacetRight)" 
              stroke="#8BD7AE" 
              strokeWidth="0.8" 
              strokeOpacity="0.5" 
            />
            {/* Crown Crest Top Apex */}
            <polygon 
              points="190,32 182,46 190,44 198,46" 
              fill="#FFFFFF" 
              stroke="#8BD7AE" 
              strokeWidth="0.8" 
              strokeOpacity="0.8" 
            />
            {/* Forehead Center Spine */}
            <polygon 
              points="190,44 184,66 190,74 196,66" 
              fill="#FFFFFF" 
              stroke="#8BD7AE" 
              strokeWidth="0.8" 
              strokeOpacity="0.6" 
            />
            {/* Left Eye Brow Facet */}
            <polygon 
              points="184,66 172,62 170,74 182,78 190,74" 
              fill="#B8DCD0" 
              stroke="#FFFFFF" 
              strokeWidth="0.6" 
              strokeOpacity="0.5" 
            />
            {/* Right Eye Brow Facet */}
            <polygon 
              points="196,66 208,62 210,74 198,78 190,74" 
              fill="#74B49E" 
              stroke="#53B379" 
              strokeWidth="0.6" 
              strokeOpacity="0.4" 
            />
            {/* The Foresight Eye (Emerald Focus Node) */}
            <circle cx="180" cy="72" r="1.8" fill="#53B379" />
            <circle cx="200" cy="72" r="1.8" fill="#0C6B52" />

            {/* Beak Upper Facet Left (Sharp Golden-Ratio Emerald Edge) */}
            <polygon 
              points="190,74 182,78 190,98" 
              fill="url(#beakFacet)" 
              stroke="#FFFFFF" 
              strokeWidth="0.8" 
              strokeOpacity="0.7" 
            />
            {/* Beak Upper Facet Right */}
            <polygon 
              points="190,74 198,78 190,98" 
              fill="#2E7E50" 
              stroke="#8BD7AE" 
              strokeWidth="0.7" 
              strokeOpacity="0.5" 
            />
            {/* Beak Under Hook */}
            <polygon 
              points="190,98 185,88 190,84 195,88" 
              fill="#063D31" 
              stroke="#8BD7AE" 
              strokeWidth="0.5" 
              strokeOpacity="0.3" 
            />
          </svg>
        </motion.div>

      </div>

      {/* Caption & Institutional State Indicator */}
      <motion.div
        variants={captionVariants}
        className="relative z-20 pt-4 mt-2 border-t border-fb-teal/20 flex flex-col sm:flex-row items-center justify-between gap-2.5 text-center sm:text-start"
      >
        <div className="flex items-center space-x-2 rtl:space-x-reverse">
          <span className="w-2 h-2 rounded-full bg-fb-green animate-pulse" />
          <span className="text-[11px] sm:text-xs font-mono font-bold tracking-wider text-fb-green uppercase transition-all duration-300">
            {isHovered 
              ? (isAr ? 'رصد الفرصة الاستثمارية' : 'IDENTIFYING THE OPPORTUNITY') 
              : (isAr ? 'الرؤية الاستشرافية / ذكاء المواقع' : 'FORESIGHT / LOCATION INTELLIGENCE')
            }
          </span>
        </div>

        <div className="text-[10px] sm:text-[11px] font-mono text-fb-bg-light/60 tracking-wider">
          {isAr ? 'F.B COMPANY • إدارة الأصول وتوفير المواقع' : 'F.B COMPANY • ASSET INTELLIGENCE'}
        </div>
      </motion.div>
    </motion.div>
  );
}
