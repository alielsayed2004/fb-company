'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, MapPin, Layers, CheckCircle, Search, Target, Building2, BarChart4, Landmark, ShieldCheck, TrendingUp } from 'lucide-react';
import CompanyProfile from '@/components/CompanyProfile';
import { useLanguage } from '@/context/LanguageContext';

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

export default function AssetManagement() {
  const { locale, t } = useLanguage();

  const steps = [
    { num: "01", icon: <Search strokeWidth={1.5} size={22} />, watermark: <Search size={110} />, title: locale === 'ar' ? "التقييم والتدقيق" : "Assess", desc: locale === 'ar' ? "تدقيق تفصيلي لمقاييس الأصول، واللوائح البلدية، والتدفقات النقدية." : "Detailed audit of asset metrics, municipal regulations, and cash flows." },
    { num: "02", icon: <Target strokeWidth={1.5} size={22} />, watermark: <Target size={110} />, title: locale === 'ar' ? "التوافق والتطابق" : "Match", desc: locale === 'ar' ? "مواءمة العقارات والقطع مع الأهداف المؤسسية ومستويات تحمل المخاطر." : "Aligning properties with institutional objectives and risk tolerances." },
    { num: "03", icon: <Building2 strokeWidth={1.5} size={22} />, watermark: <Building2 size={110} />, title: locale === 'ar' ? "الإشراف والإدارة" : "Manage", desc: locale === 'ar' ? "التحسين النشط لعقود الإيجار التشغيلية وقوائم المستأجرين." : "Active optimization of operational leases and tenant rosters." },
    { num: "04", icon: <BarChart4 strokeWidth={1.5} size={22} />, watermark: <BarChart4 size={110} />, title: locale === 'ar' ? "التقارير المالية" : "Report", desc: locale === 'ar' ? "تدقيق مالي دوري شفاف وحوكمة كاملة للتقارير والأرباح." : "Transparent, real-time performance auditing and financial transparency." }
  ];

  const services = [
    { icon: <Landmark strokeWidth={1.5} size={24} />, watermark: <Landmark size={120} />, title: t('asset.specialities.0.title'), desc: t('asset.specialities.0.desc') },
    { icon: <ShieldCheck strokeWidth={1.5} size={24} />, watermark: <ShieldCheck size={120} />, title: t('asset.specialities.1.title'), desc: t('asset.specialities.1.desc') },
    { icon: <TrendingUp strokeWidth={1.5} size={24} />, watermark: <TrendingUp size={120} />, title: t('asset.specialities.2.title'), desc: t('asset.specialities.2.desc') },
    { icon: <Layers strokeWidth={1.5} size={24} />, watermark: <Layers size={120} />, title: t('asset.specialities.3.title'), desc: t('asset.specialities.3.desc') }
  ];

  return (
    <div className="flex flex-col min-h-screen">
      
      {/* Hero */}
      <section className="bg-fb-teal text-fb-white py-16 sm:py-24 px-4 sm:px-6 relative overflow-hidden flex flex-col justify-center min-h-[65dvh] md:min-h-screen">
        {/* Background Video */}
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover opacity-40 pointer-events-none z-0"
        >
          <source src="/videos/asset-management.mp4" type="video/mp4" />
          <source src="/projects/Main Banks Service Corridor/Main Banks Service Corridor.mp4" type="video/mp4" />
        </video>
        {/* Dark Overlay to protect text contrast */}
        <div className="absolute inset-0 bg-fb-teal/60 mix-blend-multiply z-0 pointer-events-none" />

        {/* Standardized Hero Grid Overlay */}
        <div className="absolute inset-0 hero-grid-overlay pointer-events-none z-0" />
        
        <div className="max-w-5xl mx-auto z-10 relative space-y-4 sm:space-y-5 w-full text-start">
          <motion.span 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="eyebrow text-fb-green font-bold block text-xs tracking-wider"
          >
            {t('asset.eyebrow')}
          </motion.span>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, ease: corporateEase }}
            className="text-fb-bg-light max-w-3xl leading-snug font-extrabold text-2xl sm:text-3xl lg:text-[2.5rem] text-balance"
          >
            {t('asset.title')}
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, ease: corporateEase }}
            className="text-fb-bg-light/85 text-xs sm:text-sm md:text-[15px] leading-relaxed max-w-xl"
          >
            {t('asset.desc')}
          </motion.p>
        </div>
      </section>

      {/* How We Work Process */}
      <section className="py-12 sm:py-20 bg-fb-bg-light border-b border-fb-bg-light">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
          className="max-w-7xl mx-auto px-4 sm:px-6 space-y-8 sm:space-y-12"
        >
          <div className="text-center space-y-2.5 sm:space-y-4">
            <span className="eyebrow">{t('asset.processSubtitle')}</span>
            <h2 className="text-fb-teal font-extrabold tracking-tight text-2xl sm:text-3xl md:text-4xl text-balance">{t('asset.processTitle')}</h2>
          </div>

          <motion.div 
            variants={containerVariants}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8"
          >
            {steps.map((step, idx) => (
              <motion.div 
                key={idx} 
                variants={itemVariants}
                className="relative bg-fb-bg-light/90 border border-fb-teal/15 rounded-2xl sm:rounded-3xl p-5 sm:p-7 space-y-3 sm:space-y-4 shadow-[0_8px_30px_rgba(0,59,60,0.05)] hover:shadow-[0_15px_35px_rgba(83,179,121,0.15)] hover:border-fb-green hover:-translate-y-1.5 transition-all duration-300 overflow-hidden flex flex-col justify-between group"
              >
                {/* Large Background Overlay Watermark Icon */}
                <div className="absolute -bottom-5 -right-5 rtl:-left-5 rtl:right-auto text-fb-teal/[0.05] group-hover:text-fb-green/[0.12] group-hover:scale-110 group-hover:-rotate-6 transition-all duration-500 pointer-events-none">
                  {step.watermark}
                </div>

                <div className="space-y-3 sm:space-y-4 relative z-10">
                  <div className="flex justify-between items-center">
                    <span className="text-fb-green font-mono font-extrabold text-2xl sm:text-3xl block">{step.num}</span>
                    <div className="p-2 sm:p-2.5 rounded-xl bg-fb-teal/5 text-fb-green border border-fb-teal/10 group-hover:bg-fb-green/10 group-hover:border-fb-green/30 transition-colors">
                      {step.icon}
                    </div>
                  </div>
                  <h4 className="text-fb-teal font-extrabold text-base sm:text-lg">{step.title}</h4>
                  <p className="text-slate-700 text-xs sm:text-sm leading-relaxed">{step.desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* Services Grid */}
      <section className="py-12 sm:py-20 bg-fb-bg-light border-b border-fb-teal/5">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
          className="max-w-7xl mx-auto px-4 sm:px-6 space-y-8 sm:space-y-12"
        >
          <div className="text-center space-y-2.5 sm:space-y-4">
            <span className="eyebrow">{t('asset.specialitiesSubtitle')}</span>
            <h2 className="text-fb-teal font-extrabold tracking-tight text-2xl sm:text-3xl md:text-4xl text-balance">{t('asset.specialitiesTitle')}</h2>
          </div>

          <motion.div 
            variants={containerVariants}
            className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-8"
          >
            {services.map((service, idx) => (
              <motion.div 
                key={idx} 
                variants={itemVariants}
                className="bg-fb-bg-light/90 border border-fb-teal/15 rounded-2xl sm:rounded-3xl p-5 sm:p-8 space-y-3 shadow-[0_8px_30px_rgba(0,59,60,0.05)] hover:shadow-[0_15px_35px_rgba(83,179,121,0.15)] hover:border-fb-green hover:-translate-y-1.5 transition-all duration-300 relative overflow-hidden group"
              >
                {/* Large Background Overlay Watermark Icon */}
                <div className="absolute -bottom-6 -right-6 rtl:-left-6 rtl:right-auto text-fb-teal/[0.04] group-hover:text-fb-green/[0.10] group-hover:scale-110 group-hover:-rotate-6 transition-all duration-500 pointer-events-none">
                  {service.watermark}
                </div>

                <div className="space-y-3 sm:space-y-4 relative z-10">
                  <div className="p-2.5 sm:p-3.5 bg-fb-teal/5 inline-block rounded-2xl border border-fb-teal/10 text-fb-green group-hover:bg-fb-green/10 group-hover:border-fb-green/30 transition-colors">
                    {service.icon}
                  </div>
                  <h4 className="text-fb-teal font-extrabold text-lg sm:text-xl">{service.title}</h4>
                  <p className="text-slate-700 text-xs sm:text-sm md:text-base leading-relaxed">{service.desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* Trust & Investment Philosophy */}
      <section className="py-12 sm:py-20 bg-fb-bg-light border-b border-fb-bg-light">
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-12"
        >
          <motion.div variants={itemVariants} className="space-y-3 sm:space-y-4">
            <span className="eyebrow">{t('asset.philosophySubtitle')}</span>
            <h3 className="text-fb-teal font-bold text-xl sm:text-2xl">{t('asset.philosophyTitle')}</h3>
            <p className="text-slate-700 text-xs sm:text-sm md:text-base leading-relaxed">
              {t('asset.philosophyDesc')}
            </p>
          </motion.div>
          <motion.div variants={itemVariants} className="space-y-3 sm:space-y-4">
            <span className="eyebrow">{t('asset.securitySubtitle')}</span>
            <h3 className="text-fb-teal font-bold text-xl sm:text-2xl">{t('asset.securityTitle')}</h3>
            <p className="text-slate-700 text-xs sm:text-sm md:text-base leading-relaxed">
              {t('asset.securityDesc')}
            </p>
          </motion.div>
          <motion.div variants={itemVariants} className="space-y-3 sm:space-y-4">
            <span className="eyebrow">{t('asset.performanceSubtitle')}</span>
            <h3 className="text-fb-teal font-bold text-xl sm:text-2xl">{t('asset.performanceTitle')}</h3>
            <p className="text-slate-700 text-xs sm:text-sm md:text-base leading-relaxed">
              {t('asset.performanceDesc')}
            </p>
          </motion.div>
        </motion.div>
      </section>

      {/* CTA Section Replaced by Company Profile */}
      <CompanyProfile />

    </div>
  );
}
