import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
  CheckCircle2, ArrowRight, ShieldCheck as ShieldIcon,
  Crown, Sparkles, Rocket
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { supabase } from './lib/supabase';

// --- Animated Background Elements ---

const FloatingOrbs = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-30">
    {[...Array(5)].map((_, i) => (
      <motion.div
        key={i}
        className="absolute rounded-full blur-[180px] animate-pulse-soft"
        initial={{ 
          x: Math.random() * 100 + "%", 
          y: Math.random() * 100 + "%", 
          backgroundColor: i % 2 === 0 ? '#ff0f1b' : '#300508',
          opacity: 0.1 + (i * 0.05)
        }}
        animate={{ 
          x: [Math.random() * 100 + "%", Math.random() * 100 + "%"], 
          y: [Math.random() * 100 + "%", Math.random() * 100 + "%"] 
        }}
        transition={{ duration: 30 + (i * 5), repeat: Infinity, ease: "linear" }}
        style={{ width: '600px', height: '600px' }}
      />
    ))}
  </div>
);

const CinematicTV = () => (
  <motion.div 
    initial={{ opacity: 0, scale: 0.95, rotateY: 5 }}
    animate={{ opacity: 0.5, scale: 1, rotateY: 0 }}
    transition={{ duration: 2, ease: "easeOut" }}
    className="absolute right-[-10%] top-1/2 -translate-y-1/2 w-[60%] h-[70%] z-0 hidden lg:block"
    style={{ perspective: "2000px" }}
  >
    <div className="relative w-full h-full glass-ultra rounded-[3rem] border-white/10 overflow-hidden shadow-[0_0_150px_rgba(255,15,27,0.15)]">
      <img 
        src="https://images.unsplash.com/photo-1593784991095-a205069470b6?auto=format&fit=crop&w=1920&q=80" 
        className="w-full h-full object-cover saturate-[1.2] brightness-75" 
        alt="Cinema"
      />
      <div className="absolute inset-0 bg-gradient-to-l from-transparent to-black" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%)] bg-[length:100%_4px] opacity-20" />
    </div>
  </motion.div>
);

// --- Components ---

const AuthModal = ({ isOpen, onClose }) => {
  const [mode, setMode] = useState('signup'); 
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      if (mode === 'signup') {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        setMessage("Check your email for the confirmation link!");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        onClose();
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[600] flex items-center justify-center bg-black/90 backdrop-blur-3xl p-6">
      <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} className="max-w-md w-full glass-ultra p-10 md:p-14 rounded-[3rem] border-white/5 relative bg-[#080808]/80">
        <button onClick={onClose} className="absolute top-8 right-8 text-white/20 hover:text-white transition-colors"><X size={24} /></button>
        
        <div className="mb-10">
          <span className="label-luxury mb-4 block">Security Protocol</span>
          <h2 className="h1-cinematic text-4xl text-white">{mode === 'login' ? 'Access Terminal.' : 'Initialize Node.'}</h2>
        </div>

        {message ? (
          <div className="text-center space-y-6 py-8">
            <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto border border-green-500/20">
              <Mail className="text-green-500" size={32} />
            </div>
            <p className="text-white/60 text-sm leading-relaxed">{message}</p>
            <button onClick={onClose} className="w-full py-5 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all">Dismiss</button>
          </div>
        ) : (
          <form onSubmit={handleAuth} className="space-y-5">
            <div className="space-y-2">
              <label className="text-[9px] font-bold text-white/40 uppercase tracking-widest ml-4">Neural Identification</label>
              <input type="email" required placeholder="email@protocol.com" className="w-full rounded-2xl py-5 px-7 text-xs outline-none" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div className="space-y-2">
              <label className="text-[9px] font-bold text-white/40 uppercase tracking-widest ml-4">Access Key</label>
              <input type="password" required placeholder="••••••••" className="w-full rounded-2xl py-5 px-7 text-xs outline-none" value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>

            {error && <div className="text-red-500 text-[10px] font-bold uppercase tracking-widest text-center bg-red-500/5 py-3 rounded-xl border border-red-500/10">{error}</div>}

            <button disabled={loading} className="w-full py-6 bg-gradient-to-r from-[#ff0f1b] to-[#990a10] text-white font-black uppercase tracking-[0.3em] text-[10px] rounded-2xl shadow-[0_10px_30px_rgba(255,15,27,0.3)] hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50">
              {loading ? 'Processing...' : mode === 'login' ? 'Authorize Access' : 'Register Node'}
            </button>

            <div className="text-center mt-8">
              <button type="button" onClick={() => setMode(mode === 'login' ? 'signup' : 'login')} className="text-[9px] font-black uppercase tracking-widest text-white/30 hover:text-white transition-colors">
                {mode === 'login' ? "Don't have a node? Create one" : "Already registered? Login"}
              </button>
            </div>
          </form>
        )}
      </motion.div>
    </motion.div>
  );
};

