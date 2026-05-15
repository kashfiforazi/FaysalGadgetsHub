import React, { useState, useEffect } from 'react';
import { useShop, Product } from '../lib/ShopContext';
import ProductCard from '../components/ProductCard';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Hash, Star, LayoutGrid, Layers, Filter, ArrowLeft, ChevronRight } from 'lucide-react';
import { cn } from '../lib/utils';
import { useLocation, useNavigate } from 'react-router-dom';

export default function CategoryPage() {
  const { categories } = useShop();
  const [searchQuery, setSearchQuery] = useState('');

  const navigate = useNavigate();

  const handleCategoryClick = (catSlug: string) => {
    navigate(`/shop?type=${catSlug}`);
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <motion.div 
        key="category-list"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-16"
      >
        {/* Search Bar Only Header */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 bg-white/5 p-8 rounded-[2.5rem] border border-white/5 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-96 h-96 bg-accent/10 blur-[120px] rounded-full -mr-48 -mt-48" />
          
          <div className="relative">
            <h2 className="text-2xl font-display font-black uppercase italic italic tracking-tighter">Inventory <span className="text-accent underline decoration-accent/30 underline-offset-4">Sectors</span></h2>
          </div>

          <div className="relative w-full lg:max-w-md">
             <div className="glass p-2 rounded-2xl border-white/10">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-accent" />
                  <input 
                    type="text" 
                    placeholder="Search all sectors..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-primary/40 border border-white/5 rounded-xl py-3 pl-10 pr-6 focus:border-accent outline-none text-xs font-bold uppercase tracking-widest transition-all"
                  />
                </div>
             </div>
          </div>
        </div>

        {/* Category Grid View */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
           {/* All Categories Option */}
           <button 
             onClick={() => navigate('/shop')}
             className="group relative aspect-[16/9] rounded-[3rem] overflow-hidden border border-white/5 hover:border-accent/40 transition-all duration-500 shadow-2xl"
           >
             <div className="absolute inset-0 bg-gradient-to-tr from-accent/20 to-primary transition-opacity group-hover:opacity-80" />
             <div className="absolute inset-0 flex flex-col items-center justify-center p-8 gap-4 text-center">
                <div className="w-16 h-16 rounded-3xl bg-white/10 backdrop-blur-md flex items-center justify-center group-hover:scale-110 transition-transform">
                   <LayoutGrid className="w-8 h-8 text-accent" />
                </div>
                <div>
                  <h3 className="text-3xl font-display font-black italic uppercase italic">Complete <span className="text-accent">Nexus</span></h3>
                  <p className="text-[10px] font-black uppercase tracking-widest text-white/40 opacity-0 group-hover:opacity-100 transition-opacity">Access Unified Inventory</p>
                </div>
             </div>
           </button>

           {categories.filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase())).map((cat, i) => {
             const catImage = cat.image || `https://images.unsplash.com/photo-1${550000000000 + i}?auto=format&fit=crop&q=80&w=800`;
             return (
               <button 
                 key={cat.id}
                 onClick={() => handleCategoryClick(cat.slug)}
                 className="group relative aspect-[16/9] rounded-[3rem] overflow-hidden border border-white/5 hover:border-accent/40 transition-all duration-500 shadow-2xl"
               >
                 <img 
                   src={catImage} 
                   className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 grayscale group-hover:grayscale-0 opacity-40 group-hover:opacity-60" 
                   referrerPolicy="no-referrer"
                 />
                 <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/40 to-transparent group-hover:from-accent/20 transition-all" />
                 
                 <div className="absolute inset-0 flex flex-col justify-end p-8 gap-1">
                    <div className="flex items-center gap-2 mb-2">
                       <div className="w-8 h-[2px] bg-accent group-hover:w-12 transition-all" />
                       <span className="text-[10px] font-black uppercase tracking-widest text-accent">Section #{i.toString().padStart(2, '0')}</span>
                    </div>
                    <h3 className="text-3xl font-display font-black italic uppercase italic group-hover:translate-x-2 transition-transform duration-500">
                      {cat.name}
                    </h3>
                    <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-white/40 opacity-0 group-hover:opacity-100 transition-all translate-y-4 group-hover:translate-y-0">
                       Initialize Access <ChevronRight className="w-3 h-3" />
                    </div>
                 </div>
               </button>
             );
           })}
        </div>
      </motion.div>
    </div>
  );
}
