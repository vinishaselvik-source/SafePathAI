import React from 'react';
import { 
  Home, AlertTriangle, FileText, Map, User, Radio, 
  CheckSquare, BarChart3, ShieldCheck, ShieldAlert 
} from 'lucide-react';
import { SupportedLanguage, UserRole } from '../types';
import { TRANSLATIONS } from '../locales/translations';

interface BottomNavProps {
  activeTab: string;
  onSelectTab: (tab: string) => void;
  language: SupportedLanguage;
  currentRole?: UserRole;
}

export const BottomNav: React.FC<BottomNavProps> = ({ 
  activeTab, 
  onSelectTab, 
  language,
  currentRole = 'citizen'
}) => {
  const t = TRANSLATIONS[language];

  // Role-customized bottom navigation items
  const getNavItems = () => {
    switch (currentRole) {
      case 'volunteer':
        return [
          { id: 'home', label: 'Tasks', icon: CheckSquare },
          { id: 'map', label: t.navRiskMap, icon: Map },
          { id: 'cityzen', label: t.navCityZen, icon: FileText },
          { id: 'preparedness', label: 'Shelters', icon: ShieldCheck },
          { id: 'mesh', label: 'Mesh', icon: Radio },
          { id: 'profile', label: t.navProfile, icon: User }
        ];
      case 'responder':
        return [
          { id: 'home', label: 'Control Room', icon: ShieldAlert },
          { id: 'map', label: 'Tactical Map', icon: Map },
          { id: 'cityzen', label: t.navCityZen, icon: FileText },
          { id: 'preparedness', label: 'Logistics', icon: ShieldCheck },
          { id: 'mesh', label: 'Mesh Relay', icon: Radio },
          { id: 'profile', label: t.navProfile, icon: User }
        ];
      case 'admin':
        return [
          { id: 'home', label: 'EOC Command', icon: BarChart3 },
          { id: 'control', label: 'Incidents', icon: AlertTriangle },
          { id: 'map', label: 'District Map', icon: Map },
          { id: 'cityzen', label: 'CityZen Audit', icon: FileText },
          { id: 'preparedness', label: 'DMP Plans', icon: ShieldCheck },
          { id: 'profile', label: t.navProfile, icon: User }
        ];
      case 'citizen':
      default:
        return [
          { id: 'home', label: t.navHome, icon: Home },
          { id: 'map', label: t.navRiskMap, icon: Map },
          { id: 'cityzen', label: t.navCityZen, icon: FileText },
          { id: 'preparedness', label: t.navPreparedness, icon: ShieldCheck },
          { id: 'mesh', label: 'Mesh Sim', icon: Radio },
          { id: 'profile', label: t.navProfile, icon: User }
        ];
    }
  };

  const items = getNavItems();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-slate-950/95 backdrop-blur-md border-t border-slate-800 px-1 py-1 sm:py-1.5 flex items-center justify-around text-slate-400 select-none shadow-2xl">
      {items.map((item) => {
        const Icon = item.icon;
        const isActive = activeTab === item.id;
        return (
          <button
            key={item.id}
            onClick={() => onSelectTab(item.id)}
            className={`flex flex-col items-center justify-center py-1 px-1.5 sm:px-2 rounded-xl transition-all ${
              isActive
                ? 'text-cyan-400 font-extrabold scale-105'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Icon className={`w-5 h-5 ${isActive ? 'text-cyan-400 animate-pulse' : 'text-slate-400'}`} />
            <span className="text-[10px] mt-0.5 tracking-tight">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
};
