import React from 'react';
import { useCart } from '../context/CartContext';
import { PRODUCTS } from '../data/products';

interface WishlistModalProps {
  onSelectProduct: (productId: string) => void;
}

export const WishlistModal: React.FC<WishlistModalProps> = ({ onSelectProduct }) => {
  const { wishlist, isWishlistOpen, setIsWishlistOpen, toggleWishlist, addToCart } = useCart();

  if (!isWishlistOpen) return null;

  const wishlistProducts = PRODUCTS.filter((p) => wishlist.includes(p.id));

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div
        className="absolute inset-0 bg-[#171411]/50 backdrop-blur-xs transition-opacity"
        onClick={() => setIsWishlistOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#fdf9f3] shadow-2xl flex flex-col">
          
          {/* Header */}
          <div className="p-5 border-b border-[#e6e2dc] flex items-center justify-between bg-white">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[20px] text-[#5c6149]">favorite</span>
              <h2 className="font-serif text-lg font-semibold text-[#171411]">
                Your Saved Pieces ({wishlistProducts.length})
              </h2>
            </div>
            <button
              onClick={() => setIsWishlistOpen(false)}
              className="w-8 h-8 rounded-full flex items-center justify-center text-[#7e756f] hover:text-[#171411] hover:bg-[#f1ede7] transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-lg">close</span>
            </button>
          </div>

          {/* Items List */}
          <div className="flex-1 overflow-y-auto p-5 divide-y divide-[#e6e2dc]">
            {wishlistProducts.length === 0 ? (
              <div className="text-center py-16 flex flex-col items-center">
                <span className="material-symbols-outlined text-5xl text-[#cfc4bd] mb-3">
                  favorite_border
                </span>
                <p className="font-serif text-lg text-[#171411] mb-1">No saved pieces yet</p>
                <p className="text-xs text-[#7e756f] max-w-xs mb-6">
                  Save your favorite abayas, co-ord sets, and silk hijabs for easy access anytime.
                </p>
              </div>
            ) : (
              wishlistProducts.map((p) => (
                <div key={p.id} className="py-4 first:pt-0 last:pb-0 flex gap-3.5">
                  <img
                    src={p.images.front}
                    alt={p.name}
                    className="w-20 h-26 rounded-lg object-cover bg-[#f1ede7] shrink-0 cursor-pointer"
                    onClick={() => {
                      setIsWishlistOpen(false);
                      onSelectProduct(p.id);
                    }}
                    referrerPolicy="no-referrer"
                  />
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <h4
                        className="font-serif text-sm font-semibold text-[#171411] hover:text-[#5c6149] transition-colors cursor-pointer"
                        onClick={() => {
                          setIsWishlistOpen(false);
                          onSelectProduct(p.id);
                        }}
                      >
                        {p.name}
                      </h4>
                      <p className="text-[11px] text-[#7e756f] mt-0.5">{p.fabric}</p>
                      <span className="font-serif text-sm font-semibold text-[#171411] block mt-1">
                        ${p.price.toFixed(2)}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 pt-2">
                      <button
                        onClick={() => {
                          addToCart(p);
                        }}
                        className="flex-1 bg-[#171411] hover:bg-[#2c2825] text-white py-1.5 px-3 rounded-full text-[11px] font-semibold flex items-center justify-center gap-1 transition-colors cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-sm">local_mall</span>
                        <span>Add to Bag</span>
                      </button>
                      <button
                        onClick={() => toggleWishlist(p.id)}
                        className="w-7 h-7 rounded-full bg-[#f1ede7] text-[#ba1a1a] flex items-center justify-center hover:bg-[#e6e2dc] transition-colors cursor-pointer"
                        title="Remove from Wishlist"
                      >
                        <span className="material-symbols-outlined text-sm">delete</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

        </div>
      </div>
    </div>
  );
};
