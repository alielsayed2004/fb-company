import { getPostBySlug } from '@/lib/api';

export async function generateMetadata({ params }) {
  const { slug } = params;
  const post = getPostBySlug(slug, 'ar');

  if (!post) return { title: 'غير موجود' };

  return {
    title: `${post.meta.title} | إف بي رؤى`,
    description: post.meta.description,
    authors: [{ name: post.meta.author }],
    openGraph: {
      title: post.meta.title,
      description: post.meta.description,
      images: [post.meta.coverImage || '/company/logo.png'],
    },
    alternates: {
      canonical: `/ar/insights/${slug}`,
      languages: {
        'en': `/insights/${slug}`,
        'ar': `/ar/insights/${slug}`,
        'x-default': `/insights/${slug}`
      }
    }
  };
}

export default function Layout({ children }) {
  return children;
}
