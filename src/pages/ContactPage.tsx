import React from 'react';
import { Mail, Phone, MapPin, Send, MessageSquare } from 'lucide-react';

export default function ContactPage() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="grid lg:grid-cols-2 gap-16 items-center">
        <div>
          <h1 className="text-6xl font-display font-black leading-tight mb-8 italic">Contact the <br/><span className="text-accent underline decoration-accent/30 underline-offset-8">Hub Command</span></h1>
          <p className="text-white/40 text-lg mb-12 max-w-md">Our specialized support team is online 24/7 to assist with your tech acquisitions and inquiries.</p>
          
          <div className="space-y-8">
            <div className="flex gap-6 items-center group">
               <div className="w-14 h-14 rounded-2xl bg-accent/10 flex items-center justify-center text-accent group-hover:scale-110 transition-transform">
                  <Mail className="w-6 h-6" />
               </div>
               <div>
                  <div className="text-[10px] uppercase font-black tracking-widest text-white/30 mb-1">Electronic Mail</div>
                  <div className="text-xl font-bold">ops@faysalgadgets.hub</div>
               </div>
            </div>
            
            <div className="flex gap-6 items-center group">
               <div className="w-14 h-14 rounded-2xl bg-purple-500/10 flex items-center justify-center text-purple-400 group-hover:scale-110 transition-transform">
                  <Phone className="w-6 h-6" />
               </div>
               <div>
                  <div className="text-[10px] uppercase font-black tracking-widest text-white/30 mb-1">Neural Voice Link</div>
                  <div className="text-xl font-bold">+1 (555) 010-3490</div>
               </div>
            </div>
            
            <div className="flex gap-6 items-center group">
               <div className="w-14 h-14 rounded-2xl bg-orange-500/10 flex items-center justify-center text-orange-400 group-hover:scale-110 transition-transform">
                  <MapPin className="w-6 h-6" />
               </div>
               <div>
                  <div className="text-[10px] uppercase font-black tracking-widest text-white/30 mb-1">Physical Sector</div>
                  <div className="text-xl font-bold">Silicon Valley, Sector 7-G</div>
               </div>
            </div>
          </div>
        </div>

        <div className="glass rounded-[3rem] p-12 border-white/5 relative">
           <div className="absolute top-0 right-0 w-32 h-32 bg-accent/10 blur-3xl -z-10" />
           <div className="flex items-center gap-4 mb-8">
              <MessageSquare className="w-6 h-6 text-accent" />
              <h2 className="text-2xl font-bold">Encryption Signal</h2>
           </div>
           
           <form className="space-y-6">
              <div className="grid sm:grid-cols-2 gap-6">
                 <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-white/40 ml-4">Codename</label>
                    <input type="text" placeholder="John Doe" className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 focus:outline-none focus:border-accent/40" />
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-white/40 ml-4">Return Address</label>
                    <input type="email" placeholder="john@example.com" className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 focus:outline-none focus:border-accent/40" />
                 </div>
              </div>
              <div className="space-y-2">
                 <label className="text-[10px] font-black uppercase text-white/40 ml-4">Transmission Content</label>
                 <textarea rows={5} placeholder="State your objective..." className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 focus:outline-none focus:border-accent/40 resize-none" />
              </div>
              <button type="submit" className="w-full py-5 rounded-2xl bg-accent text-primary font-black uppercase tracking-widest flex items-center justify-center gap-3 shadow-xl glow-cyan hover:scale-[1.02] active:scale-[0.98] transition-all">
                 <Send className="w-5 h-5" /> Initiate Transmission
              </button>
           </form>
        </div>
      </div>
    </div>
  );
}
