import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({
  path: '/terms',
  locale: 'ar',
  title: "شروط الاستخدام | إف بي",
  description: "الشروط التي تسري عند استخدام موقع fbassets.com التابع لشركة إف بي في القاهرة الجديدة، مصر.",
});

export default function Layout({ children }) { return children; }
