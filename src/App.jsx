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
  Crown, Sparkles, Rocket, Fingerprint, Power, Video,
  Cpu as Processor, Radio as Signal, Globe as Earth,
  MousePointer2
} from 'lucide-react';
import confetti from 'canvas-confetti';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { supabase } from './lib/supabase';

gsap.registerPlugin(ScrollTrigger);

// --- High-End Visual Assets ---

const MasterBackground = () => (
  <div className="fixed inset-0 z-0 bg-[#030303] pointer-events-none">
    <div className="absolute top-0 left-0 w-full h-full opacity-30">
      <div className="absolute top-[-20%] right-[-10%] w-[80%] h-[80%] bg-[#ff0f1b]/10 blur-[200px] rounded-full animate-plasma" />
      <div className="absolute bottom-[-20%] left-[-10%] w-[70%] h-[70%] bg-[#ff0f1b]/05 blur-[180px] rounded-full animate-plasma" style={{ animationDelay: '-5s' }} />
    </div>
  </div>
);

const CustomCursor = () => {
  const cursorRef = useRef(null);
  const ringRef = useRef(null);

  useEffect(() => {
    const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    if (isTouch) return;

    const move = (e) => {
      gsap.to(cursorRef.current, { x: e.clientX, y: e.clientY, duration: 0.1 });
      gsap.to(ringRef.current, { x: e.clientX, y: e.clientY, duration: 0.5, ease: "power3.out" });
    };
    window.addEventListener('mousemove', move);
    return () => window.removeEventListener('mousemove', move);
  }, []);

  return (
    <div className="custom-cursor">
      <div ref={cursorRef} className="fixed top-0 left-0 w-1.5 h-1.5 bg-[#ff0f1b] rounded-full z-[1000] pointer-events-none -translate-x-1/2 -translate-y-1/2" />
      <div ref={ringRef} className="fixed top-0 left-0 w-10 h-10 border border-[#ff0f1b]/20 rounded-full z-[999] pointer-events-none -translate-x-1/2 -translate-y-1/2 mix-blend-difference" />
    </div>
  );
};

// --- Main Components ---

