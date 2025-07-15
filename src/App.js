import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ICONS (inline SVGs for portability, inspired by lucide-react)
const UsersIcon = ({ className, ...props }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

const SparkleIcon = ({ className, ...props }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
    <path d="M12 2L9.5 9.5 2 12l7.5 2.5L12 22l2.5-7.5L22 12l-7.5-2.5L12 2z" />
    <path d="M5 2v4" /> <path d="M19 2v4" /> <path d="M5 20v-4" /> <path d="M19 20v-4" />
  </svg>
);

const LeafIcon = ({ className, ...props }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
    <path d="M11 20A7 7 0 0 1 4 13H2a10 10 0 0 0 10 10v-2a7 7 0 0 1-1-7h2a5 5 0 0 1 5 5v2h-2a5 5 0 0 1-5-5Z" />
    <path d="M2 13h2" />
  </svg>
);

const ShieldIcon = ({ className, ...props }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
);

const LockIcon = ({ className, ...props }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);

const WebcamIcon = ({ className, ...props }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
    <circle cx="12" cy="10" r="8" />
    <circle cx="12" cy="10" r="3" />
    <path d="M7 22h10" />
    <path d="M12 22V18" />
  </svg>
);

const MoonIcon = ({ className, ...props }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
  </svg>
);

const SunIcon = ({ className, ...props }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
    <circle cx="12" cy="12" r="5" />
    <line x1="12" y1="1" x2="12" y2="3" />
    <line x1="12" y1="21" x2="12" y2="23" />
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
    <line x1="1" y1="12" x2="3" y2="12" />
    <line x1="21" y1="12" x2="23" y2="12" />
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
  </svg>
);

const ChevronLeftIcon = ({ className, ...props }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
    <polyline points="15 18 9 12 15 6" />
  </svg>
);

const ChevronRightIcon = ({ className, ...props }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
    <polyline points="9 18 15 12 9 6" />
  </svg>
);


// --- SHARED COMPONENTS ---

const glassCardStyle = "bg-slate-800/50 backdrop-blur-md border border-indigo-400/20 shadow-2xl rounded-2xl";

const useCountUp = (end, duration = 2000) => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const endValue = typeof end === 'number' ? end : parseFloat(end.toString().replace(/,/g, ''));
    let start = 0;
    if (start === endValue) return;

    const totalMilSecDur = duration;
    const increment = endValue > 0 ? 1 : -1;
    const stepValue = Math.abs(endValue / (totalMilSecDur / 10));
    const timer = setInterval(() => {
      start += stepValue * increment;
      if (increment > 0 ? start >= endValue : start <= endValue) {
        start = endValue;
        clearInterval(timer);
      }
      setCount(start);
    }, 10);

    return () => clearInterval(timer);
  }, [end, duration]);

  return Number.isInteger(end) ? Math.round(count).toLocaleString() : count.toFixed(1);
};

const MoodSparkLine = ({ data }) => (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} className="w-full h-12 px-4">
    <svg viewBox="0 0 100 25" className="w-full h-full" preserveAspectRatio="none">
      <defs>
        <linearGradient id="sparkline-gradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#34d399" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#34d399" stopOpacity="0" />
        </linearGradient>
      </defs>
      <motion.path
        d={`M 0 ${25 - data[0] / 4} ` + data.map((p, i) => `L ${i * (100 / (data.length - 1))} ${25 - p / 4}`).join(' ')}
        fill="none"
        stroke="#34d399"
        strokeWidth="1"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.5 }}
      />
      <motion.path
        d={`M 0 25 ` + `L 0 ${25 - data[0] / 4} ` + data.map((p, i) => `L ${i * (100 / (data.length - 1))} ${25 - p / 4}`).join(' ') + ` L 100 25 Z`}
        fill="url(#sparkline-gradient)"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 1 }}
      />
    </svg>
  </motion.div>
);

