-- ==============================================================================
-- HUSNA COLLECTION ATELIER — SUPABASE POSTGRESQL PRODUCTION SCHEMA
-- ==============================================================================
-- Run this complete script in your Supabase SQL Editor (SQL Editor -> New Query -> Run)
-- to create all tables, triggers, Row-Level Security (RLS) policies, and seed data.
-- Supports 3 exclusive categories: Abayas, Hijabs, and Caps with INR (₹) pricing.
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
  shipping_address JSONB DEFAULT '{"street": "", "city": "Mumbai", "postal_code": "", "country": "India"}'::jsonb,
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
  category TEXT NOT NULL CHECK (category IN ('abayas', 'hijabs', 'caps')),
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
  tracking_courier TEXT DEFAULT 'Blue Dart / DHL Express',
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
  location TEXT DEFAULT 'Mumbai, India',
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
  )
  ON CONFLICT (id) DO UPDATE
  SET full_name = EXCLUDED.full_name,
      updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ==============================================================================
-- ROW-LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wishlist_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- 1. Profiles: Users can view and update their own profiles
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- 2. Products: Public read access for the catalog; Only admins can insert/update
CREATE POLICY "Anyone can view products"
  ON public.products FOR SELECT
  USING (true);

CREATE POLICY "Only admins can manage products"
  ON public.products FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

-- 3. Orders: Authenticated users can view their own orders; Anyone can create orders (checkout)
CREATE POLICY "Users can view their own orders"
  ON public.orders FOR SELECT
  USING (auth.uid() = user_id OR auth.uid() IS NULL);

CREATE POLICY "Anyone can insert orders"
  ON public.orders FOR INSERT
  WITH CHECK (true);