const ChannelGrid = () => {
  const getL = (d) => `https://www.google.com/s2/favicons?sz=128&domain=${d}`;
  const items = [
    { n: 'TF1', l: getL('tf1.fr') }, { n: 'BBC', l: getL('bbc.co.uk') }, { n: 'ESPN', l: getL('espn.com') }, 
    { n: 'beIN', l: getL('beinsports.com') }, { n: 'HBO', l: getL('hbo.com') }, { n: 'DAZN', l: getL('dazn.com') },
    { n: 'CANAL+', l: getL('canalplus.fr') }, { n: 'SKY', l: getL('sky.com') }, { n: 'RMC', l: getL('rmcsport.tv') },
    { n: 'FOX', l: getL('foxsports.com') }
  ];
  
  return (
    <div className="py-20 overflow-hidden relative select-none">
      <div className="absolute inset-y-0 left-0 w-64 bg-gradient-to-r from-[#050505] to-transparent z-10" />
      <div className="absolute inset-y-0 right-0 w-64 bg-gradient-to-l from-[#050505] to-transparent z-10" />
      
      <div className="flex flex-col gap-8">
        {[0, 1, 2].map((row) => (
          <div key={row} className={`${row % 2 === 0 ? 'animate-marquee' : 'animate-marquee-reverse'} flex gap-8 w-max`}>
            {[...Array(4)].map((_, groupIdx) => (
              <React.Fragment key={groupIdx}>
                {items.map((item, i) => (
                  <div key={i} className="group relative w-32 h-32 md:w-40 md:h-40 glass-card rounded-[2.5rem] flex items-center justify-center p-8 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <img 
                      src={item.l} 
                      alt={item.n} 
                      className="w-full h-full object-contain filter grayscale group-hover:grayscale-0 transition-all duration-500 scale-90 group-hover:scale-110" 
                    />
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0">
                      <span className="text-[7px] font-black uppercase tracking-[0.3em] text-white/40">{item.n}</span>
                    </div>
                  </div>
                ))}
              </React.Fragment>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

const Navbar = ({ onLoginClick, user }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  useEffect(() => { const handleScroll = () => setIsScrolled(window.scrollY > 50); window.addEventListener('scroll', handleScroll); return () => window.removeEventListener('scroll', handleScroll); }, []);
  
  return (
    <nav className={`fixed top-0 w-full z-[100] transition-all duration-1000 px-6 md:px-16 py-8 flex justify-between items-center ${isScrolled ? 'bg-black/80 backdrop-blur-2xl py-5 border-b border-white/5' : 'bg-transparent'}`}>
      <div className="flex items-center gap-16">
        <h1 className="text-[#ff0f1b] text-3xl font-black tracking-tighter cursor-pointer h1-cinematic text-glow-red">TITAN<span className="text-white">TV</span></h1>
        <div className="hidden lg:flex items-center gap-10">
          {['Network', 'Channels', 'Technology', 'Support'].map(item => (
            <a key={item} href={`#${item.toLowerCase()}`} className="text-[9px] font-black uppercase tracking-[0.3em] text-white/30 hover:text-white transition-colors">{item}</a>
          ))}
        </div>
      </div>
      
      <div className="flex items-center gap-6">
        {user ? (
          <div className="flex items-center gap-4 bg-white/5 px-6 py-2.5 rounded-full border border-white/10">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-[9px] font-black uppercase tracking-widest">{user.email.split('@')[0]}</span>
            <button onClick={() => supabase.auth.signOut()} className="text-white/20 hover:text-white transition-colors ml-2"><X size={14} /></button>
          </div>
        ) : (
          <button onClick={onLoginClick} className="group relative overflow-hidden bg-white text-black px-10 py-3.5 rounded-2xl text-[9px] font-black uppercase tracking-[0.2em] hover:scale-105 transition-all">
            <span className="relative z-10">Authorize Terminal</span>
            <div className="absolute inset-0 bg-[#ff0f1b] translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
          </button>
        )}
      </div>
    </nav>
  );
};

const PricingCard = ({ plan, onSelect, featured }) => (
  <div className={`relative group p-12 rounded-[3.5rem] glass-ultra border-white/5 flex flex-col h-full transition-all duration-700 hover:border-[#ff0f1b]/30 ${featured ? 'bg-white/[0.02] ring-1 ring-white/10' : ''}`}>
    {featured && (
      <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-[#ff0f1b] text-white px-8 py-2.5 rounded-full text-[8px] font-black uppercase tracking-[0.3em] shadow-[0_10px_40px_rgba(255,15,27,0.5)] z-20">
        Elite Selection
      </div>
    )}
    
    <div className="mb-12">
      <div className="flex items-center gap-3 mb-4">
        <div className={`w-2 h-2 rounded-full ${featured ? 'bg-[#ff0f1b]' : 'bg-white/20'}`} />
        <span className="label-luxury opacity-60">{plan.title} Protocol</span>
      </div>
      <div className="flex items-baseline gap-2">
        <span className="h1-cinematic text-7xl text-white group-hover:text-[#ff0f1b] transition-colors duration-500">${plan.price}</span>
        <span className="text-white/20 text-[10px] font-black uppercase tracking-widest">/ Year</span>
      </div>
    </div>

    <div className="space-y-5 mb-16 flex-grow">
      {plan.features.map((f, i) => (
        <div key={i} className="flex items-center gap-4 group/item">
          <div className="w-5 h-5 rounded-lg bg-white/5 flex items-center justify-center border border-white/5 group-hover/item:border-[#ff0f1b]/40 transition-colors">
            <Check size={10} className="text-[#ff0f1b]" />
          </div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-white/40 group-hover:text-white/80 transition-colors">{f}</span>
        </div>
      ))}
    </div>

    <button 
      onClick={() => onSelect(plan)} 
      className={`w-full py-6 rounded-2xl font-black uppercase tracking-[0.3em] text-[10px] transition-all duration-500 ${featured ? 'bg-[#ff0f1b] text-white shadow-[0_15px_40px_rgba(255,15,27,0.3)] hover:scale-[1.03]' : 'bg-white/5 border border-white/10 hover:bg-white hover:text-black'}`}
    >
      Initialize Connection
    </button>
  </div>
);

export default function App() {
  const [user, setUser] = useState(null);
  const [showAuth, setShowAuth] = useState(false);
  const [activePlan, setActivePlan] = useState(null);
  const [showCheckout, setShowCheckout] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => { setUser(session?.user ?? null); });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => { setUser(session?.user ?? null); });
    return () => subscription.unsubscribe();
  }, []);

  const handlePlanSelect = (plan) => {
    if (!user) { setShowAuth(true); return; }
    setActivePlan(plan);
    setShowCheckout(true);
  };

  const handleStripeCheckout = () => {
    // Logic for Stripe Checkout redirect would go here
    // For now, we simulate success
    confetti({ particleCount: 200, spread: 90, origin: { y: 0.7 }, colors: ['#ff0f1b', '#ffffff'] });
    setShowCheckout(false);
    setActivePlan(null);
  };

  return (
    <main className="min-h-screen bg-[#050505] text-white selection:bg-[#ff0f1b] selection:text-white bg-mesh">
      <Navbar onLoginClick={() => setShowAuth(true)} user={user} />

      {/* --- HERO --- */}
      <section className="relative min-h-screen flex items-center pt-20 overflow-hidden">
        <FloatingOrbs />
        <CinematicTV />
        
        <div className="container mx-auto px-6 md:px-16 relative z-10">
          <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 1.5 }} className="max-w-4xl">
            <div className="flex items-center gap-4 mb-12">
              <span className="inline-flex items-center gap-3 px-6 py-2.5 rounded-full glass-ultra border-[#ff0f1b]/20">
                <div className="w-1.5 h-1.5 rounded-full bg-[#ff0f1b] animate-pulse" />
                <span className="label-luxury text-[8px] text-white">Quantum Stream active</span>
              </span>
            </div>
            
            <h1 className="h1-cinematic text-[clamp(4rem,14vw,12rem)] leading-[0.85] mb-12">
              <span className="block text-white/20">The Future</span>
              <span className="block text-white text-glow-red">is Titan.</span>
            </h1>

            <p className="text-white/40 text-sm md:text-lg max-w-xl mb-16 font-medium leading-relaxed">
              Experience the world's most stable 8K streaming infrastructure. 
              25,000+ Global Nodes. Uncompressed Raw Feeds. Zero Buffer Protocol.
            </p>

            <div className="flex flex-wrap gap-8 items-center">
              <button 
                onClick={() => document.getElementById('pricing').scrollIntoView()} 
                className="group flex items-center gap-6 px-12 py-7 bg-[#ff0f1b] rounded-3xl font-black uppercase tracking-[0.4em] text-[11px] shadow-[0_20px_60px_rgba(255,15,27,0.4)] hover:scale-105 active:scale-95 transition-all"
              >
                Get Started <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
              </button>
              
              <div className="flex items-center gap-12 ml-4">
                <div className="flex flex-col gap-1">
                  <span className="h1-cinematic text-3xl">21K+</span>
                  <span className="label-luxury text-[7px] opacity-40">Channels</span>
                </div>
                <div className="w-px h-10 bg-white/10" />
                <div className="flex flex-col gap-1">
                  <span className="h1-cinematic text-3xl">8K</span>
                  <span className="label-luxury text-[7px] opacity-40">Resolution</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Floating Background Text */}
        <div className="absolute bottom-20 left-16 hidden xl:block">
          <div className="flex flex-col gap-2">
            <span className="label-luxury text-[7px] opacity-20">SYSTEM_ID: TITAN_CORE_V2</span>
            <div className="w-48 h-[1px] bg-white/5" />
            <span className="label-luxury text-[7px] opacity-20">LATENCY: 0.002MS</span>
          </div>
        </div>
      </section>

      {/* --- CHANNELS --- */}
      <section className="py-32 bg-black/40">
        <div className="container mx-auto px-6 md:px-16 mb-20">
          <div className="flex flex-col md:flex-row justify-between items-end gap-10">
            <div className="max-w-2xl">
              <span className="label-luxury mb-4 block">Content Ecosystem</span>
              <h2 className="h1-cinematic text-6xl md:text-8xl">The Wall.</h2>
            </div>
            <p className="text-white/20 text-[10px] font-black uppercase tracking-[0.4em] mb-4">Real-time Global Network Status: <span className="text-green-500">Optimal</span></p>
          </div>
        </div>
        <ChannelGrid />
      </section>

      {/* --- PRICING --- */}
      <section id="pricing" className="py-40 relative">
        <div className="container mx-auto px-6 md:px-16">
          <div className="text-center max-w-3xl mx-auto mb-32">
            <span className="label-luxury mb-6 block">Pricing Matrix</span>
            <h2 className="h1-cinematic text-7xl md:text-9xl mb-10">Select Tier.</h2>
            <p className="text-white/30 text-xs font-medium tracking-widest uppercase">Every plan includes 24/7 Priority Neural Support</p>
          </div>

          <div className="grid lg:grid-cols-3 gap-10 max-w-7xl mx-auto">
            <PricingCard onSelect={handlePlanSelect} plan={{ title: 'Standard', price: '29', features: ['4K UHD Stream', '2 Device Limit', 'SLA 99.9%'] }} />
            <PricingCard onSelect={handlePlanSelect} featured={true} plan={{ title: 'Titan Elite', price: '59', features: ['8K Raw Native', 'Unlimited Devices', 'Priority Uplink', 'Zero-Latency Feed'] }} />
            <PricingCard onSelect={handlePlanSelect} plan={{ title: 'Infinite', price: '99', features: ['Uncompressed 8K', 'Custom DNS Access', 'Beta Features', 'Exclusive Proxy'] }} />
          </div>
        </div>
      </section>

      {/* --- TECHNOLOGY --- */}
      <section className="py-40 bg-white/[0.01] border-y border-white/5">
        <div className="container mx-auto px-6 md:px-16">
          <div className="grid md:grid-cols-3 gap-20">
            {[
              { icon: <ShieldIcon size={32} />, title: 'Fortress Security', desc: 'Military-grade encryption for total privacy across all neural nodes.' },
              { icon: <Cpu size={32} />, title: 'Titan Processing', desc: 'Proprietary transcoding engines delivering 8K with zero delay.' },
              { icon: <Globe size={32} />, title: 'Global Grid', desc: 'Content delivered from 21,000+ edge locations worldwide.' }
            ].map((feature, i) => (
              <div key={i} className="group flex flex-col items-center text-center">
                <div className="w-20 h-20 bg-white/[0.03] rounded-[2rem] flex items-center justify-center mb-10 border border-white/10 group-hover:border-[#ff0f1b]/50 group-hover:bg-[#ff0f1b]/10 transition-all duration-700">
                  <div className="text-[#ff0f1b] group-hover:scale-110 transition-transform duration-500">{feature.icon}</div>
                </div>
                <h3 className="h1-cinematic text-2xl mb-6">{feature.title}</h3>
                <p className="text-white/30 text-sm leading-relaxed font-medium">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="py-40 bg-black">
        <div className="container mx-auto px-6 md:px-16">
          <div className="flex flex-col md:flex-row justify-between items-center gap-20 mb-32">
            <h1 className="text-[#ff0f1b] text-5xl font-black tracking-tighter h1-cinematic text-glow-red">TITAN<span className="text-white">TV</span></h1>
            <div className="flex gap-16">
              <div className="flex flex-col gap-6">
                <span className="label-luxury opacity-30">Network</span>
                <div className="flex flex-col gap-3 text-[10px] font-black uppercase tracking-widest text-white/60">
                  <a href="#" className="hover:text-[#ff0f1b] transition-colors">Status</a>
                  <a href="#" className="hover:text-[#ff0f1b] transition-colors">Nodes</a>
                </div>
              </div>
              <div className="flex flex-col gap-6">
                <span className="label-luxury opacity-30">Legal</span>
                <div className="flex flex-col gap-3 text-[10px] font-black uppercase tracking-widest text-white/60">
                  <a href="#" className="hover:text-[#ff0f1b] transition-colors">Terms</a>
                  <a href="#" className="hover:text-[#ff0f1b] transition-colors">Privacy</a>
                </div>
              </div>
            </div>
          </div>
          <div className="pt-20 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-10">
            <span className="label-luxury text-[8px] text-white/10">© 2026 TITAN TV GLOBAL SYNDICATE. ALL RIGHTS RESERVED.</span>
            <div className="flex gap-8 text-white/10">
              <StripeIcon size={20} />
              <Bitcoin size={20} />
              <ShieldCheck size={20} />
            </div>
          </div>
        </div>
      </footer>

      {/* --- MODALS --- */}
      <AnimatePresence>
        {showAuth && <AuthModal isOpen={showAuth} onClose={() => setShowAuth(false)} />}
        
        {showCheckout && activePlan && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[700] flex items-center justify-center bg-black/95 backdrop-blur-3xl p-6">
            <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} className="max-w-md w-full glass-ultra p-12 rounded-[4rem] border-white/5 text-center bg-[#080808]/80">
              <button onClick={() => setShowCheckout(false)} className="absolute top-10 right-10 text-white/20 hover:text-white transition-colors"><X size={24} /></button>
              
              <div className="w-20 h-20 bg-[#ff0f1b]/10 rounded-3xl flex items-center justify-center mx-auto mb-10 border border-[#ff0f1b]/20">
                <Crown className="text-[#ff0f1b]" size={32} />
              </div>
              
              <span className="label-luxury mb-4 block">Secure Checkout</span>
              <h2 className="h1-cinematic text-4xl mb-4">Complete Protocol.</h2>
              <p className="text-white/40 text-[10px] font-black uppercase tracking-widest mb-10">You are subscribing to <span className="text-white">{activePlan.title}</span> for ${activePlan.price}/year</p>
              
              <div className="space-y-4 mb-10">
                <div className="flex justify-between items-center py-4 border-b border-white/5">
                  <span className="text-[9px] font-black uppercase tracking-widest text-white/30">Subtotal</span>
                  <span className="h1-cinematic text-xl">${activePlan.price}.00</span>
                </div>
                <div className="flex justify-between items-center py-4">
                  <span className="text-[9px] font-black uppercase tracking-widest text-white/30">Total Activation Fee</span>
                  <span className="h1-cinematic text-xl text-[#ff0f1b]">${activePlan.price}.00</span>
                </div>
              </div>

              <button 
                onClick={handleStripeCheckout} 
                className="w-full py-6 bg-white text-black font-black uppercase tracking-[0.4em] text-[10px] rounded-2xl hover:bg-[#ff0f1b] hover:text-white transition-all shadow-[0_20px_50px_rgba(255,255,255,0.1)]"
              >
                Connect to Stripe
              </button>
              
              <div className="mt-8 flex items-center justify-center gap-3 text-white/10">
                <Lock size={12} />
                <span className="text-[7px] font-black uppercase tracking-widest">Encrypted via Stripe Secure Cloud</span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
