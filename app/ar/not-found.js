import NotFoundContent from '@/components/NotFoundContent';

export const metadata = { title: 'الصفحة غير موجودة | إف بي', robots: { index: false } };

export default function NotFound() {
  return <NotFoundContent locale="ar" />;
}
