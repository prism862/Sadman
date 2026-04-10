import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Product, CartItem, Order, SiteSettings } from './types';
import { initialProducts } from './data/initialProducts';

interface AppContextType {
  products: Product[];
  cart: CartItem[];
  wishlist: Product[];
  recentlyViewed: string[];
  orders: Order[];
  settings: SiteSettings;
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
  updateSettings: (settings: SiteSettings) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [settings, setSettings] = useState<SiteSettings>({
    bannerImages: {
      spectrum: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=1200',
      essential: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&q=80&w=800',
      accessories: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=800'
    },
    deliveryFees: {
      inside: 80,
      outside: 120
    },
    adminPassword: 'sadman2025'
  });
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('prism_cart');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });
  const [wishlist, setWishlist] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem('prism_wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });
  const [recentlyViewed, setRecentlyViewed] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('prism_recently_viewed');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });
  const [orders, setOrders] = useState<Order[]>([]);

  // Fetch initial data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [prodRes, orderRes, settingsRes] = await Promise.all([
          fetch('/api/products'),
          fetch('/api/orders'),
          fetch('/api/settings')
        ]);
        
        if (!prodRes.ok || !orderRes.ok || !settingsRes.ok) {
          throw new Error(`HTTP error! status: ${prodRes.status}, ${orderRes.status}, ${settingsRes.status}`);
        }

        const prods = await prodRes.json();
        const ords = await orderRes.json();
        const settingsData = await settingsRes.json();
        
        if (prods && Array.isArray(prods) && prods.length > 0) {
          setProducts(prods);
        } else {
          console.log("No products found on server, seeding with initialProducts");
          setProducts(initialProducts);
          // Seed the server if it's empty
          fetch('/api/products', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(initialProducts)
          }).catch(err => console.error("Failed to seed products:", err));
        }
        
        if (ords && Array.isArray(ords)) {
          setOrders(ords);
        }
        
        if (settingsData && typeof settingsData === 'object' && Object.keys(settingsData).length > 0) {
          setSettings(prev => ({
            ...prev,
            ...settingsData,
            bannerImages: {
              ...prev.bannerImages,
              ...(settingsData.bannerImages || {})
            },
            deliveryFees: {
              ...prev.deliveryFees,
              ...(settingsData.deliveryFees || {})
            }
          }));
        }
      } catch (e) {
        console.error("Failed to fetch data:", e);
        // Don't overwrite products if we already have some (though on mount we don't)
        setProducts(prev => prev.length > 0 ? prev : initialProducts);
      }
    };
    fetchData();
  }, []);

  // LocalStorage sync for client-side only state
  useEffect(() => {
    localStorage.setItem('prism_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('prism_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    localStorage.setItem('prism_recently_viewed', JSON.stringify(recentlyViewed));
  }, [recentlyViewed]);

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

  const saveProductsToServer = async (newProducts: Product[]) => {
    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProducts)
      });
      if (!res.ok) throw new Error("Failed to save to server");
    } catch (e) {
      console.error("Failed to save products:", e);
    }
  };

  const addOrder = useCallback(async (order: Order) => {
    setOrders(prev => {
      const newOrders = [order, ...prev];
      fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newOrders)
      }).catch(e => console.error("Failed to save order:", e));
      return newOrders;
    });
    clearCart();
  }, [clearCart]);

  const addProduct = useCallback(async (product: Product) => {
    setProducts(prev => {
      const newProducts = [...prev, product];
      saveProductsToServer(newProducts);
      return newProducts;
    });
  }, []);

  const updateProduct = useCallback(async (product: Product) => {
    setProducts(prev => {
      const newProducts = prev.map(p => p.id === product.id ? product : p);
      saveProductsToServer(newProducts);
      return newProducts;
    });
  }, []);

  const deleteProduct = useCallback(async (id: string) => {
    setProducts(prev => {
      const newProducts = prev.filter(p => p.id !== id);
      saveProductsToServer(newProducts);
      return newProducts;
    });
  }, []);

  const updateOrderStatus = useCallback(async (orderId: string, status: Order['status']) => {
    setOrders(prev => {
      const newOrders = prev.map(o => o.id === orderId ? { ...o, status } : o);
      fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newOrders)
      }).catch(e => console.error("Failed to update order status:", e));
      return newOrders;
    });
  }, []);

  const updateSettings = useCallback(async (newSettings: SiteSettings) => {
    setSettings(newSettings);
    try {
      await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSettings)
      });
    } catch (e) {
      console.error("Failed to update settings:", e);
    }
  }, []);

  return (
    <AppContext.Provider value={{
      products, cart, wishlist, recentlyViewed, orders, settings,
      addToCart, removeFromCart, clearCart,
      toggleWishlist, isInWishlist, addToRecentlyViewed,
      addOrder, addProduct, updateProduct, deleteProduct,
      updateOrderStatus, updateSettings
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
