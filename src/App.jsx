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

// --- Massive Logo Set for Industrial Grid ---

const GRID_LOGOS = [
  'netflix', 'hbo', 'disney', 'amazon', 'hulu', 'apple', 'espn', 'fox', 'cnn', 'discovery',
  'natgeo', 'mtv', 'hgtv', 'food', 'travel', 'bbc', 'sky', 'dazn', 'bein', 'canal',
  'warner', 'paramount', 'universal', 'sony', 'marvel', 'dc', 'nfl', 'nba', 'ufc', 'f1',
  'spotify', 'youtube', 'twitch', 'tiktok', 'instagram', 'facebook', 'twitter', 'discord', 'telegram', 'whatsapp',
  'google', 'microsoft', 'adobe', 'nvidia', 'intel', 'amd', 'tesla', 'spacex', 'bmw', 'audi'
];

const Navbar = ({ user }) => {
  const navigate = useNavigate();
  return (
    <nav className="fixed top-0 w-full z-[1000] px-6 md:px-16 py-8 flex justify-between items-center bg-black/80 backdrop-blur-md border-b border-white/5">
      <div className="flex items-center gap-16">
        <Link to="/" className="h-titan text-3xl text-[#ff0000] tracking-tighter">TITANTV</Link>
        <div className="hidden lg:flex items-center gap-10">
          {['Catalog', 'Networks', 'Tech', 'Pricing'].map(item => (
            <Link key={item} to={item === 'Pricing' ? '/pricing' : '/'} className="nav-link">{item}</Link>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-8">
        {user ? (
          <Link to="/dashboard" className="btn-brutal px-8 py-3 rounded-sm">Dashboard</Link>
        ) : (
          <button onClick={() => navigate('/auth')} className="btn-brutal px-8 py-3 rounded-sm">Sync Now</button>
        )}
      </div>
    </nav>
  );
};

// --- Page: Home (Red Glitch Hero) ---

const HomePage = ({ user }) => {
  const navigate = useNavigate();
  const containerRef = useRef(null);

  return (
    <div ref={containerRef} className="pt-40 pb-40">
      <div className="container mx-auto px-6 text-center">
        
        {/* Stats Grid (Red Ghosting) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-40 max-w-6xl mx-auto">
          {[
            { val: '21K+', label: 'Channels' },
            { val: '150K+', label: 'VOD' },
            { val: '<0.8MS', label: 'Latency' },
            { val: '99.9%', label: 'Uptime' }
          ].map((stat, i) => (
            <div key={i} className="text-center group">
              <h2 className="h-titan text-6xl md:text-8xl text-ghost mb-2 transition-all group-hover:scale-110">{stat.val}</h2>
              <p className="nav-link opacity-20 group-hover:opacity-100">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Massive Glitch Title */}
        <div className="mb-60">
          <h1 className="h-titan text-[12vw] md:text-[15vw] leading-none mb-12 text-white/5 relative">
            CHANNELS.
            <span className="absolute inset-0 text-ghost opacity-80">CHANNELS.</span>
          </h1>
          <button onClick={() => navigate('/pricing')} className="btn-brutal scale-150 mt-10">Get Your Access</button>
        </div>

        {/* THE MASSIVE LOGO GRID (The "Wall of Content") */}
        <div className="mt-60 max-w-7xl mx-auto">
          <h3 className="nav-link mb-12 text-center text-white/20">Network Library</h3>
          <div className="grid grid-cols-5 md:grid-cols-8 lg:grid-cols-10 gap-4">
            {GRID_LOGOS.map((name, i) => (
              <div key={i} className="logo-grid-item p-4">
                <img 
                  src={`https://logo.clearbit.com/${name}.com`} 
                  className="w-full opacity-40 group-hover:opacity-100 transition-all grayscale brightness-[2]" 
                  alt={name}
                  onError={(e) => e.target.style.display = 'none'}
                />
              </div>
            ))}
            {/* Double the logos for density */}
            {GRID_LOGOS.map((name, i) => (
              <div key={`2-${i}`} className="logo-grid-item p-4">
                <img 
                  src={`https://logo.clearbit.com/${name}.com`} 
                  className="w-full opacity-40 group-hover:opacity-100 transition-all grayscale brightness-[2]" 
                  alt={name}
                  onError={(e) => e.target.style.display = 'none'}
                />
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
    <div className="pt-40 pb-80 px-6">
      <div className="container mx-auto">
        <div className="text-center mb-40">
          <h2 className="h-titan text-[10vw] text-ghost leading-none mb-12">PRICING.</h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {[
            { t: 'MONTHLY', p: '19', f: ['21K+ Channels', '4K Quality', '1 Device'] },
            { t: 'ANNUAL PRO', p: '59', f: ['8K RAW Quality', '3 Devices', 'Anti-Buffer', 'VOD 150K+'], featured: true },
            { t: 'ULTIMATE', p: '99', f: ['Uncompressed Feed', '5 Devices', 'VPN Ghost', 'Full Support'] }
          ].map((plan, i) => (
            <div key={i} className={`p-12 border border-white/5 bg-white/[0.01] flex flex-col ${plan.featured ? 'md:scale-105 border-[#ff0000]/40' : ''}`}>
              <h3 className="nav-link mb-8 text-[#ff0000]">{plan.t}</h3>
              <div className="flex items-baseline gap-2 mb-12">
                <span className="h-titan text-8xl text-white">${plan.p}</span>
                <span className="nav-link opacity-20">/ Year</span>
              </div>
              <div className="space-y-6 mb-16 flex-grow">
                {plan.f.map((feat, fi) => (
                  <div key={fi} className="flex items-center gap-4 group">
                    <div className="w-1 h-1 bg-[#ff0000] rounded-full" />
                    <span className="nav-link text-[9px] opacity-20 group-hover:opacity-100 transition-opacity">{feat}</span>
                  </div>
                ))}
              </div>
              <button 
                onClick={() => {
                  if (!user) navigate('/auth');
                  else setCheckoutPlan(plan);
                }} 
                className={`w-full py-6 text-[10px] font-black uppercase tracking-[0.3em] transition-all ${plan.featured ? 'bg-[#ff0000] text-white' : 'border border-white/20 hover:bg-white hover:text-black'}`}
              >
                Activate Node
              </button>
            </div>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {checkoutPlan && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/98 p-6 backdrop-blur-xl">
            <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="max-w-xl w-full border border-[#ff0000]/20 bg-black p-16 relative text-center">
              <button onClick={() => setCheckoutPlan(null)} className="absolute top-12 right-12 text-white/20 hover:text-white"><X size={32} /></button>
              <h2 className="h-titan text-5xl mb-6 text-[#ff0000]">Authorize.</h2>
              <p className="nav-link mb-16 italic tracking-[0.4em]">Secure Session for ${checkoutPlan.p}</p>
              <button onClick={handlePurchase} className="btn-brutal w-full text-[12px]">Pay with Stripe</button>
            </motion.div>
          </motion.div>
        )}
        {iptvCode && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[1100] flex items-center justify-center bg-black/98 p-6 backdrop-blur-2xl">
            <motion.div initial={{ scale: 0.7, y: 100 }} animate={{ scale: 1, y: 0 }} className="max-w-2xl w-full border border-[#ff0000]/60 bg-black p-24 relative text-center shadow-[0_0_100px_rgba(255,0,0,0.2)]">
              <h2 className="h-titan text-7xl mb-8 text-[#ff0000]">SUCCESS.</h2>
              <p className="nav-link opacity-40 mb-20">Access Code Synchronized with your Node.</p>
              <div className="bg-white/5 p-16 border border-white/10 mb-20 flex items-center justify-center gap-12 group cursor-pointer hover:bg-white/10" onClick={() => { navigator.clipboard.writeText(iptvCode); confetti({ particleCount: 50 }); }}>
                <span className="h-titan text-7xl tracking-[0.4em] text-white">{iptvCode}</span>
                <Copy size={48} className="text-white/20 group-hover:text-white transition-all" />
              </div>
              <button onClick={() => setIptvCode(null)} className="nav-link opacity-20 hover:opacity-100 transition-all">Close Terminal</button>
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
    <div className="pt-40 pb-80 px-6 md:px-16 overflow-y-auto">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-40">
          <h2 className="h-titan text-7xl md:text-[9rem] text-ghost">DASHBOARD.</h2>
        </div>

        <div className="flex gap-16 mb-20 border-b border-white/5 pb-10">
          <button onClick={() => setActiveTab('codes')} className={`nav-link ${activeTab === 'codes' ? 'text-[#ff0000]' : ''}`}>Codes</button>
          <button onClick={() => setActiveTab('billing')} className={`nav-link ${activeTab === 'billing' ? 'text-[#ff0000]' : ''}`}>Billing</button>
        </div>

        {loading ? (
          <div className="py-40 text-center nav-link animate-pulse">Syncing...</div>
        ) : activeTab === 'codes' ? (
          <div className="grid gap-8">
            {purchases.length === 0 ? (
              <div className="py-40 text-center border border-white/5 opacity-20 h-titan text-4xl">No Node Access Detected.</div>
            ) : (
              purchases.map(p => (
                <div key={p.id} className="border border-white/5 p-12 flex flex-col md:flex-row justify-between items-center group bg-white/[0.01]">
                  <div>
                    <h4 className="h-titan text-4xl mb-4 text-[#ff0000]">{p.plan_name}</h4>
                    <p className="nav-link opacity-20">{new Date(p.created_at).toLocaleDateString()} | ${p.amount} Paid</p>
                  </div>
                  <div className="flex items-center gap-12 bg-black px-12 py-6 border border-[#ff0000]/20 cursor-pointer" onClick={() => { navigator.clipboard.writeText(p.iptv_code); confetti({ particleCount: 50 }); }}>
                    <span className="h-titan text-5xl tracking-[0.4em] text-white">{p.iptv_code}</span>
                    <Copy size={24} className="text-white/20" />
                  </div>
                </div>
              ))
            )}
          </div>
        ) : (
          <div className="grid lg:grid-cols-2 gap-20">
            <div className="space-y-8">
              <h3 className="nav-link opacity-30 mb-8">Registered Credentials</h3>
              {cards.map(c => (
                <div key={c.id} className="p-8 border border-white/5 bg-white/[0.01] flex justify-between items-center border-l-4 border-l-[#ff0000]">
                  <div>
                    <p className="text-2xl font-bold tracking-widest font-mono text-white">{c.card_number}</p>
                    <p className="nav-link opacity-40">{c.card_holder} | {c.expiry}</p>
                  </div>
                  <button onClick={async () => { await supabase.from('payment_methods').delete().eq('id', c.id); setCards(cards.filter(x => x.id !== c.id)); }} className="text-white/20 hover:text-[#ff0000] transition-all"><Trash2 size={24} /></button>
                </div>
              ))}
            </div>

            <div className="border border-white/5 bg-white/[0.01] p-12">
              <h3 className="nav-link mb-12">Sync New Card</h3>
              <form onSubmit={handleAddCard} className="space-y-8">
                <input type="text" required placeholder="HOLDER NAME" className="w-full bg-black border border-white/10 p-6 text-sm outline-none focus:border-[#ff0000] transition-all font-mono text-white" value={cardHolder} onChange={e => setCardHolder(e.target.value)} />
                <input type="text" required placeholder="CARD NUMBER" className="w-full bg-black border border-white/10 p-6 text-sm outline-none focus:border-[#ff0000] transition-all font-mono text-white" value={cardNumber} onChange={e => setCardNumber(e.target.value)} />
                <div className="grid grid-cols-2 gap-8">
                  <input type="text" required placeholder="MM/YY" className="w-full bg-black border border-white/10 p-6 text-sm outline-none focus:border-[#ff0000] transition-all font-mono text-white" value={expiry} onChange={e => setExpiry(e.target.value)} />
                  <input type="text" required placeholder="CVC" className="w-full bg-black border border-white/10 p-6 text-sm outline-none focus:border-[#ff0000] transition-all font-mono text-white" value={cvc} onChange={e => setCvc(e.target.value)} />
                </div>
                <button disabled={savingCard} className="btn-brutal w-full py-6">
                  {savingCard ? 'Syncing...' : 'Sync Card'}
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
        setMessage("Activation link transmitted to your node.");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        navigate('/');
      }
    } catch (err) { setError(err.message); } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="max-w-md w-full border border-white/5 bg-black p-12 relative">
        <div className="text-center mb-16">
          <h2 className="h-titan text-5xl mb-6 text-[#ff0000]">{mode === 'login' ? 'Recall.' : 'Initialize.'}</h2>
          <p className="nav-link opacity-40 text-white">Node Authentication</p>
        </div>

        {message ? (
          <div className="text-center py-10 space-y-12">
            <p className="nav-link text-white leading-loose">{message}</p>
            <button onClick={() => navigate('/')} className="btn-brutal w-full py-5 text-[10px]">Back to Home</button>
          </div>
        ) : (
          <form onSubmit={handleAuth} className="space-y-8">
            <input type="email" required placeholder="NEURAL.ID" className="w-full rounded-sm py-6 px-10 text-sm outline-none bg-black border border-white/10 focus:border-[#ff0000] transition-all font-mono text-white" value={email} onChange={(e) => setEmail(e.target.value)} />
            <input type="password" required placeholder="ACCESS.KEY" className="w-full rounded-sm py-6 px-10 text-sm outline-none bg-black border border-white/10 focus:border-[#ff0000] transition-all font-mono text-white" value={password} onChange={(e) => setPassword(e.target.value)} />
            {error && <div className="text-[#ff0000] text-[10px] text-center font-bold uppercase tracking-widest py-4">{error}</div>}
            <button disabled={loading} className="btn-brutal w-full py-6">
              {loading ? 'Transmitting...' : mode === 'login' ? 'Establish Link' : 'Initialize Node'}
            </button>
            <div className="text-center pt-8">
              <button type="button" onClick={() => setMode(mode === 'login' ? 'signup' : 'login')} className="nav-link text-[9px] opacity-20 hover:opacity-100 transition-all">
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
        <Navbar user={user} />
        
        <Routes>
          <Route path="/" element={<HomePage user={user} />} />
          <Route path="/pricing" element={<PricingPage user={user} />} />
          <Route path="/dashboard" element={<DashboardPage user={user} />} />
          <Route path="/auth" element={<AuthPage />} />
        </Routes>

        <footer className="py-40 bg-black border-t border-white/5 text-center">
          <h1 className="h-titan text-[10vw] opacity-10 text-white">TITANTV</h1>
          <p className="nav-link opacity-10 text-[8px] tracking-[1em]">© 2026 INDUSTRIAL GRID INFRASTRUCTURE</p>
        </footer>
      </main>
    </Router>
  );
}
