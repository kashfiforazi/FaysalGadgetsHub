import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { useShop } from '../lib/ShopContext';

export default function BannerSlider() {
  const { banners } = useShop();
  const [current, setCurrent] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    if (banners.length === 0) return;
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [banners.length]);

  if (banners.length === 0) return null;

  const next = () => setCurrent((prev) => (prev + 1) % banners.length);
  const prev = () => setCurrent((prev) => (prev - 1 + banners.length) % banners.length);

  return (
    <div className="relative w-full max-w-7xl mx-auto px-6 mb-20 group">
      <div className="relative h-[250px] md:h-[450px] overflow-hidden rounded-[2.5rem] glass border-white/10 shadow-2xl">
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.8, ease: "circOut" }}
            className="absolute inset-0 cursor-pointer"
            onClick={() => navigate(banners[current].link || '/shop')}
          >
            <img 
              src={banners[current].image} 
              alt={banners[current].title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[3s]"
              referrerPolicy="no-referrer"
            />
          </motion.div>
        </AnimatePresence>

        {/* Indicators */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex gap-2">
          {banners.map((_, i) => (
            <button 
              key={i}
              onClick={(e) => { e.stopPropagation(); setCurrent(i); }}
              className={`h-1 transition-all rounded-full ${current === i ? 'w-10 bg-accent shadow-[0_0_10px_rgba(0,229,255,0.8)]' : 'w-4 bg-white/10'}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
