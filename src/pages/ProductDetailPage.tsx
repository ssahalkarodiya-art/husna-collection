import React, { useState, useEffect } from 'react';
import { PRODUCTS, REVIEWS_LIST } from '../data/products';
import { Product, Review } from '../types';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { reviewsService } from '../services/reviewsService';

interface ProductDetailPageProps {
  productId: string;
  onNavigate: (page: string, productId?: string) => void;
}

export const ProductDetailPage: React.FC<ProductDetailPageProps> = ({ productId, onNavigate }) => {
  const { addToCart, toggleWishlist, isInWishlist, setIsSizeGuideOpen, setIsCheckoutModalOpen } = useCart();
  const { user, profile } = useAuth();

  // Find product or fallback to first product
  const product: Product = PRODUCTS.find((p) => p.id === productId) || PRODUCTS[0];

  // Gallery state
  const galleryImages = [
    { label: 'Front', src: product.images.front },
    ...(product.images.texture ? [{ label: 'Texture', src: product.images.texture }] : []),
    ...(product.images.sleeve ? [{ label: 'Sleeve', src: product.images.sleeve }] : []),
    ...(product.images.motion ? [{ label: 'Motion', src: product.images.motion }] : []),
  ];

  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [selectedColor, setSelectedColor] = useState(product.colors[0]?.name || 'Standard');
  const [selectedSize, setSelectedSize] = useState(product.sizes[2]?.length || product.sizes[0]?.length || '56');
  const [quantity, setQuantity] = useState(1);

  // Accordion states
  const [openAccordion, setOpenAccordion] = useState<string | null>('details');

  const toggleAccordion = (id: string) => {
    setOpenAccordion((prev) => (prev === id ? null : id));
  };

  const isSaved = isInWishlist(product.id);

  // Live Reviews State
  const [reviews, setReviews] = useState<Review[]>(REVIEWS_LIST[product.id] || []);
  const [loadingReviews, setLoadingReviews] = useState(true);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewContent, setReviewContent] = useState('');
  const [reviewAuthor, setReviewAuthor] = useState(profile?.fullName || 'Ayesha Khan');
  const [reviewLocation, setReviewLocation] = useState(profile?.shippingAddress?.city || 'London, UK');

  useEffect(() => {
    let mounted = true;
    setLoadingReviews(true);
    reviewsService.getByProductId(product.id).then((fetched) => {
      if (mounted) {
        setReviews(fetched);
        setLoadingReviews(false);
      }
    });

    return () => {
      mounted = false;
    };
  }, [product.id]);

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewContent.trim()) return;

    setSubmittingReview(true);
    try {
      const res = await reviewsService.addReview({
        productId: product.id,
        userId: user?.id,
        author: reviewAuthor || 'Atelier Patron',
        location: reviewLocation || 'London, UK',
        rating: reviewRating,
        content: reviewContent,
      });

      if (res.review) {
        setReviews((prev) => [res.review!, ...prev]);
        setReviewContent('');
        setShowReviewForm(false);
      }
    } finally {
      setSubmittingReview(false);
    }
  };

  // WhatsApp personalized link
  const getPersonalizedWhatsAppLink = () => {
    const text = encodeURIComponent(
      `Hello Husna Collection Stylist, I would like to order the ${product.name} in ${selectedColor}, Length ${selectedSize}, Quantity ${quantity} (₹${(
        product.price * quantity
      ).toLocaleString('en-IN')}). Please advise on dispatch.`
    );
    return `https://wa.me/917227972655?text=${text}`;
  };

  const handleBuyNow = () => {
    addToCart(product, selectedColor, selectedSize, quantity);
    setIsCheckoutModalOpen(true);
  };

  // Complete your look recommendations
  const relatedProducts = PRODUCTS.filter((p) => p.id !== product.id).slice(0, 4);

  return (
    <div className="w-full bg-[#fdf9f3] min-h-screen">
      
      {/* Breadcrumb Navigation */}
      <div className="max-w-[1380px] mx-auto px-4 sm:px-8 lg:px-16 pt-5 pb-3">
        <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-[11px] font-semibold text-[#7e756f] uppercase tracking-wider">
          <button onClick={() => onNavigate('home')} className="hover:text-[#171411] transition-colors cursor-pointer">
            Home
          </button>
          <span>/</span>
          <button onClick={() => onNavigate('shop')} className="hover:text-[#171411] transition-colors cursor-pointer">
            Shop
          </button>
          <span>/</span>
          <button onClick={() => onNavigate('shop', product.category)} className="hover:text-[#171411] transition-colors cursor-pointer">
            {product.categoryLabel}
          </button>
          <span>/</span>
          <span className="text-[#171411] truncate max-w-xs">{product.name}</span>
        </nav>
      </div>

      {/* Main PDP Section */}
      <section className="max-w-[1380px] mx-auto px-4 sm:px-8 lg:px-16 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          
          {/* Left Column: Gallery (7 cols on large) */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            
            {/* Main Stage Image */}
            <div className="relative w-full rounded-2xl overflow-hidden bg-[#f1ede7] shadow-sm group">
              <div className="absolute top-4 left-4 z-10 flex flex-col gap-1.5">
                <span className="bg-[#5c6149] text-white text-[10px] font-semibold tracking-widest uppercase px-3 py-1 rounded-full shadow-xs">
                  {product.badge || 'Bestseller'}
                </span>
                <span className="bg-white/90 backdrop-blur-xs text-[#171411] text-[9px] font-semibold tracking-wider px-2.5 py-0.5 rounded-full shadow-xs flex items-center gap-1">
                  <span className="material-symbols-outlined text-[13px] text-[#5c6149]">verified</span>
                  <span>Couture Atelier</span>
                </span>
              </div>

              {/* Wishlist Button */}
              <button
                onClick={() => toggleWishlist(product.id)}
                className="absolute top-4 right-4 z-10 w-11 h-11 rounded-full bg-white/85 backdrop-blur-xs text-[#171411] hover:text-[#ba1a1a] flex items-center justify-center transition-colors shadow-xs cursor-pointer"
                aria-label="Save to Wishlist"
              >
                <span className={`material-symbols-outlined text-[20px] ${isSaved ? 'text-[#ba1a1a]' : ''}`}>
                  favorite
                </span>
              </button>

              <div className="aspect-[3/4] w-full overflow-hidden bg-[#e6e2dc]">
                <img
                  src={galleryImages[activeImageIdx]?.src || product.images.front}
                  alt={product.alt}
                  className="w-full h-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
              </div>

              {/* Bottom Image Overlay Bar */}
              <div className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur-md rounded-xl p-3 shadow-sm flex items-center justify-between text-[#171411]">
                <div className="flex items-center gap-2 text-xs font-medium">
                  <span className="material-symbols-outlined text-[#5c6149] text-[18px]">spa</span>
                  <span>100% Breathable Organic Fabric • Hand-Finished</span>
                </div>
                <span className="font-cursive text-xl text-[#5c6149]">Husna Atelier</span>
              </div>
            </div>

            {/* Gallery Thumbnails */}
            {galleryImages.length > 1 && (
              <div className="grid grid-cols-4 gap-3">
                {galleryImages.map((img, idx) => (
                  <button
                    key={img.label}
                    onClick={() => setActiveImageIdx(idx)}
                    className={`relative aspect-[3/4] rounded-xl overflow-hidden bg-[#f1ede7] shadow-xs p-0.5 transition-all outline-none cursor-pointer ${
                      activeImageIdx === idx ? 'ring-2 ring-[#5c6149] opacity-100' : 'opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={img.src}
                      alt={`${product.name} ${img.label}`}
                      className="w-full h-full object-cover object-top rounded-lg"
                      referrerPolicy="no-referrer"
                    />
                    <span className="absolute bottom-1 right-1 bg-[#171411]/70 text-white text-[9px] font-semibold px-1.5 py-0.5 rounded backdrop-blur-xs">
                      {img.label}
                    </span>
                  </button>
                ))}
              </div>
            )}

          </div>

          {/* Right Column: Purchasing & Specifications (5 cols on large) */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            
            {/* Header info */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold tracking-[0.2em] text-[#5c6149] uppercase">
                  HUSNA SIGNATURE • TIMELESS ELEGANCE
                </span>
                <span className="text-xs text-[#5c6149] font-medium flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#5c6149] inline-block animate-pulse"></span>
                  <span>In Stock</span>
                </span>
              </div>

              <h1 className="font-serif text-2xl sm:text-3xl lg:text-[34px] lg:leading-[42px] font-semibold text-[#171411] tracking-tight">
                {product.name}
              </h1>

              {/* Reviews score */}
              <div className="flex items-center gap-2 pt-1">
                <div className="flex text-[#e5a842] text-sm">
                  {'★'.repeat(5)}
                </div>
                <span className="text-xs font-bold text-[#171411]">{product.rating.toFixed(1)}</span>
                <span className="text-xs text-[#7e756f]">({product.reviewsCount} verified customer reviews)</span>
              </div>
            </div>

            {/* Pricing Box */}
            <div className="bg-[#f7f3ed] rounded-2xl p-4 sm:p-5 shadow-xs border border-[#e6e2dc] flex flex-col gap-2">
              <div className="flex items-baseline gap-3">
                <span className="font-serif text-2xl sm:text-3xl font-bold text-[#171411]">
                  ₹{product.price.toLocaleString('en-IN')}
                </span>
                {product.originalPrice && (
                  <span className="text-sm text-[#7e756f] line-through">
                    ₹{product.originalPrice.toLocaleString('en-IN')}
                  </span>
                )}
                {product.originalPrice && (
                  <span className="bg-[#dee3c4] text-[#191d0a] text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                    Save {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1.5 text-xs text-[#7e756f] flex-wrap">
                <span>or 4 interest-free payments of</span>
                <span className="font-semibold text-[#171411]">
                  ₹{Math.round(product.price / 4).toLocaleString('en-IN')}
                </span>
                <span>with</span>
                <span className="font-bold px-1.5 py-0.5 rounded bg-white text-[#171411] border border-[#cfc4bd]/60 text-[10px]">
                  Klarna
                </span>
                <span className="font-bold px-1.5 py-0.5 rounded bg-white text-[#171411] border border-[#cfc4bd]/60 text-[10px]">
                  Afterpay
                </span>
              </div>
            </div>

            {/* Color Selector */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <label className="text-xs text-[#171411]">
                  Color: <strong className="text-[#5c6149]">{selectedColor}</strong>
                </label>
                <span className="text-[11px] text-[#7e756f]">Selected Atelier Shade</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {product.colors.map((c) => {
                  const isSel = selectedColor === c.name;
                  return (
                    <button
                      key={c.name}
                      onClick={() => setSelectedColor(c.name)}
                      className={`flex items-center gap-2 p-2 rounded-xl border transition-all text-left cursor-pointer ${
                        isSel ? 'border-[#171411] bg-white ring-2 ring-[#171411]/20' : 'border-[#e6e2dc] bg-[#f7f3ed]'
                      }`}
                    >
                      <span
                        className="w-5 h-5 rounded-full shadow-inner shrink-0 border border-white"
                        style={{ backgroundColor: c.hex }}
                      />
                      <span className="text-[11px] font-semibold text-[#171411] truncate">{c.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Abaya Length / Size Selector */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <label className="text-xs text-[#171411]">
                  Abaya Length: <strong className="text-[#5c6149]">{selectedSize}</strong>
                </label>
                <button
                  onClick={() => setIsSizeGuideOpen(true)}
                  className="text-xs text-[#5c6149] underline flex items-center gap-1 cursor-pointer font-medium"
                >
                  <span className="material-symbols-outlined text-[15px]">straighten</span>
                  <span>Size & Fit Guide</span>
                </button>
              </div>

              <div className="grid grid-cols-5 gap-2">
                {product.sizes.map((s) => {
                  const isSel = selectedSize === s.length;
                  return (
                    <button
                      key={s.length}
                      onClick={() => setSelectedSize(s.length)}
                      className={`flex flex-col items-center justify-center py-2.5 px-1 rounded-xl transition-all cursor-pointer ${
                        isSel
                          ? 'bg-[#171411] text-white shadow-xs font-bold'
                          : 'bg-[#f7f3ed] hover:bg-[#f1ede7] text-[#171411] border border-[#e6e2dc]'
                      }`}
                    >
                      <span className="text-xs font-bold">{s.length}</span>
                      <span className={`text-[9px] ${isSel ? 'text-[#c4c9ac]' : 'text-[#7e756f]'}`}>
                        {s.heightRec}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quantity Stepper & Add to Bag */}
            <div className="flex flex-col gap-3 pt-2">
              <div className="flex items-center gap-3">
                {/* Stepper */}
                <div className="flex items-center justify-between bg-[#f1ede7] rounded-full px-3 py-2 w-28 shadow-inner">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="w-6 h-6 rounded-full bg-white text-[#171411] flex items-center justify-center hover:bg-[#e6e2dc] transition-colors cursor-pointer text-xs font-bold"
                  >
                    −
                  </button>
                  <span className="font-serif text-sm font-semibold text-[#171411]">{quantity}</span>
                  <button
                    onClick={() => setQuantity((q) => q + 1)}
                    className="w-6 h-6 rounded-full bg-white text-[#171411] flex items-center justify-center hover:bg-[#e6e2dc] transition-colors cursor-pointer text-xs font-bold"
                  >
                    +
                  </button>
                </div>

                {/* Primary Add to Bag */}
                <button
                  onClick={() => addToCart(product, selectedColor, selectedSize, quantity)}
                  className="flex-1 bg-[#5c6149] hover:bg-[#171411] text-white py-3.5 px-6 rounded-full text-xs font-semibold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer group"
                >
                  <span className="material-symbols-outlined text-[18px] transition-transform group-hover:scale-110">
                    local_mall
                  </span>
                  <span>Add to Bag — ₹{(product.price * quantity).toLocaleString('en-IN')}</span>
                  <span className="material-symbols-outlined text-sm transition-transform group-hover:translate-x-1">
                    arrow_forward
                  </span>
                </button>
              </div>

              {/* 1-Click Buy Now */}
              <button
                onClick={handleBuyNow}
                className="w-full bg-[#171411] hover:bg-[#2c2825] text-white py-3.5 px-6 rounded-full text-xs font-semibold shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">bolt</span>
                <span>Buy Now with 1-Click</span>
              </button>
            </div>

            {/* Dedicated WhatsApp Personal Stylist Ordering Card */}
            <div className="bg-[#f7f3ed] rounded-2xl p-4 sm:p-5 border border-[#e6e2dc] shadow-xs flex flex-col gap-2">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-[#25d366] text-white flex items-center justify-center shrink-0 shadow-xs">
                  <span className="material-symbols-outlined text-xl">chat</span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-serif text-sm font-semibold text-[#171411]">
                      Prefer Ordering on WhatsApp?
                    </span>
                    <span className="bg-[#dee3c4] text-[#191d0a] text-[9px] font-bold px-2 py-0.5 rounded-full uppercase">
                      VIP Stylist
                    </span>
                  </div>
                  <p className="text-xs text-[#4d4540] mt-1 leading-snug">
                    Chat directly with our Dubai & London personal stylists. We will instantly pre-fill your selection: <strong className="text-[#171411]">{selectedColor}, Length {selectedSize}</strong>.
                  </p>
                </div>
              </div>

              <a
                href={getPersonalizedWhatsAppLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 w-full bg-white hover:bg-[#dee3c4] text-[#171411] border border-[#cfc4bd] py-2.5 px-4 rounded-full text-xs font-semibold flex items-center justify-center gap-2 transition-colors shadow-xs"
              >
                <span className="material-symbols-outlined text-[#25d366] text-[18px]">send</span>
                <span>Order via WhatsApp →</span>
              </a>
            </div>

            {/* Reassurance Badges */}
            <div className="grid grid-cols-3 gap-3 py-2 border-t border-[#e6e2dc]">
              <div className="flex flex-col items-center text-center p-3 rounded-xl bg-[#f7f3ed]">
                <span className="material-symbols-outlined text-[#5c6149] text-xl">local_shipping</span>
                <span className="text-xs font-semibold text-[#171411] mt-1">Free Shipping</span>
                <span className="text-[10px] text-[#7e756f]">On orders over ₹4,999</span>
              </div>
              <div className="flex flex-col items-center text-center p-3 rounded-xl bg-[#f7f3ed]">
                <span className="material-symbols-outlined text-[#5c6149] text-xl">published_with_changes</span>
                <span className="text-xs font-semibold text-[#171411] mt-1">14-Day Returns</span>
                <span className="text-[10px] text-[#7e756f]">Hassle-free guarantee</span>
              </div>
              <div className="flex flex-col items-center text-center p-3 rounded-xl bg-[#f7f3ed]">
                <span className="material-symbols-outlined text-[#5c6149] text-xl">lock</span>
                <span className="text-xs font-semibold text-[#171411] mt-1">Secure Checkout</span>
                <span className="text-[10px] text-[#7e756f]">256-bit encrypted</span>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* Accordion: Specifications, Silhouette, Care & Reviews */}
      <section className="w-full bg-[#f7f3ed] py-16 sm:py-20 border-t border-[#e6e2dc]">
        <div className="max-w-[1100px] mx-auto px-4 sm:px-8">
          
          <div className="text-center mb-10 flex flex-col items-center">
            <span className="text-[11px] font-bold text-[#5c6149] uppercase tracking-widest">
              ATELIER CRAFTSMANSHIP
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-[#171411] mt-1">
              Garment Specifications & Care
            </h2>
            <div className="w-12 h-0.5 bg-[#5c6149] mt-3 rounded-full"></div>
          </div>

          <div className="flex flex-col gap-3">
            
            {/* Accordion 1: Details & Cut */}
            <div className="bg-white rounded-2xl p-5 shadow-xs border border-[#e6e2dc]">
              <button
                onClick={() => toggleAccordion('details')}
                className="w-full flex items-center justify-between text-left cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <span className="w-9 h-9 rounded-full bg-[#dee3c4] text-[#191d0a] flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-lg">styler</span>
                  </span>
                  <div>
                    <h3 className="font-serif text-base font-semibold text-[#171411]">
                      Details, Silhouette & Cut
                    </h3>
                    <p className="text-xs text-[#7e756f]">Modest relaxed drape, floor length, pocket configuration</p>
                  </div>
                </div>
                <span className={`material-symbols-outlined text-xl text-[#171411] transition-transform duration-300 ${openAccordion === 'details' ? 'rotate-180' : ''}`}>
                  expand_more
                </span>
              </button>

              {openAccordion === 'details' && (
                <div className="mt-4 pt-4 border-t border-[#f1ede7] text-xs text-[#4d4540] flex flex-col gap-3 leading-relaxed animate-in fade-in duration-200">
                  <p>{product.description}</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mt-1">
                    {product.details.map((d, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <span className="material-symbols-outlined text-[#5c6149] text-sm shrink-0 mt-0.5">
                          check_circle
                        </span>
                        <span>{d}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Accordion 2: Fabric & Care */}
            <div className="bg-white rounded-2xl p-5 shadow-xs border border-[#e6e2dc]">
              <button
                onClick={() => toggleAccordion('fabric')}
                className="w-full flex items-center justify-between text-left cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <span className="w-9 h-9 rounded-full bg-[#f1ede7] text-[#171411] flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-lg">dry_cleaning</span>
                  </span>
                  <div>
                    <h3 className="font-serif text-base font-semibold text-[#171411]">
                      Fabric Composition & Care Manual
                    </h3>
                    <p className="text-xs text-[#7e756f]">Natural cooling fibers and gentle maintenance tips</p>
                  </div>
                </div>
                <span className={`material-symbols-outlined text-xl text-[#171411] transition-transform duration-300 ${openAccordion === 'fabric' ? 'rotate-180' : ''}`}>
                  expand_more
                </span>
              </button>

              {openAccordion === 'fabric' && (
                <div className="mt-4 pt-4 border-t border-[#f1ede7] text-xs text-[#4d4540] flex flex-col gap-3 leading-relaxed animate-in fade-in duration-200">
                  <p>{product.fabricCare.material}</p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-1">
                    <div className="bg-[#f7f3ed] p-3 rounded-xl flex items-center gap-2">
                      <span className="material-symbols-outlined text-[#5c6149]">water_drop</span>
                      <span>Cold Machine Wash or Gentle Wool Cycle</span>
                    </div>
                    <div className="bg-[#f7f3ed] p-3 rounded-xl flex items-center gap-2">
                      <span className="material-symbols-outlined text-[#5c6149]">iron</span>
                      <span>Warm Iron or Steam While Damp</span>
                    </div>
                    <div className="bg-[#f7f3ed] p-3 rounded-xl flex items-center gap-2">
                      <span className="material-symbols-outlined text-[#5c6149]">air</span>
                      <span>Line Dry in Gentle Shade</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Accordion 3: Sizing Guide & Measurements Table */}
            <div className="bg-white rounded-2xl p-5 shadow-xs border border-[#e6e2dc]">
              <button
                onClick={() => toggleAccordion('sizing')}
                className="w-full flex items-center justify-between text-left cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <span className="w-9 h-9 rounded-full bg-[#f1ede7] text-[#171411] flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-lg">straighten</span>
                  </span>
                  <div>
                    <h3 className="font-serif text-base font-semibold text-[#171411]">
                      Abaya Size Guide & Height Measurements
                    </h3>
                    <p className="text-xs text-[#7e756f]">Find your ideal fit according to full vertical stature</p>
                  </div>
                </div>
                <span className={`material-symbols-outlined text-xl text-[#171411] transition-transform duration-300 ${openAccordion === 'sizing' ? 'rotate-180' : ''}`}>
                  expand_more
                </span>
              </button>

              {openAccordion === 'sizing' && (
                <div className="mt-4 pt-4 border-t border-[#f1ede7] text-xs text-[#4d4540] flex flex-col gap-4 animate-in fade-in duration-200">
                  <p className="text-xs text-[#7e756f]">
                    Standard Abaya sizing corresponds to garment length in inches from shoulder top to floor hem. We recommend choosing based on your total height wearing your daily footwear.
                  </p>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="bg-[#f7f3ed] text-[#171411] font-semibold">
                          <th className="p-2.5 rounded-l-lg">Abaya Size</th>
                          <th className="p-2.5">Recommended Height</th>
                          <th className="p-2.5">Garment Length</th>
                          <th className="p-2.5">Bust Circumference</th>
                          <th className="p-2.5 rounded-r-lg">Sleeve Length</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#f1ede7]">
                        <tr className="hover:bg-[#fdf9f3]">
                          <td className="p-2.5 font-bold text-[#171411]">52</td>
                          <td className="p-2.5">5'1" – 5'2" (155–158 cm)</td>
                          <td className="p-2.5">52 inches (132 cm)</td>
                          <td className="p-2.5">44 inches (Free Fit)</td>
                          <td className="p-2.5">27 inches</td>
                        </tr>
                        <tr className="hover:bg-[#fdf9f3]">
                          <td className="p-2.5 font-bold text-[#171411]">54</td>
                          <td className="p-2.5">5'3" – 5'4" (160–163 cm)</td>
                          <td className="p-2.5">54 inches (137 cm)</td>
                          <td className="p-2.5">46 inches (Free Fit)</td>
                          <td className="p-2.5">27.5 inches</td>
                        </tr>
                        <tr className="bg-[#dee3c4]/40 font-semibold text-[#5c6149]">
                          <td className="p-2.5 font-bold">56 (Selected)</td>
                          <td className="p-2.5">5'5" – 5'6" (165–168 cm)</td>
                          <td className="p-2.5">56 inches (142 cm)</td>
                          <td className="p-2.5">48 inches (Free Fit)</td>
                          <td className="p-2.5">28 inches</td>
                        </tr>
                        <tr className="hover:bg-[#fdf9f3]">
                          <td className="p-2.5 font-bold text-[#171411]">58</td>
                          <td className="p-2.5">5'7" – 5'8" (170–173 cm)</td>
                          <td className="p-2.5">58 inches (147 cm)</td>
                          <td className="p-2.5">50 inches (Free Fit)</td>
                          <td className="p-2.5">28.5 inches</td>
                        </tr>
                        <tr className="hover:bg-[#fdf9f3]">
                          <td className="p-2.5 font-bold text-[#171411]">60</td>
                          <td className="p-2.5">5'9"+ (175+ cm)</td>
                          <td className="p-2.5">60 inches (152 cm)</td>
                          <td className="p-2.5">52 inches (Free Fit)</td>
                          <td className="p-2.5">29 inches</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>

            {/* Accordion 4: Customer Reviews */}
            <div className="bg-white rounded-2xl p-5 shadow-xs border border-[#e6e2dc]">
              <button
                onClick={() => toggleAccordion('reviews')}
                className="w-full flex items-center justify-between text-left cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <span className="w-9 h-9 rounded-full bg-[#f1ede7] text-[#171411] flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-lg">rate_review</span>
                  </span>
                  <div>
                    <h3 className="font-serif text-base font-semibold text-[#171411]">
                      Customer Reviews ({product.reviewsCount})
                    </h3>
                    <p className="text-xs text-[#7e756f]">Rated {product.rating} out of 5 based on verified modest wearers</p>
                  </div>
                </div>
                <span className={`material-symbols-outlined text-xl text-[#171411] transition-transform duration-300 ${openAccordion === 'reviews' ? 'rotate-180' : ''}`}>
                  expand_more
                </span>
              </button>

              {openAccordion === 'reviews' && (
                <div className="mt-4 pt-4 border-t border-[#f1ede7] text-xs text-[#4d4540] flex flex-col gap-6 animate-in fade-in duration-200">
                  {/* Summary Rating */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 rounded-xl bg-[#f7f3ed] items-center">
                    <div className="flex flex-col items-center justify-center text-center">
                      <span className="font-serif text-4xl font-bold text-[#171411]">{product.rating}</span>
                      <div className="flex text-[#e5a842] text-sm mt-1">
                        {'★'.repeat(5)}
                      </div>
                      <span className="text-[11px] text-[#7e756f] mt-1">98% would recommend</span>
                    </div>

                    <div className="md:col-span-2 flex flex-col gap-1 text-[11px]">
                      <div className="flex items-center gap-2">
                        <span className="w-12 text-right">5 Star</span>
                        <div className="flex-1 bg-[#e6e2dc] rounded-full h-1.5 overflow-hidden">
                          <div className="bg-[#5c6149] h-full rounded-full" style={{ width: '92%' }}></div>
                        </div>
                        <span className="w-8 text-[#7e756f]">92%</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="w-12 text-right">4 Star</span>
                        <div className="flex-1 bg-[#e6e2dc] rounded-full h-1.5 overflow-hidden">
                          <div className="bg-[#5c6149] h-full rounded-full" style={{ width: '6%' }}></div>
                        </div>
                        <span className="w-8 text-[#7e756f]">6%</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="w-12 text-right">3 Star</span>
                        <div className="flex-1 bg-[#e6e2dc] rounded-full h-1.5 overflow-hidden">
                          <div className="bg-[#5c6149] h-full rounded-full" style={{ width: '2%' }}></div>
                        </div>
                        <span className="w-8 text-[#7e756f]">2%</span>
                      </div>
                    </div>
                  </div>

                  {/* Reviews Cards List Header & Action */}
                  <div className="flex items-center justify-between pt-2">
                    <span className="font-serif font-semibold text-[#171411]">
                      Client Reflections ({reviews.length})
                    </span>
                    <button
                      type="button"
                      onClick={() => setShowReviewForm(!showReviewForm)}
                      className="px-3.5 py-1.5 rounded-full bg-[#171411] text-white hover:bg-[#5c6149] text-[11px] font-semibold transition-colors cursor-pointer flex items-center gap-1.5"
                    >
                      <span className="material-symbols-outlined text-xs">edit_note</span>
                      <span>{showReviewForm ? 'Close Form' : 'Write a Review'}</span>
                    </button>
                  </div>

                  {/* Write Review Form */}
                  {showReviewForm && (
                    <form
                      onSubmit={handleReviewSubmit}
                      className="bg-white p-5 rounded-xl border border-[#e6e2dc] shadow-xs space-y-3"
                    >
                      <h4 className="font-serif text-sm font-semibold text-[#171411]">
                        Share Your Experience with this Piece
                      </h4>

                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-semibold text-[#171411]">Your Rating:</span>
                        <div className="flex gap-1 text-[#e5a842] text-lg cursor-pointer">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              type="button"
                              onClick={() => setReviewRating(star)}
                              className="focus:outline-none hover:scale-110 transition-transform"
                            >
                              {star <= reviewRating ? '★' : '☆'}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[10px] font-semibold text-[#171411] uppercase mb-1">
                            Your Name
                          </label>
                          <input
                            type="text"
                            required
                            value={reviewAuthor}
                            onChange={(e) => setReviewAuthor(e.target.value)}
                            placeholder="e.g. Ayesha K."
                            className="w-full px-3 py-1.5 rounded-lg border border-[#d6cfc5] text-xs"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-semibold text-[#171411] uppercase mb-1">
                            City / Location
                          </label>
                          <input
                            type="text"
                            value={reviewLocation}
                            onChange={(e) => setReviewLocation(e.target.value)}
                            placeholder="e.g. London, UK"
                            className="w-full px-3 py-1.5 rounded-lg border border-[#d6cfc5] text-xs"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[10px] font-semibold text-[#171411] uppercase mb-1">
                          Review & Tailoring Notes
                        </label>
                        <textarea
                          rows={3}
                          required
                          value={reviewContent}
                          onChange={(e) => setReviewContent(e.target.value)}
                          placeholder="How did the drape, length, and fabric feel? Did the size match your expectation?"
                          className="w-full px-3 py-2 rounded-lg border border-[#d6cfc5] text-xs"
                        />
                      </div>

                      <div className="flex justify-end gap-2 pt-1">
                        <button
                          type="button"
                          onClick={() => setShowReviewForm(false)}
                          className="px-3 py-1.5 rounded-lg text-xs text-[#7e756f] hover:text-[#171411]"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          disabled={submittingReview}
                          className="px-5 py-1.5 rounded-lg bg-[#5c6149] hover:bg-[#4a4e3b] text-white text-xs font-semibold cursor-pointer disabled:opacity-50"
                        >
                          {submittingReview ? 'Submitting to Supabase...' : 'Publish Review'}
                        </button>
                      </div>
                    </form>
                  )}

                  {/* Reviews Cards List */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {reviews.map((rev) => (
                      <div key={rev.id} className="p-4 rounded-xl bg-[#f7f3ed] flex flex-col gap-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-full bg-[#dee3c4] text-[#191d0a] flex items-center justify-center font-bold text-xs">
                              {rev.author[0]}
                            </div>
                            <div>
                              <span className="font-serif font-semibold text-[#171411] block leading-tight">{rev.author}</span>
                              <span className="text-[10px] text-[#7e756f]">{rev.location} • Verified Buyer</span>
                            </div>
                          </div>
                          <div className="flex text-[#e5a842] text-xs">
                            {'★'.repeat(rev.rating)}
                          </div>
                        </div>
                        <p className="text-xs text-[#4d4540] italic leading-relaxed">
                          "{rev.content}"
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>
      </section>

      {/* Complete Your Look Section */}
      <section className="max-w-[1380px] mx-auto px-4 sm:px-8 lg:px-16 py-16">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-8">
          <div>
            <span className="text-[10px] font-bold text-[#5c6149] uppercase tracking-widest">
              CURATED COMBINATIONS
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-[#171411] mt-1">
              Complete Your Look
            </h2>
          </div>
          <button
            onClick={() => onNavigate('shop')}
            className="text-xs font-semibold text-[#171411] hover:text-[#5c6149] inline-flex items-center gap-1 transition-colors cursor-pointer"
          >
            <span>View Full Collection</span>
            <span className="material-symbols-outlined text-sm">arrow_forward</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {relatedProducts.map((rel) => (
            <div
              key={rel.id}
              className="group bg-white rounded-2xl overflow-hidden border border-[#e6e2dc] shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="relative aspect-[3/4] overflow-hidden bg-[#f1ede7]">
                  <img
                    src={rel.images.front}
                    alt={rel.alt}
                    onClick={() => onNavigate('product', rel.id)}
                    className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105 cursor-pointer"
                    referrerPolicy="no-referrer"
                  />
                  <button
                    onClick={() => toggleWishlist(rel.id)}
                    className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/85 backdrop-blur-xs text-[#171411] hover:text-[#ba1a1a] flex items-center justify-center transition-colors shadow-xs cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-xs">favorite</span>
                  </button>
                </div>
                <div className="p-4 flex flex-col gap-1">
                  <div className="flex items-center justify-between">
                    <h4
                      onClick={() => onNavigate('product', rel.id)}
                      className="font-serif text-xs sm:text-sm font-semibold text-[#171411] hover:text-[#5c6149] transition-colors truncate cursor-pointer"
                    >
                      {rel.name}
                    </h4>
                    <span className="font-serif text-xs sm:text-sm font-bold text-[#171411]">
                      ₹{rel.price.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <div className="flex items-center text-[#e5a842] text-xs">
                    {'★'.repeat(5)}
                    <span className="text-[#7e756f] text-[10px] ml-1">({rel.reviewsCount})</span>
                  </div>
                </div>
              </div>

              <div className="p-4 pt-0">
                <button
                  onClick={() => addToCart(rel)}
                  className="w-full bg-[#171411] hover:bg-[#5c6149] text-white py-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-xs cursor-pointer"
                >
                  <span className="material-symbols-outlined text-sm">shopping_bag</span>
                  <span>Quick Add</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Editorial Quote Strip */}
      <section className="w-full bg-[#ebe8e2] py-10 text-center">
        <div className="max-w-[700px] mx-auto px-4 flex flex-col items-center gap-2">
          <span className="font-cursive text-3xl text-[#5c6149]">A Brighter You ♥</span>
          <p className="font-serif text-base sm:text-lg text-[#171411] leading-relaxed">
            "Modesty is not about hiding, it is an enduring declaration of grace, presence, and timeless dignity."
          </p>
          <span className="text-[10px] tracking-[0.25em] text-[#7e756f] uppercase font-semibold">
            — Atelier Husna, Dubai & London
          </span>
        </div>
      </section>

    </div>
  );
};
