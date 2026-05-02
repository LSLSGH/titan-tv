import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, Menu, Mail, Power, Signal, Video, Shield, Zap, Globe as Earth,
  Activity, Crown, Bitcoin, ShieldAlert, Fingerprint, Lock,
  ChevronRight, ArrowRight, Play, Star, Smartphone, Tv, Cpu
} from 'lucide-react';
import confetti from 'canvas-confetti';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { supabase } from './lib/supabase';

gsap.registerPlugin(ScrollTrigger);

// --- Global Visual Infrastructure ---

const MasterOverlay = () => (
  <>
    <div className="noise-overlay" />
    <div className="cinematic-vignette" />
    <div className="fixed inset-0 z-[-1] pointer-events-none overflow-hidden bg-[#020202]">
      <div className="absolute top-[-20%] right-[-10%] w-[100vw] h-[100vw] bg-[#ff0f1b]/10 blur-[250px] rounded-full animate-pulse" />
      <div className="absolute bottom-[-20%] left-[-10%] w-[80vw] h-[80vw] bg-[#ff0f1b]/05 blur-[200px] rounded-full animate-pulse" style={{ animationDelay: '-5s' }} />
    </div>
  </>
);

const CustomCursor = () => {
  const cursorRef = useRef(null);
  const ringRef = useRef(null);

  useEffect(() => {
    const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    if (isTouch) return;
    const move = (e) => {
      gsap.to(cursorRef.current, { x: e.clientX, y: e.clientY, duration: 0.1 });
      gsap.to(ringRef.current, { x: e.clientX, y: e.clientY, duration: 0.6, ease: "power4.out" });
    };
    window.addEventListener('mousemove', move);
    return () => window.removeEventListener('mousemove', move);
  }, []);

  return (
    <div className="hidden md:block pointer-events-none">
      <div ref={cursorRef} className="fixed top-0 left-0 w-1.5 h-1.5 bg-[#ff0f1b] rounded-full z-[1000] -translate-x-1/2 -translate-y-1/2 shadow-[0_0_15px_#ff0f1b]" />
      <div ref={ringRef} className="fixed top-0 left-0 w-12 h-12 border border-[#ff0f1b]/30 rounded-full z-[999] -translate-x-1/2 -translate-y-1/2 mix-blend-difference" />
    </div>
  );
};

// --- Core Components ---

