import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

export default function Intro({ onComplete }: { onComplete: () => void }) {
  const [isTapped, setIsTapped] = useState(false);

  const handleTap = () => {
    if (isTapped) return;
    setIsTapped(true);
    // Use a slightly shorter delay for better responsiveness
    setTimeout(onComplete, 800);
  };

  // Auto-complete after a timeout to ensure the user isn't stuck
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!isTapped) handleTap();
    }, 3000);
    return () => clearTimeout(timer);
  }, [isTapped]);

  return (
    <div 
      className="fixed inset-0 z-[100] bg-[#050505] flex items-center justify-center overflow-hidden cursor-pointer" 
      onClick={handleTap}
    >
      <AnimatePresence mode="wait">
        {!isTapped ? (
          <motion.div
            key="prism-container"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            transition={{ duration: 0.8 }}
            className="relative flex flex-col items-center"
          >
            {/* Simplified Prism SVG with Animated Lines */}
            <div className="w-48 h-48 md:w-64 md:h-64 relative flex items-center justify-center">
              <svg viewBox="0 0 100 100" className="w-full h-full">
                <defs>
                  <linearGradient id="prism-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#7928ca" stopOpacity="0.8" />
                    <stop offset="50%" stopColor="#0070f3" stopOpacity="0.6" />
                    <stop offset="100%" stopColor="#ffffff" stopOpacity="0.4" />
                  </linearGradient>
                </defs>
                {/* Main Triangle */}
                <path
                  d="M50 10 L90 85 L10 85 Z"
                  fill="url(#prism-grad)"
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
                <motion.path
                  d="M50 10 L25 85"
                  stroke="white"
                  strokeWidth="0.1"
                  strokeOpacity="0.1"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 3, ease: "easeInOut", delay: 0.6 }}
                />
                <motion.path
                  d="M50 10 L75 85"
                  stroke="white"
                  strokeWidth="0.1"
                  strokeOpacity="0.1"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 3, ease: "easeInOut", delay: 0.8 }}
                />
                {/* Subtle Glow Lines */}
                {[...Array(4)].map((_, i) => (
                  <motion.line
                    key={i}
                    x1="10" y1={85 - i * 6} x2="90" y2={85 - i * 6}
                    stroke="white"
                    strokeWidth="0.1"
                    initial={{ opacity: 0, scaleX: 0 }}
                    animate={{ opacity: [0, 0.2, 0], scaleX: [0, 1, 0] }}
                    transition={{ 
                      duration: 4, 
                      repeat: Infinity, 
                      delay: i * 1,
                      ease: "easeInOut" 
                    }}
                    className="origin-center"
                  />
                ))}
              </svg>
            </div>

            <div className="mt-12 text-center">
              <h1 className="text-4xl md:text-6xl font-display font-bold tracking-[0.2em] text-white mb-4">
                PRISM
              </h1>
              <p className="text-white/40 font-mono text-xs uppercase tracking-[0.4em] animate-pulse">
                Tap to Enter
              </p>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="flash"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-white z-[110]"
            transition={{ duration: 0.3 }}
          />
        )}
      </AnimatePresence>

      {/* Static Background Ambient Light (No Animation) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-20">
        <div className="absolute -top-1/4 -left-1/4 w-full h-full bg-prism-start/10 blur-[100px] rounded-full" />
        <div className="absolute -bottom-1/4 -right-1/4 w-full h-full bg-prism-end/10 blur-[100px] rounded-full" />
      </div>
    </div>
  );
}
