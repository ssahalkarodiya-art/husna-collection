import React, { useState, useEffect } from 'react';
import { BRAND_INFO, PRODUCTS } from '../data/products';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { ordersService, StoredOrder } from '../services/ordersService';

interface AccountPageProps {
  onNavigate: (page: string, productId?: string) => void;
}

export const AccountPage: React.FC<AccountPageProps> = ({ onNavigate }) => {
  const { wishlist, toggleWishlist, addToCart } = useCart();
  const {
    user,
    profile,
    signOut,
    updateProfile,
    isConfigured,
    setIsConfigModalOpen,
    setIsAuthModalOpen,
  } = useAuth();

  const [activeTab, setActiveTab] = useState<'profile' | 'orders' | 'wishlist'>('orders');
  const [orders, setOrders] = useState<StoredOrder[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  // Edit Profile Form State
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [saveProfileSuccess, setSaveProfileSuccess] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({
    fullName: profile?.fullName || 'Ayesha Khan',
    phone: profile?.phone || '+44 7911 123456',
    street: profile?.shippingAddress?.street || '14 Mayfair Gardens',
    city: profile?.shippingAddress?.city || 'London',
    postalCode: profile?.shippingAddress?.postalCode || 'W1J 8AQ',
    country: profile?.shippingAddress?.country || 'United Kingdom',
    preferredLength: profile?.tailoringPreferences?.preferredLength || '56',
    height: profile?.tailoringPreferences?.height || "5'6\"",
    notes: profile?.tailoringPreferences?.notes || 'Floor graze with 2-inch block heels.',
  });

  useEffect(() => {
    if (profile) {
      setProfileForm({
        fullName: profile.fullName || '',
        phone: profile.phone || '',
        street: profile.shippingAddress?.street || '',
        city: profile.shippingAddress?.city || '',
        postalCode: profile.shippingAddress?.postalCode || '',
        country: profile.shippingAddress?.country || 'United Kingdom',
        preferredLength: profile.tailoringPreferences?.preferredLength || '56',
        height: profile.tailoringPreferences?.height || "5'6\"",
        notes: profile.tailoringPreferences?.notes || '',
      });
    }
  }, [profile]);

  useEffect(() => {
    let mounted = true;
    setLoadingOrders(true);
    ordersService
      .getUserOrders(user?.id, user?.email)
      .then((data) => {
        if (mounted) {
          setOrders(data);
          setLoadingOrders(false);
        }
      })
      .catch(() => {
        if (mounted) setLoadingOrders(false);
      });

    return () => {
      mounted = false;
    };
  }, [user]);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingProfile(true);
    setSaveProfileSuccess(false);

    try {
      await updateProfile({
        fullName: profileForm.fullName,
        phone: profileForm.phone,
        shippingAddress: {
          street: profileForm.street,
          city: profileForm.city,
          postalCode: profileForm.postalCode,
          country: profileForm.country,
        },
        tailoringPreferences: {
          preferredLength: profileForm.preferredLength,
          height: profileForm.height,
          notes: profileForm.notes,
        },
      });

      setSaveProfileSuccess(true);
      setIsEditingProfile(false);
      setTimeout(() => setSaveProfileSuccess(false), 3000);
    } finally {
      setSavingProfile(false);
    }
  };

  const wishlistProducts = PRODUCTS.filter((p) => wishlist.includes(p.id));

  return (
    <div className="w-full bg-[#fdf9f3] min-h-screen">
      {/* Header */}
      <section className="max-w-[1380px] mx-auto px-4 sm:px-8 lg:px-16 pt-8 pb-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-[#e6e2dc] pb-6">
          <div className="flex items-center gap-4">
            <img
              src={profile?.avatarUrl || BRAND_INFO.avatarUrl}
              alt={profile?.fullName || 'Client Avatar'}
              className="w-16 h-16 rounded-full object-cover ring-2 ring-[#5c6149] shadow-xs"
              referrerPolicy="no-referrer"
            />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-serif text-2xl font-semibold text-[#171411]">
                  {profile?.fullName || (user ? user.email : 'Atelier Guest')}
                </h1>
                <span className="bg-[#dee3c4] text-[#191d0a] text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                  {profile?.tier || 'VIP Atelier Member'}
                </span>
              </div>
              <p className="text-xs text-[#7e756f]">
                {profile?.email || user?.email || 'Guest Session'} •{' '}
                {isConfigured ? 'Supabase Synced' : 'Local Preview'}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setActiveTab('orders')}
              className={`px-4 py-2 rounded-full text-xs font-semibold transition-colors cursor-pointer ${
                activeTab === 'orders'
                  ? 'bg-[#171411] text-white'
                  : 'bg-white text-[#4d4540] border border-[#e6e2dc] hover:bg-[#f5f1eb]'
              }`}
            >
              Order History ({orders.length})
            </button>
            <button
              onClick={() => setActiveTab('wishlist')}
              className={`px-4 py-2 rounded-full text-xs font-semibold transition-colors cursor-pointer ${
                activeTab === 'wishlist'
                  ? 'bg-[#171411] text-white'
                  : 'bg-white text-[#4d4540] border border-[#e6e2dc] hover:bg-[#f5f1eb]'
              }`}
            >
              Saved Pieces ({wishlistProducts.length})
            </button>
            <button
              onClick={() => setActiveTab('profile')}
              className={`px-4 py-2 rounded-full text-xs font-semibold transition-colors cursor-pointer ${
                activeTab === 'profile'
                  ? 'bg-[#171411] text-white'
                  : 'bg-white text-[#4d4540] border border-[#e6e2dc] hover:bg-[#f5f1eb]'
              }`}
            >
              Profile & Measurements
            </button>

            {user ? (
              <button
                onClick={() => signOut()}
                className="px-3.5 py-2 rounded-full text-xs font-semibold text-rose-700 bg-rose-50 border border-rose-200 hover:bg-rose-100 transition-colors cursor-pointer ml-1"
                title="Sign out of your Supabase account"
              >
                Sign Out
              </button>
            ) : (
              <button
                onClick={() => setIsAuthModalOpen(true)}
                className="px-4 py-2 rounded-full text-xs font-semibold text-white bg-[#5c6149] hover:bg-[#4b503b] transition-colors cursor-pointer ml-1"
              >
                Sign In / Register
              </button>
            )}

            <button
              onClick={() => setIsConfigModalOpen(true)}
              className="p-2 rounded-full text-[#5c6149] hover:text-[#171411] hover:bg-white border border-[#e6e2dc] transition-colors cursor-pointer"
              title="Database & Auth settings"
            >
              <span className="material-symbols-outlined text-sm">database</span>
            </button>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <section className="max-w-[1380px] mx-auto px-4 sm:px-8 lg:px-16 pb-20">
        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <h2 className="font-serif text-xl font-semibold text-[#171411]">
                Atelier Order History
              </h2>
              <span className="text-xs text-[#7e756f]">
                {isConfigured
                  ? 'Synchronized with Supabase "orders" & "order_items"'
                  : 'Synchronized with Local Storage'}
              </span>
            </div>

            {loadingOrders ? (
              <div className="bg-white p-12 rounded-2xl border border-[#e6e2dc] flex items-center justify-center">
                <span className="w-6 h-6 border-2 border-[#171411] border-t-transparent rounded-full animate-spin" />
              </div>
            ) : orders.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-2xl border border-[#e6e2dc]">
                <span className="material-symbols-outlined text-4xl text-[#baa89a] mb-2">
                  shopping_bag
                </span>
                <p className="font-serif text-base text-[#171411]">No atelier orders placed yet</p>
                <p className="text-xs text-[#7e756f] mt-1 max-w-sm mx-auto">
                  Browse our couture collection and place an order to see live order tracking and dispatch updates here.
                </p>
                <button
                  onClick={() => onNavigate('shop')}
                  className="mt-4 bg-[#171411] text-white text-xs font-semibold px-6 py-2.5 rounded-full cursor-pointer hover:bg-[#332f2b] transition-colors"
                >
                  Explore Collection
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {orders.map((ord) => (
                  <div
                    key={ord.id}
                    className="bg-white p-6 rounded-2xl border border-[#e6e2dc] shadow-xs flex flex-col gap-4"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#f1ede7]">
                      <div>
                        <span className="font-serif font-bold text-sm text-[#171411] mr-3">
                          {ord.orderNumber || ord.id}
                        </span>
                        <span className="text-xs text-[#7e756f]">Placed on {ord.date}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="bg-[#dee3c4] text-[#191d0a] text-[10px] font-bold px-2 py-0.5 rounded-full">
                          {ord.status}
                        </span>
                        <span className="font-serif font-bold text-sm text-[#171411]">
                          ${ord.total.toFixed(2)}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2.5 text-xs text-[#4d4540]">
                      {ord.items.map((item, idx) => (
                        <div key={idx} className="flex items-center justify-between py-1">
                          <div className="flex items-center gap-3">
                            {item.image && (
                              <img
                                src={item.image}
                                alt={item.name}
                                className="w-10 h-10 object-cover rounded-md border border-[#e6e2dc]"
                              />
                            )}
                            <div>
                              <p className="font-medium text-[#171411]">{item.name}</p>
                              {(item.color || item.size) && (
                                <p className="text-[11px] text-[#7e756f]">
                                  {item.color && `Color: ${item.color}`}
                                  {item.color && item.size && ' • '}
                                  {item.size && `Length: ${item.size}`}
                                </p>
                              )}
                            </div>
                          </div>
                          <div className="text-right">
                            <span className="font-semibold text-[#171411]">
                              {item.price === 0 ? 'FREE' : `$${(item.price * item.qty).toFixed(2)}`}
                            </span>
                            <p className="text-[10px] text-[#7e756f]">Qty {item.qty}</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="pt-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs border-t border-[#f1ede7]">
                      <span className="text-[#7e756f]">
                        Tracking: <code className="font-mono text-[#171411]">{ord.tracking}</code>{' '}
                        ({ord.courier || 'DHL Express'})
                      </span>
                      <a
                        href={`https://wa.me/?text=Hello%20Husna%20Collection%2C%20could%20you%20please%20check%20tracking%20for%20order%20${
                          ord.orderNumber || ord.id
                        }%3F`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#5c6149] font-semibold underline flex items-center gap-1 hover:text-[#171411] transition-colors"
                      >
                        <span>Track on WhatsApp Concierge</span>
                        <span className="material-symbols-outlined text-xs">open_in_new</span>
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Wishlist Tab */}
        {activeTab === 'wishlist' && (
          <div className="flex flex-col gap-6">
            <h2 className="font-serif text-xl font-semibold text-[#171411]">
              Saved Pieces ({wishlistProducts.length})
            </h2>

            {wishlistProducts.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-2xl border border-[#e6e2dc]">
                <p className="font-serif text-base text-[#171411]">No saved pieces yet</p>
                <button
                  onClick={() => onNavigate('shop')}
                  className="mt-3 bg-[#171411] text-white text-xs font-semibold px-5 py-2 rounded-full cursor-pointer"
                >
                  Explore Collection
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {wishlistProducts.map((p) => (
                  <div
                    key={p.id}
                    className="bg-white rounded-2xl overflow-hidden border border-[#e6e2dc] shadow-xs flex flex-col justify-between"
                  >
                    <div>
                      <div className="aspect-[3/4] overflow-hidden bg-[#f1ede7] relative">
                        <img
                          src={p.images.front}
                          alt={p.name}
                          onClick={() => onNavigate('product', p.id)}
                          className="w-full h-full object-cover cursor-pointer hover:scale-102 transition-transform duration-300"
                          referrerPolicy="no-referrer"
                        />
                        <button
                          onClick={() => toggleWishlist(p.id)}
                          className="absolute top-2.5 right-2.5 w-7 h-7 rounded-full bg-white text-[#ba1a1a] flex items-center justify-center shadow-xs cursor-pointer hover:bg-rose-50"
                          title="Remove from Wishlist"
                        >
                          <span className="material-symbols-outlined text-xs">delete</span>
                        </button>
                      </div>
                      <div className="p-4">
                        <h4
                          onClick={() => onNavigate('product', p.id)}
                          className="font-serif text-sm font-semibold text-[#171411] hover:text-[#5c6149] cursor-pointer"
                        >
                          {p.name}
                        </h4>
                        <p className="text-[11px] text-[#7e756f]">{p.fabric}</p>
                        <span className="font-serif font-bold text-sm text-[#171411] block mt-1">
                          ${p.price.toFixed(2)}
                        </span>
                      </div>
                    </div>
                    <div className="p-4 pt-0">
                      <button
                        onClick={() => addToCart(p)}
                        className="w-full bg-[#171411] hover:bg-[#5c6149] text-white py-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-sm">local_mall</span>
                        <span>Add to Bag</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Profile & Measurements Tab */}
        {activeTab === 'profile' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-serif text-lg font-semibold text-[#171411]">
                  Atelier Client Profile & Tailoring
                </h3>
                <p className="text-xs text-[#7e756f]">
                  Saved to Supabase <code>public.profiles</code> table
                </p>
              </div>

              {!isEditingProfile ? (
                <button
                  onClick={() => setIsEditingProfile(true)}
                  className="px-4 py-2 rounded-full border border-[#171411] text-[#171411] hover:bg-[#171411] hover:text-white text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-sm">edit</span>
                  <span>Edit Details</span>
                </button>
              ) : (
                <button
                  onClick={() => setIsEditingProfile(false)}
                  className="px-4 py-2 rounded-full border border-[#c5bcb2] text-[#7e756f] hover:text-[#171411] text-xs font-semibold transition-colors cursor-pointer"
                >
                  Cancel
                </button>
              )}
            </div>

            {saveProfileSuccess && (
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs px-4 py-3 rounded-xl flex items-center gap-2">
                <span className="material-symbols-outlined text-sm">check_circle</span>
                <span>Your profile & tailoring preferences have been saved to Supabase!</span>
              </div>
            )}

            {!isEditingProfile ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-white p-6 rounded-2xl border border-[#e6e2dc] shadow-xs flex flex-col gap-4">
                  <h4 className="font-serif text-sm font-semibold uppercase tracking-wider text-[#5c6149]">
                    Contact & Primary Residence
                  </h4>
                  <div className="flex flex-col gap-3 text-xs text-[#4d4540]">
                    <p>
                      <strong className="text-[#171411]">Name:</strong>{' '}
                      {profile?.fullName || 'Ayesha Khan'}
                    </p>
                    <p>
                      <strong className="text-[#171411]">Email:</strong>{' '}
                      {profile?.email || (user ? user.email : 'ayesha.k@example.com')}
                    </p>
                    <p>
                      <strong className="text-[#171411]">Phone:</strong>{' '}
                      {profile?.phone || '+44 7911 123456'}
                    </p>
                    <p>
                      <strong className="text-[#171411]">Primary Address:</strong>{' '}
                      {profile?.shippingAddress?.street
                        ? `${profile.shippingAddress.street}, ${profile.shippingAddress.city}, ${profile.shippingAddress.postalCode}, ${profile.shippingAddress.country}`
                        : '14 Mayfair Gardens, London, W1J 8AQ, United Kingdom'}
                    </p>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-[#e6e2dc] shadow-xs flex flex-col gap-4">
                  <h4 className="font-serif text-sm font-semibold uppercase tracking-wider text-[#5c6149]">
                    Saved Tailoring & Measurement Profile
                  </h4>
                  <div className="flex flex-col gap-3 text-xs text-[#4d4540]">
                    <p>
                      <strong className="text-[#171411]">Height:</strong>{' '}
                      {profile?.tailoringPreferences?.height || "5'6\" (168 cm)"}
                    </p>
                    <p>
                      <strong className="text-[#171411]">Preferred Abaya Length:</strong>{' '}
                      {profile?.tailoringPreferences?.preferredLength || '56'} (Floor graze)
                    </p>
                    <p>
                      <strong className="text-[#171411]">Bespoke Notes:</strong>{' '}
                      {profile?.tailoringPreferences?.notes ||
                        'Prefer slight puddle drape when wearing 2-inch block heels.'}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSaveProfile} className="bg-white p-6 sm:p-8 rounded-2xl border border-[#e6e2dc] shadow-xs space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Left: Contact */}
                  <div className="space-y-4">
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-[#5c6149]">
                      Personal Details
                    </h4>
                    <div>
                      <label className="block text-[11px] font-semibold text-[#171411] mb-1">
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={profileForm.fullName}
                        onChange={(e) =>
                          setProfileForm({ ...profileForm, fullName: e.target.value })
                        }
                        className="w-full px-3 py-2 text-xs border border-[#d6cfc5] rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-[#171411] mb-1">
                        Phone Number
                      </label>
                      <input
                        type="text"
                        value={profileForm.phone}
                        onChange={(e) =>
                          setProfileForm({ ...profileForm, phone: e.target.value })
                        }
                        className="w-full px-3 py-2 text-xs border border-[#d6cfc5] rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-[#171411] mb-1">
                        Street Address
                      </label>
                      <input
                        type="text"
                        value={profileForm.street}
                        onChange={(e) =>
                          setProfileForm({ ...profileForm, street: e.target.value })
                        }
                        className="w-full px-3 py-2 text-xs border border-[#d6cfc5] rounded-lg"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-semibold text-[#171411] mb-1">
                          City
                        </label>
                        <input
                          type="text"
                          value={profileForm.city}
                          onChange={(e) =>
                            setProfileForm({ ...profileForm, city: e.target.value })
                          }
                          className="w-full px-3 py-2 text-xs border border-[#d6cfc5] rounded-lg"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-[#171411] mb-1">
                          Postal Code
                        </label>
                        <input
                          type="text"
                          value={profileForm.postalCode}
                          onChange={(e) =>
                            setProfileForm({ ...profileForm, postalCode: e.target.value })
                          }
                          className="w-full px-3 py-2 text-xs border border-[#d6cfc5] rounded-lg"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Right: Tailoring */}
                  <div className="space-y-4">
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-[#5c6149]">
                      Tailoring Preferences
                    </h4>
                    <div>
                      <label className="block text-[11px] font-semibold text-[#171411] mb-1">
                        Client Height
                      </label>
                      <input
                        type="text"
                        value={profileForm.height}
                        onChange={(e) =>
                          setProfileForm({ ...profileForm, height: e.target.value })
                        }
                        placeholder="e.g. 5'6'' or 168 cm"
                        className="w-full px-3 py-2 text-xs border border-[#d6cfc5] rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-[#171411] mb-1">
                        Standard Abaya Length
                      </label>
                      <select
                        value={profileForm.preferredLength}
                        onChange={(e) =>
                          setProfileForm({ ...profileForm, preferredLength: e.target.value })
                        }
                        className="w-full px-3 py-2 text-xs border border-[#d6cfc5] rounded-lg bg-white"
                      >
                        <option value="52">Length 52 (Height 5'1" – 5'2")</option>
                        <option value="54">Length 54 (Height 5'3" – 5'4")</option>
                        <option value="56">Length 56 (Height 5'5" – 5'6")</option>
                        <option value="58">Length 58 (Height 5'7" – 5'8")</option>
                        <option value="60">Length 60 (Height 5'9"+)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-[#171411] mb-1">
                        Custom Tailoring Notes
                      </label>
                      <textarea
                        rows={3}
                        value={profileForm.notes}
                        onChange={(e) =>
                          setProfileForm({ ...profileForm, notes: e.target.value })
                        }
                        placeholder="Notes for the atelier seamstresses..."
                        className="w-full px-3 py-2 text-xs border border-[#d6cfc5] rounded-lg"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-[#e6e2dc]">
                  <button
                    type="button"
                    onClick={() => setIsEditingProfile(false)}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-[#7e756f] hover:text-[#171411]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={savingProfile}
                    className="px-6 py-2.5 rounded-xl bg-[#171411] text-white text-xs font-semibold tracking-wider uppercase hover:bg-[#2d2822] cursor-pointer disabled:opacity-50"
                  >
                    {savingProfile ? 'Saving to Supabase...' : 'Save Profile Changes'}
                  </button>
                </div>
              </form>
            )}
          </div>
        )}
      </section>
    </div>
  );
};
