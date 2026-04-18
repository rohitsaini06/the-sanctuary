import { motion } from 'motion/react';
import { Activity, Calendar, ArrowRight, Check, Zap, Heart, ChevronRight, Edit3, Sparkles } from 'lucide-react';
import { useEffect, useState } from 'react';
import { storage, MoodAssessment } from '../services/storage';
import { useNavigate } from 'react-router-dom';
import { RITUALS, RitualType } from './Ritual';

const energyLabels = ['Low', 'Medium', 'High'] as const;
const stressLabels = ['Low', 'Medium', 'High'] as const;
const pleasantLabels = ['Unpleasant', 'Neutral', 'Pleasant'] as const;
const sleepLabels = ['Poor', 'Fair', 'Good'] as const;
const focusLabels = ['Scattered', 'Normal', 'Laser'] as const;

const Slider = ({ label, value, onChange, labels }: { label: string, value: number, onChange: (val: number) => void, labels: readonly string[] }) => (
  <div className="space-y-3">
    <div className="flex justify-between items-end">
      <label className="font-label text-xs uppercase tracking-widest text-on-surface-variant">{label}</label>
      <span className="font-headline italic text-primary">{labels[value]}</span>
    </div>
    <div className="relative pt-1">
      <input 
        type="range" 
        min="0" max="2" step="1" 
        value={value}
        onChange={(e) => onChange(parseInt(e.target.value))}
        className="w-full h-2 bg-surface-variant rounded-lg appearance-none cursor-pointer accent-primary"
      />
      <div className="flex justify-between text-[9px] text-on-surface-variant/50 uppercase tracking-widest mt-2">
        <span>{labels[0]}</span>
        <span>{labels[1]}</span>
        <span>{labels[2]}</span>
      </div>
    </div>
  </div>
);

