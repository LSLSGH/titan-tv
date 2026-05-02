import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useSpring, useTransform } from 'framer-motion';
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
  Crown, Sparkles, Rocket, Fingerprint, MousePointer2
} from 'lucide-react';
import confetti from 'canvas-confetti';
import Lenis from 'lenis';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { supabase } from './lib/supabase';

// --- Fluid Background ---

const LiquidBackground = () => (
  <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
    <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#ff0f1b]/10 blur-[150px] rounded-full animate-pulse" />
    <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#ff0f1b]/05 blur-[200px] rounded-full animate-pulse" style={{ animationDelay: '2s' }} />
    <div className="absolute top-[30%] left-[50%] w-[30%] h-[30%] bg-white/02 blur-[120px] rounded-full animate-pulse" style={{ animationDelay: '4s' }} />
  </div>
);

const CustomCursor = () => {
  const cursorRef = useRef(null);
  const followerRef = useRef(null);

  useEffect(() => {
    const moveCursor = (e) => {
      gsap.to(cursorRef.current, { x: e.clientX, y: e.clientY, duration: 0.1 });
      gsap.to(followerRef.current, { x: e.clientX, y: e.clientY, duration: 0.4, ease: "power2.out" });
    };
    window.addEventListener('mousemove', moveCursor);
    return () => window.removeEventListener('mousemove', moveCursor);
  }, []);

  return (
    <>
      <div ref={cursorRef} className="fixed top-0 left-0 w-2 h-2 bg-[#ff0f1b] rounded-full z-[1000] pointer-events-none -translate-x-1/2 -translate-y-1/2" />
      <div ref={followerRef} className="fixed top-0 left-0 w-8 h-8 border border-[#ff0f1b]/30 rounded-full z-[999] pointer-events-none -translate-x-1/2 -translate-y-1/2 mix-blend-difference" />
    </>
  );
};

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
        setMessage("Verification link transmitted to your neural mail.");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        onClose();
      }
    } catch (err) { setError(err.message); } finally { setLoading(false); }
  };

  if (!isOpen) return null;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[600] flex items-center justify-center bg-black/90 backdrop-blur-3xl p-6">
      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="max-w-md w-full glass-liquid p-12 rounded-[4rem] border-white/10 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#ff0f1b] to-transparent animate-pulse" />
        <button onClick={onClose} className="absolute top-8 right-8 text-white/20 hover:text-white transition-colors"><X size={24} /></button>
        
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <Fingerprint className="text-[#ff0f1b]" size={16} />
            <span className="label-luxury text-[8px]">Biometric Auth</span>
          </div>
          <h2 className="h1-cinematic text-5xl text-white">{mode === 'login' ? 'Recall Session' : 'Create Node'}</h2>
        </div>

        {message ? (
          <div className="text-center space-y-8 py-6">
            <div className="w-24 h-24 bg-[#ff0f1b]/10 rounded-[2.5rem] flex items-center justify-center mx-auto border border-[#ff0f1b]/20">
              <Mail className="text-[#ff0f1b]" size={36} />
            </div>
            <p className="text-white/50 text-xs font-medium leading-relaxed uppercase tracking-widest">{message}</p>
            <button onClick={onClose} className="w-full py-6 bg-white/5 border border-white/10 rounded-3xl text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all">Close Uplink</button>
          </div>
        ) : (
          <form onSubmit={handleAuth} className="space-y-6">
            <div className="space-y-2">
              <input type="email" required placeholder="neural.id@titan.co" className="w-full rounded-[1.5rem] py-6 px-8 text-xs outline-none bg-white/[0.03] border-white/5" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div className="space-y-2">
              <input type="password" required placeholder="access_key_••••" className="w-full rounded-[1.5rem] py-6 px-8 text-xs outline-none bg-white/[0.03] border-white/5" value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>

            {error && <div className="text-[#ff0f1b] text-[9px] font-black uppercase tracking-widest text-center py-4 bg-[#ff0f1b]/05 rounded-2xl border border-[#ff0f1b]/10">{error}</div>}

            <button disabled={loading} className="w-full py-6 bg-white text-black font-black uppercase tracking-[0.4em] text-[10px] rounded-[1.5rem] hover:bg-[#ff0f1b] hover:text-white transition-all duration-500 shadow-2xl disabled:opacity-50">
              {loading ? 'Transmitting...' : mode === 'login' ? 'Execute Login' : 'Sync New Node'}
            </button>

            <div className="text-center pt-6">
              <button type="button" onClick={() => setMode(mode === 'login' ? 'signup' : 'login')} className="text-[8px] font-black uppercase tracking-[0.4em] text-white/20 hover:text-white transition-colors">
                {mode === 'login' ? "Protocol not found? Initialize" : "Node already active? Restore"}
              </button>
            </div>
          </form>
        )}
      </motion.div>
    </motion.div>
  );
};

