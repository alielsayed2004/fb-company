import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({
  path: '/asset-management',
  locale: 'ar',
  title: "إدارة الأصول العقارية التجارية | إف بي",
  description: "ندير المواقع التجارية في مصر ونؤجرها ونشغّلها، من مزيج المستأجرين وإدارة العقود إلى التشغيل اليومي.",
});

export default function Layout({ children }) { return children; }
