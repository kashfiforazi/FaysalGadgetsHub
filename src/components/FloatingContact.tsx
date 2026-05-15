import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageCircle, X, Send, PhoneCall, MessageSquare } from 'lucide-react';
import { useShop } from '../lib/ShopContext';
import { cn } from '../lib/utils';

export default function FloatingContact() {
  const { settings } = useShop();
  const [isOpen, setIsOpen] = useState(false);

  const socialLinks = [
    { 
        name: 'WhatsApp', 
        icon: 'https://cdn-icons-png.flaticon.com/512/3670/3670051.png', 
        url: settings.whatsapp || 'https://wa.me/yournumber',
        color: 'bg-[#25D366]',
        description: 'Instant Support'
    },
    { 
        name: 'Telegram', 
        icon: 'https://cdn-icons-png.flaticon.com/512/2111/2111646.png', 
        url: settings.telegram || 'https://t.me/yourusername',
        color: 'bg-[#0088cc]',
        description: 'Tech Community'
    },
    { 
        name: 'Messenger', 
        icon: 'https://cdn-icons-png.flaticon.com/512/5968/5968771.png', 
        url: settings.messenger || 'https://m.me/yourpage',
        color: 'bg-[#0084FF]',
        description: 'Direct Message'
    }
  ];

  return (
    <div className="fixed bottom-8 right-8 z-[100] flex flex-col items-end gap-4">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20, transformOrigin: 'bottom right' }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="w-72 glass rounded-[2.5rem] border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden mb-2"
          >
            <div className="p-6 bg-gradient-to-br from-accent/20 to-primary/40 border-b border-white/5">
                <h3 className="text-xl font-display font-black uppercase italic leading-none pt-1">Connect <span className="text-accent underline decoration-accent/30 underline-offset-4">Now</span></h3>
                <p className="text-[10px] text-white/40 font-black uppercase tracking-widest mt-2">Neural Support Stream Active</p>
            </div>
            
            <div className="p-4 space-y-2">
              {socialLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 p-3 rounded-2xl hover:bg-white/5 transition-all group"
                >
                  <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center p-2.5 shadow-lg group-hover:scale-110 transition-transform", link.color)}>
                    <img src={link.icon} alt={link.name} className="w-full h-full object-contain" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white group-hover:text-accent transition-colors">{link.name}</div>
                    <div className="text-[9px] text-white/30 font-bold uppercase tracking-widest">{link.description}</div>
                  </div>
                </a>
              ))}
            </div>

            <div className="p-4 bg-white/5 border-t border-white/5 text-center">
               <div className="text-[8px] font-black uppercase tracking-[0.2em] text-white/20">Operational 24/7 • Faysal Gadgets Hub</div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={cn(
          "w-16 h-16 rounded-full flex items-center justify-center shadow-2xl relative z-10 transition-all duration-300 group overflow-hidden",
          isOpen ? 'bg-white text-primary' : 'bg-accent text-primary glow-cyan'
        )}
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
            >
              <X className="w-7 h-7" />
            </motion.div>
          ) : (
            <motion.div
              key="chat"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              className="relative"
            >
              <MessageCircle className="w-7 h-7" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-white rounded-full animate-ping" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  );
}
