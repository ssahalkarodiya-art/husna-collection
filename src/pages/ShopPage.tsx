import React, { useState, useMemo } from 'react';
import { PRODUCTS, BRAND_INFO } from '../data/products';
import { Product } from '../types';
import { useCart } from '../context/CartContext';

interface ShopPageProps {
  initialCategory?: string;
  onNavigate: (page: string, productId?: string) => void;
}

export const ShopPage: React.FC<ShopPageProps> = ({ initialCategory = 'all', onNavigate }) => {
  const { addToCart, toggleWishlist, isInWishlist, setIsSizeGuideOpen } = useCart();

  // Filter States
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [selectedFabrics, setSelectedFabrics] = useState<string[]>([]);
  const [selectedLengths, setSelectedLengths] = useState<string[]>([]);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [maxPrice, setMaxPrice] = useState<number>(250);
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'rating'>('featured');
  const [page, setPage] = useState<number>(1);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState<boolean>(false);

  // Category counts and definitions
  const categoryPills = [
    { id: 'all', label: 'All', count: 138 },
    { id: 'abayas', label: 'Abayas', count: 42 },
    { id: 'hijabs', label: 'Hijabs', count: 38 },
    { id: 'dresses', label: 'Dresses', count: 24 },
    { id: 'coord-sets', label: 'Co-ord Sets', count: 19 },
    { id: 'outerwear', label: 'Outerwear', count: 15 },
    { id: 'kimonos', label: 'Kimonos', count: 12 },
    { id: 'new-arrivals', label: '★ New Arrivals', count: 28 },
  ];

  const fabricOptions = [
    'Premium Chiffon',
    'Organic Washed Linen',
    'Silk Crepe de Chine',
    'Korean Nidha Crepe',
    'Japanese Matte Satin',
  ];

  const lengthOptions = ['50', '52', '54', '56', '58', '60'];

  const colorPalette = [
    { name: 'Deep Onyx', hex: '#171411' },
    { name: 'Warm Taupe', hex: '#A29488' },
    { name: 'Olive Sage', hex: '#757C60' },
    { name: 'Desert Sand', hex: '#E5D7C5' },
    { name: 'Terracotta', hex: '#B88673' },
  ];

  const toggleFabric = (fabric: string) => {
    setSelectedFabrics((prev) =>
      prev.includes(fabric) ? prev.filter((f) => f !== fabric) : [...prev, fabric]
    );
  };

  const toggleLength = (len: string) => {
    setSelectedLengths((prev) =>
      prev.includes(len) ? prev.filter((l) => l !== len) : [...prev, len]
    );
  };

  const resetAllFilters = () => {
    setSelectedCategory('all');
    setSelectedFabrics([]);
    setSelectedLengths([]);
    setSelectedColor(null);
    setMaxPrice(250);
    setSortBy('featured');
  };

  // Filtered & Sorted Products
  const filteredProducts = useMemo(() => {
    let list = [...PRODUCTS];

    if (selectedCategory === 'new-arrivals') {
      list = list.filter((p) => p.isNewArrival);
    } else if (selectedCategory !== 'all') {
      list = list.filter((p) => p.category === selectedCategory);
    }

    if (selectedFabrics.length > 0) {
      list = list.filter((p) => selectedFabrics.includes(p.fabric));
    }

    if (selectedLengths.length > 0) {
      list = list.filter((p) =>
        p.sizes.some((s) => selectedLengths.includes(s.length))
      );
    }

    if (selectedColor) {
      list = list.filter((p) =>
        p.colors.some((c) => c.name.toLowerCase().includes(selectedColor.toLowerCase()))
      );
    }

    list = list.filter((p) => p.price <= maxPrice);

    if (sortBy === 'price-asc') {
      list.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
      list.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'rating') {
      list.sort((a, b) => b.rating - a.rating);
    }

    return list;
  }, [selectedCategory, selectedFabrics, selectedLengths, selectedColor, maxPrice, sortBy]);

  const handleWhatsAppProductOrder = (product: Product) => {
    const text = encodeURIComponent(
      `Hello Husna Collection Concierge, I would like to order the ${product.name} ($${product.price.toFixed(
        2
      )}). Please confirm size and fabric details.`
    );
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  return (
    <div className="w-full bg-[#fdf9f3] min-h-screen">
      
      {/* Breadcrumbs */}
      <div className="max-w-[1380px] mx-auto px-4 sm:px-8 lg:px-16 pt-5 pb-2">
        <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-[11px] font-semibold text-[#7e756f] uppercase tracking-wider">
          <button onClick={() => onNavigate('home')} className="hover:text-[#171411] transition-colors cursor-pointer">
            Home
          </button>
          <span>/</span>
          <span className="text-[#171411]">Shop</span>
          <span>/</span>
          <span className="text-[#5c6149]">All Collections</span>
        </nav>
      </div>

      {/* Catalog Hero Title & Description */}
      <section className="max-w-[1380px] mx-auto px-4 sm:px-8 lg:px-16 py-4">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#e6e2dc] pb-6">
          <div>
            <span className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#5c6149] block mb-1">
              MODESTY IN EVERY MOMENT • HUSNA COLLECTION
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl font-semibold text-[#171411] tracking-tight">
              Shop All Modest Creations
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-[#4d4540] max-w-md leading-relaxed md:text-right">
            Elegantly draped, thoughtfully proportioned pieces handcrafted in our signature breathable natural fabrics and earthy neutral tones.
          </p>
        </div>

        {/* Quick Category Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto py-4 scrollbar-none">
          {categoryPills.map((pill) => {
            const isActive = selectedCategory === pill.id;
            return (
              <button
                key={pill.id}
                onClick={() => setSelectedCategory(pill.id)}
                className={`whitespace-nowrap px-4 py-2 rounded-full text-xs transition-all cursor-pointer font-medium ${
                  isActive
                    ? 'bg-[#171411] text-white shadow-xs'
                    : 'bg-[#f1ede7] text-[#4d4540] hover:bg-[#e6e2dc]'
                }`}
              >
                {pill.label} <span className="opacity-60 text-[10px]">({pill.count})</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Main Grid & Sidebar Layout */}
      <section className="max-w-[1380px] mx-auto px-4 sm:px-8 lg:px-16 pb-20">
        
        {/* Mobile Filter Toggle */}
        <div className="lg:hidden flex items-center justify-between pb-4">
          <button
            onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
            className="flex items-center gap-2 bg-white border border-[#e6e2dc] px-4 py-2 rounded-full text-xs font-semibold text-[#171411]"
          >
            <span className="material-symbols-outlined text-sm">tune</span>
            <span>Filter Refinements</span>
          </button>
          <span className="text-xs text-[#7e756f]">
            {filteredProducts.length} Creations found
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Sidebar Filter (3 cols on large) */}
          <aside className={`lg:col-span-3 ${isMobileFilterOpen ? 'block' : 'hidden lg:block'} bg-white p-6 rounded-2xl border border-[#e6e2dc] shadow-xs flex flex-col gap-6`}>
            
            {/* Filter Header */}
            <div className="flex items-center justify-between pb-3 border-b border-[#e6e2dc]">
              <span className="font-serif text-sm font-semibold text-[#171411]">
                Filter Refinement
              </span>
              <button
                onClick={resetAllFilters}
                className="text-[11px] font-semibold text-[#5c6149] hover:text-[#171411] underline cursor-pointer"
              >
                Reset All
              </button>
            </div>

            {/* Garment Category */}
            <div className="flex flex-col gap-2.5">
              <span className="text-xs font-semibold text-[#171411] uppercase tracking-wider">
                Garment Category
              </span>
              <div className="flex flex-col gap-2 text-xs text-[#4d4540]">
                {[
                  { id: 'abayas', label: 'Abayas', count: 42 },
                  { id: 'hijabs', label: 'Hijabs & Shawls', count: 38 },
                  { id: 'dresses', label: 'Maxi Dresses', count: 24 },
                  { id: 'coord-sets', label: 'Co-ords & Sets', count: 19 },
                  { id: 'outerwear', label: 'Outerwear & Capes', count: 15 },
                ].map((item) => (
                  <label key={item.id} className="flex items-center justify-between cursor-pointer hover:text-[#171411]">
                    <div className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="cat-radio"
                        checked={selectedCategory === item.id}
                        onChange={() => setSelectedCategory(item.id)}
                        className="accent-[#5c6149]"
                      />
                      <span>{item.label}</span>
                    </div>
                    <span className="text-[#7e756f] text-[11px]">{item.count}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Fabric Type */}
            <div className="flex flex-col gap-2.5 pt-4 border-t border-[#e6e2dc]">
              <span className="text-xs font-semibold text-[#171411] uppercase tracking-wider">
                Fabric Type
              </span>
              <div className="flex flex-col gap-2 text-xs text-[#4d4540]">
                {fabricOptions.map((fabric) => (
                  <label key={fabric} className="flex items-center gap-2 cursor-pointer hover:text-[#171411]">
                    <input
                      type="checkbox"
                      checked={selectedFabrics.includes(fabric)}
                      onChange={() => toggleFabric(fabric)}
                      className="rounded accent-[#5c6149]"
                    />
                    <span>{fabric}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Abaya Length / Size */}
            <div className="flex flex-col gap-2.5 pt-4 border-t border-[#e6e2dc]">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-[#171411] uppercase tracking-wider">
                  Abaya Length / Size
                </span>
                <button
                  onClick={() => setIsSizeGuideOpen(true)}
                  className="text-[10px] text-[#5c6149] underline hover:text-[#171411] cursor-pointer"
                >
                  Size Guide
                </button>
              </div>
              <div className="grid grid-cols-4 gap-1.5">
                {lengthOptions.map((len) => {
                  const isSel = selectedLengths.includes(len);
                  return (
                    <button
                      key={len}
                      onClick={() => toggleLength(len)}
                      className={`py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                        isSel
                          ? 'bg-[#171411] text-white shadow-xs'
                          : 'bg-[#f1ede7] text-[#171411] hover:bg-[#e6e2dc]'
                      }`}
                    >
                      {len}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Earth Color Palette */}
            <div className="flex flex-col gap-2.5 pt-4 border-t border-[#e6e2dc]">
              <span className="text-xs font-semibold text-[#171411] uppercase tracking-wider">
                Earth Color Palette
              </span>
              <div className="flex items-center gap-2.5">
                {colorPalette.map((col) => {
                  const isSel = selectedColor === col.name;
                  return (
                    <button
                      key={col.name}
                      onClick={() => setSelectedColor(isSel ? null : col.name)}
                      className={`w-7 h-7 rounded-full shadow-inner transition-transform cursor-pointer ${
                        isSel ? 'ring-2 ring-[#171411] scale-110' : 'hover:scale-105'
                      }`}
                      style={{ backgroundColor: col.hex }}
                      title={col.name}
                    />
                  );
                })}
              </div>
            </div>

            {/* Price Range */}
            <div className="flex flex-col gap-2.5 pt-4 border-t border-[#e6e2dc]">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-[#171411] uppercase tracking-wider">
                  Price Ceiling
                </span>
                <span className="font-bold text-[#5c6149]">${maxPrice}</span>
              </div>
              <input
                type="range"
                min={20}
                max={250}
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-[#5c6149] cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-[#7e756f]">
                <span>$20</span>
                <span>$250</span>
              </div>
            </div>

            {/* Express Atelier Service Box */}
            <div className="p-3.5 bg-[#f7f3ed] rounded-xl border border-[#e6e2dc] text-xs text-[#7e756f]">
              <div className="flex items-center gap-1.5 font-semibold text-[#171411] mb-1">
                <span className="material-symbols-outlined text-sm text-[#5c6149]">verified</span>
                <span>Express Atelier Services</span>
              </div>
              <p className="text-[11px] leading-relaxed">
                All abayas include matching complimentary soft chiffon hijabs and discreet fabric belts.
              </p>
            </div>

          </aside>

          {/* Right Product Grid (9 cols on large) */}
          <main className="lg:col-span-9 flex flex-col gap-6">
            
            {/* Top Bar Sort & Count */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-[#e6e2dc]">
              <span className="text-xs text-[#7e756f]">
                Showing <strong className="text-[#171411]">{filteredProducts.length}</strong> of 86 Creations
              </span>

              <div className="flex items-center gap-2 text-xs">
                <span className="text-[#7e756f]">Sort By:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="bg-[#f1ede7] text-[#171411] font-medium py-1.5 px-3 rounded-lg focus:outline-none border-none cursor-pointer"
                >
                  <option value="featured">Featured Highlights</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="rating">Best Rated</option>
                </select>
              </div>
            </div>

            {/* Product Cards Grid (3 Columns) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => {
                const isSaved = isInWishlist(product.id);
                return (
                  <div
                    key={product.id}
                    className="group bg-white rounded-2xl overflow-hidden border border-[#e6e2dc] shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
                  >
                    <div>
                      {/* Image Frame */}
                      <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#f1ede7]">
                        <img
                          src={product.images.front}
                          alt={product.alt}
                          onClick={() => onNavigate('product', product.id)}
                          className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105 cursor-pointer"
                          referrerPolicy="no-referrer"
                        />
                        
                        {/* Wishlist */}
                        <button
                          onClick={() => toggleWishlist(product.id)}
                          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/85 backdrop-blur-xs text-[#171411] hover:text-[#ba1a1a] flex items-center justify-center transition-colors shadow-xs cursor-pointer z-10"
                        >
                          <span className={`material-symbols-outlined text-sm ${isSaved ? 'text-[#ba1a1a]' : ''}`}>
                            favorite
                          </span>
                        </button>

                        {/* Badge */}
                        {product.badge && (
                          <span className="absolute top-3 left-3 bg-[#171411]/85 backdrop-blur-xs text-white text-[9px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full">
                            {product.badge}
                          </span>
                        )}
                      </div>

                      {/* Info */}
                      <div className="p-4 flex flex-col gap-1.5">
                        <div className="flex items-center gap-1">
                          <div className="flex text-[#e5a842] text-xs">
                            {'★'.repeat(5)}
                          </div>
                          <span className="text-[10px] text-[#7e756f]">({product.reviewsCount})</span>
                        </div>

                        <h3
                          onClick={() => onNavigate('product', product.id)}
                          className="font-serif text-sm font-semibold text-[#171411] hover:text-[#5c6149] transition-colors cursor-pointer"
                        >
                          {product.name}
                        </h3>

                        <p className="text-[11px] text-[#7e756f]">{product.subtitle}</p>

                        <div className="flex items-center justify-between pt-1">
                          <span className="font-serif text-base font-bold text-[#171411]">
                            ${product.price.toFixed(2)}
                          </span>

                          {/* Color Swatches */}
                          <div className="flex items-center gap-1">
                            {product.colors.slice(0, 3).map((c) => (
                              <span
                                key={c.name}
                                className="w-3 h-3 rounded-full border border-white shadow-xs inline-block"
                                style={{ backgroundColor: c.hex }}
                                title={c.name}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Dual Action Buttons: Add to Bag + WhatsApp */}
                    <div className="p-4 pt-0 grid grid-cols-2 gap-2">
                      <button
                        onClick={() => addToCart(product)}
                        className="bg-[#171411] hover:bg-[#2c2825] text-white py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1 transition-colors shadow-xs cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-sm">shopping_bag</span>
                        <span>Add to Bag</span>
                      </button>

                      <button
                        onClick={() => handleWhatsAppProductOrder(product)}
                        className="bg-[#f1ede7] hover:bg-[#dee3c4] text-[#171411] py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1 transition-colors cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-sm text-[#5c6149]">chat</span>
                        <span>WhatsApp</span>
                      </button>
                    </div>

                  </div>
                );
              })}
            </div>

            {/* Pagination Controls */}
            <div className="flex flex-col items-center gap-4 py-8">
              <button
                onClick={() => setPage((p) => p + 1)}
                className="bg-[#f1ede7] hover:bg-[#e6e2dc] text-[#171411] text-xs font-semibold px-6 py-3 rounded-full transition-colors cursor-pointer flex items-center gap-1"
              >
                <span>Load More Creations (62 Remaining)</span>
                <span className="material-symbols-outlined text-sm">expand_more</span>
              </button>

              <div className="flex items-center gap-1.5 text-xs font-semibold">
                <button
                  disabled={page === 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  className="w-8 h-8 rounded-full bg-white border border-[#e6e2dc] flex items-center justify-center disabled:opacity-40 cursor-pointer"
                >
                  ←
                </button>
                <button className="w-8 h-8 rounded-full bg-[#171411] text-white flex items-center justify-center">
                  1
                </button>
                <button className="w-8 h-8 rounded-full bg-white border border-[#e6e2dc] flex items-center justify-center hover:bg-[#f1ede7] transition-colors cursor-pointer">
                  2
                </button>
                <button className="w-8 h-8 rounded-full bg-white border border-[#e6e2dc] flex items-center justify-center hover:bg-[#f1ede7] transition-colors cursor-pointer">
                  3
                </button>
                <button className="w-8 h-8 rounded-full bg-white border border-[#e6e2dc] flex items-center justify-center hover:bg-[#f1ede7] transition-colors cursor-pointer">
                  4
                </button>
                <button
                  onClick={() => setPage((p) => p + 1)}
                  className="w-8 h-8 rounded-full bg-white border border-[#e6e2dc] flex items-center justify-center hover:bg-[#f1ede7] transition-colors cursor-pointer"
                >
                  →
                </button>
              </div>
            </div>

          </main>

        </div>
      </section>

      {/* Bottom Atelier Styling Concierge Card */}
      <section className="max-w-[1380px] mx-auto px-4 sm:px-8 lg:px-16 pb-16">
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#e6e2dc] shadow-sm grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          <div className="md:col-span-7 flex flex-col items-start gap-3">
            <span className="text-[10px] font-semibold text-[#5c6149] uppercase tracking-widest flex items-center gap-1.5">
              <span className="material-symbols-outlined text-sm">content_cut</span>
              <span>Atelier Concierge & Bespoke Tailoring</span>
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-[#171411] tracking-tight">
              Need Custom Sizing or WhatsApp Styling Assistance?
            </h2>
            <p className="text-xs sm:text-sm text-[#4d4540] leading-relaxed max-w-lg">
              Whether you require custom sleeve adjustments, length tailoring, or bridal abaya consultations, speak directly with our certified stylist team based in Dubai.
            </p>
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <a
                href="https://wa.me/?text=Hello%20Husna%20Collection%2C%20I%20would%20like%20custom%20styling%20assistance."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-[#5c6149] hover:bg-[#171411] text-white px-6 py-2.5 rounded-full text-xs font-semibold transition-all shadow-xs"
              >
                <span className="material-symbols-outlined text-sm">chat</span>
                <span>Chat on WhatsApp</span>
              </a>
              <span className="text-xs text-[#7e756f] flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#5c6149]"></span>
                <span>Average response time: 5 minutes</span>
              </span>
            </div>
          </div>

          <div className="md:col-span-5 relative rounded-2xl overflow-hidden bg-[#f1ede7] shadow-sm">
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuC3v8683-Fe02TNKiEDbYGnldpnKcRPCJK5rPR-nUOmllW2_0UjiNHUbMjXI_dfpzUeFdsqg34JHdFEE8EDGfrPtjmYnsUGFSdM0DQGVMrwVDvX8UHk6q6w6UD5SRFmFzLu9ygJXvFB7X1Eol_j1YKgjmF3tdbyatXArytpsHeGPtnfDNDym6fGfsSDa4Th9huvEaWUL1nULTzI8gMlx7g1x5895w50C11_7FcgY4Y9UI3SEQHN_fFH"
              alt="Atelier tailoring process"
              className="w-full h-56 object-cover object-center"
              referrerPolicy="no-referrer"
            />
            <div className="absolute bottom-3 left-3 right-3 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-lg text-center text-[11px] font-serif text-[#171411]">
              Handmade with love ♥ for every modest woman
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};
