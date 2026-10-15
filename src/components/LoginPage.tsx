import React, { useState } from 'react';
import { 
  ShieldAlert, User, Shield, Radio, KeyRound, 
  ArrowRight, CheckCircle2, AlertTriangle, Building, 
  HeartHandshake, ChevronRight, Lock, Eye, EyeOff, Globe
} from 'lucide-react';
import { UserProfile, UserRole, SupportedLanguage } from '../types';
import { TRANSLATIONS } from '../locales/translations';

interface LoginPageProps {
  onLogin: (user: UserProfile) => void;
  language: SupportedLanguage;
  onLanguageChange: (lang: SupportedLanguage) => void;
}

export const DEMO_ACCOUNTS: Record<UserRole, UserProfile & { title: string; desc: string; badge: string; color: string; bg: string; border: string }> = {
  citizen: {
    id: 'usr-citizen-01',
    name: 'Ananya Ramanathan',
    email: 'ananya@saros.tn.gov.in',
    role: 'citizen',
    phone: '+91 98401 23456',
    ward: 'Ward 177 - Velachery Basin, Chennai',
    title: 'Registered Resident',
    desc: 'Public Safety SOS, real-time family rescue tracker, flood advisories & civic reporting',
    badge: 'CITIZEN CLEARANCE',
    color: 'text-emerald-400',
    bg: 'bg-emerald-950/40',
    border: 'border-emerald-700/50'
  },
  volunteer: {
    id: 'usr-volunteer-01',
    name: 'Karthik Sivakumar',
    email: 'karthik.vol@saros.tn.gov.in',
    role: 'volunteer',
    phone: '+91 94440 98765',
    ward: 'Ward 175 - Adyar Basin',
    agency: 'Tamil Nadu Disaster Volunteer Force (TNDVF)',
    skills: ['First Aid (CPR certified)', 'HAM Radio (VU2TNR)', 'Swimmer/Rescue Boat'],
    title: 'Disaster Volunteer (TNDVF)',
    desc: 'Field rescue task acceptance, victim welfare check-in, shelter relief distribution',
    badge: 'VOLUNTEER FORCE',
    color: 'text-amber-400',
    bg: 'bg-amber-950/40',
    border: 'border-amber-700/50'
  },
  responder: {
    id: 'usr-responder-01',
    name: 'Commander R. Senthil Nathan',
    email: 'senthil.ndrf@saros.tn.gov.in',
    role: 'responder',
    phone: '+91 94421 11223',
    badgeNumber: 'NDRF-4BN-882',
    agency: '4th Battalion NDRF Arakkonam / TN Fire & Rescue',
    ward: 'Regional EOC Chennai South',
    title: 'NDRF Incident Commander',
    desc: 'Tactical incident triage, life-saving rescue dispatch, unit deployment & status escalation',
    badge: 'TACTICAL RESPONDER',
    color: 'text-cyan-400',
    bg: 'bg-cyan-950/40',
    border: 'border-cyan-700/50'
  },
  admin: {
    id: 'usr-admin-01',
    name: 'Dr. V. Rajeshwari IAS',
    email: 'admin.disaster@saros.tn.gov.in',
    role: 'admin',
    phone: '+91 94450 00112',
    badgeNumber: 'IAS-TN-DIS-09',
    agency: 'State Disaster Management Authority (TNSDMA)',
    ward: 'State Emergency Operations Center (SEOC), Ezhilagam',
    title: 'EOC Incident Commander & District Collector',
    desc: 'Executive crisis analytics, inter-agency resource allocation, user role & audit control',
    badge: 'DISTRICT EOC ADMIN',
    color: 'text-rose-400',
    bg: 'bg-rose-950/40',
    border: 'border-rose-700/50'
  }
};

