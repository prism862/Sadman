import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Product, CartItem, Order, SiteSettings } from './types';
import { db, auth } from './firebase';
import { 
  collection, 
  onSnapshot, 
  doc, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  orderBy,
  getDocs,
  getDoc
} from 'firebase/firestore';
import { onAuthStateChanged, User } from 'firebase/auth';
import { initialProducts } from './data/initialProducts';

interface AppContextType {
  products: Product[];
  cart: CartItem[];
  wishlist: Product[];
  recentlyViewed: string[];
  orders: Order[];
  settings: SiteSettings;
  user: User | null;
  isAuthReady: boolean;
  addToCart: (product: Product, size: string) => void;
  removeFromCart: (id: string, size: string) => void;
  clearCart: () => void;
  toggleWishlist: (product: Product) => void;
  isInWishlist: (id: string) => boolean;
  addToRecentlyViewed: (productId: string) => void;
  addOrder: (order: Order) => Promise<void>;
  addProduct: (product: Product) => Promise<void>;
  updateProduct: (product: Product) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  updateOrderStatus: (orderId: string, status: Order['status']) => Promise<void>;
  updateSettings: (settings: SiteSettings) => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const DEFAULT_SETTINGS: SiteSettings = {
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
};

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [settings, setSettings] = useState<SiteSettings>(DEFAULT_SETTINGS);
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
  const [user, setUser] = useState<User | null>(null);
  const [isAuthReady, setIsAuthReady] = useState(false);

  // Auth Listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setIsAuthReady(true);
    });
    return () => unsubscribe();
  }, []);

  // Seeding Logic
  useEffect(() => {
    const seedIfEmpty = async () => {
      try {
        // Check products
        const productsSnap = await getDocs(collection(db, 'products'));
        if (productsSnap.empty) {
          console.log("Seeding products...");
          for (const p of initialProducts) {
            await setDoc(doc(db, 'products', p.id), p);
          }
        }

        // Check settings
        const settingsSnap = await getDoc(doc(db, 'settings', 'global'));
        if (!settingsSnap.exists()) {
          console.log("Seeding settings...");
          await setDoc(doc(db, 'settings', 'global'), DEFAULT_SETTINGS);
        }
      } catch (e) {
        console.error("Seeding error:", e);
      }
    };
    seedIfEmpty();
  }, []);

  // Firestore Listeners
  useEffect(() => {
    // Products Listener
    const productsQuery = query(collection(db, 'products'), orderBy('title'));
    const unsubscribeProducts = onSnapshot(productsQuery, (snapshot) => {
      const prods = snapshot.docs.map(doc => doc.data() as Product);
      setProducts(prods);
    }, (error) => {
      console.error("Firestore Products Error:", error);
    });

    // Settings Listener
    const unsubscribeSettings = onSnapshot(doc(db, 'settings', 'global'), (snapshot) => {
      if (snapshot.exists()) {
        setSettings(snapshot.data() as SiteSettings);
      }
    }, (error) => {
      console.error("Firestore Settings Error:", error);
    });

    // Orders Listener
    const ordersQuery = query(collection(db, 'orders'), orderBy('date', 'desc'));
    const unsubscribeOrders = onSnapshot(ordersQuery, (snapshot) => {
      const ords = snapshot.docs.map(doc => doc.data() as Order);
      setOrders(ords);
    }, (error) => {
      console.error("Firestore Orders Error:", error);
    });

    return () => {
      unsubscribeProducts();
      unsubscribeSettings();
      unsubscribeOrders();
    };
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

  const addOrder = useCallback(async (order: Order) => {
    try {
      await setDoc(doc(db, 'orders', order.id), order);
      clearCart();
    } catch (e) {
      console.error("Failed to save order:", e);
      throw e;
    }
  }, [clearCart]);

  const addProduct = useCallback(async (product: Product) => {
    try {
      await setDoc(doc(db, 'products', product.id), product);
    } catch (e) {
      console.error("Failed to add product:", e);
      throw e;
    }
  }, []);

  const updateProduct = useCallback(async (product: Product) => {
    try {
      await updateDoc(doc(db, 'products', product.id), { ...product });
    } catch (e) {
      console.error("Failed to update product:", e);
      throw e;
    }
  }, []);

  const deleteProduct = useCallback(async (id: string) => {
    try {
      await deleteDoc(doc(db, 'products', id));
    } catch (e) {
      console.error("Failed to delete product:", e);
      throw e;
    }
  }, []);

  const updateOrderStatus = useCallback(async (orderId: string, status: Order['status']) => {
    try {
      await updateDoc(doc(db, 'orders', orderId), { status });
    } catch (e) {
      console.error("Failed to update order status:", e);
      throw e;
    }
  }, []);

  const updateSettings = useCallback(async (newSettings: SiteSettings) => {
    try {
      await setDoc(doc(db, 'settings', 'global'), newSettings);
    } catch (e) {
      console.error("Failed to update settings:", e);
      throw e;
    }
  }, []);

  return (
    <AppContext.Provider value={{
      products, cart, wishlist, recentlyViewed, orders, settings, user, isAuthReady,
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
