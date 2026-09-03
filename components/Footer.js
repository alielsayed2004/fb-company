'use client';

import Link from 'next/link';
import { Mail, Phone, MapPin, Lock } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { useData } from '@/context/DataContext';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const { locale, t } = useLanguage();
  const { setIsPasscodeOpen, contactInfo } = useData();

  const navLinks = [
    { nameKey: 'nav.home', href: '/' },
    { nameKey: 'nav.assetManagement', href: '/asset-management' },
    { nameKey: 'nav.franchiseSourcing', href: '/franchise-sourcing' },
    { nameKey: 'nav.aboutUs', href: '/about' },
    { nameKey: 'nav.contactUs', href: '/contact' }
  ];

  return (
    <footer className="bg-fb-bg-light text-fb-teal border-t border-fb-teal/10 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
        
        {/* Brand Column (2 Cols) */}
        <div className="md:col-span-2 space-y-5 text-start">
          <div className="flex items-center justify-start text-start">
            <img
              src="/company/logo.png"
              alt="F.B Company"
              className="h-14 md:h-16 w-auto object-contain"
            />
          </div>
          <p className="text-slate-700 max-w-md text-sm leading-relaxed text-start">
            {t('footer.desc')}
          </p>
          <div className="pt-1 text-start">
            <span className="text-fb-green font-bold text-xs tracking-widest uppercase block mb-1">
              {locale === 'ar' ? 'الشعار المؤسسي' : 'Tagline'}
            </span>
            <p className="font-extrabold text-fb-teal text-base">{t('footer.tagline')}</p>
            
            {/* Social Links */}
            <div className="flex items-center gap-3 pt-4 justify-start">
              <a 
                href="https://www.facebook.com/profile.php?id=61563734981427" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="p-2.5 bg-fb-teal/5 text-fb-teal rounded-full hover:bg-fb-green hover:text-fb-teal transition-all duration-300 shadow-sm" 
                aria-label="Facebook"
              >
                <svg className="w-[15px] h-[15px] fill-current" viewBox="0 0 24 24">
                  <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c4.56-.93 8-4.96 8-9.75z"/>
                </svg>
              </a>
              <a 
                href="https://x.com/FB_Company1" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="p-2.5 bg-fb-teal/5 text-fb-teal rounded-full hover:bg-fb-green hover:text-fb-teal transition-all duration-300 shadow-sm" 
                aria-label="X (Twitter)"
              >
                <svg className="w-[15px] h-[15px] fill-current" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
              <a 
                href="https://www.instagram.com/fb_company1/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="p-2.5 bg-fb-teal/5 text-fb-teal rounded-full hover:bg-fb-green hover:text-fb-teal transition-all duration-300 shadow-sm" 
                aria-label="Instagram"
              >
                <svg className="w-[15px] h-[15px] fill-none stroke-current stroke-2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                </svg>
              </a>
              <a 
                href="https://www.linkedin.com/company/f-b-company1/about/?viewAsMember=true" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="p-2.5 bg-fb-teal/5 text-fb-teal rounded-full hover:bg-fb-green hover:text-fb-teal transition-all duration-300 shadow-sm" 
                aria-label="LinkedIn"
              >
                <svg className="w-[15px] h-[15px] fill-none stroke-current stroke-2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                  <rect x="2" y="9" width="4" height="12"></rect>
                  <circle cx="4" cy="4" r="2"></circle>
                </svg>
              </a>
              <a 
                href="https://www.tiktok.com/@fbcompany1" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="p-2.5 bg-fb-teal/5 text-fb-teal rounded-full hover:bg-fb-green hover:text-fb-teal transition-all duration-300 shadow-sm" 
                aria-label="TikTok"
              >
                <svg className="w-[15px] h-[15px] fill-current" viewBox="0 0 24 24">
                  <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.17-2.86-.74-3.94-1.74-.22-.21-.42-.45-.61-.7-.01 2.44-.01 4.87-.02 7.31-.04 1.86-.46 3.75-1.52 5.27-1.16 1.73-3.14 2.87-5.24 3.09-2.41.25-4.96-.46-6.66-2.22-1.92-1.98-2.61-4.99-1.78-7.65.65-2.12 2.29-3.95 4.42-4.66.79-.26 1.63-.36 2.47-.36v4.14c-.6-.02-1.2.1-1.75.36-1.04.48-1.72 1.6-1.66 2.76.04 1.16.8 2.19 1.91 2.53.94.29 2.01.07 2.75-.58.62-.55.93-1.39.91-2.22v-13.6z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* Directory Column */}
        <div className="space-y-4 text-start">
          <h4 className="text-fb-teal font-extrabold text-sm uppercase tracking-wider">{t('footer.navTitle')}</h4>
          <ul className="space-y-3 text-sm">
            {navLinks.map((link) => (
              <li key={link.nameKey}>
                <Link href={link.href} className="text-slate-700 hover:text-fb-green font-medium transition-colors">
                  {t(link.nameKey)}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact Info Column */}
        <div className="space-y-4 text-start">
          <h4 className="text-fb-teal font-extrabold text-sm uppercase tracking-wider">{t('footer.hq')}</h4>
          <ul className="space-y-4 text-sm text-slate-700 text-start">
            <li className="text-start">
              <a 
                href={contactInfo?.mapUrl || "https://www.google.com/maps/place/FB+For+Assets+Management/@30.0343159,31.4653286,20.59z/data=!4m6!3m5!1s0x14583d006250c8a5:0x150a24e30755449!8m2!3d30.0344348!4d31.4654409!16s%2Fg%2F11lf4xhkxt?entry=ttu&g_ep=EgoyMDI2MDgxOS4wIKXMDSoASAFQAw%3D%3D"}
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-start gap-3.5 group cursor-pointer transition-colors"
                title={locale === 'ar' ? 'افتح الموقع على خرائط جوجل' : 'Open in Google Maps'}
              >
                <div className="w-9 h-9 rounded-xl bg-fb-teal/5 border border-fb-teal/10 flex items-center justify-center shrink-0 text-fb-green group-hover:bg-fb-green group-hover:text-fb-teal transition-colors mt-0.5 shadow-xs">
                  <MapPin size={17} strokeWidth={1.5} />
                </div>
                <span className="leading-relaxed text-start pt-1 text-slate-700 group-hover:text-fb-green font-medium transition-colors">
                  {locale === 'ar' ? (contactInfo?.address_ar || contactInfo?.address || t('footer.address')) : (contactInfo?.address || t('footer.address'))}
                </span>
              </a>
            </li>
            <li className="flex items-center gap-3.5 text-start">
              <div className="w-9 h-9 rounded-xl bg-fb-teal/5 border border-fb-teal/10 flex items-center justify-center shrink-0 text-fb-green">
                <Mail size={17} strokeWidth={1.5} />
              </div>
              <a href={`mailto:${contactInfo?.email || 'info@fbcompany.com'}`} className="hover:text-fb-green font-medium text-slate-700 transition-colors text-start">
                {contactInfo?.email || 'info@fbcompany.com'}
              </a>
            </li>
            <li className="flex items-center gap-3.5 text-start">
              <div className="w-9 h-9 rounded-xl bg-fb-teal/5 border border-fb-teal/10 flex items-center justify-center shrink-0 text-fb-green">
                <Phone size={17} strokeWidth={1.5} />
              </div>
              <a 
                href={`tel:${(contactInfo?.phone || '+201117751967').replace(/\s+/g, '')}`} 
                dir="ltr"
                className="hover:text-fb-green font-mono font-bold text-slate-800 transition-colors inline-block"
              >
                {contactInfo?.phone || '+20 111 775 1967'}
              </a>
            </li>
          </ul>
        </div>

      </div>

      {/* Bottom Bar */}
      <div className="max-w-7xl mx-auto px-6 pt-8 pb-10 border-t border-fb-teal/10 flex flex-col md:flex-row justify-between items-center text-xs text-slate-600 gap-4">
        <div className="flex items-center gap-2">
          <p>{t('footer.rights').replace('2026', currentYear)}</p>
          <button
            onClick={() => setIsPasscodeOpen(true)}
            className="opacity-20 hover:opacity-100 text-fb-teal p-1 rounded transition-opacity cursor-pointer"
            title="Admin Portal"
            aria-label="Secret Portal"
          >
            <Lock size={12} />
          </button>
        </div>
        <div className="flex items-center gap-6">
          <a href="#" className="hover:text-fb-green transition-colors">{t('footer.privacy')}</a>
          <a href="#" className="hover:text-fb-green transition-colors">{t('footer.terms')}</a>
        </div>
      </div>
    </footer>
  );
}
