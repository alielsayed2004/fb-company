'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, MapPin, Search, ClipboardCheck, Compass, CheckCircle, Store, FileText, ShieldCheck, TrendingUp } from 'lucide-react';
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

export default function FranchiseSourcing() {
  const { locale, t } = useLanguage();

  const steps = [
    { 
      num: "01", 
      watermark: <Search size={110} />,
      title: locale === 'ar' ? "البحث والاستقصاء" : "Research", 
      icon: <Search strokeWidth={1.5} size={22} />, 
      desc: locale === 'ar' ? "مراجعات ديموغرافية، إحصاءات حركة المرور، وتحليلات الذكاء الجغرافي للمنطقة." : "Demographic reviews, road-traffic volumes, and catchment intelligence analysis." 
    },
    { 
      num: "02", 
      watermark: <Compass size={110} />,
      title: locale === 'ar' ? "التحليل والتقييم" : "Analyze", 
      icon: <Compass strokeWidth={1.5} size={22} />, 
      desc: locale === 'ar' ? "التحقق من اللوائح البلدية، مسافات التراجع الآمنة، والتحقق من الجدوى الفنية." : "Municipal code validation, setback rules, and physical feasibility checks." 
    },
    { 
      num: "03", 
      watermark: <MapPin size={110} />,
      title: locale === 'ar' ? "تأمين المواقع" : "Source", 
      icon: <MapPin strokeWidth={1.5} size={22} />, 
      desc: locale === 'ar' ? "الاستحواذ على الأراضي والزوايا المتميزة غير المدرجة في السوق المفتوح عبر علاقاتنا القوية." : "Acquiring premium corners and off-market parcels through proprietary relationships." 
    },
    { 
      num: "04", 
      watermark: <ClipboardCheck size={110} />,
      title: locale === 'ar' ? "التفاوض والهيكلة" : "Negotiate", 
      icon: <ClipboardCheck strokeWidth={1.5} size={22} />, 
      desc: locale === 'ar' ? "صياغة عقود إيجار طويلة الأجل تتوافق مع متطلبات كبرى الشركات والعلامات التجارية العالمية." : "Structuring long-term leases matching corporate requirements for global franchise tenants." 
    },
    { 
      num: "05", 
      watermark: <CheckCircle size={110} />,
      title: locale === 'ar' ? "التنفيذ والتسليم" : "Secure", 
      icon: <CheckCircle strokeWidth={1.5} size={22} />, 
      desc: locale === 'ar' ? "إتمام الإجراءات القانونية والتعاقدية النهائية، وتسليم التراخيص والبلدية." : "Executing transactional closures, final contracts, and municipal permitting handovers." 
    }
  ];

  const services = [
    { watermark: <Store size={120} />, title: t('sourcing.services.0.title'), desc: t('sourcing.services.0.desc') },
    { watermark: <FileText size={120} />, title: t('sourcing.services.1.title'), desc: t('sourcing.services.1.desc') },
    { watermark: <ShieldCheck size={120} />, title: t('sourcing.services.2.title'), desc: t('sourcing.services.2.desc') },
    { watermark: <TrendingUp size={120} />, title: t('sourcing.services.3.title'), desc: t('sourcing.services.3.desc') }
  ];

  const brands = [
    "McDonald's", "El Ezaby", "Othaim Market", "Bazooka", "Karam Elsham", 
    "Halawany El Abd", "2B", "Dream 2000", "Max Muscle", "Dushka", "Al Maliky", "Remas Land"
  ];

  return (
    <div className="flex flex-col min-h-screen">
      
      {/* Hero */}
      <section className="bg-fb-teal text-fb-white py-14 sm:py-20 md:py-24 px-4 sm:px-6 relative overflow-hidden flex flex-col justify-center min-h-[50dvh] sm:min-h-[60dvh] md:min-h-screen">
        {/* Background Video */}
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover opacity-40 pointer-events-none z-0"
        >
          <source src="/videos/franchise-sourcing.mp4" type="video/mp4" />
          <source src="/videos/hero-bg.mp4" type="video/mp4" />
        </video>
        {/* Dark Overlay to protect text contrast */}
        <div className="absolute inset-0 bg-fb-teal/60 mix-blend-multiply z-0 pointer-events-none" />

        {/* Standardized Hero Grid Overlay */}
        <div className="absolute inset-0 hero-grid-overlay pointer-events-none z-0" />
        <div className="max-w-5xl mx-auto z-10 relative space-y-4 sm:space-y-6 w-full text-start">
          <motion.span 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="eyebrow text-fb-green font-bold block text-xs tracking-wider"
          >
            {t('sourcing.eyebrow')}
          </motion.span>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, ease: corporateEase }}
            className="text-fb-bg-light max-w-3xl leading-snug font-extrabold text-2xl sm:text-3xl lg:text-[2.25rem] [text-wrap:balance]"
          >
            {t('sourcing.title')}
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, ease: corporateEase }}
            className="text-fb-bg-light/85 text-sm sm:text-base leading-relaxed max-w-2xl"
          >
            {t('sourcing.desc')}
          </motion.p>
        </div>
      </section>

      {/* Sourcing Process */}
      <section className="py-12 sm:py-20 bg-fb-bg-light border-b border-fb-bg-light">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
          className="max-w-7xl mx-auto px-6 space-y-12"
        >
          <div className="text-center space-y-4">
            <span className="eyebrow">{t('sourcing.processSubtitle')}</span>
            <h2 className="text-fb-teal font-extrabold tracking-tight text-3xl md:text-4xl">{t('sourcing.processTitle')}</h2>
          </div>

          <motion.div 
            variants={containerVariants}
            className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6"
          >
            {steps.map((step, idx) => (
              <motion.div 
                key={idx} 
                variants={itemVariants}
                className="bg-fb-bg-light/90 border border-fb-teal/15 rounded-2xl sm:rounded-3xl p-5 sm:p-7 space-y-3 sm:space-y-4 shadow-[0_8px_30px_rgba(0,59,60,0.05)] hover:shadow-[0_15px_35px_rgba(83,179,121,0.15)] hover:border-fb-green hover:-translate-y-1.5 transition-all duration-300 relative overflow-hidden flex flex-col justify-between group"
              >
                {/* Large Background Overlay Watermark Icon */}
                <div className="absolute -bottom-5 -right-5 rtl:-left-5 rtl:right-auto text-fb-teal/[0.05] group-hover:text-fb-green/[0.12] group-hover:scale-110 group-hover:-rotate-6 transition-all duration-500 pointer-events-none">
                  {step.watermark}
                </div>

                <div className="space-y-3 sm:space-y-4 relative z-10">
                  <div className="flex justify-between items-center">
                    <span className="text-fb-green font-mono font-extrabold text-xl sm:text-2xl">{step.num}</span>
                    <div className="p-2 sm:p-2.5 rounded-xl bg-fb-teal/5 text-fb-green border border-fb-teal/10 group-hover:bg-fb-green/10 transition-colors">
                      {step.icon}
                    </div>
                  </div>
                  <h4 className="font-bold text-fb-teal text-base sm:text-lg">{step.title}</h4>
                  <p className="text-slate-700 text-xs md:text-sm leading-relaxed">{step.desc}</p>
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
          <div className="text-center space-y-4">
            <span className="eyebrow">{t('sourcing.servicesSubtitle')}</span>
            <h2 className="text-fb-teal font-extrabold tracking-tight text-2xl sm:text-3xl md:text-4xl [text-wrap:balance]">{t('sourcing.servicesTitle')}</h2>
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

                <div className="space-y-2 sm:space-y-3 relative z-10">
                  <h4 className="text-fb-teal font-extrabold text-lg sm:text-xl">{service.title}</h4>
                  <p className="text-slate-700 text-xs sm:text-sm md:text-base leading-relaxed">{service.desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* Featured Project */}
      <section className="py-12 sm:py-20 bg-fb-bg-light border-b border-fb-bg-light">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
          className="max-w-7xl mx-auto px-4 sm:px-6 space-y-8 sm:space-y-10"
        >
          <div className="text-center space-y-3">
            <span className="eyebrow">{t('sourcing.caseStudySubtitle')}</span>
            <h2 className="text-fb-teal font-extrabold tracking-tight [text-wrap:balance]">{t('sourcing.caseStudyTitle')}</h2>
            <p className="text-fb-black/75 text-xs sm:text-sm md:text-base max-w-xl mx-auto">
              {t('sourcing.caseStudyDesc')}
            </p>
          </div>

          <div className="bg-fb-bg-light/90 border border-fb-teal/15 rounded-2xl sm:rounded-3xl p-5 sm:p-8 space-y-5 sm:space-y-6 max-w-4xl mx-auto shadow-[0_8px_30px_rgba(0,59,60,0.05)]">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center md:text-left border-b border-fb-teal/10 pb-6">
              <div>
                <span className="text-[10px] text-fb-black/50 block font-bold uppercase tracking-wider">{locale === 'ar' ? 'الموقع' : 'Location'}</span>
                <span className="text-sm font-bold text-fb-teal">{locale === 'ar' ? 'مدينة العاشر من رمضان' : '10th of Ramadan City'}</span>
              </div>
              <div>
                <span className="text-[10px] text-fb-black/50 block font-bold uppercase tracking-wider">{locale === 'ar' ? 'الحالة' : 'Status'}</span>
                <span className="text-sm font-bold text-fb-teal">{locale === 'ar' ? 'مشغّل (مؤجر بالكامل 100%)' : 'Operational (100% Leased)'}</span>
              </div>
              <div>
                <span className="text-[10px] text-fb-black/50 block font-bold uppercase tracking-wider">{locale === 'ar' ? 'سنة التشييد' : 'Year Built'}</span>
                <span className="text-sm font-extrabold text-fb-teal font-mono">2023</span>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-fb-teal font-extrabold text-xs uppercase tracking-wider text-center md:text-left">{t('sourcing.covenantsTitle')}</h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {brands.map((brand, idx) => (
                  <div key={idx} className="bg-fb-bg-light/90 border border-fb-teal/15 text-xs text-center font-bold text-fb-teal py-3 px-3 rounded-2xl shadow-xs hover:border-fb-green hover:shadow-sm transition-all flex items-center justify-center">
                    {brand}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* CTA */}
      <section className="bg-fb-teal text-fb-white py-20 px-6 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#53B379_1px,transparent_1px),linear-gradient(to_bottom,#53B379_1px,transparent_1px)] bg-[size:32px_32px]" />
        <div className="max-w-3xl mx-auto relative z-10 space-y-6">
          <h2 className="text-fb-bg-light font-extrabold text-3xl">{t('sourcing.ctaTitle')}</h2>
          <p className="text-fb-bg-light/80 text-sm md:text-base">
            {t('sourcing.ctaDesc')}
          </p>
          <div className="pt-4">
            <Link
              href="/contact?interest=franchise-sourcing"
              className="inline-flex items-center space-x-2 bg-fb-green hover:bg-fb-green-hover text-fb-teal font-bold px-10 py-4 rounded-xl transition-colors shadow-lg"
            >
              <span>{t('sourcing.ctaBtn')}</span>
              <ArrowRight size={16} className="ml-1.5 mr-1.5" />
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
