import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, ShoppingBag, Ruler, Truck, RotateCcw, Info } from 'lucide-react';
import { useApp } from '../AppContext';
import { formatPrice, cn } from '../lib/utils';

export default function ProductPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { products, addToCart } = useApp();
  const product = products.find(p => p.id === id);
  const [selectedSize, setSelectedSize] = useState('');
  const [showSizeGuide, setShowSizeGuide] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

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
      className="max-w-7xl mx-auto px-6 py-12"
    >
      <Link to="/shop" className="inline-flex items-center gap-2 text-white/50 hover:text-white mb-12 transition-colors text-sm uppercase tracking-widest font-bold">
        <ArrowLeft className="w-4 h-4" /> Back to Shop
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        {/* Image Gallery */}
        <div className="space-y-6">
          {product.isSpectrum && product.spectrumImage && (
            <motion.div 
              initial={{ opacity: 0, scale: 1.1 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative aspect-[4/5] overflow-hidden rounded-[3rem] glass border-prism-mid/30"
            >
              <img 
                src={product.spectrumImage} 
                alt="Spectrum Effect" 
                className="w-full h-full object-cover mix-blend-screen opacity-80"
                loading="eager"
                decoding="async"
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
              className="glass border-white/5 overflow-hidden aspect-[4/5]"
            >
              <img 
                src={img} 
                alt={product.title} 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
                loading={i === 0 ? "eager" : "lazy"}
                decoding="async"
              />
            </motion.div>
          ))}
        </div>

        {/* Product Info */}
        <div className="lg:sticky lg:top-32 h-fit">
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-xs font-bold uppercase tracking-widest text-white/40">{product.category}</span>
              {product.isSpectrum && (
                <span className="px-2 py-1 glass border-white/20 text-[10px] font-bold uppercase tracking-widest prism-text">Spectrum Series</span>
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
                    product.stockCount < 5 ? "text-orange-400 border-orange-400/30" : "text-white/40"
                  )}>
                    {product.stockCount} Pieces Left
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

          <button
            onClick={handleAddToCart}
            disabled={!selectedSize || isAdding || product.isOutOfStock}
            className={cn(
              "w-full py-6 font-display font-bold uppercase tracking-widest text-sm transition-all relative overflow-hidden",
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
        </div>
      </div>

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
