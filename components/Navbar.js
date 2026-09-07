'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Globe } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();
  const { locale, toggleLanguage, t } = useLanguage();
  const isAr = locale === 'ar';

  if (pathname?.startsWith('/admin')) {
    return null;
  }

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { nameKey: 'nav.home', href: '/' },
    { nameKey: 'nav.assetManagement', href: '/asset-management' },
    { nameKey: 'nav.franchiseSourcing', href: '/franchise-sourcing' },
    { nameKey: 'nav.aboutUs', href: '/about' },
    { nameKey: 'nav.contactUs', href: '/contact' }
  ];

  return (
    <>
      <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 pointer-events-none ${
        isScrolled 
          ? 'bg-fb-teal/90 md:bg-transparent backdrop-blur-md md:backdrop-blur-none border-b border-white/10 md:border-transparent py-3 md:py-5 shadow-lg md:shadow-none' 
          : 'bg-transparent py-4 md:py-5'
      }`}>
        <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 md:px-10 flex justify-between items-center">
          {/* Left Side: Logo / Brand Name (Always visible on mobile, hides on desktop scroll) */}
          <div className={`flex-1 flex items-center justify-start transition-all duration-500 transform ${
            isScrolled 
              ? 'md:opacity-0 md:-translate-x-12 rtl:md:translate-x-12 md:pointer-events-none opacity-100 pointer-events-auto' 
              : 'opacity-100 translate-x-0 pointer-events-auto'
          }`}>
            <Link href="/" className="flex items-center">
              <img
                src="/company/logo.png"
                alt="F.B Company"
                className="h-8 sm:h-10 md:h-12 w-auto object-contain brightness-0 invert drop-shadow-md"
              />
            </Link>
          </div>

          {/* Desktop Central Pill Navigation (Floating, perfectly centered) */}
          <div className="hidden md:flex flex-none items-center backdrop-blur-md border border-white/10 bg-white/10 p-1 rounded-full shadow-lg pointer-events-auto">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.nameKey}
                  href={link.href}
                  className={`text-xs md:text-sm font-medium tracking-wide transition-all duration-300 px-5 py-1.5 rounded-full ${
                    isActive 
                      ? 'bg-white text-fb-teal shadow-md font-semibold' 
                      : 'text-white/80 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {t(link.nameKey)}
                </Link>
              );
            })}
          </div>

          {/* Right Side: Language Switcher with smooth exit animation on scroll */}
          <div className={`flex-1 hidden md:flex items-center justify-end transition-all duration-500 transform ${
            isScrolled 
              ? 'opacity-0 translate-x-12 rtl:-translate-x-12 pointer-events-none' 
              : 'opacity-100 translate-x-0 pointer-events-auto'
          }`}>
            <div 
              onClick={toggleLanguage}
              className="flex items-center space-x-2 rtl:space-x-reverse text-white/85 cursor-pointer hover:text-white transition-colors text-sm font-semibold select-none bg-white/5 hover:bg-white/10 px-4 py-1.5 rounded-full border border-white/10 shadow-sm"
            >
              <Globe size={15} className="text-fb-green" />
              <span className={locale === 'en' ? 'text-fb-green font-extrabold' : 'text-white/70'}>ENG</span>
              <span className="text-white/30 text-xs">|</span>
              <span className={locale === 'ar' ? 'text-fb-green font-extrabold' : 'text-white/70'}>العربية</span>
            </div>
          </div>

          {/* Mobile Hamburger Toggle */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-white focus:outline-none p-2 bg-white/10 hover:bg-white/20 active:scale-95 backdrop-blur-md rounded-xl border border-white/15 pointer-events-auto transition-all shadow-sm"
            aria-label="Toggle navigation menu"
          >
            {isOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      {/* Mobile Backdrop Overlay */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black/60 backdrop-blur-xs z-30 md:hidden transition-opacity"
          aria-hidden="true"
        />
      )}

      {/* Mobile Drawer Navigation */}
      <div
        className={`fixed inset-y-0 right-0 rtl:right-auto rtl:left-0 w-80 max-w-[85vw] bg-fb-teal shadow-2xl z-40 transform transition-transform duration-300 ease-in-out md:hidden ${
          isOpen ? 'translate-x-0' : (isAr ? '-translate-x-full' : 'translate-x-full')
        }`}
      >
        <div className="h-full flex flex-col justify-between p-6 sm:p-8 pt-20">
          <div className="flex flex-col space-y-5">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.nameKey}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className={`text-lg font-semibold tracking-wide border-b border-fb-white/10 pb-3 transition-colors ${
                    isActive ? 'text-fb-green' : 'text-fb-white/90'
                  }`}
                >
                  {t(link.nameKey)}
                </Link>
              );
            })}
          </div>

          <div className="flex flex-col space-y-6">
            {/* Mobile language switch */}
            <div 
              onClick={toggleLanguage}
              className="flex items-center space-x-2 rtl:space-x-reverse text-white/85 cursor-pointer hover:text-white transition-colors text-sm font-semibold select-none bg-white/5 hover:bg-white/10 px-4 py-2.5 rounded-lg border border-white/10 self-start"
            >
              <Globe size={18} className="text-fb-green" />
              <span className={locale === 'en' ? 'text-fb-green font-extrabold' : 'text-white/70'}>ENG</span>
              <span className="text-white/30">|</span>
              <span className={locale === 'ar' ? 'text-fb-green font-extrabold' : 'text-white/70'}>العربية</span>
            </div>
            
            <div className="text-center pt-6">
              <p className="text-xs text-fb-bg-light/40">F.B Company — {t('nav.tagline')}</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
