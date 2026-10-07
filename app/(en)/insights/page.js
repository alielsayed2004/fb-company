import Link from 'next/link';
import { getAllPosts } from '@/lib/api';
import { ArrowRight, BookOpen } from 'lucide-react';

export default function InsightsPage() {
  const posts = getAllPosts('en');

  return (
    <main className="min-h-screen bg-fb-bg-light pt-32 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="mb-12 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-fb-teal/5 border border-fb-teal/10 text-fb-teal text-xs font-bold uppercase tracking-widest mb-4">
            <BookOpen size={14} />
            <span>Market Insights & Research</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-fb-teal mb-4 text-balance">
            Insights & Research
          </h1>
          <p className="text-slate-600 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
            Data-driven perspectives on commercial real estate, asset management, and retail franchising in Egypt.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => (
            <Link key={post.slug} href={`/insights/${post.slug}`} className="group bg-white rounded-3xl border border-fb-teal/10 overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col">
              <div className="p-6 sm:p-8 flex-1 flex flex-col">
                <div className="text-xs font-bold text-fb-green mb-3 uppercase tracking-wider">{post.meta.date}</div>
                <h2 className="text-xl font-bold text-fb-teal mb-3 group-hover:text-fb-green transition-colors">{post.meta.title}</h2>
                <p className="text-slate-600 text-sm leading-relaxed mb-6 flex-1">{post.meta.description}</p>
                <div className="inline-flex items-center gap-2 text-fb-teal font-semibold text-sm group-hover:text-fb-green transition-colors mt-auto">
                  <span>Read Article</span>
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