const AgentCard = ({ agent, variant = 'grid' }) => {
  const moodColor = (score) => score > 70 ? 'text-emerald-400' : score > 40 ? 'text-amber-400' : 'text-rose-400';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.5 }}
      whileHover={{ scale: 1.05 }}
      transition={{ duration: 0.3 }}
      className="h-full"
    >
      <div className={`${glassCardStyle} cursor-pointer overflow-hidden ${variant === 'featured' ? 'h-96' : 'h-80'} h-full flex flex-col`}>
        <img
          src={agent.avatar}
          alt={`${agent.name} avatar`}
          className={`w-full object-cover ${variant === 'featured' ? 'h-52' : 'h-40'}`}
          onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/600x400/0f172a/38bdf8?text=Agent'; }}
        />
        <div className="p-4 flex flex-col justify-between flex-grow">
          <div>
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-extrabold text-white">{agent.name}</h3>
                <p className="text-sm text-gray-400">{agent.focus} Agent</p>
              </div>
              <span className={`font-mono text-3xl font-bold ${moodColor(agent.efficacyScore)}`}>{agent.efficacyScore}%</span>
            </div>
          </div>
          {variant !== 'compact' && <MoodSparkLine data={agent.moodTrend} />}
        </div>
      </div>
    </motion.div>
  );
};


// --- PAGE SECTIONS ---

const Header = ({ isDarkMode, toggleDarkMode }) => (
  <header className="fixed top-0 left-0 right-0 z-50 bg-slate-900/60 backdrop-blur-lg">
    <nav className="container mx-auto px-6 py-3 flex justify-between items-center">
      <h1 className="text-2xl font-bold text-white">Moods.AI</h1>
      <div className="hidden md:flex items-center space-x-6 text-gray-300">
        <a href="#agents" className="hover:text-white transition-colors">Agents</a>
        <a href="#insights" className="hover:text-white transition-colors">Insights</a>
        <a href="#reviews" className="hover:text-white transition-colors">Reviews</a>
        <a href="#community" className="hover:text-white transition-colors">Community</a>
        <a href="#blog" className="hover:text-white transition-colors">Blog</a>
      </div>
      <div className="flex items-center space-x-4">
        <button
          onClick={toggleDarkMode}
          className="p-2 text-gray-400 hover:text-white transition-colors"
          aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
        >
          {isDarkMode ? <SunIcon className="h-5 w-5" /> : <MoonIcon className="h-5 w-5" />}
        </button>
        <button className="hidden md:block px-4 py-2 text-sm font-semibold text-white bg-indigo-500/50 border border-indigo-400 rounded-lg hover:bg-indigo-500 transition-colors">
          Connect Wallet
        </button>
      </div>
    </nav>
  </header>
);

const HeroSection = ({ onCTAClick }) => (
  <section className="relative h-screen flex items-center justify-center text-center overflow-hidden">
    <div className="absolute inset-0 bg-cover bg-center z-0" style={{ backgroundImage: "url('https://placehold.co/1920x1080/020617/0f172a?text=.')" }}>
             <div className="absolute inset-0 bg-gradient-to-br from-cyan-900/50 via-indigo-900/50 to-purple-900/50"></div>
    </div>
    <div className="absolute inset-0 bg-slate-900/60 z-10"></div>
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1 }}
      className="relative z-20 px-4"
    >
      <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-white tracking-tight">
        Unleash Your Mood Agents
      </h1>
      <p className="mt-4 max-w-2xl mx-auto text-lg md:text-xl text-gray-300">
        AI companions for proactive emotional flourishing. Sustainable, ethical, and yours forever.
      </p>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onCTAClick}
        className="mt-8 px-8 py-4 text-lg font-bold text-white bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl shadow-lg transition-all duration-300 ease-in-out"
      >
        Create Your First Agent
      </motion.button>
    </motion.div>
  </section>
);

