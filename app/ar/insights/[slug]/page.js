import { getPostBySlug } from '@/lib/api';
import ReactMarkdown from 'react-markdown';

export default function InsightArticleAr({ params }) {
  const { slug } = params;
  const post = getPostBySlug(slug, 'ar');

  if (!post) {
    return <div className="pt-32 pb-24 text-center">المقال غير موجود.</div>;
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": post.meta.title,
    "description": post.meta.description,
    "image": post.meta.coverImage || "https://fbassets.com/company/logo.png",
    "author": {
      "@type": "Organization",
      "name": post.meta.author
    },
    "datePublished": post.meta.date,
  };

  return (
    <main className="min-h-screen bg-fb-bg-light pt-32 pb-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <div className="mb-8">
          <div className="text-fb-green font-bold uppercase tracking-wider mb-2">
            {post.meta.date} • {post.meta.author}
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-fb-teal mb-6">
            {post.meta.title}
          </h1>
        </div>
        
        <article className="prose prose-lg prose-teal max-w-none text-slate-700 rtl">
          <ReactMarkdown>{post.content}</ReactMarkdown>
        </article>
      </div>
    </main>
  );
}
