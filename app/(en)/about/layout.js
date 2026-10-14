import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({
  path: '/about',
  locale: 'en',
  title: "About F.B Company | New Cairo, Egypt",
  description: "F.B Company, based in New Cairo, manages, leases and operates commercial locations and sources sites for franchise brands across Egypt.",
});

export default function Layout({ children }) { return children; }
