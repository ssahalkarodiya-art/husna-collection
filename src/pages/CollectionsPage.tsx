import React from 'react';
import { PRODUCTS } from '../data/products';

interface CollectionsPageProps {
  onNavigate: (page: string, categoryOrProductId?: string) => void;
}

export const CollectionsPage: React.FC<CollectionsPageProps> = ({ onNavigate }) => {
  const collections = [
    {
      id: 'eid-2026',
      title: 'The Eid Couture Capsule 2026',
      subtitle: 'Sculpted Medina Silks & Golden Zardozi Embroidery',
      description: 'An ode to festive dignity. Fluid floor-sweeping silhouettes detailed with understated geometric threadwork, designed to celebrate cherished milestones with effortless grace.',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAvOI0QrVGCqMhPn-Qa8Blr0z4gSK25VwYRPXKId1OOPyYFJqUsBhGj0VOHoiKQUB3n6zEq3tKZPOq5G6qzRxymiQINihHNPPvjm2WJkPL9p9Qf2pt5oRHrJpeqwKIj_UgtE2B249enUkV1P2kInbM0bdMfqv_m0jp5XJkH_IsTdENbKmFhpnrBbqRwsxn8DUCJE3nny3TB09Qqpj5w5XseaqQTzDzjEH0AYBxiQvFUCdh7nSjRjhys',
      category: 'abayas',
      itemsCount: '14 Designs',
    },
    {
      id: 'desert-linen',
      title: 'Oasis & Washed Linen Series',
      subtitle: 'Pure Pre-Washed Organic Flax for High Summer',
      description: 'Breathable, tactile, and inherently cooling. Crafted from ethically certified flax fibers that get softer with every wear while remaining 100% opaque.',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBdRlU1kuKRj2VyjX9iygfD2CmiBdoP5QOUmsAV5MWn7uqUwT0g1Ghb2MdIpQr9av_74weXKXw7baiwDIZskxoH2EMKD9VTUfF-KcreCWyAI-ghgYpUYSRU_Pn_n-jrKOb9T31_qIaCX7-LW1u2Y73mSigNlHN4u7y-IHmMkU68e5anYYZTD3Fm9NdxJ3dvl47F1emcY2pbj2xCb8uhY7jeytYuyxVxYC8_ojOLTAt-Emeu2noNj772',
      category: 'abayas',
      itemsCount: '18 Designs',
    },
    {
      id: 'monochrome-onyx',
      title: 'The Onyx Heritage Edit',
      subtitle: 'Authentic Korean Nida in Deep Charcoal & Pure Black',
      description: 'The foundation of the timeless modest wardrobe. Sculpted shoulders, generous deep pockets, and flawless drape that moves with you from dawn to dusk.',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD21CgfOWX_ZE8kTJa0S6Jf76Wv3M-HCIzvIbYgUVTOkjr8wCIetR_1jE0iJ9p1ZbhK9VSxD9VTq7I52iy6OBYJCPOnOlnixW1_kLbHmQvWWxJY3GwQveoP3qwvFvq2GWFRvobwp3A3ARoYAbMzBpFPgDxXD9_peV9EPZ1S9DC0HTQqjSPxlPLpfcdfe1d2Y6-ZkvNJh7bUJMahMYth89ukYCr3U1DXO2JoM8dv1QUQYB9uNyKh5Xtv',
      category: 'abayas',
      itemsCount: '12 Designs',
    },
    {
      id: 'silk-chiffon-palette',
      title: 'The Earth & Desert Hijab Archive',
      subtitle: 'Mulberry Silk Chiffon in 24 Natural Mineral Shades',
      description: 'Lightweight, feather-soft, and non-slip. Carefully chosen earthen tones that illuminate and complement every complexion with natural warmth.',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCZV1e6FyNmqDmZeCl9Eor5P9KkpZHAiO9sg7e7FzmDAVIqG4X10mLYzPM5AfmE_1hjD1-dcXtNabnrPD4NPox8Nb34cHY2SjHl-9WsDWIm7VVKcmGxCjX66j5fZwj1h7Nb1_d7qVsIaCpvBr0cpb7xP2ROa93oE_RuIw_qBCe2xGF2vqXlltLIvkkdihZY_yB3C4h8MEmV0JqL6s2Oc5zrmFgiBe-TUQhiNkbSNNcCFV_q3YTbCLpQ',
      category: 'hijabs',
      itemsCount: '24 Shades',
    },
    {
      id: 'atelier-caps-studio',
      title: 'The Atelier Modest Cap & Bonnet Studio',
      subtitle: 'Pure Mulberry Silk Linings, Mongolian Cashmere & Cross-Front Turbans',
      description: 'Engineered for women seeking healthy hair protection, non-slip dignity, and headache-free wear. Featuring grade-6A silk linings, fine-gauge cashmere berets, and micro-modal drapes across black, beige, brown, grey, maroon, and pastel blush.',
      image: '/caps/cap-silk-bonnet.svg',
      category: 'caps',
      itemsCount: '6 Atelier Styles',
    },
  ];

  return (
    <div className="w-full bg-[#fdf9f3] min-h-screen">
      
      {/* Header */}
      <section className="max-w-[1380px] mx-auto px-4 sm:px-8 lg:px-16 pt-8 pb-12">
        <div className="text-center max-w-2xl mx-auto flex flex-col items-center">
          <span className="text-[10px] font-bold text-[#5c6149] uppercase tracking-widest mb-1">
            HAUTE MODESTY LOOKBOOK
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-semibold text-[#171411] tracking-tight">
            Curated Collections
          </h1>
          <p className="text-xs sm:text-sm text-[#4d4540] mt-3 leading-relaxed">
            Explore seasonal editions crafted with intention. Each capsule is unified by noble natural textiles, mindful tailoring, and architectural drape.
          </p>
        </div>
      </section>

      {/* Collections Stack */}
      <section className="max-w-[1380px] mx-auto px-4 sm:px-8 lg:px-16 pb-20 flex flex-col gap-16">
        {collections.map((col, idx) => {
          const isEven = idx % 2 === 0;
          return (
            <div
              key={col.id}
              className={`grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center bg-white p-6 sm:p-10 rounded-3xl border border-[#e6e2dc] shadow-xs`}
            >
              {/* Visual Frame */}
              <div className={`lg:col-span-6 ${isEven ? 'lg:order-1' : 'lg:order-2'}`}>
                <div className="relative aspect-[4/3] sm:aspect-[16/10] rounded-2xl overflow-hidden bg-[#f1ede7] shadow-sm group">
                  <img
                    src={col.image}
                    alt={col.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-xs text-[#171411] text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full shadow-xs">
                    {col.itemsCount}
                  </div>
                </div>
              </div>

              {/* Text Info */}
              <div className={`lg:col-span-6 ${isEven ? 'lg:order-2' : 'lg:order-1'} flex flex-col items-start gap-3.5`}>
                <span className="text-[10px] font-bold text-[#5c6149] uppercase tracking-widest">
                  {col.subtitle}
                </span>
                <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-[#171411] leading-tight">
                  {col.title}
                </h2>
                <p className="text-xs sm:text-sm text-[#4d4540] leading-relaxed">
                  {col.description}
                </p>

                <div className="pt-2 flex items-center gap-3">
                  <button
                    onClick={() => onNavigate('shop', col.category)}
                    className="inline-flex items-center gap-2 bg-[#171411] hover:bg-[#2c2825] text-white px-6 py-2.5 rounded-full text-xs font-semibold transition-all shadow-xs cursor-pointer"
                  >
                    <span>View Collection</span>
                    <span className="material-symbols-outlined text-sm">arrow_forward</span>
                  </button>

                  <a
                    href={`https://wa.me/917227972655?text=Hello%20Husna%20Collection%2C%20I%20would%20like%20to%20inquire%20about%20the%20${encodeURIComponent(
                      col.title
                    )}.`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs text-[#5c6149] hover:text-[#171411] font-semibold underline"
                  >
                    <span className="material-symbols-outlined text-sm">chat</span>
                    <span>Stylist Preview</span>
                  </a>
                </div>
              </div>
            </div>
          );
        })}
      </section>

    </div>
  );
};
