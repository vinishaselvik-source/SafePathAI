import React from 'react';
import { Home, AlertTriangle, FileText, Map, User, Radio } from 'lucide-react';
import { SupportedLanguage } from '../types';
import { TRANSLATIONS } from '../locales/translations';

interface BottomNavProps {
  activeTab: string;
  onSelectTab: (tab: string) => void;
  language: SupportedLanguage;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onSelectTab, language }) => {
  const t = TRANSLATIONS[language];

  const items = [
    { id: 'home', label: t.navHome, icon: Home },
    { id: 'control', label: 'Alerts', icon: AlertTriangle },
    { id: 'cityzen', label: t.navCityZen, icon: FileText },
    { id: 'map', label: t.navRiskMap, icon: Map },
    { id: 'mesh', label: 'Mesh', icon: Radio },
    { id: 'profile', label: t.navProfile, icon: User }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-slate-950/95 backdrop-blur-md border-t border-slate-800 px-2 py-1.5 flex items-center justify-around text-slate-400 select-none shadow-2xl">
      {items.map((item) => {
        const Icon = item.icon;
        const isActive = activeTab === item.id;
        return (
          <button
            key={item.id}
            onClick={() => onSelectTab(item.id)}
            className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all ${
              isActive
                ? 'text-rose-400 font-bold scale-105'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Icon className={`w-5 h-5 ${isActive ? 'text-rose-400 animate-pulse' : 'text-slate-400'}`} />
            <span className="text-[10px] mt-0.5 tracking-tight">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
};
