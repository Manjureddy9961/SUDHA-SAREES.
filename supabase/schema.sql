-- ==============================================================================
-- SUDHA SAREES - SUPABASE SCHEMA & SECURITY CONFIGURATION
-- Rayachoty, Andhra Pradesh
-- ==============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. ENUMS & DOMAINS
DO $$ BEGIN
    CREATE TYPE booking_status AS ENUM ('new', 'contacted', 'confirmed', 'cancelled');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 3. SAREE TYPES TABLE
CREATE TABLE IF NOT EXISTS public.saree_types (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    cover_image_url TEXT NOT NULL,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. SAREES TABLE
CREATE TABLE IF NOT EXISTS public.sarees (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    type_id UUID REFERENCES public.saree_types(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    price NUMERIC(10, 2) NOT NULL,
    original_price NUMERIC(10, 2),
    fabric TEXT NOT NULL,
    color TEXT NOT NULL,
    description TEXT NOT NULL,
    images JSONB DEFAULT '[]'::jsonb NOT NULL,
    in_stock BOOLEAN DEFAULT true NOT NULL,
    featured BOOLEAN DEFAULT false NOT NULL,
    attributes JSONB DEFAULT '{}'::jsonb NOT NULL, 
    -- attributes can contain: { zari_type, occasion, origin, blouse_included, care, weave_technique }
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. WISHLISTS TABLE (Supports device-based UUID or authenticated user UUID)
CREATE TABLE IF NOT EXISTS public.wishlists (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_or_device_id TEXT NOT NULL,
    saree_id UUID REFERENCES public.sarees(id) ON DELETE CASCADE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    CONSTRAINT unique_user_saree UNIQUE (user_or_device_id, saree_id)
);

-- 6. PRE-BOOKINGS TABLE
CREATE TABLE IF NOT EXISTS public.prebookings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    saree_id TEXT, -- Saree identifier
    saree_name TEXT NOT NULL,
    saree_image_url TEXT,
    customer_name TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    customer_email TEXT,
    customer_address TEXT,
    preferred_date DATE,
    notes TEXT,
    reference_image_url TEXT,
    status booking_status DEFAULT 'new' NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 7. ADMINS TABLE (Role-based access linked to Supabase Auth)
CREATE TABLE IF NOT EXISTS public.admins (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    role TEXT DEFAULT 'admin' NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 8. HELPER FUNCTION: Check if requesting user is verified admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.admins
        WHERE user_id = auth.uid()
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 9. ROW LEVEL SECURITY (RLS) POLICIES

-- Enable RLS on all tables
ALTER TABLE public.saree_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sarees ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wishlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.prebookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admins ENABLE ROW LEVEL SECURITY;

-- SAREE TYPES: Public can read, only verified admins can modify
CREATE POLICY "Public can view saree types"
    ON public.saree_types FOR SELECT
    USING (true);

CREATE POLICY "Admins can insert saree types"
    ON public.saree_types FOR INSERT
    WITH CHECK (public.is_admin());

CREATE POLICY "Admins can update saree types"
    ON public.saree_types FOR UPDATE
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

CREATE POLICY "Admins can delete saree types"
    ON public.saree_types FOR DELETE
    USING (public.is_admin());

-- SAREES: Public can read, only verified admins can modify
CREATE POLICY "Public can view sarees"
    ON public.sarees FOR SELECT
    USING (true);

CREATE POLICY "Admins can insert sarees"
    ON public.sarees FOR INSERT
    WITH CHECK (public.is_admin());

CREATE POLICY "Admins can update sarees"
    ON public.sarees FOR UPDATE
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

CREATE POLICY "Admins can delete sarees"
    ON public.sarees FOR DELETE
    USING (public.is_admin());

-- WISHLISTS: Anyone can manage their own wishlist items using user_or_device_id
CREATE POLICY "Anyone can view their own wishlist items"
    ON public.wishlists FOR SELECT
    USING (true);

CREATE POLICY "Anyone can insert wishlist items"
    ON public.wishlists FOR INSERT
    WITH CHECK (true);

CREATE POLICY "Anyone can delete their own wishlist items"
    ON public.wishlists FOR DELETE
    USING (true);

-- PRE-BOOKINGS: Public can insert their bookings; Only Admins can view and update status
CREATE POLICY "Public can create pre-bookings"
    ON public.prebookings FOR INSERT
    WITH CHECK (true);

CREATE POLICY "Admins can view pre-bookings"
    ON public.prebookings FOR SELECT
    USING (public.is_admin());

CREATE POLICY "Admins can update pre-bookings"
    ON public.prebookings FOR UPDATE
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

CREATE POLICY "Admins can delete pre-bookings"
    ON public.prebookings FOR DELETE
    USING (public.is_admin());

-- ADMINS: Only authenticated users who are admins can view admins table
CREATE POLICY "Admins can view admins list"
    ON public.admins FOR SELECT
    USING (public.is_admin());

-- 10. STORAGE BUCKETS (Execute in Supabase SQL editor or via storage API)
INSERT INTO storage.buckets (id, name, public)
VALUES ('saree-media', 'saree-media', true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public)
VALUES ('prebooking-references', 'prebooking-references', true)
ON CONFLICT (id) DO NOTHING;

-- Storage RLS: saree-media is publicly readable, writable by admins
CREATE POLICY "Public can view saree images"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'saree-media');

CREATE POLICY "Admins can upload saree images"
    ON storage.objects FOR INSERT
    WITH CHECK (bucket_id = 'saree-media' AND public.is_admin());

CREATE POLICY "Admins can update/delete saree images"
    ON storage.objects FOR ALL
    USING (bucket_id = 'saree-media' AND public.is_admin());

-- Storage RLS: prebooking-references can be uploaded by anyone, read by admins
CREATE POLICY "Public can upload prebooking references"
    ON storage.objects FOR INSERT
    WITH CHECK (bucket_id = 'prebooking-references');

CREATE POLICY "Admins can view prebooking references"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'prebooking-references' AND public.is_admin());

-- ==============================================================================
-- 11. SEED DATA: SAREE TYPES & AUTHENTIC HANDLOOM SAREES
-- ==============================================================================

-- Insert Saree Types
INSERT INTO public.saree_types (id, slug, name, description, cover_image_url, display_order)
VALUES
    ('a1111111-1111-1111-1111-111111111111', 'kanchipuram', 'Kanchipuram Silk', 'Timeless royal bridal silks handwoven with pure mulberry silk and pure gold zari borders.', 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1000&q=80', 1),
    ('a2222222-2222-2222-2222-222222222222', 'banarasi', 'Banarasi Brocade', 'Regal Mughal-inspired motifs, intricate floral jaal, and opulent antique zari craftsmanship.', 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=1000&q=80', 2),
    ('a3333333-3333-3333-3333-333333333333', 'pochampally', 'Pochampally Ikkat', 'Geometric mastery woven in vibrant natural silks with traditional double-ikkat tie-dye technique.', 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=1000&q=80', 3),
    ('a4444444-4444-4444-4444-444444444444', 'gadwal', 'Gadwal Silk', 'Lightweight body in pure uncrushable silk with hand-interlocked contrasting heavy zari borders.', 'https://images.unsplash.com/photo-1609357605129-26f69add5d6e?auto=format&fit=crop&w=1000&q=80', 4),
    ('a5555555-5555-5555-5555-555555555555', 'dharmavaram', 'Dharmavaram Silk', 'Renowned Rayalaseema specialty featuring broad temple borders, grand pallu, and rich solid dyes.', 'https://images.unsplash.com/photo-1610030469668-93510cb28665?auto=format&fit=crop&w=1000&q=80', 5),
    ('a6666666-6666-6666-6666-666666666666', 'chanderi', 'Pure Chanderi', 'Airy gossamer silk-cotton with exquisite gold zari butis, ideal for festive celebrations.', 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=1000&q=80', 6),
    ('a7777777-7777-7777-7777-777777777777', 'organza', 'Designer Organza', 'Contemporary translucent elegance embellished with delicate hand embroidery and scalloped borders.', 'https://images.unsplash.com/photo-1609357605129-26f69add5d6e?auto=format&fit=crop&w=1000&q=80', 7),
    ('a8888888-8888-8888-8888-888888888888', 'bridal', 'Bridal Heritage', 'Handcrafted royal heirlooms designed for the grand South Indian wedding ceremony.', 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1000&q=80', 8)
ON CONFLICT (slug) DO NOTHING;

-- Insert Sample Sarees
INSERT INTO public.sarees (id, type_id, name, slug, price, original_price, fabric, color, description, images, in_stock, featured, attributes)
VALUES
    (
        'b1111111-1111-1111-1111-111111111111',
        'a1111111-1111-1111-1111-111111111111',
        'Kanchipuram Crimson Royal Bridal Silk',
        'kanchipuram-crimson-royal-bridal-silk',
        28500.00,
        34000.00,
        'Pure Mulberry Silk (Silk Mark Certified)',
        'Crimson Maroon & Gold',
        'An opulent bridal masterpiece woven with three-ply mulberry silk and authentic gold zari. Features elaborate mayil (peacock) and rudraksha motifs across the border, culminating in a grand contrast pallu.',
        '[
            "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1200&q=85",
            "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=1200&q=85",
            "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=1200&q=85"
        ]'::jsonb,
        true,
        true,
        '{
            "zari_type": "Pure Half-Fine Gold Zari",
            "occasion": "Bridal / Muhurtham",
            "origin": "Kanchipuram, Tamil Nadu",
            "blouse_included": "Contrast Crimson Silk Blouse with Zari Border (80 cm)",
            "care": "Dry Clean Only. Store wrapped in pure muslin cloth.",
            "weave_technique": "Korvai Interlocking Handloom"
        }'::jsonb
    ),
    (
        'b2222222-2222-2222-2222-222222222222',
        'a2222222-2222-2222-2222-222222222222',
        'Banarasi Katan Silk Antique Jaal',
        'banarasi-katan-silk-antique-jaal',
        22400.00,
        27500.00,
        'Pure Katan Silk',
        'Royal Magenta & Antique Gold',
        'Woven in the ancient city of Varanasi, this Katan silk saree embodies centuries of royal craftsmanship with intricate kadwa floral jaal work and a rich meenakari border.',
        '[
            "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=1200&q=85",
            "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1200&q=85"
        ]'::jsonb,
        true,
        true,
        '{
            "zari_type": "Tested Antique Gold Zari",
            "occasion": "Reception / Festive Gala",
            "origin": "Varanasi, Uttar Pradesh",
            "blouse_included": "Running Magenta Silk Blouse Piece with Brocade Sleeves",
            "care": "Dry clean only. Avoid spraying perfumes directly on fabric.",
            "weave_technique": "Handwoven Kadwa Technique"
        }'::jsonb
    ),
    (
        'b3333333-3333-3333-3333-333333333333',
        'a3333333-3333-3333-3333-333333333333',
        'Pochampally Double Ikkat Silk',
        'pochampally-double-ikkat-silk',
        16800.00,
        19500.00,
        'Handloom Pure Silk',
        'Peacock Teal & Mustard',
        'A celebration of geometric elegance, this Pochampally Ikkat features intricate double-ikkat tie-dye chevron motifs in peacock green with a warm mustard contrast border.',
        '[
            "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=1200&q=85",
            "https://images.unsplash.com/photo-1609357605129-26f69add5d6e?auto=format&fit=crop&w=1200&q=85"
        ]'::jsonb,
        true,
        true,
        '{
            "zari_type": "Gold Tissue Zari Border",
            "occasion": "Festive / Puja / Family Celebrations",
            "origin": "Bhoodan Pochampally, Telangana",
            "blouse_included": "Mustard Plain Silk Blouse Piece",
            "care": "Dry Clean recommended for the first 3 washes.",
            "weave_technique": "Patan Patola inspired Double Ikkat"
        }'::jsonb
    ),
    (
        'b4444444-4444-4444-4444-444444444444',
        'a4444444-4444-4444-4444-444444444444',
        'Gadwal Pure Silk Temple Border',
        'gadwal-pure-silk-temple-border',
        18900.00,
        23000.00,
        'Gadwal Mulberry Silk',
        'Ivory & Coral Pink',
        'Famous for its kuttu interlocked technique, this pristine ivory silk saree is accentuated by traditional temple (kumbham) zari spikes on a rich coral pink border.',
        '[
            "https://images.unsplash.com/photo-1609357605129-26f69add5d6e?auto=format&fit=crop&w=1200&q=85",
            "https://images.unsplash.com/photo-1610030469668-93510cb28665?auto=format&fit=crop&w=1200&q=85"
        ]'::jsonb,
        true,
        false,
        '{
            "zari_type": "Silver & Gold Bavanji Zari",
            "occasion": "Traditional Ceremonies",
            "origin": "Gadwal, Telangana / AP",
            "blouse_included": "Contrast Coral Pink Brocade Blouse",
            "care": "Dry Clean Only",
            "weave_technique": "Kuttu Seemless Interlocking"
        }'::jsonb
    ),
    (
        'b5555555-5555-5555-5555-555555555555',
        'a5555555-5555-5555-5555-555555555555',
        'Dharmavaram Heavy Brocade Silk',
        'dharmavaram-heavy-brocade-silk',
        21500.00,
        26000.00,
        'Dharmavaram Pure Silk',
        'Deep Plum & Gilded Gold',
        'A beloved staple of Rayalaseema weddings, handcrafted with heavy gold zari brocade, ornate paisleys, and an expansive royal pallu that shines under wedding lights.',
        '[
            "https://images.unsplash.com/photo-1610030469668-93510cb28665?auto=format&fit=crop&w=1200&q=85",
            "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1200&q=85"
        ]'::jsonb,
        true,
        true,
        '{
            "zari_type": "Pure Gold Tested Zari",
            "occasion": "Bridal / Seemantham",
            "origin": "Dharmavaram, Andhra Pradesh",
            "blouse_included": "Deep Plum Heavy Zari Blouse Piece",
            "care": "Dry Clean Only. Roll on wooden spools or cloth.",
            "weave_technique": "Traditional Jacquard Handloom"
        }'::jsonb
    ),
    (
        'b6666666-6666-6666-6666-666666666666',
        'a7777777-7777-7777-7777-777777777777',
        'Embroidered Pastel Organza Silk',
        'embroidered-pastel-organza-silk',
        14200.00,
        17500.00,
        'Pure Silk Organza',
        'Pastel Mint & Blush Gold',
        'Featherlight and gracefully structured, featuring delicate hand-cut scalloped borders with resham and zardozi threadwork. Ideal for contemporary cocktail and sangeet evenings.',
        '[
            "https://images.unsplash.com/photo-1609357605129-26f69add5d6e?auto=format&fit=crop&w=1200&q=85",
            "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=1200&q=85"
        ]'::jsonb,
        true,
        false,
        '{
            "zari_type": "Muted Zardozi & Resham",
            "occasion": "Sangeet / Modern Reception",
            "origin": "Rayachoty Designer Studio",
            "blouse_included": "Unstitched Heavy Embroidered Silk Blouse",
            "care": "Gentle Dry Clean Only",
            "weave_technique": "Powerloom Silk with Hand Artistry"
        }'::jsonb
    )
ON CONFLICT (slug) DO NOTHING;
