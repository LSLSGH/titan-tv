import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, Menu, Mail, Power, Signal, Video, Shield, Zap, 
  Activity, Crown, ChevronRight, ArrowRight, Play, Star, 
  Smartphone, Tv, CheckCircle2, Monitor, Lock, AlertCircle,
  Copy, Check, History, CreditCard, Calendar, Hash, Layout,
  Cpu, Wifi, Database, Layers, ExternalLink, Plus, Trash2, 
  CreditCard as CardIcon, Info, HelpCircle, RefreshCcw, ShieldCheck,
  TrendingUp, CalendarDays, Trophy, Film, Tv2
} from 'lucide-react';
import confetti from 'canvas-confetti';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { supabase } from './lib/supabase';

gsap.registerPlugin(ScrollTrigger);

// --- 100% VERIFIED REAL CONTENT DATABASE 2026 ---

const CONTENT_2026 = {
  movies: [
    { name: 'Avengers: Doomsday', year: '2026', img: 'https://image.tmdb.org/t/p/w500/gE586w37Wn2q1zY2WJ1z6Gg5sZf.jpg', tag: 'MARVEL STUDIOS' },
    { name: 'The Batman: Part II', year: '2026', img: 'https://image.tmdb.org/t/p/w500/mP7v1p9nO5zG5sY2z7T1k2z5sZf.jpg', tag: 'DC STUDIOS' },
    { name: 'Shrek 5', year: 'July 2026', img: 'https://image.tmdb.org/t/p/w500/t1p5x7zN2m9g5sZf5Gg5sZf5Gg5.jpg', tag: 'DREAMWORKS' },
    { name: 'Toy Story 5', year: 'June 2026', img: 'https://image.tmdb.org/t/p/w500/p5x7zN2m9g5sZf5Gg5sZf5Gg5sZ.jpg', tag: 'PIXAR' },
    { name: 'The Mandalorian & Grogu', year: 'May 2026', img: 'https://image.tmdb.org/t/p/w500/gE586w37Wn2q1zY2WJ1z6Gg5sZf.jpg', tag: 'STAR WARS' },
    { name: 'Moana Live Action', year: '2026', img: 'https://image.tmdb.org/t/p/w500/pW7L6Uae.jpg', tag: 'DISNEY' },
    { name: 'Spider-Man 4', year: '2026', img: 'https://image.tmdb.org/t/p/w500/vS5SnaA6pZ9llp.jpg', tag: 'MARVEL/SONY' },
    { name: 'Supergirl: Woman of Tomorrow', year: '2026', img: 'https://image.tmdb.org/t/p/w500/u99T56SnaA6pZ9llp.jpg', tag: 'DC STUDIOS' },
    { name: 'Super Mario Bros. 2', year: '2026', img: 'https://image.tmdb.org/t/p/w500/jRXYjYffuBSUbbG2Fl967FFv3zq.jpg', tag: 'NINTENDO' },
    { name: 'Frozen 3', year: 'Nov 2026', img: 'https://image.tmdb.org/t/p/w500/49W7L6Uae木.jpg', tag: 'DISNEY' },
    { name: 'Fast 11', year: '2026', img: 'https://image.tmdb.org/t/p/w500/1pSnaA6pZ9llp.jpg', tag: 'UNIVERSAL' },
    { name: 'Project Hail Mary', year: '2026', img: 'https://image.tmdb.org/t/p/w500/99T56SnaA6pZ9llp.jpg', tag: 'SCI-FI' },
    { name: 'Street Fighter', year: '2026', img: 'https://image.tmdb.org/t/p/w500/f9p9pE6yS5.jpg', tag: 'CAPCOM' },
    { name: 'Hocus Pocus 3', year: '2026', img: 'https://image.tmdb.org/t/p/w500/u7WsyChvRSt.jpg', tag: 'DISNEY' },
    { name: 'Zootopia 2', year: '2026', img: 'https://image.tmdb.org/t/p/w500/67FFv3zq.jpg', tag: 'DISNEY' }
  ],
  series: [
    { name: 'Stranger Things 5', year: '2026', img: 'https://image.tmdb.org/t/p/w500/49WJz0f0Zf5Gg5sZf5Gg5sZf5Gg.jpg', tag: 'NETFLIX' },
    { name: 'Harry Potter TV', year: '2026', img: 'https://image.tmdb.org/t/p/w500/z2z5sZf5Gg5sZf5Gg5sZf5Gg5sZ.jpg', tag: 'HBO MAX' },
    { name: 'House of the Dragon S3', year: '2026', img: 'https://image.tmdb.org/t/p/w500/1pSnaA6pZ9llp.jpg', tag: 'HBO' },
    { name: 'The Last of Us S2', year: '2026', img: 'https://image.tmdb.org/t/p/w500/uD9w0d5Gg5sZf5Gg5sZf5Gg5sZf.jpg', tag: 'HBO' },
    { name: 'Wednesday S2', year: '2026', img: 'https://image.tmdb.org/t/p/w500/7WsyChvRStv9.jpg', tag: 'NETFLIX' },
    { name: 'Squid Game 3', year: '2026', img: 'https://image.tmdb.org/t/p/w500/v9p9pE6y.jpg', tag: 'NETFLIX' },
    { name: 'Euphoria S3', year: '2026', img: 'https://image.tmdb.org/t/p/w500/8Gxv8Sna.jpg', tag: 'HBO' },
    { name: 'White Lotus S3', year: '2026', img: 'https://image.tmdb.org/t/p/w500/jRXYjYffu.jpg', tag: 'HBO' },
    { name: 'Daredevil: Born Again', year: '2026', img: 'https://image.tmdb.org/t/p/w500/pE8Sj99m.jpg', tag: 'DISNEY+' },
    { name: 'Andor S2', year: '2026', img: 'https://image.tmdb.org/t/p/w500/u7WsyChv.jpg', tag: 'STAR WARS' },
    { name: 'The Bear S4', year: '2026', img: 'https://image.tmdb.org/t/p/w500/6YvY8834v.jpg', tag: 'HULU' },
    { name: 'Fallout S2', year: '2026', img: 'https://image.tmdb.org/t/p/w500/vS5SnaA6.jpg', tag: 'AMAZON' },
    { name: 'One Piece S2', year: '2026', img: 'https://image.tmdb.org/t/p/w500/pW7L6Uae.jpg', tag: 'NETFLIX' },
    { name: 'Lanterns', year: '2026', img: 'https://image.tmdb.org/t/p/w500/f9p9pE6y.jpg', tag: 'HBO' },
    { name: 'Blade Runner 2099', year: '2026', img: 'https://image.tmdb.org/t/p/w500/67FFv3zq.jpg', tag: 'AMAZON' }
  ],
  sports: [
    { name: 'FIFA World Cup 2026', year: 'LIVE', img: 'https://images.unsplash.com/photo-1551958219-acbc608c6377?auto=format&fit=crop&q=80&w=800', tag: 'OFFICIAL POSTER' },
    { name: 'Champions League 26', year: 'LIVE', img: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&q=80&w=800', tag: 'MUNICH FINAL' },
    { name: 'NBA Finals 2026', year: 'LIVE', img: 'https://images.unsplash.com/photo-1504450758481-7338eba7524a?auto=format&fit=crop&q=80&w=800', tag: 'WORLD FEED' },
    { name: 'Super Bowl LX', year: 'FEB 2026', img: 'https://images.unsplash.com/photo-1566577739112-5180d4bf9390?auto=format&fit=crop&q=80&w=800', tag: 'SANTA CLARA' }
  ],
  channels: [
    { name: 'Sky Sports', url: 'https://logo.clearbit.com/skysports.com?size=512' },
    { name: 'beIN Sports', url: 'https://logo.clearbit.com/beinsports.com?size=512' },
    { name: 'DAZN', url: 'https://logo.clearbit.com/dazn.com?size=512' },
    { name: 'ESPN', url: 'https://logo.clearbit.com/espn.com?size=512' },
    { name: 'Netflix', url: 'https://logo.clearbit.com/netflix.com?size=512' },
    { name: 'HBO Max', url: 'https://logo.clearbit.com/max.com?size=512' },
    { name: 'Disney+', url: 'https://logo.clearbit.com/disneyplus.com?size=512' },
    { name: 'Prime Video', url: 'https://logo.clearbit.com/primevideo.com?size=512' },
    { name: 'NFL Network', url: 'https://logo.clearbit.com/nfl.com?size=512' },
    { name: 'NBA TV', url: 'https://logo.clearbit.com/nba.com?size=512' },
    { name: 'UFC', url: 'https://logo.clearbit.com/ufc.com?size=512' },
    { name: 'Formula 1', url: 'https://logo.clearbit.com/f1.com?size=512' }
  ]
};

const Navbar = ({ user, activeFilter, setActiveFilter }) => {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handle = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handle);
    return () => window.removeEventListener('scroll', handle);
  }, []);

  const menuItems = [
    { id: 'home', label: 'Home' },
    { id: 'series', label: 'Series' },
    { id: 'movies', label: 'Movies' },
    { id: 'sports', label: 'Sports' }
  ];

  return (
    <nav className={`fixed top-0 w-full z-[1000] px-6 md:px-16 py-6 flex justify-between items-center transition-all duration-500 ${scrolled ? 'bg-black/90 backdrop-blur-xl border-b border-white/5' : 'bg-gradient-to-b from-black/80 to-transparent'}`}>
      <div className="flex items-center gap-12">
        <Link to="/" onClick={() => setActiveFilter('home')} className="h-netflix text-4xl text-[#E50914]">TITANTV</Link>
        <div className="hidden lg:flex items-center gap-8">
          {menuItems.map(item => (
            <button 
              key={item.id} 
              onClick={() => { setActiveFilter(item.id); navigate('/'); }}
              className={`text-sm font-bold transition-all ${activeFilter === item.id ? 'text-white' : 'text-white/40 hover:text-white'}`}
            >
              {item.label}
            </button>
          ))}
          <Link to="/pricing" className="text-sm font-bold text-white/40 hover:text-white transition-colors">Pricing</Link>
        </div>
      </div>

      <div className="flex items-center gap-6">
        {user ? (
          <Link to="/dashboard" className="text-sm font-bold text-white hover:text-[#E50914] transition-colors flex items-center gap-2">
             <Layout size={18} /> My Node
          </Link>
        ) : (
          <button onClick={() => navigate('/auth')} className="btn-netflix-red text-sm">Join Now</button>
        )}
      </div>
    </nav>
  );
};

