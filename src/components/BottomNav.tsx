import React from 'react';
import { NavView } from '../types';
import { LayoutDashboard, Sparkles, ShieldCheck, Map, Hospital } from 'lucide-react';

interface BottomNavProps {
  currentView: NavView;
  onNavigate: (view: NavView) => void;
  onTriggerSOS: () => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ currentView, onNavigate }) => {
  const tabs: { id: NavView; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'dashboard', label: 'Home', icon: LayoutDashboard },
    { id: 'famousplaces', label: 'Places', icon: Sparkles },
    { id: 'saferoutes', label: 'Routes', icon: ShieldCheck },
    { id: 'livemap', label: 'Map', icon: Map },
    { id: 'hospitals', label: 'Hospitals', icon: Hospital },
  ];

  return (
    <div className="sticky bottom-0 z-40 glass-nav border-t border-white/10 px-1.5 py-1.5 flex items-center justify-around font-sans">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = currentView === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onNavigate(tab.id)}
            className={`flex flex-col items-center gap-0.5 py-1 px-2.5 rounded-xl text-xs font-medium transition-all ${
              isActive ? 'text-amber-300 font-extrabold bg-amber-500/15 border border-amber-500/30 shadow-sm' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Icon className={`w-4 h-4 ${isActive ? 'text-amber-400' : 'text-slate-400'}`} />
            <span className="text-[10px] truncate">{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
};
