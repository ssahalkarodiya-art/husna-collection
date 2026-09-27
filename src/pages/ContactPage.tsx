import React, { useState } from 'react';
import { BRAND_INFO } from '../data/products';
import { useCart } from '../context/CartContext';

export const ContactPage: React.FC = () => {
  const { showToast } = useCart();
  const [submitted, setSubmitted] = useState(false);
  const [copied, setCopied] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    city: 'Ankleshwar (Flagship)',
    service: 'Modest Couture & Abaya Inquiry',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    showToast('Inquiry Received', 'Our concierge team will respond within 4 business hours.');
  };

  const handleCopyAddress = () => {
    const fullAddr = `Husna Collection\nShop G-14, G-15, Jasat Plaza, Opp. I.T.I.\nStation Road, Ankleshwar – 393001\nGujarat, India`;
    navigator.clipboard.writeText(fullAddr);
    setCopied(true);
    showToast('Address Copied', 'Store address copied to clipboard.');
    setTimeout(() => setCopied(false), 3000);
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
      q: 'Can I visit the store directly in Ankleshwar, Gujarat?',
      a: 'Yes! Walk-ins are always warmly welcomed at our flagship boutique: Husna Collection, Shop G-14, G-15, Jasat Plaza, Opp. I.T.I., Station Road, Ankleshwar – 393001, Gujarat. You can also chat with us beforehand on WhatsApp (+91 7227972655) to confirm product availability.',
    },
    {
      q: 'How does the free express shipping threshold work?',
      a: 'All orders over ₹4,999 automatically qualify for Free Express Courier shipping (typically 2–4 business days across India). Orders over ₹6,999 also receive a complimentary Silk Chiffon Hijab (₹1,499 value).',
    },
    {
      q: 'Can I request custom sleeve shortening or hem adjustments?',
      a: 'Absolutely. We offer complimentary hem adjustments and custom sleeve width alterations. Simply leave a note at checkout or send your order confirmation to our WhatsApp (+91 7227972655) concierge team before dispatch.',
    },
    {
      q: 'What is your return and exchange policy?',
      a: 'We offer 14-day hassle-free exchanges with easy courier pickup. Garments must be unworn with original atelier security tags attached.',
    },
  ];

  return (
    <div className="w-full bg-[#fdf9f3] min-h-screen">
      
      {/* Header */}
      <section className="max-w-[1380px] mx-auto px-4 sm:px-8 lg:px-16 pt-8 pb-10 text-center max-w-2xl mx-auto flex flex-col items-center">
        <span className="text-[10px] font-bold text-[#5c6149] uppercase tracking-widest mb-1">
          HUSNA COLLECTION &bull; CONCIERGE & STORE
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-semibold text-[#171411] tracking-tight">
          Contact Us
        </h1>
        <p className="text-xs sm:text-sm text-[#4d4540] mt-2 leading-relaxed max-w-xl">
          Visit our flagship store in Ankleshwar, Gujarat, order bespoke tailoring, or connect directly with our stylists on WhatsApp and phone.
        </p>
      </section>

      {/* Main 2-Column: Form + Contact Cards */}
      <section className="max-w-[1380px] mx-auto px-4 sm:px-8 lg:px-16 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Left: Contact & Appointment Form (7 cols) */}
          <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-3xl border border-[#e6e2dc] shadow-xs">
            <h2 className="font-serif text-xl font-semibold text-[#171411] mb-2">
              Send Us a Message
            </h2>
            <p className="text-xs text-[#7e756f] mb-6">
              Fill in your inquiry below or reach us directly at <a href={`mailto:${BRAND_INFO.email}`} className="text-[#5c6149] font-medium underline">{BRAND_INFO.email}</a>.
            </p>

            {submitted ? (
              <div className="text-center py-10 bg-[#f7f3ed] rounded-2xl p-6 border border-[#dee3c4]">
                <span className="material-symbols-outlined text-4xl text-[#5c6149] mb-2">check_circle</span>
                <h3 className="font-serif text-lg font-semibold text-[#171411] mb-1">Inquiry Dispatched</h3>
                <p className="text-xs text-[#4d4540] max-w-md mx-auto mb-4">
                  Thank you, {formData.name}. Our styling team will review your notes and reach out shortly via email or WhatsApp.
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
                      placeholder="E.g. Ayesha Patel"
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
                      placeholder="you@example.com"
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
                      placeholder="+91 72279 72655"
                      className="w-full bg-[#fdf9f3] border border-[#cfc4bd] rounded-xl px-3 py-2.5 text-xs text-[#171411] focus:outline-none focus:border-[#171411]"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-[#171411] block mb-1">
                      Location / Preferred Contact
                    </label>
                    <select
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      className="w-full bg-[#fdf9f3] border border-[#cfc4bd] rounded-xl px-3 py-2.5 text-xs text-[#171411] focus:outline-none focus:border-[#171411]"
                    >
                      <option value="Ankleshwar (Flagship)">Ankleshwar Flagship Store (Gujarat)</option>
                      <option value="WhatsApp Online">Online Ordering via WhatsApp (+91 7227972655)</option>
                      <option value="Pan India Delivery">Pan-India Courier & Delivery</option>
                      <option value="International">International Inquiry</option>
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
                    <option value="Modest Couture & Abaya Inquiry">Modest Couture & Abaya Inquiry</option>
                    <option value="Store Visit & Try-On">Store Visit & Try-On</option>
                    <option value="Bespoke Sizing & Hem Tailoring">Bespoke Sizing & Hem Tailoring</option>
                    <option value="Hijab & Cap Wholesale/Bulk Inquiry">Hijab & Cap Wholesale/Bulk Inquiry</option>
                    <option value="Order Tracking & Support">Order Tracking & Support</option>
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
                    placeholder="Tell us about the design, size, color, or specific questions you have..."
                    className="w-full bg-[#fdf9f3] border border-[#cfc4bd] rounded-xl px-3 py-2.5 text-xs text-[#171411] focus:outline-none focus:border-[#171411]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#171411] hover:bg-[#2c2825] text-white py-3 rounded-full text-xs font-semibold tracking-wide transition-colors shadow-xs cursor-pointer flex items-center justify-center gap-2"
                >
                  <span className="material-symbols-outlined text-base">send</span>
                  <span>Send Inquiry to Husna Collection</span>
                </button>
              </form>
            )}
          </div>

          {/* Right: Direct Concierge & Store Details (5 cols) */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            
            {/* VIP WhatsApp Stylist Box */}
            <div className="bg-[#25d366]/15 border-2 border-[#25d366]/40 text-[#171411] p-6 rounded-3xl shadow-sm flex flex-col gap-3 relative overflow-hidden">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-[#25d366] text-white flex items-center justify-center shadow-sm shrink-0">
                  <span className="material-symbols-outlined text-2xl">chat</span>
                </div>
                <div>
                  <h3 className="font-serif text-lg font-bold text-[#171411]">
                    Instant WhatsApp Concierge
                  </h3>
                  <span className="text-[11px] text-[#0f5c2a] font-semibold flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-[#25d366] animate-pulse"></span>
                    <span>Online &bull; Number: +91 7227972655</span>
                  </span>
                </div>
              </div>

              <p className="text-xs text-[#35302c] leading-relaxed">
                Connect directly with our team on WhatsApp for instant product photos, fabric video previews, size confirmation, and rapid doorstep delivery.
              </p>

              <a
                href="https://wa.me/917227972655?text=Hello%20Husna%20Collection%2C%20I%20would%20like%20to%20inquire%20about%20your%20collection."
                target="_blank"
                rel="noopener noreferrer"
                className="mt-1 bg-[#25d366] hover:bg-[#20ba5a] text-[#072412] font-bold py-3 px-5 rounded-full text-xs flex items-center justify-center gap-2 transition-all shadow-sm hover:shadow"
              >
                <span className="material-symbols-outlined text-lg">chat</span>
                <span>Open WhatsApp (+91 7227972655)</span>
              </a>
            </div>

            {/* Flagship Store Location Card */}
            <div className="bg-white p-6 sm:p-7 rounded-3xl border border-[#e6e2dc] shadow-xs flex flex-col gap-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#f1ede7]">
                <div className="flex items-center gap-2.5">
                  <span className="material-symbols-outlined text-[#5c6149] text-xl">storefront</span>
                  <span className="font-serif text-base font-semibold text-[#171411]">
                    Husna Collection Store
                  </span>
                </div>
                <span className="text-[10px] font-bold bg-[#dee3c4] text-[#191d0a] px-2.5 py-0.5 rounded-full uppercase">
                  Flagship Store
                </span>
              </div>

              {/* Address details */}
              <div className="flex items-start gap-3 text-xs text-[#35302c]">
                <span className="material-symbols-outlined text-[#5c6149] text-lg shrink-0 mt-0.5">
                  pin_drop
                </span>
                <div className="flex flex-col leading-relaxed">
                  <strong className="text-[#171411] font-semibold text-sm">Husna Collection</strong>
                  <span>Shop G-14, G-15, Jasat Plaza, Opp. I.T.I.</span>
                  <span>Station Road, Ankleshwar – 393001</span>
                  <span>Gujarat, India</span>
                </div>
              </div>

              {/* Contact numbers */}
              <div className="flex flex-col gap-2.5 pt-2 border-t border-[#f1ede7] text-xs">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-[#5c6149] text-base shrink-0">
                    call
                  </span>
                  <div>
                    <span className="text-[#7e756f] block text-[10px] uppercase font-bold">Phone / WhatsApp</span>
                    <a
                      href="tel:+917227972655"
                      className="font-medium text-[#171411] hover:text-[#5c6149] transition-colors"
                    >
                      +91 7227972655
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-[#5c6149] text-base shrink-0">
                    mail
                  </span>
                  <div>
                    <span className="text-[#7e756f] block text-[10px] uppercase font-bold">Email Inquiries</span>
                    <a
                      href="mailto:husnacollection55@gmail.com"
                      className="font-medium text-[#171411] hover:text-[#5c6149] transition-colors"
                    >
                      husnacollection55@gmail.com
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-[#5c6149] text-base shrink-0">
                    schedule
                  </span>
                  <div>
                    <span className="text-[#7e756f] block text-[10px] uppercase font-bold">Store Hours</span>
                    <span className="text-[#171411] font-medium">Monday – Sunday: 10:00 AM – 9:00 PM IST</span>
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="grid grid-cols-2 gap-2.5 pt-2">
                <button
                  onClick={handleCopyAddress}
                  className="w-full bg-[#f7f3ed] hover:bg-[#ece6dc] text-[#171411] py-2 px-3 rounded-full text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer border border-[#cfc4bd]"
                >
                  <span className="material-symbols-outlined text-sm">
                    {copied ? 'check' : 'content_copy'}
                  </span>
                  <span>{copied ? 'Copied' : 'Copy Address'}</span>
                </button>

                <a
                  href="https://maps.google.com/?q=Jasat+Plaza+Station+Road+Ankleshwar+Gujarat+393001"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-[#171411] hover:bg-[#2c2825] text-white py-2 px-3 rounded-full text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors text-center"
                >
                  <span className="material-symbols-outlined text-sm">directions</span>
                  <span>Get Directions</span>
                </a>
              </div>
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

