import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useSpring } from 'framer-motion';
import { 
  Play, Info, Plus, Check, ChevronDown, ChevronRight, 
  Search, Bell, User, PlayCircle, Settings, Shield,
  Globe, Zap, Monitor, Smartphone, HelpCircle, Menu, X,
  TrendingUp, Star, Clock, Maximize2, Tv, Cpu, Wifi,
  HardDrive, Headphones, CreditCard, Lock, Download,
  Layers, Radio, Activity, Share2, Award, Zap as ZapIcon,
  FastForward, Target, Mail, Key, Eye, EyeOff, Bitcoin,
  CreditCard as StripeIcon, ShieldCheck, AlertCircle,
  FileText, ShieldAlert, Terminal, Box, Database, ExternalLink,
  CheckCircle2
} from 'lucide-react';
import confetti from 'canvas-confetti';

// --- Animated Background Elements ---

const FloatingOrbs = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
    {[...Array(3)].map((_, i) => (
      <motion.div
        key={i}
        className="absolute rounded-full blur-[200px]"
        initial={{ x: Math.random() * 100 + "%", y: Math.random() * 100 + "%", backgroundColor: '#E50914' }}
        animate={{ x: [Math.random() * 100 + "%", Math.random() * 100 + "%"], y: [Math.random() * 100 + "%", Math.random() * 100 + "%"] }}
        transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
        style={{ width: '800px', height: '800px' }}
      />
    ))}
  </div>
);

const HugeTvBackground = () => (
  <motion.div 
    initial={{ opacity: 0, scale: 1.1, rotateY: 10 }}
    animate={{ 
      opacity: 0.4, 
      scale: 1, 
      rotateY: [-5, 5, -5],
      rotateX: [2, -2, 2],
    }}
    transition={{ 
      opacity: { duration: 3 },
      scale: { duration: 3 },
      rotateY: { duration: 25, repeat: Infinity, ease: "easeInOut" },
      rotateX: { duration: 15, repeat: Infinity, ease: "easeInOut" }
    }}
    className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none"
    style={{ perspective: "3000px" }}
  >
    <div className="relative w-[90%] h-[80%] glass-premium rounded-[4rem] border-white/5 overflow-hidden shadow-[0_0_200px_rgba(229,9,20,0.2)] bg-black/40">
      {/* Cinematic Content inside Huge TV */}
      <img 
        src="https://images.unsplash.com/photo-1593784991095-a205069470b6?auto=format&fit=crop&w=1920&q=80" 
        className="w-full h-full object-cover opacity-60 saturate-[1.5] brightness-75" 
        alt="TV Background"
      />
      
      {/* Screen Grid & Scanlines */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.4)_100%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%),linear-gradient(90deg,rgba(255,0,0,0.03),rgba(0,255,0,0.01),rgba(0,0,255,0.03))] bg-[length:100%_2px,2px_100%] opacity-20" />
      
      {/* Glitch Overlay */}
      <motion.div 
        animate={{ opacity: [0, 0.1, 0, 0.2, 0] }}
        transition={{ duration: 0.3, repeat: Infinity, repeatDelay: 8 }}
        className="absolute inset-0 bg-white mix-blend-overlay"
      />

      {/* Internal Glow */}
      <div className="absolute inset-0 shadow-[inset_0_0_200px_rgba(229,9,20,0.5)]" />
    </div>
  </motion.div>
);

const ScanBeam = () => (
  <motion.div 
    className="absolute inset-x-0 h-[1px] bg-[#E50914]/20 z-10"
    animate={{ y: ['-10vh', '110vh'] }}
    transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
  />
);

// --- Components ---

