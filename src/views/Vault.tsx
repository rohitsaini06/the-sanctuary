import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Archive, Calendar, Quote, Search, Edit2, Check, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { storage, JournalEntry } from '../services/storage';
import { useEffect, useState } from 'react';

export default function Vault() {
  const navigate = useNavigate();
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editPrompt, setEditPrompt] = useState('');

  useEffect(() => {
    const loadEntries = async () => {
      const data = await storage.getEntries();
      setEntries(data);
    };
    loadEntries();
  }, []);

  const filteredEntries = entries.filter(entry => 
    entry.prompt.toLowerCase().includes(searchQuery.toLowerCase()) ||
    entry.reflection.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const startEdit = (entry: JournalEntry) => {
    setEditingId(entry.id);
    setEditPrompt(entry.prompt);
  };

  const saveEdit = async (id: string) => {
    await storage.updateEntry(id, { prompt: editPrompt });
    setEntries(entries.map(e => e.id === id ? { ...e, prompt: editPrompt } : e));
    setEditingId(null);
  };

  return (
    <div className="min-h-screen pt-24 pb-32 px-6 max-w-md mx-auto relative">
      <div className="reflection-orb w-64 h-64 top-40 right-10 opacity-20" />
      
      <header className="fixed top-0 left-0 w-full z-50 flex items-center px-6 py-6 bg-background/60 backdrop-blur-xl">
        <button onClick={() => navigate(-1)} className="text-primary mr-4">
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-2xl font-headline italic font-bold text-on-surface tracking-tight">The Vault</h1>
      </header>

      <section className="space-y-8 mt-8">
        <div className="space-y-4">
          <div className="space-y-2">
            <span className="font-label text-xs uppercase tracking-[0.2em] text-on-surface-variant">History</span>
            <h2 className="text-4xl font-headline italic leading-tight">Your Saved Reflections</h2>
          </div>
          
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant/50" size={18} />
            <input 
              type="text"
              placeholder="Search reflections..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-surface-variant/30 border border-outline-variant/20 rounded-2xl py-3 pl-12 pr-4 text-sm font-body text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:border-primary/50 transition-colors"
            />
          </div>
        </div>

        {filteredEntries.length === 0 ? (
          <div className="text-center py-20 space-y-4">
            <Archive size={48} className="mx-auto text-on-surface-variant/20" />
            <p className="text-on-surface-variant font-body italic">
              {searchQuery ? "No reflections found matching your search." : "The vault is quiet. Start journaling to fill it with light."}
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            <AnimatePresence>
              {filteredEntries.map((entry) => (
                <motion.div
                  key={entry.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="glass-panel p-6 rounded-3xl space-y-4 relative group"
                >
                  <div className="flex justify-between items-center text-on-surface-variant">
                    <div className="flex items-center gap-2">
                      <Calendar size={14} />
                      <span className="font-label text-[10px] uppercase tracking-widest">
                        {new Date(entry.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                    </div>
                    {editingId !== entry.id && (
                      <button 
                        onClick={() => startEdit(entry)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity p-2 hover:bg-surface-variant/50 rounded-full"
                      >
                        <Edit2 size={14} className="text-primary" />
                      </button>
                    )}
                  </div>
                  
                  <div className="space-y-4">
                    {editingId === entry.id ? (
                      <div className="space-y-2">
                        <textarea
                          value={editPrompt}
                          onChange={(e) => setEditPrompt(e.target.value)}
                          className="w-full bg-surface-variant/50 border border-primary/30 rounded-xl p-3 text-sm font-body text-on-surface focus:outline-none resize-none h-24"
                        />
                        <div className="flex justify-end gap-2">
                          <button onClick={() => setEditingId(null)} className="p-2 text-on-surface-variant hover:text-on-surface">
                            <X size={16} />
                          </button>
                          <button onClick={() => saveEdit(entry.id)} className="p-2 text-primary hover:text-tertiary">
                            <Check size={16} />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <p className="text-on-surface-variant text-xs font-body italic opacity-80">"{entry.prompt}"</p>
                    )}
                    
                    <div className="flex gap-3 bg-surface-variant/20 p-4 rounded-2xl">
                      <Quote size={16} className="text-primary shrink-0 opacity-50" />
                      <p className="text-on-surface font-body text-sm leading-relaxed">{entry.reflection}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </section>
    </div>
  );
}
