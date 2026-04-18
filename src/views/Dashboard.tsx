import { motion } from 'motion/react';
import { Settings, Plus, Edit3, Archive, Sparkles, Leaf } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { storage, JournalEntry } from '../services/storage';
import { useEffect, useState } from 'react';
import { RITUALS, RitualType } from './Ritual';

export default function Dashboard() {
  const navigate = useNavigate();
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [moods, setMoods] = useState<any[]>([]);

  useEffect(() => {
    const loadData = async () => {
      const e = await storage.getEntries();
      const m = await storage.getMoodHistory();
      setEntries(e.slice(0, 3));
      setMoods(m.slice(0, 7));
    };
    loadData();
  }, []);

  const lastRitualId = moods.length > 0 ? moods[0].ritualId as RitualType : null;
  const lastRitual = lastRitualId ? (RITUALS[lastRitualId] || RITUALS['fire-release']) : null;

  return (
    <div className="min-h-screen pt-24 pb-32 px-6 max-w-md mx-auto space-y-12 relative">
      <div className="reflection-orb w-64 h-64 top-40 left-10 opacity-20" />

      {/* Welcome Section */}
      <section className="space-y-2">
        <span className="font-label text-xs uppercase tracking-[0.2em] text-on-surface-variant">Inner Weather</span>
        <h2 className="text-4xl font-headline italic leading-tight">Gently blooming in the quiet hours.</h2>
      </section>

      {/* Growth Map Section */}
      <section className="space-y-6">
        <div className="flex justify-between items-end">
          <h3 className="font-headline text-2xl">Growth Map</h3>
          <span className="font-label text-[10px] uppercase tracking-widest text-tertiary">Milestones Active</span>
        </div>
        <div className="relative glass-panel rounded-[2rem] p-8 aspect-[4/5] overflow-hidden">
          {/* Decorative Path Background */}
          <svg className="absolute inset-0 w-full h-full opacity-20" viewBox="0 0 200 300" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M40 260C60 220 120 240 140 200C160 160 100 140 80 100C60 60 120 80 140 40" stroke="url(#paint0_linear)" strokeWidth="2" strokeLinecap="round" />
            <defs>
              <linearGradient id="paint0_linear" x1="40" y1="260" x2="140" y2="40" gradientUnits="userSpaceOnUse">
                <stop stopColor="#ffac52" />
                <stop offset="1" stopColor="#aef8fc" />
              </linearGradient>
            </defs>
          </svg>
          
          <div className="relative h-full flex flex-col justify-between">
            {entries.length > 0 ? entries.map((entry, index) => (
              <motion.div 
                key={entry.id}
                initial={{ opacity: 0, x: index % 2 === 0 ? 20 : -20 }}
                animate={{ opacity: 1, x: 0 }}
                className={`flex items-center gap-4 ${index % 2 === 0 ? 'self-end translate-x-4' : 'self-start flex-row-reverse -translate-x-4'}`}
              >
                <div className="bg-surface-container-high p-4 rounded-2xl shadow-xl max-w-[140px]">
                  <p className={`font-label text-[10px] mb-1 uppercase ${index === 0 ? 'text-tertiary' : index === 1 ? 'text-secondary' : 'text-primary'}`}>
                    {index === 0 ? 'Today' : index === 1 ? 'Yesterday' : new Date(entry.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                  </p>
                  <p className="text-sm font-body leading-snug line-clamp-2">{entry.prompt}</p>
                </div>
                <div className={`w-4 h-4 rounded-full border-4 border-surface-container-high shadow-[0_0_15px_rgba(0,0,0,0.5)] ${index === 0 ? 'bg-tertiary shadow-tertiary/50' : index === 1 ? 'bg-secondary shadow-secondary/50' : 'bg-primary shadow-primary/50'}`} />
              </motion.div>
            )) : (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-40">
                <Leaf size={40} className="text-primary" />
                <p className="font-body italic text-sm">Your map is waiting for your first reflection.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Vitality Vessel Section */}
      <section className="space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="font-headline text-2xl italic">Vitality Vessel</h3>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
            <span className="font-label text-[10px] uppercase tracking-widest">State: Flourishing</span>
          </div>
        </div>
        <div className="relative glass-panel rounded-[2rem] p-10 flex flex-col items-center justify-center min-h-[320px] group">
          <div className="absolute inset-0 bg-gradient-to-tr from-secondary/10 via-transparent to-tertiary/10 rounded-[2rem]" />
          <div className="relative w-48 h-48 flex items-center justify-center">
            <motion.div 
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute w-32 h-32 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 blur-3xl opacity-50" 
            />
            <div className="relative z-10 flex flex-col items-center">
              <div className="flex gap-4 mb-2">
                <Leaf className="text-tertiary w-12 h-12" fill="currentColor" />
                <Sparkles className="text-secondary w-10 h-10 -scale-x-100" fill="currentColor" />
              </div>
              <div className="w-16 h-20 bg-surface-container-high rounded-t-full border-x border-t border-outline-variant/30 flex items-end justify-center p-2">
                <motion.div 
                  animate={{ height: ['40%', '60%', '40%'] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="w-full bg-gradient-to-t from-primary/40 to-transparent rounded-sm" 
                />
              </div>
            </div>
          </div>
          <div className="mt-8 text-center space-y-2">
            <p className="font-body text-on-surface-variant text-sm px-4">Your neon fern grows taller with every moment of mindful presence.</p>
            <button className="font-label text-[10px] uppercase tracking-[0.2em] text-primary hover:text-tertiary transition-colors">Tend to your essence</button>
          </div>
        </div>
      </section>

      {/* Reflection Bento Grid */}
      <section className="grid grid-cols-2 gap-4">
        <div onClick={() => navigate('/mood-grid')} className="col-span-2 glass-panel p-6 rounded-[1.5rem] flex flex-col justify-between h-40 group cursor-pointer">
          <Edit3 className="text-secondary group-hover:scale-110 transition-transform" />
          <div>
            <h4 className="font-headline text-xl italic">Evening Reflection</h4>
            <p className="font-body text-xs text-on-surface-variant">The shadows are long. Capture the light.</p>
          </div>
        </div>
        <div onClick={() => navigate('/vault')} className="bg-surface-container-low p-6 rounded-[1.5rem] flex flex-col justify-between aspect-square group cursor-pointer">
          <Archive className="text-tertiary group-hover:scale-110 transition-transform" />
          <p className="font-label text-[10px] uppercase tracking-widest">The Vault</p>
        </div>
        <div onClick={() => navigate(lastRitual ? `/ritual?type=${lastRitual.id}` : '/ritual')} className="bg-surface-container-low p-6 rounded-[1.5rem] flex flex-col justify-between aspect-square group cursor-pointer">
          {lastRitual ? (
            <lastRitual.icon className={`${lastRitual.color.replace('bg-', 'text-')} group-hover:scale-110 transition-transform`} />
          ) : (
            <Sparkles className="text-primary group-hover:scale-110 transition-transform" />
          )}
          <div>
            <p className="font-label text-[10px] uppercase tracking-widest">{lastRitual ? 'Suggested Ritual' : 'Rituals'}</p>
            {lastRitual && <p className="font-headline italic text-sm mt-1">{lastRitual.title}</p>}
          </div>
        </div>
      </section>

      {/* Floating Action Button */}
      <motion.button 
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => navigate('/journal')}
        className="fixed right-6 bottom-28 w-14 h-14 bg-primary text-on-primary rounded-2xl shadow-[0_8px_32px_rgba(255,172,82,0.3)] flex items-center justify-center z-40"
      >
        <Plus size={24} />
      </motion.button>
    </div>
  );
}
