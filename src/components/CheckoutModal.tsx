import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { ordersService } from '../services/ordersService';
import { BRAND_INFO } from '../data/products';

interface CheckoutModalProps {
  onSuccessReturn: () => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({ onSuccessReturn }) => {
  const {
    cart,
    clearCart,
    isCheckoutModalOpen,
    setIsCheckoutModalOpen,
    subtotal,
    discountAmount,
    shippingFee,
    total,
    isPromoApplied,
    includeGiftBox,
  } = useCart();
  const { user, profile } = useAuth();

  const [step, setStep] = useState<'details' | 'success'>('details');
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    firstName: 'Ayesha',
    lastName: 'Khan',
    email: 'ayesha.k@example.com',
    phone: '+44 7911 123456',
    address: '14 Mayfair Gardens',
    city: 'London',
    postalCode: 'W1J 8AQ',
    country: 'United Kingdom',
    paymentMethod: 'card' as 'card' | 'applepay' | 'tabby' | 'cod',
    cardNumber: '•••• •••• •••• 4242',
    notes: 'Please hem abaya to 55 inches if possible.',
  });

  useEffect(() => {
    if (profile) {
      const parts = (profile.fullName || '').split(' ');
      setFormData((prev) => ({
        ...prev,
        firstName: parts[0] || prev.firstName,
        lastName: parts.slice(1).join(' ') || prev.lastName,
        email: profile.email || prev.email,
        phone: profile.phone || prev.phone,
        address: profile.shippingAddress?.street || prev.address,
        city: profile.shippingAddress?.city || prev.city,
        postalCode: profile.shippingAddress?.postalCode || prev.postalCode,
        country: profile.shippingAddress?.country || prev.country,
        notes: profile.tailoringPreferences?.notes || prev.notes,
      }));
    }
  }, [profile]);

  const [orderNumber, setOrderNumber] = useState('');

  if (!isCheckoutModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const res = await ordersService.createOrder({
        userId: user?.id,
        customerName: `${formData.firstName} ${formData.lastName}`.trim(),
        customerEmail: formData.email,
        customerPhone: formData.phone,
        shippingAddress: {
          street: formData.address,
          city: formData.city,
          postalCode: formData.postalCode,
          country: formData.country,
        },
        subtotal,
        discountAmount,
        shippingFee,
        total,
        promoCode: isPromoApplied ? 'HUSNA20' : undefined,
        paymentMethod: formData.paymentMethod,
        giftBoxIncluded: includeGiftBox,
        notes: formData.notes,
        items: cart,
      });

      setOrderNumber(res.orderNumber);
      clearCart();
      setStep('success');
    } finally {
      setSubmitting(false);
    }
  };

  const getWhatsAppConfirmationLink = () => {
    const message = `Hello Husna Collection Atelier,\n\nI have just placed Order #${orderNumber} for $${total.toFixed(
      2
    )}.\n\nCustomer: ${formData.firstName} ${formData.lastName}\nPhone: ${formData.phone}\nDelivery Address: ${
      formData.address
    }, ${formData.city} (${formData.country})\n\nCustom tailoring notes: ${formData.notes || 'None'}\n\nPlease confirm dispatch. Thank you!`;
    return `https://wa.me/?text=${encodeURIComponent(message)}`;
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#171411]/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6">
      <div className="bg-[#fdf9f3] w-full max-w-3xl rounded-2xl shadow-2xl border border-[#e6e2dc] overflow-hidden relative max-h-[92vh] flex flex-col">
        
        {/* Header */}
        <div className="bg-white p-5 border-b border-[#e6e2dc] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#5c6149]">lock</span>
            <span className="font-serif text-lg font-semibold text-[#171411]">
              {step === 'details' ? 'Secure Atelier Checkout' : 'Order Confirmation'}
            </span>
          </div>
          <button
            onClick={() => {
              setIsCheckoutModalOpen(false);
              if (step === 'success') onSuccessReturn();
            }}
            className="w-8 h-8 rounded-full flex items-center justify-center text-[#7e756f] hover:text-[#171411] hover:bg-[#f1ede7] transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-lg">close</span>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8">
          {step === 'details' ? (
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-12 gap-8">
              
              {/* Left Column: Form Fields (7 cols) */}
              <div className="md:col-span-7 flex flex-col gap-5">
                <div>
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-[#5c6149] mb-3">
                    1. Contact & Delivery Address
                  </h3>
                  
                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <div>
                      <label className="text-[11px] font-semibold text-[#171411] block mb-1">
                        First Name
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.firstName}
                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                        className="w-full bg-white border border-[#cfc4bd] rounded-lg px-3 py-2 text-xs text-[#171411] focus:outline-none focus:border-[#171411]"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-[#171411] block mb-1">
                        Last Name
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.lastName}
                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                        className="w-full bg-white border border-[#cfc4bd] rounded-lg px-3 py-2 text-xs text-[#171411] focus:outline-none focus:border-[#171411]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <div>
                      <label className="text-[11px] font-semibold text-[#171411] block mb-1">
                        Email Address
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full bg-white border border-[#cfc4bd] rounded-lg px-3 py-2 text-xs text-[#171411] focus:outline-none focus:border-[#171411]"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-[#171411] block mb-1">
                        Phone (for courier & WhatsApp)
                      </label>
                      <input
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full bg-white border border-[#cfc4bd] rounded-lg px-3 py-2 text-xs text-[#171411] focus:outline-none focus:border-[#171411]"
                      />
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="text-[11px] font-semibold text-[#171411] block mb-1">
                      Street Address & Apartment
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      className="w-full bg-white border border-[#cfc4bd] rounded-lg px-3 py-2 text-xs text-[#171411] focus:outline-none focus:border-[#171411]"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-3 mb-3">
                    <div>
                      <label className="text-[11px] font-semibold text-[#171411] block mb-1">
                        City
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        className="w-full bg-white border border-[#cfc4bd] rounded-lg px-3 py-2 text-xs text-[#171411] focus:outline-none focus:border-[#171411]"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-[#171411] block mb-1">
                        Postal Code
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.postalCode}
                        onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                        className="w-full bg-white border border-[#cfc4bd] rounded-lg px-3 py-2 text-xs text-[#171411] focus:outline-none focus:border-[#171411]"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-[#171411] block mb-1">
                        Country
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.country}
                        onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                        className="w-full bg-white border border-[#cfc4bd] rounded-lg px-3 py-2 text-xs text-[#171411] focus:outline-none focus:border-[#171411]"
                      />
                    </div>
                  </div>
                </div>

                {/* Sizing & Tailoring Notes */}
                <div>
                  <label className="text-[11px] font-semibold text-[#171411] block mb-1">
                    Atelier Tailoring / Hem Notes (Optional)
                  </label>
                  <input
                    type="text"
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    placeholder="E.g., Please trim hem by 1 inch, urgent Eid dispatch"
                    className="w-full bg-white border border-[#cfc4bd] rounded-lg px-3 py-2 text-xs text-[#171411] focus:outline-none focus:border-[#171411]"
                  />
                </div>

                {/* Payment Selection */}
                <div>
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-[#5c6149] mb-3">
                    2. Payment Method
                  </h3>
                  <div className="grid grid-cols-2 gap-2.5">
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, paymentMethod: 'card' })}
                      className={`p-3 rounded-xl border text-left flex flex-col gap-1 transition-all cursor-pointer ${
                        formData.paymentMethod === 'card'
                          ? 'border-[#171411] bg-white ring-2 ring-[#171411]/20'
                          : 'border-[#cfc4bd] bg-[#f7f3ed]'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-[#171411]">Credit Card</span>
                        <span className="material-symbols-outlined text-sm text-[#5c6149]">credit_card</span>
                      </div>
                      <span className="text-[10px] text-[#7e756f]">Visa, Mastercard, Amex</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, paymentMethod: 'tabby' })}
                      className={`p-3 rounded-xl border text-left flex flex-col gap-1 transition-all cursor-pointer ${
                        formData.paymentMethod === 'tabby'
                          ? 'border-[#171411] bg-white ring-2 ring-[#171411]/20'
                          : 'border-[#cfc4bd] bg-[#f7f3ed]'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-[#171411]">Tabby 4x</span>
                        <span className="bg-[#dee3c4] text-[#191d0a] text-[9px] font-bold px-1.5 py-0.5 rounded">0% Fee</span>
                      </div>
                      <span className="text-[10px] text-[#7e756f]">4 split payments of ${(total / 4).toFixed(2)}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, paymentMethod: 'applepay' })}
                      className={`p-3 rounded-xl border text-left flex flex-col gap-1 transition-all cursor-pointer ${
                        formData.paymentMethod === 'applepay'
                          ? 'border-[#171411] bg-white ring-2 ring-[#171411]/20'
                          : 'border-[#cfc4bd] bg-[#f7f3ed]'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-[#171411]">Apple Pay / GPay</span>
                        <span className="material-symbols-outlined text-sm">contactless</span>
                      </div>
                      <span className="text-[10px] text-[#7e756f]">Instant biometric payment</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, paymentMethod: 'cod' })}
                      className={`p-3 rounded-xl border text-left flex flex-col gap-1 transition-all cursor-pointer ${
                        formData.paymentMethod === 'cod'
                          ? 'border-[#171411] bg-white ring-2 ring-[#171411]/20'
                          : 'border-[#cfc4bd] bg-[#f7f3ed]'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-[#171411]">Cash on Delivery</span>
                        <span className="material-symbols-outlined text-sm">payments</span>
                      </div>
                      <span className="text-[10px] text-[#7e756f]">UAE, KSA & Qatar</span>
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full mt-2 bg-[#171411] hover:bg-[#2c2825] text-white py-3.5 rounded-full text-xs font-semibold tracking-wide flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
                >
                  <span className="material-symbols-outlined text-sm">verified_user</span>
                  <span>Confirm & Authorize Order (${total.toFixed(2)})</span>
                </button>
              </div>

              {/* Right Column: Order Summary (5 cols) */}
              <div className="md:col-span-5 bg-white p-5 rounded-xl border border-[#e6e2dc] flex flex-col justify-between">
                <div>
                  <h4 className="font-serif text-sm font-semibold text-[#171411] pb-3 border-b border-[#e6e2dc]">
                    Order Summary ({cart.reduce((a, c) => a + c.quantity, 0)} Items)
                  </h4>

                  <div className="py-3 flex flex-col gap-3 max-h-56 overflow-y-auto divide-y divide-[#f1ede7]">
                    {cart.map((item) => (
                      <div key={item.id} className="pt-2 first:pt-0 flex items-center gap-3">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-12 h-15 rounded object-cover bg-[#f1ede7]"
                          referrerPolicy="no-referrer"
                        />
                        <div className="flex-1 text-xs">
                          <p className="font-serif font-medium text-[#171411] line-clamp-1">{item.name}</p>
                          <p className="text-[10px] text-[#7e756f]">{item.color} • L:{item.size}</p>
                          <p className="text-[11px] font-semibold text-[#171411] mt-0.5">
                            Qty: {item.quantity} × ${item.price.toFixed(2)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="pt-3 border-t border-[#e6e2dc] flex flex-col gap-1.5 text-xs text-[#7e756f]">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span className="font-semibold text-[#171411]">${subtotal.toFixed(2)}</span>
                    </div>
                    {isPromoApplied && (
                      <div className="flex justify-between text-[#5c6149]">
                        <span>Promo Code ({BRAND_INFO.promoCode})</span>
                        <span className="font-semibold">−${discountAmount.toFixed(2)}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span>Shipping (Express Global)</span>
                      <span className="font-semibold text-[#171411]">
                        {shippingFee === 0 ? 'FREE' : `$${shippingFee.toFixed(2)}`}
                      </span>
                    </div>
                    {includeGiftBox && (
                      <div className="flex justify-between text-[#5c6149] text-[11px]">
                        <span>Keepsake Box & Greeting Note</span>
                        <span className="font-semibold">INCLUDED</span>
                      </div>
                    )}
                    <div className="flex justify-between text-sm font-semibold text-[#171411] pt-2 border-t border-[#e6e2dc]">
                      <span>Total Due</span>
                      <span className="font-serif text-lg font-bold">${total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 p-3 bg-[#f7f3ed] rounded-lg text-[11px] text-[#7e756f] flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#5c6149] text-base">verified</span>
                  <span>100% Modest Cut Assurance & 14-Day Free Exchange Guarantee.</span>
                </div>
              </div>

            </form>
          ) : (
            /* Order Placed Success View */
            <div className="text-center py-8 flex flex-col items-center max-w-lg mx-auto">
              <div className="w-16 h-16 rounded-full bg-[#dee3c4] text-[#191d0a] flex items-center justify-center mb-4 shadow-sm">
                <span className="material-symbols-outlined text-3xl">check_circle</span>
              </div>

              <span className="font-cursive text-3xl text-[#5c6149] mb-1">
                Jazakallahu Khair ♥
              </span>
              <h2 className="font-serif text-2xl font-semibold text-[#171411] mb-2">
                Your Order is Confirmed
              </h2>
              <p className="text-xs text-[#7e756f] mb-4">
                Order <strong className="text-[#171411] font-mono text-sm">{orderNumber}</strong> has been received by our atelier in Dubai. A confirmation dispatch notice has been sent to <strong>{formData.email}</strong>.
              </p>

              <div className="w-full bg-white p-4 rounded-xl border border-[#e6e2dc] mb-6 text-left text-xs">
                <div className="flex justify-between mb-2 pb-2 border-b border-[#f1ede7]">
                  <span className="text-[#7e756f]">Estimated Global Delivery</span>
                  <span className="font-semibold text-[#171411]">3–5 Business Days (DHL Express)</span>
                </div>
                <div className="flex justify-between mb-2 pb-2 border-b border-[#f1ede7]">
                  <span className="text-[#7e756f]">Shipping To</span>
                  <span className="font-semibold text-[#171411]">{formData.address}, {formData.city}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#7e756f]">Total Paid</span>
                  <span className="font-serif font-bold text-sm text-[#171411]">${total.toFixed(2)}</span>
                </div>
              </div>

              {/* WhatsApp VIP Concierge Button */}
              <div className="flex flex-col sm:flex-row gap-3 w-full">
                <a
                  href={getWhatsAppConfirmationLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 bg-[#5c6149] hover:bg-[#171411] text-white py-3 px-4 rounded-full text-xs font-semibold flex items-center justify-center gap-2 transition-colors shadow-sm"
                >
                  <span className="material-symbols-outlined text-sm">chat</span>
                  <span>Notify Concierge on WhatsApp</span>
                </a>

                <button
                  onClick={() => {
                    setIsCheckoutModalOpen(false);
                    onSuccessReturn();
                  }}
                  className="bg-[#171411] hover:bg-[#2c2825] text-white py-3 px-6 rounded-full text-xs font-semibold transition-colors cursor-pointer"
                >
                  Continue Shopping
                </button>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
