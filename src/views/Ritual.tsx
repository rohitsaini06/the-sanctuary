import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Wind, Zap, Heart, Coffee, Move, Sparkles, Moon, Activity, Flame, Sun } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';

export type RitualType = 'fire-release' | 'earth-rooting' | 'gentle-awakening' | 'inner-flame' | 'golden-hour' | 'tea-ceremony' | 'channeling-river' | 'clearing-canvas' | 'twilight-descent' | 'closing-circle';

interface RitualConfig {
  id: RitualType;
  title: string;
  subtitle: string;
  description: string;
  color: string;
  icon: any;
  duration: number; // in seconds
  phases?: { name: string; duration: number; text: string }[];
}

export const RITUALS: Record<RitualType, RitualConfig> = {
  'fire-release': {
    id: 'fire-release',
    title: 'The Fire Release',
    subtitle: 'Cooling the Flames',
    description: 'Visualize gathering your tension and exhaling it as dark smoke, making room for cool, calming light.',
    color: 'bg-red-500',
    icon: Flame,
    duration: 120,
    phases: [
      { name: 'gather', duration: 4, text: 'Inhale: Gather the tension' },
      { name: 'hold', duration: 4, text: 'Hold: Acknowledge the heat' },
      { name: 'release', duration: 6, text: 'Exhale: Release the smoke' }
    ]
  },
  'earth-rooting': {
    id: 'earth-rooting',
    title: 'Rooting to the Earth',
    subtitle: 'Finding Your Center',
    description: 'Focus on your physical connection to the ground. Imagine roots extending from your body deep into the earth.',
    color: 'bg-red-400',
    icon: Activity,
    duration: 120,
    phases: [
      { name: 'feet', duration: 5, text: 'Focus on your feet' },
      { name: 'gravity', duration: 5, text: 'Feel the pull of gravity' },
      { name: 'breathe', duration: 5, text: 'Breathe in stability' }
    ]
  },
  'gentle-awakening': {
    id: 'gentle-awakening',
    title: 'The Gentle Awakening',
    subtitle: 'Thawing the Frost',
    description: 'Acknowledge the heaviness without judgment, and introduce tiny, deliberate movements to thaw the stillness.',
    color: 'bg-blue-500',
    icon: Wind,
    duration: 120,
    phases: [
      { name: 'notice', duration: 5, text: 'Notice the heaviness' },
      { name: 'move', duration: 5, text: 'Wiggle fingers and toes' },
      { name: 'sigh', duration: 5, text: 'Take a deep, releasing sigh' }
    ]
  },
  'inner-flame': {
    id: 'inner-flame',
    title: 'Lighting the Inner Flame',
    subtitle: 'Kindling Warmth',
    description: 'Find a tiny spark of warmth within you. Nurture it with your breath until it expands to fill your chest.',
    color: 'bg-blue-400',
    icon: Zap,
    duration: 120,
    phases: [
      { name: 'spark', duration: 5, text: 'Locate a spark of warmth' },
      { name: 'nurture', duration: 5, text: 'Nurture it with breath' },
      { name: 'expand', duration: 5, text: 'Feel the warmth expand' }
    ]
  },
  'golden-hour': {
    id: 'golden-hour',
    title: 'The Golden Hour',
    subtitle: 'Savoring Peace',
    description: 'Recall a moment of profound peace or joy. Anchor that golden feeling into your physical body.',
    color: 'bg-green-500',
    icon: Sun,
    duration: 120,
    phases: [
      { name: 'recall', duration: 5, text: 'Recall a peaceful memory' },
      { name: 'feel', duration: 5, text: 'Feel it in your body' },
      { name: 'anchor', duration: 5, text: 'Anchor this golden state' }
    ]
  },
  'tea-ceremony': {
    id: 'tea-ceremony',
    title: 'The Tea Ceremony',
    subtitle: 'Sacred Presence',
    description: 'Elevate a simple act—like drinking water or tea—into a moment of profound, sensory presence.',
    color: 'bg-green-400',
    icon: Coffee,
    duration: 120,
    phases: [
      { name: 'warmth', duration: 5, text: 'Feel the warmth in your hands' },
      { name: 'aroma', duration: 5, text: 'Inhale the aroma deeply' },
      { name: 'taste', duration: 5, text: 'Savor the taste slowly' }
    ]
  },
  'channeling-river': {
    id: 'channeling-river',
    title: 'Channeling the River',
    subtitle: 'Directing Flow',
    description: 'You have abundant energy. Visualize it as a rushing river, and gently carve a channel to direct it toward your purpose.',
    color: 'bg-yellow-500',
    icon: Move,
    duration: 120,
    phases: [
      { name: 'feel', duration: 5, text: 'Feel the rushing energy' },
      { name: 'direct', duration: 5, text: 'Direct it to a single purpose' },
      { name: 'flow', duration: 5, text: 'Flow smoothly into action' }
    ]
  },
  'clearing-canvas': {
    id: 'clearing-canvas',
    title: 'Clearing the Canvas',
    subtitle: 'Creating Space',
    description: 'Prepare your physical and mental space for creative flow. Release the unnecessary to make room for the new.',
    color: 'bg-yellow-400',
    icon: Sparkles,
    duration: 120,
    phases: [
      { name: 'observe', duration: 5, text: 'Observe the mental clutter' },
      { name: 'release', duration: 5, text: 'Release what is unnecessary' },
      { name: 'space', duration: 5, text: 'Embrace the open space' }
    ]
  },
  'twilight-descent': {
    id: 'twilight-descent',
    title: 'The Twilight Descent',
    subtitle: 'Welcoming the Night',
    description: 'A progressive relaxation to transition from the day\'s activity into the deep, restorative stillness of the night.',
    color: 'bg-indigo-500',
    icon: Moon,
    duration: 120,
    phases: [
      { name: 'release', duration: 5, text: 'Release the day\'s events' },
      { name: 'soften', duration: 5, text: 'Soften your muscles' },
      { name: 'drift', duration: 5, text: 'Drift into stillness' }
    ]
  },
  'closing-circle': {
    id: 'closing-circle',
    title: 'The Closing Circle',
    subtitle: 'Ending the Chapter',
    description: 'A ritual to officially end the day. Forgive yourself for what was left undone, and close the chapter.',
    color: 'bg-purple-500',
    icon: Heart,
    duration: 120,
    phases: [
      { name: 'forgive', duration: 5, text: 'Forgive what is undone' },
      { name: 'close', duration: 5, text: 'Close today\'s chapter' },
      { name: 'rest', duration: 5, text: 'Prepare for deep rest' }
    ]
  }
};