const CredibilityRow = () => {
  const agentsDeployed = useCountUp(1248903);
  const moodBoosts = useCountUp(4832011);
  const co2Saved = useCountUp(9.7, 3000);

  return (
    <section className="py-12 bg-slate-900">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center text-center"
        >
          <div className="flex justify-center">
            <p className="text-gray-400 font-semibold">Fitbit</p>
          </div>
          <div className="flex justify-center">
            <p className="text-gray-400 font-semibold text-2xl">Meta</p>
          </div>
          <div className="flex justify-center">
            <p className="text-gray-400 font-semibold">Hugging Face</p>
          </div>
          <div className="flex justify-center">
            <p className="text-gray-400 font-semibold">OpenAI</p>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 text-white"
        >
          <div className="text-center">
            <UsersIcon className="mx-auto h-8 w-8 text-indigo-400 mb-2" aria-hidden="true" />
            <p className="text-3xl font-bold font-mono">{agentsDeployed}</p>
            <p className="text-gray-400">Agents Deployed</p>
          </div>
          <div className="text-center">
            <SparkleIcon className="mx-auto h-8 w-8 text-purple-400 mb-2" aria-hidden="true" />
            <p className="text-3xl font-bold font-mono">{moodBoosts}</p>
            <p className="text-gray-400">Mood Boosts Delivered</p>
          </div>
          <div className="text-center">
            <LeafIcon className="mx-auto h-8 w-8 text-emerald-400 mb-2" aria-hidden="true" />
            <p className="text-3xl font-bold font-mono">{co2Saved} Tons</p>
            <p className="text-gray-400">CO₂ Saved</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

const OnboardingModal = ({ isVisible, onClose }) => {
  const [step, setStep] = useState(1);

  useEffect(() => {
    const handleEsc = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  const ProgressBar = () => (
    <div className="w-full bg-slate-700 rounded-full h-2.5 mb-8">
      <motion.div
        className="bg-gradient-to-r from-indigo-500 to-purple-500 h-2.5 rounded-full"
        initial={{ width: 0 }}
        animate={{ width: `${(step / 4) * 100}%` }}
        transition={{ duration: 0.5, ease: 'easeInOut' }}
      />
    </div>
  );

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className={`${glassCardStyle} w-full max-w-2xl p-8 rounded-2xl relative`}
            onClick={(e) => e.stopPropagation()}
          >
            <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white text-2xl" aria-label="Close modal">×</button>
            <h3 className="text-2xl font-bold text-white text-center mb-4">Meet the Agent Designed for You</h3>
            <ProgressBar />
            
            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ x: 50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -50, opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                {step === 1 && (
                  <div className="text-center">
                    <h4 className="text-xl text-white mb-2">Step 1: Quick Mood Scan</h4>
                    <p className="text-gray-400 mb-6">Let's check in. Allow secure, one-time camera access for a mood snapshot.</p>
                    <button onClick={() => setStep(2)} className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 rounded-lg text-white font-semibold transition-colors flex items-center justify-center space-x-2">
                      <WebcamIcon className="h-5 w-5" aria-hidden="true" />
                      <span>Scan with Camera</span>
                    </button>
                    <button onClick={() => setStep(2)} className="mt-2 text-gray-400 hover:text-white">or skip for now</button>
                  </div>
                )}
                {step === 2 && (
                  <div className="text-center">
                    <h4 className="text-xl text-white mb-2">Step 2: Connect Your World</h4>
                    <p className="text-gray-400 mb-6">Link biometrics or calendars for deeper insights.</p>
                    <div className="space-y-3">
                      <button className="w-full py-3 bg-slate-700 hover:bg-slate-600 rounded-lg text-white font-semibold transition-colors">Connect Fitbit</button>
                      <button className="w-full py-3 bg-slate-700 hover:bg-slate-600 rounded-lg text-white font-semibold transition-colors">Connect Google Calendar</button>
                    </div>
                    <button onClick={() => setStep(3)} className="mt-6 w-full py-3 bg-indigo-600 hover:bg-indigo-700 rounded-lg text-white font-semibold transition-colors">Continue</button>
                  </div>
                )}
                {step === 3 && (
                  <div className="text-left">
                    <h4 className="text-xl text-white mb-4 text-center">Step 3: Define Your Focus</h4>
                    <div className="space-y-6">
                      <div>
                        <label className="block text-gray-300 mb-2">Focus: Stress Relief vs. Productivity</label>
                        <input type="range" min="0" max="100" defaultValue="50" className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer range-thumb-indigo" />
                      </div>
                      <div>
                        <label className="block text-gray-300 mb-2 flex items-center"><LeafIcon className="h-5 w-5 mr-2 text-emerald-400" aria-hidden="true" /> Sustainability: Low vs. High Priority</label>
                        <input type="range" min="0" max="100" defaultValue="50" className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer range-thumb-emerald" />
                      </div>
                    </div>
                    <button onClick={() => setStep(4)} className="mt-8 w-full py-3 bg-indigo-600 hover:bg-indigo-700 rounded-lg text-white font-semibold transition-colors">Continue</button>
                  </div>
                )}
                {step === 4 && (
                  <div className="text-center">
                    <h4 className="text-xl text-white mb-4">Step 4: Preview Your Companion</h4>
                    <div className="w-full h-48 bg-slate-900 rounded-lg flex items-center justify-center mb-6 overflow-hidden">
                       <p className="text-gray-500">[AR Preview Embed]</p>
                    </div>
                    <button onClick={onClose} className="w-full py-3 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg text-white font-bold transition-colors">Start Creating</button>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const FeaturedAgentsSection = () => {
    const scrollContainerRef = useRef(null);
    const featuredAgents = [
        { name: 'Calm Catalyst', focus: 'Anxiety & Stress Relief', efficacyScore: 92, avatar: 'https://picsum.photos/seed/calm/600/400', moodTrend: [20, 25, 40, 35, 50, 65, 80, 75, 90] },
        { name: 'Eco Energizer', focus: 'Motivation & Sustainable Habits', efficacyScore: 88, avatar: 'https://picsum.photos/seed/eco/600/400', moodTrend: [40, 45, 42, 55, 60, 75, 70, 85, 88] },
        { name: 'Focus Flow', focus: 'Productivity & Deep Work', efficacyScore: 90, avatar: 'https://picsum.photos/seed/focus/600/400', moodTrend: [30, 40, 60, 55, 70, 80, 75, 88, 90] },
        { name: 'Joy Amplifier', focus: 'Happiness & Social Connections', efficacyScore: 85, avatar: 'https://picsum.photos/seed/joy/600/400', moodTrend: [50, 55, 60, 70, 75, 80, 85, 90, 95] },
        { name: 'Sleep Weaver', focus: 'Rest & Recovery', efficacyScore: 91, avatar: 'https://picsum.photos/seed/sleep/600/400', moodTrend: [10, 20, 35, 50, 60, 70, 80, 85, 91] },
    ];

    const scroll = (direction) => {
        if (scrollContainerRef.current) {
            const { current } = scrollContainerRef;
            const scrollAmount = current.offsetWidth * 0.8; // Scroll by 80% of the container width
            current.scrollBy({ left: direction * scrollAmount, behavior: 'smooth' });
        }
    };

    return (
        <section className="py-20 bg-slate-900/50" id="agents">
            <div className="container mx-auto px-6">
                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-3xl md:text-4xl font-bold text-white text-center mb-12"
                >
                    Discover Curated Mood Agents
                </motion.h2>
                <div className="relative">
                    <div ref={scrollContainerRef} className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide -mx-4 px-4 py-4 space-x-8">
                        {featuredAgents.map((agent) => (
                            <div className="flex-none w-full sm:w-1/2 lg:w-1/3 snap-center" key={agent.name}>
                                <AgentCard agent={agent} variant="featured" />
                            </div>
                        ))}
                    </div>
                    <button onClick={() => scroll(-1)} className="absolute top-1/2 -translate-y-1/2 left-0 md:-left-4 bg-slate-700/50 p-2 rounded-full text-white hover:bg-slate-600 transition-colors z-10" aria-label="Previous Agent">
                        <ChevronLeftIcon className="h-6 w-6" />
                    </button>
                    <button onClick={() => scroll(1)} className="absolute top-1/2 -translate-y-1/2 right-0 md:-right-4 bg-slate-700/50 p-2 rounded-full text-white hover:bg-slate-600 transition-colors z-10" aria-label="Next Agent">
                        <ChevronRightIcon className="h-6 w-6" />
                    </button>
                </div>
            </div>
        </section>
    );
};

const TrustSection = () => (
  <section className="py-20" id="insights">
    <div className="container mx-auto px-6">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-3xl md:text-4xl font-bold text-white text-center mb-4"
      >
        Your Emotions, Your Data, Your Control
      </motion.h2>
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.1 }}
        className="text-lg text-gray-400 text-center max-w-3xl mx-auto mb-12"
      >
        We believe in radical transparency. Here's how we protect your emotional sovereignty.
      </motion.p>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.2 }}
        className="grid lg:grid-cols-2 gap-12 items-center"
      >
        <div className="space-y-4">
          <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="flex items-center space-x-4">
            <div className="flex-shrink-0 w-16 h-16 rounded-full bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center">
              <WebcamIcon className="h-8 w-8 text-white" aria-hidden="true" />
            </div>
            <div>
              <h4 className="text-xl font-bold text-white">1. Inputs</h4>
              <p className="text-gray-400">Your raw, multimodal data is captured locally on your device.</p>
            </div>
          </motion.div>
          <div className="h-12 w-px bg-indigo-400/30 ml-8" />
          <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="flex items-center space-x-4">
            <div className="flex-shrink-0 w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center">
              <ShieldIcon className="h-8 w-8 text-white" aria-hidden="true" />
            </div>
            <div>
              <h4 className="text-xl font-bold text-white">2. Bias Audit</h4>
              <p className="text-gray-400">Our AI checks for fairness and accuracy before any analysis.</p>
            </div>
          </motion.div>
          <div className="h-12 w-px bg-indigo-400/30 ml-8" />
          <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }} className="flex items-center space-x-4">
            <div className="flex-shrink-0 w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
              <LockIcon className="h-8 w-8 text-white" aria-hidden="true" />
            </div>
            <div>
              <h4 className="text-xl font-bold text-white">3. Blockchain Vault</h4>
              <p className="text-gray-400">Your data is encrypted and stored in a vault only you can access.</p>
            </div>
          </motion.div>
          <div className="h-12 w-px bg-indigo-400/30 ml-8" />
          <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: 0.3 }} className="flex items-center space-x-4">
            <div className="flex-shrink-0 w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
              <SparkleIcon className="h-8 w-8 text-white" aria-hidden="true" />
            </div>
            <div>
              <h4 className="text-xl font-bold text-white">4. Agentic Outputs</h4>
              <p className="text-gray-400">Your agent delivers personalized, proactive suggestions.</p>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className={`${glassCardStyle} p-8`}
        >
          <h4 className="text-xl font-bold text-white mb-6">What our community says</h4>
          <div className="space-y-6">
            <div>
              <p className="text-gray-300 italic">"My agent predicted my burnout and suggested a low-carbon retreat—life-changing!"</p>
              <p className="mt-2 text-right font-semibold text-indigo-400">— Alex R., verified user</p>
            </div>
            <div className="border-t border-indigo-400/20" />
            <div>
              <p className="text-gray-300 italic">"The transparency around data is why I signed up. I finally feel in control of my digital self."</p>
              <p className="mt-2 text-right font-semibold text-indigo-400">— Samira K.</p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  </section>
);

