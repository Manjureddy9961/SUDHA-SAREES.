import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Layers,
  Sparkles,
  CalendarCheck,
  Plus,
  Trash2,
  Edit2,
  Phone,
  MessageSquare,
  LogOut,
  Upload,
  CheckCircle,
  Clock,
  XCircle,
  Eye,
  AlertTriangle,
  Image as ImageIcon,
  Loader2,
  Link2
} from 'lucide-react';
import {
  getAdminSession,
  logoutAdmin,
  fetchSareeTypes,
  fetchSarees,
  fetchPrebookings,
  saveSaree,
  deleteSaree,
  saveSareeType,
  deleteSareeType,
  updatePrebookingStatus,
  uploadMediaFile
} from '../lib/dataService';
import TempleBorder from '../components/common/TempleBorder';
import Lightbox from '../components/common/Lightbox';

export default function AdminDashboardPage() {
  const navigate = useNavigate();
  const [adminUser, setAdminUser] = useState(null);
  const [authChecking, setAuthChecking] = useState(true);

  // Active Tab
  const [activeTab, setActiveTab] = useState('overview'); // 'overview', 'sarees', 'types', 'prebookings'

  // Data states
  const [sarees, setSarees] = useState([]);
  const [types, setTypes] = useState([]);
  const [prebookings, setPrebookings] = useState([]);
  const [loading, setLoading] = useState(true);

  // Saree Editor Modal state
  const [isSareeModalOpen, setIsSareeModalOpen] = useState(false);
  const [editingSaree, setEditingSaree] = useState(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [imageUrlInput, setImageUrlInput] = useState('');
  const [sareeForm, setSareeForm] = useState({
    name: '',
    type_id: '',
    price: '',
    original_price: '',
    fabric: '',
    color: '',
    description: '',
    images: [],
    in_stock: true,
    featured: false,
    attributes: {
      zari_type: 'Pure Gold Tested Zari',
      occasion: 'Bridal / Muhurtham',
      origin: 'Kanchipuram, Tamil Nadu',
      blouse_included: 'Matching Silk Blouse Piece (80 cm)',
      care: 'Dry Clean Only',
      weave_technique: 'Handloom Interlocking'
    }
  });

  // Type Editor Modal state
  const [isTypeModalOpen, setIsTypeModalOpen] = useState(false);
  const [editingType, setEditingType] = useState(null);
  const [typeForm, setTypeForm] = useState({
    name: '',
    slug: '',
    description: '',
    cover_image_url: '',
    display_order: 1
  });

  // Image preview lightbox for prebooking references
  const [referenceLightboxImage, setReferenceLightboxImage] = useState(null);

  // Check auth on mount
  useEffect(() => {
    getAdminSession().then((session) => {
      if (!session) {
        navigate('/contact');
      } else {
        setAdminUser(session.user);
        loadAllData();
      }
      setAuthChecking(false);
    });
  }, [navigate]);

  const loadAllData = async () => {
    setLoading(true);
    const [typesData, sareesData, bookingsData] = await Promise.all([
      fetchSareeTypes(),
      fetchSarees(),
      fetchPrebookings()
    ]);
    setTypes(typesData || []);
    setSarees(sareesData || []);
    setPrebookings(bookingsData || []);
    setLoading(false);
  };

  const handleLogout = async () => {
    await logoutAdmin();
    navigate('/');
  };

  // ==========================================
  // SAREE MANAGEMENT HANDLERS
  // ==========================================
  const handleOpenAddSaree = () => {
    setEditingSaree(null);
    setImageUrlInput('');
    setSareeForm({
      name: '',
      type_id: types[0]?.id || '',
      price: '',
      original_price: '',
      fabric: 'Pure Mulberry Silk',
      color: '',
      description: '',
      images: [],
      in_stock: true,
      featured: false,
      attributes: {
        zari_type: 'Pure Gold Tested Zari',
        occasion: 'Bridal / Muhurtham',
        origin: 'Rayachoty Showroom',
        blouse_included: 'Contrast Silk Blouse with Zari Border',
        care: 'Dry Clean Only',
        weave_technique: 'Traditional Handloom'
      }
    });
    setIsSareeModalOpen(true);
  };

  const handleOpenEditSaree = (saree) => {
    setEditingSaree(saree);
    setImageUrlInput('');
    let existingImages = [];
    if (Array.isArray(saree.images)) {
      existingImages = saree.images;
    } else if (typeof saree.images === 'string') {
      try {
        const parsed = JSON.parse(saree.images);
        existingImages = Array.isArray(parsed) ? parsed : [saree.images];
      } catch {
        existingImages = [saree.images];
      }
    } else if (saree.cover_image_url) {
      existingImages = [saree.cover_image_url];
    }

    setSareeForm({
      ...saree,
      images: existingImages.filter(Boolean),
      attributes: saree.attributes || {
        zari_type: 'Pure Gold Tested Zari',
        occasion: 'Bridal / Muhurtham',
        origin: 'Rayachoty Showroom',
        blouse_included: 'Contrast Silk Blouse',
        care: 'Dry Clean Only',
        weave_technique: 'Traditional Handloom'
      }
    });
    setIsSareeModalOpen(true);
  };

  const handleDeleteSaree = async (id) => {
    if (window.confirm('Are you sure you want to remove this saree from the catalog?')) {
      await deleteSaree(id);
      setSarees((prev) => prev.filter((s) => s.id !== id));
    }
  };

  const handleSareeImageUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    setIsUploadingImage(true);
    try {
      for (const file of files) {
        const url = await uploadMediaFile(file, 'saree-media');
        if (url) {
          setSareeForm((prev) => ({
            ...prev,
            images: [...(prev.images || []), url]
          }));
        }
      }
    } catch (err) {
      console.error('Image upload failed:', err);
      alert('Could not upload image. You can also paste an image URL directly below.');
    } finally {
      setIsUploadingImage(false);
      e.target.value = '';
    }
  };

  const handleAddImageUrl = (e) => {
    e.preventDefault();
    if (!imageUrlInput.trim()) return;
    const url = imageUrlInput.trim();
    setSareeForm((prev) => ({
      ...prev,
      images: [...(prev.images || []), url]
    }));
    setImageUrlInput('');
  };

  const handleRemoveSareeImage = (indexToRemove) => {
    setSareeForm((prev) => ({
      ...prev,
      images: (prev.images || []).filter((_, idx) => idx !== indexToRemove)
    }));
  };

  const handleSaveSaree = async (e) => {
    e.preventDefault();
    if (!sareeForm.name || !sareeForm.price) return;

    const dataToSave = {
      ...sareeForm,
      id: editingSaree?.id,
      price: Number(sareeForm.price),
      original_price: sareeForm.original_price ? Number(sareeForm.original_price) : null
    };

    const saved = await saveSaree(dataToSave);
    setIsSareeModalOpen(false);
    loadAllData();
  };

  // ==========================================
  // TYPE MANAGEMENT HANDLERS
  // ==========================================
  const handleOpenAddType = () => {
    setEditingType(null);
    setTypeForm({
      name: '',
      slug: '',
      description: '',
      cover_image_url: '',
      display_order: types.length + 1
    });
    setIsTypeModalOpen(true);
  };

  const handleOpenEditType = (type) => {
    setEditingType(type);
    setTypeForm(type);
    setIsTypeModalOpen(true);
  };

  const handleDeleteType = async (id) => {
    if (window.confirm('Delete this saree type category? Existing sarees will lose this category tag.')) {
      await deleteSareeType(id);
      setTypes((prev) => prev.filter((t) => t.id !== id));
    }
  };

  const handleSaveType = async (e) => {
    e.preventDefault();
    if (!typeForm.name) return;

    const slug = typeForm.slug || typeForm.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const dataToSave = {
      ...typeForm,
      id: editingType?.id,
      slug,
      display_order: Number(typeForm.display_order) || 1
    };

    await saveSareeType(dataToSave);
    setIsTypeModalOpen(false);
    loadAllData();
  };

  // ==========================================
  // PREBOOKING STATUS HANDLERS
  // ==========================================
  const handleStatusChange = async (bookingId, newStatus) => {
    await updatePrebookingStatus(bookingId, newStatus);
    setPrebookings((prev) =>
      prev.map((b) => (b.id === bookingId ? { ...b, status: newStatus } : b))
    );
  };

  if (authChecking) {
    return (
      <div className="min-h-screen bg-brand-ivory flex items-center justify-center p-8">
        <div className="w-10 h-10 border-4 border-brand-maroon border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Pre-booking counts
  const newBookingsCount = prebookings.filter((b) => b.status === 'new').length;
  const contactedCount = prebookings.filter((b) => b.status === 'contacted').length;
  const confirmedCount = prebookings.filter((b) => b.status === 'confirmed').length;

  return (
    <div className="min-h-screen bg-gray-50 text-brand-charcoal">
      {/* Top Admin Navigation Header */}
      <header className="bg-brand-maroon-dark text-brand-ivory border-b border-brand-gold/40 px-4 sm:px-8 py-3.5 flex items-center justify-between sticky top-0 z-30 shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-brand-gold/20 flex items-center justify-center text-brand-gold-light border border-brand-gold/50 font-serif font-bold text-lg">
            S
          </div>
          <div>
            <h1 className="font-serif text-lg font-bold text-brand-gold-light leading-none">
              Sudha Sarees &bull; Admin Portal
            </h1>
            <p className="text-[11px] text-brand-blush/80 mt-0.5">Rayachoty Showroom Operations</p>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs">
          <span className="hidden sm:inline text-brand-blush/80">
            Logged in: <strong className="text-white">{adminUser?.email || 'Administrator'}</strong>
          </span>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-brand-maroon text-brand-gold-light hover:bg-white/10 rounded-lg border border-brand-gold/30 transition"
          >
            <LogOut size={14} />
            <span>Logout</span>
          </button>
        </div>
      </header>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Tabs */}
        <div className="flex flex-wrap items-center gap-2 border-b border-gray-200 pb-4 mb-8">
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition ${
              activeTab === 'overview'
                ? 'bg-brand-maroon text-brand-gold-light shadow'
                : 'bg-white text-gray-700 hover:bg-brand-blush/40 border'
            }`}
          >
            <LayoutDashboard size={16} />
            <span>Overview &amp; Metrics</span>
          </button>

          <button
            onClick={() => setActiveTab('sarees')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition ${
              activeTab === 'sarees'
                ? 'bg-brand-maroon text-brand-gold-light shadow'
                : 'bg-white text-gray-700 hover:bg-brand-blush/40 border'
            }`}
          >
            <Sparkles size={16} />
            <span>Manage Sarees ({sarees.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('types')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition ${
              activeTab === 'types'
                ? 'bg-brand-maroon text-brand-gold-light shadow'
                : 'bg-white text-gray-700 hover:bg-brand-blush/40 border'
            }`}
          >
            <Layers size={16} />
            <span>Saree Types / Weaves ({types.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('prebookings')}
            className={`relative flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition ${
              activeTab === 'prebookings'
                ? 'bg-brand-maroon text-brand-gold-light shadow'
                : 'bg-white text-gray-700 hover:bg-brand-blush/40 border'
            }`}
          >
            <CalendarCheck size={16} />
            <span>Pre-Bookings ({prebookings.length})</span>
            {newBookingsCount > 0 && (
              <span className="px-1.5 py-0.5 rounded-full bg-red-500 text-white text-[10px] font-bold">
                {newBookingsCount} new
              </span>
            )}
          </button>
        </div>

        {/* ======================================================== */}
        {/* TAB 1: OVERVIEW */}
        {/* ======================================================== */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Metric KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-2xl p-6 border border-brand-gold/30 shadow-sm">
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Total Active Sarees
                </span>
                <div className="font-serif text-3xl font-bold text-brand-maroon-dark mt-2">
                  {sarees.length}
                </div>
                <div className="text-xs text-emerald-600 font-medium mt-1">
                  {sarees.filter((s) => s.in_stock).length} In Stock
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 border border-brand-gold/30 shadow-sm">
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Weave Categories
                </span>
                <div className="font-serif text-3xl font-bold text-brand-maroon-dark mt-2">
                  {types.length}
                </div>
                <div className="text-xs text-brand-gold-dark font-medium mt-1">
                  Kanchipuram, Banarasi, etc.
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 border border-brand-gold/30 shadow-sm">
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  New Pre-bookings
                </span>
                <div className="font-serif text-3xl font-bold text-red-600 mt-2">
                  {newBookingsCount}
                </div>
                <div className="text-xs text-gray-500 mt-1">Action required</div>
              </div>

              <div className="bg-white rounded-2xl p-6 border border-brand-gold/30 shadow-sm">
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Confirmed Showroom Orders
                </span>
                <div className="font-serif text-3xl font-bold text-emerald-600 mt-2">
                  {confirmedCount}
                </div>
                <div className="text-xs text-gray-500 mt-1">{contactedCount} contacted</div>
              </div>
            </div>

            {/* Quick Actions Bar */}
            <div className="bg-brand-ivory p-6 rounded-3xl border border-brand-gold/40 flex flex-wrap items-center justify-between gap-4">
              <div>
                <h3 className="font-serif text-lg font-bold text-brand-maroon-dark">
                  Quick Catalog Operations
                </h3>
                <p className="text-xs text-gray-600">
                  Instant real-time updates for Rayachoty catalog. No rebuild required.
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={handleOpenAddSaree}
                  className="px-4 py-2 bg-brand-maroon hover:bg-brand-maroon-dark text-brand-gold-light text-xs font-semibold rounded-xl shadow flex items-center gap-1.5"
                >
                  <Plus size={15} />
                  <span>Add New Saree</span>
                </button>
                <button
                  onClick={handleOpenAddType}
                  className="px-4 py-2 bg-white hover:bg-brand-blush/40 text-brand-maroon border border-brand-gold/40 text-xs font-semibold rounded-xl shadow-sm flex items-center gap-1.5"
                >
                  <Plus size={15} />
                  <span>Add Saree Category</span>
                </button>
              </div>
            </div>

            {/* Recent Prebookings preview */}
            <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-serif text-lg font-bold text-brand-maroon-dark">
                  Recent Pre-Bookings
                </h3>
                <button
                  onClick={() => setActiveTab('prebookings')}
                  className="text-xs text-brand-maroon hover:underline font-semibold"
                >
                  View All &rarr;
                </button>
              </div>
              <div className="divide-y divide-gray-100">
                {prebookings.slice(0, 4).map((b) => (
                  <div key={b.id} className="py-3 flex items-center justify-between">
                    <div>
                      <span className="font-semibold text-xs sm:text-sm text-brand-charcoal">
                        {b.customer_name}
                      </span>
                      <span className="text-xs text-gray-500 block">
                        Interested in: {b.saree_name} &bull; {b.customer_phone}
                      </span>
                    </div>
                    <span
                      className={`text-[11px] font-semibold px-2.5 py-1 rounded-full capitalize ${
                        b.status === 'new'
                          ? 'bg-red-100 text-red-700'
                          : b.status === 'contacted'
                          ? 'bg-amber-100 text-amber-700'
                          : 'bg-emerald-100 text-emerald-700'
                      }`}
                    >
                      {b.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 2: MANAGE SAREES */}
        {/* ======================================================== */}
        {activeTab === 'sarees' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-serif text-2xl font-bold text-brand-maroon-dark">
                  Saree Inventory
                </h2>
                <p className="text-xs text-gray-500">
                  Manage product details, pricing, fabric, and multiple high-res gallery images.
                </p>
              </div>
              <button
                onClick={handleOpenAddSaree}
                className="px-4 py-2.5 bg-brand-maroon hover:bg-brand-maroon-dark text-brand-gold-light text-xs font-semibold rounded-xl shadow flex items-center gap-1.5"
              >
                <Plus size={15} />
                <span>Add Saree</span>
              </button>
            </div>

            {/* Sarees Table */}
            <div className="bg-white rounded-3xl border border-gray-200 overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-brand-charcoal">
                  <thead className="bg-brand-ivory text-brand-maroon-dark uppercase text-[10px] tracking-wider border-b">
                    <tr>
                      <th className="p-4">Drape</th>
                      <th className="p-4">Name &amp; Slug</th>
                      <th className="p-4">Category</th>
                      <th className="p-4">Price</th>
                      <th className="p-4">Status</th>
                      <th className="p-4">Featured</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {sarees.map((saree) => {
                      let sareeImg = '';
                      if (Array.isArray(saree.images) && saree.images.length > 0) {
                        sareeImg = saree.images[0];
                      } else if (typeof saree.images === 'string' && saree.images.startsWith('[')) {
                        try {
                          const parsed = JSON.parse(saree.images);
                          if (parsed && parsed.length > 0) sareeImg = parsed[0];
                        } catch {}
                      } else if (typeof saree.images === 'string' && saree.images.startsWith('http')) {
                        sareeImg = saree.images;
                      } else if (saree.cover_image_url) {
                        sareeImg = saree.cover_image_url;
                      }
                      const typeObj = types.find((t) => t.id === saree.type_id);

                      return (
                        <tr key={saree.id} className="hover:bg-gray-50 transition">
                          <td className="p-4">
                            {sareeImg ? (
                              <img
                                src={sareeImg}
                                alt={saree.name}
                                className="w-12 h-14 object-cover rounded-lg border"
                              />
                            ) : (
                              <div className="w-12 h-14 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400">
                                <ImageIcon size={18} />
                              </div>
                            )}
                          </td>
                          <td className="p-4">
                            <span className="font-bold text-brand-maroon-dark text-sm block">
                              {saree.name}
                            </span>
                            <span className="text-[11px] text-gray-400">{saree.fabric}</span>
                          </td>
                          <td className="p-4">{typeObj?.name || 'General'}</td>
                          <td className="p-4 font-bold font-sans">
                            ₹{Number(saree.price).toLocaleString('en-IN')}
                          </td>
                          <td className="p-4">
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                                saree.in_stock
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : 'bg-red-100 text-red-800'
                              }`}
                            >
                              {saree.in_stock ? 'In Stock' : 'Out of Stock'}
                            </span>
                          </td>
                          <td className="p-4">
                            {saree.featured ? (
                              <span className="text-brand-gold-dark font-bold text-[11px]">★ Yes</span>
                            ) : (
                              <span className="text-gray-400 text-[11px]">No</span>
                            )}
                          </td>
                          <td className="p-4 text-right space-x-2">
                            <button
                              onClick={() => handleOpenEditSaree(saree)}
                              className="p-1.5 text-gray-600 hover:text-brand-maroon rounded-lg hover:bg-gray-100 transition"
                              title="Edit Saree"
                            >
                              <Edit2 size={15} />
                            </button>
                            <button
                              onClick={() => handleDeleteSaree(saree.id)}
                              className="p-1.5 text-red-500 hover:text-red-700 rounded-lg hover:bg-red-50 transition"
                              title="Delete Saree"
                            >
                              <Trash2 size={15} />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 3: MANAGE SAREE TYPES */}
        {/* ======================================================== */}
        {activeTab === 'types' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-serif text-2xl font-bold text-brand-maroon-dark">
                  Saree Types &amp; Weave Traditions
                </h2>
                <p className="text-xs text-gray-500">
                  Manage categories shown in the navigation bar dropdown, hero marquee, and catalog filters.
                </p>
              </div>
              <button
                onClick={handleOpenAddType}
                className="px-4 py-2.5 bg-brand-maroon hover:bg-brand-maroon-dark text-brand-gold-light text-xs font-semibold rounded-xl shadow flex items-center gap-1.5"
              >
                <Plus size={15} />
                <span>Add Saree Type</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {types.map((type) => (
                <div
                  key={type.id}
                  className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm flex flex-col justify-between"
                >
                  <div className="relative aspect-[16/9] bg-gray-100">
                    <img
                      src={type.cover_image_url}
                      alt={type.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 right-2 bg-black/60 text-white text-[10px] px-2 py-0.5 rounded">
                      Order: {type.display_order}
                    </div>
                  </div>

                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="font-serif font-bold text-base text-brand-maroon-dark">
                        {type.name}
                      </h3>
                      <p className="text-[11px] text-gray-400 font-mono mt-0.5">/{type.slug}</p>
                      <p className="text-xs text-gray-600 mt-2 line-clamp-2">{type.description}</p>
                    </div>

                    <div className="mt-4 pt-3 border-t flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleOpenEditType(type)}
                        className="px-3 py-1 text-xs text-gray-700 hover:text-brand-maroon flex items-center gap-1"
                      >
                        <Edit2 size={13} />
                        <span>Edit</span>
                      </button>
                      <button
                        onClick={() => handleDeleteType(type.id)}
                        className="px-3 py-1 text-xs text-red-600 hover:text-red-800 flex items-center gap-1"
                      >
                        <Trash2 size={13} />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 4: MANAGE PRE-BOOKINGS */}
        {/* ======================================================== */}
        {activeTab === 'prebookings' && (
          <div className="space-y-6">
            <div>
              <h2 className="font-serif text-2xl font-bold text-brand-maroon-dark">
                Customer Pre-Bookings &amp; Showroom Visits
              </h2>
              <p className="text-xs text-gray-500">
                Direct inquiries from brides and customers. Update status, review reference photos, and connect via WhatsApp.
              </p>
            </div>

            <div className="space-y-4">
              {prebookings.map((booking) => {
                const whatsappCustomerUrl = `https://wa.me/${booking.customer_phone?.replace(
                  /[^0-9]/g,
                  ''
                )}?text=${encodeURIComponent(
                  `Namaste ${booking.customer_name}, this is regarding your pre-booking for "${booking.saree_name}" at Sudha Sarees, Rayachoty.`
                )}`;

                return (
                  <div
                    key={booking.id}
                    className="bg-white rounded-2xl p-5 border border-brand-gold/30 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
                  >
                    <div className="flex items-start gap-4">
                      {booking.saree_image_url ? (
                        <img
                          src={booking.saree_image_url}
                          alt={booking.saree_name}
                          className="w-16 h-20 object-cover rounded-xl border flex-shrink-0"
                        />
                      ) : (
                        <div className="w-16 h-20 bg-gray-100 rounded-xl flex items-center justify-center text-gray-400">
                          <ImageIcon size={20} />
                        </div>
                      )}

                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-serif font-bold text-base text-brand-maroon-dark">
                            {booking.customer_name}
                          </h4>
                          <span className="text-[11px] font-mono text-gray-400">#{booking.id}</span>
                        </div>
                        <p className="text-xs font-semibold text-brand-gold-dark">
                          Saree: {booking.saree_name}
                        </p>
                        <div className="text-xs text-gray-600 space-x-3">
                          <span>Phone: <strong>{booking.customer_phone}</strong></span>
                          {booking.customer_email && <span>Email: {booking.customer_email}</span>}
                        </div>
                        {booking.customer_address && (
                          <p className="text-xs text-gray-500">
                            Location: {booking.customer_address}
                          </p>
                        )}
                        {booking.preferred_date && (
                          <p className="text-xs text-brand-maroon font-medium">
                            Preferred Date: {booking.preferred_date}
                          </p>
                        )}
                        {booking.notes && (
                          <p className="text-xs bg-brand-ivory p-2 rounded-lg border border-brand-gold/20 text-gray-700 italic mt-1">
                            &ldquo;{booking.notes}&rdquo;
                          </p>
                        )}

                        {booking.reference_image_url && (
                          <div className="pt-1 flex items-center gap-2">
                            <span className="text-[11px] font-semibold text-brand-maroon">
                              Customer Reference Photo:
                            </span>
                            <button
                              onClick={() => setReferenceLightboxImage(booking.reference_image_url)}
                              className="text-[11px] text-blue-600 hover:underline flex items-center gap-1 font-medium"
                            >
                              <Eye size={12} />
                              <span>View Photo</span>
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Status & Contact Actions */}
                    <div className="flex flex-col sm:flex-row items-end sm:items-center gap-3 w-full md:w-auto border-t md:border-t-0 pt-3 md:pt-0">
                      {/* Status Dropdown */}
                      <select
                        value={booking.status}
                        onChange={(e) => handleStatusChange(booking.id, e.target.value)}
                        className="text-xs font-semibold px-3 py-1.5 rounded-xl border focus:outline-none cursor-pointer bg-white"
                      >
                        <option value="new">Status: New</option>
                        <option value="contacted">Status: Contacted</option>
                        <option value="confirmed">Status: Confirmed</option>
                        <option value="cancelled">Status: Cancelled</option>
                      </select>

                      {/* WhatsApp Button */}
                      <a
                        href={whatsappCustomerUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3.5 py-1.5 bg-brand-peacock hover:bg-brand-peacock-light text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 shadow-sm"
                      >
                        <MessageSquare size={13} />
                        <span>WhatsApp</span>
                      </a>

                      {/* Phone Call */}
                      <a
                        href={`tel:${booking.customer_phone}`}
                        className="px-3.5 py-1.5 bg-brand-maroon hover:bg-brand-maroon-dark text-brand-gold-light text-xs font-semibold rounded-xl flex items-center gap-1.5 shadow-sm"
                      >
                        <Phone size={13} />
                        <span>Call</span>
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* ======================================================== */}
      {/* SAREE EDITOR MODAL */}
      {/* ======================================================== */}
      {isSareeModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 space-y-4 shadow-2xl border border-brand-gold/40 max-h-[90vh] overflow-y-auto">
            <h3 className="font-serif text-xl font-bold text-brand-maroon-dark border-b pb-3">
              {editingSaree ? 'Edit Saree Details' : 'Add New Saree to Catalog'}
            </h3>

            <form onSubmit={handleSaveSaree} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold mb-1">Saree Name *</label>
                  <input
                    type="text"
                    required
                    value={sareeForm.name}
                    onChange={(e) => setSareeForm({ ...sareeForm, name: e.target.value })}
                    className="w-full p-2 border rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Weave Category *</label>
                  <select
                    value={sareeForm.type_id}
                    onChange={(e) => setSareeForm({ ...sareeForm, type_id: e.target.value })}
                    className="w-full p-2 border rounded-xl"
                  >
                    {types.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold mb-1">Selling Price (₹) *</label>
                  <input
                    type="number"
                    required
                    value={sareeForm.price}
                    onChange={(e) => setSareeForm({ ...sareeForm, price: e.target.value })}
                    className="w-full p-2 border rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Original Price (₹) (Optional)</label>
                  <input
                    type="number"
                    value={sareeForm.original_price}
                    onChange={(e) => setSareeForm({ ...sareeForm, original_price: e.target.value })}
                    className="w-full p-2 border rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold mb-1">Fabric Specification *</label>
                  <input
                    type="text"
                    required
                    value={sareeForm.fabric}
                    onChange={(e) => setSareeForm({ ...sareeForm, fabric: e.target.value })}
                    className="w-full p-2 border rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Color Palette *</label>
                  <input
                    type="text"
                    required
                    value={sareeForm.color}
                    onChange={(e) => setSareeForm({ ...sareeForm, color: e.target.value })}
                    className="w-full p-2 border rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1">Description</label>
                <textarea
                  rows={3}
                  value={sareeForm.description}
                  onChange={(e) => setSareeForm({ ...sareeForm, description: e.target.value })}
                  className="w-full p-2 border rounded-xl"
                />
              </div>

              {/* Multi-Image Upload Area */}
              <div className="space-y-3 bg-brand-ivory/50 p-3.5 rounded-2xl border border-brand-gold/30">
                <div className="flex items-center justify-between">
                  <label className="block font-semibold text-xs text-brand-maroon-dark">
                    Saree Gallery Images ({(sareeForm.images || []).length} added)
                  </label>
                  <span className="text-[10px] text-gray-500">First image is the primary cover</span>
                </div>

                {/* Thumbnail list */}
                {(sareeForm.images && sareeForm.images.length > 0) && (
                  <div className="flex flex-wrap gap-2.5 p-2 bg-white rounded-xl border border-gray-200">
                    {sareeForm.images.map((imgUrl, idx) => (
                      <div key={idx} className="relative group w-20 h-24 rounded-lg overflow-hidden border border-brand-gold/40 shadow-sm bg-gray-50">
                        <img src={imgUrl} alt={`Saree image ${idx + 1}`} className="w-full h-full object-cover" />
                        {idx === 0 && (
                          <span className="absolute bottom-0 inset-x-0 bg-brand-maroon/90 text-brand-gold-light text-[9px] text-center font-bold py-0.5">
                            Cover
                          </span>
                        )}
                        <button
                          type="button"
                          onClick={() => handleRemoveSareeImage(idx)}
                          className="absolute top-1 right-1 bg-red-600 hover:bg-red-700 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs shadow transition opacity-90 group-hover:opacity-100"
                          title="Remove image"
                        >
                          &times;
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Option 1: File Upload */}
                <label className="cursor-pointer border-2 border-dashed border-brand-gold/60 p-4 rounded-xl flex flex-col items-center justify-center hover:bg-brand-blush/30 transition bg-white block text-center">
                  {isUploadingImage ? (
                    <div className="flex items-center gap-2 text-brand-maroon font-semibold py-1">
                      <Loader2 size={18} className="animate-spin text-brand-gold-dark" />
                      <span>Uploading image(s)...</span>
                    </div>
                  ) : (
                    <>
                      <Upload size={20} className="text-brand-gold-dark mb-1" />
                      <span className="text-brand-maroon font-semibold text-xs">
                        Click to upload saree photos from device
                      </span>
                      <span className="text-[10px] text-gray-400 mt-0.5">JPG, PNG, WebP (select multiple files)</span>
                    </>
                  )}
                  <input
                    type="file"
                    multiple
                    disabled={isUploadingImage}
                    accept="image/*"
                    onChange={handleSareeImageUpload}
                    className="hidden"
                  />
                </label>

                {/* Option 2: Add by Web Image URL */}
                <div className="pt-2 border-t border-brand-gold/20">
                  <span className="text-[11px] text-gray-600 font-medium block mb-1.5">
                    Or paste an image web link (URL):
                  </span>
                  <div className="flex gap-2">
                    <input
                      type="url"
                      placeholder="https://images.unsplash.com/... or cloud image URL"
                      value={imageUrlInput}
                      onChange={(e) => setImageUrlInput(e.target.value)}
                      className="flex-1 p-2 text-xs border border-gray-300 rounded-xl focus:border-brand-maroon outline-none bg-white"
                    />
                    <button
                      type="button"
                      onClick={handleAddImageUrl}
                      disabled={!imageUrlInput.trim()}
                      className="px-3.5 py-1.5 bg-brand-maroon hover:bg-brand-maroon-dark disabled:opacity-40 text-brand-gold-light text-xs font-semibold rounded-xl transition flex items-center gap-1"
                    >
                      <Plus size={13} />
                      <span>Add URL</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Toggles */}
              <div className="flex gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={sareeForm.in_stock}
                    onChange={(e) => setSareeForm({ ...sareeForm, in_stock: e.target.checked })}
                    className="accent-brand-maroon"
                  />
                  <span>Mark as In Stock</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={sareeForm.featured}
                    onChange={(e) => setSareeForm({ ...sareeForm, featured: e.target.checked })}
                    className="accent-brand-maroon"
                  />
                  <span>Mark as Featured Royal Pick</span>
                </label>
              </div>

              <div className="pt-4 border-t flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsSareeModalOpen(false)}
                  className="px-4 py-2 border rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-brand-maroon text-brand-gold-light font-bold rounded-xl"
                >
                  Save Saree
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TYPE EDITOR MODAL */}
      {/* ======================================================== */}
      {isTypeModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-brand-gold/40">
            <h3 className="font-serif text-xl font-bold text-brand-maroon-dark border-b pb-3">
              {editingType ? 'Edit Saree Type' : 'Add Saree Type'}
            </h3>

            <form onSubmit={handleSaveType} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold mb-1">Type Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Kanchipuram Silk"
                  value={typeForm.name}
                  onChange={(e) => setTypeForm({ ...typeForm, name: e.target.value })}
                  className="w-full p-2 border rounded-xl"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Slug (URL-friendly)</label>
                <input
                  type="text"
                  placeholder="e.g. kanchipuram"
                  value={typeForm.slug}
                  onChange={(e) => setTypeForm({ ...typeForm, slug: e.target.value })}
                  className="w-full p-2 border rounded-xl"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Cover Image URL</label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  value={typeForm.cover_image_url}
                  onChange={(e) => setTypeForm({ ...typeForm, cover_image_url: e.target.value })}
                  className="w-full p-2 border rounded-xl"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Description</label>
                <textarea
                  rows={2}
                  value={typeForm.description}
                  onChange={(e) => setTypeForm({ ...typeForm, description: e.target.value })}
                  className="w-full p-2 border rounded-xl"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Display Order</label>
                <input
                  type="number"
                  value={typeForm.display_order}
                  onChange={(e) => setTypeForm({ ...typeForm, display_order: e.target.value })}
                  className="w-full p-2 border rounded-xl"
                />
              </div>

              <div className="pt-4 border-t flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsTypeModalOpen(false)}
                  className="px-4 py-2 border rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-brand-maroon text-brand-gold-light font-bold rounded-xl"
                >
                  Save Type
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Reference Image Lightbox */}
      {referenceLightboxImage && (
        <Lightbox
          isOpen={Boolean(referenceLightboxImage)}
          onClose={() => setReferenceLightboxImage(null)}
          images={[referenceLightboxImage]}
          currentIndex={0}
          onIndexChange={() => {}}
        />
      )}
    </div>
  );
}
