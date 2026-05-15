import React from 'react';
import { motion } from 'motion/react';
import { ShoppingCart, Heart, Star, Plus, Eye, ArrowRight } from 'lucide-react';
import { Product } from '../types';
import { formatCurrency } from '../lib/utils';
import { useShop } from '../lib/ShopContext';
import { useNavigate } from 'react-router-dom';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { openProduct, addToCart } = useShop();
  const navigate = useNavigate();

  const handleQuickView = (e: React.MouseEvent) => {
    e.stopPropagation();
    openProduct(product);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product);
  };

  return (
    <motion.div 
      whileHover={{ y: -10 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => openProduct(product)}
      className="group relative glass rounded-[2.5rem] p-4 flex flex-col gap-4 border border-white/5 hover:border-accent/30 transition-all duration-500 overflow-hidden cursor-pointer h-full"
    >
      {/* Discount Badge */}
      {product.originalPrice && (
        <div className="absolute top-6 left-6 z-10 px-3 py-1 rounded-full bg-accent text-primary text-[10px] font-black uppercase tracking-tighter glow-cyan">
          {Math.round((1 - product.price / product.originalPrice) * 100)}% OFF
        </div>
      )}

      {/* Wishlist Button */}
      <motion.button 
        whileTap={{ scale: 0.8 }}
        onClick={(e) => { e.stopPropagation(); }}
        className="absolute top-6 right-6 z-10 p-2 rounded-full glass hover:bg-red-500/20 hover:text-red-500 transition-all group-hover:opacity-100 sm:opacity-0"
      >
        <Heart className="w-4 h-4" />
      </motion.button>

      {/* Image Container */}
      <div className="relative aspect-square rounded-[2rem] bg-white/5 overflow-hidden flex items-center justify-center group-hover:bg-white/10 transition-colors">
        <img 
          src={product.img} 
          alt={product.name} 
          className="w-4/5 h-4/5 object-contain group-hover:scale-110 transition-transform duration-500"
          referrerPolicy="no-referrer"
        />
      </div>

      {/* Info */}
      <div className="px-2 pb-2">
        <div className="flex items-center justify-between mb-1">
          <span className="text-[10px] font-bold text-accent uppercase tracking-widest">{product.category}</span>
          <div className="flex items-center gap-1">
            <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
            <span className="text-[10px] font-bold">{product.rating}</span>
          </div>
        </div>
        
        <h3 className="font-display text-lg font-bold truncate mb-3">{product.name}</h3>
        
        <div className="flex items-center justify-between border-t border-white/5 pt-4">
          <div className="flex flex-col">
            <span className="text-xl font-black">{formatCurrency(product.price)}</span>
            {product.originalPrice && (
              <span className="text-xs text-white/30 line-through">{formatCurrency(product.originalPrice)}</span>
            )}
          </div>
          
          <div className="flex gap-2">
            <motion.button 
              whileTap={{ scale: 0.9 }}
              onClick={handleQuickView}
              className="w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 transition-all flex items-center justify-center text-white/40 hover:text-white"
              title="Quick View"
            >
              <Eye className="w-4 h-4" />
            </motion.button>
            <motion.button 
              whileTap={{ scale: 0.9 }}
              onClick={handleAddToCart}
              className="px-4 h-10 rounded-xl bg-accent text-primary hover:scale-105 transition-all flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest shadow-lg shadow-accent/20"
            >
              <ShoppingCart className="w-3.5 h-3.5" /> Buy
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
