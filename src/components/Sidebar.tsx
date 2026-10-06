import React from 'react';
import { NavView } from '../types';
import { 
  LayoutDashboard, 
  MapPin, 
  ShieldCheck, 
  Map as MapIcon, 
  CheckSquare, 
  Radio, 
  Hospital, 
  Compass, 
  Navigation, 
  AlertTriangle, 
  Bot, 
  UserCheck 
} from 'lucide-react';

interface SidebarProps {
  currentView: NavView;
  onNavigate: (view: NavView) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentView, onNavigate }) => {
  const navItems: { id: NavView; label: string; icon: React.ComponentType<{ className?: string }>; badge?: string }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'plantrip', label: 'Plan Trip', icon: MapPin },
    { id: 'saferoutes', label: 'Safe Routes', icon: ShieldCheck, badge: 'AI' },
    { id: 'livemap', label: 'Interactive Live Map', icon: MapIcon },
    { id: 'checklist', label: 'Travel Checklist', icon: CheckSquare },
    { id: 'radar', label: 'Safety Radar', icon: Radio, badge: 'Live' },
    { id: 'hospitals', label: 'Nearby Hospitals', icon: Hospital, badge: '24/7' },
    { id: 'essentials', label: 'Nearby Essentials', icon: Compass },
    { id: 'journeymonitor', label: 'Journey Monitor', icon: Navigation },
    { id: 'emergency', label: 'Emergency Protocol', icon: AlertTriangle },
    { id: 'copilot', label: 'AI Travel Copilot', icon: Bot },
    { id: 'profile', label: 'Safety Circle & Profile', icon: UserCheck },
  ];

  return (
    <aside className="w-64 glass-panel border-r border-white/5 flex flex-col justify-between hidden lg:flex shrink-0 min-h-[calc(100vh-65px)] sticky top-[65px] p-4">
      <div className="space-y-1.5">
        <div className="px-3 py-2 text-[10px] font-extrabold uppercase tracking-widest text-slate-400">
          Main Navigation
        </div>
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium text-xs transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-cyan-500/20 to-blue-600/20 text-cyan-300 border border-cyan-500/40 shadow-glow-cyan font-semibold'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-navy-800/50 border border-transparent'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                    item.badge === '24/7' 
                      ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                      : item.badge === 'Live'
                      ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                      : 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer info card */}
      <div className="p-3 glass-card rounded-xl border border-white/5 bg-navy-900/60 mt-4">
        <div className="flex items-center justify-between text-[11px] font-semibold text-slate-300 mb-1">
          <span>Active Journey</span>
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
        </div>
        <div className="text-xs font-bold text-white truncate">Chennai → Pondicherry</div>
        <div className="text-[10px] text-slate-400 mt-1 flex items-center justify-between">
          <span>155 km · 3h 15m</span>
          <span className="text-cyan-400">91/100 Safe</span>
        </div>
      </div>
    </aside>
  );
};
