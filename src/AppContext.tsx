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
  const [products, setProducts] = useState<Product[]>(initialProducts);
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

  // Fetch initial data from server
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/data');
        const data = await response.json();
        if (data.products) setProducts(data.products);
        if (data.bannerImages) setBannerImages(data.bannerImages);
      } catch (error) {
        console.error("Failed to fetch data from server:", error);
      }
    };
    fetchData();
  }, []);

  // Sync products with server
  useEffect(() => {
    const syncProducts = async () => {
      try {
        await fetch('/api/products', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ products })
        });
      } catch (error) {
        console.error("Failed to sync products:", error);
      }
    };
    syncProducts();
  }, [products]);

  // Sync settings with server
  useEffect(() => {
    const syncSettings = async () => {
      try {
        await fetch('/api/settings', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ bannerImages })
        });
      } catch (error) {
        console.error("Failed to sync settings:", error);
      }
    };
    syncSettings();
  }, [bannerImages]);

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
