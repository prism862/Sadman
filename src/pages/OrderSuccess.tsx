import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { CheckCircle2, ShoppingBag, ArrowRight, Package, Truck, CreditCard, Instagram, Printer } from 'lucide-react';
import { useApp } from '../AppContext';
import { formatPrice } from '../lib/utils';
import confetti from 'canvas-confetti';

export default function OrderSuccess() {
  const { orderId } = useParams();
  const { orders } = useApp();
  const order = orders.find(o => o.id === orderId);

  React.useEffect(() => {
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#ff0080', '#7928ca', '#0070f3']
    });
    window.scrollTo(0, 0);
  }, []);

  if (!order) return <div className="py-40 text-center">Order not found.</div>;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-4xl mx-auto px-6 py-20"
    >
      <div className="text-center mb-16">
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", damping: 15, stiffness: 200 }}
          className="w-24 h-24 bg-gradient-to-br from-prism-start to-prism-mid rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-[0_0_50px_rgba(121,40,202,0.3)]"
        >
          <CheckCircle2 className="w-12 h-12 text-white" />
        </motion.div>
        <h1 className="text-5xl md:text-7xl font-display font-black tracking-tighter mb-4 uppercase">
          THANK <span className="prism-text">YOU</span>
        </h1>
        <p className="text-white/40 uppercase tracking-[0.4em] text-[10px] font-mono mb-8">Your order has been placed successfully • {order.id}</p>
        
        <div className="inline-flex items-center gap-3 px-6 py-2 glass border-prism-mid/40 rounded-full">
          <div className="w-2 h-2 rounded-full bg-prism-mid animate-pulse" />
          <span className="text-[10px] font-bold uppercase tracking-[0.3em] prism-text">Order Confirmed</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Order Details */}
        <div className="lg:col-span-2 space-y-8">
          <div className="glass border-white/10 p-8 rounded-[2.5rem]">
            <h2 className="text-xl font-display font-bold uppercase tracking-tight mb-8">Order Details</h2>
            <div className="space-y-6">
              {order.items.map((item, i) => (
                <div key={i} className="flex justify-between items-center py-4 border-b border-white/5 last:border-0">
                  <div className="flex gap-4">
                    <div className="w-16 h-16 glass border-white/5 overflow-hidden shrink-0 rounded-xl">
                      <img src={item.images[0]} alt={item.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold uppercase tracking-tight">{item.title}</h4>
                      <p className="text-[10px] text-white/40 uppercase tracking-widest">Size: {item.selectedSize} × {item.quantity}</p>
                    </div>
                  </div>
                  <span className="font-bold text-sm">
                    {formatPrice((item.offer ? item.price * (1 - item.offer / 100) : item.price) * item.quantity)}
                  </span>
                </div>
              ))}
            </div>
            
            <div className="mt-8 pt-8 border-t border-white/10 space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-white/40 uppercase tracking-widest">Subtotal</span>
                <span>{formatPrice(order.total - order.deliveryFee)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-white/40 uppercase tracking-widest">Shipping</span>
                <span className="text-prism-mid font-bold uppercase tracking-widest text-[10px]">{formatPrice(order.deliveryFee)}</span>
              </div>
              <div className="flex justify-between pt-4 border-t border-white/10">
                <span className="font-display font-bold uppercase tracking-widest">Total Paid</span>
                <span className="font-display font-bold text-2xl prism-text">{formatPrice(order.total)}</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="glass border-white/5 p-6 rounded-3xl flex items-start gap-4">
              <Truck className="w-5 h-5 text-prism-mid shrink-0" />
              <div>
                <h4 className="text-[10px] font-bold uppercase tracking-widest mb-1">Estimated Delivery</h4>
                <p className="text-xs text-white/50">2-3 Business Days</p>
              </div>
            </div>
            <div className="glass border-white/5 p-6 rounded-3xl flex items-start gap-4">
              <CreditCard className="w-5 h-5 text-prism-mid shrink-0" />
              <div>
                <h4 className="text-[10px] font-bold uppercase tracking-widest mb-1">Payment Method</h4>
                <p className="text-xs text-white/50 uppercase">Cash on Delivery</p>
              </div>
            </div>
          </div>
        </div>

        {/* Customer Info & Actions */}
        <div className="space-y-8">
          <div className="glass border-white/10 p-8 rounded-[2.5rem]">
            <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-prism-mid mb-6">Shipping To</h3>
            <div className="space-y-4">
              <div>
                <p className="font-display font-bold text-lg">{order.customer.name}</p>
                <p className="text-sm text-white/50 font-light leading-relaxed mt-2">
                  {order.customer.address}
                </p>
                <p className="text-sm text-white/50 font-mono tracking-tighter mt-1">{order.customer.phone}</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <Link 
              to="/shop"
              className="w-full py-6 bg-white text-black font-display font-bold uppercase tracking-[0.2em] text-xs flex items-center justify-center gap-4 hover:scale-105 active:scale-95 transition-all group shadow-[0_0_30px_rgba(255,255,255,0.1)]"
            >
              Continue Shopping <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
            </Link>
            <Link 
              to={`/invoice/${order.id}`}
              className="w-full py-6 glass border-white/10 text-white font-display font-bold uppercase tracking-[0.2em] text-xs flex items-center justify-center gap-4 hover:bg-white/5 transition-all"
            >
              <Printer className="w-4 h-4" /> View Full Invoice
            </Link>
          </div>

          <div className="p-8 glass border-prism-mid/20 rounded-[2.5rem] text-center">
            <Instagram className="w-8 h-8 text-prism-mid mx-auto mb-4" />
            <h4 className="text-sm font-display font-bold uppercase tracking-widest mb-2">Join the Spectrum</h4>
            <p className="text-[10px] text-white/40 uppercase tracking-widest leading-relaxed mb-4">Tag us in your fits for a chance to be featured</p>
            <a 
              href="https://instagram.com/prism_thebest" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-xs font-bold prism-text hover:opacity-80 transition-opacity"
            >
              @prism_thebest
            </a>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
