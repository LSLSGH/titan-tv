import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, Menu, Mail, Power, Signal, Video, Shield, Zap, 
  Activity, Crown, ChevronRight, ArrowRight, Play, Star, 
  Smartphone, Tv, CheckCircle2, Monitor, Lock, AlertCircle,
  Copy, Check, History, CreditCard, Calendar, Hash, Layout,
  Cpu, Wifi, Database, Layers, ExternalLink, Plus, Trash2, 
  CreditCard as CardIcon
} from 'lucide-react';
import confetti from 'canvas-confetti';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { supabase } from './lib/supabase';

gsap.registerPlugin(ScrollTrigger);

// --- Guaranteed Official SVG Logos ---

const OFFICIAL_CHANNELS = [
  { name: 'Netflix', url: 'https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg' },
  { name: 'HBO', url: 'https://upload.wikimedia.org/wikipedia/commons/1/17/HBO_logo.svg' },
  { name: 'Disney+', url: 'https://upload.wikimedia.org/wikipedia/commons/3/3e/Disney%2B_logo.svg' },
  { name: 'Prime Video', url: 'https://upload.wikimedia.org/wikipedia/commons/f/f1/Prime_Video_logo.svg' },
  { name: 'DAZN', url: 'https://upload.wikimedia.org/wikipedia/commons/e/e0/DAZN_logo.svg' },
  { name: 'beIN SPORTS', url: 'https://upload.wikimedia.org/wikipedia/commons/2/25/BeIN_Sports_logo.svg' }
];

// --- Cinematic Background ---

const BackgroundImmersive = () => (
  <div className="fixed inset-0 z-[-1] pointer-events-none overflow-hidden bg-[#010101]">
    <div className="orb orb-1" />
    <div className="orb orb-2" />
    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] mix-blend-overlay" />
  </div>
);

