import { pageMetadata } from '@/lib/seo';

// Not indexed while articles are placeholders and Insights is out of the navigation.
export const metadata = pageMetadata({
  path: '/insights',
  locale: 'ar',
  title: "مقالات | إف بي",
  description: "مقالات من شركة إف بي حول العقارات التجارية ومواقع الفرنشايز في مصر.",
  noindex: true,
});

export default function Layout({ children }) { return children; }