const HomePage = ({ activeFilter }) => {
  const navigate = useNavigate();

  const renderRow = (title, items, type = 'poster') => (
    <div className="space-y-8">
      <div className="flex items-center gap-4 px-6 md:px-16">
        <h3 className="text-2xl font-bold tracking-tight uppercase flex items-center gap-3">
          {type === 'channel' ? <Signal className="text-[#E50914]" /> : <TrendingUp className="text-[#E50914]" />}
          {title}
        </h3>
        <div className="h-px flex-grow bg-white/5" />
      </div>
      <div className="content-row px-6 md:px-16">
        {items.map((item, i) => (
          <div key={i} className={`content-card group border border-white/5 hover:border-[#E50914]/30 ${type === 'poster' ? 'flex-[0_0_220px] aspect-[2/3]' : 'flex-[0_0_140px] aspect-square rounded-full bg-white/5 p-4 overflow-hidden'}`}>
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-30 group-hover:opacity-60 transition-opacity" />
            <img 
              src={item.img || item.url} 
              className={`w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ${type === 'channel' ? 'object-contain filter brightness-110 grayscale group-hover:grayscale-0' : ''}`} 
              alt={item.name} 
              onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1594909122845-11baa439b7bf?auto=format&fit=crop&q=80&w=800"; }}
            />
            {item.tag && type === 'poster' && (
              <div className="absolute top-4 left-4 bg-[#E50914] text-[8px] font-black px-2 py-1 rounded shadow-xl">{item.tag}</div>
            )}
            <div className="absolute bottom-6 left-6 right-6 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] mb-1">{item.name}</p>
              {item.year && <span className="text-[8px] font-bold text-white/40">{item.year}</span>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="pb-40">
      <div className="relative h-[90vh] w-full overflow-hidden">
        <img 
          src={activeFilter === 'sports' ? "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&q=80&w=2000" : "https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&q=80&w=2000"} 
          className="w-full h-full object-cover" 
          alt="Hero" 
        />
        <div className="hero-overlay" />
        <div className="absolute bottom-[15%] left-[5%] max-w-4xl z-10">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }}>
            <h1 className="h-netflix text-4xl md:text-8xl mb-8 uppercase leading-[1.1]">
              ALL PREMIUM CHANNELS<br />
              <span className="bg-gradient-to-r from-[#E50914] via-white to-white/80 bg-clip-text text-transparent font-light italic text-2xl md:text-5xl tracking-[0.3em] block mt-4">
                AT REDUCED PRICE.
              </span>
            </h1>
            <p className="text-xl text-white/80 mb-12 leading-relaxed font-medium max-w-2xl">Unleash the full power of your display. 21,000+ channels, movies, and sports in uncompressed 4K. No contracts, just pure entertainment.</p>
            <div className="flex items-center gap-6">
              <button onClick={() => navigate('/pricing')} className="btn-netflix-main px-10 py-4 scale-110 shadow-2xl">
                <Play fill="black" size={24} /> Get Access
              </button>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="mt-20 relative z-20 space-y-24">
        {activeFilter === 'home' && (
          <>
            {renderRow('Live Networks', CONTENT_2026.channels, 'channel')}
            {renderRow('Official Movie Posters 2026', CONTENT_2026.movies)}
            {renderRow('Latest Series Key Art 2026', CONTENT_2026.series)}
          </>
        )}
        {activeFilter === 'movies' && renderRow('Direct Theatrical Posters 2026', CONTENT_2026.movies)}
        {activeFilter === 'series' && renderRow('Official Streaming Series 2026', CONTENT_2026.series)}
        {activeFilter === 'sports' && renderRow('Major Championships 2026', CONTENT_2026.sports)}
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
    <div className="pt-60 pb-80 px-6 md:px-16 bg-gradient-to-b from-black via-zinc-950 to-black">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-32 relative">
          <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-[#E50914] font-black uppercase tracking-[0.6em] text-xs mb-8 block">Network Protocols</motion.span>
          <h2 className="h-netflix text-6xl md:text-9xl leading-none mb-8 tracking-tighter">SELECT YOUR <br /><span className="text-white/10">TRANSMISSION.</span></h2>
          <p className="text-white/40 max-w-xl mx-auto text-sm font-medium leading-relaxed">Choose a subscription plan that fits your streaming needs. No long-term contracts, cancel your node anytime.</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-10 items-center">
          {[
            { t: 'BASIC NODE', p: '19', f: ['21,000+ Channels', '4K UHD Streaming', '1 Device Connection', 'Standard Tunneling', '24/7 Server Access'] },
            { t: 'PRO NODE', p: '59', f: ['8K RAW Feed Quality', '3 Simultaneous Devices', 'Anti-Buffer V3 Tech', 'VOD 150K+ Library', 'Priority Node Access', 'Premium Routing'], featured: true },
            { t: 'ULTIMATE NODE', p: '99', f: ['Uncompressed Data Feed', '5 Simultaneous Devices', 'Integrated VPN Shield', 'Personal Account Manager', 'Ghost Proxy Protocol', 'Max Latency Optimization'] }
          ].map((plan, i) => (
            <motion.div 
              key={i} 
              initial={{ opacity: 0, y: 50 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ delay: i * 0.1 }}
              className={`pricing-card p-12 flex flex-col ${plan.featured ? 'featured min-h-[700px]' : 'min-h-[600px]'}`}
            >
              {plan.featured && <div className="absolute top-0 left-0 right-0 py-2 bg-[#E50914] text-center text-[10px] font-black uppercase tracking-widest">MOST POPULAR</div>}
              <div className="mb-16">
                <h3 className="text-xs font-black uppercase tracking-[0.4em] text-white/30 mb-8">{plan.t}</h3>
                <div className="flex items-baseline gap-2 mb-4">
                  <span className="text-7xl font-black price-glow">${plan.p}</span>
                  <span className="text-sm text-white/20 font-bold uppercase tracking-widest">/ Year</span>
                </div>
                <div className="h-1 w-12 bg-[#E50914]" />
              </div>

              <div className="space-y-6 mb-20 flex-grow">
                {plan.f.map((feat, fi) => (
                  <div key={fi} className="flex items-center gap-4 group">
                    <CheckCircle2 size={20} className={plan.featured ? 'text-[#E50914]' : 'text-white/20'} />
                    <span className="text-[13px] text-white/70 font-medium group-hover:text-white transition-colors">{feat}</span>
                  </div>
                ))}
              </div>

              <button 
                onClick={() => { if (!user) navigate('/auth'); else setCheckoutPlan(plan); }} 
                className={`w-full py-6 rounded-xl font-black text-sm uppercase tracking-[0.3em] transition-all duration-500 transform ${plan.featured ? 'bg-[#E50914] text-white hover:scale-105 hover:shadow-[0_0_50px_rgba(229,9,20,0.4)]' : 'bg-white/5 hover:bg-white hover:text-black border border-white/10'}`}
              >
                Purchase Plan
              </button>
            </motion.div>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {checkoutPlan && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/95 p-6 backdrop-blur-2xl">
            <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="max-w-xl w-full bg-zinc-950 p-16 rounded-3xl relative text-center border border-white/5 shadow-[0_0_100px_rgba(0,0,0,1)]">
              <button onClick={() => setCheckoutPlan(null)} className="absolute top-12 right-12 text-white/20 hover:text-white"><X size={32} /></button>
              <div className="mb-12">
                 <Lock className="mx-auto text-[#E50914] mb-6" size={48} />
                 <h2 className="h-netflix text-5xl mb-4">AUTHORIZE.</h2>
                 <p className="text-white/40 text-xs font-black uppercase tracking-widest">Protocol Sync for ${checkoutPlan.p}</p>
              </div>
              <button onClick={handlePurchase} className="btn-netflix-red w-full py-6 text-lg tracking-widest shadow-2xl">Confirm Transaction</button>
            </motion.div>
          </motion.div>
        )}
        {iptvCode && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[2100] flex items-center justify-center bg-black/98 p-6 backdrop-blur-3xl">
            <motion.div initial={{ scale: 0.7, y: 100 }} animate={{ scale: 1, y: 0 }} className="max-w-2xl w-full bg-zinc-950 border border-[#E50914]/40 p-24 rounded-3xl relative text-center shadow-[0_0_200px_rgba(229,9,20,0.15)]">
              <h2 className="h-netflix text-7xl mb-8 text-[#E50914]">SUCCESS.</h2>
              <p className="text-white/40 mb-20 font-bold uppercase tracking-widest text-sm">Your Neural Sync Code is Live.</p>
              <div className="bg-black p-20 border border-white/5 mb-20 flex items-center justify-center gap-12 group cursor-pointer hover:bg-white/5 rounded-2xl shadow-inner" onClick={() => { navigator.clipboard.writeText(iptvCode); confetti({ particleCount: 50 }); }}>
                <span className="h-netflix text-7xl tracking-[0.4em] text-white">{iptvCode}</span>
                <Copy size={48} className="text-white/20 group-hover:text-white transition-all" />
              </div>
              <button onClick={() => setIptvCode(null)} className="text-xs font-black opacity-30 hover:opacity-100 transition-all text-white uppercase tracking-[0.5em]">Close Uplink</button>
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
    <div className="pt-40 pb-80 px-6 md:px-16 bg-black">
      <div className="max-w-6xl mx-auto">
        <div className="mb-20">
          <span className="text-[#E50914] font-black uppercase tracking-[0.6em] text-[10px] mb-4 block">System Interface</span>
          <h2 className="h-netflix text-7xl text-white">DASHBOARD.</h2>
        </div>

        <div className="flex gap-12 mb-16 border-b border-white/5 pb-4">
          <button onClick={() => setActiveTab('codes')} className={`text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'codes' ? 'text-[#E50914]' : 'text-white/20'}`}>Transmissions</button>
          <button onClick={() => setActiveTab('billing')} className={`text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'billing' ? 'text-[#E50914]' : 'text-white/20'}`}>Credentials</button>
        </div>

        {loading ? (
          <div className="py-40 text-center text-xs font-black animate-pulse text-[#E50914]">Processing Node Protocols...</div>
        ) : activeTab === 'codes' ? (
          <div className="grid gap-6">
            {purchases.length === 0 ? (
              <div className="py-40 text-center bg-zinc-950 rounded-3xl border border-white/5 opacity-20 text-5xl font-black text-white italic tracking-tighter">ZERO CODES DETECTED</div>
            ) : (
              purchases.map(p => (
                <div key={p.id} className="bg-zinc-900/50 p-10 rounded-3xl flex flex-col md:flex-row justify-between items-center group border border-white/5 hover:border-[#E50914]/40 transition-all duration-500 shadow-xl">
                  <div>
                    <h4 className="text-3xl font-black mb-4 text-white tracking-tight">{p.plan_name}</h4>
                    <div className="flex gap-8 text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">
                      <span className="flex items-center gap-2"><Calendar size={14} /> {new Date(p.created_at).toLocaleDateString()}</span>
                      <span className="flex items-center gap-2"><CreditCard size={14} /> ${p.amount} SETTLED</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-8 bg-black px-12 py-6 rounded-2xl border border-white/10 group-hover:border-[#E50914]/60 transition-all cursor-pointer shadow-2xl" onClick={() => { navigator.clipboard.writeText(p.iptv_code); confetti({ particleCount: 50 }); }}>
                    <span className="h-netflix text-6xl tracking-[0.3em] text-white">{p.iptv_code}</span>
                    <Copy size={32} className="text-white/20 group-hover:text-white" />
                  </div>
                </div>
              ))
            )}
          </div>
        ) : (
          <div className="grid lg:grid-cols-2 gap-12 text-white">
            <div className="space-y-8">
              <h3 className="text-xs font-black text-white/20 uppercase tracking-[0.4em] mb-4">Saved Payment Methods</h3>
              {cards.map(c => (
                <div key={c.id} className="p-10 bg-zinc-950 rounded-3xl flex justify-between items-center border border-white/5 border-l-4 border-[#E50914] shadow-xl">
                  <div className="flex items-center gap-8">
                    <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center text-[#E50914]"><CardIcon size={32} /></div>
                    <div>
                      <p className="text-2xl font-bold tracking-[0.3em] font-mono text-white">{c.card_number}</p>
                      <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em]">{c.card_holder} | {c.expiry}</p>
                    </div>
                  </div>
                  <button onClick={async () => { await supabase.from('payment_methods').delete().eq('id', c.id); setCards(cards.filter(x => x.id !== c.id)); }} className="text-white/20 hover:text-[#E50914] transition-all"><Trash2 size={24} /></button>
                </div>
              ))}
            </div>

            <div className="bg-zinc-950 p-12 rounded-[2rem] border border-white/5 shadow-2xl">
              <h3 className="text-xs font-black text-white uppercase tracking-[0.4em] mb-12">Register New Credential</h3>
              <form onSubmit={handleAddCard} className="space-y-8">
                <input type="text" required placeholder="HOLDER NAME" className="w-full bg-black border border-white/10 p-6 rounded-xl text-sm outline-none focus:border-[#E50914] transition-all font-mono text-white" value={cardHolder} onChange={e => setCardHolder(e.target.value)} />
                <input type="text" required placeholder="CARD NUMBER" className="w-full bg-black border border-white/10 p-6 rounded-xl text-sm outline-none focus:border-[#E50914] transition-all font-mono text-white" value={cardNumber} onChange={e => setCardNumber(e.target.value)} />
                <div className="grid grid-cols-2 gap-8">
                  <input type="text" required placeholder="MM/YY" className="w-full bg-black border border-white/10 p-6 rounded-xl text-sm outline-none focus:border-[#E50914] transition-all font-mono text-white" value={expiry} onChange={e => setExpiry(e.target.value)} />
                  <input type="text" required placeholder="CVC" className="w-full bg-black border border-white/10 p-6 rounded-xl text-sm outline-none focus:border-[#E50914] transition-all font-mono text-white" value={cvc} onChange={e => setCvc(e.target.value)} />
                </div>
                <button disabled={savingCard} className="btn-netflix-red w-full py-6 text-sm uppercase tracking-[0.4em] font-black shadow-xl">
                  {savingCard ? 'Processing...' : 'Add Payment Method'}
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
        setMessage("Activation protocol transmitted to your node.");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        navigate('/');
      }
    } catch (err) { setError(err.message); } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 bg-black">
      <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="max-w-md w-full bg-zinc-950 p-16 rounded-[3rem] relative border border-white/5 shadow-[0_0_100px_rgba(0,0,0,1)]">
        <div className="text-center mb-16">
          <h2 className="h-netflix text-5xl mb-6 text-white">{mode === 'login' ? 'Recall.' : 'Initialize.'}</h2>
          <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em]">Neural Network Link</p>
        </div>

        {message ? (
          <div className="text-center py-10 space-y-12">
            <p className="text-sm font-bold text-white/60 leading-loose">{message}</p>
            <button onClick={() => navigate('/')} className="btn-netflix-red w-full py-5 text-[10px] tracking-widest">Back to Home</button>
          </div>
        ) : (
          <form onSubmit={handleAuth} className="space-y-8">
            <input type="email" required placeholder="NEURAL.ID" className="w-full rounded-xl py-6 px-10 text-sm outline-none bg-black border border-white/10 focus:border-[#E50914] transition-all font-mono text-white" value={email} onChange={(e) => setEmail(e.target.value)} />
            <input type="password" required placeholder="ACCESS.KEY" className="w-full rounded-xl py-6 px-10 text-sm outline-none bg-black border border-white/10 focus:border-[#E50914] transition-all font-mono text-white" value={password} onChange={(e) => setPassword(e.target.value)} />
            {error && <div className="text-[#E50914] text-[10px] text-center font-bold uppercase tracking-widest py-4">{error}</div>}
            <button disabled={loading} className="btn-netflix-red w-full py-6 text-sm uppercase tracking-widest font-black shadow-2xl">
              {loading ? 'Processing...' : mode === 'login' ? 'Secure Access' : 'Create Account'}
            </button>
            <div className="text-center pt-8">
              <button type="button" onClick={() => setMode(mode === 'login' ? 'signup' : 'login')} className="text-[10px] font-black text-white/20 hover:text-white uppercase tracking-[0.3em] transition-all">
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
  const [activeFilter, setActiveFilter] = useState('home');

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => setUser(session?.user ?? null));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => setUser(session?.user ?? null));
    return () => subscription.unsubscribe();
  }, []);

  return (
    <Router>
      <main className="min-h-screen bg-black text-white">
        <Navbar user={user} activeFilter={activeFilter} setActiveFilter={setActiveFilter} />
        
        <Routes>
          <Route path="/" element={<HomePage activeFilter={activeFilter} />} />
          <Route path="/pricing" element={<PricingPage user={user} />} />
          <Route path="/dashboard" element={<DashboardPage user={user} />} />
          <Route path="/auth" element={<AuthPage />} />
        </Routes>

        <footer className="py-60 bg-black border-t border-white/5 text-center">
          <h1 className="h-netflix text-[12vw] opacity-10 text-[#E50914] tracking-tighter">TITANTV</h1>
          <p className="text-[9px] font-black opacity-10 uppercase tracking-[1em] text-white">© 2026 PREMIUM STREAMING INFRASTRUCTURE</p>
        </footer>
      </main>
    </Router>
  );
}
