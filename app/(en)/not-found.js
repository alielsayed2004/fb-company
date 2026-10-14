import NotFoundContent from '@/components/NotFoundContent';

export const metadata = { title: 'Page Not Found | F.B Company', robots: { index: false } };

export default function NotFound() {
  return <NotFoundContent locale="en" />;
}
