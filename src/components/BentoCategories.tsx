import React from 'react';
import { motion } from 'motion/react';
import { Smartphone, Laptop, Watch, Gamepad, Headphones, Monitor, Home, ChevronRight, LayoutGrid, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useShop } from '../lib/ShopContext';
import { cn } from '../lib/utils';

const ICON_MAP: Record<string, any> = {
  Smartphone, Laptop, Watch, Gamepad, Headphones, Monitor, Home
};

export default function BentoCategories() {
  const { categories } = useShop();

  const displayCategories = categories.map((cat, i) => ({
    name: cat.name,
    slug: cat.slug,
    icon: ICON_MAP[cat.icon || ''] || LayoutGrid,
    color: i % 2 === 0 ? 'from-blue-500/20 to-cyan-500/20' : 'from-purple-500/20 to-pink-500/20',
    img: cat.image || `https://images.unsplash.com/photo-15${550000000000 + i}?auto=format&fit=crop&q=80&w=600` // Use category image or placeholder
  }));

  if (categories.length === 0) {
    return null; 
  }

  return (
    <section id="categories" className="py-20 max-w-7xl mx-auto px-6">
      <div className="flex items-center gap-4 mb-12">
        <div className="w-12 h-1 bg-accent rounded-full" />
        <h2 className="font-display text-3xl font-black uppercase tracking-wider italic">Featured Categories</h2>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {displayCategories.map((cat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.05 }}
            className="group relative overflow-hidden bento-card aspect-square rounded-[3rem]"
          >
            <Link to={`/category?type=${cat.slug}`} className="absolute inset-0 z-20 flex flex-col justify-end p-8">
              {/* Background Image with Overlay */}
              <div className="absolute inset-0 z-0">
                <img 
                  src={cat.img} 
                  className="w-full h-full object-cover opacity-20 group-hover:opacity-40 group-hover:scale-110 transition-all duration-700" 
                  alt={cat.name}
                  referrerPolicy="no-referrer"
                />
                <div className={cn("absolute inset-0 bg-gradient-to-t via-primary/20 to-transparent", cat.color)} />
              </div>

              <div className="relative z-10 flex flex-col gap-2">
                <cat.icon className="w-8 h-8 text-accent mb-2" />
                <h3 className="font-display text-xl md:text-2xl font-black uppercase italic leading-tight">
                  {cat.name}
                </h3>
                <p className="text-xs text-white/40 font-semibold group-hover:text-white transition-colors flex items-center gap-1">
                  Shop Collection <ChevronRight className="w-3 h-3 translate-x-0 group-hover:translate-x-1 transition-transform" />
                </p>
              </div>

              <div className="absolute top-6 right-6 p-2 rounded-full glass opacity-0 group-hover:opacity-100 transition-opacity">
                <Plus className="w-4 h-4" />
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
