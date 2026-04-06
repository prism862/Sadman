import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="relative min-h-screen pt-20 overflow-hidden">
      {/* Background Light Effects */}
      <motion.div 
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.1, 0.2, 0.1],
          x: [0, 100, 0]
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-0 left-1/4 w-[800px] h-[800px] bg-prism-mid/20 blur-[150px] rounded-full" 
      />
      <motion.div 
        animate={{ 
          scale: [1, 1.3, 1],
          opacity: [0.1, 0.3, 0.1],
          x: [0, -100, 0]
        }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        className="absolute bottom-0 right-1/4 w-[900px] h-[900px] bg-prism-end/20 blur-[180px] rounded-full" 
      />
      <div className="scanline opacity-30" />

      <section className="relative max-w-7xl mx-auto px-6 pt-32 pb-40 flex flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="inline-flex items-center gap-2 px-6 py-2 rounded-full glass mb-12"
        >
          <Sparkles size={16} className="text-prism-mid animate-pulse" />
          <span className="text-[10px] font-mono tracking-[0.4em] uppercase text-white/50">
            Refracting Style Since 2025
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, delay: 0.2 }}
          className="text-7xl md:text-[10rem] font-display font-black tracking-[-0.05em] mb-12 leading-[0.85]"
        >
          PRISM <br />
          <span className="prism-text italic">QUALITY</span>
        </motion.h1>

        {/* Animated Prism Hero Element */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
          className="relative mb-20"
        >
          <motion.div
            animate={{ 
              rotateY: [0, 360],
              y: [0, -20, 0]
            }}
            transition={{ 
              rotateY: { duration: 12, repeat: Infinity, ease: "linear" },
              y: { duration: 6, repeat: Infinity, ease: "easeInOut" }
            }}
            className="w-48 h-48 md:w-64 md:h-64 relative preserve-3d"
          >
            <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_0_40px_rgba(121,40,202,0.3)]">
              <defs>
                <linearGradient id="prism-hero-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#7928ca" stopOpacity="0.8" />
                  <stop offset="50%" stopColor="#0070f3" stopOpacity="0.6" />
                  <stop offset="100%" stopColor="#ffffff" stopOpacity="0.4" />
                </linearGradient>
              </defs>
              <path
                d="M50 10 L90 85 L10 85 Z"
                fill="url(#prism-hero-grad)"
                stroke="white"
                strokeWidth="0.5"
                strokeOpacity="0.3"
              />
              <path
                d="M50 10 L50 85"
                stroke="white"
                strokeWidth="0.2"
                strokeOpacity="0.2"
              />
            </svg>
            
            {/* Refraction Lines */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              {[...Array(4)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-full h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent"
                  animate={{ 
                    rotate: [0, 360],
                    scale: [1, 1.8, 1],
                    opacity: [0.1, 0.4, 0.1]
                  }}
                  transition={{ 
                    duration: 7 + i, 
                    repeat: Infinity, 
                    ease: "linear" 
                  }}
                />
              ))}
            </div>
          </motion.div>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.5, delay: 0.5 }}
          className="max-w-2xl text-xl text-white/40 mb-16 leading-relaxed font-light tracking-wide"
        >
          Engineered for durability. Designed for distinction. 
          Prism represents the pinnacle of modern textile innovation and uncompromising quality standards.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.8 }}
          className="flex flex-col sm:flex-row gap-6"
        >
          <Link 
            to="/shop"
            className="group relative px-12 py-5 bg-white text-black font-display font-bold rounded-full overflow-hidden transition-all hover:scale-105 active:scale-95"
          >
            <span className="relative z-10 uppercase tracking-widest text-xs">Explore Shop</span>
          </Link>
          <Link 
            to="/shop"
            className="px-12 py-5 glass rounded-full font-display font-bold uppercase tracking-widest text-xs hover:bg-white/10 transition-all hover:scale-105 active:scale-95"
          >
            Lookbook
          </Link>
        </motion.div>
      </section>

      {/* Brand Proof / Quality Section */}
      <section className="max-w-7xl mx-auto px-6 pb-40">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              title: "Premium Materials",
              desc: "Sourced from the finest sustainable mills across the globe.",
              icon: <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-prism-mid mb-6"><Sparkles size={24} /></div>
            },
            {
              title: "Ethical Craftsmanship",
              desc: "Every piece is handcrafted in certified fair-trade facilities.",
              icon: <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-prism-mid mb-6"><ArrowRight size={24} className="rotate-45" /></div>
            },
            {
              title: "Lifetime Guarantee",
              desc: "We stand by our quality. Built to last a lifetime of wear.",
              icon: <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-prism-mid mb-6"><Sparkles size={24} className="scale-x-[-1]" /></div>
            }
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: i * 0.2 }}
              className="p-10 glass border-white/5 rounded-[2.5rem] hover:border-white/20 transition-colors group"
            >
              {item.icon}
              <h3 className="text-2xl font-display font-bold mb-4 tracking-tight">{item.title}</h3>
              <p className="text-white/40 leading-relaxed font-light">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Featured Grid */}
      <section className="max-w-7xl mx-auto px-6 pb-40">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1 }}
            className="relative h-[700px] rounded-[3rem] overflow-hidden group cursor-pointer"
          >
            <img 
              src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=1000" 
              alt="Model"
              className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
            <div className="absolute bottom-16 left-16">
              <h3 className="text-5xl font-display font-bold mb-4 tracking-tighter">Spectrum Series</h3>
              <p className="text-white/50 mb-8 max-w-xs font-light">Limited edition reactive fabrics that shift with light.</p>
              <Link to="/shop" className="inline-flex items-center gap-3 text-xs font-bold uppercase tracking-[0.3em] hover:prism-text transition-colors group/link">
                Shop Now <ArrowRight size={16} className="group-hover/link:translate-x-2 transition-transform" />
              </Link>
            </div>
          </motion.div>

          <div className="flex flex-col gap-12">
            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 1, delay: 0.2 }}
              className="relative flex-1 rounded-[3rem] overflow-hidden group cursor-pointer"
            >
              <img 
                src="https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&q=80&w=1000" 
                alt="Model"
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
              <div className="absolute bottom-12 left-12">
                <h3 className="text-4xl font-display font-bold mb-3 tracking-tighter">Essential Prism</h3>
                <Link to="/shop" className="inline-flex items-center gap-3 text-xs font-bold uppercase tracking-[0.3em] hover:prism-text transition-colors group/link">
                  Shop Now <ArrowRight size={16} className="group-hover/link:translate-x-2 transition-transform" />
                </Link>
              </div>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 1, delay: 0.4 }}
              className="relative flex-1 rounded-[3rem] overflow-hidden group cursor-pointer"
            >
              <img 
                src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=1000" 
                alt="Model"
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
              <div className="absolute bottom-12 left-12">
                <h3 className="text-4xl font-display font-bold mb-3 tracking-tighter">Accessories</h3>
                <Link to="/shop" className="inline-flex items-center gap-3 text-xs font-bold uppercase tracking-[0.3em] hover:prism-text transition-colors group/link">
                  Shop Now <ArrowRight size={16} className="group-hover/link:translate-x-2 transition-transform" />
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};
