import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShoppingCart, User, Menu, X, Sun, Moon, LogOut, LayoutGrid, Home, Phone, Info } from 'lucide-react';
import { cn } from '../lib/utils';
import AuthModal from './AuthModal';
import CartSidebar from './CartSidebar';
import { auth } from '../lib/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { useTheme } from '../lib/ThemeContext';

import { Link, useNavigate } from 'react-router-dom';

import { useShop } from '../lib/ShopContext';
import { LayoutDashboard } from 'lucide-react';

export default function Navbar() {
  const { cart, isAdmin } = useShop();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const cartCount = cart.reduce((acc, item) => acc + item.qty, 0);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      unsubscribe();
    };
  }, []);

  const handleLogout = () => signOut(auth);

  const menuItems = [
    { label: 'Home', icon: Home, href: '/' },
    { label: 'Shop', icon: ShoppingCart, href: '/shop' },
    { label: 'Category', icon: LayoutGrid, href: '/category' },
    { label: 'My Profile', icon: User, href: '/profile' },
    { label: 'Contact', icon: Phone, href: '/contact' },
    { label: 'About us', icon: Info, href: '/about' },
  ];

  const LOGO_URL = "https://i.postimg.cc/bNryqS3t/1000034540-removebg-preview.png";

  return (
    <nav className={cn(
      "fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-6 py-4",
      isScrolled ? "pt-4" : "pt-8"
    )}>
      <div className={cn(
        "max-w-7xl mx-auto glass rounded-2xl md:rounded-full px-6 py-3 flex items-center justify-between transition-all duration-300",
        isScrolled ? "bg-primary/80" : "bg-white/5"
      )}>
        {/* Left: Menu Handle */}
        <div className="flex items-center gap-1 sm:gap-2">
          <button 
            className="p-2 hover:bg-white/10 rounded-full transition-colors flex items-center justify-center"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
          
          {/* Theme Toggle */}
          <button 
            onClick={toggleTheme}
            className="p-2 hover:bg-white/10 rounded-full transition-all active:scale-90"
          >
            {theme === 'dark' ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5 text-slate-600" />}
          </button>
        </div>

        {/* Center: Logo & Name */}
        <Link to="/" className="flex items-center gap-1.5 sm:gap-3 absolute left-1/2 -translate-x-1/2 transition-transform hover:scale-105 active:scale-95 group">
          <img src={LOGO_URL} alt="Logo" className="w-8 h-8 sm:w-10 sm:h-10 object-contain drop-shadow-[0_0_8px_rgba(0,229,255,0.5)] group-hover:scale-110 transition-transform" referrerPolicy="no-referrer" />
          <span className="font-display text-[10px] sm:text-xl font-bold tracking-tight whitespace-nowrap">
            Faysal <span className="text-accent underline decoration-accent/30 decoration-2 underline-offset-4">Gadgets</span> Hub
          </span>
        </Link>

        {/* Right: Actions */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          <button 
            onClick={() => setIsCartOpen(true)}
            className="p-2.5 hover:bg-white/10 rounded-full transition-colors relative active:scale-90"
          >
            <ShoppingCart className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-accent text-primary text-[10px] font-bold rounded-full flex items-center justify-center animate-bounce">
                {cartCount}
              </span>
            )}
          </button>
          
          <div className="h-6 w-px bg-white/10 mx-1 hidden md:block" />

          {user ? (
            <div className="relative group">
              <button className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-accent/30 p-0.5 overflow-hidden active:scale-95 transition-transform">
                <img src={user.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.uid}`} alt="Avatar" className="w-full h-full rounded-full" referrerPolicy="no-referrer" />
              </button>
              <div className="absolute top-full right-0 mt-2 w-48 glass rounded-2xl py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all translate-y-2 group-hover:translate-y-0 z-[100]">
                 <div className="px-4 py-2 border-b border-white/5 mb-1">
                    <div className="text-[10px] font-bold text-accent uppercase tracking-tighter">Verified User</div>
                    <div className="text-xs font-bold truncate">{user.displayName || 'Tech Envoy'}</div>
                 </div>
                 <button 
                  onClick={() => navigate('/profile')}
                  className="w-full text-left px-4 py-2 text-xs font-bold hover:bg-white/10 flex items-center gap-2 transition-colors"
                >
                    <User className="w-3 h-3" /> Dashboard
                 </button>
                 <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-xs font-bold hover:bg-red-500/10 text-red-400 flex items-center gap-2 transition-colors">
                    <LogOut className="w-3 h-3" /> Sign Out
                 </button>
              </div>
            </div>
          ) : (
            <button 
              onClick={() => setIsAuthModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-accent text-primary font-bold text-[10px] uppercase tracking-widest hover:scale-105 transition-all active:scale-95 hidden sm:flex items-center gap-2"
            >
              <User className="w-3.5 h-3.5" /> Login
            </button>
          )}
        </div>
      </div>

      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
      <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />

      {/* Menu Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
               onClick={() => setIsMobileMenuOpen(false)}
               className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 left-0 bottom-0 w-[300px] glass z-50 p-8 flex flex-col pt-24"
            >
              <div className="flex flex-col gap-2">
                {menuItems.map((item) => (
                  <Link 
                    key={item.label} 
                    to={item.href} 
                    className="flex items-center gap-4 py-4 px-6 rounded-2xl hover:bg-accent/10 hover:text-accent transition-all font-display text-lg font-bold group"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <item.icon className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                    {item.label}
                  </Link>
                ))}
              </div>

              {!user && (
                <div className="mt-auto space-y-3">
                  <button 
                    onClick={() => { setIsAuthModalOpen(true); setIsMobileMenuOpen(false); }}
                    className="w-full py-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 font-bold uppercase tracking-widest text-xs transition-all"
                  >
                    Login
                  </button>
                  <button 
                    onClick={() => { setIsAuthModalOpen(true); setIsMobileMenuOpen(false); }}
                    className="w-full py-4 rounded-2xl bg-accent text-primary font-bold uppercase tracking-widest text-xs shadow-xl glow-cyan"
                  >
                    Sign Up
                  </button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
}