export const LoginPage: React.FC<LoginPageProps> = ({
  onLogin,
  language,
  onLanguageChange
}) => {
  const t = TRANSLATIONS[language];
  const [selectedRole, setSelectedRole] = useState<UserRole>('citizen');
  const [email, setEmail] = useState<string>(DEMO_ACCOUNTS.citizen.email);
  const [password, setPassword] = useState<string>('••••••••••••');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [rememberMe, setRememberMe] = useState<boolean>(true);
  const [isRegistering, setIsRegistering] = useState<boolean>(false);
  const [regName, setRegName] = useState<string>('');
  const [regPhone, setRegPhone] = useState<string>('');
  const [regWard, setRegWard] = useState<string>('Velachery Basin, Ward 177');

  const handleRoleCardClick = (role: UserRole) => {
    setSelectedRole(role);
    setEmail(DEMO_ACCOUNTS[role].email);
    setPassword('saros2026safe');
    setIsRegistering(false);
  };

  const handleQuickLogin = (role: UserRole) => {
    onLogin(DEMO_ACCOUNTS[role]);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isRegistering) {
      if (!regName.trim() || !regPhone.trim()) {
        alert('Please fill in your name and phone number.');
        return;
      }
      const newCitizen: UserProfile = {
        id: `usr-cit-${Date.now().toString().slice(-4)}`,
        name: regName.trim(),
        email: email || `${regName.toLowerCase().replace(/\s+/g, '')}@citizen.tn.gov.in`,
        role: 'citizen',
        phone: regPhone.trim(),
        ward: regWard
      };
      onLogin(newCitizen);
    } else {
      // Find matching demo account or use selected role
      const matched = Object.values(DEMO_ACCOUNTS).find(a => a.email.toLowerCase() === email.toLowerCase()) || DEMO_ACCOUNTS[selectedRole];
      onLogin(matched);
    }
  };

  return (
    <div className="min-h-screen bg-[#070b14] bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.15),rgba(255,255,255,0))] text-slate-100 flex flex-col justify-between selection:bg-rose-500 selection:text-white">
      {/* Top Bar with Language selector & Government seal */}
      <header className="border-b border-slate-800/80 bg-slate-950/70 backdrop-blur px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-rose-600 via-red-600 to-amber-600 flex items-center justify-center shadow-lg shadow-rose-950/50">
            <ShieldAlert className="w-5 h-5 text-white animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold tracking-wider text-base sm:text-lg bg-gradient-to-r from-red-400 via-cyan-300 to-teal-300 bg-clip-text text-transparent">
                SAROS
              </span>
              <span className="text-[10px] font-semibold text-slate-400 border border-slate-700/80 px-1.5 py-0.5 rounded bg-slate-900">
                TN-SEOC
              </span>
            </div>
            <p className="text-[10px] text-slate-400 hidden sm:block">Search and Rescue Operating System</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Language Selector */}
          <div className="flex items-center bg-slate-900 rounded-lg border border-slate-800 px-2 py-1 text-xs">
            <Globe className="w-3.5 h-3.5 text-slate-400 mr-1.5" />
            <select
              value={language}
              onChange={(e) => onLanguageChange(e.target.value as SupportedLanguage)}
              aria-label="Interface Language"
              className="bg-transparent text-slate-200 text-xs font-semibold focus:outline-none cursor-pointer"
            >
              <option value="en" className="bg-slate-900">English</option>
              <option value="ta" className="bg-slate-900">தமிழ் (Tamil)</option>
              <option value="hi" className="bg-slate-900">हिंदी (Hindi)</option>
            </select>
          </div>

          <button
            onClick={() => handleQuickLogin('citizen')}
            className="px-3 py-1 text-xs font-bold rounded-lg bg-red-600/20 text-red-400 border border-red-500/40 hover:bg-red-600/30 transition-all flex items-center gap-1.5"
          >
            <AlertTriangle className="w-3.5 h-3.5 text-red-400 animate-pulse" />
            <span>Emergency SOS Guest</span>
          </button>
        </div>
      </header>

      {/* Main Authentication Container */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-8 flex flex-col justify-center">
        {/* Title & System Identity */}
        <div className="text-center space-y-2 mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900/90 border border-slate-800 text-xs text-slate-300 shadow-inner">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="font-semibold text-slate-200">Tamil Nadu State Disaster Management Authority</span>
            <span className="text-slate-500">·</span>
            <span className="text-cyan-400 font-mono">SEOC Live Node</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white">
            Access Command Portal
          </h1>
          <p className="text-sm text-slate-400 max-w-xl mx-auto">
            Select your operational role below or sign in with your authorized credentials to access your dedicated dashboard.
          </p>
        </div>

        {/* 4 Role Selection Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {(Object.keys(DEMO_ACCOUNTS) as UserRole[]).map((role) => {
            const acc = DEMO_ACCOUNTS[role];
            const isSelected = selectedRole === role && !isRegistering;
            return (
              <div
                key={role}
                onClick={() => handleRoleCardClick(role)}
                className={`relative rounded-2xl p-4 border transition-all cursor-pointer flex flex-col justify-between group ${
                  isSelected 
                    ? `${acc.bg} ${acc.border} ring-2 ring-cyan-400/40 shadow-xl shadow-cyan-950/30 scale-[1.02]` 
                    : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900'
                }`}
              >
                {/* Clearance Badge */}
                <div className="flex items-center justify-between mb-3">
                  <span className={`text-[10px] font-black tracking-wider px-2 py-0.5 rounded-full uppercase border ${
                    isSelected ? 'bg-black/40 border-current' : 'bg-slate-950 border-slate-800 text-slate-400'
                  } ${acc.color}`}>
                    {acc.badge}
                  </span>
                  {isSelected && (
                    <CheckCircle2 className="w-4 h-4 text-cyan-400 animate-pulse" />
                  )}
                </div>

                {/* Persona Header */}
                <div className="space-y-1 mb-4">
                  <h3 className="font-bold text-base text-slate-100 group-hover:text-white flex items-center justify-between">
                    <span>{acc.name}</span>
                  </h3>
                  <div className={`text-xs font-semibold ${acc.color}`}>
                    {acc.title}
                  </div>
                  <p className="text-[11px] text-slate-400 leading-snug line-clamp-3 pt-1">
                    {acc.desc}
                  </p>
                </div>

                {/* Instant 1-Click Launch Button */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleQuickLogin(role);
                  }}
                  className={`w-full py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-md ${
                    role === 'citizen'
                      ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                      : role === 'volunteer'
                      ? 'bg-amber-600 hover:bg-amber-500 text-slate-950'
                      : role === 'responder'
                      ? 'bg-cyan-600 hover:bg-cyan-500 text-slate-950'
                      : 'bg-rose-600 hover:bg-rose-500 text-white'
                  }`}
                >
                  <span>Launch {role === 'admin' ? 'District Admin' : role.toUpperCase()}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            );
          })}
        </div>

        {/* Credentials Form Box */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 sm:p-8 max-w-xl mx-auto w-full shadow-2xl backdrop-blur-sm">
          {/* Tabs: Sign In vs Citizen Registration */}
          <div className="flex border-b border-slate-800 mb-6 pb-2">
            <button
              type="button"
              onClick={() => setIsRegistering(false)}
              className={`pb-2 px-4 text-xs sm:text-sm font-bold border-b-2 transition-all ${
                !isRegistering
                  ? 'border-cyan-400 text-cyan-300'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              Sign In with Clearance
            </button>
            <button
              type="button"
              onClick={() => {
                setIsRegistering(true);
                setSelectedRole('citizen');
              }}
              className={`pb-2 px-4 text-xs sm:text-sm font-bold border-b-2 transition-all ${
                isRegistering
                  ? 'border-emerald-400 text-emerald-300'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              New Citizen Registration
            </button>
          </div>

          <form onSubmit={handleFormSubmit} className="space-y-4">
            {isRegistering ? (
              <>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Full Legal Name
                  </label>
                  <input
                    type="text"
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    placeholder="e.g. S. Meenakshi"
                    required
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Emergency Mobile Number
                  </label>
                  <input
                    type="tel"
                    value={regPhone}
                    onChange={(e) => setRegPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    required
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Residential Ward / Location
                  </label>
                  <input
                    type="text"
                    value={regWard}
                    onChange={(e) => setRegWard(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </>
            ) : (
              <>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center justify-between">
                    <span>Authorized Official Email or ID</span>
                    <span className="text-[11px] text-cyan-400 font-mono capitalize">
                      Role: {selectedRole}
                    </span>
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-cyan-500 font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center justify-between">
                    <span>Security Password / Token</span>
                    <span className="text-[10px] text-slate-500">Default demo enabled</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-cyan-500"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="rounded bg-slate-950 border-slate-800 text-cyan-500 focus:ring-0"
                    />
                    <span>Remember authorization on this device</span>
                  </label>
                  <span className="text-slate-500">TLS 1.3 / EOC Gateway</span>
                </div>
              </>
            )}

            <button
              type="submit"
              className="w-full mt-4 py-3 rounded-xl font-extrabold text-sm bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white shadow-lg shadow-red-950/50 transition-all flex items-center justify-center gap-2"
            >
              <KeyRound className="w-4 h-4" />
              <span>{isRegistering ? 'Complete Registration & Open Dashboard' : `Authenticate & Enter ${selectedRole.toUpperCase()} Dashboard`}</span>
            </button>
          </form>

          {/* Quick evaluation notice */}
          <div className="mt-5 pt-4 border-t border-slate-800/80 text-center">
            <p className="text-[11px] text-slate-400">
              💡 <strong>Evaluation Tip:</strong> Click any of the 4 cards above to switch roles or click the colored "Launch" buttons to instantly open each role's distinct dashboard.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-4 px-4 text-center text-xs text-slate-400">
        <p>
          SAROS Search and Rescue Operating System · Department of Computer Science & Engineering · RMKCET PDL-III
        </p>
      </footer>
    </div>
  );
};
