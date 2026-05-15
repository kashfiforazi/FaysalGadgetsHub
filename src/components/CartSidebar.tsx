import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ShoppingBag, Trash2, ChevronRight, Plus, Minus, CreditCard, Loader2 } from 'lucide-react';
import { formatCurrency, cn } from '../lib/utils';
import { useShop } from '../lib/ShopContext';
import { auth } from '../lib/firebase';

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartSidebar({ isOpen, onClose }: CartSidebarProps) {
  const { cart, removeFromCart, updateCartQty, settings, checkout, isLoading, userProfile, validateCoupon } = useShop();
  const [isCheckingOut, setIsCheckingOut] = React.useState(false);
  const [isProcessing, setIsProcessing] = React.useState(false);
  const [checkoutSuccess, setCheckoutSuccess] = React.useState(false);
  const [address, setAddress] = React.useState('');
  const [phone, setPhone] = React.useState('');
  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [couponCode, setCouponCode] = React.useState('');
  const [discountAmountState, setDiscountAmountState] = React.useState(0);
  const [couponApplied, setCouponApplied] = React.useState(false);
  const [couponMessage, setCouponMessage] = React.useState('');

  React.useEffect(() => {
    if (userProfile) {
      setAddress(userProfile.address || '');
      setPhone(userProfile.phone || '');
      setName(userProfile.name || auth.currentUser?.displayName || '');
      setEmail(auth.currentUser?.email || '');
    }
  }, [userProfile]);

  const subtotal = cart.reduce((acc, item) => acc + item.price * item.qty, 0);
  const shipping = subtotal >= settings.freeDeliveryThreshold ? 0 : settings.deliveryCharge;
  const total = subtotal + shipping - discountAmountState;

  const applyCoupon = () => {
    const result = validateCoupon(couponCode, subtotal);
    if (result.valid) {
      setDiscountAmountState(result.discountAmount);
      setCouponApplied(true);
      setCouponMessage(result.message);
    } else {
      setDiscountAmountState(0);
      setCouponApplied(false);
      setCouponMessage(result.message);
    }
  };

  const handleCheckout = async () => {
    if (!address || !phone || !name) {
      alert("Please provide all delivery details");
      return;
    }
    try {
      setIsProcessing(true);
      await checkout({ address, phone, name, email, couponCode: couponApplied ? couponCode : undefined });
      setCheckoutSuccess(true);
      setTimeout(() => {
        setCheckoutSuccess(false);
        setIsCheckingOut(false);
        onClose();
      }, 3000);
    } catch (error: any) {
      alert("Checkout failed: " + error.message);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 bottom-0 w-full max-w-md bg-secondary border-l border-white/5 z-[70] shadow-2xl flex flex-col"
          >
            <div className="p-8 border-b border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                 <ShoppingBag className="w-6 h-6 text-accent" />
                 <h2 className="text-xl font-display font-black uppercase italic leading-none pt-1">Your <span className="text-accent underline decoration-accent/30 underline-offset-4">Cart</span></h2>
              </div>
              <button 
                onClick={onClose}
                className="p-2 hover:bg-white/5 rounded-full transition-colors"
                >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-8 space-y-8 scrollbar-hide">
              {checkoutSuccess ? (
                <div className="flex flex-col items-center justify-center h-full text-center space-y-6">
                   <motion.div 
                     initial={{ scale: 0 }}
                     animate={{ scale: 1 }}
                     className="w-24 h-24 rounded-full bg-accent/20 flex items-center justify-center text-accent"
                   >
                     <motion.div
                       initial={{ opacity: 0 }}
                       animate={{ opacity: 1 }}
                       transition={{ delay: 0.2 }}
                     >
                        <ShoppingBag className="w-12 h-12" />
                     </motion.div>
                   </motion.div>
                   <div className="space-y-2">
                      <h3 className="text-2xl font-display font-black uppercase italic italic text-white leading-none">Transmission <span className="text-accent underline decoration-accent/30 underline-offset-4">Successful</span></h3>
                      <p className="text-white/40 text-sm font-medium">Your gear has been prioritized for dispatch. Check your mission logs in profile.</p>
                   </div>
                   <div className="pt-4">
                      <div className="w-12 h-1 bg-accent/20 rounded-full overflow-hidden">
                         <motion.div 
                           initial={{ width: 0 }}
                           animate={{ width: '100%' }}
                           transition={{ duration: 3 }}
                           className="h-full bg-accent"
                         />
                      </div>
                   </div>
                </div>
              ) : cart.length === 0 ? (
                <div className="text-center py-20 space-y-4">
                  <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
                    <ShoppingBag className="w-10 h-10 text-white/20" />
                  </div>
                  <h3 className="text-xl font-bold">Your cart is empty</h3>
                  <p className="text-sm text-white/40">Ready to gear up? Explore our products.</p>
                  <button onClick={onClose} className="text-accent text-xs font-black uppercase tracking-widest hover:underline">Start Shopping</button>
                </div>
              ) : (
                cart.map((item) => (
                  <div key={item.id} className="flex gap-6 group">
                     <div className="w-24 h-24 rounded-2xl bg-white/5 p-2 overflow-hidden flex items-center justify-center shrink-0">
                        <img src={item.img} alt={item.name} className="w-full h-full object-contain group-hover:scale-110 transition-transform" referrerPolicy="no-referrer" />
                     </div>
                     <div className="flex-1 flex flex-col justify-between py-1">
                        <div>
                          <div className="flex justify-between items-start mb-1">
                             <h4 className="font-bold text-sm leading-tight text-white">{item.name}</h4>
                             <button 
                               onClick={() => removeFromCart(item.id)}
                               className="text-white/20 hover:text-red-400 transition-colors"
                             >
                                <Trash2 className="w-4 h-4" />
                             </button>
                          </div>
                          <div className="text-accent font-black">{formatCurrency(item.price)}</div>
                        </div>
                        
                        <div className="flex items-center gap-4">
                           <div className="flex items-center gap-3 glass rounded-lg px-2 py-1">
                              <button 
                                onClick={() => updateCartQty(item.id, -1)}
                                className="p-1 hover:text-accent transition-colors"
                              >
                                <Minus className="w-3 h-3" />
                              </button>
                              <span className="text-xs font-bold w-4 text-center">{item.qty}</span>
                              <button 
                                onClick={() => updateCartQty(item.id, 1)}
                                className="p-1 hover:text-accent transition-colors"
                              >
                                <Plus className="w-3 h-3" />
                              </button>
                           </div>
                        </div>
                     </div>
                  </div>
                ))
              )}
            </div>

             {cart.length > 0 && !isCheckingOut && (
              <div className="p-8 bg-black/40 border-t border-white/5 space-y-6">
                 {/* Coupon Code Section */}
                 <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-accent tracking-widest">Apply Cipher (Coupon)</label>
                    <div className="flex gap-2">
                       <input 
                         value={couponCode}
                         onChange={(e) => setCouponCode(e.target.value)}
                         placeholder="PROMO20" 
                         className={cn(
                           "flex-1 bg-white/5 border rounded-xl py-3 px-4 text-sm focus:outline-none font-mono uppercase transition-colors text-white",
                           couponApplied ? "border-accent/40" : "border-white/10"
                         )}
                       />
                       <button 
                         onClick={applyCoupon}
                         className={cn(
                           "px-4 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                           couponApplied ? "bg-accent text-primary" : "bg-white/10 hover:bg-white/20"
                         )}
                       >
                         {couponApplied ? 'Applied' : 'Apply'}
                       </button>
                    </div>
                    {couponMessage && (
                      <p className={cn(
                        "text-[9px] font-black uppercase tracking-widest pl-1",
                        couponApplied ? "text-accent" : "text-red-400"
                      )}>
                        {couponMessage}
                      </p>
                    )}
                 </div>

                 <div className="space-y-3">
                    <div className="flex justify-between text-white/40 text-sm font-medium">
                       <span>Subtotal</span>
                       <span>{formatCurrency(subtotal)}</span>
                    </div>
                    {discountAmountState > 0 && (
                      <div className="flex justify-between text-accent text-sm font-medium">
                         <span>Cipher Discount</span>
                         <span>-{formatCurrency(discountAmountState)}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-white/40 text-sm font-medium">
                       <span>Delivery Charge</span>
                       <span>{shipping === 0 ? 'FREE' : formatCurrency(shipping)}</span>
                    </div>
                    <div className="h-px bg-white/5" />
                    <div className="flex justify-between text-lg font-black italic text-white">
                       <span>TOTAL</span>
                       <span className="text-accent">{formatCurrency(total)}</span>
                    </div>
                 </div>

                 <div className="space-y-3">
                    <button 
                      onClick={() => setIsCheckingOut(true)}
                      className="w-full py-4 rounded-2xl bg-accent text-primary font-black uppercase tracking-widest text-sm flex items-center justify-center gap-2 glow-cyan hover:scale-[1.02] active:scale-[0.98] transition-all"
                    >
                       Checkout Now <ChevronRight className="w-4 h-4" />
                    </button>
                 </div>
              </div>
            )}

            {isCheckingOut && (
              <div className="p-8 bg-black/40 border-t border-white/5 space-y-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-white uppercase tracking-widest text-xs">Delivery Details</h3>
                  <button onClick={() => setIsCheckingOut(false)} className="text-xs text-white/40 hover:text-white">Cancel</button>
                </div>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase text-accent">Full Name</label>
                      <input 
                        type="text" 
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="John Doe"
                        className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-accent"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase text-accent">Email (Optional)</label>
                      <input 
                        type="email" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="john@example.com"
                        className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-accent"
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase text-accent">Shipping Address</label>
                    <input 
                      type="text" 
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="Street, City, Sector"
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-accent"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase text-accent">Contact Phone</label>
                    <input 
                      type="text" 
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+880 XX XXXX"
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-accent"
                    />
                  </div>
                </div>
                <button 
                  onClick={handleCheckout}
                  disabled={isProcessing}
                  className="w-full py-4 rounded-2xl bg-accent text-primary font-black uppercase tracking-widest text-sm flex items-center justify-center gap-2 glow-cyan hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                   {isProcessing ? (
                     <>
                        Synchronizing Intel <Loader2 className="w-4 h-4 animate-spin" />
                     </>
                   ) : (
                     <>
                        Confirm Order <CreditCard className="w-4 h-4" />
                     </>
                   )}
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
