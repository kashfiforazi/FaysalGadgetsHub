import React from 'react';
import { Zap, Shield, Laptop } from 'lucide-react';
import { motion } from 'motion/react';

export default function TrustFeatures() {
  const features = [
    { icon: Zap, label: "Fast Delivery", sub: "Global Shipping" },
    { icon: Shield, label: "Secure Payment", sub: "Buyer Protection" },
    { icon: Laptop, label: "Tech Experts", sub: "Premium Support" }
  ];

  return (
    <section className="py-12 border-t border-white/5 bg-primary/30">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((item, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="flex items-center gap-6 p-8 glass rounded-[2.5rem] border-white/5 hover:border-accent/20 transition-all group"
            >
              <div className="w-16 h-16 rounded-2xl bg-accent/10 flex items-center justify-center text-accent group-hover:scale-110 transition-transform">
                <item.icon className="w-8 h-8" />
              </div>
              <div>
                <h4 className="text-xl font-bold uppercase italic tracking-tighter">{item.label}</h4>
                <p className="text-xs text-white/40 uppercase font-black tracking-widest">{item.sub}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
