import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({
  path: '/terms',
  locale: 'en',
  title: "Terms of Use | F.B Company",
  description: "The terms that apply when you use fbassets.com, the website of F.B Company in New Cairo, Egypt.",
});

export default function Layout({ children }) { return children; }
