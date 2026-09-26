import React, { useState } from 'react';
import { ARTICLES } from '../data/articles';
import { Article } from '../types';

export const BlogPage: React.FC = () => {
  const [activeArticle, setActiveArticle] = useState<Article | null>(null);

  return (
    <div className="w-full bg-[#fdf9f3] min-h-screen">
      
      {/* Header */}
      <section className="max-w-[1380px] mx-auto px-4 sm:px-8 lg:px-16 pt-8 pb-10 text-center max-w-2xl mx-auto flex flex-col items-center">
        <span className="text-[10px] font-bold text-[#5c6149] uppercase tracking-widest mb-1">
          THE HUSNA JOURNAL & LOOKBOOK
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-semibold text-[#171411] tracking-tight">
          Modest Styling & Care Guides
        </h1>
        <p className="text-xs sm:text-sm text-[#4d4540] mt-2 leading-relaxed">
          Expert insights on abaya length selection, fabric preservation, and modern modest layering techniques.
        </p>
      </section>

      {/* Articles Grid */}
      <section className="max-w-[1380px] mx-auto px-4 sm:px-8 lg:px-16 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {ARTICLES.map((article) => (
            <article
              key={article.id}
              onClick={() => setActiveArticle(article)}
              className="bg-white rounded-2xl overflow-hidden border border-[#e6e2dc] shadow-xs hover:shadow-md transition-all flex flex-col justify-between group cursor-pointer"
            >
              <div>
                <div className="aspect-[16/10] w-full overflow-hidden bg-[#f1ede7]">
                  <img
                    src={article.image}
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="p-5 flex flex-col gap-2">
                  <div className="flex items-center justify-between text-[11px] text-[#5c6149] font-semibold uppercase tracking-wider">
                    <span>{article.category}</span>
                    <span className="text-[#7e756f] font-normal">{article.readTime}</span>
                  </div>
                  <h3 className="font-serif text-base font-semibold text-[#171411] group-hover:text-[#5c6149] transition-colors leading-snug">
                    {article.title}
                  </h3>
                  <p className="text-xs text-[#7e756f] leading-relaxed line-clamp-3">
                    {article.excerpt}
                  </p>
                </div>
              </div>

              <div className="p-5 pt-0 flex items-center justify-between text-xs font-semibold text-[#171411]">
                <span className="text-[#7e756f] font-normal text-[11px]">{article.date}</span>
                <span className="flex items-center gap-1 group-hover:translate-x-1 transition-transform text-[#5c6149]">
                  <span>Read Article</span>
                  <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </span>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Article Reader Modal */}
      {activeArticle && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-[#171411]/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#fdf9f3] w-full max-w-2xl rounded-2xl shadow-2xl border border-[#e6e2dc] overflow-hidden relative max-h-[90vh] flex flex-col">
            
            <div className="p-4 bg-white border-b border-[#e6e2dc] flex items-center justify-between">
              <span className="text-xs font-semibold text-[#5c6149] uppercase tracking-wider">
                {activeArticle.category} • {activeArticle.readTime}
              </span>
              <button
                onClick={() => setActiveArticle(null)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-[#7e756f] hover:text-[#171411] hover:bg-[#f1ede7] transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 sm:p-8">
              <div className="aspect-[16/9] w-full rounded-xl overflow-hidden mb-6 bg-[#f1ede7]">
                <img
                  src={activeArticle.image}
                  alt={activeArticle.title}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>

              <h2 className="font-serif text-2xl font-semibold text-[#171411] mb-2 leading-tight">
                {activeArticle.title}
              </h2>
              <p className="text-xs text-[#7e756f] mb-6">Published on {activeArticle.date}</p>

              <div className="flex flex-col gap-4 text-xs sm:text-sm text-[#4d4540] leading-relaxed">
                {activeArticle.content.map((p, idx) => (
                  <p key={idx}>{p}</p>
                ))}
              </div>

              <div className="mt-8 pt-6 border-t border-[#e6e2dc] flex items-center justify-between">
                <span className="font-cursive text-2xl text-[#5c6149]">
                  Modest Fashion Brighter Tomorrow ♥
                </span>
                <button
                  onClick={() => setActiveArticle(null)}
                  className="bg-[#171411] text-white px-5 py-2 rounded-full text-xs font-semibold hover:bg-[#2c2825]"
                >
                  Close Guide
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