const Navbar = ({ onLoginClick, user }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  useEffect(() => { const handleScroll = () => setIsScrolled(window.scrollY > 30); window.addEventListener('scroll', handleScroll); return () => window.removeEventListener('scroll', handleScroll); }, []);
  
  return (
    <nav className={`fixed top-0 w-full z-[500] transition-all duration-1000 px-6 md:px-20 py-10 flex justify-between items-center ${isScrolled ? 'bg-black/60 backdrop-blur-3xl py-6 border-b border-white/5' : 'bg-transparent'}`}>
      <div className="flex items-center gap-20">
        <h1 className="text-[#ff0f1b] text-4xl font-black tracking-tighter cursor-pointer h1-cinematic text-glow-red">TITAN<span className="text-white">TV</span></h1>
        <div className="hidden xl:flex items-center gap-12">
          {['Ecosystem', 'Grid', 'Technology', 'Pricing'].map(item => (
            <a key={item} href={`#${item.toLowerCase()}`} className="text-[8px] font-black uppercase tracking-[0.5em] text-white/20 hover:text-white hover:tracking-[0.6em] transition-all duration-500">{item}</a>
          ))}
        </div>
      </div>
      
      <div className="flex items-center gap-8">
        {user ? (
          <div className="flex items-center gap-5 bg-white/05 px-8 py-3.5 rounded-full border border-white/05 group cursor-pointer hover:bg-white/10 transition-all">
            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
            <span className="text-[8px] font-black uppercase tracking-[0.3em] text-white/60">{user.email.split('@')[0]}</span>
            <button onClick={() => supabase.auth.signOut()} className="text-white/10 hover:text-[#ff0f1b] transition-colors"><Power size={14} /></button>
          </div>
        ) : (
          <button onClick={onLoginClick} className="relative group px-12 py-4 rounded-[1.2rem] bg-white text-black text-[9px] font-black uppercase tracking-[0.3em] overflow-hidden transition-transform active:scale-95">
            <span className="relative z-10 group-hover:text-white transition-colors duration-500">Authorize</span>
            <div className="absolute inset-0 bg-[#ff0f1b] translate-y-full group-hover:translate-y-0 transition-transform duration-700 ease-expo" />
          </button>
        )}
      </div>
    </nav>
  );
};

