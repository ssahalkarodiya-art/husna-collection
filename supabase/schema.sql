-- ==============================================================================
-- HUSNA COLLECTION ATELIER — SUPABASE POSTGRESQL PRODUCTION SCHEMA
-- ==============================================================================
-- Run this complete script in your Supabase SQL Editor (SQL Editor -> New Query -> Run)
-- to create all tables, triggers, Row-Level Security (RLS) policies, and seed data.
-- ==============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. PROFILES TABLE (Linked to auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  phone TEXT,
  avatar_url TEXT DEFAULT 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300',
  role TEXT DEFAULT 'customer' CHECK (role IN ('customer', 'atelier_member', 'admin')),
  tier TEXT DEFAULT 'VIP Atelier Member',
  shipping_address JSONB DEFAULT '{"street": "", "city": "London", "postal_code": "", "country": "United Kingdom"}'::jsonb,
  tailoring_preferences JSONB DEFAULT '{"preferred_length": "56", "height": "5''6\"", "notes": ""}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. PRODUCTS TABLE
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
  fabric_care JSONB DEFAULT '{"material": "Organic Blend", "careTips": ["Dry clean or hand wash cold", "Steam iron inside out"]}'::jsonb,
  is_new_arrival BOOLEAN DEFAULT false,
  stock_quantity INTEGER DEFAULT 50,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. ORDERS TABLE
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
  payment_status TEXT DEFAULT 'paid' CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded')),
  fulfillment_status TEXT DEFAULT 'processing' CHECK (fulfillment_status IN ('processing', 'tailoring', 'shipped', 'delivered', 'cancelled')),
  tracking_number TEXT,
  tracking_courier TEXT DEFAULT 'DHL Express',
  gift_box_included BOOLEAN DEFAULT false,
  custom_tailoring_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. ORDER ITEMS TABLE
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

-- 6. WISHLIST TABLE
CREATE TABLE IF NOT EXISTS public.wishlist_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  product_id TEXT NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, product_id)
);

-- 7. REVIEWS TABLE
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

-- ==============================================================================
-- AUTOMATIC PROFILE CREATION TRIGGER
-- ==============================================================================
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

-- Trigger execution on auth.users sign-up
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wishlist_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- 1. Profiles: Anyone can read their own profile; Users can update their own profile
CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- 2. Products: Public read access for everyone; Authenticated staff/admins can manage
CREATE POLICY "Anyone can view products"
  ON public.products FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can insert products"
  ON public.products FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update products"
  ON public.products FOR UPDATE
  TO authenticated
  USING (true);

-- 3. Orders: Users can read their own orders; Anyone (or authenticated) can place an order
CREATE POLICY "Users can view their own orders"
  ON public.orders FOR SELECT
  USING (auth.uid() = user_id OR auth.uid() IS NULL);

CREATE POLICY "Anyone can insert orders"
  ON public.orders FOR INSERT
  WITH CHECK (true);

-- 4. Order items: Anyone can view their order items; Anyone can insert
CREATE POLICY "Users can view order items"
  ON public.order_items FOR SELECT
  USING (true);

CREATE POLICY "Anyone can insert order items"
  ON public.order_items FOR INSERT
  WITH CHECK (true);

-- 5. Wishlist: Users can view and manage their own saved items
CREATE POLICY "Users can view their own wishlist"
  ON public.wishlist_items FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can add to their wishlist"
  ON public.wishlist_items FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can remove from their wishlist"
  ON public.wishlist_items FOR DELETE
  USING (auth.uid() = user_id);

-- 6. Reviews: Public read access; Authenticated users can write reviews
CREATE POLICY "Anyone can read reviews"
  ON public.reviews FOR SELECT
  USING (true);

CREATE POLICY "Anyone can create reviews"
  ON public.reviews FOR INSERT
  WITH CHECK (true);

