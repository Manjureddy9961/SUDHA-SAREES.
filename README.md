# Sudha Sarees &mdash; Royal Heritage Handloom Boutique

> A production-ready, multi-page web application for **Sudha Sarees**, an authentic saree retail boutique located in Rayachoty, Annamayya District, Andhra Pradesh.

Crafted with **React 18**, **Vite**, **Tailwind CSS**, **Framer Motion**, and **Supabase** (Postgres, Auth, Storage, and Row-Level Security).

---

## 🌺 Brand Identity & Design System

- **Palette**:
  - Deep Maroon / Magenta (`#7B1E3A`, `#561226`)
  - Royal Gold (`#C9A24B`, `#DFC06C`, `#A47F2E`)
  - Blush Pink (`#F7E1E7`)
  - Warm Silk Ivory (`#FFF8F0`, `#FAF3EA`)
  - Peacock Teal Accent (`#0D5C5A`)
- **Typography**:
  - Headings: *Cormorant Garamond* & *Playfair Display*
  - Body: *Poppins*
- **Aesthetic**: Feminine, festive, regal South Indian temple borders, delicate gold zari dividers, floating petals/sparkles, and generous whitespace.
- **Motif & Logo**: Custom SVG vector monogram combining the letter **"S"** with a graceful pallu drape and sacred lotus crest.

---

## ✨ Features & Architecture

### 1. Animated Pages & Micro-Interactions
- **Home**:
  - Hero with animated SVG logo drawing itself in (`pathLength` animation).
  - Letter-by-letter brand name reveal.
  - Floating golden petals & sparkles canvas (respects `prefers-reduced-motion`).
  - Parallax cross-fade saree slideshow.
  - Dynamic saree types marquee.
  - Curated featured sarees with tabbed filters (All, Bridal Muhurtham, Festive).
  - Why Choose Sudha Sarees pillars and animated counters.
  - Customer bride testimonials and pre-booking CTA banner.
- **Sarees Catalog (`/sarees`)**:
  - Multi-facet filter sidebar (Weave Type, Fabric Authenticity, Color Palette, Price Range slider, In-Stock toggle).
  - Real-time search and sorting (Price low-to-high, high-to-low, alphabetical, featured).
- **Saree Type Showcase (`/sarees/:typeSlug`)**:
  - Dynamic route for specific weaves (Kanchipuram, Banarasi, Pochampally, Gadwal, Dharmavaram, etc.).
  - Custom category hero with history of the weave and dedicated collection grid.
- **Saree Product Detail (`/saree/:sareeId`)**:
  - Multi-image gallery with thumbnail switcher.
  - Fullscreen zoom lightbox with keyboard and swipe navigation.
  - Detailed specifications: Fabric, Zari purity, Occasion, Origin, Blouse Piece details, Care instructions.
  - Direct "Pre-book this Saree" button.
  - Add to Wishlist toggle with optimistic UI.
  - WhatsApp click-to-chat with pre-filled saree details & link.
  - Recommended related sarees.
- **Persistent Wishlist (`/wishlist`)**:
  - Synced across visits using a persistent device UUID in `localStorage` and Supabase `wishlists` table.
  - Live count badge in sticky navbar.
- **About Our Heritage (`/about`)**:
  - Story of Sudha Sarees in Rayachoty.
  - Interactive milestones timeline from 1989 to present day.
  - Silk Mark purity guarantee.
- **Contact & Showroom (`/contact`)**:
  - Showroom address: *Opposite New Police Station, Kadiri Road, Rayachoty, Annamayya District, Andhra Pradesh - 516269*.
  - Embedded responsive Google Map.
  - Click-to-call and WhatsApp video consultation button.
  - Message inquiry form.
  - **Secret Admin Trigger**: 2-second continuous press on the Heritage Seal or Send button reveals the admin login portal.

---

## 🔐 Hidden Admin Portal (`/admin`)

There is **no visible admin link** anywhere on the public website.

### How to Access:
1. Navigate to the **Contact** page (`/contact`).
2. Press and hold the **Seal of Authenticity** medallion (or the **"Send Message"** button) continuously for **2 seconds** (supported on both desktop mouse and mobile touch).
3. A gold circular progress ring fills up and opens the **Sudha Sarees Portal** modal.
4. Log in using your Supabase administrator account (or use preview credentials `admin@sudhasarees.com` / `admin123`).

### Admin Capabilities:
- **Real-Time Dashboard**: Live count of active sarees, categories, and pending bookings.
- **Manage Sarees**: Add, edit, or delete sarees with multiple image uploads, price, original price, fabric, color, description, stock status, and featured toggle.
- **Manage Saree Types**: Add, edit, or delete weave categories with cover images and display order.
- **Manage Pre-Bookings**: View customer contact details, delivery address, preferred date, notes, customer-uploaded reference photos (with lightbox zoom), and update status (*new*, *contacted*, *confirmed*, *cancelled*), with direct WhatsApp and Call buttons.

---

## 🛠️ Supabase Database & Security (RLS)

All database tables, policies, and seed data are included in `supabase/schema.sql`.

### Tables Created:
1. `saree_types` &mdash; Categories and traditions
2. `sarees` &mdash; Saree inventory and specifications
3. `prebookings` &mdash; Customer reservation requests
4. `wishlists` &mdash; Device/user saved sarees
5. `admins` &mdash; Verified admin users

### Row-Level Security (RLS) Rules:
- **Public**:
  - Read-only access to `saree_types` and `sarees`.
  - Can `INSERT` new pre-bookings and wishlist items.
  - Can manage their own wishlist items using `user_or_device_id`.
- **Admins Only**:
  - Full `INSERT`, `UPDATE`, `DELETE` permissions on `saree_types` and `sarees`.
  - Can `SELECT`, `UPDATE`, and `DELETE` customer pre-bookings.
  - Secured via PostgreSQL `public.is_admin()` function checking `auth.uid()`.

### Storage Buckets:
- `saree-media` (Public read, Admin upload/modify)
- `prebooking-references` (Public upload, Admin read)

---

## 🚀 Quick Start & Local Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment (Optional for Live Supabase)
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Fill in your Supabase credentials:
```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
VITE_CONTACT_PHONE=+919876543210
VITE_WHATSAPP_NUMBER=919876543210
```

> **Note**: If Supabase keys are not set, the app automatically runs in **Standalone Preview Mode** with persistent `localStorage` and sample handloom sarees, so all features (including pre-booking and admin panel) work immediately out of the box!

### 3. Run Development Server
```bash
npm run dev
```
Open `http://localhost:3000` in your browser.

### 4. Build for Production
```bash
npm run build
```

---

## 🌐 Deploy to Vercel

1. Push your repository to GitHub.
2. In the [Vercel Dashboard](https://vercel.com), click **Add New Project** and select this repository.
3. In **Environment Variables**, add:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `VITE_WHATSAPP_NUMBER`
4. Deploy! `vercel.json` is pre-configured for clean Single Page Application (SPA) routing.
