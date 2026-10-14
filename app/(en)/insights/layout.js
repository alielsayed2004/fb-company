import { pageMetadata } from '@/lib/seo';

// Not indexed while articles are placeholders and Insights is out of the navigation.
export const metadata = pageMetadata({
  path: '/insights',
  locale: 'en',
  title: "Insights | F.B Company",
  description: "Articles from F.B Company on commercial real estate and franchise locations in Egypt.",
  noindex: true,
});

export default function Layout({ children }) { return children; }
