import React from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { useApp } from '../AppContext';
import { formatPrice } from '../lib/utils';
import SmoothImage from './SmoothImage';
import { fadeInUp, staggerContainer, staggerItem } from '../constants/animations';

export default function RecentlyViewed() {
  const { recentlyViewed, products } = useApp();

  const viewedProducts = recentlyViewed
    .map(id => products.find(p => p.id === id))
    .filter((p): p is NonNullable<typeof p> => !!p);

  if (viewedProducts.length === 0) return null;

  return (
    <section className="mt-40 pb-20 border-t border-white/5 pt-20">
      <motion.div
        variants={fadeInUp}
        initial="initial"
        whileInView="animate"
        viewport={{ once: true }}
        className="mb-12"
      >
        <h2 className="text-3xl font-display font-black uppercase tracking-tighter">
          Recently <span className="prism-text">Viewed</span>
        </h2>
        <p className="text-white/30 text-[10px] uppercase tracking-[0.4em] mt-2">
          Pieces you've explored in this spectrum
        </p>
      </motion.div>

      <motion.div
        variants={staggerContainer}
        initial="initial"
        whileInView="animate"
        viewport={{ once: true }}
        className="grid grid-cols-2 md:grid-cols-5 gap-6"
      >
        {viewedProducts.map((product) => (
          <motion.div
            key={product.id}
            variants={staggerItem}
            className="group"
          >
            <Link to={`/product/${product.id}`} className="block">
              <div className="relative aspect-[2/3] overflow-hidden rounded-2xl glass border-white/5 mb-4">
                <SmoothImage
                  src={product.images[0]}
                  alt={product.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  containerClassName="w-full h-full"
                  loading="lazy"
                />
              </div>
              <h3 className="text-[10px] font-bold uppercase tracking-tight group-hover:prism-text transition-colors truncate">
                {product.title}
              </h3>
              <p className="text-[10px] font-mono text-white/40 mt-1">
                {formatPrice(product.price)}
              </p>
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
