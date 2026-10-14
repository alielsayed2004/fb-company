import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({
  path: '/contact',
  locale: 'ar',
  title: "تواصل مع شركة إف بي | القاهرة الجديدة",
  description: "احجز استشارة مع شركة إف بي في القاهرة الجديدة. اتصل على 01117751967 أو راسلنا على info@fbassets.com.",
});

export default function Layout({ children }) { return children; }
