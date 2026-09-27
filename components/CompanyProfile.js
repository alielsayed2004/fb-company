'use client';

import { motion } from 'framer-motion';
import { FileText, CheckCircle2, ExternalLink, Download } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export default function CompanyProfile() {
  const { t, locale } = useLanguage();

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
          
          {/* Document Visual Card (Left Column) - Opens directly in a new tab */}
          <motion.a 
            href="/FB_Company_Profile.pdf"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="lg:col-span-5 relative group cursor-pointer block"
            title={locale === 'ar' ? 'افتح البروفايل في صفحة جديدة' : 'Open profile in new tab'}
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
                <ExternalLink size={14} />
                <span>{locale === 'ar' ? 'فتح في تاب مستقل' : 'Open in New Tab'}</span>
              </div>
            </div>
          </motion.a>

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
              {/* Button 1: Open in separate browser tab */}
              <motion.a
                whileTap={{ scale: 0.95 }}
                href="/FB_Company_Profile.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 inline-flex items-center justify-center space-x-2 rtl:space-x-reverse bg-fb-green hover:bg-fb-green-hover text-fb-teal font-extrabold px-6 py-4 rounded-xl transition-all shadow-md text-sm cursor-pointer"
              >
                <ExternalLink size={18} />
                <span>{t('home.companyProfile.viewBtn') || (locale === 'ar' ? 'افتح البروفايل' : 'Open Profile')}</span>
              </motion.a>

              {/* Button 2: Download PDF directly */}
              <motion.a 
                whileTap={{ scale: 0.95 }}
                href="/FB_Company_Profile.pdf"
                download="FB_Company_Profile.pdf"
                className="inline-flex items-center justify-center space-x-2 rtl:space-x-reverse bg-fb-bg-light/90 hover:bg-fb-teal hover:text-fb-white border border-fb-teal/15 hover:border-fb-teal text-fb-teal font-extrabold px-6 py-4 rounded-xl transition-all text-sm flex-1 shadow-xs hover:shadow-md cursor-pointer"
              >
                <Download size={16} />
                <span>{t('home.companyProfile.downloadBtn') || (locale === 'ar' ? 'تحميل البروفايل (PDF)' : 'Download Profile (PDF)')}</span>
              </motion.a>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
