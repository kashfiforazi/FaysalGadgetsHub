import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Zap } from 'lucide-react';
import { useShop } from '../lib/ShopContext';
import { useNavigate } from 'react-router-dom';

export default function FlashSalePopup() {
  const { flashSales } = useShop();
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);
  const activeSale = flashSales.find(s => s.isActive);

  useEffect(() => {
    if (activeSale) {
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 1500); // Show shorter delay
      return () => clearTimeout(timer);
    }
  }, [activeSale]);

  const handleClose = () => {
    setIsVisible(false);
  };

  const handleAction = () => {
    if (activeSale?.link) {
      navigate(activeSale.link);
    }
    handleClose();
  };

  if (!activeSale) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-6 sm:p-2 bg-black/80 backdrop-blur-md">
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 50 }}
            className="relative w-full max-w-lg glass rounded-[3rem] overflow-hidden border-2 border-accent/20 shadow-[0_0_50px_rgba(0,229,255,0.2)]"
          >
            <button 
              onClick={handleClose}
              className="absolute top-6 right-6 p-2 bg-black/50 hover:bg-white/10 rounded-full text-white z-20 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="flex flex-col">
              <div className="h-64 relative overflow-hidden">
                <img src={activeSale.image} alt="Flash Sale" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/20 to-transparent" />
                <div className="absolute bottom-6 left-8 flex items-center gap-3">
                  <div className="bg-accent p-2 rounded-xl animate-pulse">
                     <Zap className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-3xl font-display font-black uppercase text-white tracking-widest italic leading-none drop-shadow-lg">
                    Flash Alert
                  </h3>
                </div>
              </div>

              <div className="p-10 text-center space-y-6">
                <div>
                  <h2 className="text-4xl font-display font-black mb-3 uppercase tracking-tighter leading-none italic">
                    {activeSale.title}
                  </h2>
                  <p className="text-white/50 text-sm font-medium leading-relaxed max-w-sm mx-auto">
                    {activeSale.description || "Experimental neural tech drop. Limited units synchronized with the mainframe. Deploy now."}
                  </p>
                </div>

                <button 
                  onClick={handleAction}
                  className="w-full py-5 bg-accent text-primary font-black uppercase tracking-[0.2em] rounded-2xl glow-cyan hover:scale-[1.02] active:scale-[0.98] transition-all font-display italic text-lg"
                >
                  {activeSale.buttonText || "Initialize Acquisition"}
                </button>

                <p className="text-[10px] text-white/20 font-black uppercase tracking-[0.3em]">
                  Universal Protocol // Session Limited
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
