// Mock initial data used when Supabase is in local/preview mode
export const initialSareeTypes = [
  {
    id: "type-kanchipuram",
    slug: "kanchipuram",
    name: "Kanchipuram Silk",
    description: "Timeless royal bridal silks handwoven with pure mulberry silk and authentic pure gold zari borders from the temple town.",
    cover_image_url: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80",
    display_order: 1
  },
  {
    id: "type-banarasi",
    slug: "banarasi",
    name: "Banarasi Brocade",
    description: "Regal Mughal-inspired motifs, intricate floral jaal, and opulent antique zari craftsmanship woven on fine katan silk.",
    cover_image_url: "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=800&q=80",
    display_order: 2
  },
  {
    id: "type-pochampally",
    slug: "pochampally",
    name: "Pochampally Ikkat",
    description: "Geometric mastery woven in vibrant natural silks with traditional double-ikkat tie-dye technique of Telangana and Andhra.",
    cover_image_url: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80",
    display_order: 3
  },
  {
    id: "type-gadwal",
    slug: "gadwal",
    name: "Gadwal Silk",
    description: "Lightweight body in pure uncrushable silk with hand-interlocked contrasting heavy zari borders and kumbham motifs.",
    cover_image_url: "https://images.unsplash.com/photo-1609357605129-26f69add5d6e?auto=format&fit=crop&w=800&q=80",
    display_order: 4
  },
  {
    id: "type-dharmavaram",
    slug: "dharmavaram",
    name: "Dharmavaram Silk",
    description: "Renowned Rayalaseema specialty featuring broad temple borders, grand pallu, and rich solid dyes suited for grand occasions.",
    cover_image_url: "https://images.unsplash.com/photo-1610030469668-93510cb28665?auto=format&fit=crop&w=800&q=80",
    display_order: 5
  },
  {
    id: "type-chanderi",
    slug: "chanderi",
    name: "Pure Chanderi",
    description: "Airy gossamer silk-cotton with exquisite gold zari butis and sheer drape, ideal for daytime pujas and festive gatherings.",
    cover_image_url: "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=800&q=80",
    display_order: 6
  },
  {
    id: "type-organza",
    slug: "organza",
    name: "Designer Organza",
    description: "Contemporary translucent elegance embellished with delicate hand embroidery, sequins, and scalloped borders.",
    cover_image_url: "https://images.unsplash.com/photo-1609357605129-26f69add5d6e?auto=format&fit=crop&w=800&q=80",
    display_order: 7
  },
  {
    id: "type-bridal",
    slug: "bridal",
    name: "Bridal Heritage",
    description: "Handcrafted royal heirlooms specifically curated for the traditional Muhurtham ceremony and wedding receptions.",
    cover_image_url: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80",
    display_order: 8
  }
];