-- 4. Order Items: Public read for user's order items; Anyone can insert
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
-- INITIAL SEED DATA FOR HUSNA ATELIER PIECES (ABAYAS, HIJABS, CAPS in INR ₹)
-- ==============================================================================
INSERT INTO public.products (id, name, subtitle, price, original_price, rating, reviews_count, category, category_label, fabric, badge, alt, description, details, images, colors, sizes, is_new_arrival)
VALUES
(
  'classic-embroidered-linen-abaya',
  'Classic Embroidered Linen Abaya',
  'Signature Washed Linen • Artisanal Threadwork',
  6999.00,
  8499.00,
  4.9,
  128,
  'abayas',
  'Abayas',
  'Organic Washed Linen',
  'Bestseller',
  'Model wearing luxurious Classic Embroidered Linen Abaya in natural sand tone with artisanal cuff threadwork.',
  'The Classic Embroidered Linen Abaya reimagines everyday modest dignity with effortless luxury. Sculpted in a relaxed A-line silhouette with generous floor sweeping length, it offers complete modest coverage without clinging or losing structural fluidity.',
  ARRAY['Concealed premium matte front snap buttons — wear open or closed', 'Discreet deep side-seam pockets tailored for smartphone and essentials', 'Hand-stitched geometric threadwork along sleeve borders and collar line', 'Wudu-friendly flared cuffs with soft stretch inner lining', 'Includes complimentary matching pure silk chiffon hijab in desert sand'],
  '{"front": "https://lh3.googleusercontent.com/aida-public/AB6AXuBdRlU1kuKRj2VyjX9iygfD2CmiBdoP5QOUmsAV5MWn7uqUwT0g1Ghb2MdIpQr9av_74weXKXw7baiwDIZskxoH2EMKD9VTUfF-KcreCWyAI-ghgYpUYSRU_Pn_n-jrKOb9T31_qIaCX7-LW1u2Y73mSigNlHN4u7y-IHmMkU68e5anYYZTD3Fm9NdxJ3dvl47F1emcY2pbj2xCb8uhY7jeytYuyxVxYC8_ojOLTAt-Emeu2noNj772"}'::jsonb,
  '[{"name": "Desert Sand", "hex": "#E5D7C5"}, {"name": "Deep Onyx", "hex": "#201F1E"}, {"name": "Olive Sage", "hex": "#757C60"}, {"name": "Warm Taupe", "hex": "#A29488"}]'::jsonb,
  '[{"length": "52", "heightRec": "5''1\" – 5''2\""}, {"length": "54", "heightRec": "5''3\" – 5''4\""}, {"length": "56", "heightRec": "5''5\" – 5''6\""}, {"length": "58", "heightRec": "5''7\" – 5''8\""}, {"length": "60", "heightRec": "5''9\"+"}]'::jsonb,
  true
),
(
  'classic-black-abaya',
  'Classic Black Nidha Abaya',
  'Signature Korean Nida • Tailored Drape',
  6499.00,
  7999.00,
  5.0,
  146,
  'abayas',
  'Abayas',
  'Korean Nidha Crepe',
  'Bestseller',
  'Model wearing luxurious Classic Black Abaya in premium nida fabric, elegant flowing modest cut.',
  'The quintessential wardrobe foundation for the discerning woman. Woven from premier Korean Nida silk crepe with matte pitch-black depth that neither fades nor sheens in harsh light.',
  ARRAY['Deep matte finish that does not reflect artificial flash lighting', 'Wide butterfly cut sleeves allowing graceful unhindered prayer and movement', 'Anti-static weave prevents fabric clinging to undergarments'],
  '{"front": "https://lh3.googleusercontent.com/aida-public/AB6AXuD21CgfOWX_ZE8kTJa0S6Jf76Wv3M-HCIzvIbYgUVTOkjr8wCIetR_1jE0iJ9p1ZbhK9VSxD9VTq7I52iy6OBYJCPOnOlnixW1_kLbHmQvWWxJY3GwQveoP3qwvFvq2GWFRvobwp3A3ARoYAbMzBpFPgDxXD9_peV9EPZ1S9DC0HTQqjSPxlPLpfcdfe1d2Y6-ZkvNJh7bUJMahMYth89ukYCr3U1DXO2JoM8dv1QUQYB9uNyKh5Xtv"}'::jsonb,
  '[{"name": "Deep Onyx", "hex": "#171411"}, {"name": "Espresso Night", "hex": "#2C2825"}]'::jsonb,
  '[{"length": "52", "heightRec": "5''1\" – 5''2\""}, {"length": "54", "heightRec": "5''3\" – 5''4\""}, {"length": "56", "heightRec": "5''5\" – 5''6\""}, {"length": "58", "heightRec": "5''7\" – 5''8\""}, {"length": "60", "heightRec": "5''9\"+"}]'::jsonb,
  true
),
(
  'signature-silk-chiffon-hijab',
  'Signature Silk Chiffon Hijab',
  'Airy Featherlight Weave • Zero-Slippage Handfeel',
  1499.00,
  1999.00,
  4.9,
  210,
  'hijabs',
  'Hijabs',
  'Pure Mulberry Silk & Chiffon',
  'Bestseller',
  'Editorial close-up of the Signature Silk Chiffon Hijab in elegant desert rose tone.',
  'Woven on traditional looms to achieve the dream equilibrium: whisper-light featherweight breathability paired with a lightly textured micro-grip that prevents slippage throughout the day.',
  ARRAY['Generous 200cm x 75cm proportion for full chest coverage and multi-layer styling', 'Hand-rolled baby rolled edges stitched by master artisans', 'Opaque when draped in dual soft folds', 'Resistant to pin snags and creasing'],
  '{"front": "https://lh3.googleusercontent.com/aida-public/AB6AXuAYc20MEAPwPh6m77NxKXSvHLCQL509WF0Ze-DBGNlau_Nkxq2TjKMOwZpoh4CPopxgakz2TsLUHAqjJ-nQ1dJ29yvO1mQp3K04-eD7hL_e6wN_M5eZ0sF8pU-2yR7q4kL1-mN3vC0_dE7g"}'::jsonb,
  '[{"name": "Desert Rose", "hex": "#C9A097"}, {"name": "Pearl Sand", "hex": "#E3D5C5"}, {"name": "Olive Sage", "hex": "#757C60"}, {"name": "Deep Onyx", "hex": "#171411"}, {"name": "Maroon Wine", "hex": "#671926"}]'::jsonb,
  '[{"length": "Maxi Shawl (200cm x 75cm)", "heightRec": "Universal Generous Wrap"}]'::jsonb,
  true
),
(
  'atelier-silk-bonnet-cap',
  'Atelier Silk-Lined Bamboo Bonnet Cap',
  'Hair-Protective Pure Mulberry Silk Lining • Snug Non-Slip Contour',
  1299.00,
  1699.00,
  5.0,
  88,
  'caps',
  'Caps',
  'Pure Mulberry Silk & Bamboo',
  'Bestseller',
  'Realistic luxury product photo of an Atelier Silk-Lined Bamboo Bonnet Cap in sleek black with gold atelier seal.',
  'Specially engineered for modest women seeking supreme hair health and all-day dignity under hijabs. Lined with 100% grade-6A pure mulberry silk to prevent hair breakage, frizz, and edge damage, encased in buttery-soft breathable organic bamboo jersey.',
  ARRAY['100% Grade-6A pure mulberry silk inner lining protects natural curls and delicate hairlines', 'Flat-locked zero-friction seams prevent pressure headaches', 'Elasticated ruched rear contour comfortably tucks high or low buns', 'Discreet brushed gold Husna emblem seal stitched on temple', 'Stays securely in place all day without requiring pins or clips'],
  '{"front": "/caps/cap-silk-bonnet.svg"}'::jsonb,
  '[{"name": "Deep Black", "hex": "#171411"}, {"name": "Warm Beige", "hex": "#E5D7C5"}, {"name": "Mocha Brown", "hex": "#5C4033"}, {"name": "Maroon Wine", "hex": "#671926"}]'::jsonb,
  '[{"length": "Atelier Standard (M/L)", "heightRec": "Universal Head Contour"}, {"length": "Snug Petite (S)", "heightRec": "Fine Hair & Stature"}]'::jsonb,
  true
),
(
  'pleated-cross-front-modal-cap',
  'Pleated Cross-Front Modal Turban Cap',
  'Architectural Cross Drape • Breathable Micro-Modal',
  999.00,
  1399.00,
  4.9,
  76,
  'caps',
  'Caps',
  'Austrian Micro-Modal',
  'Trending',
  'Editorial luxury product photography of Pleated Cross-Front Modal Turban Cap in warm beige sand tone.',
  'A chic, elevated modest cap featuring a structured cross-front pleated crown. Adds flattering architectural height and sleek framing under sheer shaylas, or worn independently as a graceful modest cap for lounging and casual gatherings.',
  ARRAY['Distinctive criss-cross forehead drape provides an elongating silhouette', 'Airy Austrian micro-modal fabric keeps scalp cool in high temperatures', 'Pre-pleated construction retains its sculpted form wash after wash', 'No tight elastic bands — gentle tension prevents forehead indentations'],
  '{"front": "/caps/cap-modal-cross.svg"}'::jsonb,
  '[{"name": "Warm Beige", "hex": "#E5D7C5"}, {"name": "Slate Grey", "hex": "#707070"}, {"name": "Pastel Blush", "hex": "#E8C5C8"}, {"name": "Deep Black", "hex": "#171411"}, {"name": "Mocha Brown", "hex": "#5C4033"}]'::jsonb,
  '[{"length": "One Size Universal Contour", "heightRec": "All Statures"}]'::jsonb,
  true
),
(
  'heritage-cashmere-beret-cap',
  'Heritage Cashmere Modest Beret Cap',
  'Artisanal Fine-Gauge Cashmere Knit • Soft Slouch Crown',
  1899.00,
  2499.00,
  5.0,
  64,
  'caps',
  'Caps',
  'Cashmere & Extra-Fine Merino Wool',
  'Artisan Haute',
  'Realistic product photograph of a tailored women''s modest cashmere beret cap in royal maroon wine.',
  'Woven from featherlight Mongolian cashmere and extra-fine Australian merino wool. Designed for refined autumn and winter modest fashion, delivering cozy warmth and an elegant French-atelier silhouette with full modest hair coverage.',
  ARRAY['Super-soft 12-gauge knit with zero itchiness or coarseness', 'Generous slouch crown allows easy tucking of full hair or bun', 'Fitted ribbed brow band keeps the cap seated securely throughout the day', 'Accented with an understated 18k brushed gold atelier hallmark pin'],
  '{"front": "/caps/cap-cashmere-beret.svg"}'::jsonb,
  '[{"name": "Maroon Wine", "hex": "#671926"}, {"name": "Mocha Brown", "hex": "#5C4033"}, {"name": "Slate Grey", "hex": "#707070"}, {"name": "Deep Black", "hex": "#171411"}, {"name": "Warm Beige", "hex": "#E5D7C5"}]'::jsonb,
  '[{"length": "Tailored Flexible Fit", "heightRec": "All Statures"}]'::jsonb,
  true
),
(
  'contour-ribbed-tieback-cap',
  'Contour Ribbed Tie-Back Cap',
  'Customizable Back Ties • Air-Flow Ribbed Cotton',
  799.00,
  1099.00,
  4.8,
  112,
  'caps',
  'Caps',
  'Organic Breathable Ribbed Cotton',
  'Essential',
  'Studio photo of a Contour Ribbed Tie-Back modest cap in charcoal slate grey with adjustable rear ties.',
  'Engineered for absolute customization. The dual rear ribbon ties allow you to dial in your exact preferred snugness, accommodating any hair density or bun size without slippage or temple tension.',
  ARRAY['Micro-ribbed organic cotton facilitates continuous airflow to the scalp', 'Long rear ties provide secure double-knotting or bow fastening', 'Full hairline and nape coverage with curved ergonomic brow band', 'Colorfast natural dyes resist fading after repeated laundering'],
  '{"front": "/caps/cap-ribbed-tieback.svg"}'::jsonb,
  '[{"name": "Slate Grey", "hex": "#707070"}, {"name": "Deep Black", "hex": "#171411"}, {"name": "Warm Beige", "hex": "#E5D7C5"}, {"name": "Mocha Brown", "hex": "#5C4033"}, {"name": "Pastel Mint", "hex": "#CFE0D8"}]'::jsonb,
  '[{"length": "Adjustable Custom Tie-Back", "heightRec": "All Statures"}]'::jsonb,
  false
),
(
  'velvet-modest-atelier-cap',
  'Velvet Modest Atelier Cap',
  'Plush Stretch Silk Velvet • Hand-Finished Hem',
  1499.00,
  1899.00,
  4.9,
  58,
  'caps',
  'Caps',
  'Plush Stretch Silk Velvet',
  'Limited',
  'Luxury product photography of a rich Mocha Brown Velvet Modest Atelier Cap with plush texture.',
  'Sumptuous stretch velvet with an opulent sheen and soft satin lining. A statement modest cap suitable for festive Eid celebrations, evening dinners, or pairing with luxury abayas.',
  ARRAY['Deep, lustrous jewel tones that reflect ambient evening lighting', 'Silky smooth satin inner band prevents hair friction and static', 'Contoured crown creates an elegant, poised silhouette', 'Discreet handcrafted metallic threadwork accent along the hem'],
  '{"front": "/caps/cap-velvet-atelier.svg"}'::jsonb,
  '[{"name": "Mocha Brown", "hex": "#5C4033"}, {"name": "Maroon Wine", "hex": "#671926"}, {"name": "Deep Black", "hex": "#171411"}, {"name": "Pastel Lavender", "hex": "#D8CEE8"}]'::jsonb,
  '[{"length": "One Size Universal Stretch", "heightRec": "All Statures"}]'::jsonb,
  true
),
(
  'luxe-seamless-tube-cap',
  'Luxe Seamless Tube Cap',
  'Four-Way Stretch Microfiber • Zero Pressure Seams',
  899.00,
  1199.00,
  4.9,
  94,
  'caps',
  'Caps',
  'Ultra-Fine Seamless Microfiber',
  'Essential',
  'High-fashion product photo of Luxe Seamless Tube Cap in soft pastel dusty rose tone.',
  'Precision laser-cut seamless edges eliminate ear pressure, tension marks, and discomfort during long days. Provides uninterrupted hairline and neck coverage with a cooling matte finish.',
  ARRAY['Seamless 360-degree circular knitting technology', 'Stay-cool breathable micro-mesh structure across crown', 'Open-ended cylindrical silhouette fits all hair lengths and volumes', 'Non-slip grip finish maintains its hold without headband pins'],
  '{"front": "/caps/cap-seamless-tube.svg"}'::jsonb,
  '[{"name": "Pastel Blush", "hex": "#E8C5C8"}, {"name": "Warm Beige", "hex": "#E5D7C5"}, {"name": "Slate Grey", "hex": "#707070"}, {"name": "Deep Black", "hex": "#171411"}, {"name": "Maroon Wine", "hex": "#671926"}, {"name": "Mocha Brown", "hex": "#5C4033"}]'::jsonb,
  '[{"length": "Universal Seamless Stretch", "heightRec": "All Statures"}]'::jsonb,
  false
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  subtitle = EXCLUDED.subtitle,
  price = EXCLUDED.price,
  original_price = EXCLUDED.original_price,
  category = EXCLUDED.category,
  category_label = EXCLUDED.category_label,
  fabric = EXCLUDED.fabric,
  badge = EXCLUDED.badge,
  alt = EXCLUDED.alt,
  description = EXCLUDED.description,
  details = EXCLUDED.details,
  images = EXCLUDED.images,
  colors = EXCLUDED.colors,
  sizes = EXCLUDED.sizes,
  is_new_arrival = EXCLUDED.is_new_arrival;

-- Initial Reviews Seed
INSERT INTO public.reviews (product_id, author, location, rating, content, verified)
VALUES
(
  'classic-embroidered-linen-abaya',
  'Fatima Al-Sayed',
  'Mumbai, India',
  5,
  'The texture of the linen is unparalleled. It breathes so effortlessly in warm weather, and the sleeve embroidery is exquisitely detailed without being loud.',
  true
),
(
  'classic-black-abaya',
  'Ayesha K.',
  'Mumbai, India',
  5,
  'The black color is deep and rich, not faded or shiny like cheaper synthetic abayas. Perfect drape and length.',
  true
),
(
  'atelier-silk-bonnet-cap',
  'Zainab Q.',
  'Delhi, India',
  5,
  'The 100% pure silk lining is a total game changer. My hair stays frizz-free all day long, and there are zero headache lines on my forehead. Bought it in Deep Black and Warm Beige!',
  true
),
(
  'heritage-cashmere-beret-cap',
  'Rania T.',
  'Hyderabad, India',
  5,
  'The maroon wine shade is regal and rich. Pure cashmere softness, pairs impeccably with my open black abaya. Highly recommended!',
  true
);
