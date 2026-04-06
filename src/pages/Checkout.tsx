import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import confetti from 'canvas-confetti';
import { useApp } from '../AppContext';
import { Order } from '../types';
import { formatPrice, generateOrderNumber } from '../lib/utils';
import { ShieldCheck, CreditCard, Truck } from 'lucide-react';

export default function Checkout() {
  const navigate = useNavigate();
  const { cart, addOrder } = useApp();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
  });
  const [deliveryArea, setDeliveryArea] = useState<'Inside Chittagong' | 'Outside Chittagong'>('Inside Chittagong');

  const subtotal = cart.reduce((acc, item) => {
    const price = item.offer ? item.price * (1 - item.offer / 100) : item.price;
    return acc + price * item.quantity;
  }, 0);

  const deliveryFee = deliveryArea === 'Inside Chittagong' ? 80 : 120;
  const total = subtotal + deliveryFee;

  React.useEffect(() => {
    if (cart.length === 0) {
      navigate('/shop');
    }
  }, [cart.length, navigate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const order: Order = {
      id: generateOrderNumber(),
      items: [...cart],
      total: total,
      deliveryArea,
      deliveryFee,
      customer: formData,
      date: new Date().toISOString(),
      status: 'pending'
    };

    addOrder(order);
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#ff0080', '#7928ca', '#0070f3']
    });
    navigate(`/invoice/${order.id}`);
  };

  if (cart.length === 0) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="max-w-4xl mx-auto px-6 py-12"
    >
      <h1 className="text-5xl font-display font-bold tracking-tighter mb-16 uppercase">CHECK<span className="prism-text">OUT</span></h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
        <div>
          <h2 className="text-xl font-display font-bold uppercase tracking-tight mb-8">Shipping Information</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-white/40">Full Name</label>
              <input 
                required
                type="text"
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                className="w-full glass border-white/5 p-4 outline-none focus:border-prism-mid/50 transition-colors"
                placeholder="John Doe"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-white/40">Phone Number</label>
              <input 
                required
                type="tel"
                value={formData.phone}
                onChange={e => setFormData({ ...formData, phone: e.target.value })}
                className="w-full glass border-white/5 p-4 outline-none focus:border-prism-mid/50 transition-colors"
                placeholder="+1 (555) 000-0000"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-white/40">Shipping Address</label>
              <textarea 
                required
                value={formData.address}
                onChange={e => setFormData({ ...formData, address: e.target.value })}
                className="w-full glass border-white/5 p-4 outline-none focus:border-prism-mid/50 transition-colors h-32 resize-none"
                placeholder="123 Prism Way, Spectrum City, 90210"
              />
            </div>

            <div className="space-y-4">
              <label className="text-[10px] font-bold uppercase tracking-widest text-white/40">Delivery Area</label>
              <div className="grid grid-cols-2 gap-4">
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setDeliveryArea('Inside Chittagong')}
                  className={`p-4 glass border transition-all text-left relative overflow-hidden ${deliveryArea === 'Inside Chittagong' ? 'border-prism-mid bg-prism-mid/10' : 'border-white/5'}`}
                >
                  {deliveryArea === 'Inside Chittagong' && (
                    <motion.div 
                      layoutId="active-delivery"
                      className="absolute inset-0 bg-gradient-to-br from-prism-start/5 to-prism-mid/5"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    />
                  )}
                  <p className="text-xs font-bold uppercase tracking-tight relative z-10">Inside Chittagong</p>
                  <p className="text-[10px] text-white/40 relative z-10">80 Taka</p>
                </motion.button>
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setDeliveryArea('Outside Chittagong')}
                  className={`p-4 glass border transition-all text-left relative overflow-hidden ${deliveryArea === 'Outside Chittagong' ? 'border-prism-mid bg-prism-mid/10' : 'border-white/5'}`}
                >
                  {deliveryArea === 'Outside Chittagong' && (
                    <motion.div 
                      layoutId="active-delivery"
                      className="absolute inset-0 bg-gradient-to-br from-prism-start/5 to-prism-mid/5"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    />
                  )}
                  <p className="text-xs font-bold uppercase tracking-tight relative z-10">Outside Chittagong</p>
                  <p className="text-[10px] text-white/40 relative z-10">120 Taka</p>
                </motion.button>
              </div>
            </div>

            <div className="pt-8">
              <h2 className="text-xl font-display font-bold uppercase tracking-tight mb-8">Payment Method</h2>
              <div className="p-4 glass border-prism-mid/30 flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <CreditCard className="w-5 h-5 text-prism-mid" />
                  <span className="text-sm font-bold uppercase tracking-widest">Cash on Delivery</span>
                </div>
                <div className="w-4 h-4 rounded-full border-2 border-prism-mid flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-prism-mid" />
                </div>
              </div>
              
              <button
                type="submit"
                className="w-full py-6 bg-white text-black font-display font-bold uppercase tracking-widest text-sm hover:bg-prism-mid hover:text-white transition-colors"
              >
                Complete Purchase
              </button>
            </div>
          </form>
        </div>

        <div>
          <div className="p-8 glass border-white/10">
            <h2 className="font-display font-bold text-xl uppercase tracking-tight mb-8">Your Order</h2>
            <div className="space-y-6 mb-8">
              {cart.map((item) => (
                <div key={`${item.id}-${item.selectedSize}`} className="flex justify-between gap-4">
                  <div className="flex gap-4">
                    <div className="w-12 h-16 glass border-white/5 overflow-hidden shrink-0">
                      <img src={item.images[0]} alt={item.title} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-tight">{item.title}</h4>
                      <p className="text-[10px] text-white/40 uppercase tracking-widest">Size: {item.selectedSize} × {item.quantity}</p>
                    </div>
                  </div>
                  <span className="text-xs font-bold">
                    {formatPrice((item.offer ? item.price * (1 - item.offer / 100) : item.price) * item.quantity)}
                  </span>
                </div>
              ))}
            </div>
            <div className="space-y-4 pt-6 border-t border-white/10">
              <div className="flex justify-between text-xs">
                <span className="text-white/40 uppercase tracking-widest">Subtotal</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-white/40 uppercase tracking-widest">Shipping ({deliveryArea})</span>
                <motion.span 
                  key={deliveryFee}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="text-prism-mid uppercase tracking-widest font-bold"
                >
                  {formatPrice(deliveryFee)}
                </motion.span>
              </div>
              <div className="flex justify-between pt-4 border-t border-white/10">
                <span className="font-display font-bold uppercase tracking-widest">Total</span>
                <motion.span 
                  key={total}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="font-display font-bold text-xl"
                >
                  {formatPrice(total)}
                </motion.span>
              </div>
            </div>

            <div className="mt-12 space-y-4">
              <div className="flex items-center gap-3 text-white/30">
                <ShieldCheck className="w-4 h-4" />
                <span className="text-[10px] uppercase tracking-widest">Secure Checkout</span>
              </div>
              <div className="flex items-center gap-3 text-white/30">
                <Truck className="w-4 h-4" />
                <span className="text-[10px] uppercase tracking-widest">2-3 Days Delivery</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
