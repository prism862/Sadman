import React, { useState, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, ShoppingBag, Ruler, Truck, RotateCcw, Info, Instagram, ArrowRight, ChevronLeft, ChevronRight, Heart, Share2, Facebook, Twitter } from 'lucide-react';
import { useApp } from '../AppContext';
import { formatPrice, cn } from '../lib/utils';
import { fadeInUp, staggerContainer, staggerItem, hoverScale } from '../constants/animations';
import SmoothImage from '../components/SmoothImage';
import RecentlyViewed from '../components/RecentlyViewed';

export default function ProductPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { products, addToCart, toggleWishlist, isInWishlist, addToRecentlyViewed } = useApp();
  const product = products.find(p => p.id === id);
  const [selectedSize, setSelectedSize] = useState('');
  const [showSizeGuide, setShowSizeGuide] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollTo = direction === 'left' ? scrollLeft - clientWidth : scrollLeft + clientWidth;
      scrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  const handleScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const index = Math.round(scrollLeft / clientWidth);
      setActiveIndex(index);
    }
  };

  // Filter related products (prefer same category, excluding current product)
  const relatedProducts = React.useMemo(() => {
    if (!product) return [];
    const categoryRelated = products.filter(p => p.category === product.category && p.id !== product.id);
    const otherProducts = products.filter(p => p.category !== product.category && p.id !== product.id);
    return [...categoryRelated, ...otherProducts].slice(0, 4);
  }, [products, product]);

  React.useEffect(() => {
    window.scrollTo(0, 0);
    if (id) {
      addToRecentlyViewed(id);
    }
  }, [id, addToRecentlyViewed]);

  if (!product) return <div className="py-40 text-center">Product not found.</div>;

  const handleAddToCart = () => {
    if (!selectedSize) return;
    setIsAdding(true);
    addToCart(product, selectedSize);
    setTimeout(() => {
      setIsAdding(false);
      navigate('/cart');
    }, 800);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="max-w-7xl mx-auto px-6 pt-20 pb-12"
    >
      <Link to="/shop" className="inline-flex items-center gap-2 text-white/50 hover:text-white mb-12 transition-colors text-sm uppercase tracking-widest font-bold">
        <ArrowLeft className="w-4 h-4" /> Back to Shop
      </Link>

      <motion.div 
        variants={staggerContainer}
        initial="initial"
        animate="animate"
        className="grid grid-cols-1 lg:grid-cols-[1.4fr_0.6fr] gap-16"
      >
        {/* Image Gallery */}
        <motion.div variants={fadeInUp} className="relative group">
          <div 
            ref={scrollRef}
            onScroll={handleScroll}
            className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide scroll-smooth"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {product.isSpectrum && product.spectrumImage && (
              <motion.div 
                key="spectrum-image"
                initial={{ opacity: 0, scale: 1.1 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative aspect-[2/3] min-w-full snap-center snap-always overflow-hidden rounded-[3rem] glass border-prism-mid/30"
              >
                <SmoothImage 
                  src={product.spectrumImage} 
                  alt="Spectrum Effect" 
                  className="w-full h-full object-cover mix-blend-screen opacity-80"
                  containerClassName="w-full h-full"
                  loading="eager"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-prism-start/20 to-transparent" />
                <div className="absolute top-6 left-6">
                  <span className="px-3 py-1 glass border-white/20 text-[10px] font-bold uppercase tracking-[0.3em] prism-text">Spectrum Reactive</span>
                </div>
              </motion.div>
            )}
            {product.images.map((img, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="glass border-white/5 overflow-hidden aspect-[2/3] min-w-full snap-center snap-always rounded-[3rem]"
              >
                <SmoothImage 
                  src={img} 
                  alt={product.title} 
                  className="w-full h-full object-cover"
                  containerClassName="w-full h-full"
                  loading={i === 0 ? "eager" : "lazy"}
                />
              </motion.div>
            ))}
          </div>

          {/* Navigation Arrows */}
          <button 
            onClick={() => scroll('left')}
            className={cn(
              "absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full glass border-white/10 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all hover:bg-white/10 z-10",
              activeIndex === 0 && "pointer-events-none opacity-0"
            )}
          >
            <ChevronLeft size={24} />
          </button>
          <button 
            onClick={() => scroll('right')}
            className={cn(
              "absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full glass border-white/10 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all hover:bg-white/10 z-10",
              activeIndex === (product.isSpectrum && product.spectrumImage ? product.images.length : product.images.length - 1) && "pointer-events-none opacity-0"
            )}
          >
            <ChevronRight size={24} />
          </button>

          {/* Indicator Dots */}
          <div className="flex justify-center gap-2 mt-4">
            {(product.isSpectrum && product.spectrumImage ? [product.spectrumImage, ...product.images] : product.images).map((_, i) => (
              <div 
                key={i}
                className={cn(
                  "w-1.5 h-1.5 rounded-full transition-all duration-300",
                  activeIndex === i ? "bg-prism-mid w-4" : "bg-white/20"
                )}
              />
            ))}
          </div>
        </motion.div>

        {/* Product Info */}
        <motion.div variants={fadeInUp} className="lg:sticky lg:top-32 h-fit">
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-xs font-bold uppercase tracking-widest text-white/40">{product.category}</span>
              {product.isSpectrum && (
                <span className="px-2 py-1 glass border-white/20 text-[10px] font-bold uppercase tracking-widest prism-text">Spectrum Series</span>
              )}
              {product.isLimitedTime && (
                <span className="px-2 py-1 bg-orange-500 text-white text-[10px] font-bold uppercase tracking-widest rounded-full shadow-lg">Limited Time</span>
              )}
            </div>
            <h1 className="text-4xl md:text-6xl font-display font-bold tracking-tighter mb-4">{product.title}</h1>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-4">
                {product.offer ? (
                  <>
                    <span className="text-3xl font-display font-bold text-prism-start">{formatPrice(product.price * (1 - product.offer / 100))}</span>
                    <span className="text-xl text-white/30 line-through">{formatPrice(product.price)}</span>
                    <span className="px-2 py-1 bg-prism-start/20 text-prism-start text-[10px] font-bold uppercase tracking-widest">Save {product.offer}%</span>
                  </>
                ) : (
                  <span className="text-3xl font-display font-bold">{formatPrice(product.price)}</span>
                )}
              </div>
              {product.isOutOfStock ? (
                <span className="px-4 py-1.5 bg-red-500 text-white text-xs font-bold uppercase tracking-widest rounded-full shadow-lg">Stock Out</span>
              ) : (
                product.stockCount !== undefined && (
                  <span className={cn(
                    "px-3 py-1 glass border-white/10 text-[10px] font-bold uppercase tracking-widest rounded-full",
                    product.stockCount === 0 ? "text-red-500 border-red-500/30" :
                    product.stockCount < 3 ? "text-red-400 border-red-400/30 animate-pulse" :
                    product.stockCount < 10 ? "text-orange-400 border-orange-400/30" : 
                    "text-white/40"
                  )}>
                    {product.stockCount === 0 ? "Out of Stock" :
                     product.stockCount < 3 ? "Low Stock: Only " + product.stockCount + " Left" :
                     product.stockCount + " Pieces Left"}
                  </span>
                )
              )}
            </div>
          </div>

          <p className="text-white/60 leading-relaxed mb-12 text-lg">
            {product.description}
          </p>

          {/* Size Selection */}
          <div className="mb-12">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold uppercase tracking-widest">Select Size</span>
              <button 
                onClick={() => setShowSizeGuide(true)}
                className="text-[10px] font-bold uppercase tracking-widest text-prism-mid hover:text-white transition-colors flex items-center gap-1"
              >
                <Ruler className="w-3 h-3" /> Sizing Guide
              </button>
            </div>
            <div className="flex flex-wrap gap-3">
              {product.sizes.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={cn(
                    "w-16 h-16 flex items-center justify-center glass border-white/10 text-sm font-bold transition-all",
                    selectedSize === size ? "bg-white text-black border-white" : "hover:border-white/40"
                  )}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-4">
            <button
              onClick={handleAddToCart}
              disabled={!selectedSize || isAdding || product.isOutOfStock}
              className={cn(
                "flex-1 py-6 font-display font-bold uppercase tracking-widest text-sm transition-all relative overflow-hidden",
                (!selectedSize || product.isOutOfStock) ? "bg-white/5 text-white/20 cursor-not-allowed" : "bg-white text-black hover:bg-prism-mid hover:text-white"
              )}
            >
              <AnimatePresence mode="wait">
                {product.isOutOfStock ? (
                  <motion.span
                    key="outofstock"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -20, opacity: 0 }}
                    className="flex items-center justify-center gap-2"
                  >
                    Out of Stock
                  </motion.span>
                ) : isAdding ? (
                  <motion.span
                    key="adding"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -20, opacity: 0 }}
                    className="flex items-center justify-center gap-2"
                  >
                    Adding to Bag...
                  </motion.span>
                ) : (
                  <motion.span
                    key="add"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -20, opacity: 0 }}
                    className="flex items-center justify-center gap-2"
                  >
                    <ShoppingBag className="w-4 h-4" /> Add to Bag
                  </motion.span>
                )}
              </AnimatePresence>
            </button>

            <button
              onClick={() => toggleWishlist(product)}
              className={cn(
                "w-20 flex items-center justify-center glass border-white/10 transition-all",
                isInWishlist(product.id) ? "text-red-500 border-red-500/30 bg-red-500/10" : "text-white/50 hover:text-white hover:border-white/40"
              )}
              title={isInWishlist(product.id) ? "Remove from Wishlist" : "Add to Wishlist"}
            >
              <Heart size={24} fill={isInWishlist(product.id) ? "currentColor" : "none"} />
            </button>
          </div>

          <div className="mt-4 relative">
            <button
              onClick={() => setShowShare(!showShare)}
              className="w-full py-4 flex items-center justify-center gap-3 glass border-white/10 text-white/50 hover:text-white transition-all text-xs font-bold uppercase tracking-widest"
            >
              <Share2 size={16} /> Share this piece
            </button>

            <AnimatePresence>
              {showShare && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute top-full left-0 w-full mt-2 glass border-white/10 p-2 z-30 overflow-hidden"
                >
                  <div className="grid grid-cols-3 gap-2">
                    <a
                      href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex flex-col items-center gap-2 p-3 hover:bg-white/5 rounded-xl transition-colors group"
                    >
                      <Facebook size={20} className="text-white/40 group-hover:text-[#1877F2] transition-colors" />
                      <span className="text-[10px] font-bold uppercase tracking-tighter text-white/30 group-hover:text-white">Facebook</span>
                    </a>
                    <a
                      href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(`Check out ${product.title} on PRISM`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex flex-col items-center gap-2 p-3 hover:bg-white/5 rounded-xl transition-colors group"
                    >
                      <Twitter size={20} className="text-white/40 group-hover:text-[#1DA1F2] transition-colors" />
                      <span className="text-[10px] font-bold uppercase tracking-tighter text-white/30 group-hover:text-white">Twitter</span>
                    </a>
                    <a
                      href={`https://pinterest.com/pin/create/button/?url=${encodeURIComponent(window.location.href)}&media=${encodeURIComponent(product.images[0])}&description=${encodeURIComponent(product.title)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex flex-col items-center gap-2 p-3 hover:bg-white/5 rounded-xl transition-colors group"
                    >
                      <svg viewBox="0 0 24 24" size="20" className="w-5 h-5 fill-white/40 group-hover:fill-[#E60023] transition-colors">
                        <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.966 1.406-5.966s-.359-.72-.359-1.781c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738.098.119.112.224.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.259 7.929-7.259 4.164 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146 1.124.347 2.317.535 3.554.535 6.607 0 11.985-5.365 11.985-11.987C23.97 5.39 18.592.026 11.985.026L12.017 0z"/>
                      </svg>
                      <span className="text-[10px] font-bold uppercase tracking-tighter text-white/30 group-hover:text-white">Pinterest</span>
                    </a>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Info Blocks */}
          <div className="mt-12 space-y-6">
            <div className="flex items-start gap-4 p-4 glass border-white/5">
              <Truck className="w-5 h-5 text-prism-mid shrink-0" />
              <div>
                <h4 className="text-xs font-bold uppercase tracking-widest mb-1">Fast Delivery</h4>
                <p className="text-xs text-white/40">Estimated delivery: 2-3 business days. Worldwide shipping available.</p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-4 glass border-white/5">
              <RotateCcw className="w-5 h-5 text-prism-mid shrink-0" />
              <div>
                <h4 className="text-xs font-bold uppercase tracking-widest mb-1">Easy Returns</h4>
                <p className="text-xs text-white/40">30-day return policy. Hassle-free exchanges for all Spectrum members.</p>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Related Products Section */}
      {relatedProducts.length > 0 && (
        <section className="mt-40">
          <motion.div 
            variants={fadeInUp}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="flex items-end justify-between mb-12"
          >
            <div>
              <h2 className="text-3xl font-display font-black uppercase tracking-tighter">You May Also <span className="prism-text">Like</span></h2>
              <p className="text-white/30 text-[10px] uppercase tracking-[0.4em] mt-2">More from the {product.category} collection</p>
            </div>
            <Link to="/shop" className="text-[10px] font-bold uppercase tracking-widest text-white/50 hover:text-white transition-colors">
              View All Shop
            </Link>
          </motion.div>

          <motion.div 
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {relatedProducts.map((item) => (
              <motion.div
                key={item.id}
                variants={staggerItem}
                className="group"
              >
                <Link to={`/product/${item.id}`} className="block">
                  <motion.div 
                    {...hoverScale}
                    className="relative aspect-[2/3] overflow-hidden glass border-white/5 mb-4"
                  >
                    <SmoothImage 
                      src={item.images[0]} 
                      alt={item.title} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      containerClassName="w-full h-full"
                      loading="lazy"
                    />
                    <div className="absolute top-4 left-4 flex flex-col gap-2">
                      {item.isLimitedTime && (
                        <div className="px-3 py-1 bg-orange-500 text-white text-[10px] font-bold uppercase tracking-widest rounded-full shadow-lg">
                          Limited
                        </div>
                      )}
                      {item.offer && (
                        <div className="px-3 py-1 bg-prism-start text-white text-[10px] font-bold uppercase tracking-widest rounded-full shadow-lg">
                          -{item.offer}%
                        </div>
                      )}
                    </div>
                  </motion.div>
                  <h3 className="text-sm font-bold uppercase tracking-tight group-hover:prism-text transition-colors">{item.title}</h3>
                  <div className="flex items-center gap-3 mt-1">
                    {item.offer ? (
                      <>
                        <span className="text-sm font-bold text-prism-start">{formatPrice(item.price * (1 - item.offer / 100))}</span>
                        <span className="text-xs text-white/20 line-through">{formatPrice(item.price)}</span>
                      </>
                    ) : (
                      <span className="text-sm font-bold text-white/60">{formatPrice(item.price)}</span>
                    )}
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </section>
      )}

      {/* Instagram CTA Section */}
      <section className="mt-40 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative p-12 md:p-20 glass border-prism-mid/20 rounded-[3rem] overflow-hidden text-center group"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-prism-mid/10 blur-[100px] -mr-32 -mt-32 group-hover:bg-prism-mid/20 transition-colors duration-1000" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-prism-start/10 blur-[100px] -ml-32 -mb-32 group-hover:bg-prism-start/20 transition-colors duration-1000" />
          
          <div className="relative z-10">
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/5 mb-6 text-prism-mid"
            >
              <Instagram size={32} />
            </motion.div>
            <h2 className="text-3xl md:text-5xl font-display font-black mb-4 tracking-tighter uppercase">Join the <span className="prism-text">Spectrum</span></h2>
            <p className="text-white/40 text-sm md:text-base mb-8 max-w-xl mx-auto font-light leading-relaxed">
              Follow us for exclusive drops and styling inspiration from the PRISM community.
            </p>
            <a 
              href="https://instagram.com/prism_thebest" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 px-8 py-4 bg-white text-black font-display font-bold uppercase tracking-[0.2em] text-xs rounded-full hover:scale-105 active:scale-95 transition-all shadow-[0_0_30px_rgba(255,255,255,0.1)]"
            >
              @prism_thebest <ArrowRight size={14} />
            </a>
          </div>
        </motion.div>
      </section>

      <RecentlyViewed />

      {/* Sizing Guide Modal */}
      <AnimatePresence>
        {showSizeGuide && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm"
            onClick={() => setShowSizeGuide(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="glass border-white/10 p-8 max-w-2xl w-full"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-display font-bold uppercase tracking-tight">General Sizing Guide</h2>
                <button onClick={() => setShowSizeGuide(false)} className="text-white/50 hover:text-white">Close</button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="py-4 font-bold uppercase tracking-widest text-xs">Size</th>
                      <th className="py-4 font-bold uppercase tracking-widest text-xs">Chest (in)</th>
                      <th className="py-4 font-bold uppercase tracking-widest text-xs">Waist (in)</th>
                      <th className="py-4 font-bold uppercase tracking-widest text-xs">Length (in)</th>
                    </tr>
                  </thead>
                  <tbody className="text-white/60">
                    <tr className="border-b border-white/5">
                      <td className="py-4">Small</td>
                      <td className="py-4">36 - 38</td>
                      <td className="py-4">28 - 30</td>
                      <td className="py-4">27</td>
                    </tr>
                    <tr className="border-b border-white/5">
                      <td className="py-4">Medium</td>
                      <td className="py-4">38 - 40</td>
                      <td className="py-4">30 - 32</td>
                      <td className="py-4">28</td>
                    </tr>
                    <tr className="border-b border-white/5">
                      <td className="py-4">Large</td>
                      <td className="py-4">40 - 42</td>
                      <td className="py-4">32 - 34</td>
                      <td className="py-4">29</td>
                    </tr>
                    <tr className="border-b border-white/5">
                      <td className="py-4">X-Large</td>
                      <td className="py-4">42 - 44</td>
                      <td className="py-4">34 - 36</td>
                      <td className="py-4">30</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="mt-8 p-4 bg-white/5 rounded flex gap-3">
                <Info className="w-4 h-4 text-prism-mid shrink-0" />
                <p className="text-[10px] text-white/40 leading-relaxed">
                  Measurements are in inches. For an oversized fit, we recommend sizing up. 
                  All our garments are pre-shrunk to ensure the perfect fit after washing.
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
