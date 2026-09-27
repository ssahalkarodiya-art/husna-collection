import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { PRODUCTS } from '../data/products';

interface SearchModalProps {
  onSelectProduct: (productId: string) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({ onSelectProduct }) => {
  const { isSearchOpen, setIsSearchOpen } = useCart();
  const [query, setQuery] = useState('');

  if (!isSearchOpen) return null;

  const filteredProducts = PRODUCTS.filter((p) => {
    const q = query.toLowerCase().trim();
    if (!q) return true;
    return (
      p.name.toLowerCase().includes(q) ||
      p.fabric.toLowerCase().includes(q) ||
      p.categoryLabel.toLowerCase().includes(q) ||
      p.subtitle.toLowerCase().includes(q)
    );
  });

  const popularSearches = ['Black Abaya', 'Silk Chiffon Hijab', 'Bamboo Bonnet Cap', 'Cashmere Beret', 'Linen Abaya', 'Turban Cap'];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#171411]/60 backdrop-blur-xs flex items-start justify-center pt-16 sm:pt-24 px-4">
      <div className="bg-[#fdf9f3] w-full max-w-2xl rounded-2xl shadow-2xl border border-[#e6e2dc] overflow-hidden relative flex flex-col">
        
        {/* Search Input Bar */}
        <div className="p-4 bg-white border-b border-[#e6e2dc] flex items-center gap-3">
          <span className="material-symbols-outlined text-xl text-[#5c6149]">search</span>
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search abayas, hijabs, modest caps, fabrics..."
            className="flex-1 bg-transparent text-sm text-[#171411] placeholder:text-[#7e756f] focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-xs text-[#7e756f] hover:text-[#171411] px-2 py-1"
            >
              Clear
            </button>
          )}
          <button
            onClick={() => setIsSearchOpen(false)}
            className="w-8 h-8 rounded-full flex items-center justify-center text-[#7e756f] hover:text-[#171411] hover:bg-[#f1ede7] transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-lg">close</span>
          </button>
        </div>

        {/* Quick Suggestion Pills */}
        <div className="p-4 bg-[#f7f3ed] border-b border-[#e6e2dc] flex items-center gap-2 flex-wrap">
          <span className="text-[11px] font-semibold text-[#7e756f] uppercase tracking-wider">
            Trending:
          </span>
          {popularSearches.map((term) => (
            <button
              key={term}
              onClick={() => setQuery(term)}
              className="text-xs bg-white hover:bg-[#dee3c4] hover:text-[#191d0a] text-[#4d4540] px-3 py-1 rounded-full border border-[#cfc4bd]/60 transition-colors cursor-pointer"
            >
              {term}
            </button>
          ))}
        </div>

        {/* Results List */}
        <div className="max-h-[60vh] overflow-y-auto p-4 divide-y divide-[#e6e2dc]">
          {filteredProducts.length === 0 ? (
            <div className="text-center py-12 text-[#7e756f]">
              <p className="font-serif text-sm text-[#171411]">No creations found</p>
              <p className="text-xs mt-1">Try searching for "Abaya", "Hijab", or "Cap"</p>
            </div>
          ) : (
            filteredProducts.map((p) => (
              <div
                key={p.id}
                onClick={() => {
                  setIsSearchOpen(false);
                  onSelectProduct(p.id);
                }}
                className="py-3 first:pt-0 last:pb-0 flex items-center gap-3.5 hover:bg-white p-2 rounded-xl transition-colors cursor-pointer"
              >
                <img
                  src={p.images.front}
                  alt={p.name}
                  className="w-14 h-18 rounded-lg object-cover bg-[#f1ede7] shrink-0"
                  referrerPolicy="no-referrer"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="font-serif text-sm font-semibold text-[#171411] truncate">{p.name}</h4>
                    {p.badge && (
                      <span className="bg-[#dee3c4] text-[#191d0a] text-[9px] font-bold px-1.5 py-0.5 rounded-full uppercase">
                        {p.badge}
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-[#7e756f] truncate">{p.fabric} • {p.subtitle}</p>
                </div>
                <div className="text-right">
                  <span className="font-serif text-sm font-semibold text-[#171411]">
                    ₹{p.price.toLocaleString('en-IN')}
                  </span>
                  <span className="material-symbols-outlined text-sm text-[#5c6149] block">
                    arrow_forward
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
};
