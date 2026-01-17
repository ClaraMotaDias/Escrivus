import React, { useState, useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import { 
  Plus, 
  Settings, 
  User, 
  Book, 
  Users, 
  Map, 
  Music, 
  Lightbulb, 
  History, 
  RefreshCcw, 
  Image as ImageIcon,
  Flame,
  ChevronRight,
  LogOut,
  Bell, 
  Shield, 
  Accessibility, 
  Check, 
  Send, 
  FileText, 
  AlertTriangle, 
  ArrowLeft,
  Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { GoogleGenAI } from "@google/genai";

// --- Types & Constants ---
type View = 'auth' | 'onboarding' | 'dashboard' | 'channel' | 'ai' | 'settings' | 'gallery';
type MascotState = 'idle' | 'thinking' | 'success' | 'warning';

interface UserProfile {
  name: string;
  age: string;
  tastes: string;
  streak: number;
  lastVisit: string;
}

interface ImageItem {
  id: string;
  url: string;
  caption: string;
}

interface TopicContent {
  id: string;
  title: string;
  text: string;
}

const CHANNELS = [
  { id: 'characters', name: 'Personagens', icon: Users, color: 'from-blue-500 to-indigo-500', tutorial: 'Aqui você define quem são os protagonistas e antagonistas da sua obra.' },
  { id: 'script', name: 'Roteiro', icon: Book, color: 'from-purple-500 to-pink-500', tutorial: 'Organize a estrutura narrativa, capítulos e arcos.' },
  { id: 'ideas', name: 'Ideias da História', icon: Lightbulb, color: 'from-yellow-500 to-orange-500', tutorial: 'Não deixe nenhuma faísca de criatividade escapar.' },
  { id: 'forget', name: 'Não Esquecer', icon: History, color: 'from-red-500 to-rose-500', tutorial: 'Lembretes vitais para manter a coerência.' },
  { id: 'changes', name: 'Mudanças', icon: RefreshCcw, color: 'from-emerald-500 to-teal-500', tutorial: 'Acompanhe as evoluções da sua narrativa.' },
  { id: 'music', name: 'Música do Personagem', icon: Music, color: 'from-indigo-500 to-purple-500', tutorial: 'Trilha sonora que ajuda a definir a personalidade.' },
];

// --- Components ---

const OwlMascot = ({ size = "md", state = "idle" }: { size?: "sm" | "md" | "lg", state?: MascotState }) => {
  const sizes = { sm: "h-20 w-20", md: "h-40 w-40", lg: "h-64 w-64" };
  
  const eyeStates = {
    idle: { scaleY: 1, color: "#1e1b4b" },
    thinking: { scaleY: [1, 0.1, 1], color: "#4c1d95" },
    success: { scaleY: 1, color: "#064e3b" },
    warning: { scaleY: 1, color: "#7f1d1d" }
  };

  return (
    <motion.div 
      className={`relative ${sizes[size]} flex items-center justify-center`}
      animate={{ 
        y: [0, -12, 0],
      }}
      transition={{ 
        y: { repeat: Infinity, duration: 3.5, ease: "easeInOut" },
      }}
    >
      <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-xl overflow-visible">
        <defs>
          <linearGradient id="softOwlGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#d8b4fe" />
            <stop offset="100%" stopColor="#a855f7" />
          </linearGradient>
        </defs>

        {/* Feet */}
        <circle cx="80" cy="170" r="8" fill="#f59e0b" />
        <circle cx="120" cy="170" r="8" fill="#f59e0b" />

        {/* Tail */}
        <path d="M80,150 L100,180 L120,150 Z" fill="#9333ea" />

        {/* Wings */}
        <motion.ellipse 
          cx="45" cy="120" rx="20" ry="35" 
          fill="#c084fc" 
          animate={{ rotate: state === 'thinking' ? [0, -10, 0] : [0, -5, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
        />
        <motion.ellipse 
          cx="155" cy="120" rx="20" ry="35" 
          fill="#c084fc" 
          animate={{ rotate: state === 'thinking' ? [0, 10, 0] : [0, 5, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
        />

        {/* Body */}
        <rect x="50" y="50" width="100" height="120" rx="50" fill="url(#softOwlGradient)" />

        {/* Face Mask */}
        <path d="M60,100 Q80,70 100,100 Q120,70 140,100 Q140,140 100,140 Q60,140 60,100" fill="#f3e8ff" />

        {/* Ears/Tufts */}
        <path d="M60,60 L40,30 L80,55 Z" fill="#a855f7" />
        <path d="M140,60 L160,30 L120,55 Z" fill="#a855f7" />

        {/* Eyes */}
        <motion.g animate={{ scaleY: state === 'thinking' ? [1, 0.1, 1] : 1 }} transition={{ repeat: state === 'thinking' ? Infinity : 0, duration: 0.8 }}>
          <circle cx="80" cy="105" r="12" fill={eyeStates[state].color} />
          <circle cx="120" cy="105" r="12" fill={eyeStates[state].color} />
          {/* Shine */}
          <circle cx="76" cy="100" r="4" fill="white" />
          <circle cx="116" cy="100" r="4" fill="white" />
        </motion.g>

        {/* Beak */}
        <path d="M92,120 L108,120 L100,135 Z" fill="#fbbf24" />

        {/* Sparkles when success */}
        {state === 'success' && (
          <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
             <Sparkles x="30" y="30" size={20} className="text-yellow-400" />
             <Sparkles x="150" y="50" size={15} className="text-yellow-200" />
          </motion.g>
        )}
      </svg>
      
      {/* Background soft glow */}
      <motion.div 
        className="absolute inset-0 bg-purple-400/10 blur-[60px] rounded-full -z-10"
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ duration: 4, repeat: Infinity }}
      />
    </motion.div>
  );
};

const StreakFlame = ({ count }: { count: number }) => {
  const getFlameStyles = (c: number) => {
    if (c <= 100) return { color: 'text-purple-300', glow: 'shadow-purple-300/40' };
    if (c <= 200) return { color: 'text-purple-700', glow: 'shadow-purple-700/50' };
    if (c <= 300) return { color: 'text-slate-300', glow: 'shadow-indigo-200/50', border: 'border-slate-400' };
    return { 
      color: 'text-transparent bg-clip-text bg-gradient-to-tr from-red-500 via-yellow-400 via-green-400 via-blue-500 to-purple-600', 
      glow: 'shadow-white/20',
      isRainbow: true
    };
  };

  const styles = getFlameStyles(count);

  return (
    <motion.div 
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={`flex items-center gap-3 px-5 py-2.5 bg-slate-800/80 rounded-full border ${styles.border || 'border-slate-700'} cursor-pointer group shadow-lg ${styles.glow} transition-shadow`}
    >
      <motion.div
        animate={{ scale: [1, 1.2, 1], rotate: [-5, 5, -5] }}
        transition={{ duration: 0.8, repeat: Infinity, ease: "easeInOut" }}
      >
        <Flame 
          size={24} 
          className={styles.isRainbow ? 'text-orange-400' : styles.color} 
          fill={styles.isRainbow ? 'url(#rainbow-gradient-settings)' : 'currentColor'} 
        />
        <svg width="0" height="0">
          <linearGradient id="rainbow-gradient-settings" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ef4444" />
            <stop offset="25%" stopColor="#facc15" />
            <stop offset="50%" stopColor="#4ade80" />
            <stop offset="75%" stopColor="#3b82f6" />
            <stop offset="100%" stopColor="#a855f7" />
          </linearGradient>
        </svg>
      </motion.div>
      <span className={`font-black text-xl tracking-tight ${styles.color}`}>{count}</span>
    </motion.div>
  );
};

export default function Escrivus() {
  const [view, setView] = useState<View>('auth');
  const [user, setUser] = useState<UserProfile | null>(null);
  const [activeChannel, setActiveChannel] = useState<string | null>(null);
  const [gallery, setGallery] = useState<ImageItem[]>([]);
  const [contents, setContents] = useState<Record<string, TopicContent[]>>({});
  const [aiText, setAiText] = useState("");
  const [aiResponse, setAiResponse] = useState("");
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [mascotState, setMascotState] = useState<MascotState>('idle');

  // Initialize data
  useEffect(() => {
    const savedUser = localStorage.getItem('escrivus_user');
    const savedGallery = localStorage.getItem('escrivus_gallery');
    const savedContents = localStorage.getItem('escrivus_contents');
    
    if (savedUser) {
      const parsedUser = JSON.parse(savedUser);
      const today = new Date().toISOString().split('T')[0];
      if (parsedUser.lastVisit !== today) {
        parsedUser.streak += 1;
        parsedUser.lastVisit = today;
        localStorage.setItem('escrivus_user', JSON.stringify(parsedUser));
      }
      setUser(parsedUser);
      setView('dashboard');
    }
    if (savedGallery) setGallery(JSON.parse(savedGallery));
    if (savedContents) setContents(JSON.parse(savedContents));
  }, []);

  const handleLogin = (provider: 'Google' | 'Apple') => {
    setView('onboarding');
  };

  const completeOnboarding = (data: Partial<UserProfile>) => {
    const newUser: UserProfile = {
      name: data.name || 'Escritor',
      age: data.age || '?',
      tastes: data.tastes || 'Misto',
      streak: 1,
      lastVisit: new Date().toISOString().split('T')[0]
    };
    setUser(newUser);
    localStorage.setItem('escrivus_user', JSON.stringify(newUser));
    setMascotState('success');
    setTimeout(() => setMascotState('idle'), 2000);
    setView('dashboard');
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const newItem = { id: Date.now().toString(), url: reader.result as string, caption: 'Inspiração' };
        const newGallery = [...gallery, newItem];
        setGallery(newGallery);
        localStorage.setItem('escrivus_gallery', JSON.stringify(newGallery));
        setMascotState('success');
        setTimeout(() => setMascotState('idle'), 2000);
      };
      reader.readAsDataURL(file);
    }
  };

  const runAiRevision = async () => {
    if (!aiText) return;
    setIsAiLoading(true);
    setMascotState('thinking');
    setAiResponse("");
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: `Revise o seguinte texto literário focando em estilo, gramática e fluidez. Responda em Português: ${aiText}`,
      });
      setAiResponse(response.text || "Sem resposta da IA.");
      setMascotState('success');
    } catch (err) {
      setAiResponse("Erro ao conectar com a IA.");
      setMascotState('warning');
    } finally {
      setIsAiLoading(false);
      setTimeout(() => setMascotState('idle'), 3000);
    }
  };

  const saveTopic = (channelId: string, title: string, text: string) => {
    const newTopic = { id: Date.now().toString(), title, text };
    const updated = { ...contents, [channelId]: [...(contents[channelId] || []), newTopic] };
    setContents(updated);
    localStorage.setItem('escrivus_contents', JSON.stringify(updated));
    setMascotState('success');
    setTimeout(() => setMascotState('idle'), 2000);
  };

  // --- Views ---

  if (view === 'auth') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-slate-900 overflow-hidden">
        <div className="relative mb-6">
          <OwlMascot size="lg" />
        </div>
        <motion.h1 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-6xl font-black mb-4 bg-gradient-to-r from-purple-300 to-indigo-300 bg-clip-text text-transparent tracking-tighter"
        >
          Escrivus
        </motion.h1>
        <p className="text-slate-400 mb-12 text-center max-w-sm leading-relaxed font-medium">
          Sua corujinha da escrita está pronta para organizar seus pensamentos.
        </p>
        
        <div className="space-y-4 w-full max-w-xs">
          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleLogin('Google')}
            className="w-full flex items-center justify-center gap-3 bg-white text-slate-900 font-black py-4 px-6 rounded-3xl shadow-xl transition-all"
          >
            <img src="https://www.svgrepo.com/show/355037/google.svg" className="w-5 h-5" alt="" />
            Entrar com Google
          </motion.button>
          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleLogin('Apple')}
            className="w-full flex items-center justify-center gap-3 bg-slate-800 text-white font-black py-4 px-6 rounded-3xl shadow-xl transition-all border border-slate-700"
          >
            <img src="https://www.svgrepo.com/show/511330/apple-173.svg" className="w-5 h-5 invert" alt="" />
            Entrar com Apple
          </motion.button>
        </div>
      </div>
    );
  }

  if (view === 'onboarding') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-slate-950">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-md glass-card p-10 rounded-[3rem] shadow-2xl border-purple-500/10 relative">
          <div className="flex justify-center -mt-24 mb-6">
            <OwlMascot size="md" state={mascotState} />
          </div>
          <h2 className="text-3xl font-black mb-2 text-center tracking-tight">Primeira Conexão</h2>
          <p className="text-slate-500 text-center mb-10 text-xs font-bold uppercase tracking-widest">Apresente-se para sua coruja</p>
          <div className="space-y-6">
            <div className="group">
              <label className="block text-[10px] font-black text-slate-500 mb-2 uppercase tracking-[0.2em] group-focus-within:text-purple-400 transition-colors">Nome de Autor</label>
              <input type="text" id="ob-name" className="w-full bg-slate-900/50 border border-slate-800 rounded-2xl px-5 py-4 focus:ring-2 focus:ring-purple-500 outline-none transition-all placeholder:text-slate-700 font-medium" placeholder="Ex: Machado de Assis" />
            </div>
            <div className="group">
              <label className="block text-[10px] font-black text-slate-500 mb-2 uppercase tracking-[0.2em] group-focus-within:text-purple-400 transition-colors">Idade</label>
              <input type="number" id="ob-age" className="w-full bg-slate-900/50 border border-slate-800 rounded-2xl px-5 py-4 focus:ring-2 focus:ring-purple-500 outline-none transition-all font-medium" />
            </div>
            <div className="group">
              <label className="block text-[10px] font-black text-slate-500 mb-2 uppercase tracking-[0.2em] group-focus-within:text-purple-400 transition-colors">Gêneros Preferidos</label>
              <input type="text" id="ob-tastes" className="w-full bg-slate-900/50 border border-slate-800 rounded-2xl px-5 py-4 focus:ring-2 focus:ring-purple-500 outline-none transition-all placeholder:text-slate-700 font-medium" placeholder="Fantasia, Mistério..." />
            </div>
            <motion.button 
              whileHover={{ scale: 1.02, boxShadow: "0 0 30px rgba(168, 85, 247, 0.4)" }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                const name = (document.getElementById('ob-name') as HTMLInputElement).value;
                const age = (document.getElementById('ob-age') as HTMLInputElement).value;
                const tastes = (document.getElementById('ob-tastes') as HTMLInputElement).value;
                completeOnboarding({ name, age, tastes });
              }}
              className="w-full bg-gradient-to-r from-purple-500 to-indigo-600 py-5 rounded-3xl font-black text-lg shadow-xl active:scale-95 transition-all mt-4"
            >
              Começar a Escrever
            </motion.button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-slate-950 text-slate-100 overflow-hidden font-sans selection:bg-purple-500/30">
      {/* Sidebar / Navigation */}
      <nav className="w-20 md:w-72 border-r border-slate-800/50 bg-slate-900/40 flex flex-col h-screen p-6 backdrop-blur-3xl z-40">
        <div className="flex items-center gap-4 mb-12 px-2">
          <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-500/20 group cursor-pointer">
            <Sparkles size={24} className="text-white group-hover:rotate-12 transition-transform" />
          </div>
          <span className="hidden md:block font-black text-2xl tracking-tighter">Escrivus</span>
        </div>

        <div className="flex-1 space-y-3">
          {[
            { id: 'dashboard', icon: Plus, label: 'Canais' },
            { id: 'gallery', icon: ImageIcon, label: 'Matrizes' },
            { id: 'ai', icon: RefreshCcw, label: 'Revisão' }
          ].map(item => (
            <button 
              key={item.id}
              onClick={() => setView(item.id as View)} 
              className={`w-full flex items-center gap-4 px-4 py-4 rounded-2xl transition-all duration-300 group ${view === item.id ? 'bg-purple-600/90 shadow-lg shadow-purple-600/30 text-white' : 'hover:bg-slate-800/50 text-slate-500 hover:text-slate-200'}`}
            >
              <item.icon size={22} className={view === item.id ? 'scale-110' : 'group-hover:scale-110 transition-transform'} />
              <span className="hidden md:block font-bold text-sm uppercase tracking-widest">{item.label}</span>
            </button>
          ))}
        </div>

        <div className="space-y-3 pt-6 border-t border-slate-800/50">
          <button 
            onClick={() => setView('settings')} 
            className={`w-full flex items-center gap-4 px-4 py-4 rounded-2xl transition-all duration-300 ${view === 'settings' ? 'bg-slate-800 text-white' : 'hover:bg-slate-800/50 text-slate-500'}`}
          >
            <Settings size={22} />
            <span className="hidden md:block font-bold text-sm uppercase tracking-widest">Ajustes</span>
          </button>
          <div className="flex items-center gap-4 p-4 mt-6 bg-slate-800/20 rounded-3xl border border-slate-700/20 backdrop-blur-sm">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-slate-200 to-purple-200 overflow-hidden shadow-inner flex items-center justify-center font-black text-slate-900 border border-white/20">
               {user?.name.substring(0,2).toUpperCase()}
            </div>
            <div className="hidden md:block overflow-hidden flex-1">
              <p className="text-sm font-black truncate text-slate-100">{user?.name}</p>
              <p className="text-[9px] uppercase tracking-widest text-purple-500 font-black">{user?.tastes}</p>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto relative pb-24 md:pb-10 scroll-smooth">
        <header className="sticky top-0 z-30 flex items-center justify-between p-8 bg-slate-950/90 backdrop-blur-2xl border-b border-slate-800/50">
          <div className="flex items-center gap-6">
            {view !== 'dashboard' && (
              <motion.button 
                whileHover={{ x: -3, backgroundColor: 'rgba(30, 41, 59, 0.8)' }}
                onClick={() => setView('dashboard')} 
                className="p-3 bg-slate-800/50 rounded-xl transition-all border border-slate-700/50 text-purple-400"
              >
                <ArrowLeft size={20} />
              </motion.button>
            )}
            <div>
              <h2 className="text-3xl font-black capitalize tracking-tighter">
                {view === 'dashboard' ? 'Início' : 
                 view === 'gallery' ? 'Visual' : 
                 view === 'ai' ? 'Revisão' : 
                 view === 'settings' ? 'Ajustes' : 
                 activeChannel ? CHANNELS.find(c => c.id === activeChannel)?.name : 'Escrivus'}
              </h2>
              <div className="flex items-center gap-2 mt-1">
                <span className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></span>
                <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em]">Fluxo Criativo Ativo</p>
              </div>
            </div>
          </div>
          <StreakFlame count={user?.streak || 1} />
        </header>

        <div className="p-8 md:p-12 max-w-7xl mx-auto">
          <AnimatePresence mode="wait">
            {view === 'dashboard' && (
              <motion.div 
                key="dashboard" 
                initial={{ opacity: 0, y: 10 }} 
                animate={{ opacity: 1, y: 0 }} 
                exit={{ opacity: 0, scale: 0.95 }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
              >
                {CHANNELS.map((channel, idx) => (
                  <motion.div 
                    key={channel.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    whileHover={{ y: -10, boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)", borderColor: "rgba(168, 85, 247, 0.4)" }}
                    onClick={() => { setActiveChannel(channel.id); setView('channel'); }}
                    className="p-8 rounded-[3rem] glass-card border border-slate-800/50 cursor-pointer group flex flex-col h-full relative overflow-hidden transition-all duration-500"
                  >
                    <div className={`absolute -right-12 -top-12 w-40 h-40 bg-gradient-to-br ${channel.color} opacity-5 blur-3xl group-hover:opacity-20 transition-opacity`} />
                    <div className={`w-16 h-16 rounded-[1.5rem] bg-gradient-to-br ${channel.color} flex items-center justify-center mb-8 shadow-2xl shadow-black/40 group-hover:scale-110 group-hover:-rotate-3 transition-all duration-500`}>
                      <channel.icon size={28} className="text-white" />
                    </div>
                    <h3 className="text-2xl font-black mb-3 tracking-tighter text-slate-100 group-hover:text-white transition-colors">{channel.name}</h3>
                    <p className="text-sm text-slate-500 leading-relaxed flex-1 group-hover:text-slate-300 transition-colors font-medium">{channel.tutorial}</p>
                    <div className="mt-8 pt-6 border-t border-slate-800/50 flex items-center justify-between text-[10px] font-black uppercase tracking-[0.2em] text-slate-600 group-hover:text-purple-400 transition-colors">
                      <span className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-slate-700 rounded-full group-hover:bg-purple-500"></span>
                        {contents[channel.id]?.length || 0} Segmentos
                      </span>
                      <ChevronRight size={18} className="group-hover:translate-x-2 transition-transform" />
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}

            {view === 'channel' && activeChannel && (
              <motion.div 
                key="channel-view" 
                initial={{ opacity: 0, x: 20 }} 
                animate={{ opacity: 1, x: 0 }} 
                exit={{ opacity: 0, x: -20 }}
              >
                <motion.div 
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="mb-10 p-10 bg-purple-600/5 border border-purple-500/10 rounded-[3.5rem] flex flex-col md:flex-row items-center gap-10 shadow-inner backdrop-blur-sm relative overflow-hidden"
                >
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-purple-500/30 to-transparent"></div>
                  <OwlMascot size="sm" state={mascotState} />
                  <div className="text-center md:text-left flex-1">
                    <h4 className="font-black text-purple-400 text-xs uppercase tracking-[0.3em] mb-3">Dica da Corujinha</h4>
                    <p className="text-slate-200 leading-relaxed max-w-2xl text-lg font-medium italic opacity-90">"{CHANNELS.find(c => c.id === activeChannel)?.tutorial}"</p>
                  </div>
                </motion.div>

                <div className="grid grid-cols-1 gap-8">
                  <AnimatePresence mode="popLayout">
                    {contents[activeChannel]?.map(topic => (
                      <motion.div 
                        layout
                        key={topic.id} 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="p-10 glass-card rounded-[2.5rem] border border-slate-800/80 shadow-2xl group hover:border-purple-500/20 transition-all duration-300"
                      >
                        <div className="flex items-center justify-between mb-6">
                           <h4 className="font-black text-2xl text-slate-100 group-hover:text-purple-200 transition-colors tracking-tight">{topic.title}</h4>
                           <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest px-3 py-1 bg-slate-900 rounded-full border border-slate-800">Registrado</span>
                        </div>
                        <p className="text-slate-400 whitespace-pre-wrap leading-loose text-lg font-medium">{topic.text}</p>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                  
                  <motion.div 
                    layout
                    className="p-12 glass-card rounded-[3.5rem] border-dashed border-2 border-slate-800 hover:border-purple-500/30 transition-all duration-500 group"
                  >
                    <h4 className="font-black text-3xl mb-10 tracking-tighter flex items-center gap-4">
                      <Plus className="text-purple-500 group-hover:rotate-90 transition-transform duration-500" />
                      Novo Tópico
                    </h4>
                    <div className="space-y-8">
                      <input 
                        id="topic-title" 
                        placeholder="Título do Registro" 
                        className="w-full bg-slate-900/40 rounded-[1.5rem] px-8 py-5 border border-slate-800 focus:border-purple-500/50 focus:ring-4 focus:ring-purple-500/5 outline-none transition-all placeholder:text-slate-800 font-bold text-lg" 
                      />
                      <textarea 
                        id="topic-text" 
                        placeholder="Suas ideias começam aqui..." 
                        rows={8} 
                        className="w-full bg-slate-900/40 rounded-[2rem] px-8 py-7 border border-slate-800 focus:border-purple-500/50 focus:ring-4 focus:ring-purple-500/5 outline-none transition-all resize-none placeholder:text-slate-800 font-medium text-lg leading-relaxed"
                      ></textarea>
                      <motion.button 
                        whileHover={{ scale: 1.01, boxShadow: "0 20px 40px -10px rgba(168, 85, 247, 0.3)" }}
                        whileTap={{ scale: 0.99 }}
                        onClick={() => {
                          const t = (document.getElementById('topic-title') as HTMLInputElement).value;
                          const c = (document.getElementById('topic-text') as HTMLTextAreaElement).value;
                          if(t && c) {
                             saveTopic(activeChannel, t, c);
                             (document.getElementById('topic-title') as HTMLInputElement).value = "";
                             (document.getElementById('topic-text') as HTMLTextAreaElement).value = "";
                          }
                        }}
                        className="bg-gradient-to-r from-purple-600 to-indigo-700 hover:from-purple-500 hover:to-indigo-600 px-12 py-5 rounded-2xl font-black shadow-2xl transition-all flex items-center gap-4 text-xl tracking-tight border border-purple-400/20"
                      >
                        Salvar Registro
                      </motion.button>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            )}

            {view === 'gallery' && (
              <motion.div key="gallery" className="space-y-12">
                <div className="flex flex-col lg:flex-row items-center justify-between gap-10 bg-slate-900/30 p-10 rounded-[3rem] border border-slate-800/50">
                  <div className="max-w-2xl text-center lg:text-left">
                    <h3 className="text-3xl font-black mb-4 tracking-tighter">Matrizes Visuais</h3>
                    <p className="text-slate-400 text-lg leading-relaxed font-medium italic">"As imagens ajudam a coruja a visualizar seu mundo narrativo. Adicione inspirações visuais."</p>
                  </div>
                  <label className="cursor-pointer bg-purple-600 hover:bg-purple-500 px-12 py-6 rounded-[2.5rem] font-black flex items-center gap-4 transition-all shadow-2xl shadow-purple-900/20 active:scale-95 border border-purple-400/30 text-lg">
                    <Plus size={24} /> Adicionar Imagem
                    <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                  </label>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                  <AnimatePresence>
                    {gallery.map(img => (
                      <motion.div 
                        key={img.id} 
                        layout 
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        whileHover={{ y: -8 }}
                        className="group relative aspect-square rounded-[3rem] overflow-hidden glass-card border border-slate-800 shadow-2xl"
                      >
                        <img src={img.url} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" alt="" />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col justify-end p-10 backdrop-blur-[1px]">
                          <p className="text-xl font-black text-white tracking-tight">{img.caption}</p>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                  {gallery.length === 0 && (
                    <div className="col-span-full py-40 flex flex-col items-center justify-center border-2 border-dashed border-slate-800 rounded-[4rem] bg-slate-900/10">
                      <ImageIcon size={64} className="text-slate-800 mb-4" />
                      <p className="text-slate-600 font-black uppercase tracking-[0.4em] text-sm">Nenhuma Imagem Ainda</p>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {view === 'ai' && (
              <motion.div key="ai" className="space-y-12">
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-purple-500/5 border border-purple-500/10 p-10 rounded-[3.5rem] flex flex-col md:flex-row gap-8 text-purple-100 shadow-inner backdrop-blur-xl"
                >
                  <div className="w-16 h-16 bg-purple-600 rounded-3xl flex items-center justify-center shrink-0 shadow-xl shadow-purple-500/20">
                    <Sparkles className="text-white" size={32} />
                  </div>
                  <div>
                    <h4 className="font-black text-2xl mb-2 tracking-tight">O Olhar Crítico</h4>
                    <p className="text-lg leading-relaxed text-slate-400 font-medium">Deixe que a coruja analise seu texto e sugira melhorias de estilo e clareza. Sua criatividade é o ponto de partida, o polimento é nosso toque final.</p>
                  </div>
                </motion.div>

                <div className="glass-card p-12 rounded-[4rem] shadow-2xl border border-slate-800/50 relative overflow-hidden">
                  <h3 className="text-3xl font-black mb-10 tracking-tighter">Câmara de Revisão</h3>
                  <textarea 
                    value={aiText}
                    onChange={(e) => setAiText(e.target.value)}
                    placeholder="Cole seu texto para análise..."
                    className="w-full h-96 bg-slate-900/30 border border-slate-800 rounded-[2.5rem] p-10 outline-none focus:ring-4 focus:ring-purple-500/10 focus:border-purple-500/40 transition-all resize-none mb-10 placeholder:text-slate-800 leading-relaxed text-xl font-medium"
                  />
                  <motion.button 
                    whileHover={{ scale: 1.01, boxShadow: "0 25px 50px -12px rgba(168, 85, 247, 0.4)" }}
                    whileTap={{ scale: 0.99 }}
                    onClick={runAiRevision}
                    disabled={isAiLoading || !aiText}
                    className="w-full bg-gradient-to-r from-purple-500 to-indigo-700 disabled:opacity-50 py-7 rounded-3xl font-black text-2xl flex items-center justify-center gap-5 transition-all shadow-2xl"
                  >
                    {isAiLoading ? <RefreshCcw className="animate-spin" /> : <Send size={28} />}
                    {isAiLoading ? 'Analisando...' : 'Solicitar Revisão'}
                  </motion.button>
                </div>

                {aiResponse && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="glass-card p-12 rounded-[4rem] border-purple-500/20 shadow-2xl"
                  >
                    <div className="flex items-center gap-5 mb-10">
                      <div className="w-14 h-14 rounded-[1.5rem] bg-purple-600 flex items-center justify-center shadow-2xl shadow-purple-600/30">
                        <Check size={28} className="text-white" />
                      </div>
                      <h4 className="font-black text-3xl tracking-tight">Parecer da Coruja</h4>
                    </div>
                    <div className="text-slate-200 whitespace-pre-wrap leading-relaxed text-xl font-medium p-8 bg-slate-900/40 rounded-[2.5rem] border border-slate-800/50 shadow-inner">
                      {aiResponse}
                    </div>
                  </motion.div>
                )}
              </motion.div>
            )}

            {view === 'settings' && (
              <motion.div key="settings" className="max-w-5xl mx-auto space-y-10 pb-40">
                <section className="glass-card p-12 rounded-[3.5rem] border border-slate-800/50 shadow-2xl relative overflow-hidden">
                  <div className="flex items-center gap-8 mb-12 pb-12 border-b border-slate-800/50">
                    <div className="w-16 h-16 bg-purple-500/10 rounded-2xl flex items-center justify-center">
                      <User className="text-purple-400" size={32} />
                    </div>
                    <div>
                      <h3 className="font-black text-3xl tracking-tighter text-white">Perfil</h3>
                      <p className="text-xs text-slate-500 font-black uppercase tracking-[0.3em] mt-2">Dados da conta</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    <div className="space-y-3">
                      <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-600">Autor</p>
                      <p className="text-2xl font-black text-slate-100">{user?.name}</p>
                    </div>
                    <div className="space-y-3">
                      <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-600">Sequência</p>
                      <p className="text-2xl font-black text-purple-400">{user?.streak} Dias</p>
                    </div>
                  </div>
                </section>

                <div className="pt-10 flex flex-col sm:flex-row gap-8">
                  <motion.button 
                    whileHover={{ scale: 1.02 }}
                    onClick={() => { localStorage.clear(); window.location.reload(); }}
                    className="flex-1 p-8 glass-card rounded-[2.5rem] flex items-center justify-center gap-4 text-red-500 font-black transition-all border border-slate-800/50 uppercase text-sm tracking-widest shadow-xl"
                  >
                    <LogOut size={22} /> Sair da Conta
                  </motion.button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* Helper Mascot (Floating near content) */}
      <div className="fixed bottom-12 right-12 z-50 pointer-events-none md:pointer-events-auto">
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="group relative"
        >
          <AnimatePresence>
            <motion.div 
              initial={{ opacity: 0, y: 10, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              className="absolute bottom-[115%] right-0 mb-8 w-80 p-8 glass-card rounded-[2.5rem] border border-purple-500/30 opacity-0 group-hover:opacity-100 transition-all shadow-2xl pointer-events-none backdrop-blur-2xl"
            >
              <p className="text-lg text-slate-100 font-bold leading-relaxed tracking-tight italic">
                "Hoot! Hoot! Suas ideias hoje estão brilhantes. Onde vamos pousar primeiro?"
              </p>
              <div className="absolute top-full right-12 w-6 h-6 bg-slate-900 border-r border-b border-purple-500/30 rotate-45 -translate-y-3"></div>
            </motion.div>
          </AnimatePresence>
          <div className="cursor-help pointer-events-auto">
            <OwlMascot size="md" state={mascotState} />
          </div>
        </motion.div>
      </div>
    </div>
  );
}

const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(<Escrivus />);
}