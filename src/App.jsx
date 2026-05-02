import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, Menu, Mail, Power, Signal, Video, Shield, Zap, 
  Activity, Crown, ChevronRight, ArrowRight, Play, Star, 
  Smartphone, Tv, CheckCircle2, Monitor, Lock, AlertCircle,
  Copy, Check
} from 'lucide-react';
import confetti from 'canvas-confetti';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { supabase } from './lib/supabase';

gsap.registerPlugin(ScrollTrigger);

// --- Global Visual Assets ---

const Orbs = () => (
  <div className="fixed inset-0 z-[-1] pointer-events-none overflow-hidden">
    <div className="orb w-[80vw] h-[80vw] bg-[#00f2ff]/10 top-[-20%] left-[-10%]" />
    <div className="orb w-[60vw] h-[60vw] bg-[#7000ff]/10 bottom-[-10%] right-[-10%]" style={{ animationDelay: '-10s' }} />
  </div>
);

// --- Components ---

const Navbar = ({ onAuthOpen, user }) => (
  <nav className="fixed top-0 w-full z-[500] px-6 md:px-16 py-8 flex justify-between items-center transition-all duration-700">
    <h1 className="hero-title text-4xl text-[#00f2ff]">TITAN<span className="text-white">TV</span></h1>
    <div className="flex items-center gap-8">
      {user ? (
        <div className="flex items-center gap-4 bg-white/5 px-6 py-2 rounded-full border border-white/10">
          <div className={`w-1.5 h-1.5 rounded-full ${user.email_confirmed_at ? 'bg-green-500' : 'bg-yellow-500 animate-pulse'}`} />
          <span className="text-[10px] font-bold uppercase tracking-widest text-white/60">{user.email.split('@')[0]}</span>
          <button onClick={() => supabase.auth.signOut()} className="text-white/20 hover:text-[#00f2ff] transition-colors"><Power size={14} /></button>
        </div>
      ) : (
        <button onClick={onAuthOpen} className="label-futur text-white hover:text-[#00f2ff] transition-colors">Sign In</button>
      )}
      {!user && <button onClick={onAuthOpen} className="bg-[#00f2ff] text-black px-10 py-3 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-[0_0_30px_rgba(0,242,255,0.3)]">Get Access</button>}
    </div>
  </nav>
);

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
    try {
      if (mode === 'signup') {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        setMessage("Vérifiez vos e-mails ! Cliquez sur le lien pour activer votre accès.");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        onClose();
      }
    } catch (err) { setError(err.message); } finally { setLoading(false); }
  };

  if (!isOpen) return null;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[700] flex items-center justify-center bg-black/98 backdrop-blur-3xl p-6">
      <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="max-w-md w-full glass-card p-12 rounded-[3rem] relative">
        <button onClick={onClose} className="absolute top-8 right-8 text-white/20 hover:text-white"><X size={24} /></button>
        <div className="mb-12 text-center">
          <h2 className="hero-title text-5xl mb-4">{mode === 'login' ? 'Login' : 'Join Us'}</h2>
          <p className="label-futur opacity-40">Industrial Grade IPTV</p>
        </div>

        {message ? (
          <div className="text-center py-10 space-y-8">
            <div className="w-20 h-20 bg-[#00f2ff]/10 rounded-full flex items-center justify-center mx-auto border border-[#00f2ff]/20 animate-bounce">
              <Mail className="text-[#00f2ff]" size={32} />
            </div>
            <p className="text-white/60 text-sm font-medium leading-relaxed">{message}</p>
            <button onClick={onClose} className="w-full py-4 bg-[#00f2ff] text-black font-bold rounded-2xl text-[10px] uppercase tracking-widest">Fermer</button>
          </div>
        ) : (
          <form onSubmit={handleAuth} className="space-y-6">
            <input type="email" required placeholder="Email" className="w-full rounded-2xl py-5 px-8 text-sm outline-none bg-white/5 border border-white/10 focus:border-[#00f2ff] transition-all" value={email} onChange={(e) => setEmail(e.target.value)} />
            <input type="password" required placeholder="Password" className="w-full rounded-2xl py-5 px-8 text-sm outline-none bg-white/5 border border-white/10 focus:border-[#00f2ff] transition-all" value={password} onChange={(e) => setPassword(e.target.value)} />
            {error && <div className="text-[#00f2ff] text-[10px] text-center font-bold uppercase tracking-widest">{error}</div>}
            <button disabled={loading} className="w-full py-5 bg-[#00f2ff] text-black rounded-2xl font-black uppercase tracking-widest text-[11px] shadow-2xl disabled:opacity-50">
              {loading ? 'Processing...' : mode === 'login' ? 'Enter Network' : 'Create Node'}
            </button>
            <div className="text-center pt-6">
              <button type="button" onClick={() => setMode(mode === 'login' ? 'signup' : 'login')} className="label-futur text-[8px] opacity-20 hover:opacity-100 transition-all">
                {mode === 'login' ? "New? Sync Node" : "Existing? Login"}
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
  const [iptvCode, setIptvCode] = useState(null);
  const [copySuccess, setCopySuccess] = useState(false);

  useEffect(() => {
    const lenis = new Lenis({ duration: 1.2 });
    function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
    requestAnimationFrame(raf);
    supabase.auth.getSession().then(({ data: { session } }) => setUser(session?.user ?? null));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => setUser(session?.user ?? null));
    return () => { subscription.unsubscribe(); lenis.destroy(); };
  }, []);

  const handleCheckout = () => {
    const code = Math.random().toString(36).substring(2, 10).toUpperCase();
    setIptvCode(code);
    confetti({ particleCount: 300, spread: 90, origin: { y: 0.6 } });
    setCheckoutOpen(false);
  };

  const copyCode = () => {
    navigator.clipboard.writeText(iptvCode);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  const isConfirmed = user && user.email_confirmed_at;

  return (
    <main className="min-h-screen bg-[#020202] text-white">
      <Orbs />
      <Navbar onAuthOpen={() => setAuthOpen(true)} user={user} />

      {/* --- HERO --- */}
      <section className="relative min-h-screen flex items-center justify-center pt-20 px-6">
        <div className="container mx-auto text-center max-w-6xl">
          <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }}>
            <span className="label-futur mb-10 block animate-pulse">TITAN SYSTEM V4.0</span>
            <h1 className="hero-title text-[clamp(3.5rem,12vw,14rem)] mb-12">
              Futuristic <br /> <span className="text-gradient">Television.</span>
            </h1>
            
            {!user ? (
              <button onClick={() => setAuthOpen(true)} className="bg-[#00f2ff] text-black px-16 py-6 rounded-full font-black uppercase tracking-[0.3em] text-xs hover:scale-105 transition-all shadow-[0_0_50px_rgba(0,242,255,0.4)]">
                Start Neural Sync
              </button>
            ) : !isConfirmed ? (
              <div className="glass-card p-10 max-w-xl mx-auto rounded-[3rem] border-yellow-500/20 bg-yellow-500/05">
                <AlertCircle className="mx-auto mb-6 text-yellow-500" size={48} />
                <h3 className="hero-title text-2xl mb-4">Confirmation Requise</h3>
                <p className="text-white/40 text-sm mb-8 leading-relaxed">Veuillez cliquer sur le lien dans l'e-mail que nous venons de vous envoyer pour activer votre accès.</p>
                <div className="flex justify-center gap-4">
                  <button onClick={() => supabase.auth.signOut()} className="text-[10px] font-bold uppercase tracking-widest opacity-30 hover:opacity-100 transition-all">Sign Out</button>
                </div>
              </div>
            ) : (
              <div className="space-y-12">
                <div className="flex justify-center items-center gap-10">
                  <div className="text-left">
                    <span className="label-futur opacity-30 text-[8px]">Uplink Status</span>
                    <h4 className="text-2xl font-bold">Synchronized</h4>
                  </div>
                  <div className="w-px h-12 bg-white/10" />
                  <div className="text-left">
                    <span className="label-futur opacity-30 text-[8px]">Network Node</span>
                    <h4 className="text-2xl font-bold">#214-X Active</h4>
                  </div>
                </div>
                <button 
                  onClick={() => document.getElementById('pricing').scrollIntoView()}
                  className="bg-white text-black px-16 py-6 rounded-full font-black uppercase tracking-[0.3em] text-xs hover:bg-[#00f2ff] transition-all"
                >
                  Configure Plan
                </button>
              </div>
            )}
          </motion.div>
        </div>
      </section>

      {/* --- SHOWCASE --- */}
      <section className="py-40 bg-black/40 border-y border-white/5">
        <div className="container mx-auto px-6">
          <div className="glass-card p-4 rounded-[4rem] relative overflow-hidden group">
            <img 
              src="https://images.unsplash.com/photo-1593784991095-a205069470b6?auto=format&fit=crop&w=1920&q=80" 
              className="rounded-[3rem] w-full brightness-50 group-hover:scale-105 transition-all duration-[3000ms]" 
              alt="IPTV"
            />
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-10">
              <h2 className="hero-title text-4xl md:text-7xl mb-6">Immersive Vision.</h2>
              <p className="label-futur opacity-60">RAW 8K FEED / ZERO LATENCY</p>
            </div>
          </div>
        </div>
      </section>

      {/* --- PRICING (Blocked if not confirmed) --- */}
      <section id="pricing" className={`py-40 px-6 relative transition-all duration-1000 ${!isConfirmed ? 'opacity-20 pointer-events-none blur-xl' : 'opacity-100'}`}>
        <div className="container mx-auto">
          <div className="text-center mb-32">
            <h2 className="hero-title text-6xl md:text-8xl mb-6">Pricing.</h2>
            <p className="label-futur opacity-40">Select Access Level</p>
          </div>

          <div className="grid md:grid-cols-3 gap-10 max-w-7xl mx-auto">
            {[
              { t: 'Standard', p: '29', f: ['4K Feed', '1 Device', 'Standard SLA'] },
              { t: 'Elite', p: '59', f: ['8K RAW Feed', '3 Devices', 'Priority Support', 'Anti-Buffer'], featured: true },
              { t: 'Infinite', p: '99', f: ['Uncompressed RAW', '5 Devices', 'Proxy DNS', 'Beta Access'] }
            ].map((plan, i) => (
              <div key={i} className={`glass-card p-16 rounded-[4rem] flex flex-col ${plan.featured ? 'md:scale-110 border-[#00f2ff]/40 shadow-[0_0_100px_rgba(0,242,255,0.1)]' : ''}`}>
                <h3 className="hero-title text-2xl mb-8 opacity-40">{plan.t}</h3>
                <div className="flex items-baseline gap-4 mb-12">
                  <span className="hero-title text-7xl">${plan.p}</span>
                  <span className="label-futur opacity-20">/ Year</span>
                </div>
                <div className="space-y-6 mb-20 flex-grow">
                  {plan.f.map((feat, fi) => (
                    <div key={fi} className="flex items-center gap-4">
                      <CheckCircle2 size={16} className="text-[#00f2ff]" />
                      <span className="text-[10px] font-bold uppercase tracking-widest text-white/60">{feat}</span>
                    </div>
                  ))}
                </div>
                <button onClick={() => { setActivePlan(plan); setCheckoutOpen(true); }} className={`w-full py-6 rounded-3xl font-black uppercase tracking-widest text-[10px] transition-all ${plan.featured ? 'bg-[#00f2ff] text-black hover:bg-white' : 'bg-white/5 hover:bg-white hover:text-black'}`}>Get Display</button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="py-40 border-t border-white/5">
        <div className="container mx-auto px-6 text-center">
          <h1 className="hero-title text-6xl text-[#00f2ff] mb-20">TITAN<span className="text-white">TV</span></h1>
          <p className="label-futur opacity-20 text-[8px]">© 2026 TITAN CORE / NEURAL STREAMING SYSTEMS</p>
        </div>
      </footer>

      {/* --- MODALS --- */}
      <AnimatePresence>
        {authOpen && <AuthModal isOpen={authOpen} onClose={() => setAuthOpen(false)} />}
        {checkoutOpen && activePlan && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[700] flex items-center justify-center bg-black/98 backdrop-blur-3xl p-6">
            <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="max-w-md w-full glass-card p-16 rounded-[4rem] relative text-center">
              <button onClick={() => setCheckoutOpen(false)} className="absolute top-10 right-10 text-white/20 hover:text-white"><X size={32} /></button>
              <div className="w-24 h-24 bg-[#00f2ff]/10 rounded-full flex items-center justify-center mx-auto mb-12 border border-[#00f2ff]/20 animate-pulse"><Crown className="text-[#00f2ff]" size={48} /></div>
              <h2 className="hero-title text-4xl mb-6">Payment.</h2>
              <p className="label-futur opacity-40 mb-16">Syncing ${activePlan.price} through Stripe</p>
              <button onClick={handleCheckout} className="w-full py-6 bg-white text-black font-black uppercase tracking-widest rounded-3xl text-[10px] shadow-2xl hover:bg-[#00f2ff] transition-all">Payer Maintenant</button>
            </motion.div>
          </motion.div>
        )}
        {iptvCode && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[800] flex items-center justify-center bg-black/98 backdrop-blur-3xl p-6">
            <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="max-w-xl w-full glass-card p-20 rounded-[5rem] relative text-center border-[#00f2ff]/30 shadow-[0_0_150px_rgba(0,242,255,0.2)]">
              <div className="w-24 h-24 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-10"><CheckCircle2 className="text-green-500" size={48} /></div>
              <h2 className="hero-title text-5xl mb-6 text-green-500">Succès !</h2>
              <p className="label-futur opacity-40 mb-12">Votre code IPTV est prêt.</p>
              <div className="bg-white/5 p-10 rounded-[2.5rem] border border-white/10 mb-12 flex items-center justify-between group cursor-pointer hover:bg-white/10 transition-all" onClick={copyCode}>
                <span className="hero-title text-5xl tracking-[0.2em]">{iptvCode}</span>
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-white/40 group-hover:text-white transition-all">
                  {copySuccess ? <Check size={32} className="text-green-500" /> : <Copy size={32} />}
                </div>
              </div>
              <p className="text-[9px] font-bold uppercase tracking-widest text-white/20">Veuillez noter ce code précieusement pour l'activer sur votre application.</p>
              <button onClick={() => setIptvCode(null)} className="mt-12 label-futur text-white/40 hover:text-white transition-all">Quitter le tunnel</button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
