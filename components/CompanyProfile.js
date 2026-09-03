'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, CheckCircle2, Eye, ExternalLink, X, Maximize2 } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export default function CompanyProfile({ isModalOpen, setIsModalOpen }) {
  const { t, locale } = useLanguage();
  const [internalIsOpen, setInternalIsOpen] = useState(false);

  const isOpenModal = isModalOpen !== undefined ? isModalOpen : internalIsOpen;
  const setOpenState = setIsModalOpen || setInternalIsOpen;

  // Listen for global custom event to open profile modal from navbar or hero
  useEffect(() => {
    const handleOpenEvent = () => setOpenState(true);
    window.addEventListener('open-company-profile', handleOpenEvent);
    return () => window.removeEventListener('open-company-profile', handleOpenEvent);
  }, [setOpenState]);

  // Close modal on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setOpenState(false);
    };
    if (isOpenModal) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpenModal, setOpenState]);

  return (
    <section id="company-profile" className="py-16 bg-fb-bg-light text-fb-teal border-t border-fb-teal/5 relative overflow-hidden scroll-mt-20">
      <div className="max-w-7xl mx-auto px-6 space-y-12 relative z-10">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <span className="eyebrow text-fb-green font-bold block text-xs tracking-wider">{t('home.companyProfile.eyebrow')}</span>
          <h2 className="text-fb-teal font-extrabold text-2xl sm:text-3xl md:text-4xl tracking-tight leading-snug">{t('home.companyProfile.title')}</h2>
          <p className="text-slate-700 text-xs sm:text-sm md:text-base leading-relaxed max-w-xl mx-auto font-normal">
            {t('home.companyProfile.desc')}
          </p>
        </div>

        <div className="bg-fb-bg-light/90 border border-fb-teal/15 rounded-3xl p-8 md:p-12 lg:p-14 shadow-[0_8px_30px_rgba(0,59,60,0.05)] max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* Document Visual Card (Left Column) - Opens in-app Reader */}
          <motion.div 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setOpenState(true)}
            className="lg:col-span-5 relative group cursor-pointer block"
            title={locale === 'ar' ? 'اضغط لعرض البروفايل' : 'Click to preview profile'}
          >
            <div className="bg-fb-bg-light/30 border border-fb-teal/10 rounded-2xl p-8 space-y-6 shadow-sm hover:shadow-xl hover:border-fb-green/50 transition-all duration-300 relative overflow-hidden text-center flex flex-col items-center justify-center min-h-[340px]">
              <div className="w-20 h-20 bg-fb-green/10 border border-fb-green/30 rounded-2xl flex items-center justify-center text-fb-green mb-2 group-hover:scale-110 group-hover:bg-fb-green group-hover:text-fb-teal transition-all duration-300">
                <FileText size={42} />
              </div>
              <div className="space-y-1">
                <span className="text-xs font-mono font-bold text-fb-green uppercase tracking-widest block">F.B COMPANY</span>
                <h3 className="text-xl font-extrabold text-fb-teal">Corporate Profile 2026</h3>
                <p className="text-xs text-fb-black/50">Executive Sourcing & Asset Management</p>
              </div>
              <div className="pt-2 border-t border-fb-teal/5 w-full flex items-center justify-center space-x-2 rtl:space-x-reverse text-fb-green font-semibold text-xs">
                <Eye size={14} />
                <span>{locale === 'ar' ? 'اضغط للعرض المباشر' : 'Click to preview'}</span>
              </div>
            </div>
          </motion.div>

          {/* Document Specs & Actions (Right Column) */}
          <div className="lg:col-span-7 space-y-8">
            <div className="space-y-3">
              <span className="text-xs font-bold text-fb-green uppercase tracking-wider block">{t('home.companyProfile.specsTitle')}</span>
              <ul className="space-y-3.5">
                {[
                  t('home.companyProfile.spec1'),
                  t('home.companyProfile.spec2'),
                  t('home.companyProfile.spec3'),
                  t('home.companyProfile.spec4')
                ].map((item, idx) => (
                  <li key={idx} className="flex items-start space-x-3 rtl:space-x-reverse text-sm md:text-base text-fb-black/80">
                    <CheckCircle2 size={18} className="text-fb-green shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2 border-t border-fb-teal/5">
              {/* Button 1: Interactive in-page Viewer */}
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => setOpenState(true)}
                className="flex-1 inline-flex items-center justify-center space-x-2 rtl:space-x-reverse bg-fb-green hover:bg-fb-green-hover text-fb-teal font-extrabold px-6 py-4 rounded-xl transition-all shadow-md text-sm cursor-pointer"
              >
                <Eye size={18} />
                <span>{locale === 'ar' ? 'عرض الكتيب التفاعلي' : 'View Corporate Profile'}</span>
              </motion.button>

              {/* Button 2: Open in separate browser tab */}
              <motion.a 
                whileTap={{ scale: 0.95 }}
                href="/FB_Company_Profile.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center space-x-2 rtl:space-x-reverse bg-fb-bg-light/90 hover:bg-fb-teal hover:text-fb-white border border-fb-teal/15 hover:border-fb-teal text-fb-teal font-extrabold px-6 py-4 rounded-xl transition-all text-sm flex-1 shadow-xs hover:shadow-md cursor-pointer"
              >
                <ExternalLink size={16} />
                <span>{locale === 'ar' ? 'فتح في تاب مستقل' : 'Open in New Tab'}</span>
              </motion.a>
            </div>
          </div>

        </div>
      </div>

      {/* Interactive PDF Reader Modal */}
      <AnimatePresence>
        {isOpenModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-fb-black/75 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpenState(false)}
              className="absolute inset-0"
            />

            <motion.div
              initial={{ scale: 0.92, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.92, opacity: 0, y: 20 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="relative w-full max-w-6xl h-[88vh] bg-fb-teal text-white rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-white/15 z-10"
            >
              {/* Modal Top Bar */}
              <div className="flex items-center justify-between px-6 py-4 bg-fb-teal border-b border-white/10 shrink-0">
                <div className="flex items-center space-x-3 rtl:space-x-reverse">
                  <div className="p-2 bg-fb-green/10 rounded-lg text-fb-green">
                    <FileText size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm md:text-base text-fb-bg-light">F.B Company — Corporate Profile 2026</h3>
                    <p className="text-xs text-fb-bg-light/50">Executive Sourcing & Asset Management</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 rtl:space-x-reverse">
                  <a
                    href="/FB_Company_Profile.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-1.5 rtl:space-x-reverse text-xs bg-white/10 hover:bg-white/20 text-fb-bg-light px-3.5 py-2 rounded-lg transition-colors border border-white/10"
                    title={locale === 'ar' ? 'فتح ملء الشاشة' : 'Open in full tab'}
                  >
                    <Maximize2 size={14} />
                    <span className="hidden sm:inline">{locale === 'ar' ? 'ملء الشاشة' : 'Full Tab'}</span>
                  </a>

                  <button
                    onClick={() => setOpenState(false)}
                    className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
                    aria-label="Close viewer"
                  >
                    <X size={22} />
                  </button>
                </div>
              </div>

              {/* Modal Body with Embedded PDF Viewer */}
              <div className="flex-1 bg-neutral-900 w-full h-full relative">
                <iframe
                  src="/FB_Company_Profile.pdf#toolbar=1&navpanes=0"
                  className="w-full h-full border-0"
                  title="F.B Company Corporate Profile PDF Viewer"
                />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
