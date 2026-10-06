import React from 'react';
import { NavView } from '../types';
import { 
  Shield, 
  Moon, 
  Sun, 
  AlertOctagon, 
  Menu, 
  X,
  Bot
} from 'lucide-react';

interface HeaderProps {
  currentView: NavView;
  onNavigate: (view: NavView) => void;
  onTriggerSOS: () => void;
  onToggleCopilot: () => void;
  isNightMode: boolean;
  onToggleNightMode: () => void;
  isOfflineMode: boolean;
  onToggleOfflineMode: () => void;
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  onNavigate,
  onTriggerSOS,
  onToggleCopilot,
  isNightMode,
  onToggleNightMode,
  mobileMenuOpen,
  setMobileMenuOpen,
}) => {
  return (
    <header className="sticky top-0 z-40 glass-nav px-3 py-2.5 transition-all">
      <div className="flex items-center justify-between gap-2">
        
        {/* Brand Header */}
        <button 
          onClick={() => onNavigate('landing')}
          className="flex items-center gap-2 text-left group focus:outline-none"
        >
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-emerald-500 via-teal-500 to-emerald-600 flex items-center justify-center shadow-glow-cyan">
            <Shield className="w-5 h-5 text-slate-950 stroke-[2.5]" />
          </div>
          <div>
            <span className="font-extrabold text-base tracking-tight text-white font-sans">
              SafePath AI
            </span>
          </div>
        </button>

        {/* Right Actions */}
        <div className="flex items-center gap-1.5">
          
          {/* Night Mode Toggle */}
          <button
            onClick={onToggleNightMode}
            className={`p-2 rounded-xl border text-xs ${
              isNightMode 
                ? 'bg-purple-950/80 border-purple-500/50 text-purple-300 shadow-glow-cyan' 
                : 'bg-navy-900 border-slate-700/60 text-slate-300'
            }`}
            title="Night Mode"
          >
            {isNightMode ? <Moon className="w-4 h-4 text-purple-400 fill-purple-400" /> : <Sun className="w-4 h-4" />}
          </button>

          {/* AI Copilot */}
          <button
            onClick={onToggleCopilot}
            className="p-2 bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 rounded-xl"
            title="AI Copilot"
          >
            <Bot className="w-4 h-4 text-emerald-400 animate-pulse" />
          </button>

          {/* SOS BUTTON */}
          <button
            onClick={onTriggerSOS}
            className="px-3 py-1.5 bg-gradient-to-r from-red-600 to-rose-600 text-white font-extrabold text-xs rounded-xl shadow-glow-rose flex items-center gap-1 border border-rose-400/40 animate-pulse shrink-0"
          >
            <AlertOctagon className="w-4 h-4 stroke-[2.5]" />
            <span>SOS</span>
          </button>

          {/* Menu Drawer */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 bg-navy-900 border border-slate-700 rounded-xl text-slate-300"
          >
            {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>

        </div>
      </div>
    </header>
  );
};
