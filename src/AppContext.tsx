import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { Product, CartItem, Order } from './types';
import { initialProducts } from './data/initialProducts';

interface AppContextType {
  products: Product[];
  cart: CartItem[];
  wishlist: Product[];
  recentlyViewed: string[];
  orders: Order[];
  bannerImages: {
    spectrum: string;
    essential: string;
    accessories: string;
  };
  addToCart: (product: Product, size: string) => void;
  removeFromCart: (id: string, size: string) => void;
  clearCart: () => void;
  toggleWishlist: (product: Product) => void;
  isInWishlist: (id: string) => boolean;
  addToRecentlyViewed: (productId: string) => void;
  addOrder: (order: Order) => void;
  addProduct: (product: Product) => void;
  updateProduct: (product: Product) => void;
  deleteProduct: (id: string) => void;
  updateOrderStatus: (orderId: string, status: Order['status']) => void;
  updateBannerImages: (images: { spectrum: string; essential: string; accessories: string }) => void;
  syncStatus: 'idle' | 'syncing' | 'synced' | 'error';
  lastError: string | null;
  refreshData: () => Promise<void>;
  saveProductsToServer: (productsToSave?: Product[]) => Promise<void>;
  saveSettingsToServer: (settingsToSave?: any) => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [isInitialized, setIsInitialized] = useState(false);
  const [hasLoadedFromServer, setHasLoadedFromServer] = useState(false);
  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'synced' | 'error'>('idle');
  const [lastError, setLastError] = useState<string | null>(null);
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [bannerImages, setBannerImages] = useState({
    spectrum: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=1200',
    essential: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&q=80&w=800',
    accessories: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=800'
  });

