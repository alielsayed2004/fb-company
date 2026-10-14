import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({
  path: '/privacy-policy',
  locale: 'en',
  title: "Privacy Policy | F.B Company",
  description: "How F.B Company collects, uses and protects personal data shared through fbassets.com, including enquiries and job applications.",
});

export default function Layout({ children }) { return children; }
