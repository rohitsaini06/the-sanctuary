import { motion } from 'motion/react';
import { Link } from 'react-router-dom';

export default function LaunchScreen() {
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center px-8 text-center overflow-hidden">
      {/* Background Orbs */}
      <div className="reflection-orb w-96 h-96 -bottom-20 -left-20 opacity-40" />
      <div className="reflection-orb w-[500px] h-[500px] -top-10 -right-10 opacity-20" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        className="relative w-full max-w-md flex flex-col items-center"
      >
        {/* Hero Image */}
        <div className="w-full aspect-[4/5] rounded-3xl overflow-hidden mb-12 shadow-2xl relative">
          <img 
            src="https://picsum.photos/seed/stillness/800/1000" 
            alt="The Art of Stillness" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
          <div className="absolute bottom-6 left-6 right-6 text-left">
            <span className="font-label text-[10px] uppercase tracking-[0.3em] text-secondary mb-2 block">Current Chapter</span>
            <h2 className="font-headline text-4xl text-on-surface leading-tight italic">The Art of <br/>Stillness</h2>
          </div>
        </div>

        {/* CTA Button */}
        <div className="relative group">
          <div className="absolute inset-0 rounded-full bg-secondary blur-[40px] opacity-30 scale-125 transition-transform duration-700 group-hover:scale-150" />
          <Link to="/mood-grid">
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="relative glass-panel border border-tertiary/20 px-12 py-8 rounded-full shadow-[0_20px_50px_rgba(0,0,0,0.5)] transition-all duration-300"
            >
              <span className="font-headline italic text-4xl tracking-tight text-tertiary drop-shadow-[0_0_8px_rgba(174,248,252,0.4)]">
                Check In Now
              </span>
            </motion.button>
          </Link>
        </div>

        {/* Reassuring Message */}
        <div className="mt-10 space-y-2">
          <p className="font-body text-on-surface-variant text-lg">The Sanctuary is open. How are you?</p>
          <div className="flex items-center justify-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-tertiary" />
            <span className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant/60">Take a deep breath. You're home.</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
