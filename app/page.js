'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, ShieldCheck, Target, BarChart4, Cpu, Search, Compass, Shield, TrendingUp, Fuel, Building2, Store, FileText, Download, CheckCircle2 } from 'lucide-react';
import projectsData from '@/data/projects.json';
import ProjectDrawer from '@/components/ProjectDrawer';
import TenantPartnershipSection from '@/components/TenantPartnershipSection';
import InteractiveEarthFocus from '@/components/InteractiveEarthFocus';
import PartnersMarquee from '@/components/PartnersMarquee';
import PortfolioTimeline from '@/components/PortfolioTimeline';
import BlogSection from '@/components/BlogSection';
import CompanyProfile from '@/components/CompanyProfile';
import { useLanguage } from '@/context/LanguageContext';
import { useData } from '@/context/DataContext';

function Counter({ value, duration = 1.5 }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (isInView) {
      let start = 0;
      const isPercent = value.includes('%');
      const isPlus = value.includes('+');

      const end = parseInt(value.replace(/[^0-9]/g, ''), 10);
      if (isNaN(end) || start === end) return;

      const totalMiliseconds = duration * 1000;
      const incrementTime = Math.max(Math.floor(totalMiliseconds / end), 15);

      const timer = setInterval(() => {
        start += Math.ceil(end / (totalMiliseconds / incrementTime));
        if (start >= end) {
          clearInterval(timer);
          start = end;
        }
        setCount(start);
      }, incrementTime);

      return () => clearInterval(timer);
    }
  }, [isInView, value, duration]);

  const formatNumber = (num) => {
    const formatted = num.toLocaleString();
    const isPercent = value.includes('%');
    const isPlus = value.includes('+');

    if (isPlus && value.startsWith('+')) return `+${formatted}`;
    if (isPlus && value.endsWith('+')) return `${formatted}+`;
    if (isPercent) return `${formatted}%`;
    return formatted;
  };

  return <span ref={ref}>{formatNumber(count)}</span>;
}

const corporateEase = [0.22, 1, 0.36, 1];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1,
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 25 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: corporateEase }
  }
};

