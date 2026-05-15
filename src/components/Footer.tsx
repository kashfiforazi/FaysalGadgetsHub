import React from 'react';
import { Cpu, Facebook, Twitter, Instagram, Youtube, Mail, MapPin, Phone, Github } from 'lucide-react';

import { Link } from 'react-router-dom';

export default function Footer() {
  const LOGO_URL = "https://i.postimg.cc/bNryqS3t/1000034540-removebg-preview.png";

  return (
    <footer className="relative pt-20 pb-10 overflow-hidden">
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-accent/10 blur-[120px] -z-10" />
      <div className="absolute top-0 left-0 w-[400px] h-[400px] bg-glow/10 blur-[120px] -z-10" />
      
      <div className="max-w-7xl mx-auto px-6 border-t border-white/5 pt-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">
          {/* Brand */}
          <div className="space-y-6">
            <Link to="/" className="flex items-center gap-3 group">
              <img 
                src={LOGO_URL} 
                alt="Logo" 
                className="w-10 h-10 object-contain drop-shadow-[0_0_8px_rgba(0,229,255,0.5)] group-hover:scale-110 transition-transform" 
                referrerPolicy="no-referrer" 
              />
              <span className="font-display text-xl font-bold tracking-tight">
                Faysal <span className="text-accent underline decoration-accent/30 decoration-2 underline-offset-4">Gadgets</span> Hub
              </span>
            </Link>
            <p className="text-sm text-white/40 leading-relaxed max-w-xs">
              Futuristic gadget store providing premium technology and smart accessories to the next generation of tech enthusiasts.
            </p>
            <div className="flex gap-4">
              {[Facebook, Twitter, Instagram, Youtube, Github].map((Icon, i) => (
                <button key={i} className="p-2 glass rounded-xl hover:text-accent hover:border-accent/50 transition-all">
                  <Icon className="w-5 h-5" />
                </button>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-6">
            <h4 className="font-bold uppercase tracking-widest text-xs text-accent">Quick Links</h4>
            <ul className="space-y-4 text-sm text-white/60">
              {[
                { label: 'Store', href: '/shop' },
                { label: 'Categories', href: '/category' },
                { label: 'About Us', href: '/about' },
                { label: 'Contact', href: '/contact' },
              ].map((link) => (
                <li key={link.label}>
                  <Link to={link.href} className="hover:text-white transition-colors">{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div className="space-y-6">
            <h4 className="font-bold uppercase tracking-widest text-xs text-accent">Support</h4>
            <ul className="space-y-4 text-sm text-white/60">
              {[
                { label: 'Contact Command', href: '/contact' },
                { label: 'Mission Logs', href: '/profile' },
                { label: 'Policy Sector', href: '/about' },
              ].map((link) => (
                <li key={link.label}>
                  <Link to={link.href} className="hover:text-white transition-colors">{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-6">
            <h4 className="font-bold uppercase tracking-widest text-xs text-accent">Get in Touch</h4>
            <div className="space-y-4 text-sm text-white/60">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-accent shrink-0" />
                <span>Sector 10, Uttara, Dhaka-1230, Bangladesh</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-accent shrink-0" />
                <span>+880 1234-567890</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-accent shrink-0" />
                <span>support@faysalgadgets.com</span>
              </div>
            </div>
            {/* Newsletter */}
            <div className="relative mt-6">
                <input 
                  type="email" 
                  placeholder="Enter your email" 
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-xs focus:outline-none focus:border-accent/40" 
                />
                <button className="absolute right-2 top-2 p-1 px-3 bg-accent text-primary font-bold text-xs rounded-lg">Join</button>
            </div>
          </div>
        </div>

        <div className="border-t border-white/5 pt-10 flex flex-col md:flex-row items-center justify-between gap-6 text-[10px] font-bold uppercase tracking-widest text-white/20">
          <p>© 2026 Faysal Gadgets Hub. All Rights Reserved.</p>
          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-white transition-all underline shrink-0">Terms of Service</a>
            <a href="#" className="hover:text-white transition-all underline shrink-0">Legal Info</a>
            <div className="flex items-center gap-2 grayscale brightness-50">
                {/* Dummy Payment Icons */}
                <div className="w-8 h-4 bg-white/20 rounded-sm" />
                <div className="w-8 h-4 bg-white/20 rounded-sm" />
                <div className="w-8 h-4 bg-white/20 rounded-sm" />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
