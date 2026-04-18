import { useState } from 'react';
import { motion } from 'motion/react';
import { Send, Sparkles, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { generateReflection } from '../services/geminiService';
import { storage } from '../services/storage';

export default function Journal() {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const navigate = useNavigate();

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setIsGenerating(true);
    
    const reflection = await generateReflection(prompt);
    
    const newEntry = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      prompt,
      reflection: reflection || 'A moment of quiet reflection.'
    };
    
    storage.saveEntry(newEntry);
    setIsGenerating(false);
    navigate('/vault');
  };

  return (
    <div className="min-h-screen pt-24 pb-32 px-6 max-w-md mx-auto relative">
      <div className="reflection-orb w-64 h-64 top-40 left-10 opacity-20" />
      
      <header className="fixed top-0 left-0 w-full z-50 flex items-center px-6 py-6 bg-background/60 backdrop-blur-xl">
        <button onClick={() => navigate(-1)} className="text-primary mr-4">
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-2xl font-headline italic font-bold text-on-surface tracking-tight">Reflect</h1>
      </header>

      <section className="space-y-6 mt-8">
        <div className="space-y-2">
          <span className="font-label text-xs uppercase tracking-[0.2em] text-on-surface-variant">Journaling</span>
          <h2 className="text-4xl font-headline italic leading-tight">What's on your mind?</h2>
        </div>

        <div className="relative">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Speak your truth..."
            className="w-full h-64 bg-surface-variant/40 backdrop-blur-xl border border-outline-variant/20 rounded-3xl p-6 text-on-surface placeholder:text-on-surface-variant/40 focus:outline-none focus:border-primary/40 transition-colors resize-none font-body"
          />
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleGenerate}
            disabled={isGenerating || !prompt.trim()}
            className="absolute bottom-6 right-6 bg-primary text-on-primary p-4 rounded-2xl shadow-lg disabled:opacity-50 disabled:scale-100 transition-all"
          >
            {isGenerating ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              >
                <Sparkles size={24} />
              </motion.div>
            ) : (
              <Send size={24} />
            )}
          </motion.button>
        </div>

        <p className="text-center text-on-surface-variant/60 font-body italic text-sm px-8">
          Your words are safe here. AI will help you find the light in your thoughts.
        </p>
      </section>
    </div>
  );
}
