import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShoppingBag, Menu, X, User, Search, Heart } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useApp } from '../AppContext';
import { cn } from '../lib/utils';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { cart, wishlist } = useApp();
  const location = useLocation();

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Shop', path: '/shop' },
    { name: 'Admin', path: '/admin' },
  ];

  return (
    <nav className="fixed top-8 left-0 w-full z-50 transition-all duration-300 will-change-transform">
      <div className="absolute inset-0 bg-black/20 backdrop-blur-md border-b border-white/5" />
      
      <div className="relative max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <Link to="/" className="group flex items-center">
          <span className="font-display font-bold text-2xl tracking-[0.2em] text-white group-hover:prism-text transition-colors">
            PRISM
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={cn(
                "relative text-sm font-medium tracking-widest uppercase transition-all hover:text-prism-mid group/nav",
                location.pathname === link.path ? "text-prism-mid" : "text-white/70"
              )}
            >
              {link.name}
              {location.pathname === link.path && (
                <motion.div 
                  layoutId="nav-active"
                  className="absolute -bottom-2 left-0 w-full h-0.5 bg-prism-mid"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-6">
          <Link to="/shop" className="text-white/70 hover:text-white transition-colors">
            <Search size={20} />
          </Link>
          <Link to="/wishlist" className="relative text-white/70 hover:text-white transition-colors">
            <Heart size={20} />
            {wishlist.length > 0 && (
              <motion.span 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-2 -right-2 w-4 h-4 bg-prism-mid text-[10px] font-bold rounded-full flex items-center justify-center text-white"
              >
                {wishlist.length}
              </motion.span>
            )}
          </Link>
          <Link to="/cart" className="relative text-white/70 hover:text-white transition-colors">
            <ShoppingBag size={20} />
            {cartCount > 0 && (
              <motion.span 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-2 -right-2 w-4 h-4 bg-prism-mid text-[10px] font-bold rounded-full flex items-center justify-center text-white"
              >
                {cartCount}
              </motion.span>
            )}
          </Link>
          <button 
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-white/70 hover:text-white transition-colors"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-black/95 backdrop-blur-xl border-b border-white/5 overflow-hidden"
          >
            <div className="px-6 py-8 flex flex-col gap-6">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    "text-xl font-display font-bold tracking-widest uppercase",
                    location.pathname === link.path ? "prism-text" : "text-white"
                  )}
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};
