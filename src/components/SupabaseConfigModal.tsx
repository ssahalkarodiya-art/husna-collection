import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  getSupabaseConfig,
  saveSupabaseConfig,
  clearSupabaseConfig,
  testSupabaseConnection,
} from '../lib/supabase';

export const SupabaseConfigModal: React.FC = () => {
  const { isConfigModalOpen, setIsConfigModalOpen, isConfigured } = useAuth();
  const currentConfig = getSupabaseConfig();

  const [url, setUrl] = useState(currentConfig.url || '');
  const [key, setKey] = useState(currentConfig.key || '');
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);
  const [copiedSchema, setCopiedSchema] = useState(false);
  const [activeTab, setActiveTab] = useState<'connect' | 'sql-guide'>('connect');

  if (!isConfigModalOpen) return null;

  const handleTestConnection = async () => {
    setTesting(true);
    setTestResult(null);
    try {
      const res = await testSupabaseConnection(url, key);
      setTestResult(res);
    } finally {
      setTesting(false);
    }
  };

  const handleSave = () => {
    if (!url.trim() || !key.trim()) {
      setTestResult({
        success: false,
        message: 'Please provide both the Supabase Project URL and Public Anon Key.',
      });
      return;
    }
    const saved = saveSupabaseConfig(url, key);
    if (!saved) {
      setTestResult({
        success: false,
        message: 'Failed to persist credentials.',
      });
    }
  };

  const handleCopySchema = () => {
    const schemaSql = `-- ==============================================================================
-- HUSNA COLLECTION ATELIER — SUPABASE POSTGRESQL PRODUCTION SCHEMA
-- Run this in your Supabase SQL Editor (SQL Editor -> New Query -> Run)
-- ==============================================================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  phone TEXT,
  avatar_url TEXT DEFAULT 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300',
  role TEXT DEFAULT 'customer' CHECK (role IN ('customer', 'atelier_member', 'admin')),
  tier TEXT DEFAULT 'VIP Atelier Member',
  shipping_address JSONB DEFAULT '{"street": "", "city": "London", "postal_code": "", "country": "United Kingdom"}'::jsonb,
  tailoring_preferences JSONB DEFAULT '{"preferred_length": "56", "height": "5''6\\"", "notes": ""}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  subtitle TEXT,
  price NUMERIC(10, 2) NOT NULL,
  original_price NUMERIC(10, 2),
  rating NUMERIC(3, 2) DEFAULT 5.0,
  reviews_count INTEGER DEFAULT 0,
  category TEXT NOT NULL,
  category_label TEXT NOT NULL,
  fabric TEXT NOT NULL,
  badge TEXT,
  alt TEXT,
  description TEXT NOT NULL,
  details TEXT[] DEFAULT ARRAY[]::TEXT[],
  images JSONB NOT NULL,
  colors JSONB NOT NULL DEFAULT '[]'::jsonb,
  sizes JSONB NOT NULL DEFAULT '[]'::jsonb,
  is_new_arrival BOOLEAN DEFAULT false,
  stock_quantity INTEGER DEFAULT 50,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_number TEXT UNIQUE NOT NULL,
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  customer_email TEXT NOT NULL,
  customer_name TEXT NOT NULL,
  customer_phone TEXT,
  shipping_address JSONB NOT NULL,
  subtotal NUMERIC(10, 2) NOT NULL,
  discount_amount NUMERIC(10, 2) DEFAULT 0.00,
  shipping_fee NUMERIC(10, 2) DEFAULT 0.00,
  total NUMERIC(10, 2) NOT NULL,
  promo_code TEXT,
  payment_method TEXT DEFAULT 'card',
  payment_status TEXT DEFAULT 'paid',
  fulfillment_status TEXT DEFAULT 'processing',
  tracking_number TEXT,
  tracking_courier TEXT DEFAULT 'DHL Express',
  gift_box_included BOOLEAN DEFAULT false,
  custom_tailoring_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id TEXT REFERENCES public.products(id) ON DELETE SET NULL,
  product_name TEXT NOT NULL,
  subtitle TEXT,
  selected_color TEXT,
  selected_size TEXT,
  unit_price NUMERIC(10, 2) NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  total_price NUMERIC(10, 2) NOT NULL,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.wishlist_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  product_id TEXT NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, product_id)
);

CREATE TABLE IF NOT EXISTS public.reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id TEXT NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  author TEXT NOT NULL,
  location TEXT DEFAULT 'London, UK',
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  content TEXT NOT NULL,
  verified BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS POLICIES
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wishlist_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert their own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Anyone can view products" ON public.products FOR SELECT USING (true);
CREATE POLICY "Authenticated users can insert products" ON public.products FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update products" ON public.products FOR UPDATE TO authenticated USING (true);

CREATE POLICY "Users can view their own orders" ON public.orders FOR SELECT USING (auth.uid() = user_id OR auth.uid() IS NULL);
CREATE POLICY "Anyone can insert orders" ON public.orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can view order items" ON public.order_items FOR SELECT USING (true);
CREATE POLICY "Anyone can insert order items" ON public.order_items FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can view their own wishlist" ON public.wishlist_items FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can add to their wishlist" ON public.wishlist_items FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can remove from their wishlist" ON public.wishlist_items FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Anyone can read reviews" ON public.reviews FOR SELECT USING (true);
CREATE POLICY "Anyone can create reviews" ON public.reviews FOR INSERT WITH CHECK (true);

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300'),
    'customer'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
`;
    navigator.clipboard.writeText(schemaSql);
    setCopiedSchema(true);
    setTimeout(() => setCopiedSchema(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#171411]/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-[#fdf9f3] w-full max-w-2xl rounded-2xl shadow-2xl border border-[#e6e2dc] overflow-hidden relative max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-[#e6e2dc] bg-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#171411] flex items-center justify-center text-white">
              <span className="material-symbols-outlined text-xl">database</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif text-lg font-semibold text-[#171411]">
                  Supabase Backend Configuration
                </h3>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    isConfigured
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  {isConfigured ? 'Connected' : 'Local Storage Mode'}
                </span>
              </div>
              <p className="text-xs text-[#7e756f]">
                Manage database endpoints, authentication keys, and SQL schema
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsConfigModalOpen(false)}
            className="w-8 h-8 rounded-full flex items-center justify-center text-[#7e756f] hover:text-[#171411] hover:bg-[#f1ede7] transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-lg">close</span>
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-[#e6e2dc] bg-[#f8f5ef] px-6">
          <button
            onClick={() => setActiveTab('connect')}
            className={`py-3 px-4 text-xs font-semibold border-b-2 transition-all cursor-pointer ${
              activeTab === 'connect'
                ? 'border-[#171411] text-[#171411]'
                : 'border-transparent text-[#7e756f] hover:text-[#171411]'
            }`}
          >
            API Credentials & Test
          </button>
          <button
            onClick={() => setActiveTab('sql-guide')}
            className={`py-3 px-4 text-xs font-semibold border-b-2 transition-all cursor-pointer ${
              activeTab === 'sql-guide'
                ? 'border-[#171411] text-[#171411]'
                : 'border-transparent text-[#7e756f] hover:text-[#171411]'
            }`}
          >
            SQL Migration Script & Setup Steps
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {activeTab === 'connect' ? (
            <div className="space-y-5">
              <div className="bg-amber-50/70 border border-amber-200/80 rounded-xl p-4 text-xs text-[#57493a] flex items-start gap-3">
                <span className="material-symbols-outlined text-amber-600 mt-0.5">info</span>
                <div>
                  <p className="font-semibold mb-0.5">Live Connection Active</p>
                  <p>
                    When configured, all client actions (Sign Up/In, Orders, Wishlist, Product Catalog, Reviews)
                    directly read and write to your Supabase PostgreSQL database tables. When empty, the app runs in full offline demo mode.
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#171411] uppercase tracking-wider mb-1.5">
                  Supabase Project URL
                </label>
                <input
                  type="text"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://xyzcompany.supabase.co"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-[#d6cfc5] bg-white text-xs font-mono text-[#171411] placeholder:text-[#9e958e] focus:outline-none focus:border-[#5c6149] focus:ring-1 focus:ring-[#5c6149]"
                />
                <span className="text-[10px] text-[#8e857e] mt-1 block">
                  Found in your Supabase Dashboard under <strong>Project Settings → API</strong>.
                </span>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#171411] uppercase tracking-wider mb-1.5">
                  Supabase Anon (Public) Key
                </label>
                <input
                  type="password"
                  value={key}
                  onChange={(e) => setKey(e.target.value)}
                  placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                  className="w-full px-3.5 py-2.5 rounded-lg border border-[#d6cfc5] bg-white text-xs font-mono text-[#171411] placeholder:text-[#9e958e] focus:outline-none focus:border-[#5c6149] focus:ring-1 focus:ring-[#5c6149]"
                />
                <span className="text-[10px] text-[#8e857e] mt-1 block">
                  Found in your Supabase Dashboard under <strong>Project Settings → API → anon / public</strong> key.
                </span>
              </div>

              {testResult && (
                <div
                  className={`p-3.5 rounded-xl border text-xs flex items-start gap-2.5 ${
                    testResult.success
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                      : 'bg-rose-50 border-rose-200 text-rose-900'
                  }`}
                >
                  <span className="material-symbols-outlined text-sm mt-0.5">
                    {testResult.success ? 'check_circle' : 'error'}
                  </span>
                  <span>{testResult.message}</span>
                </div>
              )}

              <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-[#e6e2dc]">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleTestConnection}
                    disabled={testing}
                    className="px-4 py-2.5 rounded-xl border border-[#171411] text-[#171411] text-xs font-semibold hover:bg-[#171411] hover:text-white transition-colors cursor-pointer flex items-center gap-2"
                  >
                    {testing ? (
                      <>
                        <span className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                        <span>Testing...</span>
                      </>
                    ) : (
                      <>
                        <span className="material-symbols-outlined text-sm">wifi_tethering</span>
                        <span>Test Connection</span>
                      </>
                    )}
                  </button>

                  {isConfigured && (
                    <button
                      type="button"
                      onClick={clearSupabaseConfig}
                      className="px-3 py-2.5 rounded-xl text-rose-700 text-xs font-semibold hover:bg-rose-50 transition-colors cursor-pointer"
                    >
                      Disconnect / Reset
                    </button>
                  )}
                </div>

                <button
                  type="button"
                  onClick={handleSave}
                  className="px-6 py-2.5 rounded-xl bg-[#171411] hover:bg-[#2d2822] text-white text-xs font-semibold tracking-wider uppercase transition-all duration-200 cursor-pointer shadow-sm flex items-center gap-2"
                >
                  <span className="material-symbols-outlined text-sm">save</span>
                  <span>Save & Connect</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-[#5c6149]">
                    Step-by-Step Supabase Setup
                  </h4>
                  <p className="text-xs text-[#7e756f]">
                    Follow these 3 quick steps in your Supabase dashboard:
                  </p>
                </div>
                <button
                  onClick={handleCopySchema}
                  className="px-3.5 py-1.5 rounded-lg bg-[#5c6149] hover:bg-[#4b503b] text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <span className="material-symbols-outlined text-sm">
                    {copiedSchema ? 'check' : 'content_copy'}
                  </span>
                  <span>{copiedSchema ? 'Schema Copied!' : 'Copy SQL Schema'}</span>
                </button>
              </div>

              <ol className="space-y-3 text-xs text-[#4d4540]">
                <li className="flex items-start gap-2.5 bg-white p-3.5 rounded-xl border border-[#e6e2dc]">
                  <span className="w-5 h-5 rounded-full bg-[#171411] text-white flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                    1
                  </span>
                  <div>
                    <strong className="text-[#171411] block mb-0.5">Create your Supabase Project</strong>
                    Log in to <span className="font-semibold text-[#5c6149]">supabase.com</span>, create a new project named <em>"Husna Atelier"</em>, and choose a nearby region (e.g. Frankfurt, London, or Singapore).
                  </div>
                </li>

                <li className="flex items-start gap-2.5 bg-white p-3.5 rounded-xl border border-[#e6e2dc]">
                  <span className="w-5 h-5 rounded-full bg-[#171411] text-white flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                    2
                  </span>
                  <div>
                    <strong className="text-[#171411] block mb-0.5">Run the SQL Schema Script</strong>
                    Go to <strong>SQL Editor → New Query</strong>, paste the complete schema script (click "Copy SQL Schema" button above or use <code>/supabase/schema.sql</code>), and click <strong>Run</strong>.
                  </div>
                </li>

                <li className="flex items-start gap-2.5 bg-white p-3.5 rounded-xl border border-[#e6e2dc]">
                  <span className="w-5 h-5 rounded-full bg-[#171411] text-white flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                    3
                  </span>
                  <div>
                    <strong className="text-[#171411] block mb-0.5">Connect and Enjoy</strong>
                    Copy your Project URL and Anon Public Key from <strong>Project Settings → API</strong>, paste them into the "API Credentials" tab, and click <strong>Save & Connect</strong>.
                  </div>
                </li>
              </ol>

              <div className="bg-[#1f1d1a] text-[#ded9d2] p-4 rounded-xl font-mono text-[11px] overflow-x-auto max-h-48 border border-[#3b3732]">
                <div className="text-[#8e857e] mb-1">-- Preview of created tables:</div>
                <div className="text-emerald-400">CREATE TABLE public.profiles (...)</div>
                <div className="text-emerald-400">CREATE TABLE public.products (...)</div>
                <div className="text-emerald-400">CREATE TABLE public.orders (...)</div>
                <div className="text-emerald-400">CREATE TABLE public.order_items (...)</div>
                <div className="text-emerald-400">CREATE TABLE public.wishlist_items (...)</div>
                <div className="text-emerald-400">CREATE TABLE public.reviews (...)</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
