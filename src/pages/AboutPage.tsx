import React from 'react';
import { Sparkles, Shield, Zap, Globe, Cpu, Users } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      {/* Hero */}
      <section className="text-center mb-24 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent text-primary text-[10px] font-black uppercase mb-6 tracking-widest">Our Log Entry</div>
        <h1 className="text-6xl font-display font-black mb-8 leading-tight">Pioneers of the <span className="text-accent underline decoration-accent/30 underline-offset-8 italic">Gadget Frontier</span></h1>
        <p className="text-white/40 text-lg leading-relaxed">Since 2024, Faysal Gadgets Hub has been the primary sector for high-performance computing, neural wearables, and the tech that defines tomorrow.</p>
      </section>

      {/* Grid */}
      <div className="grid md:grid-cols-3 gap-8 mb-24">
        {[
          { icon: Shield, title: "Secure Acquisition", desc: "Encryption-grade checkout systems ensuring your data remains in your control.", color: "text-blue-400" },
          { icon: Zap, title: "Quantum Speed", desc: "Global logistics network optimized for sub-72 hour delivery cycles.", color: "text-accent" },
          { icon: Globe, title: "Universal Access", desc: "Sourcing the rarest tech from every corner of the digital and physical world.", color: "text-orange-400" },
        ].map((item, i) => (
          <div key={i} className="glass rounded-[2.5rem] p-10 border-white/5 hover:border-white/10 transition-colors">
             <div className={`w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center mb-6 ${item.color}`}>
                <item.icon className="w-8 h-8" />
             </div>
             <h3 className="text-xl font-bold mb-4">{item.title}</h3>
             <p className="text-sm text-white/40 leading-relaxed">{item.desc}</p>
          </div>
        ))}
      </div>

      {/* Stats */}
      <div className="glass rounded-[3rem] p-16 grid sm:grid-cols-2 lg:grid-cols-4 gap-12 text-center relative overflow-hidden border-white/10">
        <div className="absolute top-0 left-0 w-full h-full bg-accent/5 blur-[100px] -z-10" />
        <div>
           <div className="text-5xl font-black mb-2 italic">150k+</div>
           <div className="text-xs font-black uppercase tracking-widest text-white/30">Active Cadets</div>
        </div>
        <div>
           <div className="text-5xl font-black mb-2 italic">3.2k</div>
           <div className="text-xs font-black uppercase tracking-widest text-white/30">Tech Missions</div>
        </div>
        <div>
           <div className="text-5xl font-black mb-2 italic">24/7</div>
           <div className="text-xs font-black uppercase tracking-widest text-white/30">Neural Support</div>
        </div>
        <div>
           <div className="text-5xl font-black mb-2 italic">99.9%</div>
           <div className="text-xs font-black uppercase tracking-widest text-white/30">Uptime Stability</div>
        </div>
      </div>

      <div className="mt-24 grid md:grid-cols-2 gap-12 items-center">
         <div className="glass aspect-video rounded-[3rem] overflow-hidden">
            <img src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=800" className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700" alt="Tech Hub" />
         </div>
         <div className="space-y-6">
            <h2 className="text-4xl font-display font-black leading-tight italic">Our Mission Protocol</h2>
            <p className="text-white/40 leading-relaxed">We don't just sell electronics; we provide the tools for creators, developers, and visionaries to reshape reality. Our curation process is rigorous, selecting only the artifacts that survive our extreme performance benchmarks.</p>
            <div className="flex gap-4 pt-4">
               <button className="px-8 py-4 rounded-full bg-accent text-primary font-black uppercase tracking-widest text-xs glow-cyan">Join The Hub</button>
               <button className="px-8 py-4 rounded-full bg-white/5 hover:bg-white/10 font-bold text-xs transition-all">View Assets</button>
            </div>
         </div>
      </div>
    </div>
  );
}