export default function Home() {
  const [selectedProject, setSelectedProject] = useState(null);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const { locale, t } = useLanguage();
  const { projects, counters } = useData();
  const heroRef = useRef(null);

  // 3D Parallax Scroll transforms
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });

  const heroBgY = useTransform(scrollYProgress, [0, 1], ["0%", "28%"]);
  const heroTextY = useTransform(scrollYProgress, [0, 1], ["0%", "35%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 0.95]);

  // Word-by-word reveal for hero headline
  const heroWords = t('nav.tagline').split(" ");
  const wordVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.12,
        duration: 0.6,
        ease: corporateEase,
      },
    }),
  };

  const getField = (obj, field) => {
    if (locale === 'ar') {
      return obj[`${field}_ar`] || obj[field];
    }
    return obj[field];
  };

  const usps = [
    {
      icon: <Cpu strokeWidth={1.5} size={24} />,
      watermark: <Cpu size={110} />,
      title: t('home.usp.items.0.title'),
      desc: t('home.usp.items.0.desc')
    },
    {
      icon: <ShieldCheck strokeWidth={1.5} size={24} />,
      watermark: <ShieldCheck size={110} />,
      title: t('home.usp.items.1.title'),
      desc: t('home.usp.items.1.desc')
    },
    {
      icon: <Target strokeWidth={1.5} size={24} />,
      watermark: <Target size={110} />,
      title: t('home.usp.items.2.title'),
      desc: t('home.usp.items.2.desc')
    },
    {
      icon: <BarChart4 strokeWidth={1.5} size={24} />,
      watermark: <BarChart4 size={110} />,
      title: t('home.usp.items.3.title'),
      desc: t('home.usp.items.3.desc')
    }
  ];

  const valueTimeline = [
    { step: "01", name: t('home.methodology.steps.0.name'), icon: <Search strokeWidth={1.5} size={20} />, desc: t('home.methodology.steps.0.desc') },
    { step: "02", name: t('home.methodology.steps.1.name'), icon: <Compass strokeWidth={1.5} size={20} />, desc: t('home.methodology.steps.1.desc') },
    { step: "03", name: t('home.methodology.steps.2.name'), icon: <Shield strokeWidth={1.5} size={20} />, desc: t('home.methodology.steps.2.desc') },
    { step: "04", name: t('home.methodology.steps.3.name'), icon: <TrendingUp strokeWidth={1.5} size={20} />, desc: t('home.methodology.steps.3.desc') }
  ];

  return (
    <div className="flex flex-col min-h-screen relative bg-fb-bg-light">

      {/* 1. HERO SECTION (Signature Centered Experience with 3D Parallax) */}
      <section ref={heroRef} className="relative h-screen bg-fb-teal flex flex-col justify-center items-center overflow-hidden px-6">
        {/* Background Video Layer with Parallax Depth */}
        <motion.div
          style={{ y: heroBgY, willChange: 'transform' }}
          className="absolute inset-0 w-full h-full pointer-events-none z-0"
        >
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover opacity-40 scale-105"
          >
            <source src="/videos/hero-bg.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-fb-teal/60 mix-blend-multiply pointer-events-none" />
          <div className="absolute inset-0 hero-grid-overlay pointer-events-none" />
        </motion.div>

        {/* Slowly shifting gradients and glowing nodes (GPU-accelerated CSS) */}
        <div className="absolute top-1/4 left-1/4 w-[30rem] h-[30rem] bg-fb-green/10 rounded-full blur-3xl pointer-events-none transform-gpu animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-[35rem] h-[35rem] bg-fb-green/5 rounded-full blur-3xl pointer-events-none transform-gpu animate-pulse [animation-duration:8s]" />

        {/* Foreground Content with Floating Parallax */}
        <motion.div
          style={{
            y: heroTextY,
            opacity: heroOpacity,
            scale: heroScale,
            willChange: 'transform, opacity'
          }}
          className="max-w-4xl mx-auto text-center z-10 space-y-6"
        >
          <span className="eyebrow text-fb-green font-bold block mb-4 tracking-[0.25em]">{t('home.eyebrow')}</span>

          <h1 className="text-fb-bg-light tracking-tight flex justify-center flex-wrap gap-x-2 sm:gap-x-3 mb-2">
            {heroWords.map((word, idx) => (
              <motion.span
                key={idx}
                custom={idx}
                initial="hidden"
                animate="visible"
                variants={wordVariants}
                className="inline-block font-extrabold text-3xl sm:text-4xl md:text-5xl lg:text-6xl"
              >
                {word}
              </motion.span>
            ))}
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5, ease: corporateEase }}
            className="text-fb-bg-light/80 text-sm sm:text-base md:text-lg max-w-2xl mx-auto font-light leading-relaxed mb-6 px-2"
          >
            {t('home.subheadline')}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7, ease: corporateEase }}
            className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-4 max-w-sm sm:max-w-none mx-auto w-full"
          >
            <Link
              href="/contact?interest=consultation#consultation-form"
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 rtl:space-x-reverse bg-fb-green hover:bg-fb-green-hover text-fb-teal font-extrabold px-7 py-3.5 sm:px-8 sm:py-4 rounded-xl text-sm transition-all duration-300 shadow-lg hover:shadow-fb-green/20 hover:-translate-y-0.5 active:scale-98"
            >
              <span>{t('common.bookConsultation')}</span>
              <ArrowRight size={16} className={locale === 'ar' ? 'rotate-180' : ''} />
            </Link>
            <button
              type="button"
              onClick={() => setIsProfileModalOpen(true)}
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 rtl:space-x-reverse bg-white/5 hover:bg-fb-bg-light/10 text-fb-bg-light border border-fb-bg-light/25 font-bold px-7 py-3.5 sm:px-8 sm:py-4 rounded-xl text-sm transition-all duration-300 cursor-pointer shadow-sm hover:border-fb-green/40 hover:-translate-y-0.5 active:scale-98"
            >
              <FileText size={16} className="text-fb-green shrink-0" />
              <span>{t('common.companyProfile')}</span>
            </button>
          </motion.div>
        </motion.div>
      </section>

      {/* 2. SUCCESS NUMBERS BAND (Statement on Left + 2x2 Square Grid on Right with Brand Light Background) */}
      <section className="bg-fb-bg-light border-y border-fb-teal/10 py-14 sm:py-20 md:py-28 px-4 sm:px-6 flex flex-col justify-center relative overflow-hidden z-20">
        {/* Subtle Ambient Radial Glow */}
        <div
          className="absolute top-1/2 right-1/4 -translate-y-1/2 w-[500px] h-[350px] bg-fb-green/5 rounded-full blur-[100px] pointer-events-none"
          aria-hidden="true"
        />

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center relative z-10">

          {/* Left Column: Authoritative Institutional Statement */}
          <div className="lg:col-span-5 space-y-6 text-start">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-fb-teal/5 border border-fb-teal/10 text-fb-green text-xs font-bold uppercase tracking-widest">
              <BarChart4 size={14} />
              <span>{locale === 'ar' ? 'مؤشرات الأداء المؤسسي' : 'PROVEN TRACK RECORD'}</span>
            </div>

            <h2 className="text-fb-teal font-extrabold text-3xl sm:text-4xl lg:text-5xl tracking-tight leading-tight">
              {locale === 'ar'
                ? 'أرقام وحقائق تعكس حجم انتشارنا وريادة أصولنا'
                : 'Delivering Scale, Precision, and Sustained Value Across Egypt.'}
            </h2>

            <p className="text-fb-black/75 text-sm md:text-base font-normal leading-relaxed">
              {locale === 'ar'
                ? 'نرتكز على الدراسات الميدانية لحركة المرور وتأمين الشراكات مع كبرى العلامات التجارية لتحقيق استقرار تشغيلي كامل وعوائد استثمارية قياسية.'
                : 'Our data-backed sourcing frameworks and long-term asset management consistently guarantee 100% occupancy across premium arterial corridors.'}
            </p>

            <div className="pt-2 flex items-center gap-3 text-xs font-semibold text-fb-green tracking-wide">
              <ShieldCheck size={18} className="shrink-0" />
              <span>{locale === 'ar' ? 'بيانات وإحصاءات معتمدة ومحدثة دورياً' : 'Audited and verified institutional metrics'}</span>
            </div>
          </div>

          {/* Right Column: 2x2 Balanced Metric Cards matching Page Background with Distinct Borders */}
          <div className="lg:col-span-7 grid grid-cols-2 gap-4 sm:gap-6">

            {/* Card 1: SQM Managed */}
            <div className="bg-fb-bg-light/90 border border-fb-teal/15 hover:border-fb-green transition-all duration-300 rounded-3xl p-6 sm:p-8 flex flex-col justify-between min-h-[180px] sm:min-h-[205px] group shadow-[0_8px_30px_rgba(0,59,60,0.05)] hover:shadow-[0_15px_35px_rgba(83,179,121,0.15)] hover:-translate-y-1.5 relative overflow-hidden">
              {/* Large Background Overlay Watermark Icon */}
              <Building2 size={115} className="absolute -bottom-5 -right-5 rtl:-left-5 rtl:right-auto text-fb-teal/[0.05] group-hover:text-fb-green/[0.12] group-hover:scale-110 group-hover:-rotate-6 transition-all duration-500 pointer-events-none" />

              <div className="flex items-center justify-between relative z-10">
                <div className="w-11 h-11 rounded-2xl bg-fb-teal/5 border border-fb-teal/15 flex items-center justify-center text-fb-green group-hover:scale-110 group-hover:bg-fb-green group-hover:text-fb-teal transition-all shadow-xs">
                  <Building2 size={20} />
                </div>
                <span className="text-xs font-mono font-bold text-fb-teal/40 uppercase tracking-widest">01</span>
              </div>
              <div className="space-y-1 relative z-10 pt-4">
                <div className="text-fb-teal font-black text-3xl sm:text-4xl lg:text-5xl font-mono tracking-tight group-hover:text-fb-green transition-colors">
                  <Counter value={counters?.sqm || "500,000+"} />
                </div>
                <div className="text-xs sm:text-sm font-extrabold tracking-wider text-fb-black/80 uppercase leading-snug">
                  {t('home.counters.sqm')}
                </div>
              </div>
            </div>

            {/* Card 2: Occupancy Rate */}
            <div className="bg-fb-bg-light/90 border border-fb-teal/15 hover:border-fb-green transition-all duration-300 rounded-3xl p-6 sm:p-8 flex flex-col justify-between min-h-[180px] sm:min-h-[205px] group shadow-[0_8px_30px_rgba(0,59,60,0.05)] hover:shadow-[0_15px_35px_rgba(83,179,121,0.15)] hover:-translate-y-1.5 relative overflow-hidden">
              {/* Large Background Overlay Watermark Icon */}
              <TrendingUp size={115} className="absolute -bottom-5 -right-5 rtl:-left-5 rtl:right-auto text-fb-teal/[0.05] group-hover:text-fb-green/[0.12] group-hover:scale-110 group-hover:-rotate-6 transition-all duration-500 pointer-events-none" />

              <div className="flex items-center justify-between relative z-10">
                <div className="w-11 h-11 rounded-2xl bg-fb-teal/5 border border-fb-teal/15 flex items-center justify-center text-fb-green group-hover:scale-110 group-hover:bg-fb-green group-hover:text-fb-teal transition-all shadow-xs">
                  <TrendingUp size={20} />
                </div>
                <span className="text-xs font-mono font-bold text-fb-teal/40 uppercase tracking-widest">02</span>
              </div>
              <div className="space-y-1 relative z-10 pt-4">
                <div className="text-fb-teal font-black text-3xl sm:text-4xl lg:text-5xl font-mono tracking-tight group-hover:text-fb-green transition-colors">
                  <Counter value={counters?.occupancy || "100%"} />
                </div>
                <div className="text-xs sm:text-sm font-extrabold tracking-wider text-fb-black/80 uppercase leading-snug">
                  {t('home.counters.occupancy')}
                </div>
              </div>
            </div>

            {/* Card 3: Brand Partners */}
            <div className="bg-fb-bg-light/90 border border-fb-teal/15 hover:border-fb-green transition-all duration-300 rounded-3xl p-6 sm:p-8 flex flex-col justify-between min-h-[180px] sm:min-h-[205px] group shadow-[0_8px_30px_rgba(0,59,60,0.05)] hover:shadow-[0_15px_35px_rgba(83,179,121,0.15)] hover:-translate-y-1.5 relative overflow-hidden">
              {/* Large Background Overlay Watermark Icon */}
              <Store size={115} className="absolute -bottom-5 -right-5 rtl:-left-5 rtl:right-auto text-fb-teal/[0.05] group-hover:text-fb-green/[0.12] group-hover:scale-110 group-hover:-rotate-6 transition-all duration-500 pointer-events-none" />

              <div className="flex items-center justify-between relative z-10">
                <div className="w-11 h-11 rounded-2xl bg-fb-teal/5 border border-fb-teal/15 flex items-center justify-center text-fb-green group-hover:scale-110 group-hover:bg-fb-green group-hover:text-fb-teal transition-all shadow-xs">
                  <Store size={20} />
                </div>
                <span className="text-xs font-mono font-bold text-fb-teal/40 uppercase tracking-widest">03</span>
              </div>
              <div className="space-y-1 relative z-10 pt-4">
                <div className="text-fb-teal font-black text-3xl sm:text-4xl lg:text-5xl font-mono tracking-tight group-hover:text-fb-green transition-colors">
                  <Counter value={counters?.brands || "200+"} />
                </div>
                <div className="text-xs sm:text-sm font-extrabold tracking-wider text-fb-black/80 uppercase leading-snug">
                  {t('home.counters.brands')}
                </div>
              </div>
            </div>

            {/* Card 4: Commercial Projects */}
            <div className="bg-fb-bg-light/90 border border-fb-teal/15 hover:border-fb-green transition-all duration-300 rounded-3xl p-6 sm:p-8 flex flex-col justify-between min-h-[180px] sm:min-h-[205px] group shadow-[0_8px_30px_rgba(0,59,60,0.05)] hover:shadow-[0_15px_35px_rgba(83,179,121,0.15)] hover:-translate-y-1.5 relative overflow-hidden">
              {/* Large Background Overlay Watermark Icon */}
              <Fuel size={115} className="absolute -bottom-5 -right-5 rtl:-left-5 rtl:right-auto text-fb-teal/[0.05] group-hover:text-fb-green/[0.12] group-hover:scale-110 group-hover:-rotate-6 transition-all duration-500 pointer-events-none" />

              <div className="flex items-center justify-between relative z-10">
                <div className="w-11 h-11 rounded-2xl bg-fb-teal/5 border border-fb-teal/15 flex items-center justify-center text-fb-green group-hover:scale-110 group-hover:bg-fb-green group-hover:text-fb-teal transition-all shadow-xs">
                  <Fuel size={20} />
                </div>
                <span className="text-xs font-mono font-bold text-fb-teal/40 uppercase tracking-widest">04</span>
              </div>
              <div className="space-y-1 relative z-10 pt-4">
                <div className="text-fb-teal font-black text-3xl sm:text-4xl lg:text-5xl font-mono tracking-tight group-hover:text-fb-green transition-colors">
                  <Counter value={counters?.gas || "8+"} />
                </div>
                <div className="text-xs sm:text-sm font-extrabold tracking-wider text-fb-black/80 uppercase leading-snug">
                  {t('home.counters.gas')}
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 3. SUCCESS PARTNERS EXPERIENCE (Marquee Logos Row) */}
      <PartnersMarquee />

      {/* 4. ABOUT F.B COMPANY (Split Screen + Radar Scan Visual) */}
      <section className="py-24 bg-fb-bg-light">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center"
        >
          {/* Left Text */}
          <div className="space-y-6">
            <span className="eyebrow">{t('home.about.eyebrow')}</span>
            <h2 className="text-fb-teal font-bold">{t('home.about.title')}</h2>
            <div className="text-fb-black/80 text-sm md:text-base leading-relaxed space-y-4">
              <p>
                {t('home.about.p1')}
              </p>
              <p className="text-xs md:text-sm text-fb-black/60 italic border-l-2 border-fb-green pl-4">
                {t('home.about.p2')}
              </p>
            </div>
            <div className="pt-2">
              <Link
                href="/about"
                className="inline-flex items-center space-x-1.5 text-fb-teal font-bold text-xs uppercase tracking-wider hover:text-fb-green transition-colors"
              >
                <span>{t('home.about.link')}</span>
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>

          {/* Right Visual: Interactive Earth / Egypt Strategic Focus */}
          <div className="w-full flex justify-center lg:justify-end">
            <InteractiveEarthFocus />
          </div>
        </motion.div>
      </section>

      {/* 5. WHY F.B COMPANY (Institutional Strengths) */}
      <section className="py-24 bg-fb-bg-light/30 border-t border-fb-teal/5">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
          className="max-w-7xl mx-auto px-6 space-y-12"
        >
          <div className="text-center space-y-4">
            <span className="eyebrow">{t('home.usp.eyebrow')}</span>
            <h2 className="text-fb-teal font-bold">{t('home.usp.title')}</h2>
          </div>

          <motion.div
            variants={containerVariants}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {usps.map((usp, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="bg-fb-bg-light/90 border border-fb-teal/15 p-6 sm:p-7 rounded-3xl space-y-4 shadow-[0_8px_30px_rgba(0,59,60,0.05)] hover:shadow-[0_15px_35px_rgba(83,179,121,0.15)] hover:border-fb-green hover:-translate-y-1.5 transition-all duration-300 group relative overflow-hidden flex flex-col justify-between"
              >
                {/* Large Background Overlay Watermark Icon */}
                <div className="absolute -bottom-5 -right-5 rtl:-left-5 rtl:right-auto text-fb-teal/[0.05] group-hover:text-fb-green/[0.12] group-hover:scale-110 group-hover:-rotate-6 transition-all duration-500 pointer-events-none">
                  {usp.watermark}
                </div>

                <div className="space-y-4 relative z-10">
                  <div className="p-3 rounded-xl bg-fb-teal/5 border border-fb-teal/10 text-fb-green group-hover:bg-fb-green/10 transition-colors inline-block">{usp.icon}</div>
                  <h4 className="font-bold text-fb-teal text-base">{usp.title}</h4>
                  <p className="text-slate-700 text-xs md:text-sm leading-relaxed">{usp.desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* 6. HOW WE CREATE VALUE (Timeline) */}
      <section className="py-24 bg-fb-bg-light border-b border-fb-bg-light">
        <div className="max-w-7xl mx-auto px-6 space-y-16">
          <div className="text-center space-y-4">
            <span className="eyebrow">{t('home.methodology.eyebrow')}</span>
            <h2 className="text-fb-teal font-bold">{t('home.methodology.title')}</h2>
          </div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={containerVariants}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 relative"
          >
            {/* Timeline horizontal background bar */}
            <div className="hidden lg:block absolute top-10 left-[12%] right-[12%] h-0.5 bg-fb-teal/10 z-0" />

            {valueTimeline.map((item) => (
              <motion.div
                key={item.step}
                variants={itemVariants}
                className="flex flex-col items-center text-center space-y-4 relative z-10"
              >
                <div className="w-14 h-14 rounded-2xl bg-fb-teal text-fb-bg-light flex items-center justify-center border border-fb-green/20 shadow-md">
                  {item.icon}
                </div>
                <div className="space-y-1">
                  <span className="text-fb-green text-xs font-bold uppercase tracking-widest">{locale === 'ar' ? `الخطوة ${item.step}` : `Step ${item.step}`}</span>
                  <h4 className="font-bold text-fb-teal text-lg">{item.name}</h4>
                </div>
                <p className="text-slate-700 text-xs md:text-sm leading-relaxed max-w-xs">{item.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* 7. CHRONOLOGICAL PORTFOLIO TIMELINE SECTION */}
      <PortfolioTimeline projects={projects} onSelectProject={setSelectedProject} />

      {/* 8. COMMERCIAL TENANT ECOSYSTEM & BRAND PARTNERSHIPS */}
      <TenantPartnershipSection />

      {/* 9. OFFICIAL COMPANY PROFILE & CORPORATE PRESENTATION */}
      <CompanyProfile isModalOpen={isProfileModalOpen} setIsModalOpen={setIsProfileModalOpen} />

      {/* 10. BLOG / INDUSTRY NEWS SECTION */}
      <BlogSection />

      {/* 11. FINAL CONSULTATION CTA */}
      <section className="bg-fb-teal text-fb-bg-light py-28 flex flex-col justify-center items-center px-6 relative overflow-hidden border-t border-fb-bg-light/10">
        <div className="absolute inset-0 opacity-10 grid-bg-overlay" />

        <div className="max-w-4xl mx-auto text-center space-y-8 relative z-10">
          <h2 className="text-fb-bg-light font-extrabold text-3xl sm:text-4xl md:text-5xl lg:text-[3.1rem] tracking-tight leading-snug max-w-4xl mx-auto">
            {t('home.cta.title')}
          </h2>
          <p className="text-fb-bg-light/75 text-sm md:text-base max-w-xl mx-auto leading-relaxed">
            {t('home.cta.subtitle')}
          </p>
          <div className="pt-4">
            <Link
              href="/contact?interest=consultation"
              className="inline-flex items-center space-x-2 rtl:space-x-reverse bg-fb-green hover:bg-fb-green-hover text-fb-teal font-extrabold px-10 py-4.5 rounded-2xl text-sm transition-all shadow-xl hover:shadow-fb-green/20 hover:scale-105"
            >
              <span>{t('common.bookConsultation')}</span>
              <ArrowRight size={16} className="ml-1.5 mr-1.5 rtl:rotate-180" />
            </Link>
          </div>
        </div>
      </section>

      {/* Interactive Project Details Side Panel Drawer */}
      <ProjectDrawer project={selectedProject} onClose={() => setSelectedProject(null)} />

    </div>
  );
}
