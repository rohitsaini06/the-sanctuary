import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Sparkles, History, BookOpen, User, Home, BarChart2, Wind, Settings } from 'lucide-react';
import { motion } from 'motion/react';
import { auth } from '../firebase';

export function Header() {
  const navigate = useNavigate();
  const user = auth.currentUser;

  return (
    <header className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-6 py-6 bg-background/60 backdrop-blur-xl">
      <div className="flex items-center gap-4">
        <motion.div 
          whileHover={{ rotate: 15 }}
          className="text-primary"
        >
          <Sparkles size={24} />
        </motion.div>
        <h1 className="text-2xl font-headline italic font-bold text-on-surface tracking-tight">The Sanctuary</h1>
      </div>
      <button 
        onClick={() => navigate('/profile')}
        className="w-10 h-10 rounded-full overflow-hidden border border-outline-variant/20 flex items-center justify-center bg-surface-container-high"
      >
        {user?.photoURL ? (
          <img 
            src={user.photoURL} 
            alt="User profile" 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        ) : (
          <User size={18} className="text-on-surface-variant" />
        )}
      </button>
    </header>
  );
}

export function BottomNav() {
  const location = useLocation();
  
  const navItems = [
    { icon: Home, label: 'Sanctuary', path: '/dashboard' },
    { icon: Sparkles, label: 'Reflect', path: '/mood-grid' },
    { icon: BarChart2, label: 'Trends', path: '/trends' },
    { icon: Wind, label: 'Rituals', path: '/ritual' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 pb-8 pt-4 bg-surface-variant/60 backdrop-blur-xl rounded-t-[2rem] shadow-[0_-10px_40px_rgba(0,0,0,0.3)]">
      {navItems.map((item) => {
        const isActive = location.pathname === item.path;
        return (
          <Link 
            key={item.path}
            to={item.path}
            className={`flex flex-col items-center justify-center px-4 py-2 transition-all duration-300 ${
              isActive ? 'text-primary scale-110' : 'text-on-surface-variant opacity-60 hover:opacity-100'
            }`}
          >
            <item.icon size={20} fill={isActive ? 'currentColor' : 'none'} />
            <span className="font-label text-[10px] uppercase tracking-widest mt-1">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
