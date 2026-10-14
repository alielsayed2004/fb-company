import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({
  path: '/asset-management',
  locale: 'en',
  title: "Commercial Real Estate Asset Management | F.B Company",
  description: "We manage, lease and operate commercial locations in Egypt: tenant mix, lease administration and day-to-day operations.",
});

export default function Layout({ children }) { return children; }
