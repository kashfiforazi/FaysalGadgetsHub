import React, { useState, useEffect } from 'react';
import { User, Package, Settings, LogOut, Loader2, LayoutDashboard, ChevronRight, FileText, ShoppingBag, MapPin, Phone, Mail, Clock } from 'lucide-react';
import { auth } from '../lib/firebase';
import { signOut, onAuthStateChanged } from 'firebase/auth';
import { useShop, Order } from '../lib/ShopContext';
import { useNavigate } from 'react-router-dom';
import { formatCurrency } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';

export default function ProfilePage() {
  const { isAdmin, orders, userProfile, updateProfile } = useShop();
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('Profile Settings');
  const [isUpdating, setIsUpdating] = useState(false);

  // Form states
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');

  useEffect(() => {
    if (userProfile) {
      setName(userProfile.name || auth.currentUser?.displayName || '');
      setPhone(userProfile.phone || '');
      setAddress(userProfile.address || '');
    }
  }, [userProfile]);

  // Filter orders for the current user
  const userOrders = orders
    .filter(o => o.userId === auth.currentUser?.uid)
    .sort((a, b) => {
      const dateA = a.createdAt?.seconds || 0;
      const dateB = b.createdAt?.seconds || 0;
      return dateB - dateA;
    });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);
    try {
      await updateProfile({ name, phone, address });
      alert('Profile Updated Successfully');
    } catch (err: any) {
      alert('Failed to update profile: ' + err.message);
    } finally {
      setIsUpdating(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-12 h-12 text-accent animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-20 text-center">
        <h2 className="text-3xl font-display font-black mb-4 uppercase">Portal Locked</h2>
        <p className="text-white/40 mb-8 font-medium">Please sign in to access your tech profile.</p>
        <button onClick={() => navigate('/')} className="px-8 py-3 bg-accent text-primary rounded-xl font-bold uppercase tracking-widest text-xs">Return Home</button>
      </div>
    );
  }

  const tabs = [
    { label: 'Profile Settings', icon: User },
    { label: 'Order History', icon: Package },
  ];

  if (isAdmin) {
    tabs.push({ label: 'Admin Hub', icon: LayoutDashboard });
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="grid lg:grid-cols-4 gap-8">
        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-4">
          <div className="glass rounded-[2rem] p-8 text-center border-white/5">
             <div className="w-24 h-24 rounded-full mx-auto mb-4 border-2 border-accent p-1 shadow-[0_0_20px_rgba(0,229,255,0.2)]">
                <img src={user.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.uid}`} className="w-full h-full rounded-full" alt="Avatar" referrerPolicy="no-referrer" />
             </div>
             <h3 className="font-bold text-xl truncate">{userProfile?.name || user.displayName || 'Tech Cadet'}</h3>
             <p className="text-[10px] text-accent font-black uppercase tracking-[0.2em] mt-1">
               {isAdmin ? 'Systems Admin' : 'Tech Member'}
             </p>
          </div>
          
          <div className="glass rounded-[2rem] p-3 space-y-1 border-white/5">
             {tabs.map(item => (
               <button 
                 key={item.label} 
                 onClick={() => {
                   if (item.label === 'Admin Hub') {
                     navigate('/admin');
                   } else {
                     setActiveTab(item.label);
                   }
                 }}
                 className={`w-full flex items-center gap-3 px-5 py-4 rounded-xl text-xs font-bold transition-all uppercase tracking-widest ${activeTab === item.label ? 'bg-accent text-primary' : 'hover:bg-white/5 text-white/40 hover:text-white'}`}
               >
                 <item.icon className="w-4 h-4" /> {item.label}
               </button>
             ))}
             <button onClick={() => signOut(auth)} className="w-full flex items-center gap-3 px-5 py-4 rounded-xl text-xs font-bold text-red-400 hover:bg-red-400/10 transition-all mt-4 uppercase tracking-widest">
                <LogOut className="w-4 h-4" /> Sign Out
             </button>
          </div>
        </div>

        {/* Content */}
        <div className="lg:col-span-3 space-y-8">
           {activeTab === 'Profile Settings' && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass rounded-[2.5rem] p-8 md:p-12 border-white/5"
              >
                <div className="flex items-center gap-4 mb-10">
                   <div className="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center text-accent">
                      <Settings className="w-5 h-5" />
                   </div>
                   <h2 className="text-2xl font-display font-black uppercase italic leading-none pt-1">Profile <span className="text-accent underline decoration-accent/30 underline-offset-4">Settings</span></h2>
                </div>
                
                <form onSubmit={handleUpdateProfile} className="space-y-8">
                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                       <label className="text-[10px] font-black uppercase text-white/40 tracking-widest px-2">Designation (Full Name)</label>
                       <div className="relative">
                          <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                          <input 
                            type="text" 
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="John Doe" 
                            className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-6 focus:outline-none focus:border-accent transition-all font-medium" 
                          />
                       </div>
                    </div>
                    <div className="space-y-3">
                       <label className="text-[10px] font-black uppercase text-white/40 tracking-widest px-2">Comms Frequency (Phone)</label>
                       <div className="relative">
                          <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                          <input 
                            type="tel" 
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder="017XXXXXXXX" 
                            className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-6 focus:outline-none focus:border-accent transition-all font-medium" 
                          />
                       </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                     <label className="text-[10px] font-black uppercase text-white/40 tracking-widest px-2">Station Coordinates (Address)</label>
                     <div className="relative">
                        <MapPin className="absolute left-4 top-4 w-4 h-4 text-white/20" />
                        <textarea 
                          value={address}
                          onChange={(e) => setAddress(e.target.value)}
                          placeholder="Enter your shipping address details..." 
                          rows={4}
                          className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-6 focus:outline-none focus:border-accent transition-all font-medium resize-none text-sm"
                        ></textarea>
                     </div>
                  </div>

                  <div className="pt-4">
                    <button 
                      disabled={isUpdating}
                      className="group relative px-10 py-5 rounded-2xl bg-accent text-primary font-black uppercase tracking-widest text-[10px] hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-3 shadow-[0_0_40px_rgba(0,229,255,0.3)] disabled:opacity-50"
                    >
                      {isUpdating ? (
                        <>Updating Link... <Loader2 className="w-4 h-4 animate-spin" /></>
                      ) : (
                        <>Sync Parameters <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" /></>
                      )}
                    </button>
                  </div>
                </form>

                <div className="mt-12 p-6 bg-white/5 rounded-3xl border border-white/10 flex items-center justify-between">
                   <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center text-white/40">
                         <Mail className="w-5 h-5" />
                      </div>
                      <div>
                         <p className="text-sm font-bold truncate max-w-[200px]">{user.email}</p>
                         <p className="text-[9px] text-white/30 font-black uppercase tracking-widest">Neural Auth Active</p>
                      </div>
                   </div>
                   <div className="text-[9px] font-black uppercase py-1.5 px-4 bg-accent/10 text-accent rounded-full border border-accent/20">Identity Verified</div>
                </div>
              </motion.div>
           )}

           {activeTab === 'Order History' && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass rounded-[2.5rem] p-8 md:p-12 border-white/5"
              >
                <div className="flex items-center justify-between mb-10">
                   <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center text-accent">
                         <Clock className="w-5 h-5" />
                      </div>
                      <h3 className="text-xl font-display font-black uppercase italic leading-none pt-1">Mission <span className="text-accent underline decoration-accent/30 underline-offset-4">Logs</span></h3>
                   </div>
                   <span className="text-[10px] font-black uppercase text-white/20 tracking-widest bg-white/5 px-4 py-2 rounded-full border border-white/5">{userOrders.length} Sequences</span>
                </div>

                <div className="space-y-4">
                   {userOrders.map((order) => (
                     <div 
                       key={order.id} 
                       className="group flex flex-wrap items-center justify-between p-6 bg-white/5 rounded-2xl border border-white/5 gap-6 hover:border-accent/40 transition-all hover:bg-white/10"
                     >
                        <div className="flex gap-4">
                           <div className="w-14 h-14 rounded-2xl bg-accent/10 border border-accent/5 flex items-center justify-center text-accent group-hover:scale-110 transition-transform">
                              <Package className="w-7 h-7" />
                           </div>
                           <div>
                              <div className="font-mono font-bold text-accent text-sm">#{order.id.slice(-8).toUpperCase()}</div>
                              <div className="text-[9px] text-white/30 font-black uppercase tracking-widest mt-1">Manifest Date: {order.createdAt?.seconds ? new Date(order.createdAt.seconds * 1000).toLocaleDateString() : 'Syncing...'}</div>
                           </div>
                        </div>

                        <div className="flex-1 flex flex-wrap items-center gap-4 min-w-[200px]">
                           <div className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-[0.2em] border ${
                             order.status === 'delivered' ? 'bg-green-400/10 text-green-400 border-green-400/20' : 
                             order.status === 'pending' ? 'bg-amber-400/10 text-amber-400 border-amber-400/20' : 
                             'bg-accent/10 text-accent border-accent/20'
                           }`}>
                             {order.status}
                           </div>
                           <div className="h-4 w-px bg-white/10" />
                           <div className="font-display font-black italic text-lg">{formatCurrency(order.total)}</div>
                        </div>

                        <div className="flex items-center gap-2">
                           <div className="text-[9px] font-black uppercase tracking-widest text-white/20 hidden sm:block">View Manifest</div>
                           <button onClick={(e) => {
                             // Placeholder for expansion
                             alert("Manifest Details: " + order.items.map(i => i.name).join(", "));
                           }} className="p-3 bg-white/5 rounded-xl hover:bg-accent hover:text-primary transition-all">
                              <FileText className="w-4 h-4" />
                           </button>
                        </div>
                     </div>
                   ))}
                   
                   {userOrders.length === 0 && (
                     <div className="text-center py-24 glass rounded-[2rem] border-white/5 border-dashed space-y-6">
                       <ShoppingBag className="w-12 h-12 text-white/5 mx-auto" />
                       <div className="space-y-1">
                          <p className="text-base text-white/20 font-black uppercase tracking-[0.3em] font-display italic">Zero acquisitions detected</p>
                          <p className="text-[10px] text-white/10 uppercase font-bold tracking-widest">Your neural ledger is currently empty</p>
                       </div>
                       <button onClick={() => navigate('/shop')} className="px-8 py-3 bg-accent/10 border border-accent/20 text-accent font-black text-[10px] uppercase tracking-widest rounded-xl hover:bg-accent hover:text-primary transition-all">Initiate Shop Sequence</button>
                     </div>
                   )}
                </div>
              </motion.div>
           )}
        </div>
      </div>
    </div>
  );
}
