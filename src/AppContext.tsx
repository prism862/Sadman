import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Product, CartItem, Order } from './types';
import { initialProducts } from './data/initialProducts';
import { db, auth } from './firebase';
import { 
  collection, 
  onSnapshot, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  orderBy,
  setDoc,
  getDocFromServer
} from 'firebase/firestore';

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId: string | undefined;
    email: string | null | undefined;
    emailVerified: boolean | undefined;
    isAnonymous: boolean | undefined;
    tenantId: string | null | undefined;
    providerInfo: {
      providerId: string;
      displayName: string | null;
      email: string | null;
      photoUrl: string | null;
    }[];
  }
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData.map(provider => ({
        providerId: provider.providerId,
        displayName: provider.displayName,
        email: provider.email,
        photoUrl: provider.photoURL
      })) || []
    },
    operationType,
    path
  }
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

interface AppContextType {
  products: Product[];
  loading: boolean;
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
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAuthReady, setIsAuthReady] = useState(false);

  // Test connection
  useEffect(() => {
    async function testConnection() {
      try {
        await getDocFromServer(doc(db, 'test', 'connection'));
      } catch (error) {
        if (error instanceof Error && error.message.includes('the client is offline')) {
          console.error("Please check your Firebase configuration. ");
        }
      }
    }
    testConnection();
  }, []);

  // Auth listener
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(() => {
      setIsAuthReady(true);
    });
    return () => unsubscribe();
  }, []);

  // Real-time products listener
  useEffect(() => {
    const path = 'products';
    const q = query(collection(db, path));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const prods: Product[] = [];
      snapshot.forEach((doc) => {
        prods.push({ id: doc.id, ...doc.data() } as Product);
      });
      setProducts(prods);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, path);
    });

    return () => unsubscribe();
  }, []);

  // Real-time settings listener
  useEffect(() => {
    const path = 'settings/banners';
    const unsubscribe = onSnapshot(doc(db, 'settings', 'banners'), (snapshot) => {
      if (snapshot.exists()) {
        setBannerImages(snapshot.data() as any);
      }
      setLoading(false);
    }, (error) => {
      // If document doesn't exist yet, it's fine, we use defaults
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const [bannerImages, setBannerImages] = useState({
    spectrum: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=1200',
    essential: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&q=80&w=800',
    accessories: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=800'
  });
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

  useEffect(() => {
    try {
      localStorage.setItem('prism_products', JSON.stringify(products));
    } catch (e) {
      if (e instanceof Error && e.name === 'QuotaExceededError') {
        console.error("Storage quota exceeded! Cannot save products.");
      }
    }
  }, [products]);

  useEffect(() => {
    try {
      localStorage.setItem('prism_cart', JSON.stringify(cart));
    } catch (e) {
      console.error("Failed to save cart:", e);
    }
  }, [cart]);

  useEffect(() => {
    try {
      localStorage.setItem('prism_wishlist', JSON.stringify(wishlist));
    } catch (e) {
      console.error("Failed to save wishlist:", e);
    }
  }, [wishlist]);

  useEffect(() => {
    try {
      localStorage.setItem('prism_recently_viewed', JSON.stringify(recentlyViewed));
    } catch (e) {
      console.error("Failed to save recentlyViewed:", e);
    }
  }, [recentlyViewed]);

  useEffect(() => {
    try {
      localStorage.setItem('prism_orders', JSON.stringify(orders));
    } catch (e) {
      console.error("Failed to save orders:", e);
    }
  }, [orders]);

  useEffect(() => {
    try {
      localStorage.setItem('prism_banner_images', JSON.stringify(bannerImages));
    } catch (e) {
      console.error("Failed to save banner images:", e);
    }
  }, [bannerImages]);

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

  const addProduct = useCallback(async (product: Product) => {
    const path = `products/${product.id}`;
    try {
      const { id, ...data } = product;
      // Use setDoc with the provided ID to ensure consistency between client and server
      await setDoc(doc(db, 'products', id), data);
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, path);
    }
  }, []);

  const updateProduct = useCallback(async (product: Product) => {
    const path = `products/${product.id}`;
    try {
      const { id, ...data } = product;
      await setDoc(doc(db, 'products', id), data, { merge: true });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, path);
    }
  }, []);

  const deleteProduct = useCallback(async (id: string) => {
    const path = `products/${id}`;
    try {
      await deleteDoc(doc(db, 'products', id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, path);
    }
  }, []);
  const updateOrderStatus = useCallback((orderId: string, status: Order['status']) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));
  }, []);

  const updateBannerImages = useCallback(async (images: { spectrum: string; essential: string; accessories: string }) => {
    const path = 'settings/banners';
    try {
      await setDoc(doc(db, 'settings', 'banners'), images);
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, path);
    }
  }, []);

  return (
    <AppContext.Provider value={{
      products, loading, cart, wishlist, recentlyViewed, orders, bannerImages,
      addToCart, removeFromCart, clearCart,
      toggleWishlist, isInWishlist, addToRecentlyViewed,
      addOrder, addProduct, updateProduct, deleteProduct,
      updateOrderStatus, updateBannerImages
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