export default function Trends() {
  const navigate = useNavigate();
  const [history, setHistory] = useState<MoodAssessment[]>([]);
  const [showAssessment, setShowAssessment] = useState(false);
  const [suggestedRitual, setSuggestedRitual] = useState<RitualType | null>(null);
  const [timeframe, setTimeframe] = useState<'7' | '30'>('7');
  const [assessment, setAssessment] = useState({
    energyLevel: 1,
    stressLevel: 1,
    pleasantness: 1,
    sleepQuality: 1,
    focusLevel: 1
  });

  useEffect(() => {
    const loadData = async () => {
      const data = await storage.getMoodHistory();
      setHistory(data);
    };
    loadData();
  }, [showAssessment, suggestedRitual]);

  const handleSaveAssessment = async () => {
    const mapped = {
      energyLevel: energyLabels[assessment.energyLevel],
      stressLevel: stressLabels[assessment.stressLevel],
      pleasantness: pleasantLabels[assessment.pleasantness],
      sleepQuality: sleepLabels[assessment.sleepQuality],
      focusLevel: focusLabels[assessment.focusLevel],
    };

    let moodId = 'serenity';
    let ritualId: RitualType = 'golden-hour';

    const isPositive = mapped.pleasantness === 'Pleasant' || (mapped.pleasantness === 'Neutral' && mapped.stressLevel !== 'High');
    const isHighEnergy = mapped.energyLevel === 'High' || (mapped.energyLevel === 'Medium' && mapped.stressLevel === 'High');

    if (isPositive) {
      if (isHighEnergy) {
        moodId = 'joy';
        ritualId = Math.random() > 0.5 ? 'channeling-river' : 'clearing-canvas';
      } else {
        moodId = 'serenity';
        ritualId = Math.random() > 0.5 ? 'golden-hour' : 'tea-ceremony';
      }
    } else {
      if (isHighEnergy) {
        moodId = 'anger';
        ritualId = Math.random() > 0.5 ? 'fire-release' : 'earth-rooting';
      } else {
        moodId = 'heaviness';
        if (mapped.sleepQuality === 'Poor') {
          ritualId = Math.random() > 0.5 ? 'twilight-descent' : 'closing-circle';
        } else {
          ritualId = Math.random() > 0.5 ? 'gentle-awakening' : 'inner-flame';
        }
      }
    }

    await storage.saveMoodAssessment({
      id: Date.now().toString(),
      date: new Date().toISOString(),
      ...mapped,
      moodId,
      ritualId
    });
    
    setShowAssessment(false);
    setSuggestedRitual(ritualId);
  };

  // Calculate chart data based on timeframe
  const days = timeframe === '7' ? 7 : 30;
  const dateLabels = Array.from({ length: days }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (days - 1 - i));
    return d.toISOString().split('T')[0];
  });

  const chartData = dateLabels.map(dateStr => {
    const dayAssessments = history.filter(h => h.date.startsWith(dateStr));
    if (dayAssessments.length === 0) return { energy: 0, stress: 0 };
    
    const energyScores = dayAssessments.map(a => {
      if (a.energyLevel === 'High') return 90;
      if (a.energyLevel === 'Medium') return 50;
      return 20;
    });

    const stressScores = dayAssessments.map(a => {
      if (a.stressLevel === 'High') return 90;
      if (a.stressLevel === 'Medium') return 50;
      return 20;
    });
    
    return {
      energy: energyScores.reduce((a, b) => a + b, 0) / energyScores.length,
      stress: stressScores.reduce((a, b) => a + b, 0) / stressScores.length
    };
  });

  // Generate SVG paths
  const generatePath = (data: number[], color: string) => {
    if (data.length === 0) return '';
    const maxVal = 100;
    const width = 400;
    const height = 150;
    const step = width / (data.length - 1 || 1);
    
    let path = `M0,${height - (data[0] / maxVal) * height}`;
    for (let i = 1; i < data.length; i++) {
      const x = i * step;
      const y = height - (data[i] / maxVal) * height;
      const prevX = (i - 1) * step;
      const prevY = height - (data[i - 1] / maxVal) * height;
      const cp1X = prevX + step / 2;
      const cp2X = x - step / 2;
      path += ` C${cp1X},${prevY} ${cp2X},${y} ${x},${y}`;
    }
    return path;
  };

  const energyPath = generatePath(chartData.map(d => d.energy), '#aef8fc');
  const stressPath = generatePath(chartData.map(d => d.stress), '#ffb0c9');

  const dominantMood = history.length > 0 ? history[0].moodId : 'Unknown';

  const getInsightMessage = (mood: string) => {
    switch (mood) {
      case 'joy': return "Your energy is vibrant and flowing freely.";
      case 'serenity': return "You are finding beautiful moments of stillness.";
      case 'anger': return "You are processing intense energy. Be gentle with yourself.";
      case 'heaviness': return "You are in a period of rest and recovery. Honor it.";
      default: return "Your rhythm is stabilizing as you tune into your needs.";
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-32 px-6 max-w-md mx-auto space-y-10 relative">
      <div className="reflection-orb w-64 h-64 -top-24 -right-24 opacity-20" />
      <div className="reflection-orb w-64 h-64 -bottom-24 -left-24 opacity-10" />

      {/* Editorial Header */}
      <section className="space-y-2">
        <h2 className="font-headline text-5xl leading-tight text-on-surface tracking-tighter">
          Rhythms <br/> of the <span className="italic text-primary">Soul</span>
        </h2>
        <p className="font-label text-[10px] uppercase tracking-[0.2em] text-on-surface-variant">Biometric Narrative</p>
      </section>

      {showAssessment ? (
        <div className="glass-panel p-6 rounded-3xl space-y-8">
          <h3 className="font-headline text-xl italic">Daily Assessment</h3>
          
          <div className="space-y-6">
            <Slider 
              label="Sleep Quality" 
              value={assessment.sleepQuality} 
              onChange={(v) => setAssessment(prev => ({ ...prev, sleepQuality: v }))} 
              labels={sleepLabels} 
            />
            <Slider 
              label="Energy Level" 
              value={assessment.energyLevel} 
              onChange={(v) => setAssessment(prev => ({ ...prev, energyLevel: v }))} 
              labels={energyLabels} 
            />
            <Slider 
              label="Stress Level" 
              value={assessment.stressLevel} 
              onChange={(v) => setAssessment(prev => ({ ...prev, stressLevel: v }))} 
              labels={stressLabels} 
            />
            <Slider 
              label="Pleasantness" 
              value={assessment.pleasantness} 
              onChange={(v) => setAssessment(prev => ({ ...prev, pleasantness: v }))} 
              labels={pleasantLabels} 
            />
            <Slider 
              label="Focus Level" 
              value={assessment.focusLevel} 
              onChange={(v) => setAssessment(prev => ({ ...prev, focusLevel: v }))} 
              labels={focusLabels} 
            />
          </div>

          <button 
            onClick={handleSaveAssessment}
            className="w-full py-4 bg-primary text-on-primary rounded-2xl flex items-center justify-center gap-2 mt-4 hover:scale-105 transition-transform"
          >
            <Check size={18} />
            <span className="font-label text-xs uppercase tracking-widest font-bold">Save Assessment</span>
          </button>
        </div>
      ) : suggestedRitual ? (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-panel p-8 rounded-3xl space-y-6 text-center relative overflow-hidden"
        >
          <div className={`absolute inset-0 opacity-20 ${RITUALS[suggestedRitual].color}`} />
          <div className="relative z-10">
            <Sparkles className="w-12 h-12 mx-auto mb-4 text-primary" />
            <h3 className="font-headline text-2xl italic mb-2">Suggested for You</h3>
            <p className="font-body text-sm text-on-surface-variant mb-6">
              Based on your current state, we recommend this exercise to help you find balance.
            </p>
            
            <div className="bg-surface-container-high p-6 rounded-2xl mb-6">
              <h4 className="font-headline text-xl mb-2">{RITUALS[suggestedRitual].title}</h4>
              <p className="font-body text-xs text-on-surface-variant">{RITUALS[suggestedRitual].description}</p>
            </div>

            <div className="flex gap-3">
              <button 
                onClick={() => setSuggestedRitual(null)}
                className="flex-1 py-3 rounded-xl font-label text-[10px] uppercase tracking-widest text-on-surface-variant border border-outline-variant/20 hover:bg-surface-variant/50 transition-colors"
              >
                Maybe Later
              </button>
              <button 
                onClick={() => navigate(`/ritual?type=${suggestedRitual}`)}
                className="flex-1 py-3 rounded-xl font-label text-[10px] uppercase tracking-widest bg-primary text-on-primary hover:scale-105 transition-transform"
              >
                Start Ritual
              </button>
            </div>
          </div>
        </motion.div>
      ) : (
        <>
          <button 
            onClick={() => setShowAssessment(true)}
            className="w-full py-4 glass-panel rounded-2xl flex items-center justify-center gap-2 group border border-primary/20 hover:border-primary/50 transition-colors"
          >
            <Activity size={18} className="text-primary" />
            <span className="font-label text-xs uppercase tracking-widest text-primary">Take Daily Assessment</span>
          </button>

          {/* Time Toggle */}
          <div className="flex justify-center">
            <div className="inline-flex bg-surface-container-highest/60 backdrop-blur-lg p-1.5 rounded-full border border-outline-variant/10">
              <button 
                onClick={() => setTimeframe('7')}
                className={`px-6 py-2 rounded-full font-label text-xs tracking-widest transition-colors ${timeframe === '7' ? 'bg-tertiary/10 text-tertiary shadow-[0_0_15px_rgba(174,248,252,0.3)] backdrop-blur-md border border-tertiary/20' : 'text-on-surface-variant hover:text-on-surface'}`}
              >
                7-Day
              </button>
              <button 
                onClick={() => setTimeframe('30')}
                className={`px-6 py-2 rounded-full font-label text-xs tracking-widest transition-colors ${timeframe === '30' ? 'bg-tertiary/10 text-tertiary shadow-[0_0_15px_rgba(174,248,252,0.3)] backdrop-blur-md border border-tertiary/20' : 'text-on-surface-variant hover:text-on-surface'}`}
              >
                30-Day
              </button>
            </div>
          </div>

          {/* Main Chart Container */}
          <section className="relative glass-panel rounded-[2rem] p-8 overflow-hidden shadow-2xl">
            <div className="relative z-10 space-y-12">
              {/* Legend */}
              <div className="flex justify-between items-end">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-tertiary shadow-[0_0_8px_rgba(174,248,252,0.8)]" />
                    <span className="font-label text-[10px] tracking-widest text-on-surface uppercase">Vitality Energy</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-secondary shadow-[0_0_8px_rgba(255,176,201,0.8)]" />
                    <span className="font-label text-[10px] tracking-widest text-on-surface uppercase">Somatic Stress</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="block font-headline italic text-3xl text-tertiary capitalize">{dominantMood}</span>
                  <span className="font-label text-[9px] tracking-tighter text-on-surface-variant uppercase">Current State</span>
                </div>
              </div>

              {/* The "Chart" (Artistic Representation) */}
              <div className="h-64 w-full relative flex items-end overflow-hidden">
                <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 150" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="gradientTeal" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#aef8fc" stopOpacity="1" />
                      <stop offset="100%" stopColor="#130d0b" stopOpacity="0" />
                    </linearGradient>
                    <linearGradient id="gradientRose" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#ffb0c9" stopOpacity="1" />
                      <stop offset="100%" stopColor="#130d0b" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  
                  {history.length > 0 ? (
                    <>
                      {/* Energy Flow */}
                      <motion.path 
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 2, ease: "easeInOut" }}
                        d={energyPath} 
                        fill="none" 
                        stroke="#aef8fc" 
                        strokeWidth="2.5" 
                        strokeLinecap="round" 
                      />
                      <path d={`${energyPath} L400,150 L0,150 Z`} fill="url(#gradientTeal)" fillOpacity="0.1" />
                      
                      {/* Stress Flow */}
                      <motion.path 
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 2, ease: "easeInOut", delay: 0.5 }}
                        d={stressPath} 
                        fill="none" 
                        stroke="#ffb0c9" 
                        strokeWidth="2.5" 
                        strokeLinecap="round" 
                      />
                      <path d={`${stressPath} L400,150 L0,150 Z`} fill="url(#gradientRose)" fillOpacity="0.1" />
                    </>
                  ) : (
                    <text x="50%" y="50%" textAnchor="middle" fill="#888" fontSize="12" fontStyle="italic">No data yet. Take an assessment.</text>
                  )}
                </svg>
                
                {/* Active Indicator Point */}
                {history.length > 0 && (
                  <div className="absolute right-0" style={{ bottom: `${chartData[chartData.length - 1].energy}%` }}>
                    <div className="w-3 h-3 rounded-full bg-tertiary shadow-[0_0_15px_#aef8fc] relative z-20" />
                  </div>
                )}
              </div>

              <div className="flex justify-between px-2">
                <span className="font-label text-[10px] text-on-surface-variant uppercase tracking-widest">
                  {new Date(dateLabels[0]).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                </span>
                <span className="font-label text-[10px] text-on-surface-variant uppercase tracking-widest">
                  {new Date(dateLabels[dateLabels.length - 1]).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                </span>
              </div>
            </div>
          </section>

          {/* Insights Bento Section */}
          <section className="grid grid-cols-2 gap-4">
            <div className="bg-surface-container-highest/40 backdrop-blur-xl p-5 rounded-[1.5rem] border border-outline-variant/5 flex flex-col justify-between aspect-square">
              <Zap className="text-secondary w-8 h-8" />
              <div>
                <h4 className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant mb-1">Entries</h4>
                <p className="font-headline text-2xl leading-snug">{history.length}</p>
              </div>
            </div>
            <div className="bg-primary p-5 rounded-[1.5rem] flex flex-col justify-between aspect-square">
              <Heart className="text-on-primary w-8 h-8" fill="currentColor" />
              <p className="font-headline text-xl text-on-primary font-bold leading-tight">{getInsightMessage(dominantMood)}</p>
            </div>
          </section>

          {/* Journal Entry Link */}
          <div onClick={() => navigate('/vault')} className="bg-surface-container-low p-6 rounded-[1.5rem] border border-outline-variant/10 flex items-center justify-between group cursor-pointer">
            <div className="flex gap-4 items-center">
              <div className="w-12 h-12 bg-surface-variant rounded-xl flex items-center justify-center">
                <Edit3 className="text-primary" />
              </div>
              <div>
                <p className="font-label text-[10px] text-on-surface-variant uppercase tracking-widest">View History</p>
                <p className="font-headline italic text-lg text-on-surface">The Vault</p>
              </div>
            </div>
            <ChevronRight className="text-on-surface-variant group-hover:translate-x-1 transition-transform" />
          </div>

          {/* Last Suggested Ritual */}
          {history.length > 0 && history[0].ritualId && RITUALS[history[0].ritualId as RitualType] && (
            <div onClick={() => navigate(`/ritual?type=${history[0].ritualId}`)} className="bg-surface-container-low p-6 rounded-[1.5rem] border border-outline-variant/10 flex items-center justify-between group cursor-pointer">
              <div className="flex gap-4 items-center">
                <div className="w-12 h-12 bg-surface-variant rounded-xl flex items-center justify-center">
                  {(() => {
                    const ritual = RITUALS[history[0].ritualId as RitualType];
                    const Icon = ritual.icon;
                    return <Icon className={ritual.color.replace('bg-', 'text-')} />;
                  })()}
                </div>
                <div>
                  <p className="font-label text-[10px] text-on-surface-variant uppercase tracking-widest">Suggested Practice</p>
                  <p className="font-headline italic text-lg text-on-surface">{RITUALS[history[0].ritualId as RitualType].title}</p>
                </div>
              </div>
              <ChevronRight className="text-on-surface-variant group-hover:translate-x-1 transition-transform" />
            </div>
          )}
        </>
      )}
    </div>
  );
}
