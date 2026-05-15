import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, LogIn, Mail, Lock, Sparkles, Loader2, Chrome, User } from 'lucide-react';
import { loginWithGoogle } from '../lib/firebase';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [error, setError] = useState<string | null>(null);

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setError(null);
    try {
      await loginWithGoogle();
      // If no redirect happened, we close the modal
      onClose();
    } catch (err: any) {
      console.error(err);
      if (err.code === 'auth/popup-blocked') {
        setError("Popup blocked! Redirecting to login page...");
      } else {
        setError(err.message || "Authentication failed. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/60 backdrop-blur-md">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="w-full max-w-md glass rounded-[3rem] p-10 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-40 h-40 bg-accent/20 blur-3xl -z-10" />
            
            <button 
              onClick={onClose}
              className="absolute top-6 right-6 p-2 rounded-full hover:bg-white/10 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="text-center mb-10">
              <div className="w-16 h-16 bg-accent/20 rounded-2xl flex items-center justify-center mx-auto mb-6 glow-cyan">
                <Sparkles className="w-8 h-8 text-accent" />
              </div>
              <h2 className="text-3xl font-display font-black mb-2 text-white">
                {mode === 'login' ? 'Welcome Back' : 'Join the Hub'}
              </h2>
              <p className="text-sm text-white/50">
                {mode === 'login' ? 'Enter the future of tech shopping.' : 'Create your account to start acquisition.'}
              </p>
            </div>

            <div className="space-y-4">
              {error && (
                <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-[10px] font-bold uppercase tracking-wider text-center">
                  {error}
                </div>
              )}

              <button 
                onClick={handleGoogleLogin}
                disabled={isLoading}
                className="w-full py-4 rounded-2xl bg-white text-primary font-bold flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
              >
                {isLoading ? <Loader2 className="animate-spin w-5 h-5" /> : <Chrome className="w-5 h-5 text-slate-600" />}
                {mode === 'login' ? 'Sign in with Google' : 'Sign up with Google'}
              </button>

              <div className="relative py-4 flex items-center gap-4">
                <div className="flex-1 h-px bg-white/10" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-white/30">Or email</span>
                <div className="flex-1 h-px bg-white/10" />
              </div>

              <div className="space-y-4">
                {mode === 'signup' && (
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                    <input 
                      type="text" 
                      placeholder="Full Name" 
                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-sm focus:outline-none focus:border-accent/40 transition-colors"
                    />
                  </div>
                )}
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                  <input 
                    type="email" 
                    placeholder="Email Address" 
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-sm focus:outline-none focus:border-accent/40 transition-colors"
                  />
                </div>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                  <input 
                    type="password" 
                    placeholder="Password" 
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-sm focus:outline-none focus:border-accent/40 transition-colors"
                  />
                </div>
                <button 
                  disabled={isLoading}
                  className="w-full py-4 rounded-2xl bg-accent text-primary font-black shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all glow-cyan"
                >
                  {mode === 'login' ? 'Enter Portal' : 'Create Account'}
                </button>
              </div>
            </div>

            <p className="mt-8 text-center text-xs text-white/40 font-medium">
              {mode === 'login' ? "Don't have an account?" : "Already have an account?"} 
              <button 
                onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
                className="text-accent underline ml-2"
              >
                {mode === 'login' ? 'Sign up for free' : 'Sign in here'}
              </button>
            </p>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
