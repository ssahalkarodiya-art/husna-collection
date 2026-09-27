import React from 'react';
import { useCart } from '../context/CartContext';
import { BRAND_INFO } from '../data/products';

interface CartDrawerProps {
  onNavigateToCart: () => void;
  onNavigateToCheckout: () => void;
  onProductClick: (productId: string) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  onNavigateToCart,
  onNavigateToCheckout,
  onProductClick,
}) => {
  const {
    cart,
    isCartDrawerOpen,
    setIsCartDrawerOpen,
    removeFromCart,
    updateQuantity,
    subtotal,
    discountAmount,
    shippingFee,
    total,
    freeShippingProgress,
    isPromoApplied,
    getWhatsAppCartLink,
  } = useCart();

  if (!isCartDrawerOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-[#171411]/50 backdrop-blur-xs transition-opacity"
        onClick={() => setIsCartDrawerOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#fdf9f3] shadow-2xl flex flex-col">
          
          {/* Header */}
          <div className="p-5 border-b border-[#e6e2dc] flex items-center justify-between bg-white">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[20px] text-[#5c6149]">shopping_bag</span>
              <h2 className="font-serif text-lg font-semibold text-[#171411]">
                Your Shopping Bag ({cart.reduce((a, c) => a + c.quantity, 0)})
              </h2>
            </div>
            <button
              onClick={() => setIsCartDrawerOpen(false)}
              className="w-8 h-8 rounded-full flex items-center justify-center text-[#7e756f] hover:text-[#171411] hover:bg-[#f1ede7] transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-lg">close</span>
            </button>
          </div>

          {/* Free Shipping Dynamic Progress */}
          <div className="bg-[#f7f3ed] p-4 border-b border-[#e6e2dc]">
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="font-medium text-[#171411]">
                {freeShippingProgress.isUnlocked ? (
                  <span className="text-[#5c6149] font-bold flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm">verified</span>
                    Unlocked: Free Express Global Shipping!
                  </span>
                ) : (
                  <span>
                    Add <strong className="text-[#4b1906] font-bold">₹{freeShippingProgress.needed.toLocaleString('en-IN')}</strong> more for Free Shipping
                  </span>
                )}
              </span>
              <span className="text-[#5c6149] font-semibold">{freeShippingProgress.percent}%</span>
            </div>
            <div className="w-full bg-[#e6e2dc] rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-[#5c6149] h-full rounded-full transition-all duration-500"
                style={{ width: `${freeShippingProgress.percent}%` }}
              />
            </div>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-5 divide-y divide-[#e6e2dc]">
            {cart.length === 0 ? (
              <div className="text-center py-16 flex flex-col items-center">
                <span className="material-symbols-outlined text-5xl text-[#cfc4bd] mb-3">
                  local_mall
                </span>
                <p className="font-serif text-lg text-[#171411] mb-1">Your bag is empty</p>
                <p className="text-xs text-[#7e756f] max-w-xs mb-6">
                  Discover our modest couture abayas, hijabs, and caps curated for timeless elegance.
                </p>
                <button
                  onClick={() => {
                    setIsCartDrawerOpen(false);
                    onNavigateToCart();
                  }}
                  className="bg-[#171411] text-white text-xs font-semibold px-6 py-2.5 rounded-full hover:bg-[#2c2825] transition-colors"
                >
                  Explore Collection
                </button>
              </div>
            ) : (
              cart.map((item) => (
                <div key={item.id} className="py-4 first:pt-0 last:pb-0 flex gap-3.5">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-20 h-26 rounded-lg object-cover bg-[#f1ede7] shrink-0 cursor-pointer"
                    onClick={() => {
                      setIsCartDrawerOpen(false);
                      onProductClick(item.productId);
                    }}
                    referrerPolicy="no-referrer"
                  />
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <h4
                        className="font-serif text-sm font-semibold text-[#171411] hover:text-[#5c6149] transition-colors cursor-pointer"
                        onClick={() => {
                          setIsCartDrawerOpen(false);
                          onProductClick(item.productId);
                        }}
                      >
                        {item.name}
                      </h4>
                      <p className="text-[11px] text-[#7e756f] mt-0.5">{item.color} • Size {item.size}</p>
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      {/* Quantity Stepper */}
                      <div className="flex items-center bg-[#f1ede7] rounded-full px-2 py-0.5">
                        <button
                          onClick={() => updateQuantity(item.id, -1)}
                          className="w-5 h-5 flex items-center justify-center text-xs font-bold text-[#171411] hover:bg-white rounded-full transition-colors cursor-pointer"
                        >
                          −
                        </button>
                        <span className="text-xs font-semibold px-2">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, 1)}
                          className="w-5 h-5 flex items-center justify-center text-xs font-bold text-[#171411] hover:bg-white rounded-full transition-colors cursor-pointer"
                        >
                          +
                        </button>
                      </div>

                      <div className="text-right">
                        <span className="font-serif text-sm font-semibold text-[#171411]">
                          ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                        </span>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-[10px] text-[#ba1a1a] block underline hover:opacity-80 transition-opacity cursor-pointer mt-0.5"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer & Actions */}
          {cart.length > 0 && (
            <div className="p-5 border-t border-[#e6e2dc] bg-white flex flex-col gap-3">
              <div className="flex flex-col gap-1.5 text-xs text-[#7e756f]">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-[#171411]">₹{subtotal.toLocaleString('en-IN')}</span>
                </div>
                {isPromoApplied && (
                  <div className="flex justify-between text-[#5c6149]">
                    <span>Promotional Saving ({BRAND_INFO.promoCode})</span>
                    <span className="font-semibold">−₹{discountAmount.toLocaleString('en-IN')}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className="font-semibold text-[#171411]">
                    {shippingFee === 0 ? 'FREE' : `₹${shippingFee.toLocaleString('en-IN')}`}
                  </span>
                </div>
                <div className="flex justify-between text-sm font-semibold text-[#171411] pt-1 border-t border-[#e6e2dc]">
                  <span>Estimated Total</span>
                  <span className="font-serif text-base">₹{total.toLocaleString('en-IN')}</span>
                </div>
              </div>

              {/* Checkout Button */}
              <button
                onClick={() => {
                  setIsCartDrawerOpen(false);
                  onNavigateToCheckout();
                }}
                className="w-full bg-[#171411] hover:bg-[#2c2825] text-white py-3 rounded-full text-xs font-semibold tracking-wide flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
              >
                <span className="material-symbols-outlined text-sm">lock</span>
                <span>Proceed to Checkout</span>
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </button>

              {/* View Full Cart */}
              <button
                onClick={() => {
                  setIsCartDrawerOpen(false);
                  onNavigateToCart();
                }}
                className="w-full bg-[#f1ede7] hover:bg-[#e6e2dc] text-[#171411] py-2.5 rounded-full text-xs font-semibold transition-colors cursor-pointer"
              >
                View Full Shopping Bag
              </button>

              {/* WhatsApp Checkout direct */}
              <a
                href={getWhatsAppCartLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-[#5c6149] hover:bg-[#171411] text-white py-2.5 rounded-full text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
              >
                <span className="material-symbols-outlined text-sm">chat</span>
                <span>Order via WhatsApp Stylist</span>
              </a>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
