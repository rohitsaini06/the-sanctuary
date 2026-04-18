import { motion } from 'motion/react';
import { ArrowLeft, LogIn, LogOut, Cloud, User as UserIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../firebase';
import { signInWithPopup, GoogleAuthProvider, signOut } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

export default function Profile() {
  const navigate = useNavigate();
  const user = auth.currentUser;

  const handleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      
      // Create user document
      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        createdAt: new Date().toISOString()
      }, { merge: true });
      
    } catch (error) {
      console.error("Error signing in", error);
    }
  };

  const handleLogout = () => {
    signOut(auth);
  };

  return (
    <div className="min-h-screen pt-24 pb-32 px-6 max-w-md mx-auto relative">
      <div className="reflection-orb w-64 h-64 top-40 right-10 opacity-20" />
      
      <header className="fixed top-0 left-0 w-full z-50 flex items-center px-6 py-6 bg-background/60 backdrop-blur-xl">
        <button onClick={() => navigate(-1)} className="text-primary mr-4">
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-2xl font-headline italic font-bold text-on-surface tracking-tight">Profile</h1>
      </header>

      <section className="space-y-8 mt-8">
        <div className="space-y-2">
          <span className="font-label text-xs uppercase tracking-[0.2em] text-on-surface-variant">Identity</span>
          <h2 className="text-4xl font-headline italic leading-tight">Your Sanctuary</h2>
        </div>

        <div className="glass-panel p-8 rounded-3xl space-y-8">
          {user ? (
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                {user.photoURL ? (
                  <img src={user.photoURL} alt="Profile" className="w-16 h-16 rounded-full border-2 border-primary/30" referrerPolicy="no-referrer" />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-surface-variant flex items-center justify-center border-2 border-primary/30">
                    <UserIcon size={24} className="text-primary" />
                  </div>
                )}
                <div>
                  <h3 className="font-headline text-xl">{user.displayName || 'Wanderer'}</h3>
                  <p className="text-sm font-body text-on-surface-variant">{user.email}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 text-sm text-tertiary bg-tertiary/10 p-4 rounded-2xl">
                <Cloud size={18} />
                <p>Your data is safely synced to the cloud.</p>
              </div>

              <button 
                onClick={handleLogout}
                className="w-full py-4 bg-surface-variant/50 hover:bg-surface-variant rounded-2xl flex items-center justify-center gap-2 transition-colors"
              >
                <LogOut size={18} />
                <span className="font-label text-xs uppercase tracking-widest">Sign Out</span>
              </button>
            </div>
          ) : (
            <div className="space-y-6 text-center">
              <div className="w-20 h-20 mx-auto rounded-full bg-surface-variant flex items-center justify-center">
                <Cloud size={32} className="text-on-surface-variant" />
              </div>
              <div className="space-y-2">
                <h3 className="font-headline text-xl">Cloud Sync</h3>
                <p className="text-sm font-body text-on-surface-variant">
                  Sign in to securely backup your reflections and mood history across devices.
                </p>
              </div>
              
              <button 
                onClick={handleLogin}
                className="w-full py-4 bg-primary text-on-primary rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-primary/20 hover:scale-[1.02] transition-transform"
              >
                <LogIn size={18} />
                <span className="font-label text-xs uppercase tracking-widest font-bold">Sign in with Google</span>
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
