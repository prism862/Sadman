import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

export default function Intro({ onComplete }: { onComplete: () => void }) {
  const [isTapped, setIsTapped] = useState(false);

  const handleTap = () => {
    setIsTapped(true);
    setTimeout(onComplete, 1200);
  };

  return (
    <div className="fixed inset-0 z-[100] bg-[#050505] flex items-center justify-center overflow-hidden cursor-pointer" onClick={handleTap}>
      <AnimatePresence mode="wait">
        {!isTapped ? (
          <motion.div
            key="prism-container"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.5, filter: 'blur(20px)' }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            className="relative flex flex-col items-center"
          >
            {/* Aesthetic Prism SVG */}
            <motion.div
              animate={{ 
                rotateY: [0, 360],
                y: [0, -10, 0]
              }}
              transition={{ 
                rotateY: { duration: 8, repeat: Infinity, ease: "linear" },
                y: { duration: 4, repeat: Infinity, ease: "easeInOut" }
              }}
              className="w-48 h-48 md:w-64 md:h-64 relative preserve-3d"
            >
              <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_0_30px_rgba(121,40,202,0.4)]">
                <defs>
                  <linearGradient id="prism-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#7928ca" stopOpacity="0.8" />
                    <stop offset="50%" stopColor="#0070f3" stopOpacity="0.6" />
                    <stop offset="100%" stopColor="#ffffff" stopOpacity="0.4" />
                  </linearGradient>
                </defs>
                <motion.path
                  d="M50 10 L90 85 L10 85 Z"
                  fill="url(#prism-grad)"
                  stroke="white"
                  strokeWidth="0.5"
                  strokeOpacity="0.3"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 2, ease: "easeInOut" }}
                />
                <motion.path
                  d="M50 10 L50 85"
                  stroke="white"
                  strokeWidth="0.2"
                  strokeOpacity="0.2"
                />
              </svg>
              
              {/* Refraction Lines */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                {[...Array(3)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-full h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent"
                    animate={{ 
                      rotate: [0, 360],
                      scale: [1, 1.5, 1],
                      opacity: [0.1, 0.3, 0.1]
                    }}
                    transition={{ 
                      duration: 5 + i, 
                      repeat: Infinity, 
                      ease: "linear" 
                    }}
                  />
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 1 }}
              className="mt-12 text-center"
            >
              <h1 className="text-4xl md:text-6xl font-display font-bold tracking-[0.2em] text-white mb-4">
                PRISM
              </h1>
              <motion.p
                animate={{ opacity: [0.3, 0.7, 0.3] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="text-white/40 font-mono text-xs uppercase tracking-[0.4em]"
              >
                Tap to Enter
              </motion.p>
            </motion.div>
          </motion.div>
        ) : (
          <motion.div
            key="flash"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-white z-[110]"
            transition={{ duration: 0.4 }}
          />
        )}
      </AnimatePresence>

      {/* Background Ambient Light */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            x: [0, 50, 0],
            y: [0, -50, 0]
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-1/2 -left-1/2 w-full h-full bg-prism-start/5 blur-[120px] rounded-full"
        />
        <motion.div 
          animate={{ 
            scale: [1, 1.3, 1],
            x: [0, -30, 0],
            y: [0, 40, 0]
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-prism-end/5 blur-[120px] rounded-full"
        />
      </div>
    </div>
  );
}