const VisionarySection = () => (
  <section className="py-20 bg-slate-900/50" id="community">
    <div className="container mx-auto px-6">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-3xl md:text-4xl font-bold text-white text-center mb-12"
      >
        Join the Affective Revolution
      </motion.h2>
      <div className="relative">
        <div className="absolute left-1/2 -translate-x-1/2 h-full w-0.5 bg-indigo-400/30 hidden md:block" />
        
        <div className="relative space-y-12 md:space-y-16">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="md:flex justify-center items-center"
          >
            <div className="md:w-5/12 md:text-right md:pr-8">
              <h4 className="text-xl font-bold text-white">Ethical Data Foundations</h4>
              <p className="text-gray-400">Building trust with transparent, user-owned data vaults.</p>
            </div>
            <div className="w-16 h-16 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold z-10 mx-auto md:mx-0 my-4 md:my-0">2024</div>
            <div className="md:w-5/12" />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="md:flex justify-center items-center"
          >
            <div className="md:w-5/12 hidden md:block" />
            <div className="w-16 h-16 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold z-10 mx-auto md:mx-0 my-4 md:my-0 order-first md:order-none">2025</div>
            <div className="md:w-5/12 md:text-left md:pl-8">
              <h4 className="text-xl font-bold text-white">Agentic AI Companions</h4>
              <p className="text-gray-400">Launching proactive agents that enhance daily wellbeing.</p>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="md:flex justify-center items-center"
          >
            <div className="md:w-5/12 md:text-right md:pr-8">
              <h4 className="text-xl font-bold text-white">Multimodal Empathy</h4>
              <p className="text-gray-400">Agents begin to understand emotion from voice, text, and visuals.</p>
            </div>
            <div className="w-16 h-16 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold z-10 mx-auto md:mx-0 my-4 md:my-0">2026</div>
            <div className="md:w-5/12" />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="md:flex justify-center items-center"
          >
            <div className="md:w-5/12 hidden md:block" />
            <div className="w-16 h-16 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold z-10 mx-auto md:mx-0 my-4 md:my-0 order-first md:order-none">2027</div>
            <div className="md:w-5/12 md:text-left md:pl-8">
              <h4 className="text-xl font-bold text-white">Decentralized Affective Economies</h4>
              <p className="text-gray-400">A community-driven marketplace for emotional wellness tools.</p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  </section>
);

