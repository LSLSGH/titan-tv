import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, Menu, Mail, Power, Signal, Video, Shield, Zap, 
  Activity, Crown, ChevronRight, ArrowRight, Play, Star, 
  Smartphone, Tv, CheckCircle2, Monitor, Lock, AlertCircle,
  Copy, Check, History, CreditCard, Calendar, Hash, Layout,
  Cpu, Wifi, Database, Layers, ExternalLink, Plus, Trash2, CreditCard as CardIcon
} from 'lucide-react';
import confetti from 'canvas-confetti';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { supabase } from './lib/supabase';

gsap.registerPlugin(ScrollTrigger);

// --- Visual Infrastructure ---

const BackgroundMaster = () => (
  <div className="fixed inset-0 z-[-1] pointer-events-none overflow-hidden bg-[#020202]">
    <div className="absolute top-[-20%] left-[-10%] w-[100vw] h-[100vw] bg-[#ff003c]/05 blur-[250px] rounded-full" />
    <div className="absolute bottom-[-20%] right-[-10%] w-[80vw] h-[80vw] bg-[#7000ff]/05 blur-[200px] rounded-full" />
    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.02] mix-blend-overlay" />
  </div>
);

// --- Components ---

const Navbar = ({ onAuthOpen, user, onDashboardOpen }) => (
  <nav className="fixed top-0 w-full z-[500] px-6 md:px-16 py-8 flex justify-between items-center transition-all duration-1000">
    <div className="flex items-center gap-20">
      <h1 className="h-mega text-4xl text-white cursor-pointer" onClick={() => window.scrollTo(0,0)}>
        TITAN <span className="text-[#ff003c]">TV</span>
      </h1>
      <div className="hidden xl:flex items-center gap-12">
        {['Network', 'Pricing', 'Infrastructure'].map(item => (
          <a key={item} href={`#${item.toLowerCase()}`} className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20 hover:text-white transition-all">{item}</a>
        ))}
      </div>
    </div>

    <div className="flex items-center gap-8">
      {user ? (
        <div className="flex items-center gap-6">
          <button 
            onClick={onDashboardOpen} 
            className="flex items-center gap-3 bg-white/5 hover:bg-white/10 px-8 py-3 rounded-xl border border-white/10 transition-all text-[9px] font-black uppercase tracking-widest"
          >
            <Layout size={14} /> My Dashboard
          </button>
          <button onClick={() => supabase.auth.signOut()} className="text-white/20 hover:text-[#ff003c] transition-colors"><Power size={18} /></button>
        </div>
      ) : (
        <button onClick={onAuthOpen} className="btn-titan">Authorize Access</button>
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
      card_number: cardNumber.replace(/\d(?=\d{4})/g, "*"), // Basic mask
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

  const deleteCard = async (id) => {
    await supabase.from('payment_methods').delete().eq('id', id);
    setCards(cards.filter(c => c.id !== id));
  };

  if (!isOpen) return null;

  return (
    <motion.div initial={{ opacity: 0, scale: 1.05 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.05 }} className="fixed inset-0 z-[600] bg-black/98 backdrop-blur-3xl p-6 md:p-20 overflow-y-auto">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-24">
          <div>
            <span className="text-[10px] font-black uppercase tracking-[0.5em] text-[#ff003c] mb-4 block">Central Terminal</span>
            <h2 className="h-mega text-6xl md:text-8xl">TITAN TV <span className="opacity-20">DASHBOARD.</span></h2>
          </div>
          <button onClick={onClose} className="w-16 h-16 glass-panel rounded-full flex items-center justify-center text-white/30 hover:text-white"><X size={32} /></button>
        </div>

        <div className="flex gap-12 mb-16 border-b border-white/5 pb-8">
          <button onClick={() => setActiveTab('codes')} className={`text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'codes' ? 'text-[#ff003c]' : 'text-white/20'}`}>Active Codes ({purchases.length})</button>
          <button onClick={() => setActiveTab('billing')} className={`text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'billing' ? 'text-[#ff003c]' : 'text-white/20'}`}>Billing & Cards</button>
        </div>

        {activeTab === 'codes' ? (
          <div className="grid gap-6">
            {purchases.length === 0 ? (
              <div className="py-40 text-center glass-panel rounded-[3rem] opacity-20 text-[10px] font-black uppercase tracking-widest">No active transmissions detected.</div>
            ) : (
              purchases.map(p => (
                <div key={p.id} className="glass-panel p-10 rounded-[3rem] flex flex-col md:flex-row justify-between items-center group">
                  <div className="flex items-center gap-8">
                    <div className="w-16 h-16 bg-[#ff003c]/10 rounded-2xl flex items-center justify-center text-[#ff003c]"><Tv size={24} /></div>
                    <div>
                      <h4 className="text-2xl font-bold mb-2 uppercase tracking-tight">{p.plan_name} PLAN</h4>
                      <span className="text-[9px] font-black uppercase tracking-widest opacity-30 flex items-center gap-3"><Calendar size={12} /> {new Date(p.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-8 bg-black/40 px-10 py-5 rounded-2xl border border-white/5 group-hover:border-[#ff003c]/30 transition-all cursor-pointer" onClick={() => { navigator.clipboard.writeText(p.iptv_code); confetti({ particleCount: 30 }); }}>
                    <span className="h-mega text-4xl tracking-[0.2em]">{p.iptv_code}</span>
                    <Copy size={20} className="text-white/20 group-hover:text-white" />
                  </div>
                </div>
              ))
            )}
          </div>
        ) : (
          <div className="grid lg:grid-cols-2 gap-16">
            <div className="space-y-8">
              <h3 className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-10">Registered Payment Methods</h3>
              {cards.length === 0 ? (
                <div className="p-16 text-center glass-panel rounded-[2rem] opacity-20 text-[9px] font-black uppercase tracking-widest">No cards on file.</div>
              ) : (
                cards.map(c => (
                  <div key={c.id} className="glass-panel p-8 rounded-[2rem] flex justify-between items-center relative overflow-hidden">
                    <div className="flex items-center gap-6 relative z-10">
                      <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center"><CardIcon size={20} /></div>
                      <div>
                        <p className="text-sm font-bold tracking-widest">{c.card_number}</p>
                        <p className="text-[9px] font-black opacity-30 uppercase tracking-widest">{c.card_holder} | {c.expiry}</p>
                      </div>
                    </div>
                    <button onClick={() => deleteCard(c.id)} className="text-white/20 hover:text-red-500 transition-colors relative z-10"><Trash2 size={18} /></button>
                  </div>
                ))
              )}
            </div>

            <div className="glass-panel p-12 rounded-[3rem]">
              <h3 className="text-[10px] font-black uppercase tracking-widest text-[#ff003c] mb-12">Register New Card</h3>
              <form onSubmit={handleAddCard} className="space-y-6">
                <input type="text" required placeholder="CARD HOLDER NAME" className="w-full bg-white/5 border border-white/5 rounded-xl py-5 px-8 text-xs outline-none focus:border-[#ff003c] transition-all" value={cardHolder} onChange={e => setCardHolder(e.target.value)} />
                <input type="text" required placeholder="CARD NUMBER" className="w-full bg-white/5 border border-white/5 rounded-xl py-5 px-8 text-xs outline-none focus:border-[#ff003c] transition-all" value={cardNumber} onChange={e => setCardNumber(e.target.value)} />
                <div className="grid grid-cols-2 gap-6">
                  <input type="text" required placeholder="MM/YY" className="w-full bg-white/5 border border-white/5 rounded-xl py-5 px-8 text-xs outline-none focus:border-[#ff003c] transition-all" value={expiry} onChange={e => setExpiry(e.target.value)} />
                  <input type="text" required placeholder="CVC" className="w-full bg-white/5 border border-white/5 rounded-xl py-5 px-8 text-xs outline-none focus:border-[#ff003c] transition-all" value={cvc} onChange={e => setCvc(e.target.value)} />
                </div>
                <button disabled={savingCard} className="btn-titan w-full py-5 flex items-center justify-center gap-3">
                  <Plus size={16} /> {savingCard ? 'Processing...' : 'Register Securely'}
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
    const lenis = new Lenis({ duration: 1.2 });
    function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
    requestAnimationFrame(raf);
    supabase.auth.getSession().then(({ data: { session } }) => setUser(session?.user ?? null));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => setUser(session?.user ?? null));
    return () => { subscription.unsubscribe(); lenis.destroy(); };
  }, []);

  useGSAP(() => {
    gsap.from('.reveal', { y: 60, opacity: 0, duration: 1.5, ease: "power4.out", stagger: 0.2 });
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
    confetti({ particleCount: 300, spread: 80, origin: { y: 0.6 } });
    setCheckoutOpen(false);
  };

  return (
    <main className="min-h-screen bg-[#020202] text-white">
      <BackgroundMaster />
      <Navbar onAuthOpen={() => setAuthOpen(true)} user={user} onDashboardOpen={() => setDashboardOpen(true)} />
      <Dashboard isOpen={dashboardOpen} onClose={() => setDashboardOpen(false)} user={user} />

      {/* --- HERO: CINEMATIC TITAN --- */}
      <section ref={heroRef} className="relative min-h-screen flex items-center justify-center pt-40 px-6 overflow-hidden">
        <div className="container mx-auto text-center relative z-10">
          <div className="reveal mb-12">
            <span className="text-[10px] font-black uppercase tracking-[0.6em] text-[#ff003c] mb-12 block animate-pulse">Neural Streaming Infrastructure</span>
            <h1 className="h-mega text-[clamp(4.5rem,15vw,18rem)] mb-20 leading-none">
              TITAN <span className="text-[#ff003c]">TV.</span>
            </h1>
          </div>

          <div className="reveal max-w-4xl mx-auto mb-20">
            <div className="glass-panel p-4 rounded-[4rem] relative group cursor-pointer overflow-hidden shadow-[0_100px_200px_-50px_rgba(255,0,60,0.2)]">
              <img src="C:\Users\lenovo\Desktop\iptv\futuristic_3d_tv_8k_1777719653703.png" className="w-full rounded-[3.5rem] brightness-[0.7] group-hover:brightness-100 transition-all duration-[3000ms]" alt="8K TV" />
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-12 bg-black/20 group-hover:bg-transparent transition-all">
                {!user ? (
                  <button onClick={() => setAuthOpen(true)} className="btn-titan scale-125">Initialize Protocol</button>
                ) : !user.email_confirmed_at ? (
                  <div className="glass-panel p-12 rounded-[3rem] border-yellow-500/20 max-w-xl backdrop-blur-3xl">
                    <AlertCircle className="mx-auto mb-8 text-yellow-500 animate-bounce" size={64} />
                    <h4 className="text-3xl font-bold mb-4 uppercase">Bio-ID Required</h4>
                    <p className="text-[10px] font-black uppercase tracking-widest opacity-40">Verification link transmitted to your neural inbox. Acknowledge to proceed.</p>
                  </div>
                ) : (
                  <button onClick={() => document.getElementById('pricing').scrollIntoView()} className="btn-titan scale-125">Select Your Plan</button>
                )}
              </div>
            </div>
          </div>

          {/* Marquee de Logos */}
          <div className="reveal marquee-wrapper">
            {['beIN SPORTS', 'DAZN', 'SKY SPORTS', 'CANAL+', 'ESPN', 'EUROSPORT', 'BT SPORT'].map(logo => (
              <div key={logo} className="marquee-logo text-xl font-black italic tracking-tighter text-white/40">{logo}</div>
            ))}
          </div>
        </div>
      </section>

      {/* --- PRICING --- */}
      <section id="pricing" className={`py-60 px-6 transition-all duration-1000 ${!user || !user.email_confirmed_at ? 'opacity-0 scale-95 pointer-events-none' : 'opacity-100'}`}>
        <div className="container mx-auto">
          <div className="text-center mb-40">
            <span className="text-[10px] font-black uppercase tracking-[0.5em] text-[#ff003c] mb-8 block">Global Access Protocol</span>
            <h2 className="h-mega text-7xl md:text-[10rem] mb-12">PRICING.</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-12 max-w-7xl mx-auto">
            {[
              { t: 'Monthly', p: '19', f: ['21,000+ Channels', '4K Streaming', '1 Device Access'] },
              { t: 'Annual Pro', p: '59', f: ['8K RAW Quality', '3 Devices Access', 'Anti-Buffer Pro', 'Priority Nodes'], featured: true },
              { t: 'Eternal', p: '99', f: ['Uncompressed Feed', '5 Devices Access', 'VPN Integrated', 'Ghost Proxy'] }
            ].map((plan, i) => (
              <div key={i} className={`glass-panel p-16 rounded-[4rem] flex flex-col ${plan.featured ? 'md:scale-110 border-[#ff003c]/40 shadow-[0_0_100px_rgba(255,0,60,0.1)]' : ''}`}>
                <h3 className="text-2xl font-black uppercase tracking-tighter mb-10 opacity-30">{plan.t}</h3>
                <div className="flex items-baseline gap-4 mb-16">
                  <span className="h-mega text-8xl">${plan.p}</span>
                  <span className="text-[10px] font-black uppercase tracking-widest opacity-20">/ Year</span>
                </div>
                <div className="space-y-6 mb-24 flex-grow">
                  {plan.f.map((feat, fi) => (
                    <div key={fi} className="flex items-center gap-6 group">
                      <div className="w-1.5 h-1.5 bg-[#ff003c] rounded-full opacity-20 group-hover:opacity-100 transition-opacity" />
                      <span className="text-[9px] font-black uppercase tracking-widest opacity-20 group-hover:opacity-100 transition-opacity">{feat}</span>
                    </div>
                  ))}
                </div>
                <button onClick={() => { setActivePlan(plan); setCheckoutOpen(true); }} className={`w-full py-6 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${plan.featured ? 'bg-[#ff003c] text-white' : 'bg-white/5 hover:bg-white hover:text-black border border-white/10'}`}>Sync Plan</button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="py-60 bg-black/40 border-t border-white/5 text-center">
        <h1 className="h-mega text-9xl text-white/10 mb-20">TITAN TV</h1>
        <p className="text-[8px] font-black uppercase tracking-[1em] text-white/10">All transmissions encrypted. [© 2026]</p>
      </footer>

      {/* --- AUTH FLOW MODAL --- */}
      <AnimatePresence>
        {authOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[700] flex items-center justify-center bg-black/98 backdrop-blur-[100px] p-6">
            <motion.div initial={{ scale: 0.8, y: 50 }} animate={{ scale: 1, y: 0 }} className="max-w-md w-full glass-panel p-16 rounded-[4rem] relative">
              <button onClick={() => setAuthOpen(false)} className="absolute top-10 right-10 text-white/20 hover:text-white"><X size={32} /></button>
              <AuthForm onClose={() => setAuthOpen(false)} />
            </motion.div>
          </motion.div>
        )}
        {checkoutOpen && activePlan && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[700] flex items-center justify-center bg-black/98 backdrop-blur-[100px] p-6">
            <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="max-w-xl w-full glass-panel p-20 rounded-[5rem] relative text-center">
              <button onClick={() => setCheckoutOpen(false)} className="absolute top-12 right-12 text-white/20 hover:text-white"><X size={32} /></button>
              <div className="w-24 h-24 bg-[#ff003c]/10 rounded-full flex items-center justify-center mx-auto mb-12 border border-[#ff003c]/20 animate-pulse"><Crown className="text-[#ff003c]" size={56} /></div>
              <h2 className="h-mega text-5xl mb-6">Authorize.</h2>
              <p className="text-[9px] font-black uppercase tracking-[0.4em] text-white/20 mb-16 italic">Securing Stripe transmission for ${activePlan.p}</p>
              <button onClick={handleCheckout} className="btn-titan w-full text-[11px] shadow-3xl">Confirm $${activePlan.p} Sync</button>
            </motion.div>
          </motion.div>
        )}
        {iptvCode && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[800] flex items-center justify-center bg-black/98 backdrop-blur-[120px] p-6">
            <motion.div initial={{ scale: 0.7, y: 100 }} animate={{ scale: 1, y: 0 }} className="max-w-2xl w-full glass-panel p-24 rounded-[6rem] relative text-center border-[#ff003c]/40 shadow-[0_0_200px_rgba(255,0,60,0.2)]">
              <div className="w-32 h-32 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-12 border border-green-500/30"><CheckCircle2 className="text-green-500" size={64} /></div>
              <h2 className="h-mega text-7xl mb-8 text-green-500">SUCCESS.</h2>
              <p className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-20 text-center leading-loose">Neural Access Code Generated & Persisted in your Dashboard.</p>
              <div className="bg-white/5 p-16 rounded-[4rem] border border-white/10 mb-20 flex items-center justify-center gap-12 group cursor-pointer hover:bg-white/10 transition-all shadow-[inset_0_0_50px_rgba(0,0,0,0.5)]" onClick={() => { navigator.clipboard.writeText(iptvCode); confetti({ particleCount: 50 }); }}>
                <span className="h-mega text-7xl tracking-[0.4em]">{iptvCode}</span>
                <Copy size={48} className="text-white/20 group-hover:text-white transition-all" />
              </div>
              <button onClick={() => setIptvCode(null)} className="text-[9px] font-black uppercase tracking-[0.5em] opacity-30 hover:opacity-100 transition-all">Terminate Uplink</button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
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
        setMessage("Lien de confirmation transmis. Vérifiez vos e-mails.");
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
      <p className="text-[10px] font-black uppercase tracking-widest text-white/60 leading-loose">{message}</p>
      <button onClick={onClose} className="btn-titan w-full py-5 text-[10px]">Acknowledge</button>
    </div>
  );

  return (
    <form onSubmit={handleAuth} className="space-y-8">
      <div className="text-center mb-12">
        <h2 className="h-mega text-5xl mb-6">{mode === 'login' ? 'Recall.' : 'Initialize.'}</h2>
        <p className="text-[10px] font-black uppercase tracking-[0.4em] opacity-30">Titan Neural Network Access</p>
      </div>
      <input type="email" required placeholder="NEURAL.ID" className="w-full rounded-2xl py-8 px-12 text-sm outline-none bg-white/5 border border-white/10 focus:border-[#ff003c] transition-all font-mono" value={email} onChange={(e) => setEmail(e.target.value)} />
      <input type="password" required placeholder="ACCESS.KEY" className="w-full rounded-2xl py-8 px-12 text-sm outline-none bg-white/5 border border-white/10 focus:border-[#ff003c] transition-all font-mono" value={password} onChange={(e) => setPassword(e.target.value)} />
      {error && <div className="text-[#ff003c] text-[10px] text-center font-bold uppercase tracking-widest bg-[#ff003c]/05 py-4 rounded-xl">{error}</div>}
      <button disabled={loading} className="btn-titan w-full py-8 text-[11px] shadow-3xl">
        {loading ? 'Transmitting...' : mode === 'login' ? 'Establish Link' : 'Initialize Node'}
      </button>
      <div className="text-center pt-8">
        <button type="button" onClick={() => setMode(mode === 'login' ? 'signup' : 'login')} className="text-[9px] font-black uppercase tracking-widest opacity-20 hover:opacity-100 transition-all">
          {mode === 'login' ? "New Neural Link? Sync" : "Existing Link? Recall"}
        </button>
      </div>
    </form>
  );
};
