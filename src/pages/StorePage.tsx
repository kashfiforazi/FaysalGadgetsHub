import React, { useState, useEffect } from 'react';
import { Search, Filter, ShoppingCart, Star, Zap } from 'lucide-react';
import { motion } from 'motion/react';
import { formatCurrency, cn } from '../lib/utils';
import ProductModal from '../components/ProductModal';
import ProductCard from '../components/ProductCard';
import { useLocation } from 'react-router-dom';

import { useShop } from '../lib/ShopContext';

export default function StorePage() {
  const { products, categories, openProduct, addToCart } = useShop();
  const [searchQuery, setSearchQuery] = useState('');
  const location = useLocation();
  const [selectedCategory, setSelectedCategory] = useState('All');

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const type = params.get('type');
    if (type) {
      const catMatch = categories.find(c => c.slug === type);
      if (catMatch) {
         setSelectedCategory(catMatch.name);
      } else {
         // Fallback for hardcoded slugs
         const capitalized = type.charAt(0).toUpperCase() + type.slice(1);
         setSelectedCategory(capitalized);
      }
    }
  }, [location.search, categories]);

  const displayCategories = ['All', ...categories.map(c => c.name)];
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100000]);
  const [isPageLoading, setIsPageLoading] = useState(true);

  useEffect(() => {
    // Simulate initial load for skeleton beauty
    const timer = setTimeout(() => setIsPageLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const filteredProducts = products.filter(p => {
    const term = searchQuery.toLowerCase();
    const nameMatches = p.name.toLowerCase().includes(term);
    const priceMatches = p.price >= priceRange[0] && p.price <= priceRange[1];
    
    if (selectedCategory === 'All') return nameMatches && priceMatches;
    
    const selectedCatObj = categories.find(c => c.name === selectedCategory);
    const catLower = p.category.toLowerCase();
    const selLower = selectedCategory.toLowerCase();
    
    const categoryMatches = catLower === selLower || 
                           (selectedCatObj && catLower === selectedCatObj.slug.toLowerCase());
    
    return categoryMatches && nameMatches && priceMatches;
  });

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-12">
        <div>
          <h1 className="text-5xl font-display font-black leading-tight mb-2 uppercase italic tracking-tighter">Neural <span className="text-accent underline decoration-accent/30 underline-offset-8 decoration-8 pt-4 block sm:inline">Inventory</span></h1>
          <p className="text-white/40 font-medium">Explore our curated collection of bleeding-edge gadgets available in the Hub.</p>
        </div>
        <div className="w-full max-w-md space-y-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
            <input 
              type="text" 
              placeholder="Search our neural network..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 pl-12 pr-4 focus:outline-none focus:border-accent/40 transition-colors placeholder:text-white/10 font-medium"
            />
          </div>
          <div className="flex items-center gap-4 px-2">
            <span className="text-[10px] font-black uppercase text-white/20 whitespace-nowrap">Price Range</span>
            <input 
              type="range" 
              min="0" 
              max="100000" 
              step="1000"
              value={priceRange[1]}
              onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
              className="flex-1 accent-accent h-1 bg-white/5 rounded-full appearance-none cursor-pointer"
            />
            <span className="text-[10px] font-black text-accent">{formatCurrency(priceRange[1])}</span>
          </div>
        </div>
      </div>

      <div className="flex gap-4 mb-12 overflow-x-auto pb-4 scrollbar-hide">
        {displayCategories.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={cn(
              "px-8 py-3 rounded-full text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap",
              selectedCategory.toLowerCase() === cat.toLowerCase() ? "bg-accent text-primary shadow-xl shadow-accent/20 scale-105" : "bg-white/5 border border-white/10 hover:bg-white/10 text-white/40"
            )}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {isPageLoading ? (
          [...Array(8)].map((_, i) => (
            <div key={i} className="glass rounded-[2.5rem] p-6 space-y-6">
              <div className="aspect-square bg-white/5 animate-pulse rounded-3xl" />
              <div className="space-y-3">
                <div className="h-4 w-20 bg-white/5 animate-pulse rounded-full" />
                <div className="h-6 w-full bg-white/5 animate-pulse rounded-full" />
                <div className="h-8 w-1/2 bg-white/5 animate-pulse rounded-full" />
              </div>
            </div>
          ))
        ) : filteredProducts.map((product, i) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: i * 0.05 }}
          >
            <ProductCard product={product} />
          </motion.div>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center py-20 glass rounded-[3rem] border-white/5">
           <Zap className="w-16 h-16 text-white/5 mx-auto mb-6" />
           <p className="text-white/20 font-black uppercase tracking-[0.4em] text-sm">Target not found in inventory</p>
        </div>
      )}
    </div>
  );
}