const Footer = () => (
  <footer className="bg-slate-900 text-gray-400">
    <div className="container mx-auto px-6 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8"
      >
        <div className="col-span-full lg:col-span-1">
          <h2 className="text-2xl font-bold text-white">Moods.AI</h2>
          <p className="mt-2 text-sm">AI for Emotional Flourishing.</p>
        </div>
        <div>
          <h5 className="font-bold text-white">Platform</h5>
          <nav className="mt-4 space-y-2">
            <a href="#agents" className="block hover:text-white">Agents</a>
            <a href="#insights" className="block hover:text-white">Insights</a>
            <a href="#marketplace" className="block hover:text-white">Marketplace</a>
          </nav>
        </div>
        <div>
          <h5 className="font-bold text-white">Company</h5>
          <nav className="mt-4 space-y-2">
            <a href="#blog" className="block hover:text-white">Blog</a>
            <a href="#about" className="block hover:text-white">About Us</a>
            <a href="#careers" className="block hover:text-white">Careers</a>
          </nav>
        </div>
        <div>
          <h5 className="font-bold text-white">Legal</h5>
          <nav className="mt-4 space-y-2">
            <a href="#privacy" className="block hover:text-white">Privacy Policy</a>
            <a href="#terms" className="block hover:text-white">Terms of Service</a>
          </nav>
        </div>
        <div className="col-span-2 md:col-span-1">
          <h5 className="font-bold text-white">Settings</h5>
          <div className="mt-4 flex items-center space-x-2">
            <input type="checkbox" id="eco-mode" className="toggle-checkbox" aria-label="Toggle eco mode" />
            <label htmlFor="eco-mode">Eco Mode</label>
          </div>
          <div className="mt-4 flex items-center space-x-2">
            <LeafIcon className="h-5 w-5 text-emerald-500" aria-hidden="true" />
            <p>Carbon-Neutral Hosting</p>
          </div>
        </div>
      </motion.div>
      <div className="mt-12 border-t border-gray-800 pt-8 text-center text-sm">
        <p>© {new Date().getFullYear()} Moods.AI. All rights reserved.</p>
      </div>
    </div>
  </footer>
);

