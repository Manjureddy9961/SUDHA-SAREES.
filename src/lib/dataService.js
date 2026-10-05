import { supabase, isSupabaseConfigured } from './supabase';
import { initialSareeTypes, initialSarees, initialPrebookings } from './mockData';

// Local storage keys for standalone preview mode
const STORAGE_KEYS = {
  TYPES: 'sudha_saree_types_v1',
  SAREES: 'sudha_sarees_v1',
  PREBOOKINGS: 'sudha_prebookings_v1',
  WISHLIST: 'sudha_wishlist_v1',
  AUTH_USER: 'sudha_admin_user_v1'
};

// Helper: Device ID for anonymous wishlist tracking
export const getDeviceId = () => {
  let id = localStorage.getItem('sudha_device_id');
  if (!id) {
    id = 'dev_' + Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
    localStorage.setItem('sudha_device_id', id);
  }
  return id;
};

// Helper: Local storage accessor with initial fallback
const getLocalData = (key, fallback) => {
  try {
    const data = localStorage.getItem(key);
    if (!data) {
      localStorage.setItem(key, JSON.stringify(fallback));
      return fallback;
    }
    return JSON.parse(data);
  } catch (err) {
    console.error('Local storage read error:', err);
    return fallback;
  }
};

const setLocalData = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.error('Local storage write error:', err);
  }
};

// ==========================================
// SAREE TYPES SERVICES
// ==========================================

export const fetchSareeTypes = async () => {
  if (isSupabaseConfigured()) {
    try {
      const { data, error } = await supabase
        .from('saree_types')
        .select('*')
        .order('display_order', { ascending: true });
      if (error) throw error;
      if (data && data.length > 0) return data;
    } catch (e) {
      console.warn('Supabase fetchSareeTypes failed, using local data:', e);
    }
  }
  return getLocalData(STORAGE_KEYS.TYPES, initialSareeTypes);
};

export const fetchSareeTypeBySlug = async (slug) => {
  const types = await fetchSareeTypes();
  return types.find(t => t.slug === slug) || null;
};

export const saveSareeType = async (typeData) => {
  if (isSupabaseConfigured()) {
    try {
      if (typeData.id && !typeData.id.startsWith('type-')) {
        const { data, error } = await supabase
          .from('saree_types')
          .update(typeData)
          .eq('id', typeData.id)
          .select()
          .single();
        if (error) throw error;
        return data;
      } else {
        const newRecord = { ...typeData };
        delete newRecord.id;
        const { data, error } = await supabase
          .from('saree_types')
          .insert(newRecord)
          .select()
          .single();
        if (error) throw error;
        return data;
      }
    } catch (e) {
      console.warn('Supabase saveSareeType failed, saving locally:', e);
    }
  }

  // Local storage fallback
  const list = getLocalData(STORAGE_KEYS.TYPES, initialSareeTypes);
  if (typeData.id) {
    const updated = list.map(item => item.id === typeData.id ? { ...item, ...typeData } : item);
    setLocalData(STORAGE_KEYS.TYPES, updated);
    return typeData;
  } else {
    const newItem = {
      ...typeData,
      id: 'type-' + Date.now().toString(36),
      created_at: new Date().toISOString()
    };
    setLocalData(STORAGE_KEYS.TYPES, [...list, newItem]);
    return newItem;
  }
};

export const deleteSareeType = async (id) => {
  if (isSupabaseConfigured()) {
    try {
      const { error } = await supabase.from('saree_types').delete().eq('id', id);
      if (error) throw error;
      return true;
    } catch (e) {
      console.warn('Supabase deleteSareeType failed, deleting locally:', e);
    }
  }

  const list = getLocalData(STORAGE_KEYS.TYPES, initialSareeTypes);
  setLocalData(STORAGE_KEYS.TYPES, list.filter(item => item.id !== id));
  return true;
};

// ==========================================
// SAREES SERVICES
// ==========================================

