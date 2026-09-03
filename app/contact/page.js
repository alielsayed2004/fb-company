'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send, CheckCircle2, AlertCircle } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { useData } from '@/context/DataContext';

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

function ContactFormInner() {
  const searchParams = useSearchParams();
  const interestParam = searchParams.get('interest');
  const initialInterest = (interestParam === 'asset-management' || interestParam === 'consultation')
    ? interestParam
    : (interestParam === 'franchise-sourcing' || interestParam === 'sourcing')
    ? 'franchise-sourcing'
    : 'not-sure';
  const [interest, setInterest] = useState(initialInterest);
  const [status, setStatus] = useState(null); // 'success', 'error', 'submitting'
  const [errorMessage, setErrorMessage] = useState('');
  const { locale, t } = useLanguage();
  const { contactInfo } = useData();

  useEffect(() => {
    if (param === 'consultation' || (typeof window !== 'undefined' && (window.location.hash === '#consultation-form' || window.location.hash === '#contact-form'))) {
      const el = document.getElementById('consultation-form');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        setTimeout(() => {
          const nameInput = document.getElementById('name');
          if (nameInput) nameInput.focus();
        }, 400);
      }
    }
  }, [searchParams]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('submitting');
    setErrorMessage('');

    const form = e.target;
    const payload = {
      name: form.name.value,
      email: form.email.value,
      phone: form.phone.value,
      interest: form.interest.value,
      message: form.message.value,
    };

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setStatus('success');
        form.reset();
      } else {
        throw new Error(data.error || t('contact.form.error'));
      }
    } catch (error) {
      console.error(error);
      setErrorMessage(error.message || t('contact.form.error'));
      setStatus('error');
    }
  };

  return (
    <div id="consultation-form" className="bg-fb-bg-light/40 border border-fb-teal/5 p-8 md:p-10 rounded-2xl shadow-sm scroll-mt-24">
      <h3 className="text-fb-teal font-bold text-xl mb-6">{locale === 'ar' ? 'إرسال رسالة' : 'Send a Message'}</h3>

      {status === 'success' ? (
        <div className="bg-fb-green/10 border border-fb-green/30 text-fb-teal rounded-xl p-6 flex items-start space-x-4 rtl:space-x-reverse">
          <CheckCircle2 className="text-fb-green shrink-0 mt-0.5" size={24} />
          <div className="space-y-1">
            <h4 className="font-bold text-fb-teal">{locale === 'ar' ? 'تم الإرسال بنجاح' : 'Submission Successful'}</h4>
            <p className="text-sm text-fb-teal/90">{t('contact.form.success')}</p>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Honeypot field to block spam */}
          <input type="text" name="_gotcha" style={{ display: 'none' }} />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label htmlFor="name" className="text-xs font-bold text-fb-teal uppercase tracking-wider">{t('contact.form.name')}</label>
              <input
                type="text"
                id="name"
                name="name"
                required
                placeholder={locale === 'ar' ? 'الاسم الكامل' : 'Your Name'}
                className="w-full bg-fb-bg-light/90 border border-fb-teal/15 rounded-xl px-4 py-3.5 text-sm text-fb-teal focus:outline-none focus:border-fb-green focus:ring-1 focus:ring-fb-green/30 transition-all shadow-xs placeholder:text-fb-teal/40 font-medium"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="email" className="text-xs font-bold text-fb-teal uppercase tracking-wider">{t('contact.form.email')}</label>
              <input
                type="email"
                id="email"
                name="email"
                required
                placeholder="name@company.com"
                className="w-full bg-fb-bg-light/90 border border-fb-teal/15 rounded-xl px-4 py-3.5 text-sm text-fb-teal focus:outline-none focus:border-fb-green focus:ring-1 focus:ring-fb-green/30 transition-all shadow-xs placeholder:text-fb-teal/40 font-medium"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label htmlFor="phone" className="text-xs font-bold text-fb-teal uppercase tracking-wider">{t('contact.form.phone')}</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                required
                placeholder="e.g. +20 123 456 7890"
                className="w-full bg-fb-bg-light/90 border border-fb-teal/15 rounded-xl px-4 py-3.5 text-sm text-fb-teal focus:outline-none focus:border-fb-green focus:ring-1 focus:ring-fb-green/30 transition-all shadow-xs placeholder:text-fb-teal/40 font-medium"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="interest" className="text-xs font-bold text-fb-teal uppercase tracking-wider">{t('contact.form.interest')}</label>
              <select
                id="interest"
                name="interest"
                value={interest}
                onChange={(e) => setInterest(e.target.value)}
                className="w-full bg-fb-bg-light/90 border border-fb-teal/15 rounded-xl px-4 py-3.5 text-sm text-fb-teal focus:outline-none focus:border-fb-green focus:ring-1 focus:ring-fb-green/30 transition-all shadow-xs font-medium cursor-pointer"
              >
                <option value="consultation">{t('contact.form.consultation')}</option>
                <option value="asset-management">{t('contact.form.assetManagement')}</option>
                <option value="franchise-sourcing">{t('contact.form.franchiseSourcing')}</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="message" className="text-xs font-bold text-fb-teal uppercase tracking-wider">{t('contact.form.message')}</label>
            <textarea
              id="message"
              name="message"
              rows="5"
              required
              placeholder={locale === 'ar' ? 'حدد تفاصيل المشروع، أو متطلباتك العامة...' : 'Specify project details, brands, or general requirements...'}
              className="w-full bg-fb-bg-light/90 border border-fb-teal/15 rounded-xl px-4 py-3.5 text-sm text-fb-teal focus:outline-none focus:border-fb-green focus:ring-1 focus:ring-fb-green/30 transition-all shadow-xs placeholder:text-fb-teal/40 font-medium"
            ></textarea>
          </div>

          {status === 'error' && (
            <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 flex items-start space-x-3 rtl:space-x-reverse">
              <AlertCircle className="shrink-0 mt-0.5 mr-1 ml-1" size={20} />
              <p className="text-sm">{errorMessage}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={status === 'submitting'}
            className="w-full flex items-center justify-center space-x-2 rtl:space-x-reverse bg-fb-green hover:bg-fb-green-hover disabled:bg-fb-green/50 text-fb-teal font-extrabold py-4 rounded-xl transition-all shadow-md hover:shadow-fb-green/20 hover:scale-[1.01] active:scale-[0.99]"
          >
            {status === 'submitting' ? (
              <span>{t('contact.form.sending')}</span>
            ) : (
              <>
                <span>{t('contact.form.submit')}</span>
                <Send size={16} className="shrink-0" />
              </>
            )}
          </button>
        </form>
      )}
    </div>
  );
}