const AuthModal = ({ isOpen, onClose, onAuthSuccess }) => {
  const [mode, setMode] = useState('login'); 
  const [email, setEmail] = useState('');
  const handleSubmit = (e) => { e.preventDefault(); onAuthSuccess({ email, name: email.split('@')[0] }); };
  if (!isOpen) return null;
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[600] flex items-center justify-center bg-black/95 backdrop-blur-3xl p-6">
      <motion.div initial={{ y: 20 }} animate={{ y: 0 }} className="max-w-md w-full glass-premium p-12 rounded-[3rem] border-white/10 relative">
        <button onClick={onClose} className="absolute top-10 right-10 text-white/20 hover:text-white transition-colors"><X size={32} /></button>
        <h2 className="h1-cinematic text-4xl mb-10 text-white">{mode === 'login' ? 'Login.' : 'Sign Up.'}</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <input type="email" required placeholder="Neural Email" className="w-full bg-white/[0.02] border border-white/5 rounded-xl py-5 px-6 text-xs outline-none focus:border-[#E50914]" value={email} onChange={(e) => setEmail(e.target.value)} />
          <button className="w-full py-5 bg-[#E50914] text-white font-black uppercase tracking-widest text-[10px] rounded-xl">Authorize</button>
        </form>
      </motion.div>
    </motion.div>
  );
};

const ChannelWall = () => {
  const getL = (d) => `https://www.google.com/s2/favicons?sz=128&domain=${d}`;
  const items = [
    { n: 'TF1', l: getL('tf1.fr') }, { n: 'BBC', l: getL('bbc.co.uk') }, { n: 'ESPN', l: getL('espn.com') }, 
    { n: 'beIN', l: getL('beinsports.com') }, { n: 'HBO', l: getL('hbo.com') }, { n: 'DAZN', l: getL('dazn.com') },
    { n: 'CANAL+', l: getL('canalplus.fr') }, { n: 'SKY', l: getL('sky.com') }, { n: 'RMC', l: getL('rmcsport.tv') },
    { n: 'FOX', l: getL('foxsports.com') }
  ];
  const LogoRow = ({ reverse = false }) => (
    <div className={`flex gap-12 py-8 ${reverse ? 'animate-marquee-reverse' : 'animate-marquee'} pointer-events-none w-max`}>
      {Array.from({ length: 25 }).map((_, idx) => (
        <React.Fragment key={idx}>{items.map((item, i) => (
          <div key={`${idx}-${i}`} className="flex-none w-24 h-24 bg-white/[0.03] border border-white/10 rounded-[2rem] flex items-center justify-center p-6 overflow-hidden shadow-2xl backdrop-blur-3xl opacity-100 transition-all hover:scale-110">
            <img src={item.l} alt={item.n} className="w-full h-full object-contain filter drop-shadow-[0_0_20px_rgba(255,255,255,0.4)] brightness-125 saturate-[1.3]" onError={(e) => { e.target.style.display = 'none'; }} />
          </div>
        ))}</React.Fragment>
      ))}
    </div>
  );
  return (
    <div className="py-12 overflow-hidden relative select-none bg-[#050505]">
      <div className="absolute inset-y-0 left-0 w-[400px] bg-gradient-to-r from-[#050505] to-transparent z-20" /><div className="absolute inset-y-0 right-0 w-[400px] bg-gradient-to-l from-[#050505] to-transparent z-20" />
      <div className="space-y-8"><LogoRow /><LogoRow reverse /><LogoRow /><LogoRow reverse /><LogoRow /></div>
    </div>
  );
};

