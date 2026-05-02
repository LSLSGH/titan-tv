import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
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

// --- Fixed High-Quality Logos ---

const RELIABLE_LOGOS = [
  { name: 'Netflix', url: 'https://logo.clearbit.com/netflix.com' },
  { name: 'HBO', url: 'https://logo.clearbit.com/hbo.com' },
  { name: 'ESPN', url: 'https://logo.clearbit.com/espn.com' },
  { name: 'DAZN', url: 'https://logo.clearbit.com/dazn.com' },
  { name: 'Disney+', url: 'https://logo.clearbit.com/disneyplus.com' },
  { name: 'Prime Video', url: 'https://logo.clearbit.com/amazon.com' },
  { name: 'Sky', url: 'https://logo.clearbit.com/sky.com' },
  { name: 'Canal+', url: 'https://logo.clearbit.com/canal-plus.com' }
];

// --- Cinematic Components ---

const BackgroundMaster = () => (
  <div className="fixed inset-0 z-[-1] pointer-events-none overflow-hidden bg-[#000000]">
    <div className="absolute top-[-20%] left-[-10%] w-[100vw] h-[100vw] bg-[#ff003c]/10 blur-[250px] rounded-full opacity-30 animate-pulse" />
    <div className="absolute bottom-[-20%] right-[-10%] w-[80vw] h-[80vw] bg-[#7000ff]/05 blur-[200px] rounded-full opacity-30 animate-pulse" style={{ animationDelay: '-5s' }} />
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
    <nav className={`fixed top-0 w-full z-[1000] px-6 md:px-20 py-10 flex justify-between items-center transition-all duration-1000 ${scrolled ? 'bg-black/60 backdrop-blur-3xl py-6 border-b border-white/5' : ''}`}>
      <div className="flex items-center gap-24">
        <Link to="/" className="text-titan text-5xl">TITAN <span className="text-white">TV</span></Link>
        <div className="hidden xl:flex items-center gap-12">
          <Link to="/" className="text-[10px] font-black uppercase tracking-[0.4em] text-white/30 hover:text-white transition-all">Network</Link>
          <Link to="/pricing" className="text-[10px] font-black uppercase tracking-[0.4em] text-white/30 hover:text-white transition-all">Pricing</Link>
          <Link to="/dashboard" className="text-[10px] font-black uppercase tracking-[0.4em] text-white/30 hover:text-white transition-all">Dashboard</Link>
        </div>
      </div>

      <div className="flex items-center gap-8">
        {user ? (
          <div className="flex items-center gap-6">
            <Link to="/dashboard" className="flex items-center gap-3 bg-white text-black px-10 py-3 rounded-lg text-[9px] font-black uppercase tracking-widest hover:bg-[#ff003c] hover:text-white transition-all">
              <Layout size={14} /> My Node
            </Link>
            <button onClick={() => supabase.auth.signOut()} className="text-white/20 hover:text-[#ff003c] transition-colors"><Power size={20} /></button>
          </div>
        ) : (
          <button onClick={() => navigate('/auth')} className="btn-uplink py-4 px-12 text-[10px]">Establish Uplink</button>
        )}
      </div>
    </nav>
  );
};

// --- Pages ---