export default function Ritual() {
  const [searchParams] = useSearchParams();
  const ritualId = (searchParams.get('type') as RitualType) || 'fire-release';
  const config = RITUALS[ritualId] || RITUALS['fire-release'];

  const [timeLeft, setTimeLeft] = useState(config.duration);
  const [phaseIndex, setPhaseIndex] = useState(0);
  const [phaseTimeLeft, setPhaseTimeLeft] = useState(config.phases ? config.phases[0].duration : 0);
  const [isActive, setIsActive] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isActive || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
      
      if (config.phases) {
        setPhaseTimeLeft((prev) => {
          if (prev <= 1) {
            const nextIndex = (phaseIndex + 1) % config.phases!.length;
            setPhaseIndex(nextIndex);
            return config.phases![nextIndex].duration;
          }
          return prev - 1;
        });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [isActive, timeLeft, phaseIndex, config.phases]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const currentPhase = config.phases ? config.phases[phaseIndex] : null;

  return (
    <div className="relative h-screen w-full flex flex-col items-center justify-between p-8 overflow-hidden bg-background">
      <div className={`reflection-orb w-[600px] h-[600px] -top-40 -left-40 opacity-20 ${config.color.replace('bg-', 'text-')}`} />
      
      <header className="relative z-10 w-full text-center mt-12">
        <span className="font-label text-[10px] tracking-[0.3em] uppercase text-on-surface-variant mb-2 block">{config.subtitle}</span>
        <h1 className="font-headline text-4xl italic font-light tracking-tight text-on-surface">{config.title}</h1>
      </header>

      <section className="relative z-10 flex flex-col items-center justify-center w-full">
        <div className="relative w-72 h-72 md:w-96 md:h-96 flex items-center justify-center">
          <motion.div 
            animate={{ 
              scale: isActive ? (currentPhase?.name === 'inhale' ? 1.5 : currentPhase?.name === 'hold' ? 1.5 : 1.1) : 1,
              opacity: isActive ? 0.4 : 0.1
            }}
            transition={{ duration: currentPhase?.duration || 2, ease: "easeInOut" }}
            className={`absolute inset-0 rounded-full ${config.color} blur-3xl`} 
          />
          
          <div className="relative w-full h-full rounded-full bg-surface-variant/20 backdrop-blur-3xl border border-outline-variant/10 flex flex-col items-center justify-center text-center p-8 overflow-hidden">
            <div className="relative z-20 space-y-4">
              <config.icon size={48} className={`mx-auto ${config.color.replace('bg-', 'text-')}`} />
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentPhase?.name || 'static'}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-2"
                >
                  <p className="font-label text-xs tracking-widest text-on-surface uppercase">
                    {isActive ? (currentPhase?.text || 'Focus on your task') : 'Ready to begin?'}
                  </p>
                  <p className="text-on-surface-variant text-xs font-body italic max-w-[200px] mx-auto">
                    {config.description}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>

        <div className="mt-12 text-center">
          <div className="font-label text-5xl font-light tracking-tighter text-on-surface tabular-nums">
            {formatTime(timeLeft)}
          </div>
          <div className="font-label text-[9px] tracking-[0.4em] uppercase text-on-surface-variant mt-2">Time Remaining</div>
        </div>
      </section>

      <footer className="relative z-10 w-full flex flex-col items-center mb-12">
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsActive(!isActive)}
          className={`px-12 py-5 rounded-2xl font-label text-sm font-bold tracking-widest uppercase transition-all shadow-xl ${isActive ? 'bg-surface-variant text-on-surface' : 'bg-primary text-on-primary'}`}
        >
          {isActive ? 'Pause Session' : 'Start Session'}
        </motion.button>

        <button 
          onClick={() => navigate('/dashboard')}
          className="mt-8 flex items-center gap-2 group"
        >
          <X size={16} className="text-on-surface-variant group-hover:text-primary transition-colors" />
          <span className="font-label text-[10px] tracking-widest uppercase text-on-surface-variant group-hover:text-on-surface transition-colors">Exit Sanctuary</span>
        </button>
      </footer>
    </div>
  );
}
