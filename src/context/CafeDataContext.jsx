import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { menuDatabase } from '../data/menuData';

const CafeDataContext = createContext();

const normalizeMenuItems = (items) => {
  if (!Array.isArray(items)) return [];
  return items.map(item => {
    let img = item.image || item.imageUrl || '';
    if (typeof img === 'string' && img.startsWith('/src/assets/images/')) {
      img = img.replace('/src/assets/images/', '/images/');
    }
    return {
      ...item,
      name: item.name || item.title || 'Cafe Item',
      title: item.title || item.name || 'Cafe Item',
      category: item.category || 'Coffee',
      description: item.description || '',
      price: item.price !== undefined ? parseFloat(item.price) : 0,
      image: img || '/images/menu_cappuccino_1784782504483.webp'
    };
  });
};

const DEFAULT_SETTINGS = {
  cafeName: 'Brew & Bloom Cafe',
  whatsappNumber: '9458082654',
  whatsappCountryCode: '91',
  currency: 'USD',
  seasonalTheme: {
    enabled: true,
    theme: 'christmas',
    title: "Merry Christmas & Season's Greetings!",
    discountPercentage: '10%',
    discountCode: 'MERRY10',
    discountText: 'Holiday Special: Get 10% off on all specialty coffees & dessert combos with code MERRY10',
    santaSpeech: '🎅 Ho Ho Ho! 10% Off Today!',
    santaSize: 'large', // 'normal', 'large', 'xl'
    showFloatingSanta: true,
    showSnowflakes: true,
    bannerColor: '#991b1b'
  },
  hero: {
    videoUrl: '/src/assets/videos/home_hero.webm',
    posterUrl: '/hero_poster.webp',
    tagline: 'Good Coffee, Good Mood',
    titleLine1: 'Savor Moments,',
    titleLine2: 'Sip Happiness'
  },
  razorpayKeyId: 'rzp_test_placeholder'
};

const getInitialSettings = () => {
  try {
    const saved = localStorage.getItem('cafe_settings_local');
    if (saved) {
      const parsed = JSON.parse(saved);
      return {
        ...DEFAULT_SETTINGS,
        ...parsed,
        seasonalTheme: {
          ...DEFAULT_SETTINGS.seasonalTheme,
          ...(parsed.seasonalTheme || {})
        }
      };
    }
  } catch (e) {
    console.warn('Error reading cafe_settings_local', e);
  }
  return DEFAULT_SETTINGS;
};

const getInitialMenu = () => {
  try {
    const saved = localStorage.getItem('cafe_menu_local');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return normalizeMenuItems(parsed);
      }
    }
  } catch (e) {
    console.warn('Error reading cafe_menu_local', e);
  }
  return normalizeMenuItems(menuDatabase);
};

