import { motion } from 'motion/react';
import { ArrowLeft, Smartphone, Shield, Download, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Settings() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background text-on-surface font-body pb-32">
      <header className="w-full sticky top-0 z-40 bg-background/60 backdrop-blur-md">
        <div className="flex items-center px-6 py-4 w-full justify-start gap-4">
          <button 
            onClick={() => navigate(-1)}
            className="text-primary hover:bg-surface-variant p-2 rounded-full transition-colors"
          >
            <ArrowLeft size={24} />
          </button>
          <h1 className="font-headline italic text-2xl tracking-tight text-primary">Privacy & Security</h1>
        </div>
      </header>

      <main className="px-6 mt-8 space-y-10 max-w-md mx-auto">
        {/* Anonymous Sync Section */}
        <section className="space-y-6">
          <div className="space-y-1">
            <h2 className="font-headline italic text-4xl text-on-surface">Anonymous Sync</h2>
            <p className="font-label text-xs uppercase tracking-[0.2em] text-on-surface-variant">Encrypted Handshake</p>
          </div>

          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-secondary/20 to-tertiary/20 rounded-[2rem] blur-xl opacity-50" />
            <div className="relative glass-panel rounded-[1.5rem] p-8 flex flex-col items-center justify-center space-y-8 shadow-[0_20px_50px_rgba(0,0,0,0.3)]">
              <div className="relative bg-[#f6e1db] p-4 rounded-xl shadow-inner group-hover:scale-[1.02] transition-transform duration-500">
                <img 
                  src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=sanctuary-sync" 
                  alt="QR Code" 
                  className="w-48 h-48 mix-blend-multiply"
                />
                {/* Corner Accents */}
                <div className="absolute -top-2 -left-2 w-6 h-6 border-t-2 border-l-2 border-tertiary/60" />
                <div className="absolute -bottom-2 -right-2 w-6 h-6 border-b-2 border-r-2 border-secondary/60" />
              </div>
              <div className="text-center space-y-2">
                <p className="text-on-surface font-body text-sm leading-relaxed opacity-80 px-4">
                  Pair your sanctuary with the desktop archive. No cloud data is stored; only a direct, encrypted link between vessels.
                </p>
              </div>
            </div>
          </div>

          <button className="w-full bg-tertiary text-on-tertiary font-label font-bold text-sm tracking-widest py-5 rounded-xl uppercase shadow-[0_0_20px_rgba(174,248,252,0.3)] active:scale-95 duration-200 hover:brightness-110 flex items-center justify-center gap-3">
            <Smartphone size={20} />
            Scan Desktop to Encrypt & Sync
          </button>
        </section>

        {/* Data Custody Settings */}
        <section className="space-y-6 pb-12">
          <h3 className="font-headline italic text-2xl text-secondary">Data Custody</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-5 bg-surface-container-low rounded-xl hover:bg-surface-variant transition-colors group">
              <div className="flex flex-col gap-1">
                <span className="font-body font-semibold text-on-surface">Ephemeral Reflections</span>
                <span className="font-label text-[10px] uppercase text-on-surface-variant tracking-wider">Wipe journal after 24h</span>
              </div>
              <div className="w-12 h-6 bg-secondary rounded-full relative p-1 flex items-center justify-end">
                <div className="w-4 h-4 bg-white rounded-full shadow-lg" />
              </div>
            </div>

            <div className="flex items-center justify-between p-5 bg-surface-container-low rounded-xl hover:bg-surface-variant transition-colors">
              <div className="flex flex-col gap-1">
                <span className="font-body font-semibold text-on-surface">Stealth Vault</span>
                <span className="font-label text-[10px] uppercase text-on-surface-variant tracking-wider">Hide app from library</span>
              </div>
              <div className="w-12 h-6 bg-surface-variant rounded-full relative p-1 flex items-center">
                <div className="w-4 h-4 bg-outline-variant rounded-full" />
              </div>
            </div>

            <div className="p-5 bg-surface-container-high rounded-xl flex items-center justify-between hover:bg-surface-variant cursor-pointer transition-all active:scale-[0.98]">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-secondary/20 flex items-center justify-center">
                  <Download size={20} className="text-secondary" />
                </div>
                <span className="font-body text-on-surface">Export Soul Record (JSON)</span>
              </div>
              <ChevronRight size={20} className="text-on-surface-variant" />
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