export const fetchSarees = async (options = {}) => {
  const { typeSlug, fabric, color, minPrice, maxPrice, inStockOnly, featuredOnly, search, sort } = options;

  let sarees = [];

  if (isSupabaseConfigured()) {
    try {
      let query = supabase.from('sarees').select('*, saree_types(*)');

      if (inStockOnly) query = query.eq('in_stock', true);
      if (featuredOnly) query = query.eq('featured', true);
      if (minPrice) query = query.gte('price', minPrice);
      if (maxPrice) query = query.lte('price', maxPrice);

      const { data, error } = await query;
      if (error) throw error;
      if (data && data.length > 0) {
        sarees = data;
      }
    } catch (e) {
      console.warn('Supabase fetchSarees failed, using local data:', e);
      sarees = getLocalData(STORAGE_KEYS.SAREES, initialSarees);
    }
  } else {
    sarees = getLocalData(STORAGE_KEYS.SAREES, initialSarees);
  }

  // Filter locally for consistent behaviour across preview/real Supabase
  let filtered = [...sarees];

  if (typeSlug) {
    const types = await fetchSareeTypes();
    const typeObj = types.find(t => t.slug === typeSlug);
    if (typeObj) {
      filtered = filtered.filter(s => s.type_id === typeObj.id);
    }
  }

  if (fabric && fabric !== 'all') {
    filtered = filtered.filter(s => s.fabric.toLowerCase().includes(fabric.toLowerCase()));
  }

  if (color && color !== 'all') {
    filtered = filtered.filter(s => s.color.toLowerCase().includes(color.toLowerCase()));
  }

  if (minPrice !== undefined && minPrice !== null) {
    filtered = filtered.filter(s => Number(s.price) >= Number(minPrice));
  }

  if (maxPrice !== undefined && maxPrice !== null) {
    filtered = filtered.filter(s => Number(s.price) <= Number(maxPrice));
  }

  if (inStockOnly) {
    filtered = filtered.filter(s => s.in_stock === true);
  }

  if (featuredOnly) {
    filtered = filtered.filter(s => s.featured === true);
  }

  if (search && search.trim()) {
    const queryStr = search.toLowerCase().trim();
    filtered = filtered.filter(s =>
      s.name.toLowerCase().includes(queryStr) ||
      s.description.toLowerCase().includes(queryStr) ||
      s.fabric.toLowerCase().includes(queryStr) ||
      s.color.toLowerCase().includes(queryStr)
    );
  }

  // Sorting
  if (sort === 'price-low') {
    filtered.sort((a, b) => Number(a.price) - Number(b.price));
  } else if (sort === 'price-high') {
    filtered.sort((a, b) => Number(b.price) - Number(a.price));
  } else if (sort === 'name') {
    filtered.sort((a, b) => a.name.localeCompare(b.name));
  } else {
    // default: featured first, then newest
    filtered.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
  }

  return filtered;
};

export const fetchSareeByIdOrSlug = async (identifier) => {
  const all = await fetchSarees();
  return all.find(s => s.id === identifier || s.slug === identifier) || null;
};

export const saveSaree = async (sareeData) => {
  // Ensure slug exists
  if (!sareeData.slug) {
    sareeData.slug = sareeData.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
  }

  // Clean payload for Postgres columns
  const cleanPayload = {
    type_id: sareeData.type_id,
    name: sareeData.name,
    slug: sareeData.slug,
    price: Number(sareeData.price),
    original_price: sareeData.original_price ? Number(sareeData.original_price) : null,
    fabric: sareeData.fabric,
    color: sareeData.color,
    description: sareeData.description,
    images: Array.isArray(sareeData.images) ? sareeData.images.filter(Boolean) : [],
    in_stock: sareeData.in_stock !== undefined ? Boolean(sareeData.in_stock) : true,
    featured: sareeData.featured !== undefined ? Boolean(sareeData.featured) : false,
    attributes: sareeData.attributes || {}
  };

  if (isSupabaseConfigured()) {
    try {
      if (sareeData.id && !sareeData.id.startsWith('saree-')) {
        const { data, error } = await supabase
          .from('sarees')
          .update(cleanPayload)
          .eq('id', sareeData.id)
          .select()
          .single();
        if (error) throw error;
        return data;
      } else {
        const { data, error } = await supabase
          .from('sarees')
          .insert(cleanPayload)
          .select()
          .single();
        if (error) throw error;
        return data;
      }
    } catch (e) {
      console.warn('Supabase saveSaree failed, saving locally:', e);
    }
  }

  const list = getLocalData(STORAGE_KEYS.SAREES, initialSarees);
  if (sareeData.id) {
    const updated = list.map(item => item.id === sareeData.id ? { ...item, ...sareeData } : item);
    setLocalData(STORAGE_KEYS.SAREES, updated);
    return sareeData;
  } else {
    const newItem = {
      ...sareeData,
      id: 'saree-' + Date.now().toString(36),
      created_at: new Date().toISOString()
    };
    setLocalData(STORAGE_KEYS.SAREES, [newItem, ...list]);
    return newItem;
  }
};