const ChannelWall = () => {
  const getL = (d) => `https://www.google.com/s2/favicons?sz=128&domain=${d}`;
  const channels = [
    { n: 'TF1', l: getL('tf1.fr') }, { n: 'BBC', l: getL('bbc.co.uk') }, { n: 'ESPN', l: getL('espn.com') }, 
    { n: 'beIN', l: getL('beinsports.com') }, { n: 'HBO', l: getL('hbo.com') }, { n: 'DAZN', l: getL('dazn.com') },
    { n: 'CANAL+', l: getL('canalplus.fr') }, { n: 'SKY', l: getL('sky.com') }, { n: 'RMC', l: getL('rmcsport.tv') },
    { n: 'FOX', l: getL('foxsports.com') }
  ];

  return (
    <div className="py-20 overflow-hidden relative skew-y-3 md:skew-y-0">
      {[0, 1].map((row) => (
        <div key={row} className={`flex gap-10 py-6 ${row === 0 ? 'animate-marquee-fluid' : 'animate-marquee-fluid-reverse'}`}>
          {[...Array(6)].map((_, gi) => (
            <React.Fragment key={gi}>
              {channels.map((ch, i) => (
                <div key={i} className="group relative w-36 h-36 md:w-56 md:h-56 glass-item rounded-[3rem] flex items-center justify-center p-10 cursor-none">
                  <img src={ch.l} alt={ch.n} className="w-full h-full object-contain filter grayscale group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-br from-[#ff0f1b]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                </div>
              ))}
            </React.Fragment>
          ))}
        </div>
      ))}
    </div>
  );
};

const FeatureCard = ({ icon, title, desc }) => (
  <div className="group p-12 glass-liquid rounded-[4rem] border-white/05 hover:border-[#ff0f1b]/30 transition-all duration-1000">
    <div className="w-20 h-20 bg-white/03 rounded-[2.5rem] flex items-center justify-center mb-10 border border-white/05 group-hover:bg-[#ff0f1b]/10 group-hover:scale-110 transition-all duration-1000">
      <div className="text-[#ff0f1b] group-hover:animate-pulse">{icon}</div>
    </div>
    <h3 className="h1-cinematic text-3xl mb-6 text-white/90">{title}</h3>
    <p className="text-white/30 text-xs font-medium leading-relaxed uppercase tracking-widest">{desc}</p>
  </div>
);

