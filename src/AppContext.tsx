import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
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
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState<Product[]>([]);
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
        const settings = await settingsRes.json();
        
        if (prods && Array.isArray(prods) && prods.length > 0) {
          setProducts(prods);
        } else {
          setProducts(initialProducts);
        }
        
        if (ords && Array.isArray(ords)) {
          setOrders(ords);
        }
        
        if (settings && typeof settings === 'object' && Object.keys(settings).length > 0) {
          setBannerImages(settings);
        }
      } catch (e) {
        console.error("Failed to fetch data:", e);
        setProducts(initialProducts);
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

  const addOrder = useCallback(async (order: Order) => {
    const newOrders = [order, ...orders];
    setOrders(newOrders);
    try {
      await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newOrders)
      });
      clearCart();
    } catch (e) {
      console.error("Failed to save order:", e);
    }
  }, [orders, clearCart]);

  const addProduct = useCallback(async (product: Product) => {
    const newProducts = [...products, product];
    setProducts(newProducts);
    try {
      await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProducts)
      });
    } catch (e) {
      console.error("Failed to save product:", e);
    }
  }, [products]);

  const updateProduct = useCallback(async (product: Product) => {
    const newProducts = products.map(p => p.id === product.id ? product : p);
    setProducts(newProducts);
    try {
      await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProducts)
      });
    } catch (e) {
      console.error("Failed to update product:", e);
    }
  }, [products]);

  const deleteProduct = useCallback(async (id: string) => {
    const newProducts = products.filter(p => p.id !== id);
    setProducts(newProducts);
    try {
      await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProducts)
      });
    } catch (e) {
      console.error("Failed to delete product:", e);
    }
  }, [products]);

  const updateOrderStatus = useCallback(async (orderId: string, status: Order['status']) => {
    const newOrders = orders.map(o => o.id === orderId ? { ...o, status } : o);
    setOrders(newOrders);
    try {
      await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newOrders)
      });
    } catch (e) {
      console.error("Failed to update order status:", e);
    }
  }, [orders]);

  const updateBannerImages = useCallback(async (images: { spectrum: string; essential: string; accessories: string }) => {
    setBannerImages(images);
    try {
      await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(images)
      });
    } catch (e) {
      console.error("Failed to update banner images:", e);
    }
  }, []);

  return (
    <AppContext.Provider value={{
      products, cart, wishlist, recentlyViewed, orders, bannerImages,
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
