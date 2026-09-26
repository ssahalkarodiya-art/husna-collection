import React, { useState } from 'react';
import { BRAND_INFO } from '../data/products';
import { useCart } from '../context/CartContext';

export const ContactPage: React.FC = () => {
  const { showToast } = useCart();
  const [submitted, setSubmitted] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    city: 'Dubai',
    service: 'Bespoke Abaya Tailoring Consultation',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    showToast('Inquiry Received', 'Our concierge team will respond within 4 business hours.');
  };

  const faqs = [
    {
      q: 'How does abaya sizing work across different stature heights?',
      a: 'Standard abaya sizing is defined by vertical length in inches from shoulder crest to floor hem (52, 54, 56, 58, 60). We recommend selecting based on your barefoot height plus your preferred heel height. All designs feature relaxed modest drape through bust and hips.',
    },
    {
      q: 'Are your fabrics genuinely 100% opaque without inner slips?',
      a: 'Yes. Our Korean Nida, Japanese heavy crepes, and pre-washed organic linen are certified 100% opaque in daylight. For ultra-fine pastel open abayas, we also offer matching bamboo anti-static slip dresses.',
    },
    {
      q: 'How does the free global express shipping threshold work?',
      a: 'All orders over $150 automatically qualify for Free Express DHL/FedEx Courier shipping worldwide (typically 3–5 business days to UK, GCC, USA, and Europe). Orders over $100 also receive a complimentary Silk Chiffon Hijab ($18 value).',
    },
    {
      q: 'Can I request custom sleeve shortening or hem adjustments?',
      a: 'Absolutely. We offer complimentary hem adjustments and custom sleeve width alterations. Simply leave a note at checkout or send your order confirmation to our WhatsApp concierge team before dispatch.',
    },
    {
      q: 'What is your return and exchange policy?',
      a: 'We offer 14-day hassle-free exchanges with complimentary home courier pickup in the UAE, KSA, Qatar, and the UK. Garments must be unworn with original atelier security tags attached.',
    },
  ];

  return (
    <div className="w-full bg-[#fdf9f3] min-h-screen">
      
      {/* Header */}
      <section className="max-w-[1380px] mx-auto px-4 sm:px-8 lg:px-16 pt-8 pb-10 text-center max-w-2xl mx-auto flex flex-col items-center">
        <span className="text-[10px] font-bold text-[#5c6149] uppercase tracking-widest mb-1">
          ATELIER CONCIERGE & APPOINTMENTS
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-semibold text-[#171411] tracking-tight">
          We Are Here to Assist You
        </h1>
        <p className="text-xs sm:text-sm text-[#4d4540] mt-2 leading-relaxed">
          Book private showroom styling, inquire about bespoke hem tailoring, or connect directly with our stylists on WhatsApp.
        </p>
      </section>

      {/* Main 2-Column: Form + Contact Cards */}
      <section className="max-w-[1380px] mx-auto px-4 sm:px-8 lg:px-16 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Left: Contact & Appointment Form (7 cols) */}
          <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-3xl border border-[#e6e2dc] shadow-xs">
            <h2 className="font-serif text-xl font-semibold text-[#171411] mb-2">
              Book a Consultation or Message the Concierge
            </h2>
            <p className="text-xs text-[#7e756f] mb-6">
              Fill in your details below and our team will get in touch via email or WhatsApp.
            </p>

            {submitted ? (
              <div className="text-center py-10 bg-[#f7f3ed] rounded-2xl p-6 border border-[#dee3c4]">
                <span className="material-symbols-outlined text-4xl text-[#5c6149] mb-2">check_circle</span>
                <h3 className="font-serif text-lg font-semibold text-[#171411] mb-1">Inquiry Dispatched</h3>
                <p className="text-xs text-[#4d4540] max-w-md mx-auto mb-4">
                  Thank you, {formData.name}. Our styling director will review your notes and reach out shortly.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="text-xs font-semibold text-[#5c6149] underline cursor-pointer"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-[#171411] block mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="E.g. Maryam Al-Maktoum"
                      className="w-full bg-[#fdf9f3] border border-[#cfc4bd] rounded-xl px-3 py-2.5 text-xs text-[#171411] focus:outline-none focus:border-[#171411]"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-[#171411] block mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="maryam@example.com"
                      className="w-full bg-[#fdf9f3] border border-[#cfc4bd] rounded-xl px-3 py-2.5 text-xs text-[#171411] focus:outline-none focus:border-[#171411]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-[#171411] block mb-1">
                      Phone / WhatsApp Number
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+971 50 123 4567"
                      className="w-full bg-[#fdf9f3] border border-[#cfc4bd] rounded-xl px-3 py-2.5 text-xs text-[#171411] focus:outline-none focus:border-[#171411]"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-[#171411] block mb-1">
                      Preferred Atelier City
                    </label>
                    <select
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      className="w-full bg-[#fdf9f3] border border-[#cfc4bd] rounded-xl px-3 py-2.5 text-xs text-[#171411] focus:outline-none focus:border-[#171411]"
                    >
                      <option value="Dubai">Dubai Atelier (5th Ave Couture District)</option>
                      <option value="London">London Salon (Mayfair Haute Atelier)</option>
                      <option value="Online">Online Styling via WhatsApp / Video Call</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-[#171411] block mb-1">
                    Service Requested
                  </label>
                  <select
                    value={formData.service}
                    onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                    className="w-full bg-[#fdf9f3] border border-[#cfc4bd] rounded-xl px-3 py-2.5 text-xs text-[#171411] focus:outline-none focus:border-[#171411]"
                  >
                    <option value="Bespoke Abaya Tailoring Consultation">Bespoke Abaya Tailoring Consultation</option>
                    <option value="Private Showroom Appointment">Private Showroom Appointment</option>
                    <option value="Bridal Couture Modest Fitting">Bridal Couture Modest Fitting</option>
                    <option value="International Order Sizing Assistance">International Order Sizing Assistance</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-[#171411] block mb-1">
                    Notes & Questions
                  </label>
                  <textarea
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Tell us about your height, upcoming occasion, or specific piece in mind..."
                    className="w-full bg-[#fdf9f3] border border-[#cfc4bd] rounded-xl px-3 py-2.5 text-xs text-[#171411] focus:outline-none focus:border-[#171411]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#171411] hover:bg-[#2c2825] text-white py-3 rounded-full text-xs font-semibold tracking-wide transition-colors shadow-xs cursor-pointer"
                >
                  Send Inquiry to Atelier
                </button>
              </form>
            )}
          </div>

          {/* Right: Direct Concierge & Showrooms (5 cols) */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            
            {/* VIP WhatsApp Stylist Box */}
            <div className="bg-[#5c6149] text-white p-6 rounded-3xl shadow-sm flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#dee3c4] text-[#191d0a] flex items-center justify-center">
                  <span className="material-symbols-outlined text-xl">chat</span>
                </div>
                <div>
                  <h3 className="font-serif text-lg font-semibold text-white">
                    Instant WhatsApp Concierge
                  </h3>
                  <span className="text-[10px] text-[#dee3c4] uppercase font-bold tracking-wider">
                    Average response: 5 mins
                  </span>
                </div>
              </div>

              <p className="text-xs text-[#c4c9ac] leading-relaxed">
                Connect with our certified stylists in Dubai and London for real-time video fabric previews, custom hem measurements, and order tracking.
              </p>

              <a
                href="https://wa.me/?text=Hello%20Husna%20Collection%20Concierge%2C%20I%20would%20like%20to%20speak%20with%20a%20personal%20stylist."
                target="_blank"
                rel="noopener noreferrer"
                className="mt-1 bg-white hover:bg-[#f1ede7] text-[#171411] py-2.5 px-4 rounded-full text-xs font-semibold flex items-center justify-center gap-2 transition-colors shadow-xs"
              >
                <span className="material-symbols-outlined text-[#25d366] text-base">chat</span>
                <span>Open WhatsApp Live Chat</span>
              </a>
            </div>

            {/* Direct Contact Info */}
            <div className="bg-white p-6 rounded-3xl border border-[#e6e2dc] shadow-xs flex flex-col gap-3 text-xs text-[#4d4540]">
              <h4 className="font-serif text-sm font-semibold text-[#171411]">
                Atelier Communications
              </h4>
              <p className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#5c6149] text-base">call</span>
                <a href="tel:+97148209000" className="hover:text-[#171411]">{BRAND_INFO.phone}</a>
              </p>
              <p className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#5c6149] text-base">mail</span>
                <a href={`mailto:${BRAND_INFO.email}`} className="hover:text-[#171411]">{BRAND_INFO.email}</a>
              </p>
              <p className="flex items-start gap-2 pt-1 border-t border-[#f1ede7]">
                <span className="material-symbols-outlined text-[#5c6149] text-base shrink-0 mt-0.5">location_on</span>
                <span>5th Avenue Couture District, Jumeirah, Dubai, UAE & Mayfair, London, UK</span>
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* Frequently Asked Questions */}
      <section className="w-full bg-white py-16 sm:py-20 border-t border-[#e6e2dc]">
        <div className="max-w-[1000px] mx-auto px-4 sm:px-8">
          <div className="text-center mb-10">
            <span className="text-[10px] font-bold text-[#5c6149] uppercase tracking-widest">
              FREQUENTLY ASKED QUESTIONS
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-[#171411] mt-1">
              Everything You Need to Know
            </h2>
          </div>

          <div className="flex flex-col gap-3">
            {faqs.map((faq, i) => (
              <div key={i} className="p-4 sm:p-5 bg-[#fdf9f3] rounded-2xl border border-[#e6e2dc] shadow-xs">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between text-left cursor-pointer"
                >
                  <span className="font-serif text-sm font-semibold text-[#171411]">
                    {faq.q}
                  </span>
                  <span className={`material-symbols-outlined text-lg text-[#5c6149] transition-transform duration-300 ${openFaq === i ? 'rotate-180' : ''}`}>
                    expand_more
                  </span>
                </button>
                {openFaq === i && (
                  <p className="mt-3 pt-3 border-t border-[#e6e2dc] text-xs text-[#4d4540] leading-relaxed animate-in fade-in duration-200">
                    {faq.a}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
};
