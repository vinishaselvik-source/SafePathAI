import React, { useState } from 'react';
import { Hospital, NavView } from '../types';
import { 
  Hospital as HospitalIcon, 
  AlertOctagon, 
  Phone, 
  Navigation, 
  Share2, 
  Clock, 
  ShieldCheck, 
  CheckCircle2, 
  Cross,
  Star,
  MapPin,
  X
} from 'lucide-react';

interface HospitalFinderViewProps {
  hospitals: Hospital[];
  onSelectHospitalForRoute: (hosp: Hospital) => void;
  onNavigateToMap: () => void;
}

export const HospitalFinderView: React.FC<HospitalFinderViewProps> = ({
  hospitals,
  onSelectHospitalForRoute,
  onNavigateToMap,
}) => {
  const [emergencyMode, setEmergencyMode] = useState<boolean>(false);
  const [selectedHospitalModal, setSelectedHospitalModal] = useState<Hospital | null>(null);
  const [shareNotice, setShareNotice] = useState<string | null>(null);
  const [callingPhone, setCallingPhone] = useState<string | null>(null);

  const displayHospitals = emergencyMode 
    ? [...hospitals].sort((a, b) => a.distanceKm - b.distanceKm)
    : hospitals;

  const handleCall = (phone: string, name: string) => {
    setCallingPhone(phone);
    setTimeout(() => setCallingPhone(null), 4000);
  };

  const handleShare = (hosp: Hospital) => {
    setShareNotice(`I am heading to ${hosp.name}. Emergency location & ETA (~${hosp.etaMinutes} min) shared with Safety Circle.`);
    setTimeout(() => setShareNotice(null), 4000);
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Title & Emergency Toggle */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white flex items-center gap-2">
            <HospitalIcon className="w-7 h-7 text-rose-400" />
            <span>Nearby Hospital & Emergency Finder</span>
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm mt-1">
            24/7 verified trauma centers, ICU hospitals, and ambulance services along Chennai → Pondicherry route.
          </p>
        </div>

        {/* Emergency Mode Toggle Button */}
        <button
          onClick={() => setEmergencyMode(!emergencyMode)}
          className={`px-5 py-3 rounded-2xl font-extrabold text-xs transition-all flex items-center gap-2.5 border shadow-lg ${
            emergencyMode
              ? 'bg-gradient-to-r from-rose-600 to-red-600 text-white border-rose-400 shadow-glow-rose animate-pulse'
              : 'bg-rose-950/40 text-rose-300 border-rose-500/40 hover:bg-rose-900/60'
          }`}
        >
          <AlertOctagon className="w-5 h-5 stroke-[2.5]" />
          <span>{emergencyMode ? '🚨 EMERGENCY HOSPITAL MODE ACTIVE' : '🚨 ACTIVATE EMERGENCY HELP MODE'}</span>
        </button>
      </div>

      {/* Shared/Call notices */}
      {shareNotice && (
        <div className="p-3.5 bg-cyan-950/90 border border-cyan-500/50 rounded-2xl text-xs text-cyan-300 font-semibold flex items-center gap-2 animate-in fade-in">
          <Share2 className="w-4 h-4 text-cyan-400 shrink-0" />
          <span>{shareNotice}</span>
        </div>
      )}

      {callingPhone && (
        <div className="p-3.5 bg-rose-950/90 border border-rose-500/50 rounded-2xl text-xs text-rose-300 font-semibold flex items-center justify-between animate-in zoom-in-95">
          <div className="flex items-center gap-2">
            <Phone className="w-4 h-4 text-rose-400 animate-bounce" />
            <span>Dialing Emergency Hotline: <strong>{callingPhone}</strong>...</span>
          </div>
          <span className="text-[10px] font-mono text-slate-300">Simulating Phone Call</span>
        </div>
      )}

      {/* Hospital Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {displayHospitals.map((hosp) => (
          <div
            key={hosp.id}
            className={`glass-panel p-6 rounded-3xl border transition-all flex flex-col justify-between space-y-4 ${
              hosp.distanceKm < 3.0
                ? 'border-rose-500/50 bg-navy-900/90 shadow-glow-rose'
                : 'border-white/10 hover:border-cyan-500/40'
            }`}
          >
            <div>
              {/* Header Badges */}
              <div className="flex items-center justify-between mb-3">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/20 text-rose-400 border border-rose-500/30 flex items-center gap-1">
                  <Cross className="w-3 h-3 text-rose-400" /> 24/7 EMERGENCY CARE
                </span>

                <div className="flex items-center gap-2 text-xs font-mono font-bold">
                  <span className="text-emerald-400 flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 fill-emerald-400 text-emerald-400" /> {hosp.rating}
                  </span>
                  <span className="text-cyan-300 font-bold">{hosp.distanceKm} km away</span>
                  <span className="text-slate-400">· ~{hosp.etaMinutes} min</span>
                </div>
              </div>

              {/* Hospital Title & Address */}
              <h2 className="text-lg font-extrabold text-white">{hosp.name}</h2>
              <p className="text-xs text-slate-300 mt-1 flex items-start gap-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                <span>{hosp.address}</span>
              </p>

              {/* Status pills */}
              <div className="flex flex-wrap gap-1.5 mt-3 text-[10px] font-semibold">
                <span className="px-2 py-0.5 rounded bg-emerald-950/60 text-emerald-300 border border-emerald-500/30">
                  ✅ 24x7 Available
                </span>
                <span className="px-2 py-0.5 rounded bg-cyan-950/60 text-cyan-300 border border-cyan-500/30">
                  🚑 Ambulance Standby
                </span>
                <span className="px-2 py-0.5 rounded bg-blue-950/60 text-blue-300 border border-blue-500/30">
                  🏥 ICU Ready
                </span>
              </div>

              {/* Services List */}
              <div className="mt-3 space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Available Services:</span>
                <div className="flex flex-wrap gap-1">
                  {hosp.services.map((s, idx) => (
                    <span key={idx} className="text-[11px] bg-navy-950 text-slate-300 px-2 py-0.5 rounded border border-white/5">
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              {/* Emergency Contacts */}
              <div className="mt-3 p-3 bg-navy-950/80 rounded-xl border border-white/5 text-xs font-mono space-y-1">
                <div className="flex justify-between text-slate-300">
                  <span>Emergency Hotline:</span>
                  <span className="text-rose-400 font-bold">{hosp.emergencyPhone}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Reception desk:</span>
                  <span>{hosp.receptionPhone}</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-3 border-t border-white/10 space-y-2">
              
              {/* 1-Tap Take Me There Emergency Navigation */}
              <button
                onClick={() => onSelectHospitalForRoute(hosp)}
                className="w-full py-3 bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white font-extrabold text-xs rounded-xl shadow-glow-rose transition-all flex items-center justify-center gap-2 tracking-wide uppercase"
              >
                <span>🚑 TAKE ME THERE (1-TAP EMERGENCY ROUTE)</span>
              </button>

              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => handleCall(hosp.emergencyPhone, hosp.name)}
                  className="py-2 bg-navy-800 hover:bg-navy-700 text-rose-300 border border-rose-500/30 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Call Care</span>
                </button>

                <button
                  onClick={onNavigateToMap}
                  className="py-2 bg-navy-800 hover:bg-navy-700 text-cyan-300 border border-cyan-500/30 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Navigation className="w-3.5 h-3.5" />
                  <span>View Map</span>
                </button>

                <button
                  onClick={() => handleShare(hosp)}
                  className="py-2 glass-card hover:bg-navy-800 text-slate-300 rounded-xl border border-white/10 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Share</span>
                </button>
              </div>

            </div>

          </div>
        ))}
      </div>

    </div>
  );
};