export const initialSarees = [
  {
    id: "saree-kanchi-crimson",
    type_id: "type-kanchipuram",
    name: "Kanchipuram Crimson Royal Bridal Silk",
    slug: "kanchipuram-crimson-royal-bridal-silk",
    price: 28500,
    original_price: 34000,
    fabric: "Pure Mulberry Silk (Silk Mark Certified)",
    color: "Crimson Maroon & Gold",
    description: "An opulent bridal masterpiece handwoven with 3-ply twisted mulberry silk yarns and genuine half-fine gold zari. The body is adorned with miniature floral rudraksha butas, leading to a majestic 14-inch Korvai border featuring dancing peacocks (Mayil) and mythological Yali motifs.",
    images: [
      "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=1200&q=85"
    ],
    in_stock: true,
    featured: true,
    attributes: {
      zari_type: "Pure Gold Half-Fine Zari",
      occasion: "Bridal / Muhurtham",
      origin: "Kanchipuram, Tamil Nadu",
      blouse_included: "Contrast Crimson Silk Blouse with Zari Border (80 cm)",
      care: "Dry Clean Only. Wrap in muslin cloth.",
      weave_technique: "Korvai Interlocking Handloom"
    }
  },
  {
    id: "saree-banarasi-magenta",
    type_id: "type-banarasi",
    name: "Banarasi Katan Silk Antique Jaal",
    slug: "banarasi-katan-silk-antique-jaal",
    price: 22400,
    original_price: 27500,
    fabric: "Pure Katan Silk",
    color: "Royal Magenta & Antique Gold",
    description: "Centuries of Varanasi weaving traditions brought alive in pure mulberry katan silk. Rich all-over kadwa floral jaal woven with antique gold zari threads and subtle meenakari detailing, completed with an ornate jhallar pallu.",
    images: [
      "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1200&q=85"
    ],
    in_stock: true,
    featured: true,
    attributes: {
      zari_type: "Tested Antique Gold Zari",
      occasion: "Reception / Festive Gala",
      origin: "Varanasi, Uttar Pradesh",
      blouse_included: "Running Magenta Silk Blouse Piece with Brocade Sleeves",
      care: "Dry Clean Only",
      weave_technique: "Handwoven Kadwa Technique"
    }
  },
  {
    id: "saree-pochampally-teal",
    type_id: "type-pochampally",
    name: "Pochampally Double Ikkat Silk",
    slug: "pochampally-double-ikkat-silk",
    price: 16800,
    original_price: 19500,
    fabric: "Handloom Pure Silk",
    color: "Peacock Teal & Mustard",
    description: "A celebration of Andhra-Telangana handloom pride. This authentic double-ikkat saree features mathematical precision in warp and weft tie-dye chevron patterns in jewel-toned peacock teal with a rich mustard and gold tissue border.",
    images: [
      "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1609357605129-26f69add5d6e?auto=format&fit=crop&w=1200&q=85"
    ],
    in_stock: true,
    featured: true,
    attributes: {
      zari_type: "Gold Tissue Zari Border",
      occasion: "Festive / Puja / Family Gatherings",
      origin: "Bhoodan Pochampally, Telangana",
      blouse_included: "Mustard Plain Silk Blouse Piece",
      care: "Dry Clean recommended for the first 3 washes",
      weave_technique: "Patan Patola inspired Double Ikkat"
    }
  },
  {
    id: "saree-gadwal-ivory",
    type_id: "type-gadwal",
    name: "Gadwal Pure Silk Temple Border",
    slug: "gadwal-pure-silk-temple-border",
    price: 18900,
    original_price: 23000,
    fabric: "Gadwal Mulberry Silk",
    color: "Ivory & Coral Pink",
    description: "Crafted using the age-old kuttu weaving tradition where a lustrous ivory silk body is seamlessly conjoined with a grand coral pink pure silk border adorned with traditional temple (kumbham) zari spikes.",
    images: [
      "https://images.unsplash.com/photo-1609357605129-26f69add5d6e?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1610030469668-93510cb28665?auto=format&fit=crop&w=1200&q=85"
    ],
    in_stock: true,
    featured: false,
    attributes: {
      zari_type: "Silver & Gold Bavanji Zari",
      occasion: "Traditional Ceremonies / Housewarming",
      origin: "Gadwal, Telangana / AP",
      blouse_included: "Contrast Coral Pink Brocade Blouse",
      care: "Dry Clean Only",
      weave_technique: "Kuttu Seamless Interlocking"
    }
  },
  {
    id: "saree-dharmavaram-plum",
    type_id: "type-dharmavaram",
    name: "Dharmavaram Heavy Brocade Silk",
    slug: "dharmavaram-heavy-brocade-silk",
    price: 21500,
    original_price: 26000,
    fabric: "Dharmavaram Pure Silk",
    color: "Deep Plum & Gilded Gold",
    description: "Rayalaseema's premier handloom heritage. Rich plum silk with intricate two-tone gold zari pallu and thick borders depicting sacred temple architecture and mango paisleys.",
    images: [
      "https://images.unsplash.com/photo-1610030469668-93510cb28665?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1200&q=85"
    ],
    in_stock: true,
    featured: true,
    attributes: {
      zari_type: "Pure Gold Tested Zari",
      occasion: "Bridal / Seemantham",
      origin: "Dharmavaram, Andhra Pradesh",
      blouse_included: "Deep Plum Heavy Zari Blouse Piece",
      care: "Dry Clean Only. Roll on wooden spools or cloth.",
      weave_technique: "Traditional Jacquard Handloom"
    }
  },
  {
    id: "saree-organza-mint",
    type_id: "type-organza",
    name: "Embroidered Pastel Organza Silk",
    slug: "embroidered-pastel-organza-silk",
    price: 14200,
    original_price: 17500,
    fabric: "Pure Silk Organza",
    color: "Pastel Mint & Blush Gold",
    description: "Contemporary airy silhouette woven in ethereal pure silk organza. Embellished with delicate hand-cut scalloped borders, soft resham flora, and glistening champagne sequins.",
    images: [
      "https://images.unsplash.com/photo-1609357605129-26f69add5d6e?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=1200&q=85"
    ],
    in_stock: true,
    featured: false,
    attributes: {
      zari_type: "Muted Zardozi & Resham",
      occasion: "Sangeet / Modern Reception",
      origin: "Rayachoty Designer Studio",
      blouse_included: "Unstitched Heavy Embroidered Silk Blouse",
      care: "Gentle Dry Clean Only",
      weave_technique: "Powerloom Silk with Hand Artistry"
    }
  },
  {
    id: "saree-kanchi-emerald",
    type_id: "type-kanchipuram",
    name: "Kanchipuram Emerald Temple Silk",
    slug: "kanchipuram-emerald-temple-silk",
    price: 31000,
    original_price: 38000,
    fabric: "Pure Mulberry Silk",
    color: "Peacock Green & Copper Gold",
    description: "A showstopping heirloom piece in jewel-toned emerald green featuring copper gold zari korvai border with deep gopuram temple pinnacles and Annapakshi motifs.",
    images: [
      "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1200&q=85"
    ],
    in_stock: true,
    featured: true,
    attributes: {
      zari_type: "Pure Copper-Gold Zari",
      occasion: "Grand Bridal / Festive",
      origin: "Kanchipuram, Tamil Nadu",
      blouse_included: "Contrast Brocade Blouse Piece",
      care: "Dry Clean Only",
      weave_technique: "Triple Warp Korvai"
    }
  },
  {
    id: "saree-chanderi-peach",
    type_id: "type-chanderi",
    name: "Chanderi Tissue Floral Silk",
    slug: "chanderi-tissue-floral-silk",
    price: 11900,
    original_price: 14500,
    fabric: "Pure Chanderi Silk-Cotton",
    color: "Peach Blush & Gold",
    description: "Whisper-light and luminous Chanderi woven with subtle tissue sheen, decorated with delicate floral ashrafi butis and finished with an intricate zari border.",
    images: [
      "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=1200&q=85"
    ],
    in_stock: true,
    featured: false,
    attributes: {
      zari_type: "Fine Gold Thread Zari",
      occasion: "Mehendi / Daytime Celebrations",
      origin: "Chanderi, Madhya Pradesh",
      blouse_included: "Running Chanderi Silk Blouse",
      care: "Dry Clean Only",
      weave_technique: "Traditional Extra Weft Weaving"
    }
  }
];

