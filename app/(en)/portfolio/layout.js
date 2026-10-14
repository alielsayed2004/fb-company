import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({
  path: '/portfolio',
  locale: 'en',
  title: "Our Commercial Locations in Egypt | F.B Company",
  description: "Commercial locations in New Cairo, 10th of Ramadan, Heliopolis, Obour and the North Coast sourced, developed or managed by F.B Company.",
});

export default function Layout({ children }) { return children; }
