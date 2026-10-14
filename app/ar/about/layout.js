import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({
  path: '/about',
  locale: 'ar',
  title: "عن شركة إف بي | القاهرة الجديدة",
  description: "شركة إف بي، ومقرها القاهرة الجديدة، تدير المواقع التجارية وتؤجرها وتشغّلها، وتوفّر المواقع لعلامات الفرنشايز في أنحاء مصر.",
});

export default function Layout({ children }) { return children; }
