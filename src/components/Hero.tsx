import React, { Suspense } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Sparkles, Zap, Shield, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '../lib/utils';
import Gadget3D from './Gadget3D';

export default function Hero() {
  const navigate = useNavigate();

  return (
    <section className="relative pt-0 pb-16 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 items-center gap-12">
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true }}
           transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-[2px] bg-accent" />
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-accent">Tech Revolution</span>
          </div>

          <h1 className="font-display text-5xl lg:text-8xl font-extrabold leading-[1.05] mb-8 flex flex-col">
            <span className="text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]">Smart Choice</span>
            <span className="bg-gradient-to-r from-accent via-glow to-accent bg-clip-text text-transparent italic font-black pb-2">For Smart People</span>
          </h1>
          
          <p className="text-lg lg:text-xl text-white/50 mb-10 max-w-lg leading-relaxed border-l-2 border-accent/20 pl-6 backdrop-blur-sm">
            Discover precision-engineered gadgets and premium accessories designed for those who demand the future, today.
          </p>

          <div className="flex flex-wrap gap-4">
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/shop')}
              className="group relative px-12 py-6 rounded-2xl bg-accent text-primary font-black uppercase tracking-[0.2em] text-sm transition-all flex items-center gap-4 shadow-[0_0_50px_rgba(0,229,255,0.4)] overflow-hidden"
            >
              <div className="absolute inset-0 bg-white/30 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
              <div className="absolute -inset-1 bg-gradient-to-r from-accent via-white/20 to-accent animate-[pulse_2s_infinite] opacity-30" />
              <span className="relative z-10 flex items-center gap-3">
                Shop Now <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform duration-300" />
              </span>
            </motion.button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="relative"
        >
          {/* Main Hero Image / 3D Canvas */}
          <div className="relative aspect-square rounded-[3rem] overflow-hidden glass border-white/10 flex items-center justify-center">
            <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-primary/80 to-transparent z-10 pointer-events-none" />
            
            <Suspense fallback={<Loader2 className="w-12 h-12 text-accent animate-spin" />}>
              <Gadget3D />
            </Suspense>
            
            {/* Floating Badges */}
            <motion.div 
               animate={{ y: [0, -10, 0] }}
               transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
               className="absolute top-12 -left-4 glass p-4 rounded-2xl shadow-2xl z-20 border-white/10"
            >
              <div className="text-[10px] text-white/50 font-bold uppercase mb-1">Live Demo</div>
              <div className="text-sm font-extrabold uppercase">Interactive Core</div>
            </motion.div>

            <motion.div 
               animate={{ y: [0, 10, 0] }}
               transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
               className="absolute bottom-12 -right-4 glass p-4 rounded-2xl shadow-2xl z-20 border-accent/20"
            >
              <div className="text-xl font-display font-black text-accent">3D TECH</div>
              <div className="text-[10px] text-white/50 font-bold uppercase">Explore in 360°</div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}


function Cpu({ className }: { className?: string }) {
  return (
    <svg 
      className={className} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <rect x="4" y="4" width="16" height="16" rx="2" ry="2"/>
      <path d="M9 9h6v6H9z"/>
      <path d="M9 1v3"/>
      <path d="M15 1v3"/>
      <path d="M9 20v3"/>
      <path d="M15 20v3"/>
      <path d="M20 9h3"/>
      <path d="M20 15h3"/>
      <path d="M1 9h3"/>
      <path d="M1 15h3"/>
    </svg>
  );
}
