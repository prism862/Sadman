import React from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Trash2, ArrowRight, ShoppingBag } from 'lucide-react';
import { useApp } from '../AppContext';
import { formatPrice } from '../lib/utils';
import { fadeInUp, staggerContainer, staggerItem, hoverScale } from '../constants/animations';

export default function CartPage() {
  const { cart, removeFromCart } = useApp();
  const subtotal = cart.reduce((acc, item) => {
    const price = item.offer ? item.price * (1 - item.offer / 100) : item.price;
    return acc + price * item.quantity;
  }, 0);

  if (cart.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="max-w-7xl mx-auto px-6 pt-20 pb-40 text-center"
      >
        <ShoppingBag className="w-16 h-16 text-white/10 mx-auto mb-8" />
        <h1 className="text-4xl font-display font-bold tracking-tighter mb-4 uppercase">Your Bag is Empty</h1>
        <p className="text-white/40 mb-12">Looks like you haven't added anything to your bag yet.</p>
        <Link to="/shop" className="px-10 py-4 bg-white text-black font-display font-bold uppercase tracking-widest text-sm hover:bg-prism-mid hover:text-white transition-colors">
          Start Shopping
        </Link>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="max-w-7xl mx-auto px-6 pt-20 pb-12"
    >
      <h1 className="text-5xl md:text-7xl font-display font-bold tracking-tighter mb-16 uppercase">YOUR <span className="prism-text">BAG</span></h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
        <div className="lg:col-span-2 space-y-8">
          <motion.div 
            variants={staggerContainer}
            initial="initial"
            animate="animate"
            className="space-y-8"
          >
            <AnimatePresence mode="popLayout">
              {cart.map((item) => (
                <motion.div
                  layout
                  key={`${item.id}-${item.selectedSize}`}
                  variants={staggerItem}
                  exit={{ opacity: 0, x: 20 }}
                  className="flex gap-6 p-6 glass border-white/5 group"
                >
                <div className="w-24 h-24 md:w-32 md:h-32 overflow-hidden shrink-0 rounded-2xl">
                  <img 
                    src={item.images[0]} 
                    alt={item.title} 
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-display font-bold text-xl uppercase tracking-tight">{item.title}</h3>
                      <button 
                        onClick={() => removeFromCart(item.id, item.selectedSize)}
                        className="text-white/20 hover:text-prism-start transition-colors"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                    <p className="text-xs font-bold uppercase tracking-widest text-white/40 mb-4">Size: {item.selectedSize} • Qty: {item.quantity}</p>
                  </div>
                  <div className="flex justify-between items-end">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-prism-mid">In Stock</span>
                    <span className="font-display font-bold text-lg">
                      {item.offer 
                        ? formatPrice(item.price * (1 - item.offer / 100) * item.quantity)
                        : formatPrice(item.price * item.quantity)
                      }
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          </motion.div>
        </div>

        <motion.div 
          variants={fadeInUp}
          initial="initial"
          animate="animate"
          className="lg:sticky lg:top-32 h-fit"
        >
          <div className="p-8 glass border-white/10">
            <h2 className="font-display font-bold text-2xl uppercase tracking-tight mb-8">Order Summary</h2>
            <div className="space-y-4 mb-8">
              <div className="flex justify-between text-sm">
                <span className="text-white/50 uppercase tracking-widest">Subtotal</span>
                <span className="font-bold">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-white/50 uppercase tracking-widest">Shipping</span>
                <span className="text-prism-mid font-bold uppercase tracking-widest text-[10px]">Calculated at next step</span>
              </div>
              <div className="pt-4 border-t border-white/10 flex justify-between">
                <span className="font-display font-bold uppercase tracking-widest">Total</span>
                <span className="font-display font-bold text-2xl">{formatPrice(subtotal)}</span>
              </div>
            </div>
            <Link 
              to="/checkout"
              className="w-full py-6 bg-white text-black font-display font-bold uppercase tracking-widest text-sm flex items-center justify-center gap-2 hover:bg-prism-mid hover:text-white transition-colors"
            >
              Checkout <ArrowRight className="w-4 h-4" />
            </Link>
            <p className="mt-6 text-[10px] text-center text-white/30 uppercase tracking-widest leading-loose">
              Taxes and shipping calculated at checkout. <br />
              Secure encrypted payment processing.
            </p>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