  const lastSyncedProducts = useRef<string>('');
  const lastSyncedSettings = useRef<string>('');
  const isFetching = useRef(false);
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('prism_cart');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error("Failed to load cart from localStorage:", e);
      return [];
    }
  });
  const [wishlist, setWishlist] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem('prism_wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error("Failed to load wishlist from localStorage:", e);
      return [];
    }
  });
  const [recentlyViewed, setRecentlyViewed] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('prism_recently_viewed');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error("Failed to load recentlyViewed from localStorage:", e);
      return [];
    }
  });
  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem('prism_orders');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error("Failed to load orders from localStorage:", e);
      return [];
    }
  });

  // Fetch initial data from server
  const refreshData = useCallback(async (retries = 3) => {
    if (isFetching.current) return;
    isFetching.current = true;

    try {
      setSyncStatus('syncing');
      const response = await fetch('/api/data');
      if (!response.ok) throw new Error(`Server responded with ${response.status}`);
      
      const data = await response.json();
      
      // Update local state and track that this data is already synced
      if (data.products && Array.isArray(data.products)) {
        setProducts(data.products);
        lastSyncedProducts.current = JSON.stringify(data.products);
      }
      if (data.bannerImages && typeof data.bannerImages === 'object') {
        setBannerImages(data.bannerImages);
        lastSyncedSettings.current = JSON.stringify(data.bannerImages);
      }
      
      setHasLoadedFromServer(true);
      setIsInitialized(true);
      setSyncStatus('synced');
      setLastError(null);
      setTimeout(() => setSyncStatus('idle'), 2000);
    } catch (error) {
      console.error("Failed to fetch data from server:", error);
      const msg = error instanceof Error ? error.message : String(error);
      setLastError(msg);
      if (retries > 0) {
        console.log(`Retrying fetch... (${retries} retries left)`);
        setTimeout(() => {
          isFetching.current = false;
          refreshData(retries - 1);
        }, 1000);
      } else {
        setIsInitialized(true);
        setSyncStatus('error');
      }
    } finally {
      isFetching.current = false;
    }
  }, []);

  useEffect(() => {
    // Small delay to ensure server is ready
    const timer = setTimeout(() => {
      refreshData();
    }, 500);
    return () => clearTimeout(timer);
  }, [refreshData]);

  // Sync products with server
  const saveProductsToServer = useCallback(async (productsToSave?: Product[]) => {
    // CRITICAL: Never save if we haven't successfully loaded from server yet
    // to prevent overwriting server data with initialProducts defaults
    if (!isInitialized || !hasLoadedFromServer || isFetching.current) return;
    
    const data = productsToSave || products;
    const dataString = JSON.stringify(data);
    
    // Don't sync if data hasn't changed since last sync
    if (dataString === lastSyncedProducts.current) return;

    try {
      setSyncStatus('syncing');
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ products: data })
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Server responded with ${response.status}`);
      }
      
      lastSyncedProducts.current = dataString;
      setSyncStatus('synced');
      setLastError(null);
      setTimeout(() => setSyncStatus('idle'), 2000);
    } catch (error) {
      console.error("Failed to sync products:", error);
      setLastError(error instanceof Error ? error.message : String(error));
      setSyncStatus('error');
      throw error;
    }
  }, [products, isInitialized, hasLoadedFromServer]);

  // Sync settings with server
  const saveSettingsToServer = useCallback(async (settingsToSave?: any) => {
    if (!isInitialized || !hasLoadedFromServer || isFetching.current) return;

    const data = settingsToSave || bannerImages;
    const dataString = JSON.stringify(data);

    // Don't sync if data hasn't changed since last sync
    if (dataString === lastSyncedSettings.current) return;

    try {
      setSyncStatus('syncing');
      const response = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bannerImages: data })
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Server responded with ${response.status}`);
      }
      
      lastSyncedSettings.current = dataString;
      setSyncStatus('synced');
      setLastError(null);
      setTimeout(() => setSyncStatus('idle'), 2000);
    } catch (error) {
      console.error("Failed to sync settings:", error);
      setLastError(error instanceof Error ? error.message : String(error));
      setSyncStatus('error');
      throw error;
    }
  }, [bannerImages, isInitialized, hasLoadedFromServer]);

  // Auto-sync products with server (debounced)
  useEffect(() => {
    if (!isInitialized) return;
    
    const timer = setTimeout(() => {
      saveProductsToServer();
    }, 1000);

    return () => clearTimeout(timer);
  }, [products, isInitialized, saveProductsToServer]);

  // Auto-sync settings with server (debounced)
  useEffect(() => {
    if (!isInitialized) return;

    const timer = setTimeout(() => {
      saveSettingsToServer();
    }, 1000);

    return () => clearTimeout(timer);
  }, [bannerImages, isInitialized, saveSettingsToServer]);

  useEffect(() => {
    localStorage.setItem('prism_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('prism_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    localStorage.setItem('prism_recently_viewed', JSON.stringify(recentlyViewed));
  }, [recentlyViewed]);

  useEffect(() => {
    localStorage.setItem('prism_orders', JSON.stringify(orders));
  }, [orders]);

  const addToCart = useCallback((product: Product, size: string) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id && item.selectedSize === size);
      if (existing) {
        return prev.map(item => 
          item.id === product.id && item.selectedSize === size 
            ? { ...item, quantity: item.quantity + 1 } 
            : item
        );
      }
      return [...prev, { ...product, selectedSize: size, quantity: 1 }];
    });
  }, []);

  const removeFromCart = useCallback((id: string, size: string) => {
    setCart(prev => prev.filter(item => !(item.id === id && item.selectedSize === size)));
  }, []);

  const clearCart = useCallback(() => setCart([]), []);

  const toggleWishlist = useCallback((product: Product) => {
    setWishlist(prev => {
      const exists = prev.find(p => p.id === product.id);
      if (exists) {
        return prev.filter(p => p.id !== product.id);
      }
      return [...prev, product];
    });
  }, []);

  const isInWishlist = useCallback((id: string) => wishlist.some(p => p.id === id), [wishlist]);

  const addToRecentlyViewed = useCallback((productId: string) => {
    setRecentlyViewed(prev => {
      const filtered = prev.filter(id => id !== productId);
      return [productId, ...filtered].slice(0, 10);
    });
  }, []);

  const addOrder = useCallback((order: Order) => {
    setOrders(prev => [order, ...prev]);
    clearCart();
  }, [clearCart]);

  const addProduct = useCallback((product: Product) => setProducts(prev => [...prev, product]), []);
  const updateProduct = useCallback((product: Product) => setProducts(prev => prev.map(p => p.id === product.id ? product : p)), []);
  const deleteProduct = useCallback((id: string) => setProducts(prev => prev.filter(p => p.id !== id)), []);
  const updateOrderStatus = useCallback((orderId: string, status: Order['status']) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));
  }, []);

  const updateBannerImages = useCallback((images: { spectrum: string; essential: string; accessories: string }) => {
    setBannerImages(images);
  }, []);

  return (
    <AppContext.Provider value={{
      products, cart, wishlist, recentlyViewed, orders, bannerImages,
      addToCart, removeFromCart, clearCart,
      toggleWishlist, isInWishlist, addToRecentlyViewed,
      addOrder, addProduct, updateProduct, deleteProduct,
      updateOrderStatus, updateBannerImages, syncStatus, lastError, refreshData,
      saveProductsToServer, saveSettingsToServer
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
