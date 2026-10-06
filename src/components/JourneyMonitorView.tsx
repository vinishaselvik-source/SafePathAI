import React, { useState } from 'react';
import { RouteOption, CheckInPoint, NavView } from '../types';
import { 
  Navigation, 
  ShieldCheck, 
  ShieldAlert, 
  Clock, 
  Activity, 
  AlertTriangle, 
  MapPin, 
  Hospital, 
  Fuel, 
  Wifi, 
  BatteryCharging, 
  CheckCircle2, 
  RefreshCw,
  BellRing
} from 'lucide-react';

interface JourneyMonitorViewProps {
  activeRoute: RouteOption;
  checkIns: CheckInPoint[];
  onRecalculateRoute: () => void;
  onNavigate: (view: NavView) => void;
  isIncidentTriggered: boolean;
  onTriggerSimulatedIncident: () => void;
}

export const JourneyMonitorView: React.FC<JourneyMonitorViewProps> = ({
  activeRoute,
  checkIns,
  onRecalculateRoute,
  onNavigate,
  isIncidentTriggered,
  onTriggerSimulatedIncident,
}) => {
  // Safety Bubble perimeter state
  const [bubbleAlert, setBubbleAlert] = useState<boolean>(false);
  const [activeCheckInPrompt, setActiveCheckInPrompt] = useState<boolean>(false);
  const [checkInResponded, setCheckInResponded] = useState<string | null>(null);

  const handleSimulateCheckIn = () => {
    setActiveCheckInPrompt(true);
  };

  const handleCheckInResponse = (status: 'safe' | 'help') => {
    setActiveCheckInPrompt(false);
    if (status === 'safe') {
      setCheckInResponded("🟢 Confirmation received: 'I am safe'. Safety Circle updated.");
    } else {
      setCheckInResponded("🚨 Emergency Help Signal sent! Safety Circle & nearest police notified.");
    }
    setTimeout(() => setCheckInResponded(null), 4000);
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-emerald-400 animate-ping"></span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              🚗 Journey in Progress
            </h1>
          </div>
          <p className="text-slate-400 text-xs sm:text-sm mt-1">
            Chennai → Pondicherry · ECR Corridor · Real-time monitoring active.
          </p>
        </div>

        {/* Demo simulators buttons bar */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setBubbleAlert(!bubbleAlert)}
            className={`px-3 py-1.5 rounded-xl font-bold text-xs border transition-all ${
              bubbleAlert ? 'bg-amber-500/20 text-amber-300 border-amber-500/40' : 'bg-navy-800 text-slate-300 border-slate-700'
            }`}
          >
            🛡️ {bubbleAlert ? 'Clear Safety Bubble Alert' : 'Simulate Off-Route Departure'}
          </button>

          <button
            onClick={handleSimulateCheckIn}
            className="px-3 py-1.5 bg-navy-800 hover:bg-navy-700 text-cyan-300 border border-cyan-500/30 rounded-xl font-bold text-xs transition-colors flex items-center gap-1"
          >
            <BellRing className="w-3.5 h-3.5 text-cyan-400" />
            <span>Simulate Check-in Timer</span>
          </button>
        </div>
      </div>

      {/* Safety Bubble Deviation Alert Overlay */}
      {bubbleAlert && (
        <div className="p-4 bg-amber-950/80 border border-amber-500/50 rounded-2xl text-amber-200 space-y-3 animate-in zoom-in-95">
          <div className="flex items-center gap-2.5">
            <ShieldAlert className="w-6 h-6 text-amber-400 shrink-0" />
            <div>
              <h3 className="text-sm font-extrabold text-amber-300">⚠️ Safety Bubble Alert</h3>
              <p className="text-xs text-amber-200/90 mt-0.5">
                You have moved 400m away from your planned safety zone perimeter near Kovalam.
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 pt-1 text-xs font-bold">
            <button 
              onClick={() => setBubbleAlert(false)}
              className="px-4 py-1.5 bg-amber-500 text-navy-950 rounded-xl shadow-glow-rose"
            >
              Return to Planned Route
            </button>
            <button 
              onClick={() => setBubbleAlert(false)}
              className="px-4 py-1.5 bg-navy-900 border border-amber-500/40 text-amber-300 rounded-xl"
            >
              Continue Anyway
            </button>
            <button 
              onClick={() => {
                setBubbleAlert(false);
                setCheckInResponded("📍 New live location link broadcast to Safety Circle.");
                setTimeout(() => setCheckInResponded(null), 4000);
              }}
              className="px-4 py-1.5 bg-navy-900 border border-cyan-500/40 text-cyan-300 rounded-xl"
            >
              Share New Location
            </button>
          </div>
        </div>
      )}

      {/* Check-in Modal Simulator */}
      {activeCheckInPrompt && (
        <div className="p-4 bg-cyan-950/90 border border-cyan-500/50 rounded-2xl text-cyan-200 space-y-3 animate-in zoom-in-95">
          <div className="flex items-center gap-2.5">
            <BellRing className="w-6 h-6 text-cyan-400 animate-bounce" />
            <div>
              <h3 className="text-sm font-extrabold text-white">⏰ Smart Check-in Prompt</h3>
              <p className="text-xs text-slate-300">
                Scheduled check-in point: Mahabalipuram (7:30 PM). Have you reached safely?
              </p>
            </div>
          </div>
          <div className="flex gap-3 text-xs font-extrabold">
            <button 
              onClick={() => handleCheckInResponse('safe')}
              className="px-5 py-2 bg-emerald-500 hover:bg-emerald-400 text-navy-950 rounded-xl shadow-glow-cyan"
            >
              🟢 I'm Safe
            </button>
            <button 
              onClick={() => handleCheckInResponse('help')}
              className="px-5 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl shadow-glow-rose"
            >
              🆘 Need Help
            </button>
          </div>
        </div>
      )}

      {checkInResponded && (
        <div className="p-3 bg-emerald-950/80 border border-emerald-500/40 rounded-xl text-xs text-emerald-300 font-semibold">
          {checkInResponded}
        </div>
      )}

      {/* DYNAMIC ROAD HAZARD RECALCULATION ALERT BANNER */}
      <div className={`p-5 rounded-2xl border transition-all ${
        isIncidentTriggered
          ? 'bg-rose-950/40 border-rose-500/50 shadow-glow-rose'
          : 'glass-panel border-white/10'
      }`}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className={`w-10 h-10 rounded-xl border flex items-center justify-center shrink-0 ${
              isIncidentTriggered ? 'bg-rose-500/20 border-rose-500/40 text-rose-400 animate-pulse' : 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400'
            }`}>
              <AlertTriangle className="w-5 h-5" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-white uppercase tracking-wider">
                  Live Hazard Alert Status
                </span>
                {isIncidentTriggered && (
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/20 text-rose-400 border border-rose-500/30">
                    NEW INCIDENT DETECTED
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-300 mt-1">
                {isIncidentTriggered 
                  ? "⚠️ Waterlogging reported 2.1 km ahead on ECR Route B. AI recommends switching to Route C."
                  : "🟢 Route B is currently clear. Waterlogging monitored downstream."}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {!isIncidentTriggered ? (
              <button
                onClick={onTriggerSimulatedIncident}
                className="px-4 py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs rounded-xl shadow-glow-rose transition-all flex items-center gap-1.5"
              >
                <Activity className="w-4 h-4" />
                <span>Simulate Hazard Incident</span>
              </button>
            ) : (
              <button
                onClick={onRecalculateRoute}
                className="px-5 py-2.5 bg-gradient-to-r from-cyan-500 to-emerald-400 hover:from-cyan-400 hover:to-emerald-300 text-navy-950 font-extrabold text-xs rounded-xl shadow-glow-cyan transition-all flex items-center gap-2"
              >
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Recalculate Route to Route C</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Route status card */}
        <div className="glass-panel p-5 rounded-2xl border border-white/10 space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Current Status</span>
          <div className="flex items-center justify-between">
            <span className="text-base font-extrabold text-emerald-400 flex items-center gap-1.5">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" /> On Planned Route
            </span>
            <span className="text-xs font-mono font-bold text-cyan-300">{activeRoute.name.split('—')[0]}</span>
          </div>
          <div className="text-xs text-slate-300 font-mono space-y-1 pt-2 border-t border-white/5">
            <div className="flex justify-between">
              <span>ETA Arrival:</span>
              <span className="font-bold text-white">7:42 PM (~3h 15m)</span>
            </div>
            <div className="flex justify-between">
              <span>Distance Left:</span>
              <span className="font-bold text-white">151 km</span>
            </div>
          </div>
        </div>

        {/* Environment & Connectivity */}
        <div className="glass-panel p-5 rounded-2xl border border-white/10 space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Environment & Signal</span>
          <div className="grid grid-cols-2 gap-2 text-xs font-mono">
            <div className="glass-card p-2 rounded-xl border border-white/5">
              <span className="text-[10px] text-slate-400 block">Weather</span>
              <span className="font-bold text-amber-300">28°C · Moderate Rain</span>
            </div>
            <div className="glass-card p-2 rounded-xl border border-white/5">
              <span className="text-[10px] text-slate-400 block flex items-center gap-1">
                <Wifi className="w-3 h-3 text-cyan-400" /> Cellular Signal
              </span>
              <span className="font-bold text-cyan-300">Strong 5G</span>
            </div>
          </div>
          <p className="text-[10px] text-slate-400">
            ⚠️ Upcoming: 18-min low connectivity stretch near Marakkanam. Offline Pack saved.
          </p>
        </div>

        {/* Nearby Services Shortcut */}
        <div className="glass-panel p-5 rounded-2xl border border-white/10 space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Proximity Services</span>
          <div className="space-y-2 text-xs font-mono">
            <div className="flex items-center justify-between p-2 glass-card rounded-xl border border-white/5">
              <span className="flex items-center gap-1.5 text-white">
                <Hospital className="w-4 h-4 text-rose-400" /> Apollo Hospital
              </span>
              <span className="text-cyan-300 font-bold">2.4 km (8m)</span>
            </div>
            <div className="flex items-center justify-between p-2 glass-card rounded-xl border border-white/5">
              <span className="flex items-center gap-1.5 text-white">
                <Fuel className="w-4 h-4 text-amber-400" /> IndianOil Fuel
              </span>
              <span className="text-cyan-300 font-bold">1.1 km (3m)</span>
            </div>
          </div>
        </div>

      </div>

      {/* Interactive Map Button */}
      <div className="pt-2">
        <button
          onClick={() => onNavigate('livemap')}
          className="w-full py-4 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-navy-950 font-extrabold text-sm rounded-2xl shadow-glow-cyan flex items-center justify-center gap-2 uppercase tracking-wide"
        >
          <Activity className="w-5 h-5" />
          <span>Switch to Full Interactive Live Map Overlay</span>
        </button>
      </div>

    </div>
  );
};
