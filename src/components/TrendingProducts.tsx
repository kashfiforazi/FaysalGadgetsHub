import React from 'react';
import { motion } from 'motion/react';
import ProductCard from './ProductCard';
import { Product } from '../types';

import { useShop } from '../lib/ShopContext';

export default function TrendingProducts() {
  const { products } = useShop();
  const trendingProducts = products.filter(p => p.isTrending).slice(0, 4);

  if (products.length === 0) return null;

  const displayProducts = trendingProducts.length > 0 ? trendingProducts : products.slice(0, 4);

  return (
    <section id="trending" className="py-20 max-w-7xl mx-auto px-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div className="space-y-4">
          <h2 className="font-display text-4xl font-black italic uppercase">
            Neural <span className="text-accent underline decoration-accent/30 underline-offset-8">Pulse</span>
          </h2>
          <p className="text-white/50 max-w-sm">
            The most sought-after tech pieces of the season, selected for peak performance.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {displayProducts.map((product, i) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            viewport={{ once: true }}
          >
            <ProductCard product={product} />
          </motion.div>
        ))}
      </div>
    </section>
  );
}
