import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, Menu, Mail, Power, Signal, Video, Shield, Zap, 
  Activity, Crown, ChevronRight, ArrowRight, Play, Star, 
  Smartphone, Tv, CheckCircle2, Monitor, Lock, AlertCircle,
  Copy, Check, History, CreditCard, Calendar, Hash, Layout,
  Cpu, Wifi, Database, Layers, ExternalLink, Plus, Trash2, 
  CreditCard as CardIcon, Info
} from 'lucide-react';
import confetti from 'canvas-confetti';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { supabase } from './lib/supabase';

gsap.registerPlugin(ScrollTrigger);

// --- High-Resolution Stable Channels ---

const CHANNEL_CATEGORIES = [
  {
    title: 'Featured Networks',
    logos: [
      { name: 'Netflix', url: 'https://logo.clearbit.com/netflix.com' },
      { name: 'HBO Max', url: 'https://logo.clearbit.com/hbomax.com' },
      { name: 'Disney+', url: 'https://logo.clearbit.com/disneyplus.com' },
      { name: 'Prime Video', url: 'https://logo.clearbit.com/amazon.com' },
      { name: 'DAZN', url: 'https://logo.clearbit.com/dazn.com' },
      { name: 'beIN Sports', url: 'https://logo.clearbit.com/beinsports.com' },
      { name: 'Canal+', url: 'https://logo.clearbit.com/canalplus.com' }
    ]
  },
  {
    title: 'Sports & Live TV',
    logos: [
      { name: 'Sky Sports', url: 'https://logo.clearbit.com/sky.com' },
      { name: 'ESPN', url: 'https://logo.clearbit.com/espn.com' },
      { name: 'Fox Sports', url: 'https://logo.clearbit.com/fox.com' },
      { name: 'BT Sport', url: 'https://logo.clearbit.com/bt.com' },
      { name: 'Eurosport', url: 'https://logo.clearbit.com/eurosport.com' }
    ]
  }
];

// --- Global UI Components ---