const LogoTicker = () => {
  const logos = [{ name: 'beIN SPORTS' }, { name: 'DAZN' }, { name: 'NETFLIX' }, { name: 'PRIME VIDEO' }, { name: 'DISNEY+' }, { name: 'HBO MAX' }, { name: 'SKY SPORTS' }, { name: 'CANAL+' }, { name: 'ESPN' }];
  return (
    <div className="py-16 bg-black/40 border-y border-white/5 overflow-hidden relative">
      <div className="flex animate-marquee" style={{ animationDuration: '250s' }}>
        {[...logos, ...logos, ...logos].map((logo, i) => (
          <div key={i} className="flex items-center gap-4 px-12 group cursor-pointer">
            <div className="w-1.5 h-1.5 rounded-full bg-[#E50914]" /><span className="text-xl md:text-2xl font-black italic tracking-tighter text-white/20 group-hover:text-white transition-all duration-300">{logo.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const Navbar = ({ onLoginClick }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  useEffect(() => { const handleScroll = () => setIsScrolled(window.scrollY > 50); window.addEventListener('scroll', handleScroll); return () => window.removeEventListener('scroll', handleScroll); }, []);
  return (
    <nav className={`fixed top-0 w-full z-[100] transition-all duration-700 px-6 md:px-20 py-6 flex justify-between items-center ${isScrolled ? 'bg-black/95 backdrop-blur-3xl border-b border-white/5 py-4' : 'bg-gradient-to-b from-black/90 to-transparent'}`}>
      <div className="flex items-center gap-12"><h1 className="text-[#E50914] text-3xl font-black tracking-tighter cursor-pointer h1-cinematic">TITAN<span className="text-white">TV</span></h1></div>
      <button onClick={onLoginClick} className="bg-[#E50914] text-white px-6 py-2.5 rounded-md text-[9px] font-black uppercase tracking-widest hover:scale-105 transition-all">Authorize</button>
    </nav>
  );
};

const PricingNode = ({ plan, onSelect, recommended }) => (
  <div className={`relative p-10 rounded-[3rem] glass-premium transition-all duration-500 hover:translate-y-[-10px] flex flex-col h-full ${recommended ? 'border-[#E50914]/40 bg-white/[0.02]' : 'border-white/5'}`}>
    {recommended && <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-[#E50914] text-white px-6 py-1.5 rounded-full text-[8px] font-black uppercase tracking-[0.2em] shadow-[0_0_40px_rgba(229,9,20,0.5)]">Recommended</div>}
    <div className="mb-10"><span className="label-luxury text-[8px] mb-3 block opacity-50">{plan.title} PROTOCOL</span><div className="flex items-baseline gap-2"><span className="h1-cinematic text-6xl md:text-7xl">${plan.price}</span><span className="text-white/20 text-[10px] font-black uppercase tracking-widest">/Year</span></div></div>
    <ul className="space-y-4 mb-12 flex-grow">{plan.features.map((f, i) => (<li key={i} className="flex items-center gap-3 text-[9px] font-black uppercase tracking-widest text-white/30 hover:text-white transition-colors"><div className="w-1 h-1 rounded-full bg-[#E50914]" />{f}</li>))}</ul>
    <button onClick={() => onSelect(plan)} className={`w-full py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-[9px] transition-all ${recommended ? 'bg-[#E50914] text-white hover:bg-white hover:text-black' : 'border border-white/10 hover:bg-white/5'}`}>Establish Connection</button>
  </div>
);

export default function App() {
  const [user, setUser] = useState(null);
  const [showAuth, setShowAuth] = useState(false);
  const [activePlan, setActivePlan] = useState(null);
  const [purchaseCode, setPurchaseCode] = useState(null);

  const handleAuthSuccess = (userData) => { setUser(userData); setShowAuth(false); confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 }, colors: ['#E50914', '#ffffff'] }); };
  const handlePlanSelect = (plan) => { if (!user) { setShowAuth(true); return; } setActivePlan(plan); };

  return (
    <main className="min-h-screen bg-[#050505] text-white selection:bg-[#E50914] selection:text-white overflow-x-hidden">
      <Navbar onLoginClick={() => setShowAuth(true)} />

      {/* HERO SECTION WITH FULL SCREEN TV ANIMATION */}
      <section className="relative h-screen min-h-[800px] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <FloatingOrbs />
          <ScanBeam />
          <HugeTvBackground />
          <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-[#050505]/40" />
        </div>
        
        <div className="relative z-10 px-6 md:px-20 w-full">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.2, ease: "easeOut" }} className="max-w-7xl">
            <div className="flex items-center gap-5 mb-10">
              <span className="label-luxury flex items-center gap-3 bg-[#E50914]/10 px-5 py-2 rounded-full border border-[#E50914]/20 text-[8px] text-[#E50914]">
                <Activity size={14} className="animate-pulse" /> 21,482 NODES ACTIVE
              </span>
            </div>
            
            {/* FIXED WORD: DISTRIBUTION */}
            <h1 className="h1-cinematic text-[clamp(4rem,12vw,14rem)] mb-12 leading-[0.8] tracking-tight">
              <motion.span initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 1 }} className="block text-white/90">ULTIMATE</motion.span>
              <motion.span initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 1, delay: 0.2 }} className="block text-[#E50914] whitespace-nowrap">
                DISTRIBUTION.
              </motion.span>
            </h1>
            
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }} className="flex flex-wrap gap-10">
              <button onClick={() => document.getElementById('pricing').scrollIntoView()} className="px-14 py-6 bg-[#E50914] rounded-2xl hover:scale-105 transition-all font-black uppercase tracking-[0.4em] text-[11px] shadow-[0_0_80px_rgba(229,9,20,0.4)]">Initialize Protocol</button>
              <div className="flex items-center gap-4 text-white/20 text-[9px] font-black uppercase tracking-widest border-l border-white/10 pl-10">
                <ShieldCheck size={20} className="text-green-500" /> AES-256 SECURED
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Global Floating Label */}
        <motion.div 
          animate={{ y: [0, -10, 0] }} transition={{ duration: 4, repeat: Infinity }}
          className="absolute bottom-20 right-20 hidden lg:flex flex-col items-end gap-2"
        >
          <div className="label-luxury text-[7px] text-white/20">UPLINK_STATUS</div>
          <div className="label-luxury text-[8px] text-green-500 font-black">STABLE_8K_FEED</div>
        </motion.div>
      </section>

      <LogoTicker />

      <div className="relative z-20 mt-16 px-6 md:px-20"><div className="max-w-[1800px] mx-auto grid md:grid-cols-4 gap-8">
        {[{ label: 'Channels', val: '21K+' }, { label: 'VOD', val: '150K+' }, { label: 'Latency', val: '< 0.8ms' }, { label: 'Uptime', val: '99.9%' }].map((m, i) => (
          <div key={i} className="p-10 glass-premium rounded-[2.5rem] border-white/5 text-center"><div className="label-luxury mb-3 opacity-40 text-[9px]">{m.label}</div><div className="h1-cinematic text-5xl text-[#E50914]">{m.val}</div></div>
        ))}
      </div></div>

      <section id="catalog" className="py-40 px-6 md:px-20 overflow-hidden"><div className="max-w-[1800px] mx-auto"><ChannelWall /></div></section>

      <section id="pricing" className="py-40 px-6 md:px-20 relative"><div className="max-w-[1800px] mx-auto"><div className="grid lg:grid-cols-3 gap-10 max-w-6xl mx-auto">
        <PricingNode onSelect={handlePlanSelect} plan={{ title: 'Standard', price: '19', features: ['4K Streaming'] }} />
        <PricingNode onSelect={handlePlanSelect} recommended={true} plan={{ title: 'Titan Master', price: '49', features: ['8K Native Raw'] }} />
        <PricingNode onSelect={handlePlanSelect} plan={{ title: 'Infinite', price: '99', features: ['8K Uncompressed'] }} />
      </div></div></section>

      <footer className="py-32 border-t border-white/5 px-6 md:px-20 flex flex-col md:flex-row justify-between items-center gap-16"><h1 className="h1-cinematic text-3xl text-[#E50914]">TITAN<span className="text-white">TV</span></h1></footer>

      <AnimatePresence>
        {showAuth && <AuthModal isOpen={showAuth} onClose={() => setShowAuth(false)} onAuthSuccess={handleAuthSuccess} />}
        {activePlan && <div className="fixed inset-0 z-[700] flex items-center justify-center bg-black/98 backdrop-blur-3xl p-6"><div className="max-w-md w-full glass-premium p-12 rounded-[4rem] border-white/10 relative text-center"><h2 className="h1-cinematic text-4xl mb-8">Gateway.</h2><button onClick={() => { setActivePlan(null); setPurchaseCode("TITAN-992-X"); }} className="w-full py-5 bg-[#E50914] text-white font-black uppercase text-[10px] rounded-xl">Confirm Purchase</button></div></div>}
        {purchaseCode && (
          <div className="fixed inset-0 z-[500] flex items-center justify-center bg-black/98 backdrop-blur-3xl p-10"><div className="max-w-md w-full glass-premium p-12 rounded-[3rem] border-[#E50914]/40 text-center"><Check size={40} className="text-[#E50914] mx-auto mb-8" /><h2 className="h1-cinematic text-4xl mb-4">Uplink Active</h2><div className="bg-white/5 p-8 rounded-[2rem] h1-cinematic text-3xl text-[#E50914] mb-8">{purchaseCode}</div><button onClick={() => setPurchaseCode(null)} className="w-full py-5 bg-[#E50914] text-white font-black uppercase text-[10px] rounded-xl">Access Terminal</button></div></div>
        )}
      </AnimatePresence>
    </main>
  );
}