// --- MAIN APP COMPONENT ---

export default function App() {
  const [isModalVisible, setModalVisible] = useState(false);
  const [isDarkMode, setDarkMode] = useState(true);

  const toggleDarkMode = () => setDarkMode(!isDarkMode);

  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      .range-thumb-indigo::-webkit-slider-thumb { -webkit-appearance: none; appearance: none; width: 20px; height: 20px; background: #6366f1; cursor: pointer; border-radius: 50%; }
      .range-thumb-indigo::-moz-range-thumb { width: 20px; height: 20px; background: #6366f1; cursor: pointer; border-radius: 50%; border: 0; }
      .range-thumb-emerald::-webkit-slider-thumb { -webkit-appearance: none; appearance: none; width: 20px; height: 20px; background: #34d399; cursor: pointer; border-radius: 50%; }
      .range-thumb-emerald::-moz-range-thumb { width: 20px; height: 20px; background: #34d399; cursor: pointer; border-radius: 50%; border: 0; }
      .toggle-checkbox { appearance: none; width: 3.5rem; height: 1.75rem; background-color: #4b5563; border-radius: 9999px; position: relative; cursor: pointer; transition: background-color 0.2s ease-in-out; }
      .toggle-checkbox::before { content: ''; position: absolute; width: 1.25rem; height: 1.25rem; background-color: white; border-radius: 50%; top: 0.25rem; left: 0.25rem; transition: transform 0.2s ease-in-out; }
      .toggle-checkbox:checked { background-color: #34d399; }
      .toggle-checkbox:checked::before { transform: translateX(1.75rem); }
      body { transition: background-color 0.3s ease; }
      .scrollbar-hide::-webkit-scrollbar { display: none; }
      .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
    `;
    document.head.appendChild(style);

    document.body.style.backgroundColor = isDarkMode ? '#0f172a' : '#f3f4f6';
    document.body.style.color = isDarkMode ? '#d1d5db' : '#1f2937';

    return () => {
      if (style.parentNode) style.parentNode.removeChild(style);
    };
  }, [isDarkMode]);

  return (
    <div className={`font-sans leading-normal tracking-normal ${isDarkMode ? 'dark' : 'light-mode'}`}>
      <Header isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />
      <main>
        <HeroSection onCTAClick={() => setModalVisible(true)} />
        <CredibilityRow />
        <FeaturedAgentsSection />
        <TrustSection />
        <VisionarySection />
      </main>
      <Footer />
      <OnboardingModal isVisible={isModalVisible} onClose={() => setModalVisible(false)} />
    </div>
  );
}
