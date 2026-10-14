import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({
  path: '/risk-disclaimer',
  locale: 'ar',
  title: "إخلاء المسؤولية عن المخاطر | إف بي",
  description: "معلومات مهمة حول حدود محتوى موقع fbassets.com ومخاطر العقارات التجارية.",
});

export default function Layout({ children }) { return children; }