const Navbar = ({ user }) => {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handle = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handle);
    return () => window.removeEventListener('scroll', handle);
  }, []);

  return (
    <nav className={`fixed top-0 w-full z-[1000] px-6 md:px-16 py-6 flex justify-between items-center transition-all duration-500 ${scrolled ? 'bg-black shadow-2xl' : 'bg-gradient-to-b from-black/80 to-transparent'}`}>
      <div className="flex items-center gap-12">
        <Link to="/" className="h-netflix text-4xl text-[#E50914]">TITANTV</Link>
        <div className="hidden lg:flex items-center gap-8">
          {['Home', 'Series', 'Movies', 'Sports', 'My List'].map(item => (
            <Link key={item} to="/" className="text-sm font-medium text-white/70 hover:text-white transition-colors">{item}</Link>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-6">
        {user ? (
          <Link to="/dashboard" className="text-sm font-bold text-white hover:text-[#E50914] transition-colors">Dashboard</Link>
        ) : (
          <button onClick={() => navigate('/auth')} className="btn-netflix-red text-sm">Sign In</button>
        )}
      </div>
    </nav>
  );
};

// --- Page: Home (Netflix Style) ---

const HomePage = ({ user }) => {
  const navigate = useNavigate();
  
  return (
    <div className="pb-40">
      {/* Netflix Cinematic Hero */}
      <div className="relative h-[85vh] w-full overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&q=80&w=2000" 
          className="w-full h-full object-cover" 
          alt="Hero" 
        />
        <div className="hero-overlay" />
        
        <div className="absolute bottom-[15%] left-[5%] max-w-2xl z-10">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }}>
            <h1 className="h-netflix text-6xl md:text-8xl mb-6">LIVE SPORTS & <br /> ENT. HUB</h1>
            <p className="text-lg text-white/80 mb-10 leading-relaxed">Stream the world's biggest matches and movies in 4K RAW. Zero buffering, unlimited access on all your devices.</p>
            <div className="flex items-center gap-4">
              <button onClick={() => navigate('/pricing')} className="btn-netflix-main">
                <Play fill="black" size={24} /> Subscribe
              </button>
              <button className="bg-white/20 backdrop-blur-md text-white px-8 py-3 rounded-md flex items-center gap-3 font-bold hover:bg-white/30 transition-all">
                <Info size={24} /> More Info
              </button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Content Rows */}
      <div className="px-6 md:px-16 -mt-20 relative z-20 space-y-16">
        {CHANNEL_CATEGORIES.map((cat, ci) => (
          <div key={ci}>
            <h3 className="text-2xl font-bold mb-6">{cat.title}</h3>
            <div className="content-row">
              {cat.logos.map((logo, i) => (
                <div key={i} className="content-card group">
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="w-full h-full flex items-center justify-center p-8 bg-zinc-900">
                    <img 
                      src={logo.url} 
                      className="w-full h-full object-contain filter brightness-[2]" 
                      alt={logo.name} 
                      onError={(e) => { e.target.src = `https://ui-avatars.com/api/?name=${logo.name}&background=E50914&color=fff`; }}
                    />
                  </div>
                  <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <p className="text-xs font-bold uppercase tracking-widest">{logo.name}</p>
                    <div className="flex gap-2 mt-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full" />
                      <span className="text-[10px] text-green-500">Live 4K</span>
                    </div>
                  </div>
                </div>
              ))}
              {/* Duplicate for length */}
              {cat.logos.map((logo, i) => (
                <div key={`2-${i}`} className="content-card group">
                  <div className="w-full h-full flex items-center justify-center p-8 bg-zinc-900">
                    <img 
                      src={logo.url} 
                      className="w-full h-full object-contain filter brightness-[2]" 
                      alt={logo.name} 
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
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
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-16">
          <span className="text-sm font-bold text-[#E50914] uppercase tracking-[0.3em] mb-4 block">Pick Your Plan</span>
          <h2 className="h-netflix text-6xl mb-4">NO COMMITMENT. <br /> CANCEL ANYTIME.</h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {[
            { t: 'BASIC', p: '19', f: ['21K+ Channels', '4K Streaming', '1 Device'] },
            { t: 'STANDARD', p: '59', f: ['8K RAW Quality', '3 Devices', 'Anti-Buffer Pro'], featured: true },
            { t: 'PREMIUM', p: '99', f: ['Uncompressed Feed', '5 Devices', 'Priority Support'] }
          ].map((plan, i) => (
            <div key={i} className={`p-10 bg-zinc-900 border border-white/5 rounded-lg flex flex-col ${plan.featured ? 'scale-105 border-[#E50914]/50' : ''}`}>
              <h3 className="text-lg font-bold mb-6">{plan.t}</h3>
              <div className="flex items-baseline gap-2 mb-10">
                <span className="text-5xl font-black">${plan.p}</span>
                <span className="text-xs text-white/40 font-bold uppercase">/ Year</span>
              </div>
              <div className="space-y-4 mb-12 flex-grow">
                {plan.f.map((feat, fi) => (
                  <div key={fi} className="flex items-center gap-3">
                    <CheckCircle2 size={18} className="text-[#E50914]" />
                    <span className="text-sm text-white/70">{feat}</span>
                  </div>
                ))}
              </div>
              <button 
                onClick={() => { if (!user) navigate('/auth'); else setCheckoutPlan(plan); }} 
                className={`w-full py-4 rounded-md font-bold text-sm transition-all ${plan.featured ? 'bg-[#E50914] text-white hover:bg-[#f40612]' : 'bg-white/10 hover:bg-white/20'}`}
              >
                Join Now
              </button>
            </div>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {checkoutPlan && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/98 p-6 backdrop-blur-xl">
            <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="max-w-xl w-full bg-zinc-900 p-16 rounded-xl relative text-center shadow-2xl">
              <button onClick={() => setCheckoutPlan(null)} className="absolute top-12 right-12 text-white/20 hover:text-white"><X size={32} /></button>
              <h2 className="h-netflix text-5xl mb-6">Subscribe.</h2>
              <p className="text-white/40 mb-16 font-bold uppercase tracking-widest text-sm">Secure Payment for ${checkoutPlan.p}</p>
              <button onClick={handlePurchase} className="btn-netflix-red w-full py-5 text-lg">Confirm Subscription</button>
            </motion.div>
          </motion.div>
        )}
        {iptvCode && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[1100] flex items-center justify-center bg-black/98 p-6 backdrop-blur-2xl">
            <motion.div initial={{ scale: 0.7, y: 100 }} animate={{ scale: 1, y: 0 }} className="max-w-2xl w-full bg-zinc-900 border border-[#E50914]/40 p-24 rounded-2xl relative text-center shadow-[0_0_100px_rgba(229,9,20,0.2)]">
              <h2 className="h-netflix text-7xl mb-8 text-[#E50914]">SUCCESS.</h2>
              <p className="text-white/40 mb-20 font-bold uppercase tracking-widest">Your Neural Sync Code is ready.</p>
              <div className="bg-black p-16 border border-white/10 mb-20 flex items-center justify-center gap-12 group cursor-pointer hover:bg-white/5 rounded-xl" onClick={() => { navigator.clipboard.writeText(iptvCode); confetti({ particleCount: 50 }); }}>
                <span className="h-netflix text-7xl tracking-[0.4em] text-white">{iptvCode}</span>
                <Copy size={48} className="text-white/20 group-hover:text-white transition-all" />
              </div>
              <button onClick={() => setIptvCode(null)} className="text-sm font-bold opacity-30 hover:opacity-100 transition-all text-white uppercase tracking-widest">Dismiss</button>
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
    <div className="pt-32 pb-80 px-6 md:px-16 overflow-y-auto">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-16">
          <h2 className="h-netflix text-7xl text-white">DASHBOARD.</h2>
        </div>

        <div className="flex gap-12 mb-16 border-b border-white/5 pb-4">
          <button onClick={() => setActiveTab('codes')} className={`text-sm font-bold uppercase tracking-widest transition-all ${activeTab === 'codes' ? 'text-[#E50914]' : 'text-white/30'}`}>Active Codes</button>
          <button onClick={() => setActiveTab('billing')} className={`text-sm font-bold uppercase tracking-widest transition-all ${activeTab === 'billing' ? 'text-[#E50914]' : 'text-white/30'}`}>Secure Billing</button>
        </div>

        {loading ? (
          <div className="py-40 text-center text-sm font-bold animate-pulse text-white/20">Syncing Node...</div>
        ) : activeTab === 'codes' ? (
          <div className="grid gap-6">
            {purchases.length === 0 ? (
              <div className="py-40 text-center bg-zinc-900 rounded-xl opacity-20 text-4xl font-black text-white">NO ACTIVE CODES</div>
            ) : (
              purchases.map(p => (
                <div key={p.id} className="bg-zinc-900 p-8 rounded-xl flex flex-col md:flex-row justify-between items-center group border border-white/5 hover:border-white/20 transition-all">
                  <div>
                    <h4 className="text-2xl font-bold mb-2 text-white">{p.plan_name}</h4>
                    <p className="text-xs font-bold text-white/30 uppercase tracking-widest">{new Date(p.created_at).toLocaleDateString()} | ${p.amount} Paid</p>
                  </div>
                  <div className="flex items-center gap-8 bg-black px-12 py-4 rounded-lg border border-white/10 group-hover:border-[#E50914]/40 transition-all cursor-pointer" onClick={() => { navigator.clipboard.writeText(p.iptv_code); confetti({ particleCount: 50 }); }}>
                    <span className="h-netflix text-5xl tracking-[0.3em] text-white">{p.iptv_code}</span>
                    <Copy size={24} className="text-white/20 group-hover:text-white" />
                  </div>
                </div>
              ))
            )}
          </div>
        ) : (
          <div className="grid lg:grid-cols-2 gap-12 text-white">
            <div className="space-y-6">
              <h3 className="text-sm font-bold text-white/30 uppercase tracking-widest mb-4">Credentials</h3>
              {cards.map(c => (
                <div key={c.id} className="p-8 bg-zinc-900 rounded-xl flex justify-between items-center border-l-4 border-[#E50914]">
                  <div>
                    <p className="text-2xl font-bold tracking-widest font-mono text-white">{c.card_number}</p>
                    <p className="text-xs font-bold text-white/30 uppercase tracking-widest">{c.card_holder} | {c.expiry}</p>
                  </div>
                  <button onClick={async () => { await supabase.from('payment_methods').delete().eq('id', c.id); setCards(cards.filter(x => x.id !== c.id)); }} className="text-white/20 hover:text-[#E50914] transition-all"><Trash2 size={24} /></button>
                </div>
              ))}
            </div>

            <div className="bg-zinc-900 p-12 rounded-xl">
              <h3 className="text-sm font-bold text-white uppercase tracking-widest mb-10">Add Secure Method</h3>
              <form onSubmit={handleAddCard} className="space-y-8">
                <input type="text" required placeholder="HOLDER NAME" className="w-full bg-black border border-white/10 p-5 rounded-lg text-sm outline-none focus:border-[#E50914] transition-all font-mono text-white" value={cardHolder} onChange={e => setCardHolder(e.target.value)} />
                <input type="text" required placeholder="CARD NUMBER" className="w-full bg-black border border-white/10 p-5 rounded-lg text-sm outline-none focus:border-[#E50914] transition-all font-mono text-white" value={cardNumber} onChange={e => setCardNumber(e.target.value)} />
                <div className="grid grid-cols-2 gap-6">
                  <input type="text" required placeholder="MM/YY" className="w-full bg-black border border-white/10 p-5 rounded-lg text-sm outline-none focus:border-[#E50914] transition-all font-mono text-white" value={expiry} onChange={e => setExpiry(e.target.value)} />
                  <input type="text" required placeholder="CVC" className="w-full bg-black border border-white/10 p-5 rounded-lg text-sm outline-none focus:border-[#E50914] transition-all font-mono text-white" value={cvc} onChange={e => setCvc(e.target.value)} />
                </div>
                <button disabled={savingCard} className="btn-netflix-red w-full py-5 text-sm uppercase tracking-widest font-black">
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
        setMessage("Activation link transmitted.");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        navigate('/');
      }
    } catch (err) { setError(err.message); } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="max-w-md w-full bg-zinc-900 p-16 rounded-lg relative border border-white/5 shadow-3xl">
        <div className="text-center mb-16">
          <h2 className="h-netflix text-5xl mb-6 text-white">{mode === 'login' ? 'Recall.' : 'Initialize.'}</h2>
          <p className="text-xs font-bold text-white/30 uppercase tracking-widest">Neural Link Access</p>
        </div>

        {message ? (
          <div className="text-center py-10 space-y-12">
            <p className="text-sm font-bold text-white leading-loose">{message}</p>
            <button onClick={() => navigate('/')} className="btn-netflix-red w-full py-5 text-[10px]">Back to Home</button>
          </div>
        ) : (
          <form onSubmit={handleAuth} className="space-y-8">
            <input type="email" required placeholder="NEURAL.ID" className="w-full rounded-md py-5 px-10 text-sm outline-none bg-black border border-white/10 focus:border-[#E50914] transition-all font-mono text-white" value={email} onChange={(e) => setEmail(e.target.value)} />
            <input type="password" required placeholder="ACCESS.KEY" className="w-full rounded-md py-5 px-10 text-sm outline-none bg-black border border-white/10 focus:border-[#E50914] transition-all font-mono text-white" value={password} onChange={(e) => setPassword(e.target.value)} />
            {error && <div className="text-[#E50914] text-[10px] text-center font-bold uppercase tracking-widest py-4">{error}</div>}
            <button disabled={loading} className="btn-netflix-red w-full py-5 text-sm uppercase tracking-widest">
              {loading ? 'Transmitting...' : mode === 'login' ? 'Establish Link' : 'Initialize Node'}
            </button>
            <div className="text-center pt-8">
              <button type="button" onClick={() => setMode(mode === 'login' ? 'signup' : 'login')} className="text-[10px] font-bold text-white/30 hover:text-white uppercase tracking-widest transition-all">
                {mode === 'login' ? "New Neural Link? Join" : "Existing Link? Sync"}
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
          <h1 className="h-netflix text-[10vw] opacity-10 text-[#E50914]">TITANTV</h1>
          <p className="text-[8px] font-bold opacity-10 uppercase tracking-[1em] text-white">© 2026 NETFLIX LUXE INFRASTRUCTURE</p>
        </footer>
      </main>
    </Router>
  );
}
