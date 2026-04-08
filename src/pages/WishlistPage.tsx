import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, ShoppingBag, ArrowRight, Trash2 } from 'lucide-react';
import { useApp } from '../AppContext';
import { formatPrice } from '../lib/utils';
import { Link } from 'react-router-dom';
import { fadeInUp, staggerContainer, staggerItem, hoverScale } from '../constants/animations';

export default function WishlistPage() {
  const { wishlist, toggleWishlist } = useApp();

  return (
    <div className="min-h-screen pt-32 pb-20 px-6">
      <div className="max-w-7xl mx-auto">
        <header className="mb-20">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1 }}
          >
            <h1 className="text-6xl md:text-8xl font-display font-black mb-4 tracking-tighter uppercase">Wishlist</h1>
            <p className="text-white/30 font-mono text-xs uppercase tracking-[0.5em]">Your curated collection</p>
          </motion.div>
        </header>

        {wishlist.length > 0 ? (
          <motion.div 
            variants={staggerContainer}
            initial="initial"
            animate="animate"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-12"
          >
            <AnimatePresence mode="popLayout">
              {wishlist.map((product) => (
                <motion.div
                  layout
                  key={product.id}
                  variants={staggerItem}
                  initial="initial"
                  animate="animate"
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="group relative"
                >
                  <button 
                    onClick={() => toggleWishlist(product)}
                    className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full glass border-white/10 flex items-center justify-center text-white/50 hover:text-red-500 hover:border-red-500/50 transition-all"
                    title="Remove from wishlist"
                  >
                    <Trash2 size={18} />
                  </button>

                  <Link to={`/product/${product.id}`}>
                    <motion.div 
                      {...hoverScale}
                      className="relative aspect-[2/3] rounded-3xl overflow-hidden mb-4 bg-white/5"
                    >
                      <img 
                        src={product.images[0]} 
                        alt={product.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        referrerPolicy="no-referrer"
                        loading="lazy"
                        decoding="async"
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
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="py-32 text-center"
          >
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-white/5 mb-8 text-white/20">
              <Heart size={48} strokeWidth={1} />
            </div>
            <h2 className="text-3xl font-display font-bold mb-4 tracking-tight">Your wishlist is empty</h2>
            <p className="text-white/40 mb-12 max-w-md mx-auto font-light">
              Save items you love to keep track of them and get notified when they're back in stock or on sale.
            </p>
            <Link 
              to="/shop"
              className="inline-flex items-center gap-4 px-12 py-5 bg-white text-black font-display font-bold uppercase tracking-[0.2em] text-xs rounded-full hover:scale-105 active:scale-95 transition-all"
            >
              Explore Shop <ArrowRight size={16} />
            </Link>
          </motion.div>
        )}
      </div>
    </div>
  );
}