const Navbar = ({ onAuthOpen, user }) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);

  useEffect(() => {
    const handle = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handle);
    return () => window.removeEventListener('scroll', handle);
  }, []);

  return (
    <>
      <nav className={`fixed top-0 w-full z-[500] px-6 md:px-16 py-8 md:py-12 transition-all duration-1000 flex justify-between items-center ${scrolled ? 'bg-black/60 backdrop-blur-3xl py-6 border-b border-white/5' : ''}`}>
        <div className="flex items-center gap-20">
          <h1 className="h1-mega text-3xl md:text-5xl text-[#ff0f1b] glow-red-text cursor-pointer">TITAN<span className="text-white">TV</span></h1>
          <div className="hidden xl:flex items-center gap-12">
            {['Infrastructure', 'Pricing', 'Network'].map(item => (
              <a key={item} href={`#${item.toLowerCase()}`} className="label-pro text-[8px] opacity-40 hover:opacity-100 transition-all">{item}</a>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-6">
          {user ? (
            <div className="flex items-center gap-5 glass-ultra px-8 py-3 rounded-2xl group cursor-pointer">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="label-pro text-[8px] text-white/60">{user.email.split('@')[0]}</span>
              <button onClick={() => supabase.auth.signOut()} className="text-white/20 hover:text-[#ff0f1b] transition-colors"><Power size={14} /></button>
            </div>
          ) : (
            <button onClick={onAuthOpen} className="relative group px-10 py-4 bg-white text-black rounded-2xl overflow-hidden shadow-2xl transition-transform active:scale-95">
              <span className="relative z-10 label-pro text-black text-[9px] font-black group-hover:text-white transition-colors duration-500">Authorize</span>
              <div className="absolute inset-0 bg-[#ff0f1b] translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
            </button>
          )}
          <button onClick={() => setMobileMenu(true)} className="xl:hidden text-white/50 hover:text-white"><Menu size={28} /></button>
        </div>
      </nav>

      <AnimatePresence>
        {mobileMenu && (
          <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} className="fixed inset-0 z-[600] bg-black/98 backdrop-blur-3xl flex flex-col p-12">
            <div className="flex justify-between items-center mb-24">
              <h1 className="h1-mega text-4xl text-[#ff0f1b]">TITAN<span className="text-white">TV</span></h1>
              <button onClick={() => setMobileMenu(false)} className="text-white/30"><X size={36} /></button>
            </div>
            <div className="flex flex-col gap-12">
              {['Infrastructure', 'Pricing', 'Network'].map(item => (
                <a key={item} href={`#${item.toLowerCase()}`} onClick={() => setMobileMenu(false)} className="h1-mega text-6xl text-white/20 hover:text-[#ff0f1b] transition-all">{item}.</a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
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
        setMessage("Verification neural-link transmitted. Check your mail.");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        onClose();
      }
    } catch (err) { setError(err.message); } finally { setLoading(false); }
  };

  if (!isOpen) return null;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[700] flex items-center justify-center bg-black/95 backdrop-blur-3xl p-6">
      <motion.div initial={{ scale: 0.9, y: 50 }} animate={{ scale: 1, y: 0 }} className="max-w-xl w-full glass-ultra p-12 md:p-20 rounded-[4rem] border-white/5 relative overflow-hidden">
        <div className="scanline" />
        <button onClick={onClose} className="absolute top-12 right-12 text-white/20 hover:text-white transition-colors"><X size={32} /></button>
        
        <div className="mb-16">
          <span className="label-pro mb-8 block">Project Authorization</span>
          <h2 className="h1-mega text-5xl md:text-7xl mb-4">{mode === 'login' ? 'Recall.' : 'Initialize.'}</h2>
          <p className="text-white/30 text-xs font-medium uppercase tracking-widest">Global Neural Network v4.0</p>
        </div>

        {message ? (
          <div className="text-center py-12 space-y-12">
            <div className="w-24 h-24 bg-[#ff0f1b]/10 rounded-[3rem] flex items-center justify-center mx-auto border border-[#ff0f1b]/20 shadow-[0_0_50px_rgba(255,15,27,0.2)]">
              <Mail className="text-[#ff0f1b]" size={48} />
            </div>
            <p className="label-pro text-white/60 leading-loose">{message}</p>
            <button onClick={onClose} className="w-full py-8 glass-ultra rounded-3xl label-pro text-white hover:bg-white/5 transition-all">Close Uplink</button>
          </div>
        ) : (
          <form onSubmit={handleAuth} className="space-y-8">
            <div className="space-y-2">
              <input type="email" required placeholder="neural.id@titan.io" className="w-full rounded-[2rem] py-8 px-10 text-xs outline-none bg-white/[0.02] border border-white/5 focus:border-[#ff0f1b] transition-all" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div className="space-y-2">
              <input type="password" required placeholder="access_key_••••" className="w-full rounded-[2rem] py-8 px-10 text-xs outline-none bg-white/[0.02] border border-white/5 focus:border-[#ff0f1b] transition-all" value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>

            {error && <div className="text-[#ff0f1b] label-pro text-[8px] text-center bg-[#ff0f1b]/05 py-4 rounded-2xl border border-[#ff0f1b]/10">{error}</div>}

            <button disabled={loading} className="w-full py-8 bg-white text-black label-pro text-[10px] font-black rounded-[2rem] shadow-2xl hover:bg-[#ff0f1b] hover:text-white transition-all duration-700 disabled:opacity-50">
              {loading ? 'Transmitting...' : mode === 'login' ? 'Establish Link' : 'Sync New Node'}
            </button>

            <div className="text-center pt-8">
              <button type="button" onClick={() => setMode(mode === 'login' ? 'signup' : 'login')} className="label-pro text-[7px] text-white/20 hover:text-white hover:opacity-100 transition-all">
                {mode === 'login' ? "Node not found? Initialize" : "Active node? Recall session"}
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
  const [authOpen, setAuthOpen] = useState(false);
  const [activePlan, setActivePlan] = useState(null);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const heroRef = useRef(null);

  useEffect(() => {
    const lenis = new Lenis({ duration: 1.5, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
    function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
    requestAnimationFrame(raf);
    supabase.auth.getSession().then(({ data: { session } }) => setUser(session?.user ?? null));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => setUser(session?.user ?? null));
    return () => { subscription.unsubscribe(); lenis.destroy(); };
  }, []);

  useGSAP(() => {
    gsap.utils.toArray('.reveal').forEach((el) => {
      gsap.from(el, { y: 100, opacity: 0, duration: 2, ease: "power4.out", scrollTrigger: { trigger: el, start: "top 90%" } });
    });
    gsap.to('.hero-parallax', { yPercent: 30, ease: "none", scrollTrigger: { trigger: heroRef.current, start: "top top", end: "bottom top", scrub: true } });
  }, { scope: heroRef });

  const handlePlan = (plan) => {
    if (!user) { setAuthOpen(true); return; }
    setActivePlan(plan);
    setCheckoutOpen(true);
  };

  return (
    <main className="min-h-screen bg-[#020202] text-white selection:bg-[#ff0f1b] selection:text-white">
      <CustomCursor />
      <MasterOverlay />
      <Navbar onAuthOpen={() => setAuthOpen(true)} user={user} />

      {/* --- GOD HERO --- */}
      <section ref={heroRef} className="relative min-h-screen flex items-center pt-40 px-6 md:px-16 overflow-hidden">
        <div className="container mx-auto grid lg:grid-cols-2 gap-20 items-center relative z-10">
          <div className="reveal">
            <span className="label-pro inline-flex items-center gap-4 mb-16 px-10 py-4 glass-ultra rounded-full border-[#ff0f1b]/20">
              <Signal size={16} className="animate-pulse" /> Neural Network Active
            </span>
            <h1 className="h1-mega text-[clamp(4.5rem,14vw,18rem)] mb-16 relative">
              <span className="block text-white/20 leading-[0.7] hero-parallax">The</span>
              <span className="block text-white glow-red-text translate-y-[-0.15em] hero-parallax" style={{ animationDelay: '0.2s' }}>Future.</span>
            </h1>
            <p className="text-white/40 text-lg md:text-xl max-w-2xl mb-20 font-medium leading-relaxed uppercase tracking-widest">
              Unrivaled stability. Industrial grade encryption. 
              21,000+ Edge Nodes delivering uncompressed 8K RAW streams.
            </p>
            <div className="flex flex-wrap gap-12">
              <button 
                onClick={() => document.getElementById('pricing').scrollIntoView()}
                className="group relative px-20 py-10 bg-[#ff0f1b] rounded-[2.5rem] label-pro text-white shadow-[0_50px_100px_rgba(255,15,27,0.4)] hover:scale-110 active:scale-95 transition-all duration-1000"
              >
                Sync Network
                <div className="absolute inset-0 rounded-[2.5rem] bg-white opacity-0 group-hover:opacity-20 transition-opacity" />
              </button>
              
              <div className="flex items-center gap-12 glass-ultra px-16 py-8 rounded-[3rem]">
                <div className="flex flex-col">
                  <span className="h1-mega text-4xl">8K</span>
                  <span className="label-pro text-[7px] opacity-30">Raw Stream</span>
                </div>
                <div className="w-px h-16 bg-white/10" />
                <div className="flex flex-col">
                  <span className="h1-mega text-4xl">21K</span>
                  <span className="label-pro text-[7px] opacity-30">Global Nodes</span>
                </div>
              </div>
            </div>
          </div>

          <div className="hidden lg:block relative reveal hero-parallax">
            <div className="relative aspect-[4/3] glass-ultra rounded-[6rem] border-white/10 overflow-hidden shadow-[0_100px_200px_-50px_rgba(0,0,0,1)] group">
              <img 
                src="https://images.unsplash.com/photo-1593784991095-a205069470b6?auto=format&fit=crop&w=1920&q=80" 
                className="w-full h-full object-cover saturate-[1.8] brightness-50 group-hover:scale-110 transition-all duration-[3000ms]" 
                alt="Titan TV"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#020202] via-transparent to-transparent opacity-80" />
              <div className="absolute bottom-20 left-20">
                <div className="flex items-center gap-6 glass-ultra p-6 rounded-[2.5rem] border-white/20 animate-float">
                  <div className="w-16 h-16 rounded-[1.5rem] bg-[#ff0f1b]/20 flex items-center justify-center"><Activity size={32} className="text-[#ff0f1b]" /></div>
                  <div className="flex flex-col">
                    <span className="label-pro text-white">Live Node 412</span>
                    <span className="text-[11px] font-black uppercase tracking-widest text-white/40">Status: Optimized</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- BENTO MASTER --- */}
      <section id="infrastructure" className="py-60 px-6 md:px-16 relative">
        <div className="container mx-auto">
          <div className="mb-40 max-w-5xl">
            <span className="label-pro mb-10 block">System Architecture</span>
            <h2 className="h1-mega text-7xl md:text-[12rem] mb-12">The Tech.</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12">
            {[
              { t: 'Neural Sync', v: '0.0ms', d: 'Proprietary Zero-Buffer technology.', s: 'md:col-span-8', i: <Zap /> },
              { t: 'Vision', v: 'RAW', d: 'Uncompressed feed delivery.', s: 'md:col-span-4', i: <Video /> },
              { t: 'Shield', v: 'AES-GCM', d: 'Military grade encryption.', s: 'md:col-span-4', i: <Lock /> },
              { t: 'Coverage', v: 'Global', d: 'Worldwide edge node mesh.', s: 'md:col-span-8', i: <Earth /> }
            ].map((f, i) => (
              <div key={i} className={`glass-card reveal ${f.s} p-12 md:p-16 rounded-[4rem] group`}>
                <div className="flex justify-between items-start mb-24">
                  <div className="w-24 h-24 bg-white/03 rounded-[2.5rem] flex items-center justify-center border border-white/05 group-hover:bg-[#ff0f1b]/20 group-hover:scale-110 transition-all duration-1000 text-[#ff0f1b]">{f.i}</div>
                  <span className="h1-mega text-6xl text-white/10 group-hover:text-[#ff0f1b] transition-all duration-1000">{f.v}</span>
                </div>
                <h3 className="h1-mega text-4xl mb-6">{f.t}</h3>
                <p className="label-pro opacity-30">{f.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- PRICING GOD --- */}
      <section id="pricing" className="py-60 px-6 md:px-16 relative overflow-hidden">
        <div className="container mx-auto">
          <div className="text-center max-w-6xl mx-auto mb-60">
            <span className="label-pro mb-10 block">Protocol Access</span>
            <h2 className="h1-mega text-[clamp(4rem,12vw,14rem)] leading-none mb-12">Choose Level.</h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 max-w-7xl mx-auto">
            {[
              { t: 'Standard', p: '29', f: ['4K Streaming', '2 Nodes Active', 'SLA 99.9%'] },
              { t: 'Titan Master', p: '59', f: ['8K RAW Native', 'Unlimited Nodes', 'Priority Uplink', 'Zero Latency'], featured: true },
              { t: 'God Mode', p: '99', f: ['8K Uncompressed', 'Custom DNS Access', 'Beta Features', 'VOD 200K+'] }
            ].map((plan, i) => (
              <div key={i} className={`relative group p-16 rounded-[5rem] glass-ultra border-white/05 transition-all duration-1000 ${plan.featured ? 'lg:scale-110 z-20 border-[#ff0f1b]/40 shadow-[0_80px_150px_-30px_rgba(255,15,27,0.3)]' : 'z-10 hover:border-white/20'}`}>
                {plan.featured && <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-[#ff0f1b] text-white px-12 py-4 rounded-full label-pro text-[10px] shadow-3xl">Elite Protocol</div>}
                <div className="mb-20">
                  <span className="label-pro opacity-30 block mb-6">{plan.t}</span>
                  <div className="flex items-baseline gap-4">
                    <span className="h1-mega text-8xl group-hover:text-[#ff0f1b] transition-colors duration-1000">${plan.p}</span>
                    <span className="label-pro text-[10px] opacity-10">/ Year</span>
                  </div>
                </div>
                <div className="space-y-8 mb-32">
                  {plan.f.map((feat, fi) => (
                    <div key={fi} className="flex items-center gap-8 group/item">
                      <div className="w-2 h-2 rounded-full bg-[#ff0f1b] opacity-20 group-hover/item:opacity-100 transition-opacity" />
                      <span className="label-pro text-[10px] opacity-30 group-hover/item:opacity-100 transition-opacity">{feat}</span>
                    </div>
                  ))}
                </div>
                <button onClick={() => handlePlan(plan)} className={`w-full py-8 rounded-[2.5rem] label-pro text-[10px] transition-all duration-1000 ${plan.featured ? 'bg-[#ff0f1b] text-white hover:bg-white hover:text-black' : 'bg-white/05 hover:bg-white hover:text-black border border-white/10'}`}>Initialize Sync</button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="py-60 bg-[#010101] border-t border-white/05">
        <div className="container mx-auto px-6 md:px-16 text-center">
          <h1 className="h1-mega text-[clamp(4rem,15vw,15rem)] text-[#ff0f1b] glow-red-text mb-40">TITAN<span className="text-white">TV</span></h1>
          <div className="flex flex-wrap justify-center gap-32 mb-40">
            {['Network', 'Legal', 'Syndicate'].map(cat => (
              <div key={cat} className="flex flex-col gap-10">
                <span className="label-pro opacity-30">{cat}</span>
                <div className="flex flex-col gap-6 text-[10px] font-black uppercase tracking-[0.5em] text-white/40">
                  <a href="#" className="hover:text-white transition-colors">Protocol Status</a>
                  <a href="#" className="hover:text-white transition-colors">Global Grid</a>
                </div>
              </div>
            ))}
          </div>
          <div className="pt-20 border-t border-white/05 flex flex-col md:flex-row justify-between items-center opacity-20 gap-12">
            <span className="label-pro text-[8px]">© 2026 TITAN CORE SYNDICATE. ALL TRANSMISSIONS ENCRYPTED.</span>
            <div className="flex gap-12"><Bitcoin size={24} /><ShieldAlert size={24} /><Fingerprint size={24} /></div>
          </div>
        </div>
      </footer>

      {/* --- MODALS --- */}
      <AnimatePresence>
        {authOpen && <AuthModal isOpen={authOpen} onClose={() => setAuthOpen(false)} />}
        {checkoutOpen && activePlan && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[800] flex items-center justify-center bg-black/98 backdrop-blur-3xl p-6">
            <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="max-w-xl w-full glass-ultra p-20 rounded-[5rem] relative text-center">
              <button onClick={() => setCheckoutOpen(false)} className="absolute top-12 right-12 text-white/20 hover:text-white"><X size={40} /></button>
              <div className="w-32 h-32 bg-[#ff0f1b]/10 rounded-[4rem] flex items-center justify-center mx-auto mb-16 border border-[#ff0f1b]/20 shadow-[0_0_100px_rgba(255,15,27,0.3)]"><Crown className="text-[#ff0f1b]" size={64} /></div>
              <h2 className="h1-mega text-6xl mb-8">Authorize.</h2>
              <p className="label-pro opacity-40 mb-20 leading-loose">Establishing secure Stripe tunnel for ${activePlan.price}/Year</p>
              <button onClick={() => { confetti({ particleCount: 300, spread: 100, origin: { y: 0.6 } }); setCheckoutOpen(false); }} className="w-full py-10 bg-white text-black label-pro text-[12px] font-black rounded-[3rem] shadow-2xl hover:bg-[#ff0f1b] hover:text-white transition-all duration-1000">Pay with Stripe</button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
