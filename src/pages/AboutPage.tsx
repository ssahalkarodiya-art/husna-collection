import React from 'react';
import { BRAND_INFO } from '../data/products';
import { HusnaLogo } from '../components/HusnaLogo';

interface AboutPageProps {
  onNavigate: (page: string) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onNavigate }) => {
  return (
    <div className="w-full bg-[#fdf9f3] min-h-screen">
      
      {/* Hero */}
      <section className="relative w-full bg-[#f7f3ed] py-14 sm:py-20 border-b border-[#e6e2dc]">
        <div className="max-w-[1380px] mx-auto px-4 sm:px-8 lg:px-16 text-center max-w-3xl mx-auto flex flex-col items-center">
          <div className="mb-4">
            <HusnaLogo size={64} showText={false} />
          </div>
          <span className="text-[10px] font-bold text-[#5c6149] uppercase tracking-[0.25em] mb-2">
            ATELIER HERITAGE & MISSION
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-semibold text-[#171411] tracking-tight leading-tight">
            Elevating Modesty as an Art Form
          </h1>
          <p className="text-xs sm:text-base text-[#4d4540] mt-4 leading-relaxed max-w-2xl">
            "Modesty is not about hiding, it is an enduring declaration of grace, presence, and timeless dignity."
          </p>
          <span className="font-cursive text-3xl text-[#5c6149] mt-2">
            Husna Collection ♥
          </span>
        </div>
      </section>

      {/* Narrative & Craftsmanship Section */}
      <section className="max-w-[1380px] mx-auto px-4 sm:px-8 lg:px-16 py-16 sm:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <div className="lg:col-span-6 flex flex-col gap-4 text-xs sm:text-sm text-[#4d4540] leading-relaxed">
            <span className="text-[10px] font-bold text-[#5c6149] uppercase tracking-widest">
              OUR FOUNDATION
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-[#171411] leading-tight">
              Bespoke Proportions for the Contemporary Muslimah
            </h2>
            <p>
              Husna Collection was born out of a desire for authentic, uncompromised modest luxury. For decades, discerning women had to choose between high-street garments requiring awkward layering or generic abayas lacking contemporary tailoring and tactile comfort.
            </p>
            <p>
              We set out to create a new paradigm: garments engineered from the fiber up to provide 100% opacity, breezy natural breathability, and generous architectural volume that moves with dignity.
            </p>
            <p>
              Every pattern is drafted in our atelier with strict adherence to modest standards — generous necklines, wudu-friendly cuff elasticity, deep discreet pockets, and length grading calibrated to personal vertical stature.
            </p>

            <div className="pt-2 flex items-center gap-4">
              <button
                onClick={() => onNavigate('shop')}
                className="bg-[#171411] hover:bg-[#2c2825] text-white px-7 py-3 rounded-full text-xs font-semibold shadow-xs cursor-pointer transition-colors"
              >
                Explore Creations
              </button>
              <button
                onClick={() => onNavigate('contact-us')}
                className="bg-white hover:bg-[#f1ede7] text-[#171411] border border-[#cfc4bd] px-6 py-3 rounded-full text-xs font-semibold cursor-pointer transition-colors"
              >
                Visit Our Ateliers
              </button>
            </div>
          </div>

          <div className="lg:col-span-6 relative">
            <div className="aspect-[4/5] rounded-3xl overflow-hidden bg-[#f1ede7] shadow-xl relative">
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuC3v8683-Fe02TNKiEDbYGnldpnKcRPCJK5rPR-nUOmllW2_0UjiNHUbMjXI_dfpzUeFdsqg34JHdFEE8EDGfrPtjmYnsUGFSdM0DQGVMrwVDvX8UHk6q6w6UD5SRFmFzLu9ygJXvFB7X1Eol_j1YKgjmF3tdbyatXArytpsHeGPtnfDNDym6fGfsSDa4Th9huvEaWUL1nULTzI8gMlx7g1x5895w50C11_7FcgY4Y9UI3SEQHN_fFH"
                alt="Master tailoring artisan inspecting organic linen drape"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute bottom-6 left-6 right-6 bg-white/95 backdrop-blur-md p-4 rounded-2xl shadow-md border border-[#e6e2dc] text-center">
                <span className="font-serif text-sm font-semibold text-[#171411] block">
                  Ethical Craftsmanship Guarantee
                </span>
                <span className="text-[11px] text-[#7e756f]">
                  Fair wages, zero mass-production waste, and carbon-neutral global delivery.
                </span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 3 Pillars of Husna */}
      <section className="w-full bg-white py-16 sm:py-20 border-y border-[#e6e2dc]">
        <div className="max-w-[1380px] mx-auto px-4 sm:px-8 lg:px-16">
          <div className="text-center max-w-xl mx-auto mb-12">
            <span className="text-[10px] font-bold text-[#5c6149] uppercase tracking-widest">
              OUR PILLARS
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-[#171411] mt-1">
              The Principles of Haute Modesty
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 bg-[#fdf9f3] rounded-2xl border border-[#e6e2dc] flex flex-col gap-3">
              <div className="w-12 h-12 rounded-xl bg-[#dee3c4] text-[#191d0a] flex items-center justify-center">
                <span className="material-symbols-outlined text-2xl">spa</span>
              </div>
              <h3 className="font-serif text-base font-semibold text-[#171411]">
                Noble Natural Fibers
              </h3>
              <p className="text-xs text-[#4d4540] leading-relaxed">
                We reject harsh synthetic polyesters in favor of European organic flax linen, Japanese matte crepes, and Mulberry silk blends that allow your skin to breathe in humid or desert climates.
              </p>
            </div>

            <div className="p-6 bg-[#fdf9f3] rounded-2xl border border-[#e6e2dc] flex flex-col gap-3">
              <div className="w-12 h-12 rounded-xl bg-[#dee3c4] text-[#191d0a] flex items-center justify-center">
                <span className="material-symbols-outlined text-2xl">straighten</span>
              </div>
              <h3 className="font-serif text-base font-semibold text-[#171411]">
                True Stature Proportions
              </h3>
              <p className="text-xs text-[#4d4540] leading-relaxed">
                Sizing calibrated by full vertical stature (lengths 50 to 60) ensures your garment hovers gracefully at the floor without dragging, clinging, or exposing ankles.
              </p>
            </div>

            <div className="p-6 bg-[#fdf9f3] rounded-2xl border border-[#e6e2dc] flex flex-col gap-3">
              <div className="w-12 h-12 rounded-xl bg-[#dee3c4] text-[#191d0a] flex items-center justify-center">
                <span className="material-symbols-outlined text-2xl">support_agent</span>
              </div>
              <h3 className="font-serif text-base font-semibold text-[#171411]">
                Personal Atelier Concierge
              </h3>
              <p className="text-xs text-[#4d4540] leading-relaxed">
                Every client has direct access to our Dubai & London stylists via WhatsApp for bespoke sleeve shortening, abaya hem alterations, and personalized styling advice.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Atelier Locations Section */}
      <section className="max-w-[1380px] mx-auto px-4 sm:px-8 lg:px-16 py-16 sm:py-20">
        <div className="text-center max-w-xl mx-auto mb-10">
          <span className="text-[10px] font-bold text-[#5c6149] uppercase tracking-widest">
            OUR SHOWROOMS
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-[#171411] mt-1">
            Private Atelier Appointments
          </h2>
          <p className="text-xs text-[#7e756f] mt-2">
            Experience our fabrics in person or arrange bespoke bridal fittings in our private salons.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {BRAND_INFO.ateliers.map((atelier) => (
            <div key={atelier.city} className="bg-white p-6 sm:p-8 rounded-2xl border border-[#e6e2dc] shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-serif text-xl font-semibold text-[#171411]">
                    {atelier.city} Salon & Atelier
                  </h3>
                  <span className="text-[10px] bg-[#dee3c4] text-[#191d0a] font-bold px-2 py-0.5 rounded-full uppercase">
                    By Appointment
                  </span>
                </div>
                <p className="text-xs text-[#7e756f] mb-4">
                  {atelier.location}
                </p>
                <div className="flex flex-col gap-1.5 text-xs text-[#4d4540] mb-6">
                  <p><strong>Hours:</strong> Tuesday – Sunday, 10:00 AM – 8:00 PM</p>
                  <p><strong>Phone:</strong> {BRAND_INFO.phone}</p>
                  <p><strong>Email:</strong> {BRAND_INFO.email}</p>
                </div>
              </div>

              <a
                href={`https://wa.me/?text=Hello%20Husna%20Collection%2C%20I%20would%20like%20to%20book%20a%20private%20atelier%20appointment%20in%20${atelier.city}.`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-[#171411] hover:bg-[#2c2825] text-white py-2.5 rounded-full text-xs font-semibold text-center transition-colors shadow-xs"
              >
                Book VIP Fitting on WhatsApp
              </a>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
};
