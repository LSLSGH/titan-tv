import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, Menu, Mail, Power, Signal, Video, Shield, Zap, 
  Activity, Crown, ChevronRight, ArrowRight, Play, Star, 
  Smartphone, Tv, CheckCircle2, Monitor, Lock, AlertCircle,
  Copy, Check, History, CreditCard, Calendar, Hash, Layout,
  Cpu, Wifi, Database, Layers, ExternalLink, Plus, Trash2, 
  CreditCard as CardIcon, Globe, Box, Box as CubeIcon
} from 'lucide-react';
import confetti from 'canvas-confetti';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { supabase } from './lib/supabase';

gsap.registerPlugin(ScrollTrigger);

// --- Real Logos Infrastructure ---

const LOGOS = [
  { name: 'beIN SPORTS', url: 'https://upload.wikimedia.org/wikipedia/commons/2/25/BeIN_Sports_logo.svg' },
  { name: 'DAZN', url: 'https://upload.wikimedia.org/wikipedia/commons/e/e0/DAZN_logo.svg' },
  { name: 'Sky Sports', url: 'https://upload.wikimedia.org/wikipedia/en/b/b7/Sky_Sports_logo_2017.svg' },
  { name: 'Canal+', url: 'https://upload.wikimedia.org/wikipedia/commons/d/d3/Canal%2B_logo.svg' },
  { name: 'ESPN', url: 'https://upload.wikimedia.org/wikipedia/commons/b/bd/ESPN_wordmark.svg' },
  { name: 'HBO', url: 'https://upload.wikimedia.org/wikipedia/commons/1/17/HBO_logo.svg' },
  { name: 'Netflix', url: 'https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg' }
];

// --- Holographic Components ---

const DataStream = () => (
  <div className="fixed top-0 right-10 bottom-0 w-px bg-white/5 z-[-1] overflow-hidden">
    <div className="absolute top-0 w-full h-20 bg-gradient-to-b from-transparent via-[#00f2ff] to-transparent animate-scan" style={{ animationDuration: '3s' }} />
  </div>
);

const Navbar = ({ onAuthOpen, user, onDashboardOpen }) => (
  <nav className="fixed top-0 w-full z-[500] px-6 md:px-16 py-10 flex justify-between items-center transition-all duration-1000">
    <div className="flex items-center gap-24">
      <h1 className="text-titan text-5xl cursor-pointer" onClick={() => window.scrollTo(0,0)}>
        TITAN <span className="text-white">TV</span>
      </h1>
      <div className="hidden xl:flex items-center gap-12">
        {['Infrastructure', 'Protocol', 'Pricing'].map(item => (
          <a key={item} href={`#${item.toLowerCase()}`} className="label-cyber text-[8px] opacity-30 hover:opacity-100 transition-all">{item}</a>
        ))}
      </div>
    </div>

    <div className="flex items-center gap-8">
      {user ? (
        <div className="flex items-center gap-6">
          <button 
            onClick={onDashboardOpen} 
            className="group relative px-10 py-3 bg-white text-black rounded-lg label-cyber text-[9px] font-black hover:bg-[#ff003c] hover:text-white transition-all shadow-[0_0_30px_rgba(255,255,255,0.2)]"
          >
            Terminal Dashboard
          </button>
          <button onClick={() => supabase.auth.signOut()} className="text-white/20 hover:text-[#ff003c] transition-colors"><Power size={20} /></button>
        </div>
      ) : (
        <button onClick={onAuthOpen} className="btn-command">Authorize Link</button>
      )}
    </div>
  </nav>
);

