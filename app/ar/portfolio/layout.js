import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({
  path: '/portfolio',
  locale: 'ar',
  title: "مواقعنا التجارية في مصر | إف بي",
  description: "مواقع تجارية في القاهرة الجديدة والعاشر من رمضان ومصر الجديدة والعبور والساحل الشمالي، وفّرتها شركة إف بي أو طوّرتها أو تديرها.",
});

export default function Layout({ children }) { return children; }
