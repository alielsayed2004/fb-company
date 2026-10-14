import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({
  path: '/privacy-policy',
  locale: 'ar',
  title: "سياسة الخصوصية | إف بي",
  description: "كيف تجمع شركة إف بي البيانات الشخصية المقدَّمة عبر موقع fbassets.com وتستخدمها وتحميها، بما فيها الاستفسارات وطلبات التوظيف.",
});

export default function Layout({ children }) { return children; }
