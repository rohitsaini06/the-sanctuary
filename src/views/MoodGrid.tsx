import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { CloudRain, Sun, Wind, Flame, ArrowRight } from 'lucide-react';
import { storage } from '../services/storage';

const moods = [
  { id: 'anger', label: 'Anger', icon: Flame, color: 'text-red-400', bg: 'bg-red-400/10', ritual: 'fire-release', energy: 'High', stress: 'High', pleasantness: 'Unpleasant' },
  { id: 'joy', label: 'Joy', icon: Sun, color: 'text-primary', bg: 'bg-primary/10', ritual: 'channeling-river', energy: 'High', stress: 'Low', pleasantness: 'Pleasant' },
  { id: 'heaviness', label: 'Heaviness', icon: CloudRain, color: 'text-tertiary', bg: 'bg-tertiary/10', ritual: 'gentle-awakening', energy: 'Low', stress: 'High', pleasantness: 'Unpleasant' },
  { id: 'serenity', label: 'Serenity', icon: Wind, color: 'text-secondary', bg: 'bg-secondary/10', ritual: 'golden-hour', energy: 'Low', stress: 'Low', pleasantness: 'Pleasant' },
];

export default function MoodGrid() {
  const navigate = useNavigate();

  const handleMoodSelect = async (mood: typeof moods[0]) => {
    await storage.saveMoodAssessment({
      id: Date.now().toString(),
      date: new Date().toISOString(),
      energyLevel: mood.energy as any,
      stressLevel: mood.stress as any,
      pleasantness: mood.pleasantness as any,
      moodId: mood.id,
      ritualId: mood.ritual
    });
    navigate(`/ritual?type=${mood.ritual}`);
  };

  return (
    <div className="min-h-screen pt-32 pb-32 px-6 max-w-md mx-auto relative">
      <div className="reflection-orb w-64 h-64 top-40 left-10 opacity-30" />
      
      <div className="mb-12">
        <p className="font-label text-tertiary uppercase tracking-[0.2em] text-[10px] mb-2">Daily Check-in</p>
        <h2 className="font-headline italic text-5xl leading-tight text-on-surface">
          Where is your <span className="text-primary">spirit</span> resting today?
        </h2>
      </div>

      <div className="relative aspect-square grid grid-cols-2 grid-rows-2 gap-4">
        {/* Axis Labels */}
        <div className="absolute -top-8 left-1/2 -translate-x-1/2 font-label text-[10px] uppercase tracking-widest text-on-surface-variant">High Energy</div>
        <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 font-label text-[10px] uppercase tracking-widest text-on-surface-variant">Low Energy</div>
        <div className="absolute top-1/2 -left-12 -rotate-90 -translate-y-1/2 font-label text-[10px] uppercase tracking-widest text-on-surface-variant">Unpleasant</div>
        <div className="absolute top-1/2 -right-10 rotate-90 -translate-y-1/2 font-label text-[10px] uppercase tracking-widest text-on-surface-variant">Pleasant</div>

        {moods.map((mood) => (
          <motion.button
            key={mood.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleMoodSelect(mood)}
            className={`relative flex flex-col items-center justify-center rounded-2xl border border-outline-variant/10 transition-all duration-500 ${mood.bg} hover:border-primary/20 group`}
          >
            <mood.icon className={`w-10 h-10 ${mood.color} mb-2 transition-transform duration-500 group-hover:scale-110`} />
            <span className={`font-label text-[10px] uppercase tracking-tighter ${mood.color}`}>{mood.label}</span>
          </motion.button>
        ))}
      </div>

      <div className="mt-20 space-y-6">
        <div className="glass-panel p-6 rounded-2xl relative overflow-hidden">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="font-headline text-2xl italic">Reflection Note</h3>
              <p className="font-label text-[10px] text-on-surface-variant uppercase tracking-widest mt-1">Go deeper into your thoughts</p>
            </div>
          </div>
          <button 
            onClick={() => navigate('/journal')}
            className="w-full py-4 bg-surface-container-high rounded-2xl flex items-center justify-center gap-2 group mt-4"
          >
            <span className="font-label text-xs uppercase tracking-widest">Start Journaling</span>
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
}
