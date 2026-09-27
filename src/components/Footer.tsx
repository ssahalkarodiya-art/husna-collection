import React, { useState } from 'react';
import { BRAND_INFO } from '../data/products';
import { useCart } from '../context/CartContext';
import { HusnaLogo } from './HusnaLogo';

interface FooterProps {
  onNavigate: (page: string, categoryFilter?: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const { showToast } = useCart();

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      showToast('Welcome to Atelier Husna', 'You have been enrolled in exclusive preview invitations.');
      setEmail('');
    }
  };

  const handleLink = (page: string, cat?: string) => {
    onNavigate(page, cat);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="w-full bg-[#171411] text-[#e6e2dc]">
      <div className="max-w-[1380px] mx-auto px-4 sm:px-8 lg:px-16 pt-16 pb-10">
        
        {/* Main 4-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-14 border-b border-[#e6e2dc]/15">
          
          {/* Brand Info (2 cols on large) */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <HusnaLogo size={52} showText={false} />
              <div className="flex flex-col">
                <span className="font-serif text-[18px] font-semibold text-white tracking-tight leading-none">
                  HUSNA ABAYA
                </span>
                <span className="text-[10px] tracking-[0.25em] text-[#c4c9ac] font-medium uppercase mt-1">
                  HAUTE MODESTY &bull; ATELIER
                </span>
              </div>
            </div>

            <p className="text-[14px] text-[#e6e2dc] font-medium">
              Faith. Fashion. A Brighter You. ♥
            </p>

            <p className="text-[13px] text-[#cfc4bd] max-w-sm leading-relaxed">
              Refining modest couture with soft earth tones, organic drapes, and timeless silhouettes curated for the contemporary, dignified soul.
            </p>

            {/* Social Icons */}
            <div className="flex items-center gap-2 pt-2">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
              >
                <span className="material-symbols-outlined text-[18px]">photo_camera</span>
              </a>
              <a
                href="https://pinterest.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Pinterest"
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
              >
                <span className="material-symbols-outlined text-[18px]">interests</span>
              </a>
              <a
                href="https://tiktok.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="TikTok"
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
              >
                <span className="material-symbols-outlined text-[18px]">play_arrow</span>
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
              >
                <span className="material-symbols-outlined text-[18px]">share</span>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col gap-3">
            <span className="font-serif text-[18px] text-white tracking-wide font-medium">
              Quick Links
            </span>
            <ul className="flex flex-col gap-2.5 text-[13px] text-[#e6e2dc]/80">
              <li>
                <button
                  onClick={() => handleLink('new-arrivals')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  New Arrivals
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleLink('shop', 'abayas')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Luxury Abayas & Kaftans
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleLink('shop', 'hijabs')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Silk & Chiffon Hijabs
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleLink('shop', 'caps')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Modest Caps & Bonnets
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleLink('collections')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Lookbook 2026
                </button>
              </li>
            </ul>
          </div>

          {/* Customer Care */}
          <div className="flex flex-col gap-3">
            <span className="font-serif text-[18px] text-white tracking-wide font-medium">
              Customer Care
            </span>
            <ul className="flex flex-col gap-2.5 text-[13px] text-[#e6e2dc]/80">
              <li>
                <button
                  onClick={() => handleLink('contact-us')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Shipping & Delivery
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleLink('contact-us')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Returns & Exchanges
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleLink('contact-us')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Size & Fit Guide
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleLink('blog')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Fabric Care Manual
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleLink('contact-us')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  FAQs & Help Desk
                </button>
              </li>
            </ul>
          </div>

          {/* Concierge & Contact Us */}
          <div className="flex flex-col gap-3">
            <span className="font-serif text-[18px] text-white tracking-wide font-medium">
              Contact Us
            </span>
            <div className="flex flex-col gap-2.5 text-[12px] text-[#e6e2dc]/85">
              <div className="flex items-start gap-2">
                <span className="material-symbols-outlined text-[16px] text-[#c4c9ac] shrink-0 mt-0.5">
                  storefront
                </span>
                <div className="flex flex-col leading-snug">
                  <span className="text-white font-medium">Husna Collection</span>
                  <span className="text-[#cfc4bd]">Shop G-14, G-15, Jasat Plaza, Opp. I.T.I.</span>
                  <span className="text-[#cfc4bd]">Station Road, Ankleshwar – 393001</span>
                  <span className="text-[#cfc4bd]">Gujarat, India</span>
                </div>
              </div>

              <p className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[16px] text-[#c4c9ac] shrink-0">
                  mail
                </span>
                <a
                  href={`mailto:${BRAND_INFO.email}`}
                  className="hover:text-white transition-colors underline-offset-2 hover:underline"
                >
                  {BRAND_INFO.email}
                </a>
              </p>

              <p className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[16px] text-[#c4c9ac] shrink-0">
                  call
                </span>
                <a
                  href="tel:+917227972655"
                  className="hover:text-white transition-colors"
                >
                  Phone/WhatsApp: {BRAND_INFO.phone}
                </a>
              </p>

              {/* Direct WhatsApp Concierge Button */}
              <a
                href="https://wa.me/917227972655?text=Hello%20Husna%20Collection%2C%20I%20would%20like%20to%20connect%20with%20your%20team."
                target="_blank"
                rel="noopener noreferrer"
                className="mt-1 inline-flex items-center justify-center gap-2 px-3.5 py-2 rounded-full bg-[#25d366] hover:bg-[#20ba5a] text-[#0b2816] text-[12px] font-semibold transition-all shadow-xs"
              >
                <span className="material-symbols-outlined text-[16px]">chat</span>
                <span>Chat on WhatsApp</span>
              </a>
            </div>

            {/* Newsletter Atelier */}
            <div className="mt-3">
              <span className="text-[11px] font-semibold text-[#c4c9ac] tracking-wider uppercase block mb-1.5">
                Newsletter Atelier
              </span>
              <form onSubmit={handleSubscribe} className="flex items-center bg-white/10 rounded-full p-1 border border-white/20">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email address"
                  className="bg-transparent text-white placeholder:text-[#7e756f] text-xs px-3 py-1 flex-1 focus:outline-none"
                />
                <button
                  type="submit"
                  aria-label="Subscribe to newsletter"
                  className="w-7 h-7 rounded-full bg-[#dee3c4] text-[#191d0a] flex items-center justify-center hover:bg-white transition-colors cursor-pointer"
                >
                  <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </button>
              </form>
              {subscribed && (
                <span className="text-[10px] text-[#dee3c4] mt-1 block">✓ Thank you for subscribing!</span>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Bar with Cursive Flourish */}
        <div className="pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
          <div className="font-cursive text-2xl text-[#c4c9ac]">
            Modest Fashion Brighter Tomorrow ♥
          </div>
          <div className="text-[12px] text-[#cfc4bd]">
            © 2026 Husna Collection. All Rights Reserved. Designed with ♥ for every modest woman.
          </div>
        </div>

      </div>
    </footer>
  );
};