export default function App() {
  const [user, setUser] = useState(null);
  const [showAuth, setShowAuth] = useState(false);
  const [activePlan, setActivePlan] = useState(null);
  const [showCheckout, setShowCheckout] = useState(false);

  useEffect(() => {
    const lenis = new Lenis({ duration: 1.5, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
    function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
    requestAnimationFrame(raf);
    
    supabase.auth.getSession().then(({ data: { session } }) => setUser(session?.user ?? null));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => setUser(session?.user ?? null));
    return () => { subscription.unsubscribe(); lenis.destroy(); };
  }, []);

  useGSAP(() => {
    gsap.from('.reveal', { opacity: 0, y: 100, stagger: 0.2, duration: 1.5, ease: "power4.out", scrollTrigger: { trigger: '.reveal', start: 'top 80%' } });
  });

  const handlePlanSelect = (plan) => {
    if (!user) { setShowAuth(true); return; }
    setActivePlan(plan);
    setShowCheckout(true);
  };

  return (
    <main className="min-h-screen bg-[#020202] text-white selection:bg-[#ff0f1b] selection:text-white bg-aurora">
      <CustomCursor />
      <LiquidBackground />
      <Navbar onLoginClick={() => setShowAuth(true)} user={user} />

      {/* --- HERO --- */}
      <section className="relative min-h-screen flex items-center justify-center pt-32 px-6">
        <div className="container mx-auto relative z-10">
          <div className="text-center max-w-6xl mx-auto">
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 2, ease: "circOut" }}>
              <span className="inline-flex items-center gap-4 px-8 py-3 rounded-full glass-liquid mb-16 border-[#ff0f1b]/10 animate-float">
                <div className="w-2 h-2 rounded-full bg-[#ff0f1b] animate-pulse" />
                <span className="label-luxury text-[8px] text-white/60">Quantum Network 2.0 Active</span>
              </span>
              
              <h1 className="h1-cinematic text-[clamp(4rem,16vw,16rem)] mb-16 relative">
                <span className="block text-white/10 leading-none">Infinite</span>
                <span className="block text-glow-red translate-y-[-0.2em]">Stream.</span>
              </h1>

              <div className="flex flex-col md:flex-row items-center justify-center gap-10 mt-10">
                <button 
                  onClick={() => document.getElementById('pricing').scrollIntoView()}
                  className="group relative px-20 py-8 bg-[#ff0f1b] rounded-[2rem] font-black uppercase tracking-[0.5em] text-[11px] shadow-[0_30px_100px_rgba(255,15,27,0.3)] hover:scale-110 active:scale-95 transition-all duration-700"
                >
                  Initialize Protocol
                  <div className="absolute inset-0 rounded-[2rem] bg-white opacity-0 group-hover:opacity-20 transition-opacity" />
                </button>
                
                <div className="flex items-center gap-12 glass-liquid px-12 py-6 rounded-[2rem] border-white/05">
                  <div className="flex flex-col items-start">
                    <span className="h1-cinematic text-3xl">21K+</span>
                    <span className="label-luxury text-[7px] opacity-30">Nodes</span>
                  </div>
                  <div className="w-px h-10 bg-white/10" />
                  <div className="flex flex-col items-start">
                    <span className="h1-cinematic text-3xl">0.0ms</span>
                    <span className="label-luxury text-[7px] opacity-30">Jitter</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Cinematic Scanlines Overlay */}
        <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,4px_100%] opacity-20" />
      </section>

      {/* --- GRID --- */}
      <section id="grid" className="py-40 relative">
        <div className="container mx-auto px-6 md:px-20 mb-20 text-center">
          <span className="label-luxury mb-8 block">Neural Visuals</span>
          <h2 className="h1-cinematic text-7xl md:text-9xl mb-20">The Grid.</h2>
        </div>
        <ChannelWall />
      </section>

      {/* --- FEATURES --- */}
      <section id="technology" className="py-40 relative">
        <div className="container mx-auto px-6 md:px-20">
          <div className="grid md:grid-cols-3 gap-12">
            <FeatureCard icon={<Zap size={32} />} title="Flash Sync" desc="Proprietary buffering engine for instant content delivery." />
            <FeatureCard icon={<Shield size={32} />} title="Ghost VPN" desc="Integrated military-grade encryption in every stream node." />
            <FeatureCard icon={<Monitor size={32} />} title="8K Vision" desc="Uncompressed raw feeds delivered in native 8K resolution." />
          </div>
        </div>
      </section>

      {/* --- PRICING --- */}
      <section id="pricing" className="py-60 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-[#ff0f1b]/03 blur-[200px] rounded-full pointer-events-none" />
        <div className="container mx-auto px-6 md:px-20 relative z-10">
          <div className="text-center max-w-4xl mx-auto mb-40">
            <h2 className="h1-cinematic text-[clamp(3rem,10vw,12rem)] leading-none text-white/90">Select Plan.</h2>
            <p className="label-luxury text-[9px] mt-10 opacity-30">All protocols encrypted via SSL-256</p>
          </div>

          <div className="grid lg:grid-cols-3 gap-12 max-w-7xl mx-auto">
            {[
              { t: 'Standard', p: '29', f: ['4K Streaming', '2 Nodes', 'SLA 99%'] },
              { t: 'Titan Elite', p: '59', f: ['8K Native', 'Unlimited Nodes', 'Priority Feed'], featured: true },
              { t: 'Ultimate', p: '99', f: ['8K RAW', 'Custom Proxy', 'Beta Access'] }
            ].map((plan, i) => (
              <div key={i} className={`relative group p-16 rounded-[5rem] glass-liquid border-white/05 hover:border-[#ff0f1b]/40 transition-all duration-1000 ${plan.featured ? 'scale-110 z-20 bg-white/03 ring-1 ring-[#ff0f1b]/30 shadow-[0_50px_150px_-20px_rgba(255,15,27,0.2)]' : 'z-10'}`}>
                {plan.featured && <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-[#ff0f1b] text-white px-10 py-3 rounded-full text-[9px] font-black uppercase tracking-[0.4em] shadow-2xl">Elite Protocol</div>}
                <div className="mb-16">
                  <span className="label-luxury opacity-40 block mb-6">{plan.t}</span>
                  <div className="flex items-baseline gap-2">
                    <span className="h1-cinematic text-8xl group-hover:text-[#ff0f1b] transition-colors duration-1000">${plan.p}</span>
                    <span className="text-white/10 text-[11px] font-black uppercase tracking-widest">/ Year</span>
                  </div>
                </div>
                <div className="space-y-6 mb-20">
                  {plan.f.map((feat, fi) => (
                    <div key={fi} className="flex items-center gap-6 group/item">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#ff0f1b] opacity-30 group-hover/item:opacity-100 transition-opacity" />
                      <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 group-hover/item:text-white transition-colors">{feat}</span>
                    </div>
                  ))}
                </div>
                <button onClick={() => handlePlanSelect(plan)} className={`w-full py-7 rounded-[2.5rem] font-black uppercase tracking-[0.4em] text-[10px] transition-all duration-700 ${plan.featured ? 'bg-[#ff0f1b] text-white shadow-3xl hover:bg-white hover:text-black' : 'bg-white/05 hover:bg-white hover:text-black border border-white/10'}`}>Initialize Sync</button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="py-40 bg-black/80 relative z-10 border-t border-white/05">
        <div className="container mx-auto px-6 md:px-20">
          <div className="flex flex-col md:flex-row justify-between items-center gap-32">
            <h1 className="h1-cinematic text-6xl text-[#ff0f1b] text-glow-red">TITAN<span className="text-white">TV</span></h1>
            <div className="flex gap-24">
              {['Network', 'Legal', 'Social'].map((cat) => (
                <div key={cat} className="flex flex-col gap-10">
                  <span className="label-luxury opacity-30">{cat}</span>
                  <div className="flex flex-col gap-5 text-[10px] font-black uppercase tracking-[0.3em] text-white/40">
                    <a href="#" className="hover:text-[#ff0f1b] transition-colors">Uplink Status</a>
                    <a href="#" className="hover:text-[#ff0f1b] transition-colors">Global Nodes</a>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-40 pt-20 border-t border-white/05 flex flex-col md:flex-row justify-between items-center opacity-20">
            <span className="label-luxury text-[7px]">© 2026 TITAN CORE SYSTEMS. ALL TRANSMISSIONS ENCRYPTED.</span>
            <div className="flex gap-10">
              <StripeIcon size={20} /><Fingerprint size={20} /><ShieldAlert size={20} />
            </div>
          </div>
        </div>
      </footer>

      {/* --- MODALS --- */}
      <AnimatePresence>
        {showAuth && <AuthModal isOpen={showAuth} onClose={() => setShowAuth(false)} />}
        {showCheckout && activePlan && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[700] flex items-center justify-center bg-black/98 backdrop-blur-3xl p-6">
            <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="max-w-md w-full glass-liquid p-16 rounded-[5rem] border-white/10 relative text-center bg-black/80">
              <button onClick={() => setShowCheckout(false)} className="absolute top-12 right-12 text-white/20 hover:text-white transition-colors"><X size={32} /></button>
              <div className="w-24 h-24 bg-[#ff0f1b]/10 rounded-[3rem] flex items-center justify-center mx-auto mb-12 border border-[#ff0f1b]/20"><Crown className="text-[#ff0f1b]" size={40} /></div>
              <h2 className="h1-cinematic text-5xl mb-6">Finalize.</h2>
              <p className="label-luxury opacity-40 mb-12">Securing ${activePlan.price} transaction</p>
              <button onClick={handleStripeCheckout} className="w-full py-8 bg-white text-black font-black uppercase tracking-[0.5em] text-[11px] rounded-[2.5rem] hover:bg-[#ff0f1b] hover:text-white transition-all duration-700 shadow-[0_30px_100px_rgba(255,255,255,0.1)]">Sync with Stripe</button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
