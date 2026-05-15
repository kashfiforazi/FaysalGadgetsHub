import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ShoppingCart, Zap, Star, Shield, Truck, RotateCcw, Package } from 'lucide-react';
import { formatCurrency } from '../lib/utils';
import { Product, useShop } from '../lib/ShopContext';
import { auth } from '../lib/firebase';

interface ProductModalProps {
  product: Product | null;
  onClose: () => void;
}

export default function ProductModal({ product, onClose }: ProductModalProps) {
  const { addToCart, checkout, userProfile } = useShop();
  const [isCheckout, setIsCheckout] = useState(false);
  const [isOrdered, setIsOrdered] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');

  React.useEffect(() => {
    if (userProfile) {
      setName(userProfile.name || auth.currentUser?.displayName || '');
      setEmail(auth.currentUser?.email || '');
      setPhone(userProfile.phone || '');
      setAddress(userProfile.address || '');
    }
  }, [userProfile]);
  
  if (!product) return null;

  const handleOrder = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    const details = {
      name,
      email,
      address,
      phone,
      itemsOverride: [{ ...product, qty: 1 }]
    };

    try {
      await checkout(details);
      setIsOrdered(true);
      setTimeout(() => {
        onClose();
        setIsOrdered(false);
        setIsCheckout(false);
      }, 3000);
    } catch (err) {
      console.error(err);
      alert("Checkout failed. Please ensure you are logged in.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddToCart = () => {
    addToCart(product);
    onClose();
  };

  return (
    <AnimatePresence>
      {product && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 bg-black/80 backdrop-blur-md">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 40 }}
            className="w-full max-w-4xl glass rounded-[3rem] overflow-hidden relative flex flex-col md:flex-row max-h-[90vh]"
          >
            <button 
              onClick={onClose}
              className="absolute top-6 right-6 p-2 rounded-full bg-black/20 hover:bg-white/10 transition-colors z-20"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Left: Media */}
            <div className="w-full md:w-1/2 bg-white/5 p-12 flex items-center justify-center relative overflow-hidden shrink-0">
               <div className="absolute top-0 left-0 w-full h-full bg-accent/5 blur-3xl -z-10" />
               <motion.img 
                layoutId={`img-${product.id}`}
                src={product.img} 
                alt={product.name} 
                className="w-full h-full object-contain drop-shadow-[0_20px_50px_rgba(0,229,255,0.3)]" 
                referrerPolicy="no-referrer"
               />
            </div>

            {/* Right: Content */}
            <div className="flex-1 p-10 md:p-12 overflow-y-auto scrollbar-hide">
              <AnimatePresence mode="wait">
                {isOrdered ? (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="h-full flex flex-col items-center justify-center text-center py-20"
                  >
                    <div className="w-20 h-20 bg-green-400/20 rounded-3xl flex items-center justify-center text-green-400 mb-6 glow-cyan">
                       <Package className="w-10 h-10" />
                    </div>
                    <h2 className="text-3xl font-display font-black mb-2">Signal Received</h2>
                    <p className="text-white/40">Your acquisition request is being processed. Tracking link sent to your neural link.</p>
                  </motion.div>
                ) : isCheckout ? (
                  <motion.div 
                    key="checkout"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                  >
                    <h2 className="text-2xl font-display font-black mb-2">Finalize <span className="text-accent">Acquisition</span></h2>
                    <p className="text-sm text-white/40 mb-8 border-b border-white/5 pb-4">Secure encrypted checkout for {product.name}</p>
                    
                    <form onSubmit={handleOrder} className="space-y-6">
                       <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                             <label className="text-[10px] font-black uppercase text-white/40 ml-4">Full Codename</label>
                             <input 
                               required 
                               type="text" 
                               value={name}
                               onChange={(e) => setName(e.target.value)}
                               placeholder="John Doe" 
                               className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 focus:outline-none focus:border-accent/40" 
                             />
                          </div>
                          <div className="space-y-2">
                             <label className="text-[10px] font-black uppercase text-white/40 ml-4">Email (Optional)</label>
                             <input 
                               type="email" 
                               value={email}
                               onChange={(e) => setEmail(e.target.value)}
                               placeholder="john@example.com" 
                               className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 focus:outline-none focus:border-accent/40" 
                             />
                          </div>
                       </div>
                       <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase text-white/40 ml-4">Neural Voice Link (Phone)</label>
                          <input 
                            required 
                            type="tel" 
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder="+880 1234 567890" 
                            className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 focus:outline-none focus:border-accent/40" 
                          />
                       </div>
                       <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase text-white/40 ml-4">Physical Sector Address</label>
                          <textarea 
                            required 
                            rows={3} 
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            placeholder="Building, Street, Sector..." 
                            className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 focus:outline-none focus:border-accent/40 resize-none" 
                          />
                       </div>
                       
                       <div className="flex gap-4 pt-4">
                          <button 
                            type="button" 
                            onClick={() => setIsCheckout(false)}
                            className="flex-1 py-4 rounded-2xl bg-white/5 hover:bg-white/10 font-bold transition-all"
                          >
                            Back to Intel
                          </button>
                          <button 
                            type="submit"
                            disabled={isSubmitting}
                            className="flex-2 py-4 rounded-2xl bg-accent text-primary font-black uppercase tracking-widest glow-cyan hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
                          >
                            {isSubmitting ? "Processing..." : "Execute Order"}
                          </button>
                       </div>
                    </form>
                  </motion.div>
                ) : (
                  <motion.div
                    key="details"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                  >
                    <div className="flex items-center gap-2 text-accent font-black uppercase tracking-[0.2em] text-[10px] mb-4">
                       <Shield className="w-4 h-4" /> Verified Gadget
                    </div>
                    <h2 className="text-4xl font-display font-black mb-4 leading-tight">{product.name}</h2>
                    <div className="flex items-center gap-6 mb-8">
                       <div className="text-3xl font-black text-white">{formatCurrency(product.price)}</div>
                       <div className="flex items-center gap-1 text-yellow-400 bg-yellow-400/10 px-3 py-1 rounded-full border border-yellow-400/20">
                          <Star className="w-3 h-3 fill-current" />
                          <span className="text-xs font-bold">{product.rating} (128 reviews)</span>
                       </div>
                    </div>
                    
                    <div className="space-y-6 mb-10">
                       <p className="text-sm text-white/50 leading-relaxed">
                          The {product.name} represents the next evolution in {product.category.toLowerCase()} technology. 
                          Built with aerospace-grade materials and powered by our proprietary neural engine, 
                          it delivers performance that defies traditional physics.
                       </p>
                       <div className="grid grid-cols-2 gap-4">
                          <div className="flex items-center gap-3 text-xs font-bold text-white/50">
                             <Truck className="w-4 h-4 text-accent" /> Global Shipping
                          </div>
                          <div className="flex items-center gap-3 text-xs font-bold text-white/50">
                             <RotateCcw className="w-4 h-4 text-accent" /> 30-Day Recovery
                          </div>
                       </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4">
                       <button 
                        onClick={handleAddToCart}
                        className="flex-1 py-4 rounded-2xl bg-white/5 hover:bg-white/10 font-bold flex items-center justify-center gap-2 border border-white/10 active:scale-95 transition-all"
                       >
                          <ShoppingCart className="w-5 h-5" /> Add to Cart
                       </button>
                       <button 
                        onClick={() => setIsCheckout(true)}
                        className="flex-1 py-4 rounded-2xl bg-accent text-primary font-black uppercase tracking-widest text-sm shadow-xl glow-cyan active:scale-95 transition-shadow flex items-center justify-center gap-2"
                       >
                          <Zap className="w-5 h-5" /> Buy Now
                       </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
