import React from 'react';
import { 
  WifiOff, 
  CheckCircle2, 
  Download, 
  Map, 
  Users, 
  Hospital as HospitalIcon, 
  Compass, 
  FileText,
  X 
} from 'lucide-react';

interface OfflinePackModalProps {
  isOpen: boolean;
  onClose: () => void;
  isOfflineMode: boolean;
  onToggleOffline: () => void;
}

export const OfflinePackModal: React.FC<OfflinePackModalProps> = ({
  isOpen,
  onClose,
  isOfflineMode,
  onToggleOffline,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 glass-nav bg-navy-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-emerald-500/40 max-w-lg w-full space-y-6 relative shadow-2xl animate-in zoom-in-95">
        
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl bg-navy-800 text-slate-400 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 border-b border-white/10 pb-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <WifiOff className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-white">📡 Offline Safety Pack</h2>
            <p className="text-xs text-slate-300">
              Zero-connectivity backup for Marakkanam dead-zone & low signal stretches.
            </p>
          </div>
        </div>

        {/* Status card */}
        <div className="p-4 bg-emerald-950/60 border border-emerald-500/30 rounded-2xl flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-300">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <span>Offline Safety Pack Status: READY ✓</span>
          </div>
          <span className="text-[10px] font-mono bg-emerald-500/20 text-emerald-300 px-2.5 py-0.5 rounded border border-emerald-500/30">
            4.2 MB Cached
          </span>
        </div>

        {/* Saved Items List */}
        <div className="space-y-2.5 text-xs">
          <h3 className="font-bold text-slate-300 uppercase tracking-wider text-[11px]">Saved Offline Resources:</h3>
          
          <div className="p-3 glass-card rounded-xl border border-white/5 flex items-center gap-3">
            <Map className="w-4 h-4 text-cyan-400 shrink-0" />
            <div>
              <span className="font-bold text-white block">☑️ Full Route Geometry & Navigation Cache</span>
              <span className="text-[11px] text-slate-400">Chennai → Pondicherry (ECR & OMR alternative vectors)</span>
            </div>
          </div>

          <div className="p-3 glass-card rounded-xl border border-white/5 flex items-center gap-3">
            <HospitalIcon className="w-4 h-4 text-rose-400 shrink-0" />
            <div>
              <span className="font-bold text-white block">☑️ Offline Emergency Hospital Hotlines</span>
              <span className="text-[11px] text-slate-400">Apollo OMR, Chettinad, JIPMER direct dial numbers</span>
            </div>
          </div>

          <div className="p-3 glass-card rounded-xl border border-white/5 flex items-center gap-3">
            <Users className="w-4 h-4 text-purple-400 shrink-0" />
            <div>
              <span className="font-bold text-white block">☑️ Safety Circle Contacts Offline Cache</span>
              <span className="text-[11px] text-slate-400">Rohan (+91 98765 43210), Priya (+91 98123 45678)</span>
            </div>
          </div>

          <div className="p-3 glass-card rounded-xl border border-white/5 flex items-center gap-3">
            <FileText className="w-4 h-4 text-amber-400 shrink-0" />
            <div>
              <span className="font-bold text-white block">☑️ Offline First-Aid & Vehicle Crisis Guide</span>
              <span className="text-[11px] text-slate-400">Tyre blowout, engine overheat, monsoon wading instructions</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="pt-2 flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => {
              onToggleOffline();
              onClose();
            }}
            className={`flex-1 py-3 rounded-xl font-extrabold text-xs transition-all flex items-center justify-center gap-2 ${
              isOfflineMode
                ? 'bg-emerald-500 text-navy-950 shadow-glow-cyan'
                : 'bg-navy-800 hover:bg-navy-700 text-slate-200 border border-slate-700'
            }`}
          >
            <WifiOff className="w-4 h-4" />
            <span>{isOfflineMode ? 'Disable Offline Mode' : 'Toggle Offline Mode Now'}</span>
          </button>
        </div>

      </div>
    </div>
  );
};