const Navbar = ({ onLoginClick, user }) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handle = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', handle);
    return () => window.removeEventListener('scroll', handle);
  }, []);

  const navLinks = [
    { name: 'Network', href: '#technology' },
    { name: 'Pricing', href: '#pricing' },
    { name: 'Technology', href: '#technology' },
    { name: 'Protocol', href: '#pricing' }
  ];

  return (
    <>
      <nav className={`fixed top-0 w-full z-[500] px-6 md:px-20 py-8 md:py-10 flex justify-between items-center transition-all duration-1000 ${scrolled ? 'bg-black/80 backdrop-blur-3xl py-4 md:py-6 border-b border-white/5' : ''}`}>
        <h1 className="h1-cinematic text-2xl md:text-4xl text-[#ff0f1b] text-glow-red">TITAN<span className="text-white">TV</span></h1>
        
        <div className="hidden xl:flex items-center gap-16">
          {navLinks.map(item => (
            <a key={item.name} href={item.href} className="label-luxury text-[8px] opacity-40 hover:opacity-100 transition-opacity">{item.name}</a>
          ))}
        </div>

        <div className="flex items-center gap-4 md:gap-10">
          <div className="hidden md:flex">
            {user ? (
              <div className="flex items-center gap-5 glass-panel px-8 py-3 rounded-2xl border-white/10 group cursor-pointer">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                <span className="label-luxury text-[8px] text-white/60">{user.email.split('@')[0]}</span>
                <button onClick={() => supabase.auth.signOut()} className="text-white/20 hover:text-white transition-colors ml-2"><Power size={14} /></button>
              </div>
            ) : (
              <button onClick={onLoginClick} className="btn-titan bg-white text-black py-4 px-10">Authorize</button>
            )}
          </div>
          <button onClick={() => setMobileMenuOpen(true)} className="xl:hidden text-white/60 hover:text-white transition-colors">
            <Menu size={24} />
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            className="fixed inset-0 z-[600] bg-black/95 backdrop-blur-3xl flex flex-col p-10"
          >
            <div className="flex justify-between items-center mb-20">
              <h1 className="h1-cinematic text-3xl text-[#ff0f1b]">TITAN<span className="text-white">TV</span></h1>
              <button onClick={() => setMobileMenuOpen(false)} className="text-white/40 hover:text-white transition-colors">
                <X size={32} />
              </button>
            </div>
            
            <div className="flex flex-col gap-10">
              {navLinks.map(item => (
                <a 
                  key={item.name} 
                  href={item.href} 
                  onClick={() => setMobileMenuOpen(false)}
                  className="h1-cinematic text-5xl text-white/40 hover:text-[#ff0f1b] transition-colors"
                >
                  {item.name}.
                </a>
              ))}
            </div>

            <div className="mt-auto pb-10">
              {user ? (
                <div className="flex flex-col gap-6">
                  <div className="flex items-center gap-4 px-8 py-5 glass-panel rounded-3xl border-white/10">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    <span className="label-luxury text-white/60">{user.email}</span>
                  </div>
                  <button onClick={() => { supabase.auth.signOut(); setMobileMenuOpen(false); }} className="btn-titan bg-[#ff0f1b] text-white w-full">Deauthorize</button>
                </div>
              ) : (
                <button onClick={() => { onLoginClick(); setMobileMenuOpen(false); }} className="btn-titan bg-white text-black w-full text-center">Authorize Access</button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

const HeroMaster = () => {
  return (
    <section className="relative min-h-[100vh] flex items-center pt-32 pb-20 px-6 md:px-20 overflow-hidden">
      <div className="container mx-auto grid lg:grid-cols-2 gap-16 md:gap-20 items-center relative z-10">
        <div className="reveal order-2 lg:order-1">
          <span className="label-luxury inline-flex items-center gap-4 mb-10 md:mb-16 px-6 md:px-8 py-3 glass-panel rounded-full border-[#ff0f1b]/20 text-[7px] md:text-[9px]">
            <Signal size={12} className="animate-pulse" /> Uplink Synchronized
          </span>
          <h1 className="h1-cinematic text-[clamp(3.5rem,12vw,14rem)] mb-10 md:mb-12">
            <span className="block text-white/20 leading-[0.7]">Elite</span>
            <span className="block text-white text-glow-red translate-y-[-0.1em]">Vision.</span>
          </h1>
          <p className="text-white/40 text-base md:text-lg max-w-xl mb-12 md:mb-16 font-medium leading-relaxed">
            The world's most stable IPTV infrastructure. 21,000+ Edge Nodes. 
            8K Uncompressed Native Feeds. Zero-Buffer Protocol.
          </p>
          <div className="flex flex-col sm:flex-row flex-wrap gap-6 md:gap-10">
            <button className="btn-titan bg-[#ff0f1b] text-white shadow-2xl w-full sm:w-auto">Initialize Sync</button>
            <div className="flex items-center gap-8 md:gap-10 border-l border-white/10 pl-8 md:pl-10">
              <div className="flex flex-col">
                <span className="h1-cinematic text-2xl md:text-3xl">8K</span>
                <span className="label-luxury text-[6px] md:text-[7px] opacity-30">Raw Stream</span>
              </div>
              <div className="flex flex-col">
                <span className="h1-cinematic text-2xl md:text-3xl">0.2s</span>
                <span className="label-luxury text-[6px] md:text-[7px] opacity-30">Latency</span>
              </div>
            </div>
          </div>
        </div>

        <div className="relative reveal order-1 lg:order-2">
          <div className="relative w-full aspect-video glass-panel rounded-[2rem] md:rounded-[4rem] border-white/10 overflow-hidden shadow-2xl glow-red">
            <img 
              src="https://images.unsplash.com/photo-1593784991095-a205069470b6?auto=format&fit=crop&w=1920&q=80" 
              className="w-full h-full object-cover saturate-[1.5] brightness-75 scale-110" 
              alt="IPTV"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/40" />
            <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.2)_50%)] bg-[length:100%_4px] opacity-10" />
            <div className="absolute bottom-6 left-6 md:bottom-12 md:left-12">
              <div className="flex items-center gap-3 md:gap-4 bg-black/60 backdrop-blur-xl p-3 md:p-4 rounded-2xl md:rounded-3xl border border-white/10 scale-90 md:scale-100 origin-bottom-left">
                <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl md:rounded-2xl bg-[#ff0f1b]/20 flex items-center justify-center"><Activity size={16} className="text-[#ff0f1b]" /></div>
                <div className="flex flex-col"><span className="label-luxury text-[6px] text-white">Neural Feedback</span><span className="text-[9px] font-black uppercase">Channel 214-X</span></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const BentoFeatures = () => {
  const features = [
    { title: 'Global Network', val: '21K+', desc: 'Optimized edge nodes worldwide.', size: 'col-span-12 lg:col-span-8', icon: <Earth /> },
    { title: 'Protocol', val: '8K', desc: 'Native raw quality.', size: 'col-span-12 md:col-span-6 lg:col-span-4', icon: <Video /> },
    { title: 'Encryption', val: 'AES', desc: 'Secure neural transmission.', size: 'col-span-12 md:col-span-6 lg:col-span-4', icon: <Shield /> },
    { title: 'Uptime', val: '99.9%', desc: 'Industrial grade stability.', size: 'col-span-12 lg:col-span-8', icon: <Zap /> }
  ];

  return (
    <section id="technology" className="py-20 md:py-40 px-6 md:px-20">
      <div className="container mx-auto">
        <div className="mb-20 md:mb-32 max-w-4xl text-center md:text-left">
          <span className="label-luxury mb-6 md:mb-8 block">Infrastructure Matrix</span>
          <h2 className="h2-display text-5xl md:text-9xl mb-8 md:mb-10">Advanced Tech.</h2>
        </div>
        <div className="bento-container grid-cols-1 md:grid-cols-12">
          {features.map((f, i) => (
            <div key={i} className={`bento-item group reveal ${f.size} p-8 md:p-12 rounded-[2rem] md:rounded-[3.5rem]`}>
              <div className="flex justify-between items-start mb-12 md:mb-20">
                <div className="w-16 h-16 md:w-20 md:h-20 bg-white/03 rounded-[1.5rem] md:rounded-[2.5rem] flex items-center justify-center border border-white/05 group-hover:bg-[#ff0f1b]/10 transition-all duration-1000">
                  <div className="text-[#ff0f1b] group-hover:scale-125 transition-transform duration-700">{f.icon}</div>
                </div>
                <div className="h1-cinematic text-4xl md:text-6xl text-white/90">{f.val}</div>
              </div>
              <div>
                <h3 className="h1-cinematic text-2xl md:text-3xl mb-3 md:mb-4">{f.title}</h3>
                <p className="label-luxury text-[8px] md:text-[9px] opacity-30">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const ChannelTicker = () => {
  const getL = (d) => `https://www.google.com/s2/favicons?sz=128&domain=${d}`;
  const logos = [
    { n: 'TF1', l: getL('tf1.fr') }, { n: 'BBC', l: getL('bbc.co.uk') }, { n: 'ESPN', l: getL('espn.com') }, 
    { n: 'beIN', l: getL('beinsports.com') }, { n: 'HBO', l: getL('hbo.com') }, { n: 'DAZN', l: getL('dazn.com') },
    { n: 'CANAL+', l: getL('canalplus.fr') }, { n: 'SKY', l: getL('sky.com') }, { n: 'RMC', l: getL('rmcsport.tv') }
  ];

  return (
    <div className="py-12 md:py-20 border-y border-white/5 overflow-hidden select-none bg-black/40">
      <div className="marquee-sync">
        {[...Array(6)].map((_, gi) => (
          <React.Fragment key={gi}>
            {logos.map((logo, i) => (
              <div key={i} className="flex items-center gap-6 md:gap-10 px-10 md:px-16 group">
                <img src={logo.l} className="h-8 w-8 md:h-12 md:w-12 object-contain grayscale opacity-30 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700" alt={logo.n} />
                <span className="h1-cinematic text-xl md:text-3xl text-white/10 group-hover:text-white transition-colors duration-700">{logo.n}</span>
              </div>
            ))}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

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
        setMessage("Neural uplink confirmation sent to your mail.");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        onClose();
      }
    } catch (err) { setError(err.message); } finally { setLoading(false); }
  };

  if (!isOpen) return null;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[700] flex items-center justify-center bg-black/95 backdrop-blur-3xl p-4 md:p-6">
      <motion.div initial={{ scale: 0.9, y: 30 }} animate={{ scale: 1, y: 0 }} className="max-w-md w-full glass-panel p-10 md:p-16 rounded-[2.5rem] md:rounded-[4rem] border-white/5 relative overflow-hidden">
        <button onClick={onClose} className="absolute top-6 right-6 md:top-10 md:right-10 text-white/20 hover:text-white transition-colors"><X size={24} md:size={32} /></button>
        <div className="mb-10 md:mb-16">
          <span className="label-luxury mb-4 md:mb-6 block">Access Protocol</span>
          <h2 className="h1-cinematic text-3xl md:text-5xl text-white">{mode === 'login' ? 'Authorize.' : 'Initialize.'}</h2>
        </div>

        {message ? (
          <div className="text-center space-y-8 md:space-y-10 py-6 md:py-10">
            <div className="w-20 h-20 md:w-24 md:h-24 bg-[#ff0f1b]/10 rounded-[2rem] md:rounded-[3rem] flex items-center justify-center mx-auto border border-[#ff0f1b]/20"><Mail className="text-[#ff0f1b]" size={32} md:size={40} /></div>
            <p className="text-white/40 text-[8px] md:text-[10px] font-black uppercase tracking-[0.3em] md:tracking-[0.4em] leading-loose">{message}</p>
            <button onClick={onClose} className="btn-titan border border-white/10 w-full py-4">Dismiss</button>
          </div>
        ) : (
          <form onSubmit={handleAuth} className="space-y-6 md:space-y-8">
            <input type="email" required placeholder="neural.id@protocol.co" className="w-full rounded-2xl md:rounded-3xl py-4 md:py-6 px-8 md:px-10 text-[10px] md:text-xs outline-none bg-white/03 border-white/05 focus:border-[#ff0f1b]" value={email} onChange={(e) => setEmail(e.target.value)} />
            <input type="password" required placeholder="access_key_••••" className="w-full rounded-2xl md:rounded-3xl py-4 md:py-6 px-8 md:px-10 text-[10px] md:text-xs outline-none bg-white/03 border-white/05 focus:border-[#ff0f1b]" value={password} onChange={(e) => setPassword(e.target.value)} />
            {error && <div className="text-[#ff0f1b] text-[7px] md:text-[8px] font-black uppercase tracking-[0.3em] md:tracking-[0.4em] text-center">{error}</div>}
            <button disabled={loading} className="btn-titan bg-white text-black w-full shadow-2xl py-4 md:py-6">{loading ? 'Processing...' : mode === 'login' ? 'Establish Connection' : 'Sync New Node'}</button>
            <div className="text-center pt-6 md:pt-8">
              <button type="button" onClick={() => setMode(mode === 'login' ? 'signup' : 'login')} className="label-luxury text-[6px] md:text-[7px] opacity-20 hover:opacity-100 transition-opacity">
                {mode === 'login' ? "Protocol not found? Register" : "Node already active? Login"}
              </button>
            </div>
          </form>
        )}
      </motion.div>
    </motion.div>
  );
};

export default function App() {
  const [user, setUser] = useState(null);
  const [showAuth, setShowAuth] = useState(false);
  const [activePlan, setActivePlan] = useState(null);
  const [showCheckout, setShowCheckout] = useState(false);

  useEffect(() => {
    const lenis = new Lenis({ duration: 1.2, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
    function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
    requestAnimationFrame(raf);
    supabase.auth.getSession().then(({ data: { session } }) => setUser(session?.user ?? null));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => setUser(session?.user ?? null));
    return () => { subscription.unsubscribe(); lenis.destroy(); };
  }, []);

  useGSAP(() => {
    gsap.utils.toArray('.reveal').forEach((el) => {
      gsap.from(el, { 
        y: 40, opacity: 0, duration: 1.5, ease: "power4.out",
        scrollTrigger: { trigger: el, start: "top 95%" }
      });
    });
  });

  const handlePlanSelect = (plan) => {
    if (!user) { setShowAuth(true); return; }
    setActivePlan(plan);
    setShowCheckout(true);
  };

  return (
    <main className="min-h-screen bg-[#030303] text-white selection:bg-[#ff0f1b] selection:text-white overflow-hidden">
      <CustomCursor />
      <MasterBackground />
      <Navbar onLoginClick={() => setShowAuth(true)} user={user} />

      <HeroMaster />
      <ChannelTicker />
      <BentoFeatures />

      {/* --- LUXURY PRICING --- */}
      <section id="pricing" className="py-32 md:py-60 px-6 md:px-20 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-[#ff0f1b]/02 blur-[200px] rounded-full pointer-events-none" />
        <div className="container mx-auto relative z-10">
          <div className="text-center max-w-4xl mx-auto mb-20 md:mb-40">
            <span className="label-luxury mb-6 md:mb-8 block">Protocol Access</span>
            <h2 className="h2-display text-5xl md:text-[10rem] mb-8 md:mb-10 leading-none">Subscription.</h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 md:gap-12 max-w-7xl mx-auto">
            {[
              { t: 'Standard', p: '39', f: ['4K Streaming', '2 Nodes Active', 'SLA 99.9%'] },
              { t: 'Titan Master', p: '69', f: ['8K RAW Native', 'Unlimited Nodes', 'Priority Uplink', 'Zero-Latency'], featured: true },
              { t: 'Infinite', p: '129', f: ['8K Uncompressed', 'Custom DNS Access', 'Beta Features', 'VOD 150K+'] }
            ].map((plan, i) => (
              <div key={i} className={`relative group p-10 md:p-16 rounded-[2.5rem] md:rounded-[5rem] glass-panel border-white/05 transition-all duration-1000 ${plan.featured ? 'lg:scale-110 z-20 bg-white/03 border-[#ff0f1b]/40 shadow-2xl' : 'z-10 hover:border-white/20'}`}>
                {plan.featured && <div className="absolute -top-6 md:-top-8 left-1/2 -translate-x-1/2 bg-[#ff0f1b] text-white px-8 md:px-10 py-2 md:py-3 rounded-full text-[7px] md:text-[9px] font-black uppercase tracking-[0.4em] shadow-2xl">Elite Protocol</div>}
                <div className="mb-12 md:mb-20">
                  <span className="label-luxury opacity-40 block mb-4 md:mb-6">{plan.t}</span>
                  <div className="flex items-baseline gap-3 md:gap-4">
                    <span className="h1-cinematic text-6xl md:text-8xl group-hover:text-[#ff0f1b] transition-colors duration-1000">${plan.p}</span>
                    <span className="label-luxury text-[8px] md:text-[10px] opacity-20">/ Year</span>
                  </div>
                </div>
                <div className="space-y-4 md:space-y-6 mb-16 md:mb-24 flex-grow">
                  {plan.f.map((feat, fi) => (
                    <div key={fi} className="flex items-center gap-4 md:gap-6 group/item">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#ff0f1b] opacity-20 group-hover/item:opacity-100 transition-opacity" />
                      <span className="label-luxury text-[8px] md:text-[10px] opacity-40 group-hover/item:opacity-100 transition-opacity">{feat}</span>
                    </div>
                  ))}
                </div>
                <button onClick={() => handlePlanSelect(plan)} className={`btn-titan w-full py-4 md:py-6 ${plan.featured ? 'bg-[#ff0f1b] text-white' : 'bg-white/05 border border-white/10'}`}>Initialize Sync</button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="py-20 md:py-40 bg-black border-t border-white/05">
        <div className="container mx-auto px-6 md:px-20 text-center">
          <h1 className="h1-cinematic text-5xl md:text-8xl text-[#ff0f1b] text-glow-red mb-16 md:mb-20">TITAN<span className="text-white">TV</span></h1>
          <div className="flex flex-wrap justify-center gap-12 md:gap-20 mb-20 md:mb-32">
            {['Network', 'Legal', 'Social'].map(cat => (
              <div key={cat} className="flex flex-col gap-6 md:gap-8">
                <span className="label-luxury opacity-30">{cat}</span>
                <div className="flex flex-col gap-3 md:gap-4 text-[7px] md:text-[9px] font-black uppercase tracking-[0.4em] text-white/40">
                  <a href="#" className="hover:text-white transition-colors">Protocol Status</a>
                  <a href="#" className="hover:text-white transition-colors">Global Grid</a>
                </div>
              </div>
            ))}
          </div>
          <div className="pt-10 md:pt-20 border-t border-white/05 flex flex-col md:flex-row justify-between items-center opacity-20 gap-8 md:gap-10">
            <span className="label-luxury text-[6px] md:text-[7px]">© 2026 TITAN CORE SYNDICATE. ALL TRANSMISSIONS ENCRYPTED.</span>
            <div className="flex gap-8 md:gap-10"><StripeIcon size={18} md:size={20} /><Bitcoin size={18} md:size={20} /><ShieldAlert size={18} md:size={20} /></div>
          </div>
        </div>
      </footer>

      {/* --- MODALS --- */}
      <AnimatePresence>
        {showAuth && <AuthModal isOpen={showAuth} onClose={() => setShowAuth(false)} />}
        {showCheckout && activePlan && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[800] flex items-center justify-center bg-black/98 backdrop-blur-3xl p-4 md:p-6">
            <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="max-w-md w-full glass-panel p-10 md:p-20 rounded-[3rem] md:rounded-[5rem] border-white/10 relative text-center bg-black/80">
              <button onClick={() => setShowCheckout(false)} className="absolute top-8 right-8 md:top-12 md:right-12 text-white/20 hover:text-white transition-colors"><X size={24} md:size={32} /></button>
              <div className="w-16 h-16 md:w-24 md:h-24 bg-[#ff0f1b]/10 rounded-[2rem] md:rounded-[3rem] flex items-center justify-center mx-auto mb-10 md:mb-16 border border-[#ff0f1b]/20 shadow-2xl"><Crown className="text-[#ff0f1b]" size={32} md:size={40} /></div>
              <h2 className="h1-cinematic text-4xl md:text-5xl mb-4 md:mb-6">Authorize.</h2>
              <p className="label-luxury opacity-40 mb-10 md:mb-16">Establishing secure Stripe tunnel</p>
              <button onClick={() => { confetti({ particleCount: 200, spread: 90, origin: { y: 0.7 } }); setShowCheckout(false); }} className="btn-titan bg-white text-black w-full shadow-2xl py-4 md:py-6">Pay with Stripe</button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