export const deleteSaree = async (id) => {
  if (isSupabaseConfigured()) {
    try {
      const { error } = await supabase.from('sarees').delete().eq('id', id);
      if (error) throw error;
      return true;
    } catch (e) {
      console.warn('Supabase deleteSaree failed, deleting locally:', e);
    }
  }

  const list = getLocalData(STORAGE_KEYS.SAREES, initialSarees);
  setLocalData(STORAGE_KEYS.SAREES, list.filter(item => item.id !== id));
  return true;
};

// ==========================================
// PRE-BOOKINGS SERVICES
// ==========================================

export const createPrebooking = async (bookingData) => {
  const isUUID = (str) =>
    typeof str === 'string' &&
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str);

  const bookingRecord = {
    saree_id: isUUID(bookingData.saree_id) ? bookingData.saree_id : null,
    saree_name: bookingData.saree_name || 'Selected Saree',
    saree_image_url: bookingData.saree_image_url || null,
    customer_name: bookingData.customer_name?.trim() || '',
    customer_phone: bookingData.customer_phone?.trim() || '',
    customer_email: bookingData.customer_email?.trim() || null,
    customer_address: bookingData.customer_address?.trim() || null,
    preferred_date: bookingData.preferred_date ? bookingData.preferred_date : null,
    notes: bookingData.notes?.trim() || null,
    reference_image_url: bookingData.reference_image_url || null,
    status: 'new'
  };

  if (isSupabaseConfigured()) {
    try {
      // NOTE: Do not append .select() here because public guests only have INSERT permissions,
      // not SELECT permissions on prebookings under Row-Level Security (RLS).
      const { error } = await supabase
        .from('prebookings')
        .insert(bookingRecord);

      if (error) {
        console.error('Supabase prebooking insert error:', error);
        throw error;
      }

      return {
        ...bookingRecord,
        id: 'pb-' + Date.now().toString(36)
      };
    } catch (e) {
      console.warn('Supabase createPrebooking failed, saving locally:', e);
    }
  }

  const list = getLocalData(STORAGE_KEYS.PREBOOKINGS, initialPrebookings);
  const newBooking = {
    ...bookingRecord,
    id: 'prebook-' + Date.now().toString(36),
    created_at: new Date().toISOString()
  };
  setLocalData(STORAGE_KEYS.PREBOOKINGS, [newBooking, ...list]);
  return newBooking;
};

export const fetchPrebookings = async () => {
  if (isSupabaseConfigured()) {
    try {
      const { data, error } = await supabase
        .from('prebookings')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      if (data) return data;
    } catch (e) {
      console.warn('Supabase fetchPrebookings failed, using local list:', e);
    }
  }
  return getLocalData(STORAGE_KEYS.PREBOOKINGS, initialPrebookings);
};

export const updatePrebookingStatus = async (id, status) => {
  if (isSupabaseConfigured()) {
    try {
      const { data, error } = await supabase
        .from('prebookings')
        .update({ status })
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    } catch (e) {
      console.warn('Supabase updatePrebookingStatus failed, updating locally:', e);
    }
  }

  const list = getLocalData(STORAGE_KEYS.PREBOOKINGS, initialPrebookings);
  const updated = list.map(b => b.id === id ? { ...b, status } : b);
  setLocalData(STORAGE_KEYS.PREBOOKINGS, updated);
  return updated.find(b => b.id === id);
};

// ==========================================
// WISHLIST SERVICES (Sync across visits)
// ==========================================

export const getWishlist = async () => {
  const deviceId = getDeviceId();
  const localItems = getLocalData(STORAGE_KEYS.WISHLIST, []);

  if (isSupabaseConfigured()) {
    try {
      const { data, error } = await supabase
        .from('wishlists')
        .select('saree_id')
        .eq('user_or_device_id', deviceId);
      if (error) throw error;
      if (data) {
        const ids = data.map(item => item.saree_id);
        // Sync local storage with DB
        const merged = Array.from(new Set([...localItems, ...ids]));
        setLocalData(STORAGE_KEYS.WISHLIST, merged);
        return merged;
      }
    } catch (e) {
      console.warn('Supabase getWishlist failed, using local list:', e);
    }
  }

  return localItems;
};

