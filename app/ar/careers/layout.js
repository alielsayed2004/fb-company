import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({
  path: '/careers',
  locale: 'ar',
  title: "الوظائف في شركة إف بي | مصر",
  description: "انضم إلى فريق شركة إف بي في إدارة الأصول العقارية التجارية وتوفير مواقع الفرنشايز في مصر، وقدّم طلبك عبر الإنترنت.",
});

export default function Layout({ children }) { return children; }
