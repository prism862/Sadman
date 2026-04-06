import React, { useState, Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import { AppProvider } from './AppContext';
import Intro from './components/Intro';
import Navbar from './components/Navbar';

// Lazy load pages for better performance
const Home = lazy(() => import('./pages/Home'));
const Shop = lazy(() => import('./pages/Shop'));
const ProductPage = lazy(() => import('./pages/ProductPage'));
const CartPage = lazy(() => import('./pages/CartPage'));
const Checkout = lazy(() => import('./pages/Checkout'));
const Invoice = lazy(() => import('./pages/Invoice'));
const Admin = lazy(() => import('./pages/Admin'));

// Simple loading fallback
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-[#050505]">
    <motion.div 
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      className="w-12 h-12 border-2 border-prism-mid border-t-transparent rounded-full animate-spin"
    />
  </div>
);

function AppContent() {
  const [showIntro, setShowIntro] = useState(true);
  const location = useLocation();

  return (
    <>
      <AnimatePresence mode="wait">
        {showIntro && <Intro onComplete={() => setShowIntro(false)} />}
      </AnimatePresence>
      
      {!showIntro && (
        <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-prism-mid">
          <Navbar />
          <main>
            <Suspense fallback={<PageLoader />}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={location.pathname}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <Routes location={location}>
                    <Route path="/" element={<Home />} />
                    <Route path="/shop" element={<Shop />} />
                    <Route path="/product/:id" element={<ProductPage />} />
                    <Route path="/cart" element={<CartPage />} />
                    <Route path="/checkout" element={<Checkout />} />
                    <Route path="/invoice/:orderId" element={<Invoice />} />
                    <Route path="/admin" element={<Admin />} />
                  </Routes>
                </motion.div>
              </AnimatePresence>
            </Suspense>
          </main>

          <footer className="py-20 border-t border-white/5 bg-black/50 backdrop-blur-xl">
            <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
              <div className="text-center md:text-left">
                <h2 className="font-display font-bold text-2xl tracking-[0.2em] mb-2">PRISM</h2>
                <p className="text-white/30 text-[10px] uppercase tracking-[0.3em]">Refracting Style Since 2025</p>
              </div>
              <div className="flex gap-12 text-[10px] font-bold uppercase tracking-[0.2em] text-white/40">
                <a href="https://instagram.com/prism_thebest" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Instagram</a>
                <a href="#" className="hover:text-white transition-colors">Twitter</a>
                <a href="#" className="hover:text-white transition-colors">Discord</a>
              </div>
              <div className="text-[10px] text-white/20 uppercase tracking-widest">
                © 2025 Prism Clothing
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