const Dashboard = ({ isOpen, onClose, user }) => {
  const [purchases, setPurchases] = useState([]);
  const [cards, setCards] = useState([]);
  const [activeTab, setActiveTab] = useState('codes');
  const [loading, setLoading] = useState(true);

  // Card form state
  const [cardHolder, setCardHolder] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvc, setCvc] = useState('');
  const [savingCard, setSavingCard] = useState(false);

  useEffect(() => {
    if (isOpen && user) {
      setLoading(true);
      const p1 = supabase.from('purchases').select('*').eq('user_id', user.id).order('created_at', { ascending: false });
      const p2 = supabase.from('payment_methods').select('*').eq('user_id', user.id).order('created_at', { ascending: false });
      
      Promise.all([p1, p2]).then(([r1, r2]) => {
        setPurchases(r1.data || []);
        setCards(r2.data || []);
        setLoading(false);
      });
    }
  }, [isOpen, user]);

  const handleAddCard = async (e) => {
    e.preventDefault();
    setSavingCard(true);
    const { error } = await supabase.from('payment_methods').insert({
      user_id: user.id,
      card_holder: cardHolder,
      card_number: cardNumber.replace(/\d(?=\d{4})/g, "*"), 
      expiry: expiry,
      cvc: cvc
    });
    if (!error) {
      const { data } = await supabase.from('payment_methods').select('*').eq('user_id', user.id);
      setCards(data || []);
      setCardHolder(''); setCardNumber(''); setExpiry(''); setCvc('');
    }
    setSavingCard(false);
  };

  if (!isOpen) return null;

  return (
    <motion.div initial={{ opacity: 0, scale: 1.1 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.1 }} className="fixed inset-0 z-[600] bg-black/98 backdrop-blur-[100px] p-6 md:p-20 overflow-y-auto">
      <div className="max-w-6xl mx-auto relative">
        <div className="absolute top-[-10%] right-[-10%] w-60 h-60 bg-[#ff003c]/10 blur-[100px] rounded-full animate-pulse" />
        <div className="flex justify-between items-center mb-32">
          <div>
            <span className="label-cyber mb-6 block">Node Management</span>
            <h2 className="text-titan text-7xl md:text-9xl">DASHBOARD.</h2>
          </div>
          <button onClick={onClose} className="w-20 h-20 glass-luxe rounded-full flex items-center justify-center text-white/30 hover:text-white transition-all"><X size={40} /></button>
        </div>

        <div className="flex gap-16 mb-20 border-b border-white/5 pb-10">
          <button onClick={() => setActiveTab('codes')} className={`label-cyber text-[10px] transition-all ${activeTab === 'codes' ? 'text-[#ff003c]' : 'text-white/20'}`}>Active Transmissions</button>
          <button onClick={() => setActiveTab('billing')} className={`label-cyber text-[10px] transition-all ${activeTab === 'billing' ? 'text-[#ff003c]' : 'text-white/20'}`}>Secure Billing</button>
        </div>

        {activeTab === 'codes' ? (
          <div className="grid gap-8">
            {purchases.length === 0 ? (
              <div className="py-40 text-center glass-luxe rounded-[4rem] border-white/5 opacity-20 label-cyber text-2xl">No codes detected.</div>
            ) : (
              purchases.map(p => (
                <div key={p.id} className="glass-luxe p-12 rounded-[4rem] flex flex-col md:flex-row justify-between items-center group relative overflow-hidden">
                  <div className="scanner" />
                  <div className="flex items-center gap-12">
                    <div className="w-24 h-24 bg-[#ff003c]/10 rounded-[2.5rem] flex items-center justify-center text-[#ff003c] border border-[#ff003c]/20 group-hover:scale-110 transition-transform"><Tv size={40} /></div>
                    <div>
                      <h4 className="text-titan text-4xl mb-4">{p.plan_name}</h4>
                      <div className="flex gap-12 opacity-30 label-cyber text-[8px]">
                        <span className="flex items-center gap-3"><Calendar size={14} /> {new Date(p.created_at).toLocaleDateString()}</span>
                        <span className="flex items-center gap-3"><CreditCard size={14} /> ${p.amount} INVESTED</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-12 bg-black/40 px-16 py-8 rounded-[2.5rem] border border-white/5 group-hover:border-[#ff003c]/40 transition-all cursor-pointer" onClick={() => { navigator.clipboard.writeText(p.iptv_code); confetti({ particleCount: 50 }); }}>
                    <span className="text-titan text-5xl tracking-[0.4em]">{p.iptv_code}</span>
                    <Copy size={32} className="text-white/20 group-hover:text-white" />
                  </div>
                </div>
              ))
            )}
          </div>
        ) : (
          <div className="grid lg:grid-cols-2 gap-20">
            <div className="space-y-12">
              <h3 className="label-cyber text-[10px] opacity-30 mb-12">Registered Credentials</h3>
              {cards.map(c => (
                <div key={c.id} className="glass-luxe p-10 rounded-[3rem] flex justify-between items-center border-l-4 border-l-[#ff003c]">
                  <div className="flex items-center gap-8">
                    <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center"><CardIcon size={28} /></div>
                    <div>
                      <p className="text-xl font-bold tracking-widest font-mono">{c.card_number}</p>
                      <p className="label-cyber text-[8px] opacity-40">{c.card_holder} | {c.expiry}</p>
                    </div>
                  </div>
                  <button onClick={async () => { await supabase.from('payment_methods').delete().eq('id', c.id); setCards(cards.filter(x => x.id !== c.id)); }} className="text-white/20 hover:text-[#ff003c] transition-all"><Trash2 size={24} /></button>
                </div>
              ))}
            </div>

            <div className="glass-luxe p-16 rounded-[5rem] border-[#ff003c]/20">
              <h3 className="label-cyber text-[12px] mb-16">Initialize Secure Card Sync</h3>
              <form onSubmit={handleAddCard} className="space-y-8">
                <input type="text" required placeholder="HOLDER NAME" className="w-full bg-white/5 border border-white/10 rounded-2xl py-6 px-10 text-xs outline-none focus:border-[#ff003c] transition-all font-mono" value={cardHolder} onChange={e => setCardHolder(e.target.value)} />
                <input type="text" required placeholder="CARD NUMBER" className="w-full bg-white/5 border border-white/10 rounded-2xl py-6 px-10 text-xs outline-none focus:border-[#ff003c] transition-all font-mono" value={cardNumber} onChange={e => setCardNumber(e.target.value)} />
                <div className="grid grid-cols-2 gap-8">
                  <input type="text" required placeholder="MM/YY" className="w-full bg-white/5 border border-white/10 rounded-2xl py-6 px-10 text-xs outline-none focus:border-[#ff003c] transition-all font-mono" value={expiry} onChange={e => setExpiry(e.target.value)} />
                  <input type="text" required placeholder="CVC" className="w-full bg-white/5 border border-white/10 rounded-2xl py-6 px-10 text-xs outline-none focus:border-[#ff003c] transition-all font-mono" value={cvc} onChange={e => setCvc(e.target.value)} />
                </div>
                <button disabled={savingCard} className="btn-command w-full py-6 flex items-center justify-center gap-6">
                  <Plus size={20} /> {savingCard ? 'Transmitting Data...' : 'Sync Card Securely'}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default function App() {
  const [user, setUser] = useState(null);
  const [authOpen, setAuthOpen] = useState(false);
  const [dashboardOpen, setDashboardOpen] = useState(false);
  const [activePlan, setActivePlan] = useState(null);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
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
    gsap.from('.reveal-hero', { y: 100, opacity: 0, duration: 2, ease: "power4.out", stagger: 0.3 });
    gsap.to('.tv-emergence', { 
      y: -50, scale: 1.1, rotateX: 0, duration: 2, ease: "power2.out", 
      scrollTrigger: { trigger: heroRef.current, start: "top top", end: "bottom top", scrub: true } 
    });
  }, { scope: heroRef });

  const handleCheckout = async () => {
    const code = Math.random().toString(36).substring(2, 10).toUpperCase();
    await supabase.from('purchases').insert({
      user_id: user.id,
      plan_name: activePlan.t,
      amount: parseFloat(activePlan.p),
      iptv_code: code
    });
    setIptvCode(code);
    confetti({ particleCount: 300, spread: 100, origin: { y: 0.6 } });
    setCheckoutOpen(false);
  };

  return (
    <main className="min-h-screen bg-[#010101] text-white selection:bg-[#ff003c] selection:text-white">
      <div className="hologram-grid" />
      <DataStream />
      <Navbar onAuthOpen={() => setAuthOpen(true)} user={user} onDashboardOpen={() => setDashboardOpen(true)} />
      <Dashboard isOpen={dashboardOpen} onClose={() => setDashboardOpen(false)} user={user} />

      {/* --- HERO: THE HOLOGRAPHIC EMERGENCE --- */}
      <section ref={heroRef} className="relative min-h-screen flex items-center justify-center pt-60 px-6 overflow-hidden">
        <div className="container mx-auto text-center relative z-10">
          <div className="reveal-hero mb-20">
            <span className="label-cyber mb-12 block animate-pulse">Neural Streaming Infrastructure v8.4.2</span>
            <h1 className="text-titan text-[clamp(4.5rem,15vw,18rem)] mb-24 leading-none">
              TITAN <span className="text-white opacity-10">TV.</span>
            </h1>
          </div>

          <div className="reveal-hero tv-container relative max-w-7xl mx-auto">
            <div className="tv-frame tv-emergence glass-luxe p-6 rounded-[5rem] shadow-[0_100px_300px_-50px_rgba(255,0,60,0.3)] border-[#ff003c]/20 relative overflow-hidden group">
              <div className="scanner" />
              <img src="C:\Users\lenovo\Desktop\iptv\futuristic_3d_tv_8k_1777719653703.png" className="w-full rounded-[4rem] brightness-[0.8] group-hover:brightness-100 transition-all duration-[3000ms]" alt="8K TV" />
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 group-hover:bg-transparent transition-all">
                {!user ? (
                  <button onClick={() => setAuthOpen(true)} className="btn-command scale-125">Acknowledge Link</button>
                ) : !user.email_confirmed_at ? (
                  <div className="glass-luxe p-16 rounded-[4rem] border-yellow-500/20 max-w-xl">
                    <AlertCircle className="mx-auto mb-8 text-yellow-500 animate-bounce" size={64} />
                    <h4 className="text-titan text-3xl mb-4">Neural Verify.</h4>
                    <p className="label-cyber opacity-40 leading-loose">Biometric activation link transmitted to your node. Confirm to access the grid.</p>
                  </div>
                ) : (
                  <button onClick={() => document.getElementById('pricing').scrollIntoView()} className="btn-command scale-125">Enter Network</button>
                )}
              </div>
            </div>
          </div>

          {/* REAL LOGOS MARQUEE */}
          <div className="reveal-hero mt-60 marquee-wrapper border-y border-white/5 bg-white/[0.02]">
            <div className="flex gap-40 animate-marquee whitespace-nowrap py-12">
              {[...LOGOS, ...LOGOS].map((logo, i) => (
                <div key={i} className="flex items-center gap-6 group cursor-pointer px-12">
                  <img src={logo.url} className="h-10 md:h-14 opacity-30 group-hover:opacity-100 transition-all filter brightness-200" alt={logo.name} />
                  <span className="label-cyber text-[10px] opacity-10 group-hover:opacity-100 transition-all">{logo.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* --- PRICING --- */}
      <section id="pricing" className={`py-60 px-6 transition-all duration-1000 ${!user || !user.email_confirmed_at ? 'opacity-0 scale-95 pointer-events-none' : 'opacity-100'}`}>
        <div className="container mx-auto">
          <div className="text-center mb-60">
            <span className="label-cyber mb-8 block">Access Protocol</span>
            <h2 className="text-titan text-7xl md:text-[12rem] leading-none mb-12">PRICING.</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-12 max-w-7xl mx-auto">
            {[
              { t: 'MONTHLY', p: '29', f: ['21K+ Channels', '4K Streaming', '1 Device Access'] },
              { t: 'ANNUAL ELITE', p: '59', f: ['8K RAW Quality', '3 Devices Access', 'Priority Tunnel', 'Anti-Buffer Pro'], featured: true },
              { t: 'ULTIMATE INF', p: '99', f: ['Uncompressed Feed', '5 Devices Access', 'VPN Integrated', 'Ghost Proxy Access'] }
            ].map((plan, i) => (
              <div key={i} className={`glass-luxe p-16 rounded-[5rem] flex flex-col ${plan.featured ? 'md:scale-110 border-[#ff003c]/40 shadow-[0_0_150px_rgba(255,0,60,0.2)]' : ''}`}>
                <h3 className="label-cyber mb-12 opacity-30 text-xl">{plan.t}</h3>
                <div className="flex items-baseline gap-4 mb-20">
                  <span className="text-titan text-8xl">${plan.p}</span>
                  <span className="label-cyber opacity-20">/ Year</span>
                </div>
                <div className="space-y-8 mb-32 flex-grow">
                  {plan.f.map((feat, fi) => (
                    <div key={fi} className="flex items-center gap-6 group/item">
                      <div className="w-1.5 h-1.5 bg-[#ff003c] rounded-full opacity-20 group-hover/item:opacity-100 transition-opacity" />
                      <span className="label-cyber text-[9px] opacity-20 group-hover/item:opacity-100 transition-opacity">{feat}</span>
                    </div>
                  ))}
                </div>
                <button onClick={() => { setActivePlan(plan); setCheckoutOpen(true); }} className={`btn-command w-full py-8 text-[11px] ${plan.featured ? '' : 'bg-white/5 text-white border-white/10 hover:bg-white hover:text-black'}`}>Initialize Sync</button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- MODALS --- */}
      <AnimatePresence>
        {authOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[700] flex items-center justify-center bg-black/98 backdrop-blur-[100px] p-6">
            <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="max-w-md w-full glass-luxe p-16 rounded-[4rem] relative">
              <button onClick={() => setAuthOpen(false)} className="absolute top-10 right-10 text-white/20 hover:text-white"><X size={32} /></button>
              <div className="text-center mb-16">
                <h2 className="text-titan text-5xl mb-6">Authorize.</h2>
                <p className="label-cyber opacity-40">Neural Node Activation</p>
              </div>
              <AuthForm onClose={() => setAuthOpen(false)} />
            </motion.div>
          </motion.div>
        )}
        {checkoutOpen && activePlan && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[700] flex items-center justify-center bg-black/98 backdrop-blur-[100px] p-6">
            <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="max-w-xl w-full glass-luxe p-20 rounded-[5rem] relative text-center">
              <button onClick={() => setCheckoutOpen(false)} className="absolute top-12 right-12 text-white/20 hover:text-white"><X size={32} /></button>
              <div className="w-24 h-24 bg-[#ff003c]/10 rounded-full flex items-center justify-center mx-auto mb-12 border border-[#ff003c]/20 animate-pulse"><Crown className="text-[#ff003c]" size={56} /></div>
              <h2 className="text-titan text-5xl mb-6">Purchase.</h2>
              <p className="label-cyber opacity-20 mb-16 italic">Authorizing Stripe uplink for ${activePlan.p}</p>
              <button onClick={handleCheckout} className="btn-command w-full text-[12px]">Confirm Transmission</button>
            </motion.div>
          </motion.div>
        )}
        {iptvCode && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[800] flex items-center justify-center bg-black/98 backdrop-blur-[120px] p-6">
            <motion.div initial={{ scale: 0.7, y: 100 }} animate={{ scale: 1, y: 0 }} className="max-w-2xl w-full glass-luxe p-24 rounded-[6rem] relative text-center border-[#ff003c]/40 shadow-[0_0_200px_rgba(255,0,60,0.3)]">
              <div className="w-32 h-32 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-12 border border-green-500/30 shadow-[0_0_100px_rgba(34,197,94,0.3)]"><CheckCircle2 className="text-green-500" size={64} /></div>
              <h2 className="text-titan text-7xl mb-8 text-green-500">SUCCESS.</h2>
              <p className="label-cyber opacity-40 mb-20 text-center leading-loose">Uplink Code Synchronized with your Neural Dashboard.</p>
              <div className="bg-white/5 p-16 rounded-[4rem] border border-white/10 mb-20 flex items-center justify-center gap-12 group cursor-pointer hover:bg-white/10 transition-all" onClick={() => { navigator.clipboard.writeText(iptvCode); confetti({ particleCount: 50 }); }}>
                <span className="text-titan text-7xl tracking-[0.4em]">{iptvCode}</span>
                <Copy size={48} className="text-white/20 group-hover:text-white transition-all" />
              </div>
              <button onClick={() => setIptvCode(null)} className="label-cyber opacity-20 hover:opacity-100 transition-all">Terminate Uplink</button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <footer className="py-60 bg-black/40 border-t border-white/5 text-center">
        <h1 className="text-titan text-[clamp(4rem,10vw,15rem)] opacity-10 mb-20">TITAN TV</h1>
        <p className="label-cyber opacity-10 text-[8px] tracking-[1em]">ALL DATA ENCRYPTED. [© 2026]</p>
      </footer>
    </main>
  );
}

const AuthForm = ({ onClose }) => {
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
        setMessage("Lien d'activation transmis. Consultez votre Inbox.");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        onClose();
      }
    } catch (err) { setError(err.message); } finally { setLoading(false); }
  };

  if (message) return (
    <div className="text-center py-10 space-y-12">
      <div className="w-24 h-24 bg-[#ff003c]/10 rounded-full flex items-center justify-center mx-auto border border-[#ff003c]/20 animate-pulse"><Mail className="text-[#ff003c]" size={40} /></div>
      <p className="label-cyber text-white/60 leading-loose text-center">{message}</p>
      <button onClick={onClose} className="btn-command w-full py-5 text-[10px]">Acknowledge</button>
    </div>
  );

  return (
    <form onSubmit={handleAuth} className="space-y-8">
      <input type="email" required placeholder="NEURAL.ID" className="w-full rounded-2xl py-8 px-12 text-sm outline-none bg-white/5 border border-white/10 focus:border-[#ff003c] transition-all font-mono" value={email} onChange={(e) => setEmail(e.target.value)} />
      <input type="password" required placeholder="ACCESS.KEY" className="w-full rounded-2xl py-8 px-12 text-sm outline-none bg-white/5 border border-white/10 focus:border-[#ff003c] transition-all font-mono" value={password} onChange={(e) => setPassword(e.target.value)} />
      {error && <div className="text-[#ff003c] text-[10px] text-center font-bold uppercase tracking-widest bg-[#ff003c]/05 py-4 rounded-xl">{error}</div>}
      <button disabled={loading} className="btn-command w-full py-8 text-[11px] shadow-3xl">
        {loading ? 'Transmitting...' : mode === 'login' ? 'Establish Link' : 'Initialize Node'}
      </button>
      <div className="text-center pt-8">
        <button type="button" onClick={() => setMode(mode === 'login' ? 'signup' : 'login')} className="label-cyber text-[8px] opacity-20 hover:opacity-100 transition-all">
          {mode === 'login' ? "New Neural Link? Sync" : "Existing Link? Recall"}
        </button>
      </div>
    </form>
  );
};