export const toggleWishlistItem = async (sareeId) => {
  const deviceId = getDeviceId();
  let list = getLocalData(STORAGE_KEYS.WISHLIST, []);
  const exists = list.includes(sareeId);

  if (exists) {
    list = list.filter(id => id !== sareeId);
    if (isSupabaseConfigured()) {
      try {
        await supabase
          .from('wishlists')
          .delete()
          .match({ user_or_device_id: deviceId, saree_id: sareeId });
      } catch (e) {
        console.warn('Supabase remove wishlist item error:', e);
      }
    }
  } else {
    list = [...list, sareeId];
    if (isSupabaseConfigured()) {
      try {
        await supabase
          .from('wishlists')
          .insert({ user_or_device_id: deviceId, saree_id: sareeId });
      } catch (e) {
        console.warn('Supabase add wishlist item error:', e);
      }
    }
  }

  setLocalData(STORAGE_KEYS.WISHLIST, list);
  // Trigger a custom event for live header counter sync
  window.dispatchEvent(new CustomEvent('sudha-wishlist-updated', { detail: { count: list.length, items: list } }));
  return !exists;
};

export const isInWishlist = (sareeId) => {
  const list = getLocalData(STORAGE_KEYS.WISHLIST, []);
  return list.includes(sareeId);
};

// ==========================================
// FILE STORAGE UPLOAD (Supabase / Local DataURL)
// ==========================================

export const uploadMediaFile = async (file, bucket = 'prebooking-references') => {
  if (isSupabaseConfigured()) {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
      const filePath = `${fileName}`;

      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(filePath, file, { cacheControl: '3600', upsert: false });

      if (error) throw error;

      const { data: publicUrlData } = supabase.storage
        .from(bucket)
        .getPublicUrl(filePath);

      return publicUrlData.publicUrl;
    } catch (e) {
      console.warn('Supabase storage upload failed, converting to DataURL:', e);
    }
  }

  // Fallback: Read as base64 DataURL so local preview has instant image display
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

// ==========================================
// ADMIN AUTHENTICATION
// ==========================================

export const loginAdmin = async (email, password) => {
  if (isSupabaseConfigured()) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      if (error) throw error;

      // Check if user is in admins table
      const { data: adminRecord, error: adminErr } = await supabase
        .from('admins')
        .select('*')
        .eq('user_id', data.user.id)
        .maybeSingle();

      if (adminErr || !adminRecord) {
        await supabase.auth.signOut();
        throw new Error('Access denied: Your account is not registered as an administrator.');
      }

      return { user: data.user, role: adminRecord.role };
    } catch (e) {
      throw e;
    }
  }

  // Standalone / Preview Mode Admin Login
  // Allows testing the admin portal immediately with default demo credentials:
  // email: admin@sudhasarees.com / pass: admin123
  if ((email === 'admin@sudhasarees.com' && password === 'admin123') ||
      (email === 'admin' && password === 'admin')) {
    const mockAdmin = {
      id: 'demo-admin-id',
      email: email,
      role: 'superadmin',
      isDemo: true
    };
    localStorage.setItem(STORAGE_KEYS.AUTH_USER, JSON.stringify(mockAdmin));
    return { user: mockAdmin, role: 'superadmin' };
  } else {
    throw new Error('Invalid email or password. For demo mode use: admin@sudhasarees.com / admin123');
  }
};

export const getAdminSession = async () => {
  if (isSupabaseConfigured()) {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        const { data: adminRecord } = await supabase
          .from('admins')
          .select('*')
          .eq('user_id', session.user.id)
          .maybeSingle();

        if (adminRecord) {
          return { user: session.user, role: adminRecord.role };
        }
      }
    } catch (e) {
      console.warn('Session check failed:', e);
    }
  }

  const stored = localStorage.getItem(STORAGE_KEYS.AUTH_USER);
  if (stored) {
    try {
      return { user: JSON.parse(stored), role: 'superadmin' };
    } catch (e) {
      return null;
    }
  }
  return null;
};

export const logoutAdmin = async () => {
  if (isSupabaseConfigured()) {
    try {
      await supabase.auth.signOut();
    } catch (e) {
      console.warn('Sign out error:', e);
    }
  }
  localStorage.removeItem(STORAGE_KEYS.AUTH_USER);
};