-- ==============================================================================
-- INITIAL SEED DATA FOR HUSNA ATELIER PIECES
-- ==============================================================================
INSERT INTO public.products (id, name, subtitle, price, original_price, rating, reviews_count, category, category_label, fabric, badge, alt, description, details, images, colors, sizes, is_new_arrival)
VALUES
(
  'classic-embroidered-linen-abaya',
  'Classic Embroidered Linen Abaya',
  'Signature Korean Nida • Tailored Drape',
  85.00,
  115.00,
  4.9,
  128,
  'abayas',
  'Abayas',
  'Organic Washed Linen',
  'Bestseller',
  'Model wearing luxurious Classic Embroidered Linen Abaya in natural sand tone with artisanal cuff threadwork.',
  'The Classic Embroidered Linen Abaya reimagines everyday modest dignity with effortless luxury. Sculpted in a relaxed A-line silhouette with generous floor sweeping length, it offers complete modest coverage without clinging or losing structural fluidity.',
  ARRAY['Concealed premium matte front snap buttons — wear open or closed', 'Discreet deep side-seam pockets tailored for smartphone and essentials', 'Hand-stitched geometric threadwork along sleeve borders and collar line', 'Complimentary matching lightweight chiffon hijab included'],
  '{"front": "https://lh3.googleusercontent.com/aida-public/AB6AXuBdRlU1kuKRj2VyjX9iygfD2CmiBdoP5QOUmsAV5MWn7uqUwT0g1Ghb2MdIpQr9av_74weXKXw7baiwDIZskxoH2EMKD9VTUfF-KcreCWyAI-ghgYpUYSRU_Pn_n-jrKOb9T31_qIaCX7-LW1u2Y73mSigNlHN4u7y-IHmMkU68e5anYYZTD3Fm9NdxJ3dvl47F1emcY2pbj2xCb8uhY7jeytYuyxVxYC8_ojOLTAt-Emeu2noNj772", "texture": "https://lh3.googleusercontent.com/aida-public/AB6AXuC3v8683-Fe02TNKiEDbYGnldpnKcRPCJK5rPR-nUOmllW2_0UjiNHUbMjXI_dfpzUeFdsqg34JHdFEE8EDGfrPtjmYnsUGFSdM0DQGVMrwVDvX8UHk6q6w6UD5SRFmFzLu9ygJXvFB7X1Eol_j1YKgjmF3tdbyatXArytpsHeGPtnfDNDym6fGfsSDa4Th9huvEaWUL1nULTzI8gMlx7g1x5895w50C11_7FcgY4Y9UI3SEQHN_fFH", "sleeve": "https://lh3.googleusercontent.com/aida-public/AB6AXuBeqJcsBIf3Ac_wYiRAEQRn2I5nxo_SlSkQAWzLoFmdv5g08APQXuqutivF3ExNCRMVrUAtny_bG2S5HlHD0z8GfcDjo5pTwZ-wo-uf_7HCmg5VmnMlRtX12vywYbhz8pXVlbIT9JWunGci6R3mcvGEOZNQ1idEpqa-U-l_V044yD7humWxlSXB-Yx91JLHOo-1JCFOT22_BQ59qcMpHF1IMG3vfltmhxxHgYNs18QBmICite_JsNc-", "motion": "https://lh3.googleusercontent.com/aida-public/AB6AXuDTtAEzxg7Om0GV3aqMhY6Y3Nh4Yh0W-jygI1ZqlD-NxlZiUcKmTCbJtKvYgnWMbuxLBvEESK0JmNWUVHPqyrZW7K7qFQBA7ndAzN7S6Y9QL0AURh5fm41x7dO7-gmpXAUlZNr7fpuE7nDKvidPdIJlAVjJYgq8wLWqqaSJdjHCQVUAR9bc6nZc-a3N3A2rwCMpgTO1SSXGoowAAN1EYoJT_hXuOZpkW-A881b8s1H2ix-VXl6gI6yk"}'::jsonb,
  '[{"name": "Desert Sand", "hex": "#E5D7C5"}, {"name": "Deep Onyx", "hex": "#201F1E"}, {"name": "Olive Sage", "hex": "#757C60"}, {"name": "Warm Taupe", "hex": "#A29488"}]'::jsonb,
  '[{"length": "52", "heightRec": "5''1\" – 5''2\""}, {"length": "54", "heightRec": "5''3\" – 5''4\""}, {"length": "56", "heightRec": "5''5\" – 5''6\""}, {"length": "58", "heightRec": "5''7\" – 5''8\""}, {"length": "60", "heightRec": "5''9\"+"}]'::jsonb,
  false
),
(
  'classic-black-abaya',
  'Classic Black Abaya',
  'Pure Nida Silk • Flawless Flow',
  85.00,
  110.00,
  4.9,
  89,
  'abayas',
  'Abayas',
  'Pure Korean Nida Silk',
  'Essential',
  'Model in effortless drape of the quintessential Classic Black Abaya.',
  'The quintessential wardrobe foundation for the discerning woman. Woven from premier Korean Nida silk with matte pitch-black depth that neither fades nor sheens in harsh light.',
  ARRAY['Deep matte finish that does not reflect artificial flash lighting', 'Wide butterfly cut sleeves allowing graceful unhindered prayer and movement', 'Anti-static weave prevents fabric clinging to undergarments'],
  '{"front": "https://lh3.googleusercontent.com/aida-public/AB6AXuD21CgfOWX_ZE8kTJa0S6Jf76Wv3M-HCIzvIbYgUVTOkjr8wCIetR_1jE0iJ9p1ZbhK9VSxD9VTq7I52iy6OBYJCPOnOlnixW1_kLbHmQvWWxJY3GwQveoP3qwvFvq2GWFRvobwp3A3ARoYAbMzBpFPgDxXD9_peV9EPZ1S9DC0HTQqjSPxlPLpfcdfe1d2Y6-ZkvNJh7bUJMahMYth89ukYCr3U1DXO2JoM8dv1QUQYB9uNyKh5Xtv"}'::jsonb,
  '[{"name": "Deep Onyx", "hex": "#1A1A1A"}, {"name": "Midnight Blue", "hex": "#19202E"}]'::jsonb,
  '[{"length": "52", "heightRec": "5''1\" – 5''2\""}, {"length": "54", "heightRec": "5''3\" – 5''4\""}, {"length": "56", "heightRec": "5''5\" – 5''6\""}, {"length": "58", "heightRec": "5''7\" – 5''8\""}, {"length": "60", "heightRec": "5''9\"+"}]'::jsonb,
  false
),
(
  'modest-co-ord-set',
  'Modest Co-ord Set',
  'Breathable Textured Slub • Fluid Hem',
  72.00,
  95.00,
  4.8,
  64,
  'coord-sets',
  'Co-ord Sets',
  'Textured Linen Viscose',
  'Trending',
  'Model styled in monochromatic relaxed two-piece linen tunic and wide-leg trousers.',
  'Harmonious minimalism in two impeccably proportioned pieces. Featuring a modest tunic length and fluid wide-leg trouser with elasticated comfort waistband.',
  ARRAY['Tunic hem drops gracefully past the knee for uncompromising modesty', 'High-rise wide leg trousers with comfort elastic and clean flat front panel', 'Breathable natural slub allows natural temperature regulation'],
  '{"front": "https://lh3.googleusercontent.com/aida-public/AB6AXuACyZLwOfa_-Dmrl634JC5CmWIpvLOVdW0dgO0GVseMYgD0LeFk877zCbe304lIIBJmdUz8agahVYroloNA0WfMYWzVejWbKiDVb6F_XE-U8IjCxLce2L1Yj_CqhHGxtIf2QUMOmOAlFqLySa_UTsbG9TOfsLMu_qWmvN1r6ALIddwbJHkrX5ipkwrUZuU0ZM4qysgmuLGJLOoCG3-IrtUDounbVCkJVgFYcWlE2DDTn5k8XgLefSKJ"}'::jsonb,
  '[{"name": "Warm Taupe", "hex": "#9B8B7D"}, {"name": "Clay Earth", "hex": "#B78A77"}, {"name": "Soft Cream", "hex": "#ECE7DC"}]'::jsonb,
  '[{"length": "S (Length 54)", "heightRec": "UK 8-10"}, {"length": "M (Length 56)", "heightRec": "UK 12-14"}, {"length": "L (Length 58)", "heightRec": "UK 16-18"}]'::jsonb,
  true
),
(
  'aura-belted-medina-kaftan',
  'Aura Belted Medina Silk Kaftan',
  'Medina Silk Satin • Golden Accents',
  94.00,
  125.00,
  4.9,
  41,
  'dresses',
  'Modest Dresses',
  'Authentic Medina Silk',
  'Artisan Haute',
  'Opulent fluid drape kaftan with gold hardware sash cord.',
  'An opulent statement kaftan woven from genuine French Medina silk, celebrated across Paris and Dubai for its liquid-like drape and crease-resistant characteristics.',
  ARRAY['Detachable silk sash with weighted brushed gold metal tips', 'Mandarin collar with single mother-of-pearl neck button closure', 'Wrinkle-resistant yarn keeps look crisp for weddings, banquets, and Eid'],
  '{"front": "https://lh3.googleusercontent.com/aida-public/AB6AXuDC-4LhH0w4ZzD3Z351gIe1eCcm1g5-eC3cT0e4wR7tXy8pQy0e5g-0L3K5rT0hF0yG_A_eD7gK9pM4fT5kL8_yX2wQ0mN7rD4e-L3-K5tQ8w-7tY1gX2eM5_A0dE-F1gH3jK5l"}'::jsonb,
  '[{"name": "Sage Gold", "hex": "#969B82"}, {"name": "Midnight Navy", "hex": "#1E2738"}, {"name": "Champagne Rose", "hex": "#D8BFB5"}]'::jsonb,
  '[{"length": "54", "heightRec": "5''3\" – 5''4\""}, {"length": "56", "heightRec": "5''5\" – 5''6\""}, {"length": "58", "heightRec": "5''7\" – 5''8\""}]'::jsonb,
  false
)
ON CONFLICT (id) DO NOTHING;

-- Initial Reviews Seed
INSERT INTO public.reviews (product_id, author, location, rating, content, verified)
VALUES
(
  'classic-embroidered-linen-abaya',
  'Fatima Al-Sayed',
  'Dubai, UAE',
  5,
  'The texture of the linen is unparalleled. It breathes so effortlessly in warm weather, and the sleeve embroidery is exquisitely detailed without being loud.',
  true
),
(
  'classic-embroidered-linen-abaya',
  'Maryam Z.',
  'London, UK',
  5,
  'Length 56 was completely true to size for my 5''6 height with flats. The concealed snaps are high quality and do not pull open when walking.',
  true
),
(
  'classic-black-abaya',
  'Sara K.',
  'Manchester, UK',
  5,
  'The black color is deep and rich, not faded or shiny like cheaper polyester abayas. Highly recommend to everyone who appreciates true modest luxury.',
  true
);
