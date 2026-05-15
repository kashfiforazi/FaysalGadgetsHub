import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { 
  Star, 
  ShoppingCart, 
  ChevronLeft, 
  ShieldCheck, 
  Truck, 
  RotateCcw,
  Plus,
  Minus,
  CheckCircle2,
  Tag
} from 'lucide-react';
import { useShop, CartItem } from '../lib/ShopContext';
import { formatCurrency, cn } from '../lib/utils';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function ProductDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { products, addToCart, checkout, coupons } = useShop();
  const product = products.find(p => p.id === id);

  const [qty, setQty] = useState(1);
  const [orderMode, setOrderMode] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: ''
  });
  const [couponCode, setCouponCode] = useState('');
  const [couponError, setCouponError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);

  if (!product) {
    return (
      <div className="min-h-screen bg-primary text-white flex flex-col items-center justify-center p-6 text-center">
        <h1 className="text-4xl font-display font-black mb-4 italic">Neural Link Lost</h1>
        <p className="text-white/40 mb-8 uppercase tracking-widest font-black">We couldn't find that product in our grid.</p>
        <button 
          onClick={() => navigate('/')}
          className="px-8 py-4 bg-accent text-primary font-black uppercase tracking-widest rounded-2xl glow-cyan hover:scale-105 transition-all"
        >
          Return to Hub
        </button>
      </div>
    );
  }

  const handleAddToCart = () => {
    for (let i = 0; i < qty; i++) {
      addToCart(product);
    }
  };

  const handleBuyNow = () => {
    setOrderMode(true);
  };

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const itemsOverride: CartItem[] = [{ ...product, qty }];
      await checkout({
        ...formData,
        couponCode: couponCode || undefined,
        itemsOverride
      });
      setOrderSuccess(true);
    } catch (e) {
      console.error(e);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-primary text-white selection:bg-accent selection:text-primary">
      <Navbar />

      <main className="pt-32 pb-20 px-6 max-w-7xl mx-auto">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-white/40 hover:text-white transition-colors mb-8 group"
        >
          <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="text-xs font-black uppercase tracking-[0.2em]">Go Back</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          {/* Product Images */}
          <div className="space-y-6">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="glass rounded-[3rem] aspect-square overflow-hidden border border-white/5 flex items-center justify-center bg-white/5"
            >
              <img 
                src={product.img} 
                alt={product.name} 
                className="w-4/5 h-4/5 object-contain"
                referrerPolicy="no-referrer"
              />
            </motion.div>
          </div>

          {/* Product Meta */}
          <div className="space-y-8">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 bg-accent/20 text-accent rounded-full text-[10px] font-black uppercase tracking-widest border border-accent/20">
                  {product.category}
                </span>
                <div className="flex items-center gap-1 text-yellow-500">
                  <Star className="w-4 h-4 fill-yellow-500" />
                  <span className="text-sm font-bold text-white">{product.rating} (128 Neural Reviews)</span>
                </div>
              </div>
              <h1 className="text-5xl font-display font-black leading-tight italic uppercase">{product.name}</h1>
            </div>

            <div className="flex items-baseline gap-4">
              <span className="text-4xl font-black text-white">{formatCurrency(product.price)}</span>
              {product.originalPrice && (
                <span className="text-xl text-white/20 line-through font-black italic">{formatCurrency(product.originalPrice)}</span>
              )}
            </div>

            <p className="text-white/60 leading-relaxed text-lg">
              {product.description || "The next evolution in neural-linked hardware. Engineered for seamless integration with high-velocity data streams. Featuring adaptive cooling and ultra-low latency response protocols."}
            </p>

            {/* Urgency & Delivery Info */}
            <div className="space-y-3 p-6 glass rounded-3xl border-white/5 bg-accent/5">
               <div className="flex items-center gap-3 text-accent">
                  <Truck className="w-5 h-5" />
                  <span className="text-xs font-black uppercase tracking-widest">
                     Est. Landing: <span className="text-white">{new Date(Date.now() + 86400000 * 2).toLocaleDateString('en-US', { day: 'numeric', month: 'short' })} - {new Date(Date.now() + 86400000 * 4).toLocaleDateString('en-US', { day: 'numeric', month: 'short' })}</span>
                  </span>
               </div>
               <div className="flex items-center gap-3 text-red-500">
                  <CheckCircle2 className="w-5 h-5" />
                  <span className="text-xs font-black uppercase tracking-widest">
                     In Stock: <span className="text-white">Only {Math.floor(Math.random() * 8) + 2} units synchronized</span>
                  </span>
               </div>
            </div>

            {/* Qty & Actions */}
            {!orderMode ? (
              <div className="space-y-6">
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-4 bg-white/5 border border-white/10 p-2 rounded-2xl">
                    <button 
                      onClick={() => setQty(Math.max(1, qty - 1))}
                      className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-8 text-center font-black italic text-xl">{qty}</span>
                    <button 
                      onClick={() => setQty(qty + 1)}
                      className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <button 
                    onClick={handleAddToCart}
                    className="flex-1 py-5 bg-white text-primary font-black uppercase tracking-[0.2em] rounded-2xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3"
                  >
                    <ShoppingCart className="w-5 h-5" /> Add to Cart
                  </button>
                  <button 
                    onClick={handleBuyNow}
                    className="flex-1 py-5 bg-accent text-primary font-black uppercase tracking-[0.2em] rounded-2xl glow-cyan hover:scale-[1.02] active:scale-[0.98] transition-all font-display italic text-lg"
                  >
                    Order Now
                  </button>
                </div>
              </div>
            ) : (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass p-8 rounded-[3rem] border-white/5 space-y-6 bg-accent/5"
              >
                {!orderSuccess ? (
                  <>
                    <div className="flex items-center justify-between">
                      <h3 className="text-xl font-display font-black uppercase italic">Deployment Details</h3>
                      <button onClick={() => setOrderMode(false)} className="text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-accent">Cancel</button>
                    </div>

                    <form onSubmit={handleCheckout} className="space-y-4">
                      <div className="space-y-1">
                        <label className="text-[10px] font-black uppercase text-accent tracking-widest">Full Name</label>
                        <input 
                          required
                          value={formData.name}
                          onChange={e => setFormData({ ...formData, name: e.target.value })}
                          placeholder="Cyber Citizen #2049" 
                          className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-6 focus:border-accent outline-none text-sm font-medium"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-black uppercase text-accent tracking-widest">Transmission Number</label>
                        <input 
                          required
                          value={formData.phone}
                          onChange={e => setFormData({ ...formData, phone: e.target.value })}
                          placeholder="+880 1XXX-XXXXXX" 
                          className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-6 focus:border-accent outline-none text-sm font-medium"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-black uppercase text-accent tracking-widest">Deployment Sector (Address)</label>
                        <textarea 
                          required
                          value={formData.address}
                          onChange={e => setFormData({ ...formData, address: e.target.value })}
                          placeholder="Sector 7, Night City" 
                          className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-6 focus:border-accent outline-none text-sm font-medium resize-none"
                          rows={3}
                        />
                      </div>
                      
                      <div className="space-y-1">
                        <label className="text-[10px] font-black uppercase text-accent tracking-widest">Apply Cipher (Coupon)</label>
                        <div className="flex gap-2">
                          <input 
                            value={couponCode}
                            onChange={e => {
                              setCouponCode(e.target.value);
                              setCouponError('');
                            }}
                            placeholder="CODE2024" 
                            className={cn(
                              "flex-1 bg-white/5 border rounded-xl py-3 px-4 focus:outline-none text-sm font-mono transition-colors",
                              couponError ? "border-red-500/50" : "border-white/10 focus:border-accent"
                            )}
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const res = validateCoupon(couponCode, product.price * qty);
                              if (res.valid) {
                                setCouponError(res.message); // Using error state for message for now
                              } else {
                                setCouponError(res.message);
                              }
                            }}
                            className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all"
                          >
                            Apply
                          </button>
                        </div>
                        {couponError && (
                          <p className={cn(
                            "text-[10px] font-black uppercase tracking-widest pl-1",
                            couponError.includes('Success') ? "text-accent" : "text-red-400"
                          )}>
                            {couponError}
                          </p>
                        )}
                      </div>

                      <button 
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full py-5 bg-accent text-primary font-black uppercase tracking-[0.2em] rounded-2xl glow-cyan hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 transition-all font-display italic text-lg shadow-[0_0_30px_rgba(0,229,255,0.3)] mt-4"
                      >
                        {isSubmitting ? 'Transmitting...' : `Confirm Deployment (${formatCurrency(Math.max(0, (product.price * qty) + settings.deliveryCharge - (validateCoupon(couponCode, product.price * qty).valid ? validateCoupon(couponCode, product.price * qty).discountAmount : 0)))})`}
                      </button>
                      <p className="text-[10px] text-white/30 text-center font-black uppercase tracking-widest">Pay on Arrival (Cash on Delivery)</p>
                    </form>
                  </>
                ) : (
                  <div className="text-center py-8 space-y-4">
                    <div className="w-20 h-20 bg-accent rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_40px_rgba(0,229,255,0.4)]">
                      <CheckCircle2 className="w-10 h-10 text-primary" />
                    </div>
                    <h3 className="text-3xl font-display font-black uppercase italic">Neural Uplink Successful</h3>
                    <p className="text-white/60 text-sm max-w-xs mx-auto">Your order #{Math.random().toString(36).substr(2, 9).toUpperCase()} has been dispatched. Track your signal in notifications.</p>
                    <button 
                      onClick={() => navigate('/')}
                      className="mt-6 px-8 py-4 bg-white text-primary font-black uppercase tracking-widest rounded-2xl hover:scale-105 transition-all"
                    >
                      Return to Hub
                    </button>
                  </div>
                )}
              </motion.div>
            )}

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-6 pt-12 border-t border-white/10">
              <div className="flex flex-col items-center text-center gap-3 group">
                <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center group-hover:bg-accent/10 transition-colors">
                  <Truck className="w-6 h-6 text-accent" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest text-white/40 group-hover:text-white transition-colors">Fast Logistics</span>
              </div>
              <div className="flex flex-col items-center text-center gap-3 group">
                <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center group-hover:bg-accent/10 transition-colors">
                  <ShieldCheck className="w-6 h-6 text-accent" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest text-white/40 group-hover:text-white transition-colors">Secure Proto</span>
              </div>
              <div className="flex flex-col items-center text-center gap-3 group">
                <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center group-hover:bg-accent/10 transition-colors">
                  <RotateCcw className="w-6 h-6 text-accent" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest text-white/40 group-hover:text-white transition-colors">Neural Reset</span>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <section className="mt-32 space-y-12">
          <div className="flex items-center gap-4">
            <div className="w-12 h-1 bg-accent rounded-full" />
            <h2 className="font-display text-3xl font-black uppercase tracking-wider italic">User Feedback Loops</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              { author: "Nexus_User_01", text: "Latency is practically zero. Seamless integration with my setup.", rating: 5, date: "2 days ago" },
              { author: "CyberDyne_Dev", text: "The build quality is exceptional. High-grade magnesium alloy chassis.", rating: 4, date: "1 week ago" }
            ].map((rev, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                className="glass p-8 rounded-[2.5rem] border-white/5 space-y-4"
              >
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-accent/20 border border-accent/20 flex items-center justify-center font-black text-accent">{rev.author[0]}</div>
                    <div>
                      <h4 className="font-bold text-sm">{rev.author}</h4>
                      <p className="text-[10px] text-white/20 font-black uppercase tracking-widest">{rev.date}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`w-3 h-3 ${i < rev.rating ? 'text-accent fill-accent' : 'text-white/10'}`} />
                    ))}
                  </div>
                </div>
                <p className="text-white/60 text-sm leading-relaxed italic">"{rev.text}"</p>
              </motion.div>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