const Navbar = ({ user }) => {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handle = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handle);
    return () => window.removeEventListener('scroll', handle);
  }, []);

  return (
    <nav className={`fixed top-0 w-full z-[1000] px-6 md:px-20 py-10 flex justify-between items-center transition-all duration-1000 ${scrolled ? 'bg-black/80 backdrop-blur-3xl py-6 border-b border-white/5' : ''}`}>
      <div className="flex items-center gap-24">
        <Link to="/" className="h-titan text-5xl text-white">TITAN <span className="text-[#00f2ff]">TV</span></Link>
        <div className="hidden xl:flex items-center gap-12">
          {['Network', 'Pricing', 'Dashboard'].map(item => (
            <Link key={item} to={item === 'Pricing' ? '/pricing' : item === 'Dashboard' ? '/dashboard' : '/'} className="label-tech text-[10px] opacity-40 hover:opacity-100 transition-all">{item}</Link>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-8">
        {user ? (
          <div className="flex items-center gap-6">
            <Link to="/dashboard" className="flex items-center gap-3 bg-white text-black px-10 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-[#00f2ff] transition-all">
              <Layout size={14} /> Terminal
            </Link>
            <button onClick={() => supabase.auth.signOut()} className="text-white/20 hover:text-[#00f2ff] transition-colors"><Power size={20} /></button>
          </div>
        ) : (
          <button onClick={() => navigate('/auth')} className="btn-premium py-4 px-12">ESTABLISH LINK</button>
        )}
      </div>
    </nav>
  );
};

// --- Page Components ---

const HomePage = ({ user }) => {
  const navigate = useNavigate();
  const containerRef = useRef(null);

  useGSAP(() => {
    gsap.from('.reveal', { y: 100, opacity: 0, duration: 1.5, ease: "power4.out", stagger: 0.2 });
  }, { scope: containerRef });

  return (
    <div ref={containerRef} className="pt-60 pb-80">
      <div className="container mx-auto text-center px-6 relative">
        <div className="reveal mb-32">
          <span className="label-tech mb-12 block animate-pulse">Neural Streaming Infrastructure v8.5.2</span>
          <h1 className="h-titan text-[clamp(4.5rem,15vw,20rem)] mb-24 leading-none">
            TITAN <span className="text-white/10">STREAMS.</span>
          </h1>
        </div>

        {/* Improved Floating Logos (Official SVGs) */}
        <div className="reveal relative max-w-5xl mx-auto mb-60 h-[500px] flex items-center justify-center">
          <div className="absolute inset-0 z-0">
            {OFFICIAL_CHANNELS.map((logo, i) => (
              <motion.div
                key={i}
                animate={{ 
                  y: [0, -40, 0],
                  x: [0, i % 2 === 0 ? 40 : -40, 0],
                  scale: [1, 1.05, 1]
                }}
                transition={{ 
                  duration: 5 + i, 
                  repeat: Infinity, 
                  ease: "easeInOut" 
                }}
                className="absolute"
                style={{ 
                  left: `${10 + (i * 16)}%`, 
                  top: `${15 + (i % 2 * 35)}%` 
                }}
              >
                <div className="glass-luxe p-8 rounded-[2.5rem] border-white/10 group cursor-pointer hover:border-[#00f2ff]/40 transition-all shadow-2xl">
                  <img 
                    src={logo.url} 
                    className="h-12 md:h-16 opacity-50 group-hover:opacity-100 transition-all filter brightness-[2] drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]" 
                    alt={logo.name} 
                  />
                  <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 label-tech text-[8px] opacity-0 group-hover:opacity-100 transition-all">{logo.name}</div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="relative z-10 glass-luxe p-24 rounded-[6rem] border-[#00f2ff]/30 shadow-[0_0_100px_rgba(0,242,255,0.1)]">
            <div className="w-32 h-32 bg-[#00f2ff]/10 rounded-full flex items-center justify-center mx-auto mb-12 border border-[#00f2ff]/20 animate-pulse shadow-[inset_0_0_50px_rgba(0,242,255,0.2)]">
              <Tv size={64} className="text-[#00f2ff]" />
            </div>
            <h3 className="h-titan text-6xl mb-8">TITAN GRID.</h3>
            <p className="label-tech opacity-40 text-center leading-loose mb-16 max-w-md mx-auto">Uncompressed 8K RAW Streaming Protocol for Neural Nodes.</p>
            {!user ? (
              <button onClick={() => navigate('/auth')} className="btn-premium scale-110">Initialize Sync</button>
            ) : (
              <button onClick={() => navigate('/pricing')} className="btn-premium scale-110">Select Your Plan</button>
            )}
          </div>
        </div>

        {/* LOGO MARQUEE: REFINED */}
        <div className="reveal marquee-wrapper border-y border-white/5 bg-white/[0.01]">
          <div className="flex gap-60 animate-marquee whitespace-nowrap py-20 px-6">
            {[...OFFICIAL_CHANNELS, ...OFFICIAL_CHANNELS].map((logo, i) => (
              <div key={i} className="flex items-center gap-10 group cursor-pointer px-12 transition-all">
                <img 
                  src={logo.url} 
                  className="h-12 md:h-16 opacity-30 group-hover:opacity-100 transition-all filter brightness-[3] grayscale-[50%]" 
                  alt={logo.name} 
                />
                <span className="label-tech text-[10px] opacity-10 group-hover:opacity-100 transition-all">{logo.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const PricingPage = ({ user }) => {
  const [checkoutPlan, setCheckoutPlan] = useState(null);
  const [iptvCode, setIptvCode] = useState(null);
  const navigate = useNavigate();

  const handlePurchase = async () => {
    const code = Math.random().toString(36).substring(2, 10).toUpperCase();
    await supabase.from('purchases').insert({
      user_id: user.id,
      plan_name: checkoutPlan.t,
      amount: parseFloat(checkoutPlan.p),
      iptv_code: code
    });
    setIptvCode(code);
    confetti({ particleCount: 300, spread: 100, origin: { y: 0.6 } });
    setCheckoutPlan(null);
  };

  return (
    <div className="pt-60 pb-80 px-6">
      <div className="container mx-auto">
        <div className="text-center mb-60">
          <span className="label-tech mb-8 block text-[#00f2ff]">Uplink Pricing</span>
          <h2 className="h-titan text-7xl md:text-[12rem] leading-none mb-12">PRICING.</h2>
        </div>

        <div className="grid md:grid-cols-3 gap-16 max-w-7xl mx-auto">
          {[
            { t: 'MONTHLY', p: '19', f: ['21K+ Channels', '4K Streaming', '1 Device Access'] },
            { t: 'ANNUAL ELITE', p: '59', f: ['8K RAW Quality', '3 Devices Access', 'Priority Tunnel', 'Anti-Buffer Pro'], featured: true },
            { t: 'ULTIMATE', p: '99', f: ['Uncompressed Feed', '5 Devices Access', 'VPN Integrated', 'Ghost Proxy Access'] }
          ].map((plan, i) => (
            <div key={i} className={`glass-luxe p-16 rounded-[5rem] flex flex-col ${plan.featured ? 'md:scale-110 border-[#00f2ff]/40 shadow-[0_0_150px_rgba(0,242,255,0.1)]' : ''}`}>
              <h3 className="label-tech mb-12 opacity-30 text-xl">{plan.t}</h3>
              <div className="flex items-baseline gap-4 mb-20">
                <span className="h-titan text-8xl">${plan.p}</span>
                <span className="label-tech opacity-20">/ Year</span>
              </div>
              <div className="space-y-8 mb-32 flex-grow">
                {plan.f.map((feat, fi) => (
                  <div key={fi} className="flex items-center gap-6 group">
                    <div className="w-1.5 h-1.5 bg-[#00f2ff] rounded-full opacity-20 group-hover:opacity-100 transition-opacity" />
                    <span className="label-tech text-[9px] opacity-20 group-hover:opacity-100 transition-opacity">{feat}</span>
                  </div>
                ))}
              </div>
              <button 
                onClick={() => {
                  if (!user) navigate('/auth');
                  else setCheckoutPlan(plan);
                }} 
                className={`w-full py-8 rounded-[2rem] text-[10px] font-black uppercase tracking-[0.3em] transition-all ${plan.featured ? 'bg-[#00f2ff] text-black' : 'bg-white/5 border border-white/10 hover:bg-white hover:text-black'}`}
              >
                Sync Node
              </button>
            </div>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {checkoutPlan && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/98 backdrop-blur-[100px] p-6">
            <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="max-w-xl w-full glass-luxe p-20 rounded-[5rem] relative text-center">
              <button onClick={() => setCheckoutPlan(null)} className="absolute top-12 right-12 text-white/20 hover:text-white"><X size={32} /></button>
              <div className="w-24 h-24 bg-[#00f2ff]/10 rounded-full flex items-center justify-center mx-auto mb-12 border border-[#00f2ff]/20 animate-pulse"><Crown className="text-[#00f2ff]" size={56} /></div>
              <h2 className="h-titan text-5xl mb-6">Authorize.</h2>
              <p className="label-tech opacity-20 mb-16 italic tracking-[0.4em]">Secure Stripe Session for ${checkoutPlan.p}</p>
              <button onClick={handlePurchase} className="btn-premium w-full text-[12px]">Confirm Sync</button>
            </motion.div>
          </motion.div>
        )}
        {iptvCode && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[1100] flex items-center justify-center bg-black/98 backdrop-blur-[120px] p-6">
            <motion.div initial={{ scale: 0.7, y: 100 }} animate={{ scale: 1, y: 0 }} className="max-w-2xl w-full glass-luxe p-24 rounded-[6rem] relative text-center border-[#00f2ff]/40 shadow-[0_0_200px_rgba(0,242,255,0.2)]">
              <div className="w-32 h-32 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-12 border border-green-500/30 shadow-[0_0_100px_rgba(34,197,94,0.3)]"><CheckCircle2 className="text-green-500" size={64} /></div>
              <h2 className="h-titan text-7xl mb-8 text-green-500">SUCCESS.</h2>
              <p className="label-tech opacity-40 mb-20 text-center leading-loose">Access Code Synchronized with your Dashboard.</p>
              <div className="bg-white/5 p-16 rounded-[4rem] border border-white/10 mb-20 flex items-center justify-center gap-12 group cursor-pointer hover:bg-white/10 transition-all shadow-[inset_0_0_50px_rgba(0,0,0,0.5)]" onClick={() => { navigator.clipboard.writeText(iptvCode); confetti({ particleCount: 50 }); }}>
                <span className="h-titan text-7xl tracking-[0.4em]">{iptvCode}</span>
                <Copy size={48} className="text-white/20 group-hover:text-white transition-all" />
              </div>
              <button onClick={() => setIptvCode(null)} className="label-tech opacity-20 hover:opacity-100 transition-all">Terminate Uplink</button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const DashboardPage = ({ user }) => {
  const [purchases, setPurchases] = useState([]);
  const [cards, setCards] = useState([]);
  const [activeTab, setActiveTab] = useState('codes');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Card form state
  const [cardHolder, setCardHolder] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvc, setCvc] = useState('');
  const [savingCard, setSavingCard] = useState(false);

  useEffect(() => {
    if (!user) { navigate('/auth'); return; }
    setLoading(true);
    const p1 = supabase.from('purchases').select('*').eq('user_id', user.id).order('created_at', { ascending: false });
    const p2 = supabase.from('payment_methods').select('*').eq('user_id', user.id).order('created_at', { ascending: false });
    
    Promise.all([p1, p2]).then(([r1, r2]) => {
      setPurchases(r1.data || []);
      setCards(r2.data || []);
      setLoading(false);
    });
  }, [user]);

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

  if (!user) return null;

  return (
    <div className="pt-60 pb-80 px-6 md:px-20 overflow-y-auto">
      <div className="max-w-6xl mx-auto relative">
        <div className="flex justify-between items-center mb-40">
          <div>
            <span className="label-tech mb-6 block text-[#00f2ff]">Node Management</span>
            <h2 className="h-titan text-7xl md:text-[9rem]">DASHBOARD.</h2>
          </div>
        </div>

        <div className="flex gap-16 mb-20 border-b border-white/5 pb-10">
          <button onClick={() => setActiveTab('codes')} className={`label-tech text-[10px] transition-all ${activeTab === 'codes' ? 'text-[#00f2ff]' : 'text-white/20'}`}>Active Transmissions</button>
          <button onClick={() => setActiveTab('billing')} className={`label-tech text-[10px] transition-all ${activeTab === 'billing' ? 'text-[#00f2ff]' : 'text-white/20'}`}>Secure Billing</button>
        </div>

        {loading ? (
          <div className="py-40 text-center label-tech animate-pulse">Syncing...</div>
        ) : activeTab === 'codes' ? (
          <div className="grid gap-12">
            {purchases.length === 0 ? (
              <div className="py-40 text-center glass-luxe rounded-[4rem] opacity-20 text-2xl uppercase font-black">No codes detected.</div>
            ) : (
              purchases.map(p => (
                <div key={p.id} className="glass-luxe p-12 rounded-[4rem] flex flex-col md:flex-row justify-between items-center group relative overflow-hidden">
                  <div className="flex items-center gap-12">
                    <div className="w-24 h-24 bg-[#00f2ff]/10 rounded-[2.5rem] flex items-center justify-center text-[#00f2ff] border border-[#00f2ff]/20 group-hover:scale-110 transition-transform"><Monitor size={48} /></div>
                    <div>
                      <h4 className="h-titan text-4xl mb-4">{p.plan_name}</h4>
                      <div className="flex gap-12 opacity-30 text-[9px] font-black uppercase tracking-widest">
                        <span className="flex items-center gap-3"><Calendar size={14} /> {new Date(p.created_at).toLocaleDateString()}</span>
                        <span className="flex items-center gap-3"><CreditCard size={14} /> ${p.amount} PAID</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-12 bg-black/40 px-16 py-8 rounded-[2.5rem] border border-white/5 group-hover:border-[#00f2ff]/40 transition-all cursor-pointer" onClick={() => { navigator.clipboard.writeText(p.iptv_code); confetti({ particleCount: 50 }); }}>
                    <span className="h-titan text-5xl tracking-[0.4em] text-[#00f2ff]">{p.iptv_code}</span>
                    <Copy size={36} className="text-white/20 group-hover:text-white" />
                  </div>
                </div>
              ))
            )}
          </div>
        ) : (
          <div className="grid lg:grid-cols-2 gap-20">
            <div className="space-y-12">
              <h3 className="label-tech text-[10px] opacity-30 mb-12 uppercase tracking-[0.5em]">Registered Credentials</h3>
              {cards.map(c => (
                <div key={c.id} className="glass-luxe p-10 rounded-[3rem] flex justify-between items-center border-l-4 border-l-[#00f2ff]">
                  <div className="flex items-center gap-8">
                    <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center"><CardIcon size={32} /></div>
                    <div>
                      <p className="text-2xl font-bold tracking-widest font-mono">{c.card_number}</p>
                      <p className="label-tech text-[8px] opacity-40">{c.card_holder} | {c.expiry}</p>
                    </div>
                  </div>
                  <button onClick={async () => { await supabase.from('payment_methods').delete().eq('id', c.id); setCards(cards.filter(x => x.id !== c.id)); }} className="text-white/20 hover:text-[#00f2ff] transition-all"><Trash2 size={24} /></button>
                </div>
              ))}
            </div>

            <div className="glass-luxe p-16 rounded-[5rem] border-[#00f2ff]/20">
              <h3 className="label-tech text-[12px] mb-16 uppercase tracking-[0.5em]">Initialize Card Sync</h3>
              <form onSubmit={handleAddCard} className="space-y-8">
                <input type="text" required placeholder="HOLDER NAME" className="w-full bg-white/5 border border-white/10 rounded-2xl py-8 px-12 text-sm outline-none focus:border-[#00f2ff] transition-all font-mono" value={cardHolder} onChange={e => setCardHolder(e.target.value)} />
                <input type="text" required placeholder="CARD NUMBER" className="w-full bg-white/5 border border-white/10 rounded-2xl py-8 px-12 text-sm outline-none focus:border-[#00f2ff] transition-all font-mono" value={cardNumber} onChange={e => setCardNumber(e.target.value)} />
                <div className="grid grid-cols-2 gap-8">
                  <input type="text" required placeholder="MM/YY" className="w-full bg-white/5 border border-white/10 rounded-2xl py-8 px-12 text-sm outline-none focus:border-[#00f2ff] transition-all font-mono" value={expiry} onChange={e => setExpiry(e.target.value)} />
                  <input type="text" required placeholder="CVC" className="w-full bg-white/5 border border-white/10 rounded-2xl py-8 px-12 text-sm outline-none focus:border-[#00f2ff] transition-all font-mono" value={cvc} onChange={e => setCvc(e.target.value)} />
                </div>
                <button disabled={savingCard} className="btn-premium w-full py-8 flex items-center justify-center gap-6">
                  <Plus size={24} /> {savingCard ? 'Syncing...' : 'Sync Card'}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const AuthPage = () => {
  const [mode, setMode] = useState('signup');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const navigate = useNavigate();

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
        navigate('/');
      }
    } catch (err) { setError(err.message); } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center pt-20 px-6">
      <motion.div initial={{ scale: 0.9, y: 50 }} animate={{ scale: 1, y: 0 }} className="max-w-md w-full glass-luxe p-16 rounded-[4rem] relative">
        <div className="text-center mb-16">
          <h2 className="h-titan text-5xl mb-6">{mode === 'login' ? 'Recall.' : 'Initialize.'}</h2>
          <p className="label-tech opacity-40">Titan Neural Network Access</p>
        </div>

        {message ? (
          <div className="text-center py-10 space-y-12">
            <div className="w-24 h-24 bg-[#00f2ff]/10 rounded-full flex items-center justify-center mx-auto border border-[#00f2ff]/20 animate-pulse"><Mail className="text-[#00f2ff]" size={40} /></div>
            <p className="label-tech text-white/60 leading-loose text-center">{message}</p>
            <button onClick={() => navigate('/')} className="btn-premium w-full py-5 text-[10px]">Back to Home</button>
          </div>
        ) : (
          <form onSubmit={handleAuth} className="space-y-8">
            <input type="email" required placeholder="NEURAL.ID" className="w-full rounded-2xl py-8 px-12 text-sm outline-none bg-white/5 border border-white/10 focus:border-[#00f2ff] transition-all font-mono" value={email} onChange={(e) => setEmail(e.target.value)} />
            <input type="password" required placeholder="ACCESS.KEY" className="w-full rounded-2xl py-8 px-12 text-sm outline-none bg-white/5 border border-white/10 focus:border-[#00f2ff] transition-all font-mono" value={password} onChange={(e) => setPassword(e.target.value)} />
            {error && <div className="text-[#00f2ff] text-[10px] text-center font-bold uppercase tracking-widest bg-[#00f2ff]/05 py-4 rounded-xl">{error}</div>}
            <button disabled={loading} className="btn-premium w-full py-8 text-[11px] shadow-3xl">
              {loading ? 'Transmitting...' : mode === 'login' ? 'Establish Link' : 'Initialize Node'}
            </button>
            <div className="text-center pt-8">
              <button type="button" onClick={() => setMode(mode === 'login' ? 'signup' : 'login')} className="label-tech text-[9px] opacity-20 hover:opacity-100 transition-all">
                {mode === 'login' ? "New Neural Link? Sync" : "Existing Link? Recall"}
              </button>
            </div>
          </form>
        )}
      </motion.div>
    </div>
  );
};

export default function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => setUser(session?.user ?? null));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => setUser(session?.user ?? null));
    return () => subscription.unsubscribe();
  }, []);

  return (
    <Router>
      <main className="min-h-screen bg-[#010101] text-white">
        <BackgroundImmersive />
        <Navbar user={user} />
        
        <Routes>
          <Route path="/" element={<HomePage user={user} />} />
          <Route path="/pricing" element={<PricingPage user={user} />} />
          <Route path="/dashboard" element={<DashboardPage user={user} />} />
          <Route path="/auth" element={<AuthPage />} />
        </Routes>

        <footer className="py-60 bg-black/40 border-t border-white/5 text-center">
          <h1 className="h-titan text-[clamp(4rem,10vw,15rem)] opacity-10 mb-20">TITAN TV</h1>
          <p className="label-tech opacity-10 text-[8px] tracking-[1em]">ALL DATA ENCRYPTED. [© 2026]</p>
        </footer>
      </main>
    </Router>
  );
}
