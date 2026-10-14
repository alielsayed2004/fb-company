import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({
  path: '/franchise-sourcing',
  locale: 'ar',
  title: "توفير مواقع الفرنشايز في مصر | إف بي",
  description: "مواقع في محطات الوقود والمولات والأندية لعلامات الفرنشايز التي تتوسع في مصر. أرسل متطلباتك إلى فريقنا.",
});

export default function Layout({ children }) { return children; }
