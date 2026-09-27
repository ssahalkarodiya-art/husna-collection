import React, { useState } from 'react';
import { PRODUCTS, TESTIMONIALS, BRAND_INFO } from '../data/products';
import { useCart } from '../context/CartContext';
import { HusnaLogo } from '../components/HusnaLogo';

interface HomePageProps {
  onNavigate: (page: string, categoryOrProductId?: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
  const { addToCart, toggleWishlist, isInWishlist, showToast } = useCart();
  const [activeTestimonialIdx, setActiveTestimonialIdx] = useState(0);
  const [copiedAddress, setCopiedAddress] = useState(false);

  const newArrivals = PRODUCTS.slice(0, 6);

  const handleCopyAddress = () => {
    const fullAddr = `Husna Collection\nShop G-14, G-15, Jasat Plaza, Opp. I.T.I.\nStation Road, Ankleshwar – 393001\nGujarat, India`;
    navigator.clipboard.writeText(fullAddr);
    setCopiedAddress(true);
    showToast('Address Copied', 'Store address copied to clipboard.');
    setTimeout(() => setCopiedAddress(false), 3000);
  };

  const categories = [
    {
      id: 'abayas',
      name: 'Abayas',
      subtitle: 'Timeless Elegance & Haute Drapes',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD21CgfOWX_ZE8kTJa0S6Jf76Wv3M-HCIzvIbYgUVTOkjr8wCIetR_1jE0iJ9p1ZbhK9VSxD9VTq7I52iy6OBYJCPOnOlnixW1_kLbHmQvWWxJY3GwQveoP3qwvFvq2GWFRvobwp3A3ARoYAbMzBpFPgDxXD9_peV9EPZ1S9DC0HTQqjSPxlPLpfcdfe1d2Y6-ZkvNJh7bUJMahMYth89ukYCr3U1DXO2JoM8dv1QUQYB9uNyKh5Xtv',
    },
    {
      id: 'hijabs',
      name: 'Hijabs',
      subtitle: 'Mulberry Silk & Chiffon Drapes',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBOZufcsIvUXwuoHZ_jEds0oCGiETCPsUEzRn8qr0StjHvK0jLhoBP7_d7yPJzaUhiIUQ-GhJfLisKk0OokAD5r7tDrulaWkAS93cZ1QwSOvR7qHfjE5MDDjdw1e_JasG0dNHBaKKQrQA-1glXJqpoSsLstK0EnglH0M6qW2zzSuZiSYnaYpmh52M5noryF_MwYzORR5jCm79qfcXb6DoJndVuVeTLOeLc_KHzMp71RwPU8tQ1mvU9N',
    },
    {
      id: 'caps',
      name: 'Caps',
      subtitle: 'Modest Bonnets, Berets & Under-Caps',
      image: '/caps/cap-silk-bonnet.svg',
    },
  ];

  const currentTestimonial = TESTIMONIALS[activeTestimonialIdx];

  const handleCopyCode = () => {
    navigator.clipboard.writeText('HUSNA20');
    showToast('Promo Code Copied', 'HUSNA20 copied to clipboard! Enjoy 20% off.');
  };

  return (
    <div className="flex flex-col w-full">
      
      {/* SECTION 1: HERO SHOWCASE */}
      <section className="relative w-full bg-[#f7f3ed] overflow-hidden pb-12 sm:pb-16">
        <div className="max-w-[1380px] mx-auto px-4 sm:px-8 lg:px-16 pt-10 sm:pt-14 lg:pt-18">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            
            {/* Left Content */}
            <div className="lg:col-span-6 flex flex-col items-start gap-4 sm:gap-5 z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#f1ede7] text-[#4d4540]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#5c6149]"></span>
                <span className="text-[11px] font-semibold tracking-[0.25em] uppercase">
                  Modesty in Every Moment
                </span>
              </div>

              <h1 className="font-serif text-4xl sm:text-5xl lg:text-[56px] lg:leading-[64px] font-semibold text-[#171411] tracking-tight">
                Style with<br />
                <span className="italic font-normal">Purpose</span>{' '}
                <span className="font-cursive text-[#5c6149] text-4xl lg:text-5xl font-normal">
                  ♡
                </span>
              </h1>

              <p className="text-sm sm:text-base text-[#4d4540] max-w-lg leading-relaxed">
                Modest fashion for modern women — where timeless elegance gracefully meets faith, identity, and mindful luxury.
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  onClick={() => onNavigate('shop')}
                  className="inline-flex items-center gap-2.5 bg-[#171411] hover:bg-[#2c2825] text-white px-7 py-3.5 rounded-full text-xs font-semibold transition-all shadow-md group cursor-pointer"
                >
                  <span>Shop Now</span>
                  <span className="material-symbols-outlined text-base transition-transform group-hover:translate-x-1">
                    arrow_forward
                  </span>
                </button>

                <button
                  onClick={() => onNavigate('collections')}
                  className="inline-flex items-center gap-2 bg-white hover:bg-[#f1ede7] text-[#171411] px-6 py-3.5 rounded-full text-xs font-semibold transition-all shadow-xs cursor-pointer"
                >
                  <span>Explore Collections</span>
                </button>
              </div>

              {/* Micro Highlight Metrics */}
              <div className="pt-6 flex items-center gap-6 sm:gap-10 text-[#4d4540] border-t border-[#e6e2dc]/80 w-full max-w-md">
                <div className="flex flex-col">
                  <span className="font-serif text-lg font-semibold text-[#171411]">50,000+</span>
                  <span className="text-[11px] text-[#7e756f]">Modest Wardrobes Curated</span>
                </div>
                <div className="w-px h-8 bg-[#e6e2dc]"></div>
                <div className="flex flex-col">
                  <span className="font-serif text-lg font-semibold text-[#171411]">4.9 ★</span>
                  <span className="text-[11px] text-[#7e756f]">Over 4,200 Client Reviews</span>
                </div>
              </div>
            </div>

            {/* Right Editorial Visual */}
            <div className="lg:col-span-6 relative flex justify-center lg:justify-end">
              <div className="relative w-full max-w-[520px] aspect-[4/5] rounded-[2.5rem] overflow-hidden shadow-xl bg-[#f1ede7] group">
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAvOI0QrVGCqMhPn-Qa8Blr0z4gSK25VwYRPXKId1OOPyYFJqUsBhGj0VOHoiKQUB3n6zEq3tKZPOq5G6qzRxymiQINihHNPPvjm2WJkPL9p9Qf2pt5oRHrJpeqwKIj_UgtE2B249enUkV1P2kInbM0bdMfqv_m0jp5XJkH_IsTdENbKmFhpnrBbqRwsxn8DUCJE3nny3TB09Qqpj5w5XseaqQTzDzjEH0AYBxiQvFUCdh7nSjRjhys"
                  alt="Editorial modest portrait in belted kaftan"
                  className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none"></div>

                {/* Floating Cursive Badge */}
                <div className="absolute top-6 right-6 max-w-[210px] p-3.5 rounded-2xl bg-white/85 backdrop-blur-md shadow-lg text-right select-none">
                  <span className="font-cursive text-3xl sm:text-4xl text-[#171411] block leading-snug">
                    More Than Fashion,
                  </span>
                  <span className="font-cursive text-2xl sm:text-3xl text-[#5c6149] block -mt-1">
                    A Better You ♡
                  </span>
                </div>

                {/* Floating Quick Look Tag */}
                <div
                  onClick={() => onNavigate('product', 'aura-belted-medina-kaftan')}
                  className="absolute bottom-5 left-5 right-5 p-3.5 rounded-2xl bg-white/90 backdrop-blur-md shadow-lg flex items-center justify-between cursor-pointer hover:bg-white transition-colors"
                >
                  <div>
                    <span className="text-[9px] font-semibold uppercase tracking-widest text-[#5c6149] block">
                      FEATURED LOOK
                    </span>
                    <span className="font-serif text-xs sm:text-sm font-semibold text-[#171411]">
                      Aura Belted Medina Silk Kaftan
                    </span>
                  </div>
                  <span className="text-xs sm:text-sm font-bold text-[#171411]">₹7,499</span>
                </div>
              </div>
            </div>

          </div>

          {/* Trust Badges Strip */}
          <div className="mt-12 sm:mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 bg-white rounded-2xl p-6 shadow-sm border border-[#e6e2dc]/60">
            <div className="flex items-center gap-3 p-1">
              <div className="w-11 h-11 rounded-full bg-[#f1ede7] flex items-center justify-center text-[#171411] shrink-0">
                <span className="material-symbols-outlined text-xl text-[#5c6149]">eco</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-semibold text-[#171411]">Premium Fabrics</span>
                <span className="text-[11px] text-[#7e756f]">100% Breathable & Opaque</span>
              </div>
            </div>

            <div className="flex items-center gap-3 p-1">
              <div className="w-11 h-11 rounded-full bg-[#f1ede7] flex items-center justify-center text-[#171411] shrink-0">
                <span className="material-symbols-outlined text-xl text-[#5c6149]">public</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-semibold text-[#171411]">Worldwide Shipping</span>
                <span className="text-[11px] text-[#7e756f]">Fast Express Air Courier</span>
              </div>
            </div>

            <div className="flex items-center gap-3 p-1">
              <div className="w-11 h-11 rounded-full bg-[#f1ede7] flex items-center justify-center text-[#171411] shrink-0">
                <span className="material-symbols-outlined text-xl text-[#5c6149]">verified_user</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-semibold text-[#171411]">Secure Payments</span>
                <span className="text-[11px] text-[#7e756f]">256-bit Encrypted Checkout</span>
              </div>
            </div>

            <div className="flex items-center gap-3 p-1">
              <div className="w-11 h-11 rounded-full bg-[#f1ede7] flex items-center justify-center text-[#171411] shrink-0">
                <span className="material-symbols-outlined text-xl text-[#5c6149]">favorite</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-semibold text-[#171411]">Modest by Choice</span>
                <span className="text-[11px] text-[#7e756f]">Crafted with Uncompromised Values</span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* SECTION 2: SHOP BY SILHOUETTE */}
      <section className="w-full bg-[#fdf9f3] py-16 sm:py-20">
        <div className="max-w-[1380px] mx-auto px-4 sm:px-8 lg:px-16">
          <div className="flex items-end justify-between mb-8">
            <div>
              <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#5c6149]">
                CURATED ESSENTIALS
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-[#171411] tracking-tight mt-1">
                Shop by Silhouette
              </h2>
            </div>
            <button
              onClick={() => onNavigate('collections')}
              className="hidden sm:inline-flex items-center gap-1 text-xs font-semibold text-[#5c6149] hover:text-[#171411] transition-colors cursor-pointer"
            >
              <span>View Lookbook</span>
              <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8">
            {categories.map((cat) => (
              <div
                key={cat.id}
                onClick={() => onNavigate('shop', cat.id)}
                className="group flex flex-col bg-[#f7f3ed] rounded-2xl overflow-hidden p-2.5 transition-all duration-300 hover:shadow-md hover:bg-[#f1ede7] cursor-pointer"
              >
                <div className="relative w-full aspect-[4/5] rounded-xl overflow-hidden bg-[#e6e2dc]">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="flex items-center justify-between pt-3 pb-1 px-1">
                  <div className="flex flex-col">
                    <span className="font-serif text-sm font-semibold text-[#171411] group-hover:text-[#5c6149] transition-colors">
                      {cat.name}
                    </span>
                    <span className="text-[11px] text-[#7e756f]">{cat.subtitle}</span>
                  </div>
                  <div className="w-7 h-7 rounded-full bg-white flex items-center justify-center text-[#171411] group-hover:bg-[#171411] group-hover:text-white transition-colors shadow-xs">
                    <span className="material-symbols-outlined text-xs">arrow_forward</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 3: NEW ARRIVALS */}
      <section className="w-full bg-white py-16 sm:py-20 border-y border-[#e6e2dc]/60">
        <div className="max-w-[1380px] mx-auto px-4 sm:px-8 lg:px-16">
          <div className="flex items-center justify-between mb-8">
            <div>
              <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#5c6149]">
                HAND-SELECTED STYLES
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-[#171411] tracking-tight mt-1">
                New Arrivals
              </h2>
            </div>
            <button
              onClick={() => onNavigate('shop')}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#171411] hover:text-[#5c6149] transition-colors group cursor-pointer"
            >
              <span>View All Products</span>
              <span className="material-symbols-outlined text-sm transition-transform group-hover:translate-x-1">
                arrow_forward
              </span>
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5 sm:gap-4">
            {newArrivals.map((product) => {
              const isSaved = isInWishlist(product.id);
              return (
                <div
                  key={product.id}
                  className="group flex flex-col bg-[#fdf9f3] rounded-2xl p-2.5 transition-all duration-300 hover:shadow-md border border-[#e6e2dc]/60 relative justify-between"
                >
                  <div className="relative w-full aspect-[3/4] rounded-xl overflow-hidden bg-[#f1ede7] mb-2">
                    <img
                      src={product.images.front}
                      alt={product.alt}
                      onClick={() => onNavigate('product', product.id)}
                      className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105 cursor-pointer"
                      referrerPolicy="no-referrer"
                    />
                    
                    {/* Wishlist Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleWishlist(product.id);
                      }}
                      className="absolute top-2 right-2 w-7 h-7 rounded-full bg-white/85 backdrop-blur-xs text-[#171411] hover:text-[#ba1a1a] flex items-center justify-center transition-colors shadow-xs cursor-pointer"
                      aria-label="Save to Wishlist"
                    >
                      <span className={`material-symbols-outlined text-xs ${isSaved ? 'text-[#ba1a1a]' : ''}`}>
                        favorite
                      </span>
                    </button>

                    {/* Badge */}
                    {product.badge && (
                      <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded-full bg-[#171411] text-white text-[9px] font-semibold tracking-wider uppercase">
                        {product.badge}
                      </span>
                    )}
                  </div>

                  <div className="flex flex-col flex-1 justify-between px-1">
                    <div>
                      {/* Rating */}
                      <div className="flex items-center gap-1 mb-1">
                        <div className="flex text-[#e5a842] text-[13px]">
                          {'★'.repeat(5)}
                        </div>
                        <span className="text-[10px] text-[#7e756f]">({product.reviewsCount})</span>
                      </div>

                      <h3
                        onClick={() => onNavigate('product', product.id)}
                        className="font-serif text-xs sm:text-sm font-semibold text-[#171411] hover:text-[#5c6149] transition-colors line-clamp-1 cursor-pointer"
                      >
                        {product.name}
                      </h3>
                    </div>

                    <div className="flex items-center justify-between pt-3 mt-1">
                      <span className="font-serif text-sm font-bold text-[#171411]">
                        ₹{product.price.toLocaleString('en-IN')}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          addToCart(product);
                        }}
                        aria-label="Add to bag"
                        className="w-7 h-7 rounded-lg bg-[#171411] hover:bg-[#5c6149] text-white flex items-center justify-center transition-colors shadow-xs cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-sm">shopping_bag</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* SECTION 4: DUAL PROMO BANNERS */}
      <section className="w-full bg-[#f7f3ed] py-16 sm:py-20">
        <div className="max-w-[1380px] mx-auto px-4 sm:px-8 lg:px-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Banner 1 */}
            <div className="relative bg-[#f1ede7] rounded-3xl overflow-hidden shadow-xs flex flex-col sm:flex-row items-center justify-between min-h-[300px]">
              <div className="p-8 sm:p-10 z-10 sm:max-w-[58%] flex flex-col items-start gap-2.5">
                <h3 className="font-serif text-2xl sm:text-3xl font-semibold text-[#171411] leading-tight">
                  Modest Looks<br />Brighter Days
                </h3>
                <p className="text-xs sm:text-sm text-[#4d4540] max-w-xs leading-relaxed">
                  Discover bespoke styles that seamlessly fit your faith, everyday life, and signature elegance.
                </p>
                <div className="pt-2">
                  <button
                    onClick={() => onNavigate('shop')}
                    className="inline-flex items-center gap-2 bg-[#171411] hover:bg-[#2c2825] text-white px-6 py-2.5 rounded-full text-xs font-semibold transition-all shadow-xs cursor-pointer"
                  >
                    <span>Shop Now</span>
                    <span className="material-symbols-outlined text-sm">arrow_forward</span>
                  </button>
                </div>
              </div>

              <div className="w-full sm:w-[42%] h-56 sm:h-full relative overflow-hidden">
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCJbWF7-TVKuc-AHVmyICCQCZvGe73W906eKMdgUpUEMBYx1SrtXjGTSAQvW0CMz2WNQtPYcHoS8bq1YC0Z7Xpl8qYcHIlJ4M53RaWp-RIAYcJqjXB8NulHny-uwBfaWOLJkmaLypykPQD1Uyd9OwBwh07ClZvRO7l5MKhZUFGG9AVp8HDra13fOx7XnGre_SEwiiMqAguo4NA8zqk1KPRcm3_SXq85ds8RSSzaV9wc3mdryuVEyqpr"
                  alt="Modest woman draping organic mocha hijab"
                  className="w-full h-full object-cover object-center"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>

            {/* Banner 2 */}
            <div className="relative bg-[#ebe8e2] rounded-3xl overflow-hidden shadow-xs flex flex-col sm:flex-row items-center justify-between min-h-[300px]">
              <div className="p-8 sm:p-10 z-10 sm:max-w-[60%] flex flex-col items-start gap-2">
                <span className="text-[10px] font-semibold text-[#5c6149] uppercase tracking-widest">
                  SPECIAL OFFER
                </span>
                <h3 className="font-serif text-2xl sm:text-3xl font-semibold text-[#171411] leading-tight">
                  Get 20% Off<br />
                  <span className="text-sm sm:text-base font-normal text-[#4d4540]">On Your First Order</span>
                </h3>
                
                <div className="mt-3 bg-white px-4 py-2 rounded-xl shadow-xs flex items-center gap-3 border border-[#cfc4bd]/60">
                  <span className="text-[10px] text-[#7e756f] font-semibold">USE CODE:</span>
                  <span className="font-bold text-xs tracking-wider text-[#171411]">HUSNA20</span>
                  <button
                    onClick={handleCopyCode}
                    className="material-symbols-outlined text-sm text-[#5c6149] hover:text-[#171411] transition-colors cursor-pointer"
                    title="Copy Promo Code"
                  >
                    content_copy
                  </button>
                </div>
              </div>

              <div className="w-full sm:w-[40%] h-56 sm:h-full relative overflow-hidden">
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuB6vrrd7pEXk8XvpwtakJJ4H_l1XdNu3I9QDaHL23qZ1A7eWhb7PS3pzNHuVfZA0ffwiiCRGOHBAzkKtN986um1LewIlpRTeb57n96MYQSebMkaT6_D0oxNfDbROyOIo4sMKaJE48d72iz5AkItC_hP8-4kgXQ8jt3BKoAZwcjuLzwbFEavf3k1hOQO1sSuuq5vvK_-Gsn4Qcp9ZOIFEqTcRvhkIS7Tez0FbHxmiK8Gjcx27QkhYZt4"
                  alt="Husna Collection luxury keepsake box presentation"
                  className="w-full h-full object-cover object-center"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>

          </div>

          {/* 4 Value Badges below banners */}
          <div className="mt-14 grid grid-cols-2 lg:grid-cols-4 gap-6 pt-10 border-t border-[#e6e2dc]">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-[#e6e2dc] flex items-center justify-center text-[#171411] shrink-0">
                <span className="material-symbols-outlined text-xl text-[#5c6149]">texture</span>
              </div>
              <div className="flex flex-col">
                <span className="font-serif text-xs sm:text-sm font-semibold text-[#171411]">High-Quality Fabrics</span>
                <span className="text-[11px] text-[#7e756f]">Comfort meets durability</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-[#e6e2dc] flex items-center justify-center text-[#171411] shrink-0">
                <span className="material-symbols-outlined text-xl text-[#5c6149]">history</span>
              </div>
              <div className="flex flex-col">
                <span className="font-serif text-xs sm:text-sm font-semibold text-[#171411]">Hassle-Free Returns</span>
                <span className="text-[11px] text-[#7e756f]">Shop with absolute calm</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-[#e6e2dc] flex items-center justify-center text-[#171411] shrink-0">
                <span className="material-symbols-outlined text-xl text-[#5c6149]">lock</span>
              </div>
              <div className="flex flex-col">
                <span className="font-serif text-xs sm:text-sm font-semibold text-[#171411]">Secure Checkout</span>
                <span className="text-[11px] text-[#7e756f]">Your privacy, our top priority</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-[#e6e2dc] flex items-center justify-center text-[#171411] shrink-0">
                <span className="material-symbols-outlined text-xl text-[#5c6149]">local_shipping</span>
              </div>
              <div className="flex flex-col">
                <span className="font-serif text-xs sm:text-sm font-semibold text-[#171411]">Global Shipping</span>
                <span className="text-[11px] text-[#7e756f]">Modest couture worldwide</span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* SECTION 5: OUR STORY & WHAT CUSTOMERS SAY */}
      <section className="w-full bg-[#fdf9f3] py-16 sm:py-20">
        <div className="max-w-[1380px] mx-auto px-4 sm:px-8 lg:px-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            
            {/* Left Story */}
            <div className="lg:col-span-7 flex flex-col md:flex-row items-center gap-8 sm:gap-12">
              <div className="flex-1 flex flex-col items-start gap-3">
                <div className="flex items-center gap-3 mb-1">
                  <HusnaLogo size={42} showText={false} />
                  <span className="text-[10px] font-semibold text-[#5c6149] uppercase tracking-widest">
                    OUR MISSION & HERITAGE
                  </span>
                </div>
                <h2 className="font-serif text-3xl font-semibold text-[#171411] tracking-tight">
                  Our Story
                </h2>
                <p className="text-xs sm:text-sm text-[#4d4540] leading-relaxed">
                  At Husna Collection, we believe modest fashion is far more than clothing — it is an unapologetic reflection of faith, dignity, and elevated self-expression.
                </p>
                <p className="text-xs text-[#7e756f] leading-relaxed">
                  Our atelier designs timeless silhouettes using ethical natural textiles, ensuring every modest woman feels radiant, commanding, and authentically herself in every walk of life.
                </p>
                <div className="pt-2">
                  <button
                    onClick={() => onNavigate('about-us')}
                    className="inline-flex items-center gap-2 bg-[#171411] hover:bg-[#2c2825] text-white px-6 py-2.5 rounded-full text-xs font-semibold transition-all shadow-xs cursor-pointer"
                  >
                    <span>Learn More</span>
                    <span className="material-symbols-outlined text-sm">arrow_forward</span>
                  </button>
                </div>
              </div>

              {/* Arch Architectural Frame */}
              <div className="relative shrink-0 w-full sm:w-[240px] flex flex-col items-center">
                <div className="w-[220px] h-[310px] rounded-t-[110px] rounded-b-2xl overflow-hidden shadow-lg bg-[#f1ede7]">
                  <img
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuCbFXVoarKMl8oOs7xJehmLAPThcf5glRuE6gAIn1jFyGNejiGGzFpOSwcWPlps1mxzrv0g-t4nXilUCe_NHzv4ZjmgzpnvG89Gph_zD6LC0iut9LBzuZ60hZyWOM4WZcJPnkIrGLONEyq8wI7DfhdlHcJmDKcCXnU086tZK86244usskKMILwk6f6yxesUC2yTYsswdd4CupoH-mJSbExiWCIJgNfKdDv-tBOXsg6XosZ8t5LGsXpF"
                    alt="Atelier Husna model in modest black couture"
                    className="w-full h-full object-cover object-top"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="absolute -bottom-3 right-0 bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-2xl shadow-md text-center border border-[#e6e2dc]">
                  <span className="font-cursive text-xl text-[#5c6149] block leading-none">Modest</span>
                  <span className="font-cursive text-2xl text-[#171411] block">Confident</span>
                  <span className="font-cursive text-xl text-[#5c6149] block leading-none">You ♡</span>
                </div>
              </div>
            </div>

            {/* Right Testimonial Card */}
            <div className="lg:col-span-5 flex flex-col bg-[#f7f3ed] rounded-3xl p-6 sm:p-8 shadow-xs border border-[#e6e2dc]/80 relative">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-serif text-lg font-semibold text-[#171411]">
                  What Our Customers Say
                </h3>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() =>
                      setActiveTestimonialIdx((prev) => (prev === 0 ? TESTIMONIALS.length - 1 : prev - 1))
                    }
                    className="w-8 h-8 rounded-full bg-white hover:bg-[#171411] hover:text-white text-[#171411] flex items-center justify-center transition-colors shadow-xs cursor-pointer"
                    aria-label="Previous Testimonial"
                  >
                    <span className="material-symbols-outlined text-sm">chevron_left</span>
                  </button>
                  <button
                    onClick={() =>
                      setActiveTestimonialIdx((prev) => (prev === TESTIMONIALS.length - 1 ? 0 : prev + 1))
                    }
                    className="w-8 h-8 rounded-full bg-white hover:bg-[#171411] hover:text-white text-[#171411] flex items-center justify-center transition-colors shadow-xs cursor-pointer"
                    aria-label="Next Testimonial"
                  >
                    <span className="material-symbols-outlined text-sm">chevron_right</span>
                  </button>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <div className="flex text-[#e5a842] text-sm">
                  {'★'.repeat(currentTestimonial.rating)}
                </div>

                <p className="font-serif text-sm italic text-[#171411] leading-relaxed">
                  “{currentTestimonial.quote}”
                </p>

                <div className="flex items-center gap-3 pt-2">
                  <img
                    src={currentTestimonial.avatar}
                    alt={currentTestimonial.author}
                    className="w-11 h-11 rounded-full object-cover ring-2 ring-[#cfc4bd]"
                    referrerPolicy="no-referrer"
                  />
                  <div className="flex flex-col">
                    <span className="font-serif text-xs font-semibold text-[#171411]">
                      {currentTestimonial.author}
                    </span>
                    <span className="text-[10px] text-[#5c6149] flex items-center gap-1 font-medium">
                      <span className="material-symbols-outlined text-xs">verified</span>
                      <span>{currentTestimonial.role} • {currentTestimonial.location}</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* SECTION 6: CONTACT US & ATELIER FLAGSHIP */}
      <section id="contact-us-section" className="w-full bg-[#f6f2ec] py-16 sm:py-20 border-t border-[#e6e2dc]">
        <div className="max-w-[1380px] mx-auto px-4 sm:px-8 lg:px-16">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-[11px] font-bold text-[#5c6149] uppercase tracking-widest">
              VISIT &bull; CONNECT &bull; CONSULT
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-semibold text-[#171411] tracking-tight mt-1">
              Contact Us
            </h2>
            <p className="text-xs sm:text-sm text-[#4d4540] mt-2 leading-relaxed">
              We warmly welcome you to connect with Husna Collection. Whether you want to visit our boutique in Ankleshwar, inquire about custom tailoring, or order on WhatsApp, our team is at your service.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-stretch">
            
            {/* Card 1: Flagship Store */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#e6e2dc] shadow-sm flex flex-col justify-between hover:border-[#cfc4bd] transition-all">
              <div className="flex flex-col gap-4">
                <div className="w-12 h-12 rounded-2xl bg-[#dee3c4] text-[#191d0a] flex items-center justify-center">
                  <span className="material-symbols-outlined text-2xl">storefront</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-[#5c6149] tracking-wider uppercase block mb-1">
                    Flagship Store
                  </span>
                  <h3 className="font-serif text-xl font-semibold text-[#171411]">
                    Husna Collection
                  </h3>
                </div>

                <div className="text-xs text-[#4d4540] leading-relaxed flex flex-col gap-1">
                  <span className="font-medium text-[#171411]">Shop G-14, G-15, Jasat Plaza</span>
                  <span>Opp. I.T.I., Station Road</span>
                  <span>Ankleshwar – 393001</span>
                  <span>Gujarat, India</span>
                </div>

                <div className="pt-2 text-[11px] text-[#7e756f] flex items-center gap-1.5 border-t border-[#f1ede7]">
                  <span className="material-symbols-outlined text-sm text-[#5c6149]">schedule</span>
                  <span>Mon – Sun: 10:00 AM – 9:00 PM IST</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 mt-6 pt-2">
                <button
                  onClick={handleCopyAddress}
                  className="bg-[#f7f3ed] hover:bg-[#ece6dc] text-[#171411] py-2.5 px-3 rounded-full text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer border border-[#cfc4bd]"
                >
                  <span className="material-symbols-outlined text-sm">
                    {copiedAddress ? 'check' : 'content_copy'}
                  </span>
                  <span>{copiedAddress ? 'Copied' : 'Copy'}</span>
                </button>

                <a
                  href="https://maps.google.com/?q=Jasat+Plaza+Station+Road+Ankleshwar+Gujarat+393001"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#171411] hover:bg-[#2c2825] text-white py-2.5 px-3 rounded-full text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors text-center"
                >
                  <span className="material-symbols-outlined text-sm">directions</span>
                  <span>Directions</span>
                </a>
              </div>
            </div>

            {/* Card 2: WhatsApp Concierge (Highlighted) */}
            <div className="bg-[#25d366]/10 rounded-3xl p-6 sm:p-8 border-2 border-[#25d366]/40 shadow-sm flex flex-col justify-between relative overflow-hidden">
              <div className="absolute top-4 right-4 bg-[#25d366] text-[#072412] text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                Instant Chat
              </div>

              <div className="flex flex-col gap-4">
                <div className="w-12 h-12 rounded-2xl bg-[#25d366] text-white flex items-center justify-center shadow-xs">
                  <span className="material-symbols-outlined text-2xl">chat</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-[#0f5c2a] tracking-wider uppercase block mb-1">
                    Phone & WhatsApp
                  </span>
                  <h3 className="font-serif text-xl font-semibold text-[#171411]">
                    +91 7227972655
                  </h3>
                </div>

                <p className="text-xs text-[#35302c] leading-relaxed">
                  Connect instantly with our modest fashion specialists for fabric videos, personalized abaya length recommendations, custom cuts, or direct WhatsApp ordering.
                </p>

                <div className="pt-2 text-[11px] text-[#0f5c2a] font-medium flex items-center gap-1.5 border-t border-[#25d366]/20">
                  <span className="w-2 h-2 rounded-full bg-[#25d366] animate-pulse"></span>
                  <span>Available for Chat & Calls</span>
                </div>
              </div>

              <div className="flex flex-col gap-2 mt-6 pt-2">
                <a
                  href="https://wa.me/917227972655?text=Hello%20Husna%20Collection%2C%20I%20would%20like%20to%20inquire%20about%20your%20products."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-[#25d366] hover:bg-[#20ba5a] text-[#072412] py-3 px-4 rounded-full text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-sm hover:shadow"
                >
                  <span className="material-symbols-outlined text-base">chat</span>
                  <span>Chat on WhatsApp (+91 7227972655)</span>
                </a>

                <a
                  href="tel:+917227972655"
                  className="w-full bg-white hover:bg-[#f1ede7] text-[#171411] py-2 px-3 rounded-full text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors border border-[#cfc4bd] text-center"
                >
                  <span className="material-symbols-outlined text-sm text-[#5c6149]">call</span>
                  <span>Call +91 7227972655</span>
                </a>
              </div>
            </div>

            {/* Card 3: Email & Inquiries */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#e6e2dc] shadow-sm flex flex-col justify-between hover:border-[#cfc4bd] transition-all">
              <div className="flex flex-col gap-4">
                <div className="w-12 h-12 rounded-2xl bg-[#f1ede7] text-[#171411] flex items-center justify-center">
                  <span className="material-symbols-outlined text-2xl">mail</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-[#5c6149] tracking-wider uppercase block mb-1">
                    Email Correspondence
                  </span>
                  <h3 className="font-serif text-lg font-semibold text-[#171411] break-all">
                    husnacollection55@gmail.com
                  </h3>
                </div>

                <p className="text-xs text-[#4d4540] leading-relaxed">
                  Send us your bridal couture requests, bulk or wholesale orders, parcel tracking queries, or general questions anytime.
                </p>

                <div className="pt-2 text-[11px] text-[#7e756f] flex items-center gap-1.5 border-t border-[#f1ede7]">
                  <span className="material-symbols-outlined text-sm text-[#5c6149]">done_all</span>
                  <span>Typical response within 2–4 hours</span>
                </div>
              </div>

              <div className="flex flex-col gap-2 mt-6 pt-2">
                <a
                  href="mailto:husnacollection55@gmail.com"
                  className="w-full bg-[#171411] hover:bg-[#2c2825] text-white py-3 px-4 rounded-full text-xs font-semibold flex items-center justify-center gap-2 transition-colors text-center shadow-xs"
                >
                  <span className="material-symbols-outlined text-sm">mail</span>
                  <span>Send Email</span>
                </a>

                <button
                  onClick={() => onNavigate('contact-us')}
                  className="w-full bg-[#f7f3ed] hover:bg-[#ece6dc] text-[#171411] py-2 px-3 rounded-full text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer border border-[#cfc4bd]"
                >
                  <span>Open Full Contact Page</span>
                  <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* SECTION 7: WHATSAPP STYLING CONCIERGE BANNER */}
      <section className="w-full bg-[#dee3c4] text-[#191d0a] py-8">
        <div className="max-w-[1380px] mx-auto px-4 sm:px-8 lg:px-16 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-full bg-[#5c6149] text-white flex items-center justify-center shrink-0 shadow-xs">
              <span className="material-symbols-outlined text-xl">chat</span>
            </div>
            <div>
              <span className="font-serif text-base font-semibold block text-[#191d0a]">
                Need Personal Styling or Sizing Advice?
              </span>
              <span className="text-xs text-[#60654d]">
                Chat directly with our Husna Collection consultants on WhatsApp (+91 7227972655).
              </span>
            </div>
          </div>

          <a
            href="https://wa.me/917227972655?text=Hello%20Husna%20Collection%20Concierge%2C%20I%20would%20like%20styling%20advice."
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-[#171411] hover:bg-[#2c2825] text-white px-6 py-2.5 rounded-full text-xs font-semibold transition-all shadow-xs shrink-0"
          >
            <span className="material-symbols-outlined text-base text-[#25d366]">chat</span>
            <span>WhatsApp (+91 7227972655)</span>
          </a>
        </div>
      </section>

    </div>
  );
};
