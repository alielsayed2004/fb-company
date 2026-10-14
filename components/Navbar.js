'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Menu, X, Globe } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

const NAV_LINKS = [
  { nameKey: 'nav.home', href: '/' },
  { nameKey: 'nav.portfolio', href: '/portfolio' },
  { nameKey: 'nav.assetManagement', href: '/asset-management' },
  { nameKey: 'nav.franchiseSourcing', href: '/franchise-sourcing' },
  { nameKey: 'nav.aboutUs', href: '/about' },
  { nameKey: 'nav.careers', href: '/careers' },
  { nameKey: 'nav.contactUs', href: '/contact' },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname() || '/';
  const { locale, t } = useLanguage();
  const isAr = locale === 'ar';
  const toggleRef = useRef(null);
  const drawerRef = useRef(null);

  const alternatePath = isAr ? pathname.replace(/^\/ar/, '') || '/' : `/ar${pathname === '/' ? '' : pathname}`;
  const localized = (href) => (isAr ? (href === '/' ? '/ar' : `/ar${href}`) : href);
  const isActive = (href) => {
    const target = localized(href);
    return href === '/' ? pathname === target : pathname === target || pathname.startsWith(`${target}/`);
  };

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const closeMenu = useCallback(() => {
    setIsOpen(false);
    toggleRef.current?.focus();
  }, []);

  // Mobile menu: scroll lock, focus the first link, trap focus, close with Escape.
  useEffect(() => {
    if (!isOpen) return;
    document.body.style.overflow = 'hidden';
    const focusables = () => drawerRef.current?.querySelectorAll('a[href], button:not([disabled])') || [];
    focusables()[0]?.focus();

    const onKey = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        closeMenu();
      } else if (e.key === 'Tab') {
        const els = [...focusables()];
        if (!els.length) return;
        const first = els[0];
        const last = els[els.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      document.removeEventListener('keydown', onKey);
    };
  }, [isOpen, closeMenu]);

  // Close the menu after navigation.
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // Hooks above must run on every render; hide the public navigation inside the admin area.
  if (pathname.startsWith('/admin')) {
    return null;
  }

  const LanguageSwitch = ({ className = '' }) => (
    <Link
      href={alternatePath}
      hrefLang={isAr ? 'en' : 'ar'}
      lang={isAr ? 'en' : 'ar'}
      className={`inline-flex items-center gap-2 min-h-[44px] px-4 rounded-full border border-white/15 bg-white/5 hover:bg-white/10 text-white text-sm font-semibold transition-colors ${className}`}
    >
      <Globe size={16} className="text-fb-green" aria-hidden="true" />
      <span>{isAr ? 'English' : 'العربية'}</span>
    </Link>
  );

  return (
    <>
      <header
        className={`fixed top-0 inset-x-0 z-50 transition-colors duration-300 pt-[env(safe-area-inset-top,0px)] ${
          isScrolled ? 'bg-fb-teal/95 backdrop-blur-md shadow-lg border-b border-white/10' : 'bg-transparent'
        }`}
      >
        <nav aria-label={isAr ? 'التنقل الرئيسي' : 'Main navigation'} className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 flex items-center justify-between gap-4 h-16 md:h-20">
          <Link href={localized('/')} className="inline-flex items-center min-h-[44px] shrink-0" aria-label={isAr ? 'شركة إف بي — الرئيسية' : 'F.B Company — Home'}>
            <Image
              src="/company/logo.png"
              alt="F.B Company"
              width={150}
              height={38}
              priority
              sizes="150px"
              className="h-9 md:h-10 w-auto object-contain brightness-0 invert"
            />
          </Link>

          <ul className="hidden xl:flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <li key={link.nameKey}>
                <Link
                  href={localized(link.href)}
                  aria-current={isActive(link.href) ? 'page' : undefined}
                  className={`inline-flex items-center min-h-[44px] px-3 rounded-full text-sm font-semibold transition-colors ${
                    isActive(link.href) ? 'bg-white text-fb-teal' : 'text-white/90 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {t(link.nameKey)}
                </Link>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-2">
            <LanguageSwitch className="hidden md:inline-flex" />
            <Link
              href={localized('/contact?interest=consultation#consultation-form')}
              className="hidden md:inline-flex items-center min-h-[44px] px-5 rounded-full bg-fb-green hover:bg-fb-green-hover text-fb-teal text-sm font-extrabold transition-colors"
            >
              {t('common.bookConsultation')}
            </Link>
            <button
              ref={toggleRef}
              type="button"
              onClick={() => setIsOpen((o) => !o)}
              aria-expanded={isOpen}
              aria-controls="mobile-menu"
              aria-label={isOpen ? (isAr ? 'إغلاق القائمة' : 'Close menu') : (isAr ? 'فتح القائمة' : 'Open menu')}
              className="xl:hidden inline-flex items-center justify-center w-11 h-11 rounded-xl border border-white/15 bg-white/10 hover:bg-white/20 text-white transition-colors"
            >
              {isOpen ? <X size={22} aria-hidden="true" /> : <Menu size={22} aria-hidden="true" />}
            </button>
          </div>
        </nav>
      </header>

      {isOpen && <div onClick={closeMenu} className="fixed inset-0 bg-black/60 z-40 xl:hidden" aria-hidden="true" />}

      <div
        id="mobile-menu"
        ref={drawerRef}
        role="dialog"
        aria-modal="true"
        aria-label={isAr ? 'القائمة' : 'Menu'}
        hidden={!isOpen}
        className="fixed inset-y-0 end-0 z-50 w-80 max-w-[85vw] bg-fb-teal shadow-2xl xl:hidden overflow-y-auto pt-[calc(1rem+env(safe-area-inset-top,0px))] pb-[calc(2rem+env(safe-area-inset-bottom,0px))] px-6"
      >
        <div className="flex justify-end mb-4">
          <button
            type="button"
            onClick={closeMenu}
            aria-label={isAr ? 'إغلاق القائمة' : 'Close menu'}
            className="inline-flex items-center justify-center w-11 h-11 rounded-xl border border-white/15 bg-white/10 text-white"
          >
            <X size={22} aria-hidden="true" />
          </button>
        </div>
        <ul className="flex flex-col">
          {NAV_LINKS.map((link) => (
            <li key={link.nameKey}>
              <Link
                href={localized(link.href)}
                onClick={() => setIsOpen(false)}
                aria-current={isActive(link.href) ? 'page' : undefined}
                className={`flex items-center min-h-[48px] text-lg font-semibold border-b border-white/10 ${
                  isActive(link.href) ? 'text-fb-green' : 'text-white'
                }`}
              >
                {t(link.nameKey)}
              </Link>
            </li>
          ))}
        </ul>
        <div className="mt-8 flex flex-col gap-3">
          <Link
            href={localized('/contact?interest=consultation#consultation-form')}
            onClick={() => setIsOpen(false)}
            className="inline-flex items-center justify-center min-h-[48px] rounded-xl bg-fb-green text-fb-teal font-extrabold"
          >
            {t('common.bookConsultation')}
          </Link>
          <LanguageSwitch className="justify-center" />
        </div>
      </div>
    </>
  );
}