export const initialPrebookings = [
  {
    id: "prebook-1",
    saree_id: "saree-kanchi-crimson",
    saree_name: "Kanchipuram Crimson Royal Bridal Silk",
    saree_image_url: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=400&q=80",
    customer_name: "Lakshmi Prasanna",
    customer_phone: "+91 94401 23456",
    customer_email: "lakshmi.p@example.com",
    customer_address: "Rayachoty, Annamayya Dist",
    preferred_date: "2026-10-18",
    notes: "Need matching customized tassels (kuchu) on the pallu for wedding muhurtham.",
    reference_image_url: "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=400&q=80",
    status: "new",
    created_at: new Date(Date.now() - 3600000 * 4).toISOString()
  },
  {
    id: "prebook-2",
    saree_id: "saree-banarasi-magenta",
    saree_name: "Banarasi Katan Silk Antique Jaal",
    saree_image_url: "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=400&q=80",
    customer_name: "Dr. Sandhya Reddy",
    customer_phone: "+91 98850 78901",
    customer_email: "sandhya.reddy@example.com",
    customer_address: "Kadapa City",
    preferred_date: "2026-10-22",
    notes: "Would like to see the saree in person at the Rayachoty showroom this weekend.",
    reference_image_url: null,
    status: "contacted",
    created_at: new Date(Date.now() - 3600000 * 24).toISOString()
  }
];
