import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import BannerSlider from './components/BannerSlider';
import BentoCategories from './components/BentoCategories';
import TrendingProducts from './components/TrendingProducts';
import FloatingContact from './components/FloatingContact';
import Footer from './components/Footer';
import CustomCursor from './components/CustomCursor';
import AdminDashboard from './components/AdminDashboard';
import ProductCard from './components/ProductCard';
import StorePage from './pages/StorePage';
import CategoryPage from './pages/CategoryPage';
import ProductDetailsPage from './pages/ProductDetailsPage';
import ProfilePage from './pages/ProfilePage';
import ContactPage from './pages/ContactPage';
import AboutPage from './pages/AboutPage';
import { ThemeProvider } from './lib/ThemeContext';
import { ShopProvider, useShop } from './lib/ShopContext';
import ProductModal from './components/ProductModal';
import FlashSalePopup from './components/FlashSalePopup';
import TrustFeatures from './components/TrustFeatures';
import { motion, useScroll, useSpring } from 'motion/react';
import { Sparkles, ArrowUpRight } from 'lucide-react';

function TopHeader() {
  return (
    <section className="pt-6 pb-2 text-center">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-accent/10 border border-accent/20 backdrop-blur-xl mb-8"
      >
        <Sparkles className="w-5 h-5 text-accent animate-pulse" />
        <span className="text-sm font-black tracking-[0.3em] uppercase text-accent">The Future of Tech is Here</span>
      </motion.div>
    </section>
  );
}

function Home() {
  const { products } = useShop();
  const featuredProducts = products.slice(0, 4);

  return (
    <>
      <TopHeader />
      <BannerSlider />
      <Hero />
      
      <section className="py-24 px-6 max-w-7xl mx-auto overflow-hidden">
        <div className="flex flex-col md:flex-row items-end justify-between gap-8 mb-16">
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-1 bg-accent rounded-full shadow-[0_0_10px_rgba(0,229,255,0.5)]" />
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-accent">Neural Selection</span>
            </div>
            <h2 className="text-5xl lg:text-6xl font-display font-black italic uppercase leading-none">Featured<br/><span className="text-accent underline decoration-white/10 underline-offset-8">Inventory</span></h2>
          </div>
          <Link to="/shop" className="px-10 py-5 rounded-2xl bg-white/5 border border-white/10 hover:border-accent hover:text-accent transition-all font-black text-xs uppercase tracking-widest backdrop-blur-xl group flex items-center gap-4 shadow-xl">
            Access Full Grid <ArrowUpRight className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
           {featuredProducts.map((p: any) => (
             <ProductCard key={p.id} product={p} />
           ))}
        </div>
      </section>

      <section className="py-24 bg-white/5 border-y border-white/5">
        <BentoCategories />
      </section>

      <div className="py-24 space-y-32">
        <TrendingProducts />
      </div>

      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="glass p-12 lg:p-20 rounded-[4rem] border-white/5 relative overflow-hidden text-center space-y-8 bg-accent/5">
           <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-accent/20 blur-[100px] rounded-full pointer-events-none" />
           <div className="space-y-4 relative">
             <h2 className="text-4xl lg:text-5xl font-display font-black italic uppercase leading-tight">Join the Smart <br/><span className="text-accent underline decoration-white/10 underline-offset-8">Circle</span></h2>
             <p className="text-white/40 max-w-md mx-auto font-medium">Subscribe to receive exclusive drops, hidden ciphers, and neural-linked updates.</p>
           </div>
           
           <div className="max-w-md mx-auto flex flex-col sm:flex-row gap-4 relative">
              <input 
                placeholder="YOUR@EMAIL.COM" 
                className="flex-1 bg-white/5 border border-white/10 rounded-2xl py-5 px-8 focus:border-accent outline-none text-sm font-mono tracking-widest"
              />
              <button className="px-10 py-5 bg-white text-primary font-black uppercase tracking-widest text-xs rounded-2xl hover:scale-105 transition-all shadow-2xl">
                Subscribe
              </button>
           </div>
           <p className="text-[10px] text-white/20 font-black uppercase tracking-widest">Protocol Secured • Zero Spam Guarantee</p>
        </div>
      </section>
    </>
  );
}

function AppContent() {
  const { isAdmin, selectedProduct, closeProduct } = useShop();
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress);

  return (
    <Router>
      <div className="min-h-screen bg-primary text-white selection:bg-accent selection:text-primary overflow-x-hidden">
        <CustomCursor />
        {/* Custom Scroll Progress Bar */}
        <motion.div 
          className="fixed top-0 left-0 right-0 h-1 bg-accent z-[100] origin-left" 
          style={{ scaleX }}
        />

        <Navbar />
        
        <main className="pt-24 min-h-[calc(100vh-200px)]">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/shop" element={<StorePage />} />
            <Route path="/category" element={<CategoryPage />} />
            <Route path="/product/:id" element={<ProductDetailsPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/about" element={<AboutPage />} />
            {/* Admin Route - Only Accessible if Admin */}
            {isAdmin && <Route path="/admin" element={<AdminDashboard />} />}
          </Routes>
        </main>

        <TrustFeatures />
        <FloatingContact />
        <Footer />
        
        <ProductModal product={selectedProduct} onClose={closeProduct} />
        <FlashSalePopup />
      </div>
    </Router>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <ShopProvider>
        <AppContent />
      </ShopProvider>
    </ThemeProvider>
  );
}