export default function Contact() {
  const { locale, t } = useLanguage();
  const { contactInfo } = useData();

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero */}
      <section className="bg-fb-teal text-fb-white py-24 px-6 relative overflow-hidden flex flex-col justify-center min-h-screen">
        {/* Background Video (Optional) */}
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover opacity-40 pointer-events-none z-0"
        >
          <source src="/videos/contact.mp4" type="video/mp4" />
          <source src="/videos/hero-bg.mp4" type="video/mp4" />
        </video>
        {/* Dark Overlay to protect text contrast */}
        <div className="absolute inset-0 bg-fb-teal/60 mix-blend-multiply z-0 pointer-events-none" />

        {/* Standardized Hero Grid Overlay */}
        <div className="absolute inset-0 hero-grid-overlay pointer-events-none z-0" />
        
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="max-w-5xl mx-auto z-10 relative space-y-4 w-full text-start"
        >
          <motion.span variants={itemVariants} className="eyebrow text-fb-green font-bold block text-xs tracking-wider">
            {locale === 'ar' ? 'مكتب الاستشارات والاتصال' : 'Consultation Desk'}
          </motion.span>
          <motion.h1 variants={itemVariants} className="text-fb-white max-w-2xl leading-snug font-extrabold text-2xl sm:text-3xl lg:text-[2.25rem]">
            {locale === 'ar' ? 'تواصل مع فريقنا المالي والتنفيذي' : 'Connect with Our Team'}
          </motion.h1>
          <motion.p variants={itemVariants} className="text-fb-bg-light/85 text-xs sm:text-sm md:text-[15px] leading-relaxed max-w-lg">
            {locale === 'ar' ? 'نحن نرحب بممثلي الشركات وملاك العقارات والمستثمرين للتشاور المباشر مع خبراء إدارة الأصول وتوفير المواقع.' : 'We welcome corporate representatives, property owners, and institutional investors to consult directly with our experts.'}
          </motion.p>
        </motion.div>
      </section>

      {/* Main Grid */}
      <section className="py-20 bg-fb-bg-light border-b border-fb-bg-light flex-grow">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={containerVariants}
          className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12"
        >
          
          {/* Info Block (LHS) */}
          <motion.div variants={itemVariants} className="lg:col-span-5 space-y-8">
            <div className="space-y-4">
              <span className="eyebrow">{locale === 'ar' ? 'المكتب المؤسسي' : 'Corporate Office'}</span>
              <h2 className="text-fb-teal font-bold text-3xl">{t('contact.title')}</h2>
              <p className="text-slate-700 text-sm md:text-base leading-relaxed">
                {locale === 'ar' ? 'نحن ندعو ممثلي الشركات، وملاك العقارات والأراضي، والمستثمرين للتشاور مباشرة مع متخذي القرار لدينا.' : 'We invite corporate tenant representatives, asset owners, and institutional investors to consult directly with our primary decision makers.'}
              </p>
            </div>

            <div className="space-y-6 pt-4 border-t border-fb-teal/10 text-start">
              <a 
                href={contactInfo?.mapUrl || "https://www.google.com/maps/place/FB+For+Assets+Management/@30.0343159,31.4653286,20.59z/data=!4m6!3m5!1s0x14583d006250c8a5:0x150a24e30755449!8m2!3d30.0344348!4d31.4654409!16s%2Fg%2F11lf4xhkxt?entry=ttu&g_ep=EgoyMDI2MDgxOS4wIKXMDSoASAFQAw%3D%3D"}
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-start gap-4 text-start group cursor-pointer transition-colors"
                title={locale === 'ar' ? 'افتح الموقع على خرائط جوجل' : 'Open in Google Maps'}
              >
                <div className="w-10 h-10 rounded-xl bg-fb-teal/5 border border-fb-teal/10 flex items-center justify-center shrink-0 text-fb-green group-hover:bg-fb-green group-hover:text-fb-teal transition-colors mt-0.5 shadow-xs">
                  <MapPin className="shrink-0" size={18} strokeWidth={1.5} />
                </div>
                <div className="space-y-0.5 text-start">
                  <h4 className="font-bold text-fb-teal text-sm uppercase tracking-wider">{t('contact.info.hq')}</h4>
                  <p className="text-sm text-slate-700 group-hover:text-fb-green transition-colors font-medium">{locale === 'ar' ? (contactInfo?.address_ar || contactInfo?.address || t('footer.address')) : (contactInfo?.address || t('footer.address'))}</p>
                </div>
              </a>

              <div className="flex items-start gap-4 text-start">
                <div className="w-10 h-10 rounded-xl bg-fb-teal/5 border border-fb-teal/10 flex items-center justify-center shrink-0 text-fb-green mt-0.5">
                  <Mail className="text-fb-green shrink-0" size={18} strokeWidth={1.5} />
                </div>
                <div className="space-y-0.5 text-start">
                  <h4 className="font-bold text-fb-teal text-sm uppercase tracking-wider">{t('contact.info.email')}</h4>
                  <a href={`mailto:${contactInfo?.email || 'info@fbcompany.com'}`} className="text-sm text-slate-700 hover:text-fb-green transition-colors block font-medium">
                    {contactInfo?.email || 'info@fbcompany.com'}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4 text-start">
                <div className="w-10 h-10 rounded-xl bg-fb-teal/5 border border-fb-teal/10 flex items-center justify-center shrink-0 text-fb-green mt-0.5">
                  <Phone className="text-fb-green shrink-0" size={18} strokeWidth={1.5} />
                </div>
                <div className="space-y-0.5 text-start">
                  <h4 className="font-bold text-fb-teal text-sm uppercase tracking-wider">{t('contact.info.phone')}</h4>
                  <a 
                    href={`tel:${(contactInfo?.phone || '+201117751967').replace(/\s+/g, '')}`} 
                    dir="ltr" 
                    className="text-sm text-slate-700 hover:text-fb-green font-mono font-semibold transition-colors block"
                  >
                    {contactInfo?.phone || '+20 111 775 1967'}
                  </a>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Form Block (RHS) */}
          <motion.div variants={itemVariants} className="lg:col-span-7">
            <Suspense fallback={<div className="bg-fb-bg-light/40 border border-fb-teal/5 p-8 md:p-10 rounded-2xl shadow-sm text-center py-20 text-fb-teal">{t('contact.form.sending')}</div>}>
              <ContactFormInner />
            </Suspense>
          </motion.div>

        </motion.div>
      </section>
    </div>
  );
}
