import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, Menu, Mail, Power, Signal, Video, Shield, Zap, 
  Activity, Crown, ChevronRight, ArrowRight, Play, Star, 
  Smartphone, Tv, CheckCircle2, Monitor, Lock, AlertCircle,
  Copy, Check, History, CreditCard, Calendar, Hash, Layout,
  Cpu, Wifi, Database, Layers, ExternalLink
} from 'lucide-react';
import confetti from 'canvas-confetti';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { supabase } from './lib/supabase';

gsap.registerPlugin(ScrollTrigger);

// --- 3D Visual Components ---

const AmbientLighting = () => (
  <div className="fixed inset-0 z-[-1] pointer-events-none overflow-hidden">
    <div className="glow-orb w-[90vw] h-[90vw] bg-[#00f2ff] top-[-30%] left-[-20%]" />
    <div className="glow-orb w-[70vw] h-[70vw] bg-[#7000ff] bottom-[-20%] right-[-20%]" style={{ animationDelay: '-8s' }} />
    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] mix-blend-overlay" />
  </div>
);

const Navbar = ({ onAuthOpen, user, onDashboardOpen }) => {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const handle = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handle);
    return () => window.removeEventListener('scroll', handle);
  }, []);

  return (
    <nav className={`fixed top-0 w-full z-[500] px-6 md:px-16 py-10 flex justify-between items-center transition-all duration-1000 ${scrolled ? 'bg-black/60 backdrop-blur-3xl py-6 border-b border-white/5' : ''}`}>
      <div className="flex items-center gap-16">
        <h1 className="text-mega text-4xl cursor-pointer" onClick={() => window.scrollTo(0,0)}>TITAN</h1>
        <div className="hidden xl:flex items-center gap-12">
          {['Network', 'Pricing', 'Infrastructure'].map(item => (
            <a key={item} href={`#${item.toLowerCase()}`} className="label-pro text-[8px] opacity-30 hover:opacity-100 transition-all">{item}</a>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-8">
        {user ? (
          <div className="flex items-center gap-6">
            <button 
              onClick={onDashboardOpen} 
              className="relative px-10 py-3 bg-[#00f2ff] text-black rounded-xl label-pro text-[9px] font-black shadow-[0_0_40px_rgba(0,242,255,0.4)] hover:scale-105 active:scale-95 transition-all flex items-center gap-3"
            >
              <Layout size={14} /> Dashboard
            </button>
            <div className="flex items-center gap-4 bg-white/5 px-6 py-2 rounded-xl border border-white/10 backdrop-blur-xl">
              <div className={`w-1.5 h-1.5 rounded-full ${user.email_confirmed_at ? 'bg-green-500 shadow-[0_0_10px_#22c55e]' : 'bg-yellow-500 animate-pulse'}`} />
              <span className="label-pro text-[9px] text-white/60">{user.email.split('@')[0]}</span>
              <button onClick={() => supabase.auth.signOut()} className="text-white/20 hover:text-[#00f2ff] transition-colors"><Power size={14} /></button>
            </div>
          </div>
        ) : (
          <button onClick={onAuthOpen} className="btn-liquid">Start Neural Link</button>
        )}
      </div>
    </nav>
  );
};

const Dashboard = ({ isOpen, onClose, user }) => {
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen && user) {
      supabase.from('purchases').select('*').eq('user_id', user.id).order('created_at', { ascending: false })
        .then(({ data }) => { setPurchases(data || []); setLoading(false); });
    }
  }, [isOpen, user]);

  if (!isOpen) return null;

  return (
    <motion.div initial={{ opacity: 0, scale: 1.1 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.1 }} className="fixed inset-0 z-[600] bg-black/98 backdrop-blur-[100px] p-6 md:p-20 overflow-y-auto">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-32">
          <div>
            <span className="label-pro mb-6 block">Node Central</span>
            <h2 className="text-mega text-6xl md:text-9xl">Dashboard.</h2>
          </div>
          <button onClick={onClose} className="w-20 h-20 glass-3d rounded-full flex items-center justify-center text-white/30 hover:text-white transition-all"><X size={40} /></button>
        </div>

        {loading ? (
          <div className="text-center py-40 label-pro animate-pulse text-2xl">Syncing Node Database...</div>
        ) : purchases.length === 0 ? (
          <div className="text-center py-40 glass-3d rounded-[5rem] border-white/5">
            <Cpu size={80} className="mx-auto mb-10 text-[#00f2ff] opacity-10 animate-pulse" />
            <p className="label-pro opacity-20 text-xl tracking-widest">No active codes detected in this node.</p>
          </div>
        ) : (
          <div className="grid gap-10">
            {purchases.map((p) => (
              <div key={p.id} className="glass-3d p-12 rounded-[4rem] flex flex-col md:flex-row justify-between items-center gap-16 group">
                <div className="flex items-center gap-12">
                  <div className="w-24 h-24 bg-[#00f2ff]/10 rounded-[2.5rem] flex items-center justify-center text-[#00f2ff] border border-[#00f2ff]/20 shadow-[0_0_50px_rgba(0,242,255,0.1)] group-hover:scale-110 transition-transform"><Monitor size={48} /></div>
                  <div>
                    <h4 className="text-mega text-4xl mb-6">{p.plan_name}</h4>
                    <div className="flex gap-12 opacity-30 label-pro text-[8px]">
                      <span className="flex items-center gap-3"><Calendar size={14} /> {new Date(p.created_at).toLocaleDateString()}</span>
                      <span className="flex items-center gap-3"><CreditCard size={14} /> ${p.amount} INVESTED</span>
                    </div>
                  </div>
                </div>
                <div className="bg-white/5 px-16 py-8 rounded-[2.5rem] border border-white/10 flex items-center gap-10 group/code cursor-pointer hover:bg-white/10 transition-all" onClick={() => { navigator.clipboard.writeText(p.iptv_code); confetti({ particleCount: 30 }); }}>
                  <span className="text-mega text-5xl tracking-[0.4em]">{p.iptv_code}</span>
                  <Copy size={32} className="text-white/20 group-hover/code:text-white transition-all" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
};

const PaymentModal = ({ isOpen, onClose, plan, onComplete }) => {
  const [loading, setLoading] = useState(false);
  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => { setLoading(false); onComplete(); }, 2500);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[700] flex items-center justify-center bg-black/95 backdrop-blur-[100px] p-6">
      <motion.div initial={{ scale: 0.8, y: 50 }} animate={{ scale: 1, y: 0 }} className="max-w-xl w-full glass-3d p-16 md:p-20 rounded-[5rem] relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#00f2ff] to-transparent animate-pulse" />
        <button onClick={onClose} className="absolute top-12 right-12 text-white/20 hover:text-white"><X size={32} /></button>
        
        <div className="mb-16">
          <div className="flex items-center gap-4 mb-6">
            <Lock size={16} className="text-[#00f2ff]" />
            <span className="label-pro text-[9px]">Military Grade Tunnel</span>
          </div>
          <h2 className="text-mega text-6xl mb-6">Purchase.</h2>
          <p className="label-pro opacity-30 text-[10px] leading-loose">Acquiring {plan.t} Protocol License for ${plan.p}/Year</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-10">
          <div className="space-y-6">
            <div className="relative">
              <CreditCard className="absolute left-8 top-1/2 -translate-y-1/2 text-white/20" size={24} />
              <input type="text" placeholder="CARD NUMBER" className="w-full bg-white/5 border border-white/10 rounded-[2rem] py-8 px-20 text-sm outline-none focus:border-[#00f2ff] transition-all font-mono" required />
            </div>
            <div className="grid grid-cols-2 gap-8">
              <input type="text" placeholder="MM/YY" className="w-full bg-white/5 border border-white/10 rounded-[2rem] py-8 px-12 text-sm outline-none focus:border-[#00f2ff] transition-all font-mono" required />
              <input type="text" placeholder="CVC" className="w-full bg-white/5 border border-white/10 rounded-[2rem] py-8 px-12 text-sm outline-none focus:border-[#00f2ff] transition-all font-mono" required />
            </div>
          </div>
          <button disabled={loading} className="btn-liquid w-full py-10 shadow-[0_30px_70px_rgba(0,242,255,0.3)]">
            {loading ? 'Authorizing Neural Link...' : `Authorize $${plan.p}`}
          </button>
          <div className="flex justify-center gap-10 opacity-10 py-4"><Wifi size={24} /><Shield size={24} /><Activity size={24} /></div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default function App() {
  const [user, setUser] = useState(null);
  const [authOpen, setAuthOpen] = useState(false);
  const [dashboardOpen, setDashboardOpen] = useState(false);
  const [activePlan, setActivePlan] = useState(null);
  const [paymentOpen, setPaymentOpen] = useState(false);
  const [iptvCode, setIptvCode] = useState(null);
  const heroRef = useRef(null);

  useEffect(() => {
    const lenis = new Lenis({ duration: 1.5 });
    function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
    requestAnimationFrame(raf);
    supabase.auth.getSession().then(({ data: { session } }) => setUser(session?.user ?? null));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => setUser(session?.user ?? null));
    return () => { subscription.unsubscribe(); lenis.destroy(); };
  }, []);

  useGSAP(() => {
    gsap.from('.hero-reveal', { y: 100, opacity: 0, duration: 2, ease: "power4.out", stagger: 0.2 });
    gsap.to('.parallax-3d', { yPercent: 20, rotateX: 10, ease: "none", scrollTrigger: { trigger: heroRef.current, start: "top top", end: "bottom top", scrub: true } });
  }, { scope: heroRef });

  const handlePaymentComplete = async () => {
    const code = Math.random().toString(36).substring(2, 10).toUpperCase();
    await supabase.from('purchases').insert({
      user_id: user.id,
      plan_name: activePlan.t,
      amount: parseFloat(activePlan.p),
      iptv_code: code
    });
    setIptvCode(code);
    confetti({ particleCount: 400, spread: 100, origin: { y: 0.6 } });
    setPaymentOpen(false);
  };

  const isConfirmed = user && user.email_confirmed_at;

  return (
    <main className="min-h-screen bg-[#020202] text-white">
      <AmbientLighting />
      <Navbar onAuthOpen={() => setAuthOpen(true)} user={user} onDashboardOpen={() => setDashboardOpen(true)} />

      <Dashboard isOpen={dashboardOpen} onClose={() => setDashboardOpen(false)} user={user} />

      {/* --- HERO: 3D MASTERPIECE --- */}
      <section ref={heroRef} className="relative min-h-screen flex items-center justify-center pt-40 px-6 overflow-hidden">
        <div className="container mx-auto text-center max-w-7xl relative z-10">
          <div className="hero-reveal">
            <span className="label-pro mb-12 block animate-pulse">Neural Streaming Engine v8.0</span>
            <h1 className="text-mega text-[clamp(4.5rem,15vw,18rem)] mb-20 leading-none">
              FUTURE <br /> <span className="opacity-10">IS NOW.</span>
            </h1>
          </div>
          
          <div className="perspective-1000 relative">
            <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 2 }} className="parallax-3d glass-3d p-4 rounded-[6rem] shadow-[0_100px_200px_-50px_rgba(0,242,255,0.2)] group relative">
              <img 
                src="C:\Users\lenovo\Desktop\iptv\futuristic_3d_tv_8k_1777719653703.png" 
                className="w-full rounded-[5rem] brightness-[0.7] group-hover:brightness-100 transition-all duration-[3000ms]" 
                alt="8K TV"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80 rounded-[5rem]" />
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-12">
                {!user ? (
                  <button onClick={() => setAuthOpen(true)} className="btn-liquid text-xl scale-125">Initialize Protocol</button>
                ) : !isConfirmed ? (
                  <div className="glass-3d p-16 rounded-[4rem] border-yellow-500/30 max-w-xl">
                    <AlertCircle className="mx-auto mb-8 text-yellow-500 animate-bounce" size={64} />
                    <h4 className="text-mega text-4xl mb-6">Verify Bio-ID.</h4>
                    <p className="label-pro opacity-40 leading-loose">A neural verification link has been transmitted to your inbox. Acknowledge to proceed.</p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-16">
                    <div className="flex gap-20 items-center">
                      <div className="text-left group cursor-default">
                        <span className="label-pro text-[7px] opacity-30 mb-2 block">Connection</span>
                        <h4 className="text-mega text-4xl group-hover:text-[#00f2ff] transition-all">STABLE</h4>
                      </div>
                      <div className="w-px h-24 bg-white/10" />
                      <div className="text-left group cursor-default">
                        <span className="label-pro text-[7px] opacity-30 mb-2 block">Bandwidth</span>
                        <h4 className="text-mega text-4xl group-hover:text-[#00f2ff] transition-all">8K RAW</h4>
                      </div>
                    </div>
                    <button onClick={() => document.getElementById('pricing').scrollIntoView()} className="btn-liquid px-24 scale-110">Select Uplink</button>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* --- PRICING --- */}
      <section id="pricing" className={`py-60 px-6 transition-all duration-1000 ${!isConfirmed ? 'opacity-0 scale-95 pointer-events-none' : 'opacity-100'}`}>
        <div className="container mx-auto">
          <div className="text-center mb-40">
            <span className="label-pro mb-8 block">Network Protocol</span>
            <h2 className="text-mega text-[clamp(4rem,12vw,14rem)] mb-12 leading-none">PRICING.</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-16 max-w-7xl mx-auto perspective-1000">
            {[
              { t: 'Standard', p: '29', f: ['4K Streaming', '1 Device Active', 'SLA 99.9%'] },
              { t: 'Ultimate', p: '59', f: ['8K RAW Native', '3 Devices Active', 'Priority Tunnel', 'Anti-Buffer Pro'], featured: true },
              { t: 'Titan Master', p: '99', f: ['8K Uncompressed', '5 Devices Active', 'Private Proxy', 'Global Roaming'] }
            ].map((plan, i) => (
              <div key={i} className={`glass-3d p-16 rounded-[5rem] flex flex-col ${plan.featured ? 'md:scale-110 border-[#00f2ff]/50 shadow-[0_0_150px_rgba(0,242,255,0.2)] z-10' : ''}`}>
                <h3 className="label-pro mb-12 opacity-30 text-xl">{plan.t}</h3>
                <div className="flex items-baseline gap-4 mb-20">
                  <span className="text-mega text-8xl">${plan.p}</span>
                  <span className="label-pro opacity-20 text-[10px]">/ Year</span>
                </div>
                <div className="space-y-8 mb-32 flex-grow">
                  {plan.f.map((feat, fi) => (
                    <div key={fi} className="flex items-center gap-6 group">
                      <CheckCircle2 size={18} className="text-[#00f2ff] opacity-20 group-hover:opacity-100 transition-opacity shadow-[0_0_10px_#00f2ff]" />
                      <span className="label-pro text-[9px] opacity-20 group-hover:opacity-100 transition-opacity">{feat}</span>
                    </div>
                  ))}
                </div>
                <button onClick={() => { setActivePlan(plan); setPaymentOpen(true); }} className={`btn-liquid w-full py-8 ${plan.featured ? 'bg-[#00f2ff] text-black shadow-3xl' : 'bg-white/5 text-white border border-white/10 shadow-none hover:bg-white hover:text-black'}`}>Initialize Sync</button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="py-60 bg-black/40 border-t border-white/5 text-center">
        <h1 className="text-mega text-[clamp(4rem,10vw,15rem)] text-[#00f2ff] mb-20">TITAN</h1>
        <p className="label-pro opacity-10 text-[8px] tracking-[1em]">SYSTEM READY. ALL DATA ENCRYPTED. [© 2026]</p>
      </footer>

      {/* --- MODALS --- */}
      <AnimatePresence>
        {authOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[700] flex items-center justify-center bg-black/98 backdrop-blur-[100px] p-6">
            <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="max-w-md w-full glass-3d p-16 rounded-[4rem] relative">
              <button onClick={() => setAuthOpen(false)} className="absolute top-10 right-10 text-white/20 hover:text-white"><X size={32} /></button>
              <div className="mb-12 text-center">
                <h2 className="text-mega text-5xl mb-6">Initialize.</h2>
                <p className="label-pro opacity-40">Titan Neural Network Access</p>
              </div>
              <AuthFlow onClose={() => setAuthOpen(false)} />
            </motion.div>
          </motion.div>
        )}
        {paymentOpen && activePlan && (
          <PaymentModal isOpen={paymentOpen} onClose={() => setPaymentOpen(false)} plan={activePlan} onComplete={handlePaymentComplete} />
        )}
        {iptvCode && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[800] flex items-center justify-center bg-black/98 backdrop-blur-[120px] p-6">
            <motion.div initial={{ scale: 0.7, rotateX: -30 }} animate={{ scale: 1, rotateX: 0 }} className="max-w-2xl w-full glass-3d p-24 rounded-[6rem] relative text-center border-[#00f2ff]/50 shadow-[0_0_200px_rgba(0,242,255,0.3)]">
              <div className="w-32 h-32 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-12 border border-green-500/30 shadow-[0_0_80px_rgba(34,197,94,0.2)]"><CheckCircle2 className="text-green-500" size={64} /></div>
              <h2 className="text-mega text-7xl mb-8 text-green-500">SUCCESS.</h2>
              <p className="label-pro opacity-40 mb-20 text-center leading-loose">Uplink Code Generated & Persisted in Node.</p>
              <div className="bg-white/5 p-16 rounded-[4rem] border border-white/10 mb-20 flex items-center justify-center gap-12 group cursor-pointer hover:bg-white/10 transition-all shadow-[inset_0_0_50px_rgba(0,0,0,0.5)]" onClick={() => { navigator.clipboard.writeText(iptvCode); confetti({ particleCount: 50 }); }}>
                <span className="text-mega text-7xl tracking-[0.4em]">{iptvCode}</span>
                <Copy size={48} className="text-white/20 group-hover:text-white transition-all" />
              </div>
              <button onClick={() => setIptvCode(null)} className="btn-liquid py-6 scale-90 opacity-40 hover:opacity-100">Terminate Protocol</button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}

const AuthFlow = ({ onClose }) => {
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
        setMessage("Vérification transmise. Consultez votre Bio-Inbox.");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        onClose();
      }
    } catch (err) { setError(err.message); } finally { setLoading(false); }
  };

  if (message) return (
    <div className="text-center py-10 space-y-12">
      <div className="w-24 h-24 bg-[#00f2ff]/10 rounded-full flex items-center justify-center mx-auto border border-[#00f2ff]/20 animate-pulse"><Mail className="text-[#00f2ff]" size={40} /></div>
      <p className="label-pro opacity-60 leading-loose text-center">{message}</p>
      <button onClick={onClose} className="btn-liquid w-full py-5 text-[10px]">Acknowledge</button>
    </div>
  );

  return (
    <form onSubmit={handleAuth} className="space-y-8">
      <input type="email" required placeholder="NEURAL.ID" className="w-full rounded-2xl py-8 px-12 text-sm outline-none bg-white/5 border border-white/10 focus:border-[#00f2ff] transition-all font-mono" value={email} onChange={(e) => setEmail(e.target.value)} />
      <input type="password" required placeholder="ACCESS.KEY" className="w-full rounded-2xl py-8 px-12 text-sm outline-none bg-white/5 border border-white/10 focus:border-[#00f2ff] transition-all font-mono" value={password} onChange={(e) => setPassword(e.target.value)} />
      {error && <div className="text-[#00f2ff] text-[10px] text-center font-bold uppercase tracking-widest bg-[#00f2ff]/05 py-4 rounded-xl">{error}</div>}
      <button disabled={loading} className="btn-liquid w-full py-8 text-[11px] shadow-3xl disabled:opacity-50">
        {loading ? 'Transmitting...' : mode === 'login' ? 'Establish Link' : 'Initialize Node'}
      </button>
      <div className="text-center pt-8">
        <button type="button" onClick={() => setMode(mode === 'login' ? 'signup' : 'login')} className="label-pro text-[8px] opacity-20 hover:opacity-100 transition-all">
          {mode === 'login' ? "New Neural Link? Sync" : "Existing Link? Recall"}
        </button>
      </div>
    </form>
  );
};
