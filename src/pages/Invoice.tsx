import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { CheckCircle2, Printer, ArrowRight, Package, CreditCard, Truck, Instagram, Clock, Settings, Send, CheckCircle } from 'lucide-react';
import { useApp } from '../AppContext';
import { formatPrice } from '../lib/utils';
import { Order } from '../types';

const StatusTracker = ({ status }: { status: Order['status'] }) => {
  const steps = [
    { id: 'pending', label: 'Confirmed', icon: Clock },
    { id: 'processing', label: 'Processing', icon: Settings },
    { id: 'shipped', label: 'Shipped', icon: Send },
    { id: 'delivered', label: 'Delivered', icon: CheckCircle },
  ];

  const currentStepIndex = steps.findIndex(s => s.id === status);

  return (
    <div className="w-full py-12 px-4 mb-12 glass border-white/5 rounded-[2.5rem] overflow-hidden relative">
      <div className="absolute inset-0 bg-gradient-to-r from-prism-start/5 via-transparent to-prism-mid/5 pointer-events-none" />
      <div className="relative flex justify-between items-start max-w-2xl mx-auto">
        {steps.map((step, index) => {
          const Icon = step.icon;
          const isCompleted = index < currentStepIndex;
          const isCurrent = index === currentStepIndex;
          const isLast = index === steps.length - 1;

          return (
            <div key={step.id} className="flex flex-col items-center relative z-10 flex-1">
              {/* Connector Line */}
              {!isLast && (
                <div className="absolute top-5 left-1/2 w-full h-[2px] bg-white/5">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: isCompleted ? '100%' : isCurrent ? '50%' : '0%' }}
                    className="h-full bg-prism-mid shadow-[0_0_10px_rgba(121,40,202,0.5)]"
                  />
                </div>
              )}
              
              {/* Step Icon */}
              <motion.div
                initial={false}
                animate={{
                  scale: isCurrent ? 1.2 : 1,
                  backgroundColor: isCompleted || isCurrent ? 'rgba(121, 40, 202, 1)' : 'rgba(255, 255, 255, 0.05)',
                  borderColor: isCurrent ? 'rgba(255, 255, 255, 0.5)' : 'rgba(255, 255, 255, 0.1)',
                }}
                className={`w-10 h-10 rounded-xl border flex items-center justify-center mb-3 transition-colors duration-500`}
              >
                <Icon size={18} className={isCompleted || isCurrent ? 'text-white' : 'text-white/20'} />
              </motion.div>

              {/* Step Label */}
              <span className={`text-[9px] font-bold uppercase tracking-[0.2em] text-center ${isCurrent ? 'text-white' : 'text-white/30'}`}>
                {step.label}
              </span>
              
              {isCurrent && (
                <motion.div 
                  layoutId="active-dot"
                  className="w-1 h-1 rounded-full bg-prism-mid mt-2 animate-pulse"
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default function Invoice() {
  const { orderId } = useParams();
  const { orders } = useApp();
  const order = orders.find(o => o.id === orderId);

  if (!order) return <div className="py-40 text-center">Order not found.</div>;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="max-w-3xl mx-auto px-6 py-12"
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
        <h1 className="text-5xl font-display font-black tracking-tighter mb-4 uppercase text-white">
          ORDER <span className="prism-text">COMPLETED</span>
        </h1>
        <p className="text-white/40 uppercase tracking-[0.4em] text-[10px] font-mono mb-8">Thank you for your purchase • {order.id}</p>
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
          className="inline-flex items-center gap-2 px-6 py-2 glass border-prism-mid/40 rounded-full shadow-[0_0_20px_rgba(121,40,202,0.2)]"
        >
          <div className="w-2 h-2 rounded-full bg-prism-mid animate-pulse" />
          <span className="text-[10px] font-bold uppercase tracking-[0.3em] prism-text">
            {order.status === 'delivered' ? 'Order Delivered' : 'Ready for Dispatch'}
          </span>
        </motion.div>
      </div>

      <StatusTracker status={order.status} />

      <div className="glass border-white/10 p-10 md:p-16 relative overflow-hidden rounded-[3rem]">
        <div className="absolute top-0 right-0 w-64 h-64 bg-prism-mid/10 blur-[100px] -mr-32 -mt-32 animate-pulse" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-prism-start/10 blur-[100px] -ml-32 -mb-32 animate-pulse" />
        
        <div className="flex flex-col md:flex-row justify-between gap-12 mb-16 border-b border-white/10 pb-16">
          <div>
            <h2 className="font-display font-black text-3xl tracking-[0.1em] mb-4">PRISM</h2>
            <div className="space-y-1">
              <p className="text-[10px] text-white/30 uppercase tracking-widest">Quality Excellence</p>
              <p className="text-[10px] text-white/30 uppercase tracking-widest">Spectrum Heights, 2025</p>
              <p className="text-[10px] text-white/30 uppercase tracking-widest mt-4">Date: {new Date(order.date).toLocaleDateString()}</p>
            </div>
          </div>
          <div className="text-left md:text-right">
            <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-prism-mid mb-4">Customer Details</h3>
            <div className="space-y-2">
              <p className="font-display font-bold text-xl">{order.customer.name}</p>
              <p className="text-sm text-white/50 font-light leading-relaxed max-w-[250px] md:ml-auto">
                {order.customer.address}
              </p>
              <p className="text-sm text-white/50 font-mono tracking-tighter">{order.customer.phone}</p>
            </div>
          </div>
        </div>

        <div className="space-y-6 mb-12">
          <h3 className="text-xs font-bold uppercase tracking-widest text-white/40">Order Details</h3>
          {order.items.map((item, i) => (
            <div key={i} className="flex justify-between items-center py-4 border-b border-white/5 last:border-0">
              <div className="flex gap-4">
                <div className="w-16 h-16 glass border-white/5 overflow-hidden shrink-0 rounded-xl">
                  <img src={item.images[0]} alt={item.title} className="w-full h-full object-cover" />
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 pt-12 border-t border-white/10">
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-4 glass border-white/5">
              <Package className="w-5 h-5 text-prism-mid" />
              <div>
                <h4 className="text-[10px] font-bold uppercase tracking-widest">Order Status</h4>
                <p className="text-xs text-white/50 uppercase">{order.status}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 glass border-white/5">
              <Truck className="w-5 h-5 text-prism-mid shrink-0" />
              <div>
                <h4 className="text-[10px] font-bold uppercase tracking-widest">Estimated Delivery</h4>
                <p className="text-xs text-white/50">2-3 Business Days</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 glass border-white/5">
              <CreditCard className="w-5 h-5 text-prism-mid" />
              <div>
                <h4 className="text-[10px] font-bold uppercase tracking-widest">Payment Method</h4>
                <p className="text-xs text-white/50 uppercase">Cash on Delivery</p>
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-prism-mid mb-4">Order Summary</h3>
            <div className="flex justify-between text-sm">
              <span className="text-white/40 uppercase tracking-widest">Subtotal</span>
              <span>{formatPrice(order.total - order.deliveryFee)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-white/40 uppercase tracking-widest">Shipping ({order.deliveryArea})</span>
              <span className="text-prism-mid uppercase tracking-widest text-[10px] font-bold">{formatPrice(order.deliveryFee)}</span>
            </div>
            <div className="flex justify-between pt-4 border-t border-white/10">
              <span className="font-display font-bold uppercase tracking-widest">Total Paid</span>
              <span className="font-display font-bold text-2xl prism-text">{formatPrice(order.total)}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-16 flex flex-col items-center gap-8">
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="flex flex-col items-center gap-4 p-8 glass border-prism-mid/20 rounded-[2rem] w-full max-w-md text-center"
        >
          <Instagram className="w-8 h-8 text-prism-mid" />
          <div>
            <h4 className="text-sm font-display font-bold uppercase tracking-widest mb-2">Join the Spectrum</h4>
            <p className="text-[10px] text-white/40 uppercase tracking-widest leading-relaxed mb-4">Follow us for exclusive drops and styling inspiration</p>
            <a 
              href="https://instagram.com/prism_thebest" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-xs font-bold prism-text hover:opacity-80 transition-opacity"
            >
              @prism_thebest
            </a>
          </div>
        </motion.div>

        <div className="flex flex-col md:flex-row items-center justify-center gap-12">
          <button 
            onClick={() => window.print()}
            className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.3em] text-white/30 hover:text-white transition-colors group"
          >
            <Printer className="w-4 h-4 group-hover:scale-110 transition-transform" /> Print Invoice
          </button>
          <Link 
            to="/shop"
            className="px-12 py-5 bg-white text-black font-display font-bold uppercase tracking-[0.3em] text-xs flex items-center gap-4 hover:scale-105 active:scale-95 transition-all group shadow-[0_0_30px_rgba(255,255,255,0.1)]"
          >
            Continue Shopping <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
