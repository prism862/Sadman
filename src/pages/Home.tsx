import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Sparkles, Instagram } from 'lucide-react';
import { Link } from 'react-router-dom';
import { fadeInUp, fadeIn, scaleIn, staggerContainer, staggerItem } from '../constants/animations';
import SmoothImage from '../components/SmoothImage';

export default function Home() {
  return (
    <div className="relative min-h-screen pt-20 overflow-hidden">
      {/* Background Light Effects */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-prism-mid/10 blur-[100px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[700px] h-[700px] bg-prism-end/10 blur-[120px] rounded-full pointer-events-none" />

      <section className="relative max-w-7xl mx-auto px-6 pt-32 pb-20 flex flex-col items-center text-center">
        <motion.div
          variants={fadeInUp}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          className="inline-flex items-center gap-2 px-6 py-2 rounded-full glass mb-12"
        >
          <Sparkles size={16} className="text-prism-mid animate-pulse" />
          <span className="text-[10px] font-mono tracking-[0.4em] uppercase text-white/50">
            Refracting Style Since 2025
          </span>
        </motion.div>

        <motion.h1
          variants={fadeInUp}
          initial="initial"
          animate="animate"
          className="text-7xl md:text-[10rem] font-display font-black tracking-[-0.05em] mb-12 leading-[0.85]"
        >
          PRISM <br />
          <span className="prism-text italic uppercase">THE BEST</span>
        </motion.h1>

        {/* Animated Prism Hero Element with Internal Lines */}
        <motion.div
          variants={scaleIn}
          initial="initial"
          animate="animate"
          className="relative mb-20"
        >
          <div className="w-48 h-48 md:w-64 md:h-64 relative flex items-center justify-center">
            <svg viewBox="0 0 100 100" className="w-full h-full">
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
              {/* Animated Internal Lines */}
              <motion.path
                d="M50 10 L50 85"
                stroke="white"
                strokeWidth="0.5"
                strokeOpacity="0.5"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: [0.2, 0.5, 0.2] }}
                transition={{ 
                  pathLength: { duration: 2, ease: "easeInOut" },
                  opacity: { duration: 3, repeat: Infinity, ease: "easeInOut" }
                }}
              />
              <motion.path
                d="M50 10 L35 85"
                stroke="white"
                strokeWidth="0.2"
                strokeOpacity="0.2"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 2.5, ease: "easeInOut", delay: 0.2 }}
              />
              <motion.path
                d="M50 10 L65 85"
                stroke="white"
                strokeWidth="0.2"
                strokeOpacity="0.2"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 2.5, ease: "easeInOut", delay: 0.4 }}
              />
              {/* Subtle Glow Lines */}
              {[...Array(2)].map((_, i) => (
                <motion.line
                  key={i}
                  x1="15" y1={85 - i * 8} x2="85" y2={85 - i * 8}
                  stroke="white"
                  strokeWidth="0.1"
                  initial={{ opacity: 0, scaleX: 0 }}
                  animate={{ opacity: [0, 0.2, 0], scaleX: [0, 1, 0] }}
                  transition={{ 
                    duration: 5, 
                    repeat: Infinity, 
                    delay: i * 2,
                    ease: "easeInOut" 
                  }}
                  className="origin-center"
                />
              ))}
            </svg>
          </div>
        </motion.div>

        <motion.p
          variants={fadeIn}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          className="max-w-2xl text-xl text-white/40 mb-16 leading-relaxed font-light tracking-wide"
        >
          Engineered for durability. Designed for distinction. 
          Prism represents the pinnacle of modern textile innovation and uncompromising quality standards.
        </motion.p>

        <motion.div
          variants={fadeInUp}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
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
      <section className="max-w-7xl mx-auto px-6 pb-20">
        <motion.div 
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
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
              variants={staggerItem}
              className="p-10 glass border-white/5 rounded-[2.5rem] hover:border-white/20 transition-colors group"
            >
              {item.icon}
              <h3 className="text-2xl font-display font-bold mb-4 tracking-tight">{item.title}</h3>
              <p className="text-white/40 leading-relaxed font-light">{item.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Featured Grid */}
      <section className="max-w-7xl mx-auto px-6 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1 }}
            className="relative h-[700px] rounded-[3rem] overflow-hidden group cursor-pointer"
          >
            <SmoothImage 
              src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=1200" 
              alt="Model"
              className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
              containerClassName="w-full h-full"
              loading="eager"
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
              <SmoothImage 
                src="https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&q=80&w=800" 
                alt="Model"
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                containerClassName="w-full h-full"
                loading="lazy"
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
              <SmoothImage 
                src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=800" 
                alt="Model"
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                containerClassName="w-full h-full"
                loading="lazy"
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
      {/* Instagram CTA Section */}
      <section className="max-w-7xl mx-auto px-6 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative p-12 md:p-24 glass border-prism-mid/20 rounded-[3rem] overflow-hidden text-center group"
        >
          <div className="absolute top-0 right-0 w-96 h-96 bg-prism-mid/10 blur-[120px] -mr-48 -mt-48 group-hover:bg-prism-mid/20 transition-colors duration-1000" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-prism-start/10 blur-[120px] -ml-48 -mb-48 group-hover:bg-prism-start/20 transition-colors duration-1000" />
          
          <div className="relative z-10">
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-white/5 mb-8 text-prism-mid"
            >
              <Instagram size={40} />
            </motion.div>
            <h2 className="text-4xl md:text-6xl font-display font-black mb-6 tracking-tighter uppercase">Join the <span className="prism-text">Spectrum</span></h2>
            <p className="text-white/40 text-lg md:text-xl mb-12 max-w-2xl mx-auto font-light leading-relaxed">
              Follow us for exclusive drops, behind-the-scenes content, and styling inspiration from the PRISM community.
            </p>
            <a 
              href="https://instagram.com/prism_thebest" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-4 px-12 py-6 bg-white text-black font-display font-bold uppercase tracking-[0.2em] text-sm rounded-full hover:scale-105 active:scale-95 transition-all shadow-[0_0_50px_rgba(255,255,255,0.1)]"
            >
              @prism_thebest <ArrowRight size={18} />
            </a>
          </div>
        </motion.div>
      </section>

    </div>
  );
};
