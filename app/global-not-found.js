import './globals.css';
import Link from 'next/link';
import NotFoundContent from '@/components/NotFoundContent';

// Unmatched URLs (the site has separate EN and AR root layouts, so there is no single layout to reuse).
export const metadata = {
  title: 'Page Not Found | F.B Company — الصفحة غير موجودة',
  robots: { index: false },
};

export default function GlobalNotFound() {
  return (
    <html lang="en">
      <body className="min-h-screen bg-fb-bg-light text-fb-black font-lama">
        <header className="bg-fb-teal px-4 sm:px-6 py-4">
          <Link href="/" className="inline-flex items-center min-h-[44px]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/company/logo.png" alt="F.B Company" width={150} height={38} className="h-9 w-auto brightness-0 invert" />
          </Link>
        </header>
        <main>
          <NotFoundContent locale="en" compact />
          <div className="max-w-2xl mx-auto border-t border-fb-teal/10" />
          <NotFoundContent locale="ar" compact headingLevel={2} />
        </main>
      </body>
    </html>
  );
}
