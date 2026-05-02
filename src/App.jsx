import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, Menu, Mail, Power, Signal, Video, Shield, Zap, Globe as Earth,
  Activity, Crown, ChevronRight, ArrowRight, Play, Star, Smartphone, Tv, 
  CheckCircle2, Globe, ShieldCheck, Zap as ZapIcon, FastForward, Target, 
  Heart, Share2, Award, Headphones, Monitor
} from 'lucide-react';
import confetti from 'canvas-confetti';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { supabase } from './lib/supabase';

gsap.registerPlugin(ScrollTrigger);

// --- Components ---

const Navbar = ({ onAuthOpen, user }) => {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const handle = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handle);
    return () => window.removeEventListener('scroll', handle);
  }, []);

  return (
    <nav className={`fixed top-0 w-full z-[500] px-6 md:px-16 py-6 md:py-8 transition-all duration-700 flex justify-between items-center ${scrolled ? 'bg-black/90 backdrop-blur-xl py-4 border-b border-white/5' : ''}`}>
      <div className="flex items-center gap-12">
        <h1 className="text-title text-3xl md:text-4xl text-[#00f2ff]">TITAN<span className="text-white">TV</span></h1>
        <div className="hidden lg:flex items-center gap-8">
          {['Channels', 'Devices', 'Pricing'].map(item => (
            <a key={item} href={`#${item.toLowerCase()}`} className="text-[10px] font-bold uppercase tracking-widest text-white/40 hover:text-white transition-colors">{item}</a>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-6">
        {user ? (
          <div className="flex items-center gap-4 bg-white/5 px-6 py-2 rounded-full border border-white/10 group cursor-pointer">
            <div className="w-2 h-2 rounded-full bg-green-500" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-white/60">{user.email.split('@')[0]}</span>
            <button onClick={() => supabase.auth.signOut()} className="text-white/20 hover:text-[#00f2ff]"><Power size={14} /></button>
          </div>
        ) : (
          <button onClick={onAuthOpen} className="text-[10px] font-bold uppercase tracking-widest text-white hover:text-[#00f2ff] transition-colors">Sign In</button>
        )}
        <button onClick={onAuthOpen} className="btn-primary px-8 py-3 rounded-full text-[10px]">Start Free Trial</button>
      </div>
    </nav>
  );
};

const AuthModal = ({ isOpen, onClose, initialEmail = '' }) => {
  const [mode, setMode] = useState('signup');
  const [email, setEmail] = useState(initialEmail);
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
        setMessage("Verification link sent! Check your inbox.");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        onClose();
      }
    } catch (err) { setError(err.message); } finally { setLoading(false); }
  };

  if (!isOpen) return null;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[700] flex items-center justify-center bg-black/95 backdrop-blur-2xl p-6">
      <motion.div initial={{ scale: 0.9, y: 30 }} animate={{ scale: 1, y: 0 }} className="max-w-md w-full bg-[#0a0a0a] p-12 rounded-[3rem] border border-white/5 relative overflow-hidden shadow-2xl">
        <button onClick={onClose} className="absolute top-8 right-8 text-white/20 hover:text-white"><X size={24} /></button>
        <div className="mb-10 text-center">
          <h2 className="text-title text-4xl mb-4">{mode === 'login' ? 'Welcome Back' : 'Join Titan TV'}</h2>
          <p className="text-white/40 text-xs font-medium uppercase tracking-widest">Experience the elite network</p>
        </div>

        {message ? (
          <div className="text-center py-10 space-y-8">
            <div className="w-20 h-20 bg-[#00f2ff]/10 rounded-full flex items-center justify-center mx-auto border border-[#00f2ff]/20">
              <Mail className="text-[#00f2ff]" size={32} />
            </div>
            <p className="text-white/60 text-sm font-medium leading-relaxed">{message}</p>
            <button onClick={onClose} className="w-full py-4 bg-[#00f2ff] text-black font-bold rounded-2xl uppercase tracking-widest text-[10px]">Back to Home</button>
          </div>
        ) : (
          <form onSubmit={handleAuth} className="space-y-6">
            <input type="email" required placeholder="Email Address" className="w-full rounded-2xl py-5 px-8 text-sm outline-none bg-white/5 border border-white/10 focus:border-[#00f2ff] transition-all" value={email} onChange={(e) => setEmail(e.target.value)} />
            <input type="password" required placeholder="Password" className="w-full rounded-2xl py-5 px-8 text-sm outline-none bg-white/5 border border-white/10 focus:border-[#00f2ff] transition-all" value={password} onChange={(e) => setPassword(e.target.value)} />
            {error && <div className="text-red-500 text-[10px] text-center font-bold uppercase tracking-widest">{error}</div>}
            <button disabled={loading} className="w-full py-5 btn-primary rounded-2xl text-[11px] shadow-2xl disabled:opacity-50">
              {loading ? 'Processing...' : mode === 'login' ? 'Sign In' : 'Create Account'}
            </button>
            <div className="text-center pt-6">
              <button type="button" onClick={() => setMode(mode === 'login' ? 'signup' : 'login')} className="text-[10px] font-bold uppercase tracking-widest text-white/30 hover:text-white transition-colors">
                {mode === 'login' ? "New here? Create account" : "Already have an account? Sign in"}
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
  const [heroEmail, setHeroEmail] = useState('');
  const [activePlan, setActivePlan] = useState(null);
  const [checkoutOpen, setCheckoutOpen] = useState(false);

  useEffect(() => {
    const lenis = new Lenis({ duration: 1.2 });
    function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
    requestAnimationFrame(raf);
    supabase.auth.getSession().then(({ data: { session } }) => setUser(session?.user ?? null));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => setUser(session?.user ?? null));
    return () => { subscription.unsubscribe(); lenis.destroy(); };
  }, []);

  useGSAP(() => {
    gsap.utils.toArray('.reveal').forEach((el) => {
      gsap.from(el, { y: 60, opacity: 0, duration: 1.5, ease: "power4.out", scrollTrigger: { trigger: el, start: "top 90%" } });
    });
  });

  const handleStripe = () => {
    confetti({ particleCount: 200, spread: 70, origin: { y: 0.6 } });
    setCheckoutOpen(false);
  };

  return (
    <main className="min-h-screen bg-[#00050a] text-white">
      <Navbar onAuthOpen={() => setAuthOpen(true)} user={user} />

      {/* --- HERO: THE CONVERSION CENTER --- */}
      <section className="relative min-h-screen flex items-center justify-center pt-32 px-6 overflow-hidden">
        <div className="absolute inset-0 z-0 hero-gradient" />
        <div className="container mx-auto relative z-10 text-center max-w-5xl">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.2 }}>
            <span className="inline-flex items-center gap-3 px-6 py-2 bg-[#00f2ff]/10 rounded-full border border-[#00f2ff]/20 mb-10">
              <Star size={14} className="text-[#00f2ff] fill-[#00f2ff]" />
              <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#00f2ff]">Join 500,000+ Elite Streamers</span>
            </span>
            <h1 className="text-title text-[clamp(3.5rem,10vw,12rem)] mb-12">
              Streaming <span className="text-[#00f2ff]">Titan.</span>
            </h1>
            <p className="text-lg md:text-2xl text-white/60 mb-16 max-w-3xl mx-auto leading-relaxed">
              Unrivaled stability, 21,000+ channels in 8K RAW quality. 
              The ultimate IPTV experience, now on all your devices.
            </p>
            
            {/* Netflix Style Hero CTA */}
            <div className="max-w-2xl mx-auto">
              {!user ? (
                <div className="flex flex-col sm:flex-row gap-4 p-2 bg-white/5 rounded-3xl md:rounded-full border border-white/10 backdrop-blur-xl">
                  <input 
                    type="email" 
                    placeholder="Enter your email" 
                    className="flex-grow px-8 py-5 md:py-6 bg-transparent outline-none text-sm md:text-base"
                    value={heroEmail}
                    onChange={(e) => setHeroEmail(e.target.value)}
                  />
                  <button 
                    onClick={() => setAuthOpen(true)}
                    className="btn-primary px-12 py-5 md:py-6 rounded-2xl md:rounded-full whitespace-nowrap text-[12px]"
                  >
                    Get Started Free
                  </button>
                </div>
              ) : (
                <button 
                  onClick={() => document.getElementById('pricing').scrollIntoView()}
                  className="btn-primary px-16 py-6 rounded-full text-sm"
                >
                  Choose Your Plan
                </button>
              )}
              <p className="mt-8 text-[10px] font-medium uppercase tracking-[0.2em] text-white/30">No credit card required. Cancel anytime.</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* --- DEVICE SHOWCASE: REAL VISUALS --- */}
      <section id="devices" className="py-40 bg-black/40">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <div className="reveal">
              <h2 className="text-title text-5xl md:text-7xl mb-10">Stream <span className="text-[#00f2ff]">Everywhere.</span></h2>
              <div className="space-y-10">
                {[
                  { icon: <Tv />, t: 'Smart TVs & Android Boxes', d: 'Compatible with Firestick, Apple TV, and all Android devices.' },
                  { icon: <Smartphone />, t: 'Mobile & Tablet App', d: 'Take your channels anywhere with our ultra-stable mobile app.' },
                  { icon: <Monitor />, t: 'PC & Mac Web Player', d: 'Watch directly in your browser with no software needed.' }
                ].map((item, i) => (
                  <div key={i} className="flex gap-8 group">
                    <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center text-[#00f2ff] group-hover:bg-[#00f2ff]/10 transition-all">{item.icon}</div>
                    <div>
                      <h4 className="text-xl font-bold mb-2">{item.t}</h4>
                      <p className="text-white/40 text-sm leading-relaxed">{item.d}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="reveal relative">
              <div className="relative z-10 glass-morphism p-4 rounded-[4rem] animate-float shadow-2xl">
                <img 
                  src="C:\Users\lenovo\.gemini\antigravity\brain\9d9b4e16-c9d6-4a57-9fa1-7757f1dbb697\iptv_app_mockup_1777718823357.png" 
                  className="rounded-[3rem] w-full shadow-2xl" 
                  alt="TV App"
                />
              </div>
              <div className="absolute -bottom-10 -left-10 z-20 w-1/3 glass-morphism p-2 rounded-[2rem] shadow-2xl hidden md:block">
                <img 
                  src="C:\Users\lenovo\.gemini\antigravity\brain\9d9b4e16-c9d6-4a57-9fa1-7757f1dbb697\iptv_mobile_mockup_1777718841195.png" 
                  className="rounded-[1.5rem] w-full" 
                  alt="Mobile App"
                />
              </div>
              <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[#00f2ff]/10 blur-[150px] rounded-full" />
            </div>
          </div>
        </div>
      </section>

      {/* --- CHANNEL MARQUEE --- */}
      <section className="py-20 border-y border-white/5 bg-black/20">
        <div className="marquee-container">
          {[0, 1].map(row => (
            <div key={row} className="marquee-content py-4">
              {[...Array(10)].map((_, i) => (
                <div key={i} className="flex items-center gap-6 px-10">
                  <div className="w-10 h-10 bg-[#00f2ff]/20 rounded-full flex items-center justify-center text-[#00f2ff]"><Play size={16} fill="#00f2ff" /></div>
                  <span className="text-title text-3xl opacity-20 hover:opacity-100 transition-opacity cursor-default">NETWORK {i + 1}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </section>

      {/* --- PRICING --- */}
      <section id="pricing" className="py-40 px-6">
        <div className="container mx-auto">
          <div className="text-center mb-24">
            <h2 className="text-title text-6xl md:text-8xl mb-8">Simple <span className="text-[#00f2ff]">Pricing.</span></h2>
            <p className="text-white/40 uppercase tracking-[0.4em] text-[10px] font-bold">Unleash the full potential of IPTV</p>
          </div>

          <div className="grid md:grid-cols-3 gap-10 max-w-7xl mx-auto">
            {[
              { t: 'Monthly', p: '15', f: ['21,000+ Channels', '8K RAW Streaming', '1 Device Active', '24/7 Support'] },
              { t: 'Annual Best', p: '69', f: ['All Channels + VOD', '8K RAW + 4K HDR', '3 Devices Active', 'Priority Servers', 'Anti-Buffer Pro'], featured: true },
              { t: 'Ultimate Pro', p: '129', f: ['Everything Included', 'No-Latency Proxy', '5 Devices Active', 'Beta Features Access'] }
            ].map((plan, i) => (
              <div key={i} className={`relative p-12 rounded-[4rem] glass-morphism flex flex-col transition-all duration-700 hover:border-[#00f2ff]/30 ${plan.featured ? 'md:scale-110 z-20 border-[#00f2ff]/40 shadow-[0_40px_100px_rgba(0,242,255,0.1)]' : 'z-10'}`}>
                {plan.featured && <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-[#00f2ff] text-black px-10 py-3 rounded-full text-[10px] font-black uppercase tracking-widest shadow-2xl">Most Popular</div>}
                <div className="mb-12">
                  <h3 className="text-2xl font-bold mb-6 opacity-40 uppercase tracking-widest">{plan.t}</h3>
                  <div className="flex items-baseline gap-2">
                    <span className="text-title text-7xl md:text-8xl">${plan.p}</span>
                    <span className="text-white/20 font-bold uppercase tracking-widest text-[10px]">{plan.t === 'Annual Best' ? '/ Year' : '/ Term'}</span>
                  </div>
                </div>
                <div className="space-y-6 mb-16 flex-grow">
                  {plan.f.map((feat, fi) => (
                    <div key={fi} className="flex items-center gap-6 group">
                      <CheckCircle2 size={20} className="text-[#00f2ff] opacity-40 group-hover:opacity-100 transition-opacity" />
                      <span className="text-[12px] font-bold uppercase tracking-widest text-white/60">{feat}</span>
                    </div>
                  ))}
                </div>
                <button onClick={() => { setActivePlan(plan); setCheckoutOpen(true); }} className={`w-full py-6 rounded-3xl text-[12px] font-black uppercase tracking-widest transition-all ${plan.featured ? 'bg-[#00f2ff] text-black hover:bg-white' : 'bg-white/5 hover:bg-white hover:text-black border border-white/10'}`}>Get This Plan</button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="py-40 bg-black/80 border-t border-white/5">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-title text-6xl md:text-9xl text-[#00f2ff] mb-20">TITAN<span className="text-white">TV</span></h1>
          <div className="grid md:grid-cols-4 gap-20 text-left mb-32 opacity-40">
            {['Service', 'Help', 'Legal', 'Social'].map(cat => (
              <div key={cat}>
                <h5 className="font-black uppercase tracking-widest text-sm mb-10 text-white">{cat}</h5>
                <ul className="space-y-4 text-xs font-bold uppercase tracking-widest">
                  <li><a href="#" className="hover:text-[#00f2ff]">Channels</a></li>
                  <li><a href="#" className="hover:text-[#00f2ff]">Setup Guide</a></li>
                  <li><a href="#" className="hover:text-[#00f2ff]">Terms</a></li>
                </ul>
              </div>
            ))}
          </div>
          <div className="pt-20 border-t border-white/5 flex flex-col md:flex-row justify-between items-center opacity-20 text-[10px] font-bold uppercase tracking-widest gap-10">
            <span>© 2026 TITAN CORE. ALL RIGHTS RESERVED.</span>
            <div className="flex gap-10"><Globe size={20} /><ShieldCheck size={20} /><Smartphone size={20} /></div>
          </div>
        </div>
      </footer>

      {/* --- MODALS --- */}
      <AnimatePresence>
        {authOpen && <AuthModal isOpen={authOpen} onClose={() => setAuthOpen(false)} initialEmail={heroEmail} />}
        {checkoutOpen && activePlan && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[700] flex items-center justify-center bg-black/98 backdrop-blur-3xl p-6">
            <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="max-w-md w-full bg-[#0a0a0a] p-16 rounded-[4rem] border border-white/10 relative text-center">
              <button onClick={() => setCheckoutOpen(false)} className="absolute top-10 right-10 text-white/20 hover:text-white"><X size={32} /></button>
              <div className="w-24 h-24 bg-[#00f2ff]/10 rounded-full flex items-center justify-center mx-auto mb-12"><Crown className="text-[#00f2ff]" size={48} /></div>
              <h2 className="text-title text-5xl mb-6">Authorize.</h2>
              <p className="text-white/40 text-[10px] font-black uppercase tracking-[0.4em] mb-16">Payment Secured via Stripe Tunnel</p>
              <button onClick={handleStripe} className="w-full py-6 bg-white text-black font-black uppercase tracking-widest rounded-3xl text-[12px] hover:bg-[#00f2ff] transition-all shadow-2xl">Confirm ${activePlan.price} Sync</button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
