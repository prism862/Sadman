import React, { useState, Suspense, lazy, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import Lenis from 'lenis';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
import { AppProvider, useApp } from './AppContext';
import { pageTransition } from './constants/animations';
import Intro from './components/Intro';
import Navbar from './components/Navbar';
import TopBanner from './components/TopBanner';
import { RefreshCw, CheckCircle2, AlertCircle } from 'lucide-react';

// Configure NProgress
NProgress.configure({ 
  showSpinner: false,
  trickleSpeed: 200,
  minimum: 0.1
});

// Lazy load pages
const Home = lazy(() => import('./pages/Home'));
const Shop = lazy(() => import('./pages/Shop'));
const ProductPage = lazy(() => import('./pages/ProductPage'));
const WishlistPage = lazy(() => import('./pages/WishlistPage'));
const CartPage = lazy(() => import('./pages/CartPage'));
const Checkout = lazy(() => import('./pages/Checkout'));
const Invoice = lazy(() => import('./pages/Invoice'));
const OrderSuccess = lazy(() => import('./pages/OrderSuccess'));
const Admin = lazy(() => import('./pages/Admin'));
const RefundPolicy = lazy(() => import('./pages/RefundPolicy'));

// Enhanced loading fallback
const PageLoader = () => {
  useEffect(() => {
    NProgress.start();
    return () => {
      NProgress.done();
    };
  }, []);

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center bg-transparent">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative"
      >
        <div className="w-16 h-16 border border-white/10 rounded-full" />
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 border-t-2 border-prism-mid rounded-full"
        />
      </motion.div>
      <motion.p 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mt-6 text-[10px] font-bold uppercase tracking-[0.3em] text-white/30"
      >
        Loading Experience
      </motion.p>
    </div>
  );
};

function AppContent() {
  const [showIntro, setShowIntro] = useState(true);
  const location = useLocation();
  const { syncStatus } = useApp();

  // Initialize Lenis
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
      infinite: false,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  // Handle NProgress on route changes
  useEffect(() => {
    NProgress.start();
    const timer = setTimeout(() => {
      NProgress.done();
    }, 100);
    return () => {
      clearTimeout(timer);
      NProgress.done();
    };
  }, [location.pathname]);

  return (
    <>
      <AnimatePresence mode="wait">
        {showIntro && <Intro onComplete={() => setShowIntro(false)} />}
      </AnimatePresence>
      
      {!showIntro && (
        <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-prism-mid">
          <div className="scanline" />
          <TopBanner />
          <Navbar />
          <main className="pt-8">
            <Suspense fallback={<PageLoader />}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={location.pathname}
                  variants={pageTransition}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  className="min-h-[80vh]"
                >
                  <Routes location={location}>
                    <Route path="/" element={<Home />} />
                    <Route path="/shop" element={<Shop />} />
                    <Route path="/product/:id" element={<ProductPage />} />
                    <Route path="/wishlist" element={<WishlistPage />} />
                    <Route path="/cart" element={<CartPage />} />
                    <Route path="/checkout" element={<Checkout />} />
                    <Route path="/order-success/:orderId" element={<OrderSuccess />} />
                    <Route path="/invoice/:orderId" element={<Invoice />} />
                    <Route path="/admin" element={<Admin />} />
                    <Route path="/refund-policy" element={<RefundPolicy />} />
                  </Routes>
                </motion.div>
              </AnimatePresence>
            </Suspense>
          </main>

          <footer className="pt-20 pb-10 border-t border-white/5 bg-black/50 backdrop-blur-xl">
            <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
              <div className="text-center md:text-left">
                <h2 className="font-display font-bold text-2xl tracking-[0.2em] mb-2">PRISM</h2>
                <p className="text-white/30 text-[10px] uppercase tracking-[0.3em]">Refracting Style Since 2025</p>
              </div>
              <div className="flex flex-wrap justify-center md:justify-start gap-8 text-[10px] font-bold uppercase tracking-[0.2em] text-white/40">
                <a href="https://instagram.com/prism_thebest" target="_blank" rel="noopener noreferrer" className="hover:prism-text transition-colors flex items-center gap-2">
                  Instagram <span className="text-white/20">@prism_thebest</span>
                </a>
                <a href="/refund-policy" className="hover:text-white transition-colors">Refund Policy</a>
                <a href="#" className="hover:text-white transition-colors">Twitter</a>
                <a href="#" className="hover:text-white transition-colors">Discord</a>
              </div>
              <div className="flex flex-col items-center md:items-end gap-2">
                <div className="text-[10px] text-white/20 uppercase tracking-widest">
                  © 2025 Prism Clothing
                </div>
                <div className="flex items-center gap-2">
                  {syncStatus === 'syncing' && (
                    <span className="flex items-center gap-1 text-[8px] font-bold uppercase tracking-widest text-prism-mid">
                      <RefreshCw size={8} className="animate-spin" /> Syncing
                    </span>
                  )}
                  {syncStatus === 'synced' && (
                    <span className="flex items-center gap-1 text-[8px] font-bold uppercase tracking-widest text-green-500/50">
                      <CheckCircle2 size={8} /> Online
                    </span>
                  )}
                  {syncStatus === 'error' && (
                    <span className="flex items-center gap-1 text-[8px] font-bold uppercase tracking-widest text-red-500">
                      <AlertCircle size={8} /> Sync Error
                    </span>
                  )}
                </div>
              </div>
            </div>
          </footer>
        </div>
      )}
    </>
  );
}

export default function App() {
  return (
    <AppProvider>
      <Router>
        <AppContent />
      </Router>
    </AppProvider>
  );
}
