import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { BRAND_INFO, PRODUCTS } from '../data/products';

interface CartPageProps {
  onNavigate: (page: string, productId?: string) => void;
}

export const CartPage: React.FC<CartPageProps> = ({ onNavigate }) => {
  const {
    cart,
    removeFromCart,
    updateQuantity,
    subtotal,
    discountAmount,
    shippingFee,
    total,
    freeShippingProgress,
    hasUnlockedFreeHijab,
    promoCode,
    isPromoApplied,
    applyPromo,
    removePromo,
    includeGiftBox,
    setIncludeGiftBox,
    setIsCheckoutModalOpen,
    addToCart,
    toggleWishlist,
    getWhatsAppCartLink,
  } = useCart();

  const [inputCode, setInputCode] = useState(promoCode);

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputCode.trim()) {
      applyPromo(inputCode);
    }
  };

  // Addon products matching Image 1.png
  const addonItems = [
    {
      product: PRODUCTS.find((p) => p.id === 'inner-slip-dress')!,
      badge: 'Essential Layer',
      ratingCount: 84,
      desc: 'Opaque, breathable bamboo viscose anti-static lining dress.',
    },
    {
      product: PRODUCTS.find((p) => p.id === 'magnetic-gold-clasps')!,
      badge: 'Snag-Free',
      ratingCount: 142,
      desc: '4–Piece 18k brushed gold snag-free neodymium magnetic pins.',
    },
    {
      product: PRODUCTS.find((p) => p.id === 'silk-refresher-spray')!,
      badge: 'Organic Oud',
      ratingCount: 39,
      desc: 'Delicate organic rosewater & white oud fabric freshener (100ml).',
    },
  ].filter((item) => item.product !== undefined);

  const itemCount = cart.reduce((acc, item) => acc + item.quantity, 0) + (hasUnlockedFreeHijab ? 1 : 0);

  return (
    <div className="w-full bg-[#fdf9f3] min-h-screen">
      
      {/* Hero & Dynamic Free Shipping Tracker */}
      <section className="w-full bg-[#f7f3ed] py-8 sm:py-10 border-b border-[#e6e2dc]">
        <div className="max-w-[1380px] mx-auto px-4 sm:px-8 lg:px-16">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-1.5 text-[#5c6149] mb-1">
                <span className="material-symbols-outlined text-[18px]">shopping_bag</span>
                <span className="text-[11px] font-bold uppercase tracking-widest">
                  Curated Selection • {itemCount} {itemCount === 1 ? 'Item' : 'Items'}
                </span>
              </div>
              <h1 className="font-serif text-3xl sm:text-4xl font-semibold text-[#171411] tracking-tight">
                Your Shopping Bag
              </h1>
            </div>

            <div className="flex items-center gap-3 text-xs text-[#4d4540]">
              <span className="inline-flex items-center gap-1">
                <span className="material-symbols-outlined text-base text-[#5c6149]">verified_user</span>
                <span>100% Modest Cut Assurance</span>
              </span>
              <span className="opacity-40">•</span>
              <span className="inline-flex items-center gap-1">
                <span className="material-symbols-outlined text-base text-[#5c6149]">history</span>
                <span>14-Day Exchanges</span>
              </span>
            </div>
          </div>

          {/* Dynamic Free Shipping Meter Card */}
          <div className="bg-white p-5 rounded-2xl shadow-xs border border-[#e6e2dc]">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
              <p className="text-xs sm:text-sm text-[#171411] font-medium flex items-center gap-2">
                <span className="material-symbols-outlined text-[#5c6149] text-xl">redeem</span>
                <span>
                  {freeShippingProgress.isUnlocked ? (
                    <strong className="text-[#5c6149]">
                      Congratulations! You unlocked Free Express Global Shipping!
                    </strong>
                  ) : (
                    <>
                      Add only <strong className="text-[#4b1906] font-bold">${freeShippingProgress.needed.toFixed(2)}</strong> more to unlock <strong className="text-[#171411]">Free Express Global Shipping</strong>!
                    </>
                  )}
                </span>
              </p>
              <span className="text-xs font-semibold text-[#5c6149]">
                {freeShippingProgress.percent}% Completed (${subtotal.toFixed(0)} / ${BRAND_INFO.freeShippingThreshold})
              </span>
            </div>

            <div className="w-full bg-[#f1ede7] rounded-full h-2.5 overflow-hidden">
              <div
                className="bg-[#5c6149] h-full rounded-full transition-all duration-700 ease-out"
                style={{ width: `${freeShippingProgress.percent}%` }}
              />
            </div>

            <div className="flex items-center justify-between text-[11px] text-[#7e756f] mt-2">
              <span>{hasUnlockedFreeHijab ? 'Complimentary Hijab Unlocked ✓' : 'Add $100 for Free Gift Hijab'}</span>
              <span>
                {freeShippingProgress.isUnlocked
                  ? 'Zero Shipping Fee Applied'
                  : `$${freeShippingProgress.needed.toFixed(2)} away from Zero Shipping Fee`}
              </span>
            </div>
          </div>

        </div>
      </section>

      {/* Main Bag Content & Summary Section */}
      <section className="max-w-[1380px] mx-auto px-4 sm:px-8 lg:px-16 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Left Column: Cart Items and Actions (7 cols) */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            
            {/* Items Container */}
            <div className="bg-white p-6 rounded-2xl border border-[#e6e2dc] shadow-xs flex flex-col gap-6">
              
              {cart.length === 0 ? (
                <div className="text-center py-12 flex flex-col items-center">
                  <span className="material-symbols-outlined text-4xl text-[#cfc4bd] mb-2">
                    local_mall
                  </span>
                  <p className="font-serif text-base text-[#171411]">Your bag is empty</p>
                  <button
                    onClick={() => onNavigate('shop')}
                    className="mt-4 bg-[#171411] text-white text-xs font-semibold px-6 py-2.5 rounded-full hover:bg-[#2c2825]"
                  >
                    Browse Atelier Catalog
                  </button>
                </div>
              ) : (
                cart.map((item, index) => (
                  <div key={item.id} className="flex flex-col gap-6">
                    {index > 0 && <div className="h-[1px] w-full bg-[#f1ede7]" />}

                    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                      <div className="flex gap-4 items-center w-full sm:w-auto">
                        
                        {/* Thumbnail */}
                        <div className="relative w-24 h-32 sm:w-28 sm:h-36 rounded-xl overflow-hidden shrink-0 bg-[#f1ede7]">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover object-top cursor-pointer"
                            onClick={() => onNavigate('product', item.productId)}
                            referrerPolicy="no-referrer"
                          />
                          <span className="absolute top-1.5 left-1.5 bg-[#171411]/80 backdrop-blur-xs text-white text-[9px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded-full">
                            Bestseller
                          </span>
                        </div>

                        {/* Details */}
                        <div className="flex flex-col gap-1 flex-1">
                          <h3
                            onClick={() => onNavigate('product', item.productId)}
                            className="font-serif text-base font-semibold text-[#171411] hover:text-[#5c6149] transition-colors cursor-pointer"
                          >
                            {item.name}
                          </h3>
                          <p className="text-xs text-[#7e756f]">{item.subtitle}</p>

                          <div className="flex flex-wrap items-center gap-2 mt-1 text-xs">
                            <span className="bg-[#f1ede7] px-2 py-0.5 rounded text-[11px] font-medium text-[#4d4540]">
                              Length: {item.size}
                            </span>
                            <span className="bg-[#f1ede7] px-2 py-0.5 rounded text-[11px] font-medium text-[#4d4540]">
                              Color: {item.color}
                            </span>
                          </div>

                          <div className="flex items-center gap-4 pt-2">
                            {/* Quantity Buttons */}
                            <div className="flex items-center bg-[#f1ede7] rounded-full px-2 py-0.5">
                              <button
                                onClick={() => updateQuantity(item.id, -1)}
                                className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-[#171411] hover:bg-white transition-colors cursor-pointer"
                              >
                                −
                              </button>
                              <span className="text-xs font-semibold px-2.5">{item.quantity}</span>
                              <button
                                onClick={() => updateQuantity(item.id, 1)}
                                className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-[#171411] hover:bg-white transition-colors cursor-pointer"
                              >
                                +
                              </button>
                            </div>

                            {/* Save & Remove */}
                            <div className="flex items-center gap-3 text-xs">
                              <button
                                onClick={() => {
                                  toggleWishlist(item.productId);
                                }}
                                className="text-[#7e756f] hover:text-[#171411] transition-colors flex items-center gap-1 underline text-[11px] cursor-pointer"
                              >
                                <span className="material-symbols-outlined text-[14px]">favorite</span>
                                <span>Save</span>
                              </button>
                              <span className="text-[#cfc4bd]">•</span>
                              <button
                                onClick={() => removeFromCart(item.id)}
                                className="text-[#ba1a1a] hover:opacity-80 transition-colors flex items-center gap-1 underline text-[11px] cursor-pointer"
                              >
                                <span className="material-symbols-outlined text-[14px]">delete</span>
                                <span>Remove</span>
                              </button>
                            </div>
                          </div>
                        </div>

                      </div>

                      <div className="sm:text-right w-full sm:w-auto flex sm:flex-col justify-between items-center sm:items-end pt-2 sm:pt-0">
                        <span className="font-serif text-lg font-bold text-[#171411]">
                          ${(item.price * item.quantity).toFixed(2)}
                        </span>
                        <span className="text-[11px] text-[#5c6149] font-medium">In Stock • Ships Today</span>
                      </div>
                    </div>
                  </div>
                ))
              )}

              {/* Complimentary Spend Bonus Card (Matching Image 1.png exactly) */}
              {hasUnlockedFreeHijab && (
                <>
                  <div className="h-[1px] w-full bg-[#f1ede7]" />
                  <div className="bg-[#dee3c4]/40 p-4 rounded-xl flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between border border-[#dee3c4]">
                    <div className="flex gap-4 items-center w-full sm:w-auto">
                      <div className="relative w-20 h-26 rounded-lg overflow-hidden shrink-0 bg-[#f1ede7]">
                        <img
                          src="https://lh3.googleusercontent.com/aida-public/AB6AXuCZV1e6FyNmqDmZeCl9Eor5P9KkpZHAiO9sg7e7FzmDAVIqG4X10mLYzPM5AfmE_1hjD1-dcXtNabnrPD4NPox8Nb34cHY2SjHl-9WsDWIm7VVKcmGxCjX66j5fZwj1h7Nb1_d7qVsIaCpvBr0cpb7xP2ROa93oE_RuIw_qBCe2xGF2vqXlltLIvkkdihZY_yB3C4h8MEmV0JqL6s2Oc5zrmFgiBe-TUQhiNkbSNNcCFV_q3YTbCLpQ"
                          alt="Matching Silk Chiffon Hijab"
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                        <span className="absolute top-1 left-1 bg-[#5c6149] text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full uppercase">
                          Gift
                        </span>
                      </div>
                      <div className="flex flex-col gap-0.5">
                        <div className="flex items-center gap-1 text-[#5c6149] text-[10px] font-bold uppercase tracking-wider">
                          <span className="material-symbols-outlined text-xs">arrow_back_ios_new</span>
                          <span>Complimentary Spend Bonus</span>
                        </div>
                        <h4 className="font-serif text-sm font-semibold text-[#191d0a]">
                          Matching Silk Chiffon Hijab
                        </h4>
                        <p className="text-xs text-[#60654d]">180 × 70cm • Desert Sand</p>
                        <p className="text-[11px] text-[#5c6149] font-medium mt-0.5">
                          Unlocked automatically for qualifying orders over $100
                        </p>
                      </div>
                    </div>

                    <div className="sm:text-right w-full sm:w-auto flex sm:flex-col justify-between items-center sm:items-end">
                      <div className="flex items-baseline gap-1.5">
                        <span className="line-through text-[#7e756f] text-xs">$18.00</span>
                        <span className="font-serif text-sm font-bold text-[#5c6149]">FREE</span>
                      </div>
                      <span className="text-[10px] bg-[#dee3c4] text-[#191d0a] px-2 py-0.5 rounded-full font-bold uppercase mt-1">
                        Added
                      </span>
                    </div>
                  </div>
                </>
              )}

            </div>

            {/* Promo Code & Gift Packaging Section */}
            <div className="bg-white p-6 rounded-2xl border border-[#e6e2dc] shadow-xs flex flex-col gap-4">
              
              {/* Promo Input */}
              <form onSubmit={handleApplyPromo} className="flex flex-col sm:flex-row gap-2.5 items-center">
                <div className="relative flex-1 w-full">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#cfc4bd]">
                    sell
                  </span>
                  <input
                    type="text"
                    value={inputCode}
                    onChange={(e) => setInputCode(e.target.value)}
                    placeholder="Enter coupon or gift card"
                    className="w-full bg-[#f1ede7] rounded-lg pl-10 pr-4 py-2.5 text-xs font-medium text-[#171411] placeholder:text-[#7e756f] focus:outline-none focus:bg-white focus:border focus:border-[#171411]"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full sm:w-auto bg-[#171411] hover:bg-[#2c2825] text-white text-xs font-semibold px-6 py-2.5 rounded-lg transition-colors flex items-center justify-center gap-1 shadow-xs cursor-pointer"
                >
                  <span>Apply Code</span>
                  <span className="material-symbols-outlined text-sm">check</span>
                </button>
              </form>

              {/* Promo Active Banner */}
              {isPromoApplied ? (
                <div className="flex items-center justify-between bg-[#f7f3ed] px-4 py-2 rounded-lg text-xs">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#5c6149] text-base">info</span>
                    <p className="text-[#4d4540]">
                      Code <strong className="text-[#171411] font-semibold">{BRAND_INFO.promoCode}</strong> is active. You will save <strong className="text-[#5c6149] font-bold">{BRAND_INFO.discountPercent}%</strong> on checkout!
                    </p>
                  </div>
                  <button
                    onClick={removePromo}
                    className="text-[#ba1a1a] hover:underline text-[11px] cursor-pointer"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <div className="text-[11px] text-[#7e756f]">
                  Tip: Enter code <button onClick={() => { setInputCode('HUSNA20'); applyPromo('HUSNA20'); }} className="font-bold underline text-[#171411] cursor-pointer">HUSNA20</button> for 20% off.
                </div>
              )}

              {/* Keepsake Packaging Checkbox */}
              <label className="flex items-start gap-3 cursor-pointer p-2 rounded-xl hover:bg-[#f7f3ed] transition-colors select-none">
                <input
                  type="checkbox"
                  checked={includeGiftBox}
                  onChange={(e) => setIncludeGiftBox(e.target.value === 'true' || e.target.checked)}
                  className="mt-1 w-4 h-4 rounded accent-[#5c6149] cursor-pointer"
                />
                <div className="flex flex-col">
                  <span className="text-xs font-semibold text-[#171411] flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[#5c6149] text-base">card_giftcard</span>
                    <span>Include Complimentary Husna Signature Keepsake Box & Handwritten Greeting Note</span>
                  </span>
                  <span className="text-[11px] text-[#7e756f] mt-0.5">
                    Handcrafted matte linen-textured presentation box tied with organic grosgrain ribbon. Ideal for gifting.
                  </span>
                </div>
              </label>

            </div>

            {/* Assurance Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="bg-[#f7f3ed] p-4 rounded-xl flex items-center gap-3 border border-[#e6e2dc]">
                <div className="w-9 h-9 rounded-full bg-[#dee3c4] flex items-center justify-center text-[#191d0a] shrink-0">
                  <span className="material-symbols-outlined text-[18px]">local_shipping</span>
                </div>
                <div>
                  <p className="text-xs font-semibold text-[#171411]">Global Express</p>
                  <p className="text-[11px] text-[#7e756f]">3–5 day DHL / FedEx</p>
                </div>
              </div>

              <div className="bg-[#f7f3ed] p-4 rounded-xl flex items-center gap-3 border border-[#e6e2dc]">
                <div className="w-9 h-9 rounded-full bg-[#dee3c4] flex items-center justify-center text-[#191d0a] shrink-0">
                  <span className="material-symbols-outlined text-[18px]">lock</span>
                </div>
                <div>
                  <p className="text-xs font-semibold text-[#171411]">Bank Encrypted</p>
                  <p className="text-[11px] text-[#7e756f]">PCI-DSS Level 1 Safe</p>
                </div>
              </div>

              <div className="bg-[#f7f3ed] p-4 rounded-xl flex items-center gap-3 border border-[#e6e2dc]">
                <div className="w-9 h-9 rounded-full bg-[#dee3c4] flex items-center justify-center text-[#191d0a] shrink-0">
                  <span className="material-symbols-outlined text-[18px]">cached</span>
                </div>
                <div>
                  <p className="text-xs font-semibold text-[#171411]">Easy Return</p>
                  <p className="text-[11px] text-[#7e756f]">14 days home pickup</p>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Order Summary & WhatsApp Concierge Checkout (5 cols) */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            
            {/* Order Summary Box */}
            <div className="bg-white p-6 sm:p-7 rounded-2xl border border-[#e6e2dc] shadow-sm flex flex-col gap-4">
              <h2 className="font-serif text-xl font-semibold text-[#171411]">
                Order Summary
              </h2>

              <div className="flex flex-col gap-2.5 text-xs text-[#4d4540] pt-1">
                <div className="flex justify-between items-center">
                  <span>Cart Subtotal ({cart.reduce((a, c) => a + c.quantity, 0)} items)</span>
                  <span className="font-semibold text-[#171411]">${subtotal.toFixed(2)}</span>
                </div>

                {hasUnlockedFreeHijab && (
                  <div className="flex justify-between items-center text-[#5c6149]">
                    <span className="flex items-center gap-1 font-medium">
                      <span className="material-symbols-outlined text-sm">stars</span>
                      <span>Complimentary Chiffon Hijab</span>
                    </span>
                    <span className="font-bold uppercase text-[11px] tracking-wider">FREE ($18.00)</span>
                  </div>
                )}

                <div className="flex justify-between items-center">
                  <span className="flex items-center gap-1">
                    <span>Shipping Fee</span>
                    <span className="material-symbols-outlined text-[14px] text-[#7e756f]" title="Free shipping over $150">
                      help
                    </span>
                  </span>
                  <span className="font-semibold text-[#171411]">
                    {shippingFee === 0 ? 'FREE' : `$${shippingFee.toFixed(2)}`}
                  </span>
                </div>

                {isPromoApplied && (
                  <div className="flex justify-between items-center text-[#5c6149]">
                    <span>Promotional Saving ({BRAND_INFO.promoCode})</span>
                    <span className="font-semibold">−${discountAmount.toFixed(2)}</span>
                  </div>
                )}
              </div>

              <div className="h-[1px] w-full bg-[#f1ede7] my-1" />

              {/* Estimated Total */}
              <div className="flex justify-between items-baseline">
                <div>
                  <span className="font-serif text-base font-semibold text-[#171411] block">
                    Estimated Total
                  </span>
                  <span className="text-[11px] text-[#7e756f]">
                    All duties and regional taxes calculated
                  </span>
                </div>
                <div className="text-right">
                  <span className="font-serif text-2xl font-bold text-[#171411] block">
                    ${total.toFixed(2)}
                  </span>
                  {discountAmount > 0 && (
                    <span className="text-[11px] text-[#5c6149] font-medium">
                      Saved ${(discountAmount + (shippingFee === 0 ? 10 : 0)).toFixed(2)} today
                    </span>
                  )}
                </div>
              </div>

              {/* Primary Checkout Button */}
              <button
                onClick={() => setIsCheckoutModalOpen(true)}
                className="w-full mt-2 bg-[#171411] hover:bg-[#2c2825] text-white py-3.5 px-6 rounded-full text-xs font-semibold tracking-wide flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
              >
                <span className="material-symbols-outlined text-sm">lock</span>
                <span>Proceed to Secure Checkout</span>
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </button>

              {/* Express Payment Options */}
              <div className="flex flex-col items-center gap-1.5 pt-2">
                <span className="text-[10px] font-semibold text-[#7e756f] uppercase tracking-widest">
                  Instant Express Checkout
                </span>
                <div className="grid grid-cols-3 gap-2 w-full mt-1">
                  <button
                    onClick={() => setIsCheckoutModalOpen(true)}
                    className="h-10 bg-[#2c2825] hover:bg-[#171411] text-white rounded-lg flex items-center justify-center text-xs font-semibold tracking-wide transition-colors cursor-pointer"
                  >
                    • Apple Pay
                  </button>
                  <button
                    onClick={() => setIsCheckoutModalOpen(true)}
                    className="h-10 bg-[#f1ede7] hover:bg-[#e6e2dc] text-[#171411] rounded-lg flex items-center justify-center text-xs font-semibold tracking-wide transition-colors cursor-pointer"
                  >
                    G Pay
                  </button>
                  <button
                    onClick={() => setIsCheckoutModalOpen(true)}
                    className="h-10 bg-[#dee3c4] hover:bg-[#d0d7b2] text-[#191d0a] rounded-lg flex items-center justify-center text-xs font-semibold tracking-wide transition-colors cursor-pointer"
                  >
                    Tabby 4x
                  </button>
                </div>
              </div>
            </div>

            {/* Dedicated WhatsApp Ordering Card (Exact match to Image 1.png) */}
            <div className="bg-[#5c6149] p-6 rounded-2xl text-white shadow-md relative overflow-hidden">
              <div className="absolute -right-6 -bottom-6 w-32 h-32 rounded-full bg-white/10 pointer-events-none" />
              
              <div className="flex items-center gap-2.5 mb-2">
                <div className="w-8 h-8 rounded-full bg-[#dee3c4] text-[#191d0a] flex items-center justify-center">
                  <span className="material-symbols-outlined text-[18px]">chat</span>
                </div>
                <h3 className="font-serif text-base font-semibold text-white">
                  Prefer WhatsApp Ordering?
                </h3>
              </div>

              <p className="text-xs text-[#c4c9ac] leading-relaxed mb-4">
                Transfer your bag directly to a personal stylist for instant size confirmation, custom abaya hem trimming, and direct VIP WhatsApp checkout.
              </p>

              <a
                href={getWhatsAppCartLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 bg-white text-[#171411] hover:bg-[#f1ede7] text-xs font-semibold py-3 px-4 rounded-full transition-colors shadow-xs"
              >
                <span>Order Cart via WhatsApp</span>
                <span className="material-symbols-outlined text-sm">arrow_outward</span>
              </a>
            </div>

            {/* Trust Badges Detailed */}
            <div className="bg-[#f7f3ed] p-4 rounded-2xl border border-[#e6e2dc] flex flex-col gap-2.5">
              <div className="flex items-center gap-2.5">
                <span className="material-symbols-outlined text-[#5c6149] text-base">check_circle</span>
                <span className="text-xs text-[#171411]">
                  <strong>Authentic Fabrics Guarantee:</strong> Pure Japanese crepes & premium silks.
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <span className="material-symbols-outlined text-[#5c6149] text-base">verified</span>
                <span className="text-xs text-[#171411]">
                  <strong>Bespoke Tailoring:</strong> Free modest cuff adjustments on request.
                </span>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* Frequently Added Together Section (Matching Image 1.png exactly) */}
      <section className="w-full bg-[#f1ede7] py-16 sm:py-20 border-t border-[#e6e2dc]">
        <div className="max-w-[1380px] mx-auto px-4 sm:px-8 lg:px-16">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-8">
            <div>
              <span className="text-[10px] font-bold text-[#5c6149] uppercase tracking-widest">
                COMPLETE YOUR MODEST ENSEMBLE
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-[#171411] tracking-tight mt-1">
                Frequently Added Together
              </h2>
            </div>
            <p className="text-xs text-[#4d4540] max-w-sm">
              Pairs seamlessly with your cart items to unlock free global shipping with one single click.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {addonItems.map((addon) => (
              <div
                key={addon.product.id}
                className="bg-white rounded-2xl p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group border border-[#e6e2dc]"
              >
                <div>
                  <div className="relative w-full aspect-[3/4] rounded-xl overflow-hidden bg-[#f1ede7] mb-4">
                    <img
                      src={addon.product.images.front}
                      alt={addon.product.alt}
                      onClick={() => onNavigate('product', addon.product.id)}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 cursor-pointer"
                      referrerPolicy="no-referrer"
                    />
                    <button
                      onClick={() => toggleWishlist(addon.product.id)}
                      className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-white/90 backdrop-blur-xs flex items-center justify-center text-[#171411] hover:text-[#ba1a1a] transition-colors shadow-xs cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[18px]">favorite</span>
                    </button>
                    <span className="absolute bottom-2.5 left-2.5 bg-[#171411]/80 backdrop-blur-xs text-white text-[9px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full">
                      {addon.badge}
                    </span>
                  </div>

                  <div className="flex items-center gap-1 text-[#e5a842] text-xs mb-1">
                    {'★'.repeat(5)}
                    <span className="text-[#7e756f] text-[11px] ml-1 font-medium">({addon.ratingCount})</span>
                  </div>

                  <h3
                    onClick={() => onNavigate('product', addon.product.id)}
                    className="font-serif text-sm font-semibold text-[#171411] hover:text-[#5c6149] transition-colors cursor-pointer mb-1"
                  >
                    {addon.product.name}
                  </h3>

                  <p className="text-xs text-[#7e756f] mb-4">
                    {addon.desc}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-[#f1ede7]">
                  <span className="font-serif text-base font-bold text-[#171411]">
                    ${addon.product.price.toFixed(2)}
                  </span>
                  <button
                    onClick={() => addToCart(addon.product)}
                    className="h-9 px-4 bg-[#171411] hover:bg-[#5c6149] text-white rounded-full text-xs font-semibold flex items-center gap-1 transition-all shadow-xs cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-sm">add</span>
                    <span>Quick Add</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* Editorial Brand Footer Quote Card */}
      <section className="w-full bg-[#f7f3ed] py-12 border-t border-[#e6e2dc] text-center">
        <div className="max-w-[1380px] mx-auto px-4 text-center flex flex-col items-center">
          <span className="font-cursive text-3xl sm:text-4xl text-[#5c6149] mb-1">
            Modest Fashion Brighter Tomorrow ♥
          </span>
          <p className="font-serif text-base text-[#171411] max-w-xl">
            Every piece is ethically created, carefully inspected by master artisans, and packaged with grace.
          </p>
          <div className="flex items-center justify-center gap-4 mt-4 text-xs text-[#7e756f]">
            <span>Complimentary Returns</span>
            <span>•</span>
            <span>Ethical Craftsmanship</span>
            <span>•</span>
            <span>Carbon Neutral Delivery</span>
          </div>
        </div>
      </section>

    </div>
  );
};
