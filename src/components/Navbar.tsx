import { 
  ShieldAlert, Radio, Wifi, WifiOff, Globe, 
  BatteryCharging, MapPin, AlertTriangle, BookOpen, UserCircle, Download, Smartphone, Monitor 
} from 'lucide-react';
import { UserRole, SupportedLanguage } from '../types';
import { TRANSLATIONS } from '../locales/translations';

interface NavbarProps {
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  isSimulatedOffline: boolean;
  onToggleSimulatedOffline: () => void;
  isOnline: boolean;
  language: SupportedLanguage;
  onLanguageChange: (lang: SupportedLanguage) => void;
  onOpenDemoGuide: () => void;
  activeTab: string;
  onSelectTab: (tab: string) => void;
  isMobileSimulated?: boolean;
  onToggleMobileSimulated?: () => void;
  onInstallApp?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentRole,
  onRoleChange,
  isSimulatedOffline,
  onToggleSimulatedOffline,
  isOnline,
  language,
  onLanguageChange,
  onOpenDemoGuide,
  activeTab,
  onSelectTab,
  isMobileSimulated = false,
  onToggleMobileSimulated,
  onInstallApp
}) => {
  const t = TRANSLATIONS[language];

  const roleLabels: Record<UserRole, { label: string; color: string }> = {
    citizen: { label: t.roleCitizen, color: 'text-emerald-400 bg-emerald-950/60 border-emerald-700' },
    volunteer: { label: t.roleVolunteer, color: 'text-amber-400 bg-amber-950/60 border-amber-700' },
    responder: { label: t.roleResponder, color: 'text-cyan-400 bg-cyan-950/60 border-cyan-700' },
    admin: { label: t.roleAdmin, color: 'text-rose-400 bg-rose-950/60 border-rose-700' }
  };

  return (
    <header className="sticky top-0 z-40 bg-slate-950/95 backdrop-blur border-b border-slate-800 text-slate-100 shadow-xl">
      {/* Top Banner Bar */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2 flex flex-wrap items-center justify-between gap-2 border-b border-slate-850 text-xs">
        {/* Left: Brand + Demo Badge + Location */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-rose-600 via-red-600 to-amber-600 flex items-center justify-center shadow-lg shadow-red-950/50">
              <ShieldAlert className="w-5 h-5 text-white" />
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

          <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800 text-slate-300">
            <MapPin className="w-3.5 h-3.5 text-cyan-400" />
            <span>Velachery Basin, Chennai (Ward 177)</span>
          </div>
        </div>

        {/* Center: Role Switcher */}
        <div className="flex items-center bg-slate-900 p-0.5 rounded-lg border border-slate-800">
          <span className="hidden sm:inline px-2 text-[11px] font-medium text-slate-400">Role:</span>
          {(['citizen', 'volunteer', 'responder', 'admin'] as UserRole[]).map((r) => (
            <button
              key={r}
              onClick={() => onRoleChange(r)}
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

        {/* Right: Controls (Simulate Offline, Online status, Language, Guide) */}
        <div className="flex items-center gap-2">
          {/* Simulate Offline toggle button */}
          <button
            onClick={onToggleSimulatedOffline}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium border transition-colors ${
              isSimulatedOffline 
                ? 'bg-rose-950/80 text-rose-300 border-rose-700 hover:bg-rose-900' 
                : 'bg-slate-900 text-slate-300 border-slate-800 hover:bg-slate-800'
            }`}
            title="Simulate complete network loss to test offline IndexedDB queue and mesh routing"
          >
            {isSimulatedOffline ? <WifiOff className="w-3.5 h-3.5 text-rose-400" /> : <Wifi className="w-3.5 h-3.5 text-teal-400" />}
            <span className="hidden sm:inline">{isSimulatedOffline ? 'Simulating Offline' : t.simulateOffline}</span>
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

          {/* Install PWA App Button (Figure 3.1) */}
          <button
            onClick={onInstallApp}
            className="hidden sm:flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold bg-emerald-950/70 text-emerald-300 border border-emerald-700/60 hover:bg-emerald-900 transition-colors shadow-sm"
            title="Install SAROS as native standalone PWA on Android, iOS, or Desktop"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{t.installApp}</span>
          </button>

          {/* Mobile / Desktop Simulator Toggle */}
          {onToggleMobileSimulated && (
            <button
              onClick={onToggleMobileSimulated}
              className={`hidden md:flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium border transition-colors ${
                isMobileSimulated
                  ? 'bg-rose-950 text-rose-300 border-rose-600'
                  : 'bg-slate-900 text-slate-300 border-slate-800 hover:bg-slate-850'
              }`}
              title="Toggle mobile device frame"
            >
              {isMobileSimulated ? <Monitor className="w-3.5 h-3.5" /> : <Smartphone className="w-3.5 h-3.5" />}
              <span>{isMobileSimulated ? 'Desktop' : 'Mobile View'}</span>
            </button>
          )}

          {/* Demo Guide */}
          <button
            onClick={onOpenDemoGuide}
            className="flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium bg-cyan-950/70 text-cyan-300 border border-cyan-700/60 hover:bg-cyan-900 transition-colors"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span className="hidden md:inline">{t.demoGuide}</span>
          </button>
        </div>
      </div>

      {/* Main Navigation Tabs */}
      <nav className="max-w-7xl mx-auto px-3 sm:px-6 flex items-center gap-1 overflow-x-auto py-1.5 scrollbar-none text-xs sm:text-sm font-medium">
        <button
          onClick={() => onSelectTab('home')}
          className={`px-3 py-1.5 rounded-md whitespace-nowrap transition-colors ${
            activeTab === 'home'
              ? 'bg-red-600/20 text-red-400 border border-red-500/30 font-semibold'
              : 'text-slate-300 hover:text-white hover:bg-slate-900'
          }`}
        >
          {t.navHome}
        </button>

        <button
          onClick={() => onSelectTab('map')}
          className={`px-3 py-1.5 rounded-md whitespace-nowrap transition-colors ${
            activeTab === 'map'
              ? 'bg-cyan-600/20 text-cyan-300 border border-cyan-500/30 font-semibold'
              : 'text-slate-300 hover:text-white hover:bg-slate-900'
          }`}
        >
          {t.navRiskMap}
        </button>

        <button
          onClick={() => onSelectTab('mesh')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md whitespace-nowrap transition-colors ${
            activeTab === 'mesh'
              ? 'bg-amber-600/20 text-amber-300 border border-amber-500/30 font-semibold'
              : 'text-slate-300 hover:text-white hover:bg-slate-900'
          }`}
        >
          <Radio className="w-3.5 h-3.5 text-amber-400" />
          {t.navMesh}
        </button>

        <button
          onClick={() => onSelectTab('control')}
          className={`px-3 py-1.5 rounded-md whitespace-nowrap transition-colors ${
            activeTab === 'control'
              ? 'bg-teal-600/20 text-teal-300 border border-teal-500/30 font-semibold'
              : 'text-slate-300 hover:text-white hover:bg-slate-900'
          }`}
        >
          {currentRole === 'admin' ? 'District Admin Room' : t.navAlerts}
        </button>

        <button
          onClick={() => onSelectTab('cityzen')}
          className={`px-3 py-1.5 rounded-md whitespace-nowrap transition-colors ${
            activeTab === 'cityzen'
              ? 'bg-blue-600/20 text-blue-300 border border-blue-500/30 font-semibold'
              : 'text-slate-300 hover:text-white hover:bg-slate-900'
          }`}
        >
          {t.navCityZen}
        </button>

        <button
          onClick={() => onSelectTab('preparedness')}
          className={`px-3 py-1.5 rounded-md whitespace-nowrap transition-colors ${
            activeTab === 'preparedness'
              ? 'bg-emerald-600/20 text-emerald-300 border border-emerald-500/30 font-semibold'
              : 'text-slate-300 hover:text-white hover:bg-slate-900'
          }`}
        >
          {t.navPreparedness}
        </button>
      </nav>
    </header>
  );
};
