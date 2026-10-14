import { notFound } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import { getPostBySlug, getPostSlugs } from '@/lib/api';
import { pageMetadata, SITE_URL } from '@/lib/seo';

// Insights is out of the navigation and the sitemap; articles stay noindex until real content exists.
export const dynamicParams = false;

export function generateStaticParams() {
  return getPostSlugs('ar').map((file) => ({ slug: file.replace(/\.md$/, '') }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const post = getPostBySlug(slug, 'ar');
  if (!post) return {};
  return pageMetadata({
    path: `/insights/${slug}`,
    locale: 'ar',
    title: post.meta.title,
    description: post.meta.description,
    noindex: true,
  });
}

export default async function InsightArticle({ params }) {
  const { slug } = await params;
  const post = getPostBySlug(slug, 'ar');
  if (!post) notFound();

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.meta.title,
    description: post.meta.description,
    datePublished: post.meta.date,
    inLanguage: 'ar',
    author: { '@type': 'Organization', name: 'F.B Company', '@id': `${SITE_URL}/#organization` },
    publisher: { '@id': `${SITE_URL}/#organization` },
  };

  return (
    <div className="min-h-screen bg-fb-bg-light pt-32 pb-12">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <p className="text-sm font-bold text-fb-teal/80 mb-2">
          <time dateTime={post.meta.date}>{post.meta.date}</time> · F.B Company
        </p>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-fb-teal mb-6">{post.meta.title}</h1>
        <article className="prose prose-lg max-w-none text-slate-700" dir="rtl">
          <ReactMarkdown components={{ h1: 'h2', h2: 'h3', h3: 'h4' }}>{post.content}</ReactMarkdown>
        </article>
      </div>
    </div>
  );
}
