import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { BRAND_INFO } from '../data/products';
import { HusnaLogo } from './HusnaLogo';

interface HeaderProps {
  currentPage: string;
  onNavigate: (page: string, productId?: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ currentPage, onNavigate }) => {
  const { cart, wishlist, setIsSearchOpen, setIsWishlistOpen, setIsCartDrawerOpen } = useCart();
  const { user, profile, isConfigured, setIsAuthModalOpen, setIsConfigModalOpen } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const wishlistCount = wishlist.length;

  const navLinks = [
    { id: 'home', label: 'Home' },
    { id: 'new-arrivals', label: 'New Arrivals' },
    { id: 'shop', label: 'Shop' },
    { id: 'collections', label: 'Collections' },
    { id: 'about-us', label: 'About Us' },
    { id: 'blog', label: 'Blog' },
    { id: 'contact-us', label: 'Contact Us' },
  ];

  const handleNavClick = (pageId: string) => {
    onNavigate(pageId);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 w-full shadow-[0_2px_12px_rgba(44,40,37,0.06)] bg-[#fdf9f3]">
      {/* Top Announcement Bar with Supabase Backend Status */}
      <div className="w-full bg-[#2c2825] text-[#fdf9f3] px-4 sm:px-8 lg:px-16 py-1.5 flex items-center justify-between text-[11px] font-semibold tracking-widest uppercase text-center">
        <div className="hidden md:flex items-center gap-2 text-[#e6e2dc]">
          <span className="material-symbols-outlined text-sm">local_shipping</span>
          <span>Complimentary Express Shipping on Orders Over $150</span>
        </div>
        
        <div className="w-full md:w-auto text-center flex-1 md:flex-none">
          <span className="tracking-wider">
            NEW LUXURY EID COLLECTION • CODE:{' '}
            <button
              onClick={() => navigator.clipboard.writeText('HUSNA20')}
              className="underline font-bold text-amber-200 hover:text-white transition-colors cursor-pointer"
              title="Copy Code"
            >
              HUSNA20
            </button>{' '}
            FOR 20% OFF
          </span>
        </div>

        <div className="hidden lg:flex items-center gap-3 text-[#e6e2dc]">
          {/* Supabase Status Button */}
          <button
            onClick={() => setIsConfigModalOpen(true)}
            className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/10 hover:bg-white/20 text-[10px] tracking-normal lowercase font-mono transition-colors cursor-pointer border border-white/15"
            title="Configure Supabase Database & Auth"
          >
            <span
              className={`w-2 h-2 rounded-full ${
                isConfigured ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'
              }`}
            />
            <span className="capitalize font-sans font-semibold text-[10px]">
              {isConfigured ? 'Supabase Connected' : 'Connect Supabase'}
            </span>
          </button>

          <span className="opacity-40">|</span>

          <button 
            onClick={() => handleNavClick('contact-us')}
            className="hover:text-white transition-colors flex items-center gap-1 cursor-pointer"
          >
            <span className="material-symbols-outlined text-sm">support_agent</span>
            <span>Concierge</span>
          </button>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="h-20 w-full bg-[#ffffff]/95 backdrop-blur-md border-b border-[#e6e2dc]/60">
        <div className="max-w-[1380px] h-full mx-auto px-4 sm:px-8 lg:px-16 flex items-center justify-between gap-4">
          
          {/* Logo & Brand Identity */}
          <div className="flex items-center gap-3">
            <button 
              onClick={() => handleNavClick('home')}
              className="group cursor-pointer text-left focus:outline-none"
            >
              <HusnaLogo size={46} showText={true} />
            </button>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden xl:flex items-center gap-5 lg:gap-7">
            {navLinks.map((link) => {
              const isActive = currentPage === link.id || (link.id === 'shop' && currentPage === 'product');
              return (
                <button
                  key={link.id}
                  onClick={() => handleNavClick(link.id)}
                  className={`text-[13px] transition-all cursor-pointer py-1.5 px-3 rounded-full ${
                    isActive
                      ? 'bg-[#dee3c4] text-[#191d0a] font-semibold shadow-xs'
                      : 'text-[#4d4540] hover:text-[#171411] font-medium hover:bg-[#f1ede7]/60'
                  }`}
                >
                  {link.label}
                </button>
              );
            })}
          </nav>

          {/* Right Action Icons & Direct WhatsApp */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Search */}
            <button
              onClick={() => setIsSearchOpen(true)}
              aria-label="Search Catalog"
              className="w-10 h-10 rounded-full flex items-center justify-center text-[#4d4540] hover:text-[#171411] hover:bg-[#f1ede7] transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-[20px]">search</span>
            </button>

            {/* Account / Sign In */}
            {user ? (
              <button
                onClick={() => handleNavClick('account')}
                aria-label="Customer Account"
                className="w-10 h-10 rounded-full flex items-center justify-center text-[#4d4540] hover:text-[#171411] hover:bg-[#f1ede7] transition-colors cursor-pointer"
                title={`Logged in as ${profile?.fullName || user.email}`}
              >
                <span className="material-symbols-outlined text-[20px]">person</span>
              </button>
            ) : (
              <button
                onClick={() => setIsAuthModalOpen(true)}
                className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold text-[#171411] hover:text-[#5c6149] px-2.5 py-1 rounded-full border border-[#d8d2c8] hover:border-[#5c6149] transition-all cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px]">lock</span>
                <span>Sign In</span>
              </button>
            )}

            {/* Wishlist */}
            <button
              onClick={() => setIsWishlistOpen(true)}
              aria-label="Wishlist"
              className="relative w-10 h-10 rounded-full flex items-center justify-center text-[#4d4540] hover:text-[#171411] hover:bg-[#f1ede7] transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-[20px]">favorite</span>
              {wishlistCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-[#5c6149] text-white text-[9px] font-bold flex items-center justify-center leading-none">
                  {wishlistCount}
                </span>
              )}
            </button>

            {/* Cart */}
            <button
              onClick={() => {
                if (currentPage === 'cart') {
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                } else {
                  setIsCartDrawerOpen(true);
                }
              }}
              aria-label="Cart"
              className="relative w-10 h-10 rounded-full flex items-center justify-center text-[#4d4540] hover:text-[#171411] hover:bg-[#f1ede7] transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-[20px]">local_mall</span>
              {cartCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-[#171411] text-white text-[9px] font-bold flex items-center justify-center leading-none">
                  {cartCount}
                </span>
              )}
            </button>

            <div className="h-5 w-[1px] bg-[#cfc4bd] hidden sm:block mx-1"></div>

            {/* Direct WhatsApp Ordering */}
            <a
              href="https://wa.me/"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-1.5 bg-[#5c6149] hover:bg-[#171411] text-white px-3.5 py-1.5 rounded-full text-[12px] font-semibold transition-all shadow-xs"
            >
              <span className="material-symbols-outlined text-[16px]">chat</span>
              <span>WhatsApp</span>
            </a>

            {/* Profile Avatar */}
            <button
              onClick={() => {
                if (user) {
                  handleNavClick('account');
                } else {
                  setIsAuthModalOpen(true);
                }
              }}
              className="flex items-center ml-1 focus:outline-none cursor-pointer"
              title={profile ? `${profile.fullName} (${profile.tier})` : 'Atelier Member Sign In'}
            >
              <img
                src={profile?.avatarUrl || BRAND_INFO.avatarUrl}
                alt="Profile Avatar"
                className="w-8 h-8 rounded-full object-cover ring-2 ring-[#cfc4bd] hover:ring-[#5c6149] transition-all"
                referrerPolicy="no-referrer"
              />
            </button>

            {/* Mobile Hamburger Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="xl:hidden w-10 h-10 rounded-full flex items-center justify-center text-[#171411] hover:bg-[#f1ede7] transition-colors cursor-pointer ml-1"
              aria-label="Toggle navigation menu"
            >
              <span className="material-symbols-outlined text-[24px]">
                {mobileMenuOpen ? 'close' : 'menu'}
              </span>
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="xl:hidden bg-[#ffffff] border-b border-[#e6e2dc] shadow-lg px-6 py-4 flex flex-col gap-3 animate-in slide-in-from-top duration-200">
            {navLinks.map((link) => {
              const isActive = currentPage === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => handleNavClick(link.id)}
                  className={`text-left text-sm py-2 px-3 rounded-lg transition-colors flex items-center justify-between ${
                    isActive
                      ? 'bg-[#dee3c4] text-[#191d0a] font-semibold'
                      : 'text-[#4d4540] hover:bg-[#f1ede7]'
                  }`}
                >
                  <span>{link.label}</span>
                  <span className="material-symbols-outlined text-xs">arrow_forward</span>
                </button>
              );
            })}

            <div className="pt-2 border-t border-[#e6e2dc] flex flex-col gap-2">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setIsConfigModalOpen(true);
                }}
                className="w-full text-left text-xs py-2 px-3 rounded-lg bg-[#f1ede7] text-[#171411] font-semibold flex items-center justify-between"
              >
                <span className="flex items-center gap-2">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      isConfigured ? 'bg-emerald-500' : 'bg-amber-500'
                    }`}
                  />
                  <span>Supabase: {isConfigured ? 'Connected' : 'Configure Backend'}</span>
                </span>
                <span className="material-symbols-outlined text-xs">settings</span>
              </button>

              <div className="flex items-center justify-between pt-1">
                <a
                  href="https://wa.me/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-[#5c6149] text-white px-4 py-2 rounded-full text-xs font-semibold"
                >
                  <span className="material-symbols-outlined text-sm">chat</span>
                  <span>WhatsApp Stylist</span>
                </a>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onNavigate('cart');
                  }}
                  className="text-xs font-semibold text-[#171411] underline"
                >
                  View Bag ({cartCount})
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
