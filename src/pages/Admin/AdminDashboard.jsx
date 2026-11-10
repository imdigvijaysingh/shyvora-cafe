import React, { useState, useEffect } from 'react';
import { 
  Coffee, 
  UtensilsCrossed, 
  Sparkles, 
  Tag, 
  Image as ImageIcon, 
  Video, 
  Settings as SettingsIcon, 
  LogOut, 
  Plus, 
  Trash2, 
  Edit3, 
  Check, 
  X, 
  Save, 
  ExternalLink, 
  AlertCircle, 
  CheckCircle2, 
  Phone, 
  CreditCard, 
  Gift, 
  Snowflake, 
  Eye, 
  UploadCloud 
} from 'lucide-react';
import { useCafeData } from '../../context/CafeDataContext';
import { useCurrency } from '../../context/CurrencyContext';

const AdminDashboard = ({ onLogout }) => {
  const { 
    menuItems, 
    galleryPhotos, 
    deals, 
    settings, 
    updateSettings, 
    updateMenuItems, 
    updateDeals, 
    refreshData, 
    API_URL 
  } = useCafeData();
  const { formatPrice, currency } = useCurrency();

  const [activeTab, setActiveTab] = useState('menu');
  const [token, setToken] = useState(localStorage.getItem('cafe_admin_token') || '');
  const [notification, setNotification] = useState(null); // { type: 'success' | 'error', message: '' }

  // ----------------------------------------------------
  // Notification helper
  // ----------------------------------------------------
  const showNotice = (type, message) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 4000);
  };

  // Auth header
  const getAuthHeaders = () => ({
    'Authorization': `Bearer ${token}`
  });

  // Safe fetch helper that handles non-JSON / offline server errors gracefully
  const safeFetchJson = async (url, options = {}) => {
    try {
      const res = await fetch(url, options);
      const text = await res.text();
      let data = null;
      try {
        data = JSON.parse(text);
      } catch (_) {}

      if (!res.ok || (data && !data.success)) {
        throw new Error((data && data.message) || `Request returned status ${res.status}`);
      }
      return data || { success: true };
    } catch (err) {
      if (err.message && (err.message.includes('fetch') || err.message.includes('Failed to fetch') || err.message.includes('JSON'))) {
        throw new Error('Backend server is not running on port 5000. Start it with "npm run server".');
      }
      throw err;
    }
  };

  // ----------------------------------------------------
  // TAB 1: MENU STATE & ACTIONS
  // ----------------------------------------------------
  const [menuSearch, setMenuSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [editingPriceId, setEditingPriceId] = useState(null);
  const [inlinePrice, setInlinePrice] = useState('');
  const [isAddMenuOpen, setIsAddMenuOpen] = useState(false);
  const [editingMenuItem, setEditingMenuItem] = useState(null);

  // New Menu Item Form
  const [menuForm, setMenuForm] = useState({
    name: '',
    category: 'Coffee',
    description: '',
    price: '',
    isFeatured: false,
    imageFile: null,
    imageUrl: ''
  });

  const handleInlinePriceSave = async (id) => {
    const numPrice = parseFloat(inlinePrice);
    if (isNaN(numPrice) || numPrice <= 0) {
      showNotice('error', 'Please enter a valid price.');
      return;
    }

    try {
      // 1. Immediately update state & localStorage
      if (updateMenuItems) {
        updateMenuItems(prev => prev.map(item => item.id === id ? { ...item, price: numPrice } : item));
      }
      setEditingPriceId(null);
      showNotice('success', 'Price updated successfully!');

      // 2. Background sync
      safeFetchJson(`${API_URL}/api/menu/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders()
        },
        body: JSON.stringify({ price: numPrice })
      }).catch(err => console.warn('Background sync:', err));
    } catch (err) {
      showNotice('error', err.message);
    }
  };

  const handleDeleteMenuItem = async (id, name) => {
    if (!window.confirm(`Are you sure you want to remove "${name}" from the menu?`)) return;

    try {
      // 1. Immediately update state & localStorage
      if (updateMenuItems) {
        updateMenuItems(prev => prev.filter(item => item.id !== id));
      }
      showNotice('success', `Removed "${name}" from menu.`);

      // 2. Background sync
      safeFetchJson(`${API_URL}/api/menu/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      }).catch(err => console.warn('Background sync:', err));
    } catch (err) {
      showNotice('error', err.message);
    }
  };

  const handleSaveMenuItem = async (e) => {
    e.preventDefault();
    if (!menuForm.name.trim() || !menuForm.price) {
      showNotice('error', 'Name and price are required.');
      return;
    }

    try {
      const isEdit = !!editingMenuItem;
      const numPrice = parseFloat(menuForm.price);

      // 1. Immediately update state & localStorage
      if (updateMenuItems) {
        if (isEdit) {
          updateMenuItems(prev => prev.map(item => item.id === editingMenuItem.id ? {
            ...item,
            name: menuForm.name,
            title: menuForm.name,
            category: menuForm.category,
            description: menuForm.description,
            price: numPrice,
            isFeatured: menuForm.isFeatured,
            image: menuForm.imageUrl || item.image
          } : item));
        } else {
          const newItem = {
            id: `item_${Date.now()}`,
            name: menuForm.name,
            title: menuForm.name,
            category: menuForm.category,
            description: menuForm.description,
            price: numPrice,
            isFeatured: menuForm.isFeatured,
            image: menuForm.imageUrl || '/src/assets/images/menu_cappuccino_1784782504483.webp'
          };
          updateMenuItems(prev => [newItem, ...prev]);
        }
      }

      showNotice('success', isEdit ? 'Menu item updated!' : 'New menu item added!');
      setIsAddMenuOpen(false);
      setEditingMenuItem(null);
      setMenuForm({
        name: '',
        category: 'Coffee',
        description: '',
        price: '',
        isFeatured: false,
        imageFile: null,
        imageUrl: ''
      });

      // 2. Background server sync
      const formData = new FormData();
      formData.append('name', menuForm.name);
      formData.append('category', menuForm.category);
      formData.append('description', menuForm.description);
      formData.append('price', menuForm.price);
      formData.append('isFeatured', menuForm.isFeatured);
      if (menuForm.imageFile) {
        formData.append('image', menuForm.imageFile);
      } else if (menuForm.imageUrl) {
        formData.append('imageUrl', menuForm.imageUrl);
      }

      const url = isEdit ? `${API_URL}/api/menu/${editingMenuItem.id}` : `${API_URL}/api/menu`;
      const method = isEdit ? 'PUT' : 'POST';

      safeFetchJson(url, {
        method,
        headers: getAuthHeaders(),
        body: formData
      }).catch(err => console.warn('Background sync:', err));
    } catch (err) {
      showNotice('error', err.message);
    }
  };

  // ----------------------------------------------------
  // TAB 2: SEASONAL & FESTIVAL THEMES
  // ----------------------------------------------------
  const [seasonalSettings, setSeasonalSettings] = useState({
    enabled: settings?.seasonalTheme?.enabled ?? true,
    theme: settings?.seasonalTheme?.theme || 'christmas',
    title: settings?.seasonalTheme?.title || "Merry Christmas & Season's Greetings!",
    discountPercentage: settings?.seasonalTheme?.discountPercentage || '10%',
    discountCode: settings?.seasonalTheme?.discountCode || 'MERRY10',
    discountText: settings?.seasonalTheme?.discountText || 'Holiday Special: Get 10% off on all specialty coffees & dessert combos with code MERRY10',
    santaSpeech: settings?.seasonalTheme?.santaSpeech || '🎅 Ho Ho Ho! 10% Off Today!',
    santaSize: settings?.seasonalTheme?.santaSize || 'large',
    showFloatingSanta: settings?.seasonalTheme?.showFloatingSanta ?? true,
    showSnowflakes: settings?.seasonalTheme?.showSnowflakes ?? true,
    bannerColor: settings?.seasonalTheme?.bannerColor || '#991b1b'
  });

  useEffect(() => {
    if (settings?.seasonalTheme) {
      setSeasonalSettings(prev => ({
        ...prev,
        ...settings.seasonalTheme
      }));
    }
  }, [settings]);

  const handleSaveSeasonal = async () => {
    try {
      // 1. Immediately update context & localStorage (instant synchronous reflection)
      if (updateSettings) {
        await updateSettings({
          seasonalTheme: seasonalSettings
        });
      }

      // 2. Also try API if available
      try {
        await safeFetchJson(`${API_URL}/api/settings/seasonal`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            ...getAuthHeaders()
          },
          body: JSON.stringify(seasonalSettings)
        });
      } catch (apiErr) {
        console.warn('API sync in background:', apiErr.message);
      }

      showNotice('success', 'Seasonal layout & Santa speech applied & saved!');
    } catch (err) {
      showNotice('error', err.message);
    }
  };

  // ----------------------------------------------------
  // TAB 3: DEALS & COMBOS
  // ----------------------------------------------------
  const [dealForm, setDealForm] = useState({
    title: '',
    description: '',
    originalPrice: '',
    discountPrice: '',
    badge: 'Special Offer',
    isActive: true
  });
  const [isAddDealOpen, setIsAddDealOpen] = useState(false);

  const handleSaveDeal = async (e) => {
    e.preventDefault();
    if (!dealForm.title || !dealForm.discountPrice) {
      showNotice('error', 'Title and discount price are required.');
      return;
    }

    try {
      const newDeal = {
        id: `deal_${Date.now()}`,
        ...dealForm,
        originalPrice: parseFloat(dealForm.originalPrice || 0),
        discountPrice: parseFloat(dealForm.discountPrice)
      };

      if (updateDeals) {
        updateDeals(prev => [newDeal, ...prev]);
      }

      showNotice('success', 'Deal created!');
      setIsAddDealOpen(false);
      setDealForm({
        title: '',
        description: '',
        originalPrice: '',
        discountPrice: '',
        badge: 'Special Offer',
        isActive: true
      });

      safeFetchJson(`${API_URL}/api/deals`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders()
        },
        body: JSON.stringify(dealForm)
      }).catch(err => console.warn('Background sync:', err));
    } catch (err) {
      showNotice('error', err.message);
    }
  };

  const handleDeleteDeal = async (id) => {
    if (!window.confirm('Are you sure you want to delete this deal?')) return;
    try {
      if (updateDeals) {
        updateDeals(prev => prev.filter(d => d.id !== id));
      }
      showNotice('success', 'Deal deleted.');

      safeFetchJson(`${API_URL}/api/deals/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      }).catch(err => console.warn('Background sync:', err));
    } catch (err) {
      showNotice('error', err.message);
    }
  };

  // ----------------------------------------------------
  // TAB 4: HERO MEDIA (VIDEO STRICTLY PERMITTED HERE ONLY)
  // ----------------------------------------------------
  const [heroForm, setHeroForm] = useState({
    tagline: settings?.hero?.tagline || 'Good Coffee, Good Mood',
    titleLine1: settings?.hero?.titleLine1 || 'Savor Moments,',
    titleLine2: settings?.hero?.titleLine2 || 'Sip Happiness',
    mediaFile: null
  });

  useEffect(() => {
    if (settings?.hero) {
      setHeroForm(prev => ({
        ...prev,
        tagline: settings.hero.tagline || 'Good Coffee, Good Mood',
        titleLine1: settings.hero.titleLine1 || 'Savor Moments,',
        titleLine2: settings.hero.titleLine2 || 'Sip Happiness'
      }));
    }
  }, [settings]);

  const handleSaveHero = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('tagline', heroForm.tagline);
      formData.append('titleLine1', heroForm.titleLine1);
      formData.append('titleLine2', heroForm.titleLine2);
      if (heroForm.mediaFile) {
        formData.append('heroMedia', heroForm.mediaFile);
      }

      await safeFetchJson(`${API_URL}/api/settings/hero`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: formData
      });

      showNotice('success', 'Hero media & headlines updated!');
      setHeroForm(prev => ({ ...prev, mediaFile: null }));
      refreshData();
    } catch (err) {
      showNotice('error', err.message);
    }
  };

  // ----------------------------------------------------
  // TAB 5: GALLERY (STRICTLY IMAGES ONLY)
  // ----------------------------------------------------
  const [galleryForm, setGalleryForm] = useState({
    title: '',
    category: 'Ambience',
    photoFile: null
  });

  const handleUploadGallery = async (e) => {
    e.preventDefault();
    if (!galleryForm.photoFile) {
      showNotice('error', 'Please choose an image file to upload.');
      return;
    }

    // Client-side guard: enforce images only
    if (!galleryForm.photoFile.type.startsWith('image/')) {
      showNotice('error', '⚠️ Strictly images only (JPG, PNG, WebP). Videos are NOT permitted in the gallery to maintain site speed.');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('title', galleryForm.title || 'Cafe Experience');
      formData.append('category', galleryForm.category || 'Ambience');
      formData.append('photo', galleryForm.photoFile);

      await safeFetchJson(`${API_URL}/api/gallery`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: formData
      });

      showNotice('success', 'Photo added to gallery!');
      setGalleryForm({ title: '', category: 'Ambience', photoFile: null });
      refreshData();
    } catch (err) {
      showNotice('error', err.message);
    }
  };

  const handleDeleteGallery = async (id) => {
    if (!window.confirm('Are you sure you want to delete this photo from the gallery?')) return;
    try {
      await safeFetchJson(`${API_URL}/api/gallery/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });

      showNotice('success', 'Photo removed from gallery.');
      refreshData();
    } catch (err) {
      showNotice('error', err.message);
    }
  };

  // ----------------------------------------------------
  // TAB 6: SETTINGS (WHATSAPP, RAZORPAY, PASSWORD)
  // ----------------------------------------------------
  const [whatsappNumber, setWhatsappNumber] = useState(settings?.whatsappNumber || '9458082654');
  const [whatsappCountryCode, setWhatsappCountryCode] = useState(settings?.whatsappCountryCode || '91');
  const [razorpayKeyId, setRazorpayKeyId] = useState(settings?.razorpayKeyId || '');
  const [razorpayKeySecret, setRazorpayKeySecret] = useState('');
  const [newPassword, setNewPassword] = useState('');

  useEffect(() => {
    if (settings) {
      if (settings.whatsappNumber) setWhatsappNumber(settings.whatsappNumber);
      if (settings.whatsappCountryCode) setWhatsappCountryCode(settings.whatsappCountryCode);
      if (settings.razorpayKeyId) setRazorpayKeyId(settings.razorpayKeyId);
    }
  }, [settings]);

  const handleSaveWhatsApp = async () => {
    try {
      if (updateSettings) {
        updateSettings({ whatsappNumber, whatsappCountryCode });
      }

      showNotice('success', 'WhatsApp dispatch number updated!');

      safeFetchJson(`${API_URL}/api/settings/whatsapp`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders()
        },
        body: JSON.stringify({ whatsappNumber, whatsappCountryCode })
      }).catch(err => console.warn('Background sync:', err));
    } catch (err) {
      showNotice('error', err.message);
    }
  };

  const handleSaveRazorpay = async () => {
    try {
      if (updateSettings) {
        updateSettings({ razorpayKeyId });
      }

      showNotice('success', 'Razorpay credentials saved!');
      setRazorpayKeySecret('');

      safeFetchJson(`${API_URL}/api/settings/razorpay`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders()
        },
        body: JSON.stringify({ keyId: razorpayKeyId, keySecret: razorpayKeySecret })
      }).catch(err => console.warn('Background sync:', err));
    } catch (err) {
      showNotice('error', err.message);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (!newPassword || newPassword.length < 6) {
      showNotice('error', 'New password must be at least 6 characters.');
      return;
    }

    try {
      await safeFetchJson(`${API_URL}/api/auth/change-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders()
        },
        body: JSON.stringify({ newPassword })
      });

      showNotice('success', 'Admin password changed successfully!');
      setNewPassword('');
    } catch (err) {
      showNotice('error', err.message);
    }
  };

  // Filtered menu items
  const filteredMenuItems = (menuItems || []).filter(item => {
    if (!item) return false;
    const itemName = String(item.name || item.title || '');
    const itemDesc = String(item.description || '');
    const searchLower = (menuSearch || '').toLowerCase();
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesSearch = !searchLower || 
                          itemName.toLowerCase().includes(searchLower) ||
                          itemDesc.toLowerCase().includes(searchLower);
    return matchesCategory && matchesSearch;
  });

  const categories = ['All', 'Coffee', 'Breakfast', 'Desserts', 'Tea', 'Mains'];

  return (
    <div className="min-h-screen bg-[#181C19] text-gray-100 flex flex-col font-sans">
      {/* Top Bar Header */}
      <header className="bg-[#212723] border-b border-[#343D37] px-4 sm:px-8 py-3.5 flex flex-wrap items-center justify-between gap-4 sticky top-0 z-30 shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cafe-accent to-[#8C6D46] flex items-center justify-center text-white shadow-md">
            <Coffee size={22} />
          </div>
          <div>
            <h1 className="font-serif text-lg sm:text-xl font-bold text-white tracking-wide flex items-center gap-2">
              Brew & Bloom
              <span className="text-[10px] font-sans font-semibold uppercase tracking-wider bg-cafe-accent/20 text-cafe-accent px-2 py-0.5 rounded-md border border-cafe-accent/30">
                Owner CMS
              </span>
            </h1>
            <p className="text-[11px] text-gray-400">
              Orders WhatsApp: <strong className="text-emerald-400 font-mono">+{settings?.whatsappCountryCode || '91'} {settings?.whatsappNumber || '9458082654'}</strong>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#2A322D] hover:bg-[#343E38] text-xs font-medium text-gray-300 hover:text-white transition-colors border border-[#3A453E]"
          >
            <ExternalLink size={13} />
            <span className="hidden sm:inline">Preview Live Website</span>
          </a>

          <button
            onClick={onLogout}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-950/40 hover:bg-red-900/50 text-red-300 text-xs font-medium transition-colors border border-red-800/40"
          >
            <LogOut size={13} />
            <span>Log Out</span>
          </button>
        </div>
      </header>

      {/* Global Notification Banner */}
      {notification && (
        <div className={`fixed top-16 right-4 z-50 px-4 py-3 rounded-xl shadow-xl flex items-center gap-2.5 text-sm font-medium animate-fade-in-up border ${
          notification.type === 'success'
            ? 'bg-emerald-950/90 border-emerald-500/50 text-emerald-200'
            : 'bg-red-950/90 border-red-500/50 text-red-200'
        }`}>
          {notification.type === 'success' ? <CheckCircle2 size={18} className="text-emerald-400" /> : <AlertCircle size={18} className="text-red-400" />}
          <span>{notification.message}</span>
        </div>
      )}

      {/* Main Body with Sidebar Tabs */}
      <div className="flex-1 flex flex-col md:flex-row">
        {/* Navigation Sidebar */}
        <aside className="w-full md:w-64 bg-[#1E2320] border-b md:border-b-0 md:border-r border-[#303832] p-3 sm:p-4 shrink-0 flex md:flex-col gap-1.5 overflow-x-auto md:overflow-x-visible">
          <button
            onClick={() => setActiveTab('menu')}
            className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all text-left whitespace-nowrap ${
              activeTab === 'menu'
                ? 'bg-cafe-accent text-white shadow-md font-semibold'
                : 'text-gray-300 hover:bg-[#282F2A] hover:text-white'
            }`}
          >
            <UtensilsCrossed size={17} />
            <span>Menu & Prices</span>
            <span className="ml-auto text-[10px] bg-black/20 px-1.5 py-0.5 rounded-full font-mono">{menuItems.length}</span>
          </button>

          <button
            onClick={() => setActiveTab('seasonal')}
            className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all text-left whitespace-nowrap ${
              activeTab === 'seasonal'
                ? 'bg-cafe-accent text-white shadow-md font-semibold'
                : 'text-gray-300 hover:bg-[#282F2A] hover:text-white'
            }`}
          >
            <Sparkles size={17} />
            <span>Seasonal & Santa</span>
            {seasonalSettings.enabled && (
              <span className="ml-auto w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('deals')}
            className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all text-left whitespace-nowrap ${
              activeTab === 'deals'
                ? 'bg-cafe-accent text-white shadow-md font-semibold'
                : 'text-gray-300 hover:bg-[#282F2A] hover:text-white'
            }`}
          >
            <Tag size={17} />
            <span>Deals & Combos</span>
            <span className="ml-auto text-[10px] bg-black/20 px-1.5 py-0.5 rounded-full font-mono">{deals.length}</span>
          </button>

          <button
            onClick={() => setActiveTab('hero')}
            className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all text-left whitespace-nowrap ${
              activeTab === 'hero'
                ? 'bg-cafe-accent text-white shadow-md font-semibold'
                : 'text-gray-300 hover:bg-[#282F2A] hover:text-white'
            }`}
          >
            <Video size={17} />
            <span>Hero Video & Media</span>
          </button>

          <button
            onClick={() => setActiveTab('gallery')}
            className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all text-left whitespace-nowrap ${
              activeTab === 'gallery'
                ? 'bg-cafe-accent text-white shadow-md font-semibold'
                : 'text-gray-300 hover:bg-[#282F2A] hover:text-white'
            }`}
          >
            <ImageIcon size={17} />
            <span>Gallery Photos</span>
            <span className="ml-auto text-[10px] bg-black/20 px-1.5 py-0.5 rounded-full font-mono">{galleryPhotos.length}</span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all text-left whitespace-nowrap ${
              activeTab === 'settings'
                ? 'bg-cafe-accent text-white shadow-md font-semibold'
                : 'text-gray-300 hover:bg-[#282F2A] hover:text-white'
            }`}
          >
            <SettingsIcon size={17} />
            <span>Settings & WhatsApp</span>
          </button>
        </aside>

        {/* Tab Content Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {/* ==================================================== */}
          {/* TAB 1: MENU & PRICES */}
          {/* ==================================================== */}
          {activeTab === 'menu' && (
            <div className="space-y-6 animate-fade-in-up">
              {/* Top controls */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#212723] p-4 rounded-2xl border border-[#343D37]">
                <div>
                  <h2 className="text-xl font-serif font-bold text-white">Menu & Live Price Manager</h2>
                  <p className="text-xs text-gray-400">Edit prices in real time, add specialty beverages, or update food photos.</p>
                </div>
                <button
                  onClick={() => {
                    setEditingMenuItem(null);
                    setMenuForm({
                      name: '',
                      category: 'Coffee',
                      description: '',
                      price: '',
                      isFeatured: false,
                      imageFile: null,
                      imageUrl: ''
                    });
                    setIsAddMenuOpen(true);
                  }}
                  className="inline-flex items-center gap-2 px-4 py-2.5 bg-cafe-accent hover:bg-[#B89366] text-white rounded-xl text-xs sm:text-sm font-semibold shadow-md transition-colors shrink-0"
                >
                  <Plus size={16} />
                  <span>Add New Menu Item</span>
                </button>
              </div>

              {/* Filters & Search */}
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1">
                  <input
                    type="text"
                    value={menuSearch}
                    onChange={(e) => setMenuSearch(e.target.value)}
                    placeholder="Search menu items by name or description..."
                    className="w-full bg-[#212723] border border-[#343D37] rounded-xl px-4 py-2.5 text-xs sm:text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-cafe-accent"
                  />
                </div>
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
                  {categories.map(cat => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors shrink-0 ${
                        selectedCategory === cat
                          ? 'bg-cafe-accent text-white'
                          : 'bg-[#212723] text-gray-300 hover:text-white border border-[#343D37]'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Menu Items Table / Grid */}
              <div className="bg-[#212723] rounded-2xl border border-[#343D37] overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs sm:text-sm">
                    <thead className="bg-[#1A1F1C] text-gray-400 uppercase text-[11px] tracking-wider border-b border-[#343D37]">
                      <tr>
                        <th className="py-3 px-4">Item</th>
                        <th className="py-3 px-3">Category</th>
                        <th className="py-3 px-3">Price (Live USD)</th>
                        <th className="py-3 px-3">Featured</th>
                        <th className="py-3 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#2B332D]">
                      {filteredMenuItems.map(item => (
                        <tr key={item.id} className="hover:bg-[#252C27] transition-colors">
                          <td className="py-3 px-4 flex items-center gap-3">
                            <img
                              src={item.image || '/src/assets/images/menu_cappuccino_1784782504483.webp'}
                              alt={item.name || item.title || 'Cafe Item'}
                              className="w-12 h-12 rounded-xl object-cover border border-[#3A453E] shrink-0"
                              onError={(e) => { e.target.src = '/hero_poster.webp'; }}
                            />
                            <div>
                              <p className="font-semibold text-white">{item.name || item.title || 'Cafe Item'}</p>
                              <p className="text-[11px] text-gray-400 line-clamp-1 max-w-xs">{item.description}</p>
                            </div>
                          </td>
                          <td className="py-3 px-3">
                            <span className="px-2.5 py-0.5 rounded-full text-[11px] bg-[#1A1F1C] border border-[#343D37] text-gray-300">
                              {item.category}
                            </span>
                          </td>
                          <td className="py-3 px-3">
                            {editingPriceId === item.id ? (
                              <div className="flex items-center gap-1.5">
                                <span className="text-gray-400">$</span>
                                <input
                                  type="number"
                                  step="0.1"
                                  value={inlinePrice}
                                  onChange={(e) => setInlinePrice(e.target.value)}
                                  className="w-20 bg-[#1A1F1C] border border-cafe-accent rounded-lg px-2 py-1 text-white text-xs font-mono focus:outline-none"
                                  autoFocus
                                />
                                <button
                                  onClick={() => handleInlinePriceSave(item.id)}
                                  className="p-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white"
                                  title="Save price"
                                >
                                  <Check size={14} />
                                </button>
                                <button
                                  onClick={() => setEditingPriceId(null)}
                                  className="p-1 rounded bg-gray-700 hover:bg-gray-600 text-gray-300"
                                  title="Cancel"
                                >
                                  <X size={14} />
                                </button>
                              </div>
                            ) : (
                              <div className="flex items-center gap-2 group">
                                <span className="font-mono font-semibold text-emerald-400 text-sm">
                                  ${parseFloat(item.price).toFixed(2)}
                                </span>
                                <button
                                  onClick={() => {
                                    setEditingPriceId(item.id);
                                    setInlinePrice(item.price);
                                  }}
                                  className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-cafe-accent transition-opacity"
                                  title="Quick edit price"
                                >
                                  <Edit3 size={13} />
                                </button>
                              </div>
                            )}
                          </td>
                          <td className="py-3 px-3">
                            {item.isFeatured ? (
                              <span className="text-[10px] uppercase font-bold text-amber-400 bg-amber-950/40 border border-amber-600/30 px-2 py-0.5 rounded-md">
                                Featured ★
                              </span>
                            ) : (
                              <span className="text-gray-500 text-xs">—</span>
                            )}
                          </td>
                          <td className="py-3 px-4 text-right">
                            <div className="inline-flex items-center gap-1.5">
                              <button
                                onClick={() => {
                                  setEditingMenuItem(item);
                                  setMenuForm({
                                    name: item.name || item.title || '',
                                    category: item.category || 'Coffee',
                                    description: item.description || '',
                                    price: item.price,
                                    isFeatured: item.isFeatured || false,
                                    imageFile: null,
                                    imageUrl: item.image || ''
                                  });
                                  setIsAddMenuOpen(true);
                                }}
                                className="p-1.5 rounded-lg bg-[#2D3530] hover:bg-[#39433D] text-gray-300 hover:text-white transition-colors"
                                title="Edit item"
                              >
                                <Edit3 size={15} />
                              </button>
                              <button
                                onClick={() => handleDeleteMenuItem(item.id, item.name || item.title || 'Item')}
                                className="p-1.5 rounded-lg bg-red-950/40 hover:bg-red-900/50 text-red-300 hover:text-red-200 transition-colors"
                                title="Delete item"
                              >
                                <Trash2 size={15} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ==================================================== */}
          {/* TAB 2: SEASONAL & FESTIVAL THEMES (ON DEMAND SANTA) */}
          {/* ==================================================== */}
          {activeTab === 'seasonal' && (
            <div className="space-y-6 animate-fade-in-up max-w-4xl">
              <div className="bg-[#212723] p-6 rounded-2xl border border-[#343D37]">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#343D37]">
                  <div>
                    <h2 className="text-xl font-serif font-bold text-white flex items-center gap-2">
                      <Sparkles className="text-amber-400" />
                      Festival & Holiday Layout Mode
                    </h2>
                    <p className="text-xs text-gray-400 mt-1">
                      Activate on holidays (e.g. Christmas, New Year, Black Friday) to display an animated festive ribbon and floating Santa character!
                    </p>
                  </div>

                  {/* Master Toggle */}
                  <label className="relative inline-flex items-center cursor-pointer shrink-0">
                    <input
                      type="checkbox"
                      checked={seasonalSettings.enabled}
                      onChange={(e) => setSeasonalSettings(prev => ({ ...prev, enabled: e.target.checked }))}
                      className="sr-only peer"
                    />
                    <div className="w-14 h-7 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-emerald-600"></div>
                    <span className="ml-3 text-sm font-semibold text-white">
                      {seasonalSettings.enabled ? 'ACTIVE' : 'OFF'}
                    </span>
                  </label>
                </div>

                {/* Preset Themes */}
                <div className="py-6 border-b border-[#343D37]">
                  <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-3">
                    Choose Festival Theme Preset
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {[
                      { 
                        id: 'christmas', 
                        name: 'Christmas 🎅', 
                        color: '#991b1b', 
                        title: "Merry Christmas & Season's Greetings!", 
                        code: 'MERRY10',
                        percentage: '10%',
                        speech: '🎅 Ho Ho Ho! 10% Off Today!',
                        text: 'Holiday Special: Get 10% off on all specialty coffees & dessert combos with code MERRY10'
                      },
                      { 
                        id: 'newyear', 
                        name: 'New Year 🎆', 
                        color: '#1e3a8a', 
                        title: "Happy New Year! Start Fresh with Brew & Bloom", 
                        code: 'NEWYEAR15',
                        percentage: '15%',
                        speech: '🎆 Happy New Year! 15% Off!',
                        text: 'New Year Special: Enjoy 15% off across our entire menu with code NEWYEAR15'
                      },
                      { 
                        id: 'blackfriday', 
                        name: 'Black Friday 🏷️', 
                        color: '#09090b', 
                        title: "Black Friday Mega Sale - Up to 20% Off", 
                        code: 'FRIDAY20',
                        percentage: '20%',
                        speech: '🏷️ Black Friday! 20% Off!',
                        text: 'Black Friday Deal: Get 20% off all brews and baked delights with code FRIDAY20'
                      },
                      { 
                        id: 'diwali', 
                        name: 'Festival of Lights 🪔', 
                        color: '#78350f', 
                        title: "Happy Diwali! Celebrate Sweet Moments", 
                        code: 'DIWALI10',
                        percentage: '10%',
                        speech: '🪔 Happy Diwali! 10% Off!',
                        text: 'Festive Delight: Celebrate Diwali with 10% off our specialty beverages with code DIWALI10'
                      }
                    ].map(preset => (
                      <button
                        key={preset.id}
                        type="button"
                        onClick={() => {
                          setSeasonalSettings(prev => ({
                            ...prev,
                            theme: preset.id,
                            bannerColor: preset.color,
                            title: preset.title,
                            discountCode: preset.code,
                            discountPercentage: preset.percentage,
                            santaSpeech: preset.speech,
                            discountText: preset.text
                          }));
                        }}
                        className={`p-3.5 rounded-xl border text-left text-xs transition-all ${
                          seasonalSettings.theme === preset.id
                            ? 'border-cafe-accent bg-cafe-accent/10 ring-2 ring-cafe-accent/30'
                            : 'border-[#3A453E] bg-[#1A1F1C] hover:border-gray-500'
                        }`}
                      >
                        <p className="font-bold text-white mb-1">{preset.name}</p>
                        <div className="w-5 h-5 rounded-full border border-white/20 mb-2" style={{ backgroundColor: preset.color }}></div>
                        <p className="text-[10px] text-gray-400 font-mono">Code: {preset.code}</p>
                        <p className="text-[10px] text-emerald-400 font-semibold">{preset.percentage} Off</p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Santa & Holiday Controls */}
                <div className="py-6 border-b border-[#343D37] space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex items-center justify-between p-4 bg-[#1A1F1C] rounded-xl border border-[#3A453E]">
                      <div className="flex items-center gap-3">
                        <Gift className="text-red-400" size={20} />
                        <div>
                          <p className="font-semibold text-white text-xs sm:text-sm">Floating Draggable Santa</p>
                          <p className="text-[11px] text-gray-400">Animated transparent character floating in corner</p>
                        </div>
                      </div>
                      <input
                        type="checkbox"
                        checked={seasonalSettings.showFloatingSanta}
                        onChange={(e) => setSeasonalSettings(prev => ({ ...prev, showFloatingSanta: e.target.checked }))}
                        className="w-5 h-5 text-cafe-accent rounded focus:ring-cafe-accent bg-gray-700 border-gray-600"
                      />
                    </div>

                    <div className="flex items-center justify-between p-4 bg-[#1A1F1C] rounded-xl border border-[#3A453E]">
                      <div className="flex items-center gap-3">
                        <Snowflake className="text-sky-400" size={20} />
                        <div>
                          <p className="font-semibold text-white text-xs sm:text-sm">Falling Snowflakes</p>
                          <p className="text-[11px] text-gray-400">Subtle, non-intrusive winter snowfall effect</p>
                        </div>
                      </div>
                      <input
                        type="checkbox"
                        checked={seasonalSettings.showSnowflakes}
                        onChange={(e) => setSeasonalSettings(prev => ({ ...prev, showSnowflakes: e.target.checked }))}
                        className="w-5 h-5 text-cafe-accent rounded focus:ring-cafe-accent bg-gray-700 border-gray-600"
                      />
                    </div>
                  </div>

                  {/* Santa Character Size Selector */}
                  <div className="p-4 bg-[#1A1F1C] rounded-xl border border-[#3A453E] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <p className="font-semibold text-white text-xs sm:text-sm">Santa Character Display Size</p>
                      <p className="text-[11px] text-gray-400">Select how large Santa appears on screen</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {[
                        { id: 'normal', label: 'Normal' },
                        { id: 'large', label: 'Large (Recommended)' },
                        { id: 'xl', label: 'Extra Large' }
                      ].map(s => (
                        <button
                          key={s.id}
                          type="button"
                          onClick={() => setSeasonalSettings(prev => ({ ...prev, santaSize: s.id }))}
                          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                            (seasonalSettings.santaSize || 'large') === s.id
                              ? 'bg-cafe-accent text-white shadow-md'
                              : 'bg-[#252C27] border border-[#3A453E] text-gray-300 hover:text-white'
                          }`}
                        >
                          {s.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Banner & Santa Speech Details */}
                <div className="py-6 space-y-4">
                  {/* Discount percentage and Santa speech */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
                        Discount Percentage (%)
                      </label>
                      <input
                        type="text"
                        value={seasonalSettings.discountPercentage || ''}
                        onChange={(e) => {
                          const val = e.target.value;
                          setSeasonalSettings(prev => ({
                            ...prev,
                            discountPercentage: val,
                            santaSpeech: val ? `🎅 Ho Ho Ho! ${val} Off Today!` : prev.santaSpeech
                          }));
                        }}
                        placeholder="e.g. 10%"
                        className="w-full bg-[#1A1F1C] border border-[#3A453E] rounded-xl px-4 py-2.5 text-xs sm:text-sm text-white font-semibold focus:outline-none focus:border-cafe-accent"
                      />
                      <p className="text-[11px] text-gray-400 mt-1">Directly syncs with Santa's speech bubble!</p>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
                        Santa Speech Bubble Text
                      </label>
                      <input
                        type="text"
                        value={seasonalSettings.santaSpeech || ''}
                        onChange={(e) => setSeasonalSettings(prev => ({ ...prev, santaSpeech: e.target.value }))}
                        placeholder="e.g. 🎅 Ho Ho Ho! 10% Off Today!"
                        className="w-full bg-[#1A1F1C] border border-[#3A453E] rounded-xl px-4 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-cafe-accent"
                      />
                      <p className="text-[11px] text-gray-400 mt-1">Exact phrase shown inside Santa's speech bubble.</p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
                      Announcement Banner Title
                    </label>
                    <input
                      type="text"
                      value={seasonalSettings.title}
                      onChange={(e) => setSeasonalSettings(prev => ({ ...prev, title: e.target.value }))}
                      className="w-full bg-[#1A1F1C] border border-[#3A453E] rounded-xl px-4 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-cafe-accent"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
                        Discount Promo Code
                      </label>
                      <input
                        type="text"
                        value={seasonalSettings.discountCode}
                        onChange={(e) => setSeasonalSettings(prev => ({ ...prev, discountCode: e.target.value.toUpperCase() }))}
                        className="w-full bg-[#1A1F1C] border border-[#3A453E] rounded-xl px-4 py-2.5 text-xs sm:text-sm text-white font-mono uppercase focus:outline-none focus:border-cafe-accent"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
                        Banner Background Color
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={seasonalSettings.bannerColor}
                          onChange={(e) => setSeasonalSettings(prev => ({ ...prev, bannerColor: e.target.value }))}
                          className="w-10 h-10 rounded-lg cursor-pointer bg-transparent border-0"
                        />
                        <input
                          type="text"
                          value={seasonalSettings.bannerColor}
                          onChange={(e) => setSeasonalSettings(prev => ({ ...prev, bannerColor: e.target.value }))}
                          className="flex-1 bg-[#1A1F1C] border border-[#3A453E] rounded-xl px-4 py-2.5 text-xs sm:text-sm text-white font-mono"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
                      Promotional Text & Details
                    </label>
                    <textarea
                      rows={2}
                      value={seasonalSettings.discountText}
                      onChange={(e) => setSeasonalSettings(prev => ({ ...prev, discountText: e.target.value }))}
                      className="w-full bg-[#1A1F1C] border border-[#3A453E] rounded-xl px-4 py-2 text-xs sm:text-sm text-white focus:outline-none focus:border-cafe-accent"
                    />
                  </div>
                </div>

                {/* Live Banner & Santa Preview Card */}
                <div className="p-4 bg-[#1A1F1C] rounded-xl border border-[#3A453E] space-y-4">
                  <p className="text-[11px] text-gray-400 font-semibold uppercase tracking-wider">Live Website Preview</p>
                  
                  {/* Banner Preview */}
                  <div
                    className="p-3 rounded-lg text-white text-xs text-center font-medium shadow-md flex items-center justify-center gap-2"
                    style={{ backgroundColor: seasonalSettings.bannerColor || '#991b1b' }}
                  >
                    <span>🎁</span>
                    <strong>{seasonalSettings.title}</strong>
                    <span className="opacity-90">— {seasonalSettings.discountText}</span>
                  </div>

                  {/* Santa Speech Bubble Preview */}
                  {seasonalSettings.showFloatingSanta && (
                    <div className="p-4 bg-[#252C27] rounded-xl border border-[#3A453E] flex items-center justify-center gap-4">
                      <div className="flex flex-col items-center">
                        <div className="bg-white text-cafe-dark font-serif text-xs font-bold px-3 py-1.5 rounded-full shadow-lg border border-red-300 flex items-center gap-1.5 mb-1 animate-bounce">
                          <span>{seasonalSettings.santaSpeech || `🎅 Ho Ho Ho! ${seasonalSettings.discountPercentage || '10%'} Off Today!`}</span>
                        </div>
                        <span className="text-3xl">🎅</span>
                        <span className="text-[10px] text-gray-400 mt-1 font-sans">Santa Preview ({seasonalSettings.santaSize || 'large'})</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Save button */}
                <div className="pt-6 flex justify-end">
                  <button
                    onClick={handleSaveSeasonal}
                    className="flex items-center gap-2 px-6 py-3 bg-cafe-accent hover:bg-[#B89366] text-white rounded-xl text-xs sm:text-sm font-semibold shadow-lg shadow-cafe-accent/20 transition-all"
                  >
                    <Save size={16} />
                    <span>Apply & Save Theme Changes</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ==================================================== */}
          {/* TAB 3: DEALS & COMBOS */}
          {/* ==================================================== */}
          {activeTab === 'deals' && (
            <div className="space-y-6 animate-fade-in-up max-w-4xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#212723] p-4 rounded-2xl border border-[#343D37]">
                <div>
                  <h2 className="text-xl font-serif font-bold text-white">Deals, Combos & Festival Offers</h2>
                  <p className="text-xs text-gray-400">Create enticing bundle deals and discounted specials for visitors.</p>
                </div>
                <button
                  onClick={() => setIsAddDealOpen(true)}
                  className="inline-flex items-center gap-2 px-4 py-2.5 bg-cafe-accent hover:bg-[#B89366] text-white rounded-xl text-xs sm:text-sm font-semibold shadow-md transition-colors shrink-0"
                >
                  <Plus size={16} />
                  <span>Create New Combo Deal</span>
                </button>
              </div>

              {/* Deal Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {deals.map(deal => (
                  <div key={deal.id} className="bg-[#212723] border border-[#343D37] p-5 rounded-2xl relative shadow-md">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-950/60 border border-amber-600/40 text-amber-300">
                        {deal.badge || 'Combo Deal'}
                      </span>
                      <button
                        onClick={() => handleDeleteDeal(deal.id)}
                        className="text-gray-400 hover:text-red-400 p-1"
                        title="Delete deal"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>

                    <h3 className="text-base font-serif font-bold text-white mb-1">{deal.title}</h3>
                    <p className="text-xs text-gray-400 mb-4">{deal.description}</p>

                    <div className="flex items-center justify-between pt-3 border-t border-[#343D37]">
                      <div>
                        {deal.originalPrice > 0 && (
                          <span className="text-xs text-gray-500 line-through mr-2">
                            ${parseFloat(deal.originalPrice).toFixed(2)}
                          </span>
                        )}
                        <span className="text-lg font-mono font-bold text-emerald-400">
                          ${parseFloat(deal.discountPrice).toFixed(2)}
                        </span>
                      </div>
                      <span className="text-[11px] text-emerald-400 font-medium bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-500/30">
                        Active Deal
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ==================================================== */}
          {/* TAB 4: HERO MEDIA (STRICT VIDEO CONTROLS) */}
          {/* ==================================================== */}
          {activeTab === 'hero' && (
            <div className="space-y-6 animate-fade-in-up max-w-4xl">
              {/* Performance Notice Box */}
              <div className="p-4 bg-amber-950/40 border border-amber-500/40 rounded-2xl flex items-start gap-3">
                <AlertCircle className="text-amber-400 shrink-0 mt-0.5" size={20} />
                <div className="text-xs text-amber-200 leading-relaxed">
                  <strong className="text-amber-100 font-semibold block mb-0.5">High-Performance Rule Notice:</strong>
                  Video uploads (MP4 / WebM) are strictly reserved for the <strong>Hero Section</strong> only. To prevent site bloat and guarantee blazing 90+ mobile speeds, videos are strictly barred from the gallery and menu sections.
                </div>
              </div>

              <form onSubmit={handleSaveHero} className="bg-[#212723] p-6 rounded-2xl border border-[#343D37] space-y-5">
                <h2 className="text-xl font-serif font-bold text-white flex items-center gap-2">
                  <Video className="text-cafe-accent" />
                  Hero Section Media & Headlines
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
                      Headline (Line 1)
                    </label>
                    <input
                      type="text"
                      value={heroForm.titleLine1}
                      onChange={(e) => setHeroForm(prev => ({ ...prev, titleLine1: e.target.value }))}
                      className="w-full bg-[#1A1F1C] border border-[#3A453E] rounded-xl px-4 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-cafe-accent"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
                      Headline (Line 2 / Italic Accent)
                    </label>
                    <input
                      type="text"
                      value={heroForm.titleLine2}
                      onChange={(e) => setHeroForm(prev => ({ ...prev, titleLine2: e.target.value }))}
                      className="w-full bg-[#1A1F1C] border border-[#3A453E] rounded-xl px-4 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-cafe-accent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
                    Tagline Pill
                  </label>
                  <input
                    type="text"
                    value={heroForm.tagline}
                    onChange={(e) => setHeroForm(prev => ({ ...prev, tagline: e.target.value }))}
                    className="w-full bg-[#1A1F1C] border border-[#3A453E] rounded-xl px-4 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-cafe-accent"
                  />
                </div>

                {/* Hero Media File Upload (Video or Poster) */}
                <div>
                  <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
                    Upload New Hero Video or Poster Image (MP4, WebM, WebP, JPG)
                  </label>
                  <div className="border-2 border-dashed border-[#3A453E] hover:border-cafe-accent rounded-2xl p-6 text-center cursor-pointer transition-colors bg-[#1A1F1C]">
                    <UploadCloud size={28} className="mx-auto text-gray-400 mb-2" />
                    <p className="text-xs text-gray-300 mb-1">Click to select MP4 / WebM video or poster image</p>
                    <p className="text-[11px] text-gray-500">Max size: 50MB. Video will automatically loop in background.</p>
                    <input
                      type="file"
                      accept="video/mp4,video/webm,image/*"
                      onChange={(e) => setHeroForm(prev => ({ ...prev, mediaFile: e.target.files[0] }))}
                      className="mt-3 text-xs text-gray-400 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-cafe-accent file:text-white hover:file:bg-[#B89366]"
                    />
                  </div>
                  {heroForm.mediaFile && (
                    <p className="mt-2 text-xs text-emerald-400 font-medium">
                      ✓ Selected file: {heroForm.mediaFile.name} ({(heroForm.mediaFile.size / 1024 / 1024).toFixed(2)} MB)
                    </p>
                  )}
                </div>

                <div className="flex justify-end pt-3">
                  <button
                    type="submit"
                    className="flex items-center gap-2 px-6 py-3 bg-cafe-accent hover:bg-[#B89366] text-white rounded-xl text-xs sm:text-sm font-semibold shadow-lg shadow-cafe-accent/20 transition-all"
                  >
                    <Save size={16} />
                    <span>Save Hero Updates</span>
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* ==================================================== */}
          {/* TAB 5: GALLERY (IMAGES STRICTLY ENFORCED) */}
          {/* ==================================================== */}
          {activeTab === 'gallery' && (
            <div className="space-y-6 animate-fade-in-up max-w-4xl">
              {/* Uploader Card */}
              <form onSubmit={handleUploadGallery} className="bg-[#212723] p-6 rounded-2xl border border-[#343D37] space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-serif font-bold text-white flex items-center gap-2">
                    <ImageIcon className="text-cafe-accent" />
                    Gallery Photo Manager
                  </h2>
                  <span className="text-[11px] px-2.5 py-1 rounded-full bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 font-medium">
                    Images Only (Strict)
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
                      Photo Title / Caption
                    </label>
                    <input
                      type="text"
                      value={galleryForm.title}
                      onChange={(e) => setGalleryForm(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="e.g. Cozy Corner Seating"
                      className="w-full bg-[#1A1F1C] border border-[#3A453E] rounded-xl px-4 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-cafe-accent"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
                      Category
                    </label>
                    <select
                      value={galleryForm.category}
                      onChange={(e) => setGalleryForm(prev => ({ ...prev, category: e.target.value }))}
                      className="w-full bg-[#1A1F1C] border border-[#3A453E] rounded-xl px-4 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-cafe-accent"
                    >
                      <option value="Ambience">Ambience</option>
                      <option value="Kitchen">Kitchen & Brewing</option>
                      <option value="Team">Team & Baristas</option>
                      <option value="Guests">Guests & Moments</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
                    Select Image File (JPG, PNG, WebP)
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setGalleryForm(prev => ({ ...prev, photoFile: e.target.files[0] }))}
                    className="w-full bg-[#1A1F1C] border border-[#3A453E] rounded-xl p-2 text-xs text-gray-400 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-cafe-accent file:text-white hover:file:bg-[#B89366]"
                  />
                  <p className="text-[11px] text-gray-400 mt-1">
                    *Note: Video files cannot be uploaded to gallery. Only lightweight images are supported.
                  </p>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    className="flex items-center gap-2 px-5 py-2.5 bg-cafe-accent hover:bg-[#B89366] text-white rounded-xl text-xs sm:text-sm font-semibold shadow-md transition-colors"
                  >
                    <Plus size={16} />
                    <span>Upload to Gallery</span>
                  </button>
                </div>
              </form>

              {/* Gallery Photos Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {galleryPhotos.map(photo => (
                  <div key={photo.id} className="relative group rounded-2xl overflow-hidden border border-[#343D37] aspect-square bg-[#1A1F1C]">
                    <img
                      src={photo.imageUrl}
                      alt={photo.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-3 flex flex-col justify-between">
                      <button
                        onClick={() => handleDeleteGallery(photo.id)}
                        className="self-end p-1.5 bg-red-600/90 text-white rounded-lg hover:bg-red-500 transition-colors shadow-md"
                        title="Delete photo"
                      >
                        <Trash2 size={14} />
                      </button>
                      <div>
                        <p className="text-white text-xs font-semibold truncate">{photo.title}</p>
                        <p className="text-[10px] text-gray-300">{photo.category}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ==================================================== */}
          {/* TAB 6: SETTINGS (WHATSAPP, RAZORPAY, PASSWORD) */}
          {/* ==================================================== */}
          {activeTab === 'settings' && (
            <div className="space-y-6 animate-fade-in-up max-w-3xl">
              {/* WhatsApp Number Settings */}
              <div className="bg-[#212723] p-6 rounded-2xl border border-[#343D37] space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-950/60 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                    <Phone size={20} />
                  </div>
                  <div>
                    <h2 className="text-lg font-serif font-bold text-white">Owner Order WhatsApp Number</h2>
                    <p className="text-xs text-gray-400">Customer bills & instant order notifications will be dispatched to this number.</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                  <div>
                    <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
                      Country Code
                    </label>
                    <div className="flex items-center">
                      <span className="bg-[#1A1F1C] border border-r-0 border-[#3A453E] rounded-l-xl px-3 py-2.5 text-xs text-gray-400 font-mono">
                        +
                      </span>
                      <input
                        type="text"
                        value={whatsappCountryCode}
                        onChange={(e) => setWhatsappCountryCode(e.target.value.replace(/[^0-9]/g, ''))}
                        className="w-full bg-[#1A1F1C] border border-[#3A453E] rounded-r-xl px-3 py-2.5 text-xs sm:text-sm text-white font-mono focus:outline-none focus:border-cafe-accent"
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
                      Phone Number (Current: 945-808-2654)
                    </label>
                    <input
                      type="text"
                      value={whatsappNumber}
                      onChange={(e) => setWhatsappNumber(e.target.value.replace(/[^0-9]/g, ''))}
                      className="w-full bg-[#1A1F1C] border border-[#3A453E] rounded-xl px-4 py-2.5 text-xs sm:text-sm text-white font-mono focus:outline-none focus:border-cafe-accent"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    onClick={handleSaveWhatsApp}
                    className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs sm:text-sm font-semibold shadow-md transition-colors"
                  >
                    <Save size={15} />
                    <span>Update WhatsApp Dispatch</span>
                  </button>
                </div>
              </div>

              {/* Razorpay Credentials */}
              <div className="bg-[#212723] p-6 rounded-2xl border border-[#343D37] space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-sky-950/60 border border-sky-500/30 flex items-center justify-center text-sky-400">
                    <CreditCard size={20} />
                  </div>
                  <div>
                    <h2 className="text-lg font-serif font-bold text-white">Razorpay Online Payment Keys</h2>
                    <p className="text-xs text-gray-400">Enter your Razorpay test or live API credentials.</p>
                  </div>
                </div>

                <div className="space-y-3 pt-2">
                  <div>
                    <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
                      Razorpay Key ID
                    </label>
                    <input
                      type="text"
                      value={razorpayKeyId}
                      onChange={(e) => setRazorpayKeyId(e.target.value)}
                      placeholder="rzp_test_..."
                      className="w-full bg-[#1A1F1C] border border-[#3A453E] rounded-xl px-4 py-2.5 text-xs sm:text-sm text-white font-mono focus:outline-none focus:border-cafe-accent"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
                      Razorpay Key Secret
                    </label>
                    <input
                      type="password"
                      value={razorpayKeySecret}
                      onChange={(e) => setRazorpayKeySecret(e.target.value)}
                      placeholder="Enter new secret key to update"
                      className="w-full bg-[#1A1F1C] border border-[#3A453E] rounded-xl px-4 py-2.5 text-xs sm:text-sm text-white font-mono focus:outline-none focus:border-cafe-accent"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    onClick={handleSaveRazorpay}
                    className="flex items-center gap-2 px-5 py-2.5 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-xs sm:text-sm font-semibold shadow-md transition-colors"
                  >
                    <Save size={15} />
                    <span>Save Razorpay Keys</span>
                  </button>
                </div>
              </div>

              {/* Change Admin Password */}
              <form onSubmit={handleChangePassword} className="bg-[#212723] p-6 rounded-2xl border border-[#343D37] space-y-4">
                <h2 className="text-lg font-serif font-bold text-white">Change Admin Password</h2>
                <div>
                  <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
                    New Admin Password
                  </label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Minimum 6 characters"
                    className="w-full bg-[#1A1F1C] border border-[#3A453E] rounded-xl px-4 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-cafe-accent"
                  />
                </div>
                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    className="flex items-center gap-2 px-5 py-2.5 bg-cafe-accent hover:bg-[#B89366] text-white rounded-xl text-xs sm:text-sm font-semibold shadow-md transition-colors"
                  >
                    <Save size={15} />
                    <span>Update Password</span>
                  </button>
                </div>
              </form>
            </div>
          )}
        </main>
      </div>

      {/* ==================================================== */}
      {/* MODAL: ADD / EDIT MENU ITEM */}
      {/* ==================================================== */}
      {isAddMenuOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#212723] border border-[#343D37] rounded-3xl max-w-md w-full p-6 shadow-2xl relative">
            <div className="flex items-center justify-between pb-4 border-b border-[#343D37]">
              <h3 className="text-lg font-serif font-bold text-white">
                {editingMenuItem ? 'Edit Menu Item' : 'Add New Menu Item'}
              </h3>
              <button
                onClick={() => setIsAddMenuOpen(false)}
                className="p-1 rounded-lg text-gray-400 hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveMenuItem} className="space-y-4 pt-4">
              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1">Item Name</label>
                <input
                  type="text"
                  required
                  value={menuForm.name}
                  onChange={(e) => setMenuForm(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g. Vanilla Bean Latte"
                  className="w-full bg-[#1A1F1C] border border-[#3A453E] rounded-xl px-3.5 py-2 text-xs sm:text-sm text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1">Category</label>
                  <select
                    value={menuForm.category}
                    onChange={(e) => setMenuForm(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full bg-[#1A1F1C] border border-[#3A453E] rounded-xl px-3 py-2 text-xs text-white"
                  >
                    <option value="Coffee">Coffee</option>
                    <option value="Breakfast">Breakfast</option>
                    <option value="Desserts">Desserts</option>
                    <option value="Tea">Tea</option>
                    <option value="Mains">Mains</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1">Price ($ USD)</label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    value={menuForm.price}
                    onChange={(e) => setMenuForm(prev => ({ ...prev, price: e.target.value }))}
                    placeholder="3.50"
                    className="w-full bg-[#1A1F1C] border border-[#3A453E] rounded-xl px-3 py-2 text-xs text-white font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1">Description</label>
                <textarea
                  rows={2}
                  value={menuForm.description}
                  onChange={(e) => setMenuForm(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Rich espresso steamed with silky milk..."
                  className="w-full bg-[#1A1F1C] border border-[#3A453E] rounded-xl px-3.5 py-2 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1">Upload Item Photo</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setMenuForm(prev => ({ ...prev, imageFile: e.target.files[0] }))}
                  className="w-full bg-[#1A1F1C] border border-[#3A453E] rounded-xl p-1.5 text-xs text-gray-400 file:mr-2 file:py-1 file:px-2.5 file:rounded-lg file:border-0 file:text-[11px] file:bg-cafe-accent file:text-white"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="featuredToggle"
                  checked={menuForm.isFeatured}
                  onChange={(e) => setMenuForm(prev => ({ ...prev, isFeatured: e.target.checked }))}
                  className="w-4 h-4 text-cafe-accent rounded bg-gray-700 border-gray-600"
                />
                <label htmlFor="featuredToggle" className="text-xs text-gray-300">
                  Highlight as Featured Item on Home Page
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-[#343D37]">
                <button
                  type="button"
                  onClick={() => setIsAddMenuOpen(false)}
                  className="px-4 py-2 bg-[#2D3530] text-gray-300 rounded-xl text-xs hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-cafe-accent text-white rounded-xl text-xs font-semibold hover:bg-[#B89366]"
                >
                  Save Item
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* MODAL: ADD DEAL */}
      {/* ==================================================== */}
      {isAddDealOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#212723] border border-[#343D37] rounded-3xl max-w-md w-full p-6 shadow-2xl relative">
            <div className="flex items-center justify-between pb-4 border-b border-[#343D37]">
              <h3 className="text-lg font-serif font-bold text-white">Create Combo / Festival Deal</h3>
              <button
                onClick={() => setIsAddDealOpen(false)}
                className="p-1 rounded-lg text-gray-400 hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveDeal} className="space-y-4 pt-4">
              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1">Deal Title</label>
                <input
                  type="text"
                  required
                  value={dealForm.title}
                  onChange={(e) => setDealForm(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="e.g. Morning Duo: Croissant & Latte"
                  className="w-full bg-[#1A1F1C] border border-[#3A453E] rounded-xl px-3.5 py-2 text-xs sm:text-sm text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1">Description / Combo Items</label>
                <textarea
                  rows={2}
                  value={dealForm.description}
                  onChange={(e) => setDealForm(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Fresh butter croissant with your choice of cappuccino or latte."
                  className="w-full bg-[#1A1F1C] border border-[#3A453E] rounded-xl px-3.5 py-2 text-xs text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1">Original Price ($)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={dealForm.originalPrice}
                    onChange={(e) => setDealForm(prev => ({ ...prev, originalPrice: e.target.value }))}
                    placeholder="6.50"
                    className="w-full bg-[#1A1F1C] border border-[#3A453E] rounded-xl px-3 py-2 text-xs text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1">Discount Price ($)</label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    value={dealForm.discountPrice}
                    onChange={(e) => setDealForm(prev => ({ ...prev, discountPrice: e.target.value }))}
                    placeholder="4.99"
                    className="w-full bg-[#1A1F1C] border border-[#3A453E] rounded-xl px-3 py-2 text-xs text-white font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1">Badge Label</label>
                <input
                  type="text"
                  value={dealForm.badge}
                  onChange={(e) => setDealForm(prev => ({ ...prev, badge: e.target.value }))}
                  placeholder="Special Offer / Holiday Deal"
                  className="w-full bg-[#1A1F1C] border border-[#3A453E] rounded-xl px-3.5 py-2 text-xs text-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-[#343D37]">
                <button
                  type="button"
                  onClick={() => setIsAddDealOpen(false)}
                  className="px-4 py-2 bg-[#2D3530] text-gray-300 rounded-xl text-xs hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-cafe-accent text-white rounded-xl text-xs font-semibold hover:bg-[#B89366]"
                >
                  Save Deal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;

