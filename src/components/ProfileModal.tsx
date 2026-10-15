import React from 'react';
import { User, Shield, MapPin, Phone, Award, Globe, Wifi, WifiOff, X, BookOpen, Battery } from 'lucide-react';
import { UserRole, SupportedLanguage } from '../types';
import { TRANSLATIONS } from '../locales/translations';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  language: SupportedLanguage;
  onLanguageChange: (lang: SupportedLanguage) => void;
  isSimulatedOffline: boolean;
  onToggleOffline: () => void;
  onOpenDemoGuide: () => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  onClose,
  currentRole,
  onRoleChange,
  language,
  onLanguageChange,
  isSimulatedOffline,
  onToggleOffline,
  onOpenDemoGuide
}) => {
  if (!isOpen) return null;
  const t = TRANSLATIONS[language];

  const profiles: Record<UserRole, { name: string; email: string; ward: string; phone: string; agency: string }> = {
    citizen: {
      name: 'Ananya Ramanathan',
      email: 'ananya@saros.tn.gov.in',
      ward: 'Ward 177 - Velachery Basin, Chennai',
      phone: '+91 98401 23456',
      agency: 'Registered Citizen'
    },
    volunteer: {
      name: 'Karthik Sivakumar',
      email: 'karthik.vol@saros.tn.gov.in',
      ward: 'Ward 175 - Adyar Basin',
      phone: '+91 94440 98765',
      agency: 'Tamil Nadu Disaster Volunteer Force (TNDVF)'
    },
    responder: {
      name: 'Commander R. Senthil Nathan',
      email: 'senthil.ndrf@saros.tn.gov.in',
      ward: 'Regional EOC Chennai South',
      phone: '+91 94421 11223',
      agency: '4th Battalion NDRF Arakkonam'
    },
    admin: {
      name: 'Dr. V. Rajeshwari IAS',
      email: 'admin.disaster@saros.tn.gov.in',
      ward: 'State EOC, Ezhilagam, Chennai',
      phone: '+91 94450 00112',
      agency: 'State Disaster Management Authority (TNSDMA)'
    }
  };

  const user = profiles[currentRole];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md p-5 space-y-4 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-rose-600 to-amber-600 flex items-center justify-center text-white font-black text-sm shadow">
              {user.name.charAt(0)}
            </div>
            <div>
              <h3 className="font-bold text-sm text-white">{user.name}</h3>
              <p className="text-[11px] text-slate-400 capitalize">{user.agency}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close Profile"
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User Details */}
        <div className="bg-slate-950/80 rounded-xl p-3 border border-slate-850 space-y-2 text-xs text-slate-300">
          <div className="flex items-center gap-2">
            <MapPin className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />
            <span className="truncate">{user.ward}</span>
          </div>
          <div className="flex items-center gap-2">
            <Phone className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
            <span className="font-mono">{user.phone}</span>
          </div>
          <div className="flex items-center gap-2">
            <Shield className="w-3.5 h-3.5 text-rose-400 flex-shrink-0" />
            <span>Role: <strong className="text-white capitalize">{currentRole}</strong></span>
          </div>
        </div>

        {/* Role Switcher */}
        <div>
          <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
            Switch Active Operating Profile:
          </label>
          <div className="grid grid-cols-2 gap-2 text-xs">
            {(['citizen', 'volunteer', 'responder', 'admin'] as UserRole[]).map((r) => (
              <button
                key={r}
                onClick={() => onRoleChange(r)}
                className={`p-2 rounded-xl border text-center font-bold capitalize transition ${
                  currentRole === r
                    ? 'bg-rose-950 text-rose-300 border-rose-600 shadow'
                    : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700'
                }`}
              >
                {r === 'admin' ? 'District Admin' : r}
              </button>
            ))}
          </div>
        </div>

        {/* Quick Settings */}
        <div className="pt-2 border-t border-slate-800 space-y-2 text-xs">
          <div className="flex items-center justify-between p-2 rounded-lg bg-slate-950 border border-slate-850">
            <span className="text-slate-300 flex items-center gap-2">
              <Globe className="w-4 h-4 text-cyan-400" />
              <span>Language</span>
            </span>
            <select
              value={language}
              onChange={(e) => onLanguageChange(e.target.value as SupportedLanguage)}
              aria-label="Profile Interface Language"
              className="bg-slate-900 text-white rounded px-2 py-1 text-xs focus:outline-none"
            >
              <option value="en">English</option>
              <option value="ta">தமிழ் (Tamil)</option>
              <option value="hi">हिंदी (Hindi)</option>
            </select>
          </div>

          <button
            onClick={onToggleOffline}
            className="w-full flex items-center justify-between p-2 rounded-lg bg-slate-950 border border-slate-850 text-slate-300 hover:text-white"
          >
            <span className="flex items-center gap-2">
              {isSimulatedOffline ? <WifiOff className="w-4 h-4 text-rose-400" /> : <Wifi className="w-4 h-4 text-emerald-400" />}
              <span>Simulate Offline Mode</span>
            </span>
            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
              isSimulatedOffline ? 'bg-rose-950 text-rose-400' : 'bg-emerald-950 text-emerald-400'
            }`}>
              {isSimulatedOffline ? 'Simulating Offline' : 'Online'}
            </span>
          </button>

          <button
            onClick={() => {
              onClose();
              onOpenDemoGuide();
            }}
            className="w-full flex items-center justify-between p-2 rounded-lg bg-slate-950 border border-slate-850 text-cyan-300 hover:bg-slate-900"
          >
            <span className="flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              <span>Master Demonstration Guide</span>
            </span>
            <span>→</span>
          </button>
        </div>

        <button
          onClick={onClose}
          className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold rounded-xl"
        >
          Close
        </button>
      </div>
    </div>
  );
};
