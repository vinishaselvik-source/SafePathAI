import React from 'react';
import { 
  ShieldAlert, Wifi, WifiOff, Globe, 
  MapPin, BookOpen, Download, Smartphone, Monitor, LogOut, UserCircle 
} from 'lucide-react';
import { UserRole, SupportedLanguage } from '../types';
import { TRANSLATIONS } from '../locales/translations';

interface NavbarProps {
  currentRole: UserRole;
  currentUserName?: string;
  onRoleChange: (role: UserRole) => void;
  isSimulatedOffline: boolean;
  onToggleSimulatedOffline: () => void;
  isOnline: boolean;
  language: SupportedLanguage;
  onLanguageChange: (lang: SupportedLanguage) => void;
  onOpenDemoGuide: () => void;
  onSignOut: () => void;
  isMobileSimulated?: boolean;
  onToggleMobileSimulated?: () => void;
  onInstallApp?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentRole,
  currentUserName,
  onRoleChange,
  isSimulatedOffline,
  onToggleSimulatedOffline,
  isOnline,
  language,
  onLanguageChange,
  onOpenDemoGuide,
  onSignOut,
  isMobileSimulated = false,
  onToggleMobileSimulated,
  onInstallApp
}) => {
  const t = TRANSLATIONS[language];

  const roleStyles: Record<UserRole, { label: string; color: string; badge: string }> = {
    citizen: { label: t.roleCitizen, color: 'text-emerald-400 bg-emerald-950/60 border-emerald-700/80', badge: 'CITIZEN' },
    volunteer: { label: t.roleVolunteer, color: 'text-amber-400 bg-amber-950/60 border-amber-700/80', badge: 'VOLUNTEER' },
    responder: { label: t.roleResponder, color: 'text-cyan-400 bg-cyan-950/60 border-cyan-700/80', badge: 'RESPONDER' },
    admin: { label: t.roleAdmin, color: 'text-rose-400 bg-rose-950/60 border-rose-700/80', badge: 'DISTRICT ADMIN' }
  };

  return (
    <header className="sticky top-0 z-40 bg-slate-950/95 backdrop-blur border-b border-slate-800 text-slate-100 shadow-xl">
      {/* Sleek Emergency Operations Top Header */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs">
        {/* Left: Brand + Location Tag */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-rose-600 via-red-600 to-amber-600 flex items-center justify-center shadow-lg shadow-red-950/50">
              <ShieldAlert className="w-5 h-5 text-white animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold tracking-wider text-base bg-gradient-to-r from-red-400 via-cyan-300 to-teal-300 bg-clip-text text-transparent">
                  SAROS
                </span>
                <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 tracking-wider">
                  {t.demoMode}
                </span>
              </div>
            </div>
          </div>

          <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800 text-slate-300">
            <MapPin className="w-3.5 h-3.5 text-cyan-400" />
            <span>Velachery Basin, Ward 177</span>
          </div>
        </div>

        {/* Center: Current User Persona & Role Switcher */}
        <div className="flex items-center gap-2">
          {/* Active User Pill */}
          <div className={`hidden sm:flex items-center gap-2 px-2.5 py-1 rounded-lg border ${roleStyles[currentRole].color}`}>
            <UserCircle className="w-4 h-4" />
            <div className="flex flex-col text-left">
              <span className="text-[11px] font-bold leading-tight text-white">
                {currentUserName || 'Operator'}
              </span>
              <span className="text-[9px] font-extrabold tracking-wider uppercase opacity-90">
                {roleStyles[currentRole].badge}
              </span>
            </div>
          </div>

          {/* Quick Role Switcher Buttons */}
          <div className="flex items-center bg-slate-900 p-0.5 rounded-lg border border-slate-800">
            {(['citizen', 'volunteer', 'responder', 'admin'] as UserRole[]).map((r) => (
              <button
                key={r}
                onClick={() => onRoleChange(r)}
                title={`Switch to ${r} dashboard`}
                className={`px-2.5 py-1 text-xs font-semibold rounded transition-all capitalize ${
                  currentRole === r
                    ? 'bg-slate-700 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {r === 'admin' ? 'District Admin' : r}
              </button>
            ))}
          </div>
        </div>

        {/* Right: Controls (Simulate Offline, Online status, Language, Guide, Sign Out) */}
        <div className="flex items-center gap-2">
          {/* Simulate Offline toggle button */}
          <button
            onClick={onToggleSimulatedOffline}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium border transition-colors ${
              isSimulatedOffline 
                ? 'bg-rose-950/80 text-rose-300 border-rose-700 hover:bg-rose-900' 
                : 'bg-slate-900 text-slate-300 border-slate-800 hover:bg-slate-800'
            }`}
            title="Simulate network loss to test offline IndexedDB queue and mesh routing"
          >
            {isSimulatedOffline ? <WifiOff className="w-3.5 h-3.5 text-rose-400" /> : <Wifi className="w-3.5 h-3.5 text-teal-400" />}
            <span className="hidden md:inline">{isSimulatedOffline ? 'Simulating Offline' : t.simulateOffline}</span>
          </button>

          {/* Connection status indicator */}
          <div className={`flex items-center gap-1 px-2 py-1 rounded text-xs font-semibold ${
            isOnline ? 'text-teal-400 bg-teal-950/50' : 'text-rose-400 bg-rose-950/50'
          }`}>
            <span className={`w-2 h-2 rounded-full ${isOnline ? 'bg-teal-400 animate-pulse' : 'bg-rose-400'}`} />
            <span className="hidden sm:inline">{isOnline ? t.online : t.offline}</span>
          </div>

          {/* Language Selector */}
          <div className="flex items-center bg-slate-900 rounded-md border border-slate-800 text-xs">
            <Globe className="w-3.5 h-3.5 ml-2 text-slate-400" />
            <select
              value={language}
              onChange={(e) => onLanguageChange(e.target.value as SupportedLanguage)}
              aria-label="Select Interface Language"
              className="bg-transparent text-slate-200 py-1 pl-1 pr-2 text-xs font-semibold focus:outline-none cursor-pointer"
            >
              <option value="en" className="bg-slate-900">EN</option>
              <option value="ta" className="bg-slate-900">தமிழ்</option>
              <option value="hi" className="bg-slate-900">हिंदी</option>
            </select>
          </div>

          {/* Mobile / Desktop Simulator Toggle */}
          {onToggleMobileSimulated && (
            <button
              onClick={onToggleMobileSimulated}
              className={`hidden sm:flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium border transition-colors ${
                isMobileSimulated
                  ? 'bg-rose-950 text-rose-300 border-rose-600'
                  : 'bg-slate-900 text-slate-300 border-slate-800 hover:bg-slate-850'
              }`}
              title="Toggle mobile device frame"
            >
              {isMobileSimulated ? <Monitor className="w-3.5 h-3.5" /> : <Smartphone className="w-3.5 h-3.5" />}
              <span className="hidden md:inline">{isMobileSimulated ? 'Desktop' : 'Mobile'}</span>
            </button>
          )}

          {/* Demo Guide */}
          <button
            onClick={onOpenDemoGuide}
            className="flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium bg-cyan-950/70 text-cyan-300 border border-cyan-700/60 hover:bg-cyan-900 transition-colors"
            title="Demonstration Guide"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span className="hidden lg:inline">{t.demoGuide}</span>
          </button>

          {/* Sign Out Button */}
          <button
            onClick={onSignOut}
            className="flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-bold bg-slate-900 text-rose-400 border border-slate-800 hover:bg-rose-950/60 hover:border-rose-700 transition-colors"
            title="Sign out to Login Screen"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Sign Out</span>
          </button>
        </div>
      </div>
    </header>
  );
};
