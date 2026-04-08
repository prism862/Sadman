import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Filter, ShoppingBag, Info, Heart } from 'lucide-react';
import { useApp } from '../AppContext';
import { formatPrice, cn } from '../lib/utils';
import { Link } from 'react-router-dom';
import { fadeInUp, staggerContainer, staggerItem, hoverScale } from '../constants/animations';
import SmoothImage from '../components/SmoothImage';
import RecentlyViewed from '../components/RecentlyViewed';

export default function Shop() {
  const { products, toggleWishlist, isInWishlist } = useApp();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');

  const categories = ['All', ...new Set(products.map(p => p.category))];

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = category === 'All' || p.category === category;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen pt-32 pb-20 px-6">
      <div className="max-w-7xl mx-auto">
        <header key="shop-header" className="mb-20 flex flex-col md:flex-row md:items-end justify-between gap-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1 }}
          >
            <h1 className="text-6xl md:text-8xl font-display font-black mb-4 tracking-tighter">COLLECTIONS</h1>
            <p className="text-white/30 font-mono text-xs uppercase tracking-[0.5em]">Refracting Style Since 2025</p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="flex flex-col sm:flex-row gap-6 w-full md:w-auto"
          >
            <div className="relative group">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-prism-mid transition-colors" size={18} />
              <input 
                type="text" 
                placeholder="Search pieces..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full sm:w-72 pl-14 pr-6 py-4 bg-white/[0.03] border border-white/10 rounded-full focus:outline-none focus:border-prism-mid/50 focus:bg-white/[0.07] transition-all font-sans text-sm tracking-wide"
              />
            </div>
            
            <div className="flex gap-3 overflow-x-auto pb-4 sm:pb-0 scrollbar-hide">
              {categories.map((cat, i) => (
                <motion.button
                  key={cat}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 + i * 0.1 }}
                  onClick={() => setCategory(cat)}
                  className={`px-8 py-4 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] transition-all whitespace-nowrap ${
                    category === cat 
                    ? 'bg-white text-black' 
                    : 'bg-white/[0.03] border border-white/10 text-white/40 hover:bg-white/[0.07] hover:text-white'
                  }`}
                >
                  {cat}
                </motion.button>
              ))}
            </div>
          </motion.div>
        </header>

        <motion.div 
          key="product-grid"
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-12"
        >
          <AnimatePresence mode="popLayout">
            {filteredProducts.map((product, index) => (
              <motion.div
                layout
                key={product.id}
                variants={staggerItem}
                initial="initial"
                animate="animate"
                exit={{ opacity: 0, scale: 0.9 }}
                className="group"
              >
                <div className="relative">
                  <button 
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      toggleWishlist(product);
                    }}
                    className={cn(
                      "absolute top-4 right-4 z-20 w-10 h-10 rounded-full glass border-white/10 flex items-center justify-center transition-all",
                      isInWishlist(product.id) ? "text-red-500 border-red-500/30 bg-red-500/10" : "text-white/50 hover:text-white"
                    )}
                  >
                    <Heart size={18} fill={isInWishlist(product.id) ? "currentColor" : "none"} />
                  </button>

                  <Link to={`/product/${product.id}`}>
                    <motion.div 
                      {...hoverScale}
                      className="relative aspect-[2/3] rounded-3xl overflow-hidden mb-4 bg-white/5"
                    >
                    <SmoothImage 
                      src={product.images[0]} 
                      alt={product.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      containerClassName="w-full h-full"
                      loading="lazy"
                    />
                    
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-white text-black flex items-center justify-center transform translate-y-4 group-hover:translate-y-0 transition-transform">
                        <ShoppingBag size={20} />
                      </div>
                    </div>

                    {/* Badges */}
                    <div className="absolute top-4 left-4 flex flex-col gap-2">
                      {product.isOutOfStock && (
                        <span className="px-3 py-1 bg-red-500 text-white text-[10px] font-bold uppercase tracking-tighter rounded-full shadow-lg">
                          Stock Out
                        </span>
                      )}
                      {product.isSpectrum && (
                        <span className="px-3 py-1 bg-gradient-to-r from-prism-start to-prism-mid text-[10px] font-bold uppercase tracking-tighter rounded-full">
                          Spectrum
                        </span>
                      )}
                      {product.offer && (
                        <span className="px-3 py-1 bg-white text-black text-[10px] font-bold uppercase tracking-tighter rounded-full">
                          -{product.offer}% OFF
                        </span>
                      )}
                    </div>
                  </motion.div>

                  <div className={`flex justify-between items-start ${product.isOutOfStock ? 'opacity-40' : ''}`}>
                    <div>
                      <h3 className="font-display font-bold text-lg mb-1 group-hover:prism-text transition-colors">{product.title}</h3>
                      <p className="text-white/40 text-xs font-mono uppercase tracking-widest">{product.category}</p>
                    </div>
                    <div className="text-right">
                      {product.offer ? (
                        <>
                          <p className="text-prism-mid font-bold">{formatPrice(product.price * (1 - product.offer / 100))}</p>
                          <p className="text-white/30 text-xs line-through">{formatPrice(product.price)}</p>
                        </>
                      ) : (
                        <p className="text-white font-bold">{formatPrice(product.price)}</p>
                      )}
                    </div>
                  </div>
                </Link>
              </div>
            </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {filteredProducts.length === 0 && (
          <div key="no-results" className="py-32 text-center">
            <p className="text-white/30 font-display text-2xl">No pieces found in this spectrum.</p>
          </div>
        )}

        <RecentlyViewed />
      </div>
    </div>
  );
};
