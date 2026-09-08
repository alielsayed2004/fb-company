'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowRight, Calendar, BookOpen, Clock, Tag } from 'lucide-react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { useData } from '@/context/DataContext';

export default function BlogSection() {
  const { locale, t } = useLanguage();
  const { blogsEn, blogsAr } = useData();
  const [selectedArticle, setSelectedArticle] = useState(null);

  const articles = locale === 'ar' ? blogsAr : blogsEn;

  return (
    <section className="py-12 sm:py-20 md:py-24 bg-fb-bg-light border-t border-fb-bg-light" id="blog">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-8 sm:space-y-12">
        
        {/* Title Block */}
        <div className="text-center space-y-2.5 sm:space-y-3 max-w-4xl mx-auto">
          <span className="eyebrow text-fb-green block">{t('home.blog.eyebrow')}</span>
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-extrabold text-fb-teal tracking-tight text-balance">
            {t('home.blog.title')}
          </h2>
        </div>

        {/* 4 Columns Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8 md:gap-10 pt-2 sm:pt-4">
          {articles.map((article) => (
            <motion.div
              key={article.id}
              onClick={() => setSelectedArticle(article)}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: article.id * 0.1 }}
              className="flex flex-col justify-between group cursor-pointer space-y-4 sm:space-y-6 bg-fb-bg-light/90 p-5 sm:p-7 rounded-2xl sm:rounded-3xl border border-fb-teal/15 shadow-[0_8px_30px_rgba(0,59,60,0.05)] hover:shadow-[0_15px_35px_rgba(83,179,121,0.15)] hover:border-fb-green hover:-translate-y-1.5 transition-all duration-300"
            >
              {/* Top Text Content */}
              <div className="space-y-3">
                <span className="inline-block text-[10px] font-bold uppercase tracking-wider text-fb-green bg-fb-green/10 px-2.5 py-1 rounded">
                  {article.category}
                </span>
                <h3 className="text-base md:text-lg font-extrabold text-fb-teal leading-snug group-hover:text-fb-green transition-colors duration-300">
                  {article.title}
                </h3>
                <p className="text-xs md:text-sm text-fb-black/70 leading-relaxed line-clamp-3">
                  {article.excerpt}
                </p>
              </div>

              {/* Bottom Date & Action */}
              <div className="space-y-3 pt-4">
                <div className="flex items-center justify-between text-xs font-semibold text-fb-black/40 font-mono">
                  <span>{article.date}</span>
                  <span className="text-fb-green text-[11px] font-bold group-hover:translate-x-1 transition-transform flex items-center">
                    {locale === 'ar' ? 'اقرأ المقال' : 'Read Article'} <ArrowRight size={12} className="ml-1 mr-1" />
                  </span>
                </div>
                <div className="h-[1.5px] bg-fb-teal/20 w-full group-hover:bg-fb-green transition-colors duration-300" />
              </div>
            </motion.div>
          ))}
        </div>

      </div>

      {/* Article Reader Modal */}
      <AnimatePresence>
        {selectedArticle && (
          <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 sm:p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedArticle(null)}
              className="fixed inset-0 bg-fb-black/60 backdrop-blur-sm"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.3 }}
              className="relative bg-fb-white rounded-3xl max-w-2xl w-full p-6 sm:p-10 shadow-2xl z-10 border border-fb-teal/10 space-y-6 my-8 max-h-[85vh] overflow-y-auto"
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedArticle(null)}
                className="absolute top-6 right-6 p-2 rounded-full bg-fb-teal/5 text-fb-teal hover:bg-fb-teal hover:text-fb-white transition-colors"
                aria-label="Close"
              >
                <X size={20} />
              </button>

              {/* Meta Tags */}
              <div className="flex flex-wrap items-center gap-3 text-xs text-fb-black/60 pt-2">
                <span className="bg-fb-green/20 text-fb-teal font-extrabold px-3 py-1 rounded-full flex items-center space-x-1">
                  <Tag size={12} className="mr-1 ml-1 text-fb-green" />
                  <span>{selectedArticle.category}</span>
                </span>
                <span className="flex items-center space-x-1">
                  <Calendar size={13} className="mr-1 ml-1 text-fb-green" />
                  <span>{selectedArticle.date}</span>
                </span>
                <span>•</span>
                <span className="flex items-center space-x-1">
                  <Clock size={13} className="mr-1 ml-1 text-fb-green" />
                  <span>{selectedArticle.readTime}</span>
                </span>
              </div>

              {/* Headline */}
              <h2 className="text-2xl sm:text-3xl font-extrabold text-fb-teal leading-tight">
                {selectedArticle.title}
              </h2>

              <div className="h-0.5 bg-fb-teal/10 w-full" />

              {/* Full Content */}
              <div className="space-y-4 text-fb-black/85 text-sm sm:text-base leading-relaxed whitespace-pre-line font-lama">
                {selectedArticle.fullContent}
              </div>

              {/* Bottom CTA Card */}
              <div className="bg-fb-teal text-fb-white p-6 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mt-8">
                <div>
                  <h4 className="font-extrabold text-fb-white text-base">
                    {locale === 'ar' ? 'هل لديك فرصة أو استفسار مماثل؟' : 'Have a similar opportunity or inquiry?'}
                  </h4>
                  <p className="text-xs text-fb-bg-light/75">
                    {locale === 'ar' ? 'تحدث مباشرة مع خبراء السورسينج وإدارة الأصول لدينا.' : 'Consult directly with our sourcing & asset management directors.'}
                  </p>
                </div>
                <Link
                  href="/contact?interest=consultation"
                  onClick={() => setSelectedArticle(null)}
                  className="bg-fb-green hover:bg-fb-green-hover text-fb-teal font-bold px-6 py-3 rounded-xl text-xs transition-colors shrink-0 shadow-md uppercase tracking-wider"
                >
                  {t('common.bookConsultation')}
                </Link>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </section>
  );
}
