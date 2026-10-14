import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({
  path: '/risk-disclaimer',
  locale: 'en',
  title: "Risk Disclaimer | F.B Company",
  description: "Important information about the limits of the content on fbassets.com and the risks of commercial real estate.",
});

export default function Layout({ children }) { return children; }
