import React from 'react';
import { motion } from 'motion/react';

export default function TopBanner() {
  const marqueeText = "PRISM\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0•\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0LIVE NOW\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0•\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0";

  return (
    <div className="fixed top-0 left-0 w-full h-8 bg-prism-mid overflow-hidden flex items-center z-[60] pointer-events-none">
      <motion.div
        initial={{ x: "0%" }}
        animate={{ x: "-50%" }}
        transition={{
          duration: 100,
          repeat: Infinity,
          ease: "linear",
        }}
        className="flex whitespace-nowrap will-change-transform"
      >
        <div className="flex items-center">
          {[...Array(20)].map((_, i) => (
            <span key={i} className="text-[10px] font-bold uppercase tracking-[0.3em] text-white">
              {marqueeText}
            </span>
          ))}
        </div>
        <div className="flex items-center">
          {[...Array(20)].map((_, i) => (
            <span key={i} className="text-[10px] font-bold uppercase tracking-[0.3em] text-white">
              {marqueeText}
            </span>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
