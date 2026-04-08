import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface SmoothImageProps {
  src?: string;
  alt?: string;
  className?: string;
  containerClassName?: string;
  loading?: "lazy" | "eager";
  [key: string]: any;
}

export default function SmoothImage({ src, alt, className, containerClassName, loading, ...props }: SmoothImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div className={`relative overflow-hidden ${containerClassName}`}>
      <AnimatePresence>
        {!isLoaded && (
          <motion.div
            key="skeleton"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-white/5 animate-pulse"
          />
        )}
      </AnimatePresence>
      <motion.img
        src={src}
        alt={alt}
        loading={loading}
        initial={{ opacity: 0, scale: 1.05 }}
        animate={{ 
          opacity: isLoaded ? 1 : 0,
          scale: isLoaded ? 1 : 1.05
        }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        onLoad={() => setIsLoaded(true)}
        className={className}
        referrerPolicy="no-referrer"
        {...props}
      />
    </div>
  );
}