const getInitialDeals = () => {
  try {
    const saved = localStorage.getItem('cafe_deals_local');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (e) {
    console.warn('Error reading cafe_deals_local', e);
  }
  return [];
};

export const CafeDataProvider = ({ children }) => {
  const [menuItems, setMenuItems] = useState(getInitialMenu);
  const [galleryPhotos, setGalleryPhotos] = useState([]);
  const [deals, setDeals] = useState(getInitialDeals);
  const [settings, setSettings] = useState(getInitialSettings);
  const [isLoading, setIsLoading] = useState(false);

  // API Base URL - empty string if served by same express host, or localhost:5000 in dev
  const API_URL = import.meta.env.VITE_API_URL || '';

  // Synchronous + persistent settings updater
  const updateSettings = useCallback(async (newSettingsOrUpdater) => {
    setSettings(prev => {
      const updated = typeof newSettingsOrUpdater === 'function'
        ? newSettingsOrUpdater(prev)
        : {
            ...prev,
            ...newSettingsOrUpdater,
            seasonalTheme: newSettingsOrUpdater.seasonalTheme
              ? { ...prev.seasonalTheme, ...newSettingsOrUpdater.seasonalTheme }
              : prev.seasonalTheme
          };

      try {
        localStorage.setItem('cafe_settings_local', JSON.stringify(updated));
      } catch (err) {
        console.warn('Failed to save settings to localStorage:', err);
      }

      // Broadcast to other components or open windows
      window.dispatchEvent(new CustomEvent('cafe_settings_changed', { detail: updated }));
      return updated;
    });

    // Also persist to server in background if available
    try {
      const token = localStorage.getItem('cafe_admin_token') || sessionStorage.getItem('cafe_admin_token');
      const seasonalData = newSettingsOrUpdater.seasonalTheme || (typeof newSettingsOrUpdater === 'object' ? newSettingsOrUpdater : null);
      if (seasonalData) {
        await fetch(`${API_URL}/api/settings/seasonal`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { 'Authorization': `Bearer ${token}` } : {})
          },
          body: JSON.stringify(seasonalData)
        }).catch(() => null);
      }
    } catch (_) {}
  }, [API_URL]);

  // Synchronous + persistent menu items updater
  const updateMenuItems = useCallback((newItemsOrUpdater) => {
    setMenuItems(prev => {
      const updated = typeof newItemsOrUpdater === 'function'
        ? newItemsOrUpdater(prev)
        : newItemsOrUpdater;
      const normalized = normalizeMenuItems(updated);
      try {
        localStorage.setItem('cafe_menu_local', JSON.stringify(normalized));
      } catch (err) {
        console.warn('Failed to save menu to localStorage:', err);
      }
      return normalized;
    });
  }, []);

  // Synchronous + persistent deals updater
  const updateDeals = useCallback((newDealsOrUpdater) => {
    setDeals(prev => {
      const updated = typeof newDealsOrUpdater === 'function'
        ? newDealsOrUpdater(prev)
        : newDealsOrUpdater;
      try {
        localStorage.setItem('cafe_deals_local', JSON.stringify(updated));
      } catch (err) {
        console.warn('Failed to save deals to localStorage:', err);
      }
      return updated;
    });
  }, []);

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      const safeParseJson = async (res) => {
        if (!res || !res.ok) return null;
        try {
          const text = await res.text();
          return JSON.parse(text);
        } catch (_) {
          return null;
        }
      };

      // Fetch public settings
      const settingsRes = await fetch(`${API_URL}/api/settings`).catch(() => null);
      const settingsJson = await safeParseJson(settingsRes);
      if (settingsJson && settingsJson.success && settingsJson.data) {
        setSettings(prev => {
          const merged = {
            ...prev,
            ...settingsJson.data,
            seasonalTheme: {
              ...prev.seasonalTheme,
              ...(settingsJson.data.seasonalTheme || {})
            }
          };
          try {
            localStorage.setItem('cafe_settings_local', JSON.stringify(merged));
          } catch (_) {}
          return merged;
        });
      }

      // Fetch dynamic menu
      const menuRes = await fetch(`${API_URL}/api/menu`).catch(() => null);
      const menuJson = await safeParseJson(menuRes);
      if (menuJson && menuJson.success && Array.isArray(menuJson.data) && menuJson.data.length > 0) {
        const normalized = normalizeMenuItems(menuJson.data);
        setMenuItems(normalized);
        try {
          localStorage.setItem('cafe_menu_local', JSON.stringify(normalized));
        } catch (_) {}
      }

      // Fetch gallery
      const galleryRes = await fetch(`${API_URL}/api/gallery`).catch(() => null);
      const galleryJson = await safeParseJson(galleryRes);
      if (galleryJson && galleryJson.success && Array.isArray(galleryJson.data)) {
        const normalizedGallery = galleryJson.data.map(g => ({
          ...g,
          imageUrl: typeof g.imageUrl === 'string' && g.imageUrl.startsWith('/src/assets/images/')
            ? g.imageUrl.replace('/src/assets/images/', '/images/')
            : (g.imageUrl || '/images/gallery_interior_1784916424533.webp')
        }));
        setGalleryPhotos(normalizedGallery);
      }

      // Fetch deals
      const dealsRes = await fetch(`${API_URL}/api/deals`).catch(() => null);
      const dealsJson = await safeParseJson(dealsRes);
      if (dealsJson && dealsJson.success && Array.isArray(dealsJson.data)) {
        setDeals(dealsJson.data);
        try {
          localStorage.setItem('cafe_deals_local', JSON.stringify(dealsJson.data));
        } catch (_) {}
      }
    } catch (err) {
      console.warn('Backend currently offline or waking up. Using client fallback data.', err);
    } finally {
      setIsLoading(false);
    }
  }, [API_URL]);

  useEffect(() => {
    fetchData();

    // Cross-component & cross-tab synchronization listener
    const handleSettingsChanged = (e) => {
      if (e.detail) setSettings(e.detail);
    };
    const handleStorage = (e) => {
      if (e.key === 'cafe_settings_local' && e.newValue) {
        try { setSettings(JSON.parse(e.newValue)); } catch (_) {}
      }
      if (e.key === 'cafe_menu_local' && e.newValue) {
        try { setMenuItems(normalizeMenuItems(JSON.parse(e.newValue))); } catch (_) {}
      }
    };

    window.addEventListener('cafe_settings_changed', handleSettingsChanged);
    window.addEventListener('storage', handleStorage);

    return () => {
      window.removeEventListener('cafe_settings_changed', handleSettingsChanged);
      window.removeEventListener('storage', handleStorage);
    };
  }, [fetchData]);

  return (
    <CafeDataContext.Provider value={{
      menuItems,
      galleryPhotos,
      deals,
      settings,
      isLoading,
      updateSettings,
      updateMenuItems,
      updateDeals,
      refreshData: fetchData,
      API_URL
    }}>
      {children}
    </CafeDataContext.Provider>
  );
};

export const useCafeData = () => {
  const context = useContext(CafeDataContext);
  if (!context) {
    throw new Error('useCafeData must be used within a CafeDataProvider');
  }
  return context;
};
