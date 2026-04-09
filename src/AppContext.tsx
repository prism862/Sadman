import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Product, CartItem, Order } from './types';
import { initialProducts } from './data/initialProducts';

interface AppContextType {
  products: Product[];
  cart: CartItem[];
  wishlist: Product[];
  recentlyViewed: string[];
  orders: Order[];
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
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem('prism_products');
      return saved ? JSON.parse(saved) : initialProducts;
    } catch (e) {
      console.error("Failed to load products from localStorage:", e);
      return initialProducts;
    }
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

  return (
    <AppContext.Provider value={{
      products, cart, wishlist, recentlyViewed, orders,
      addToCart, removeFromCart, clearCart,
      toggleWishlist, isInWishlist, addToRecentlyViewed,
      addOrder, addProduct, updateProduct, deleteProduct,
      updateOrderStatus
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
