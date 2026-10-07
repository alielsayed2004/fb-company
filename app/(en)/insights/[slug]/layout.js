import { getPostBySlug } from '@/lib/api';
import ReactMarkdown from 'react-markdown';

export async function generateMetadata({ params }) {
  const { slug } = params;
  const post = getPostBySlug(slug, 'en');

  if (!post) return { title: 'Not Found' };

  return {
    title: `${post.meta.title} | F.B Company Insights`,
    description: post.meta.description,
    authors: [{ name: post.meta.author }],
    openGraph: {
      title: post.meta.title,
      description: post.meta.description,
      images: [post.meta.coverImage || '/company/logo.png'],
    },
    alternates: {
      canonical: `/insights/${slug}`,
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