const HomePage = ({ user }) => {
  const containerRef = useRef(null);
  const navigate = useNavigate();

  useGSAP(() => {
    gsap.from('.reveal-hero', { y: 100, opacity: 0, duration: 2, ease: "power4.out", stagger: 0.3 });
  }, { scope: containerRef });

  return (
    <div ref={containerRef} className="pt-60 pb-80">
      <section className="container mx-auto text-center px-6">
        <div className="reveal-hero mb-24">
          <span className="text-[10px] font-black uppercase tracking-[0.8em] text-[#ff003c] mb-12 block animate-pulse">Neural Streaming Engine v8.4.2</span>
          <h1 className="text-titan text-[clamp(4.5rem,15vw,18rem)] mb-24 leading-none">
            TITAN <span className="text-white opacity-10">TV.</span>
          </h1>
        </div>

        {/* MASSIVE STRAIGHT TV WITH 3D VIDEO */}
        <div className="reveal-hero max-w-[1200px] mx-auto py-20">
          <div className="tv-master aspect-video relative group border-white/10">
            {/* 3D Abstract Video Loop */}
            <video 
              autoPlay 
              muted 
              loop 
              playsInline 
              className="tv-screen-video"
            >
              <source src="https://assets.mixkit.co/videos/preview/mixkit-abstract-holographic-spheres-moving-31641-large.mp4" type="video/mp4" />
            </video>

            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60" />
            
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-12">
              {!user ? (
                <button onClick={() => navigate('/auth')} className="btn-uplink scale-125">Initialize Protocol</button>
              ) : !user.email_confirmed_at ? (
                <div className="bg-black/60 backdrop-blur-3xl p-16 rounded-[4rem] border border-yellow-500/20 max-w-xl">
                  <AlertCircle className="mx-auto mb-8 text-yellow-500 animate-bounce" size={64} />
                  <h4 className="text-titan text-3xl mb-4">Verification Needed</h4>
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40 leading-loose">Confirm your identity link in your neural inbox.</p>
                </div>
              ) : (
                <button onClick={() => navigate('/pricing')} className="btn-uplink scale-125 shadow-[0_0_100px_rgba(255,0,60,0.5)]">SELECT UPLINK</button>
              )}
            </div>
          </div>
        </div>

        {/* FIXED LOGO MARQUEE */}
        <div className="reveal-hero mt-80 marquee-wrapper border-y border-white/5 bg-white/[0.01]">
          <div className="flex gap-60 animate-marquee whitespace-nowrap py-20">
            {[...RELIABLE_LOGOS, ...RELIABLE_LOGOS].map((logo, i) => (
              <div key={i} className="flex items-center gap-10 group cursor-pointer px-12">
                <img src={logo.url} className="logo-item" alt={logo.name} onError={(e) => e.target.style.display = 'none'} />
                <span className="text-[10px] font-black uppercase tracking-[0.5em] text-white/10 group-hover:text-white transition-all">{logo.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
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
          <span className="text-[10px] font-black uppercase tracking-[0.5em] text-[#ff003c] mb-8 block">Network Grid</span>
          <h2 className="text-titan text-7xl md:text-[12rem] leading-none mb-12">PRICING.</h2>
        </div>

        <div className="grid md:grid-cols-3 gap-16 max-w-7xl mx-auto">
          {[
            { t: 'MONTHLY', p: '19', f: ['21K+ Channels', '4K Streaming', '1 Device Access'] },
            { t: 'ANNUAL ELITE', p: '59', f: ['8K RAW Quality', '3 Devices Access', 'Priority Tunnel', 'Anti-Buffer Pro'], featured: true },
            { t: 'ULTIMATE INF', p: '99', f: ['Uncompressed Feed', '5 Devices Access', 'VPN Integrated', 'Ghost Proxy Access'] }
          ].map((plan, i) => (
            <div key={i} className={`bg-white/[0.02] backdrop-blur-3xl border border-white/5 p-16 rounded-[5rem] flex flex-col ${plan.featured ? 'md:scale-110 border-[#ff003c]/40 shadow-[0_0_150px_rgba(255,0,60,0.1)]' : ''}`}>
              <h3 className="text-[10px] font-black uppercase tracking-[0.5em] opacity-30 mb-12">{plan.t}</h3>
              <div className="flex items-baseline gap-4 mb-20">
                <span className="text-titan text-8xl">${plan.p}</span>
                <span className="text-[10px] font-black uppercase tracking-widest opacity-20">/ Year</span>
              </div>
              <div className="space-y-8 mb-32 flex-grow">
                {plan.f.map((feat, fi) => (
                  <div key={fi} className="flex items-center gap-6 group">
                    <div className="w-1.5 h-1.5 bg-[#ff003c] rounded-full opacity-20 group-hover:opacity-100 transition-opacity" />
                    <span className="text-[9px] font-black uppercase tracking-widest opacity-20 group-hover:opacity-100 transition-opacity">{feat}</span>
                  </div>
                ))}
              </div>
              <button 
                onClick={() => {
                  if (!user) navigate('/auth');
                  else setCheckoutPlan(plan);
                }} 
                className={`w-full py-8 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${plan.featured ? 'bg-[#ff003c] text-white' : 'bg-white/5 border border-white/10 hover:bg-white hover:text-black'}`}
              >
                Sync Plan
              </button>
            </div>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {checkoutPlan && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/98 backdrop-blur-[100px] p-6">
            <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="max-w-xl w-full bg-black/40 backdrop-blur-3xl border border-white/10 p-20 rounded-[5rem] relative text-center">
              <button onClick={() => setCheckoutPlan(null)} className="absolute top-12 right-12 text-white/20 hover:text-white"><X size={32} /></button>
              <div className="w-24 h-24 bg-[#ff003c]/10 rounded-full flex items-center justify-center mx-auto mb-12 border border-[#ff003c]/20 animate-pulse"><Crown className="text-[#ff003c]" size={56} /></div>
              <h2 className="text-titan text-5xl mb-6">Authorize.</h2>
              <p className="text-[9px] font-black uppercase tracking-[0.4em] text-white/20 mb-16 italic">Encrypted Stripe Session for ${checkoutPlan.p}</p>
              <button onClick={handlePurchase} className="btn-uplink w-full text-[12px]">Confirm Transmission</button>
            </motion.div>
          </motion.div>
        )}
        {iptvCode && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[1100] flex items-center justify-center bg-black/98 backdrop-blur-[120px] p-6">
            <motion.div initial={{ scale: 0.7, y: 100 }} animate={{ scale: 1, y: 0 }} className="max-w-2xl w-full bg-black/40 backdrop-blur-3xl border border-[#ff003c]/40 p-24 rounded-[6rem] relative text-center shadow-[0_0_200px_rgba(255,0,60,0.3)]">
              <div className="w-32 h-32 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-12 border border-green-500/30 shadow-[0_0_100px_rgba(34,197,94,0.3)]"><CheckCircle2 className="text-green-500" size={64} /></div>
              <h2 className="text-titan text-7xl mb-8 text-green-500">SUCCESS.</h2>
              <p className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-20 text-center leading-loose">Access Code Persisted in your Dashboard.</p>
              <div className="bg-white/5 p-16 rounded-[4rem] border border-white/10 mb-20 flex items-center justify-center gap-12 group cursor-pointer hover:bg-white/10 transition-all" onClick={() => { navigator.clipboard.writeText(iptvCode); confetti({ particleCount: 50 }); }}>
                <span className="text-titan text-7xl tracking-[0.4em]">{iptvCode}</span>
                <Copy size={48} className="text-white/20 group-hover:text-white transition-all" />
              </div>
              <button onClick={() => setIptvCode(null)} className="text-[9px] font-black uppercase tracking-[0.5em] opacity-30 hover:opacity-100 transition-all">Close Transmission</button>
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
        <div className="absolute top-[-10%] right-[-10%] w-60 h-60 bg-[#ff003c]/10 blur-[100px] rounded-full animate-pulse" />
        <div className="flex justify-between items-center mb-40">
          <div>
            <span className="text-[10px] font-black uppercase tracking-[0.5em] text-[#ff003c] mb-6 block">Node Management</span>
            <h2 className="text-titan text-7xl md:text-[9rem]">DASHBOARD.</h2>
          </div>
        </div>

        <div className="flex gap-16 mb-20 border-b border-white/5 pb-10">
          <button onClick={() => setActiveTab('codes')} className={`text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'codes' ? 'text-[#ff003c]' : 'text-white/20'}`}>Active Transmissions</button>
          <button onClick={() => setActiveTab('billing')} className={`text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'billing' ? 'text-[#ff003c]' : 'text-white/20'}`}>Secure Billing</button>
        </div>

        {loading ? (
          <div className="py-40 text-center text-[10px] font-black uppercase tracking-widest animate-pulse">Syncing...</div>
        ) : activeTab === 'codes' ? (
          <div className="grid gap-12">
            {purchases.length === 0 ? (
              <div className="py-40 text-center bg-white/[0.01] border border-white/5 rounded-[4rem] opacity-20 text-2xl uppercase font-black">No codes detected.</div>
            ) : (
              purchases.map(p => (
                <div key={p.id} className="bg-white/[0.01] border border-white/5 p-12 rounded-[4rem] flex flex-col md:flex-row justify-between items-center group relative overflow-hidden">
                  <div className="flex items-center gap-12">
                    <div className="w-24 h-24 bg-[#ff003c]/10 rounded-[2.5rem] flex items-center justify-center text-[#ff003c] border border-[#ff003c]/20 group-hover:scale-110 transition-transform"><Monitor size={48} /></div>
                    <div>
                      <h4 className="text-titan text-4xl mb-4">{p.plan_name}</h4>
                      <div className="flex gap-12 opacity-30 text-[9px] font-black uppercase tracking-widest">
                        <span className="flex items-center gap-3"><Calendar size={14} /> {new Date(p.created_at).toLocaleDateString()}</span>
                        <span className="flex items-center gap-3"><CreditCard size={14} /> ${p.amount} PAID</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-12 bg-black/40 px-16 py-8 rounded-[2.5rem] border border-white/5 group-hover:border-[#ff003c]/40 transition-all cursor-pointer" onClick={() => { navigator.clipboard.writeText(p.iptv_code); confetti({ particleCount: 50 }); }}>
                    <span className="text-titan text-5xl tracking-[0.4em]">{p.iptv_code}</span>
                    <Copy size={36} className="text-white/20 group-hover:text-white" />
                  </div>
                </div>
              ))
            )}
          </div>
        ) : (
          <div className="grid lg:grid-cols-2 gap-20">
            <div className="space-y-12">
              <h3 className="text-[10px] font-black opacity-30 mb-12 uppercase tracking-[0.5em]">Registered Credentials</h3>
              {cards.map(c => (
                <div key={c.id} className="bg-white/[0.02] p-10 rounded-[3rem] flex justify-between items-center border border-white/5 border-l-4 border-l-[#ff003c]">
                  <div className="flex items-center gap-8">
                    <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center"><CardIcon size={32} /></div>
                    <div>
                      <p className="text-2xl font-bold tracking-widest font-mono">{c.card_number}</p>
                      <p className="text-[10px] font-black opacity-40 uppercase tracking-widest">{c.card_holder} | {c.expiry}</p>
                    </div>
                  </div>
                  <button onClick={async () => { await supabase.from('payment_methods').delete().eq('id', c.id); setCards(cards.filter(x => x.id !== c.id)); }} className="text-white/20 hover:text-[#ff003c] transition-all"><Trash2 size={24} /></button>
                </div>
              ))}
            </div>

            <div className="bg-white/[0.02] p-16 rounded-[5rem] border border-[#ff003c]/20">
              <h3 className="text-[12px] font-black mb-16 uppercase tracking-[0.5em]">Initialize Secure Card Sync</h3>
              <form onSubmit={handleAddCard} className="space-y-8">
                <input type="text" required placeholder="HOLDER NAME" className="w-full bg-white/5 border border-white/10 rounded-2xl py-8 px-12 text-sm outline-none focus:border-[#ff003c] transition-all font-mono" value={cardHolder} onChange={e => setCardHolder(e.target.value)} />
                <input type="text" required placeholder="CARD NUMBER" className="w-full bg-white/5 border border-white/10 rounded-2xl py-8 px-12 text-sm outline-none focus:border-[#ff003c] transition-all font-mono" value={cardNumber} onChange={e => setCardNumber(e.target.value)} />
                <div className="grid grid-cols-2 gap-8">
                  <input type="text" required placeholder="MM/YY" className="w-full bg-white/5 border border-white/10 rounded-2xl py-8 px-12 text-sm outline-none focus:border-[#ff003c] transition-all font-mono" value={expiry} onChange={e => setExpiry(e.target.value)} />
                  <input type="text" required placeholder="CVC" className="w-full bg-white/5 border border-white/10 rounded-2xl py-8 px-12 text-sm outline-none focus:border-[#ff003c] transition-all font-mono" value={cvc} onChange={e => setCvc(e.target.value)} />
                </div>
                <button disabled={savingCard} className="btn-uplink w-full py-8 flex items-center justify-center gap-6">
                  <Plus size={24} /> {savingCard ? 'Transmitting...' : 'Sync Card'}
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
      <motion.div initial={{ scale: 0.9, y: 50 }} animate={{ scale: 1, y: 0 }} className="max-w-md w-full bg-white/[0.01] border border-white/10 backdrop-blur-3xl p-16 rounded-[4rem] relative">
        <div className="text-center mb-16">
          <h2 className="text-titan text-5xl mb-6">{mode === 'login' ? 'Recall.' : 'Initialize.'}</h2>
          <p className="text-[10px] font-black uppercase tracking-widest opacity-40">Titan Neural Network Access</p>
        </div>

        {message ? (
          <div className="text-center py-10 space-y-12">
            <div className="w-24 h-24 bg-[#ff003c]/10 rounded-full flex items-center justify-center mx-auto border border-[#ff003c]/20 animate-pulse"><Mail className="text-[#ff003c]" size={40} /></div>
            <p className="text-[10px] font-black uppercase tracking-widest text-white/60 leading-loose text-center">{message}</p>
            <button onClick={() => navigate('/')} className="btn-uplink w-full py-5 text-[10px]">Back to Home</button>
          </div>
        ) : (
          <form onSubmit={handleAuth} className="space-y-8">
            <input type="email" required placeholder="NEURAL.ID" className="w-full rounded-2xl py-8 px-12 text-sm outline-none bg-white/5 border border-white/10 focus:border-[#ff003c] transition-all font-mono" value={email} onChange={(e) => setEmail(e.target.value)} />
            <input type="password" required placeholder="ACCESS.KEY" className="w-full rounded-2xl py-8 px-12 text-sm outline-none bg-white/5 border border-white/10 focus:border-[#ff003c] transition-all font-mono" value={password} onChange={(e) => setPassword(e.target.value)} />
            {error && <div className="text-[#ff003c] text-[10px] text-center font-bold uppercase tracking-widest bg-[#ff003c]/05 py-4 rounded-xl">{error}</div>}
            <button disabled={loading} className="btn-uplink w-full py-8 text-[11px] shadow-3xl">
              {loading ? 'Transmitting...' : mode === 'login' ? 'Establish Link' : 'Initialize Node'}
            </button>
            <div className="text-center pt-8">
              <button type="button" onClick={() => setMode(mode === 'login' ? 'signup' : 'login')} className="text-[9px] font-black uppercase tracking-widest opacity-20 hover:opacity-100 transition-all">
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
      <main className="min-h-screen bg-[#000000] text-white">
        <BackgroundMaster />
        <Navbar user={user} />
        
        <Routes>
          <Route path="/" element={<HomePage user={user} />} />
          <Route path="/pricing" element={<PricingPage user={user} />} />
          <Route path="/dashboard" element={<DashboardPage user={user} />} />
          <Route path="/auth" element={<AuthPage />} />
        </Routes>

        <footer className="py-60 bg-black/40 border-t border-white/5 text-center">
          <h1 className="text-titan text-[clamp(4rem,10vw,15rem)] opacity-10 mb-20">TITAN TV</h1>
          <p className="text-[8px] font-black opacity-10 uppercase tracking-[1em]">ALL DATA ENCRYPTED. [© 2026]</p>
        </footer>
      </main>
    </Router>
  );
}
