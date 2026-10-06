import React from 'react';
import { NavView, TravelReadiness, TripDetails } from '../types';
import { DESTINATIONS_DIRECTORY } from '../data/destinations';
import { 
  Navigation, 
  MapPin, 
  CloudRain, 
  Luggage, 
  AlertTriangle, 
  Hospital, 
  ShieldCheck, 
  Play,
  ArrowRight,
  Sparkles
} from 'lucide-react';

interface DashboardViewProps {
  onNavigate: (view: NavView) => void;
  onTriggerSOS: () => void;
  onToggleOffline: () => void;
  readiness: TravelReadiness;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  tripDetails: TripDetails;
  setTripDetails: React.Dispatch<React.SetStateAction<TripDetails>>;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  onNavigate,
  onTriggerSOS,
  readiness,
  searchQuery,
  setSearchQuery,
  tripDetails,
  setTripDetails,
}) => {
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    
    const match = DESTINATIONS_DIRECTORY.find(d => 
      d.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      d.id.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const destName = match ? match.name : searchQuery.trim();
    setTripDetails(prev => ({ ...prev, destination: destName }));
    onNavigate('saferoutes');
  };

  return (
    <div className="space-y-4 pb-2">
      
      {/* Greeting Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-black text-white font-sans flex items-center gap-1.5">
            <span>Good evening, Traveler</span>
            <span className="text-lg">👋</span>
          </h1>
          <p className="text-slate-400 text-[11px]">
            Destination: {tripDetails.destination}
          </p>
        </div>

        <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
          78/100 READY
        </span>
      </div>

      {/* Destination Input Form */}
      <form onSubmit={handleSearchSubmit} className="relative">
        <MapPin className="w-4 h-4 text-emerald-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Where are you going? (e.g. Pondicherry, Chennai, Kerala)..."
          className="w-full pl-9 pr-20 py-2.5 bg-navy-900 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none focus:border-emerald-400"
        />
        <button
          type="submit"
          className="absolute right-1.5 top-1/2 -translate-y-1/2 px-2.5 py-1 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-[11px] rounded-lg transition-all"
        >
          Plan Route
        </button>
      </form>

      {/* QUICK DESTINATION CHIPS */}
      <div className="flex items-center gap-1 overflow-x-auto scrollbar-none text-[10px]">
        <span className="text-slate-400 font-mono shrink-0">Quick Dest:</span>
        {[
          { name: '🏛️ Tirunelveli', id: 'tirunelveli' },
          { name: '🌊 Pondicherry', id: 'pondicherry' },
          { name: '🏛️ Chennai', id: 'chennai' },
          { name: '🌴 Kerala', id: 'kerala-kochi' },
          { name: '🍵 Munnar', id: 'kerala-munnar' },
          { name: '🏔️ Ooty', id: 'ooty' }
        ].map((c) => (
          <button
            key={c.id}
            onClick={() => {
              setTripDetails(prev => ({ ...prev, destination: c.name }));
              onNavigate('saferoutes');
            }}
            className="px-2 py-0.5 bg-navy-850 hover:bg-navy-800 text-emerald-300 border border-emerald-500/30 rounded-md shrink-0 font-semibold"
          >
            {c.name}
          </button>
        ))}
      </div>

      {/* COMPACT DYNAMIC ACTIVE JOURNEY CARD */}
      {(() => {
        const destLower = tripDetails.destination.toLowerCase();
        const matchedObj = DESTINATIONS_DIRECTORY.find(d => 
          destLower.includes(d.id) || 
          d.name.toLowerCase().includes(destLower)
        );
        const displayKm = matchedObj ? `${matchedObj.distanceFromChennaiKm} km` : destLower.includes('tirunelveli') || destLower.includes('nellai') ? '620 km' : destLower.includes('kerala') ? '685 km' : '155 km';
        const displayEstTime = matchedObj ? matchedObj.estTime : destLower.includes('tirunelveli') || destLower.includes('nellai') ? '9h 45m' : destLower.includes('kerala') ? '11h 30m' : '3h 15m';

        return (
          <div className="glass-panel rounded-2xl p-4 border border-emerald-500/30 space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-extrabold text-white flex items-center gap-1.5">
                <Navigation className="w-4 h-4 text-emerald-400 animate-pulse" />
                <span>{tripDetails.startingPoint} → {tripDetails.destination}</span>
              </span>
              <span className="font-mono text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
                93/100 Safe
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center text-xs font-mono">
              <div className="glass-card p-2 rounded-xl border border-white/5">
                <span className="text-[9px] text-slate-400 block">Distance</span>
                <span className="font-bold text-white">{displayKm}</span>
              </div>
              <div className="glass-card p-2 rounded-xl border border-white/5">
                <span className="text-[9px] text-slate-400 block">Est Time</span>
                <span className="font-bold text-white">{displayEstTime}</span>
              </div>
              <div className="glass-card p-2 rounded-xl border border-white/5">
                <span className="text-[9px] text-slate-400 block">Weather</span>
                <span className="font-bold text-amber-300 flex items-center justify-center gap-0.5">
                  <CloudRain className="w-3 h-3 text-amber-400" /> 31°C
                </span>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => onNavigate('journeymonitor')}
                className="flex-1 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs rounded-xl shadow-glow-cyan flex items-center justify-center gap-1.5"
              >
                <Play className="w-3.5 h-3.5 fill-slate-950" />
                <span>Start Journey</span>
              </button>
              
              <button
                onClick={() => onNavigate('livemap')}
                className="px-3 py-2.5 bg-navy-800 hover:bg-navy-700 text-cyan-300 border border-cyan-500/30 text-xs font-bold rounded-xl flex items-center gap-1"
              >
                <span>View Map</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        );
      })()}

      {/* FAMOUS PLACES NEARBY PROMO BANNER */}
      <div 
        onClick={() => onNavigate('famousplaces')}
        className="glass-panel p-3.5 rounded-2xl border border-amber-500/40 bg-amber-950/20 hover:border-amber-400 transition-all cursor-pointer flex items-center justify-between group"
      >
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-extrabold text-amber-300 group-hover:underline">
              ✨ Famous Places Nearby {tripDetails.destination}
            </h3>
            <p className="text-[10px] text-slate-300">
              Explore beaches, heritage sites & tourist spots at destination
            </p>
          </div>
        </div>
        <ArrowRight className="w-4 h-4 text-amber-400 shrink-0 group-hover:translate-x-1 transition-transform" />
      </div>

      {/* QUICK ACTIONS ROW */}
      <div className="space-y-1.5">
        <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">Quick Actions:</span>
        <div className="grid grid-cols-2 gap-2">
          
          <button
            onClick={() => onNavigate('famousplaces')}
            className="glass-panel p-3 rounded-xl border border-white/5 hover:border-amber-500/40 text-left flex items-center gap-2.5"
          >
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-white">Famous Places</h3>
              <p className="text-[9px] text-slate-400">Tourist spots</p>
            </div>
          </button>

          <button
            onClick={() => onNavigate('saferoutes')}
            className="glass-panel p-3 rounded-xl border border-white/5 hover:border-emerald-500/40 text-left flex items-center gap-2.5"
          >
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-white">Safe Routes</h3>
              <p className="text-[9px] text-slate-400">Score comparison</p>
            </div>
          </button>

          <button
            onClick={() => onNavigate('checklist')}
            className="glass-panel p-3 rounded-xl border border-white/5 hover:border-teal-500/40 text-left flex items-center gap-2.5"
          >
            <div className="w-8 h-8 rounded-lg bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400 shrink-0">
              <Luggage className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-white">Check Bag</h3>
              <p className="text-[9px] text-slate-400">Required gear</p>
            </div>
          </button>

          <button
            onClick={onTriggerSOS}
            className="glass-panel p-3 rounded-xl border border-rose-500/40 bg-rose-950/30 text-left flex items-center gap-2.5"
          >
            <div className="w-8 h-8 rounded-lg bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400 shrink-0 animate-pulse">
              <AlertTriangle className="w-4 h-4 stroke-[2.5]" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-rose-300">Emergency SOS</h3>
              <p className="text-[9px] text-rose-400/80">1-Tap dispatch</p>
            </div>
          </button>

        </div>
      </div>

    </div>
  );
};
