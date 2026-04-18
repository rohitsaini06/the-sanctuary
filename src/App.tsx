import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import { Header, BottomNav } from './components/Navigation';
import LaunchScreen from './views/LaunchScreen';
import MoodGrid from './views/MoodGrid';
import Dashboard from './views/Dashboard';
import Trends from './views/Trends';
import Ritual from './views/Ritual';
import Settings from './views/Settings';
import Journal from './views/Journal';
import Vault from './views/Vault';
import Profile from './views/Profile';
import { useEffect, useState } from 'react';
import { auth } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';

function AnimatedRoutes() {
  const location = useLocation();
  const showNav = !['/', '/ritual', '/settings', '/journal', '/profile'].includes(location.pathname);
  const showHeader = !['/', '/ritual', '/settings', '/journal', '/vault', '/profile'].includes(location.pathname);

  return (
    <>
      {showHeader && <Header />}
      <AnimatePresence mode="wait">
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -10 }}
          transition={{ duration: 0.3 }}
        >
          <Routes location={location}>
            <Route path="/" element={<LaunchScreen />} />
            <Route path="/mood-grid" element={<MoodGrid />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/trends" element={<Trends />} />
            <Route path="/ritual" element={<Ritual />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/journal" element={<Journal />} />
            <Route path="/vault" element={<Vault />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </motion.div>
      </AnimatePresence>
      {showNav && <BottomNav />}
    </>
  );
}

export default function App() {
  const [isAuthReady, setIsAuthReady] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, () => {
      setIsAuthReady(true);
    });
    return () => unsubscribe();
  }, []);

  if (!isAuthReady) {
    return <div className="min-h-screen bg-background flex items-center justify-center text-on-surface">Loading...</div>;
  }

  return (
    <Router>
      <AnimatedRoutes />
    </Router>
  );
}
