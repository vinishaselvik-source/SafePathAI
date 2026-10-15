import React, { useState, useEffect, useRef } from 'react';
import { 
  AlertOctagon, Radio, Shield, Waves, MapPin, 
  ArrowRight, PhoneCall, Home, RefreshCw, CheckCircle2, Clock, AlertTriangle 
} from 'lucide-react';
import { SupportedLanguage, OfflineQueueItem, Shelter } from '../types';
import { TRANSLATIONS } from '../locales/translations';
import { offlineStore } from '../services/offlineStore';
import { api } from '../services/api';

interface CitizenPortalProps {
  language: SupportedLanguage;
  onTriggerSOSModal: () => void;
  onOpenCityZen: () => void;
  onOpenMap: () => void;
  onOpenShelters: () => void;
}

export const CitizenPortal: React.FC<CitizenPortalProps> = ({
  language,
  onTriggerSOSModal,
  onOpenCityZen,
  onOpenMap,
  onOpenShelters
}) => {
  const t = TRANSLATIONS[language];
  const [holdProgress, setHoldProgress] = useState<number>(0);
  const [isHolding, setIsHolding] = useState<boolean>(false);
  const [offlineQueue, setOfflineQueue] = useState<OfflineQueueItem[]>([]);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [shelters, setShelters] = useState<Shelter[]>([]);
  const holdIntervalRef = useRef<number | null>(null);

  // Load offline queue
  const loadQueue = async () => {
    const q = await offlineStore.getQueue();
    setOfflineQueue(q);
  };

  useEffect(() => {
    loadQueue();
    const unsub = offlineStore.subscribe(loadQueue);

    // Fetch shelters
    api.getShelters().then(setShelters).catch(() => {});

    return () => unsub();
  }, []);

  // Hold-to-trigger 2-second logic
  const startHold = () => {
    setIsHolding(true);
    setHoldProgress(0);

    const startTime = Date.now();
    const DURATION = 1800; // ~2 seconds

    holdIntervalRef.current = window.setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(100, (elapsed / DURATION) * 100);
      setHoldProgress(progress);

      if (progress >= 100) {
        clearInterval(holdIntervalRef.current!);
        holdIntervalRef.current = null;
        setIsHolding(false);
        setHoldProgress(0);
        onTriggerSOSModal();
      }
    }, 30);
  };

  const cancelHold = () => {
    if (holdIntervalRef.current) {
      clearInterval(holdIntervalRef.current);
      holdIntervalRef.current = null;
    }
    setIsHolding(false);
    setHoldProgress(0);
  };

  const handleManualSync = async () => {
    setIsSyncing(true);
    await offlineStore.syncPendingQueue();
    await loadQueue();
    setIsSyncing(false);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
      {/* Citizen Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-100 flex items-center gap-2">
            SAROS <span className="text-sm font-normal text-slate-400">· Ward 177</span>
          </h1>
          <p className="text-sm text-slate-400">Good evening, Ananya</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-950/80 text-emerald-400 border border-emerald-700/60">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            Ward Incident Monitoring Active
          </span>
        </div>
      </div>

      {/* Offline Queue Notice (if items exist) */}
      {offlineQueue.length > 0 && (
        <div className="p-4 rounded-xl bg-amber-950/40 border border-amber-600/50 text-amber-200 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <RefreshCw className={`w-5 h-5 text-amber-400 ${isSyncing ? 'animate-spin' : ''}`} />
              <span className="font-bold text-sm">
                {offlineQueue.length} Offline SOS Emergency Alert(s) Persisted in Device IndexedDB
              </span>
            </div>
            <button
              onClick={handleManualSync}
              disabled={isSyncing || !offlineStore.isOnline()}
              className="px-3 py-1 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 font-bold text-xs rounded-md shadow transition"
            >
              {isSyncing ? 'Syncing...' : 'Sync to Server'}
            </button>
          </div>
          <div className="space-y-1.5 text-xs text-amber-300/90 divide-y divide-amber-900/40">
            {offlineQueue.map((item) => (
              <div key={item.clientIncidentId} className="pt-1.5 flex items-center justify-between">
                <span>
                  <strong>{item.category}:</strong> {item.description}
                </span>
                <span className="px-2 py-0.5 rounded bg-amber-900/80 font-mono text-[10px] uppercase font-semibold">
                  {item.syncStatus}
                </span>
              </div>
            ))}
          </div>
          <p className="text-[11px] text-amber-400/80">
            * Records survive browser refresh. Will automatically sync to EOC central server once online or relayed via mesh gateway.
          </p>
        </div>
      )}

      {/* LIFE-THREATENING EMERGENCY RESCUE CARD (Figure 3.1) */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-rose-950/40 border border-rose-900/50 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
        <div className="flex items-center gap-2 mb-4">
          <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse" />
          <h2 className="text-xs sm:text-sm font-extrabold tracking-wider text-rose-400 uppercase">
            {t.sosCardTitle}
          </h2>
        </div>

        {/* 2-Second Hold Button */}
        <div className="relative my-4">
          <div 
            style={{ width: `${holdProgress}%` }}
            className="absolute inset-0 bg-red-500/30 rounded-xl transition-all pointer-events-none"
          />
          <button
            onMouseDown={startHold}
            onMouseUp={cancelHold}
            onMouseLeave={cancelHold}
            onTouchStart={startHold}
            onTouchEnd={cancelHold}
            onClick={onTriggerSOSModal}
            className={`w-full py-5 px-6 rounded-xl text-white font-black text-lg sm:text-xl tracking-wider transition-all duration-150 shadow-2xl relative select-none flex flex-col items-center justify-center gap-1 border-2 ${
              isHolding
                ? 'bg-red-700 border-red-400 scale-[0.99] shadow-red-600/50 ring-4 ring-red-500/40'
                : 'bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-500 hover:to-rose-600 border-red-500 shadow-red-950/80'
            }`}
          >
            <div className="flex items-center gap-2">
              <AlertOctagon className="w-6 h-6 animate-pulse" />
              <span>{t.sosButtonText}</span>
            </div>
            <span className="text-xs font-semibold text-rose-100/90 tracking-normal uppercase">
              {isHolding ? `HOLDING... ${Math.round(holdProgress)}%` : t.sosButtonSubtext}
            </span>
          </button>
        </div>

        {/* Subtext link to Civic Infrastructure */}
        <div className="flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 mt-4 pt-3 border-t border-slate-800 gap-2">
          <span>{t.notInDanger}</span>
          <button
            onClick={onOpenCityZen}
            className="text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1 transition"
          >
            {t.reportCivicLink}
          </button>
        </div>
      </div>

      {/* ACTIVE SOS CARD (Figure 3.1) */}
      <div className="bg-rose-950/20 border border-rose-800/40 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="p-2.5 rounded-lg bg-rose-600/20 text-rose-400 border border-rose-600/40 mt-0.5">
            <Radio className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-rose-500" />
              <h3 className="text-sm font-bold text-rose-300">
                {t.activeSosTitle}
              </h3>
            </div>
            <p className="text-xs text-slate-300 mt-1">
              {t.activeSosStatus}
            </p>
          </div>
        </div>
        <button
          onClick={onOpenMap}
          className="self-start sm:self-auto px-4 py-2 bg-red-600 hover:bg-red-500 text-white font-bold text-xs rounded-lg shadow-lg transition flex items-center gap-1.5 whitespace-nowrap"
        >
          {t.trackLive}
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* REGIONAL ADVISORY BANNER (Figure 3.1) */}
      <div className="bg-red-950/40 border border-red-700/60 rounded-xl p-4 space-y-4 shadow-lg">
        <div className="flex items-center justify-between border-b border-red-800/50 pb-2">
          <div className="flex items-center gap-2 text-rose-300 font-bold text-xs uppercase tracking-wider">
            <AlertTriangle className="w-4 h-4 text-rose-400" />
            <span>{t.officialAdvisoryBanner}</span>
          </div>
          <button 
            onClick={onOpenMap}
            className="text-xs text-rose-300 hover:underline font-semibold"
          >
            {t.details}
          </button>
        </div>

        {/* Hazard Status Details */}
        <div>
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="font-extrabold text-slate-200 tracking-wider">
              {t.myAreaHazardStatus}
            </span>
            <span className="px-2 py-0.5 rounded bg-slate-800 text-teal-300 border border-slate-700 font-semibold">
              {t.confidenceHigh}
            </span>
          </div>
          <div className="text-[11px] text-slate-400 flex items-center gap-1 mb-3">
            <Clock className="w-3 h-3 text-slate-400" />
            <span>{t.updatedAgo}</span>
          </div>

          <div className="p-3 rounded-lg bg-slate-900/90 border border-slate-800 flex items-start gap-3">
            <div className="p-2 rounded bg-cyan-950 text-cyan-400 border border-cyan-800">
              <Waves className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-slate-100">
                  {t.floodAdvisoryTitle}
                </h4>
                <span className="px-2 py-0.5 rounded bg-red-950 text-red-400 border border-red-700 font-mono text-xs font-bold">
                  {t.advisoryIndex}
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">
                {t.floodAdvisoryAction}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Nearby Shelters Snapshot */}
      <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-5 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-slate-200 font-bold text-sm">
            <Home className="w-4 h-4 text-emerald-400" />
            <span>Emergency Relief Centers Nearby</span>
          </div>
          <button
            onClick={onOpenShelters}
            className="text-xs text-emerald-400 hover:underline font-semibold"
          >
            View All ({shelters.length}) →
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {shelters.slice(0, 2).map((shelter) => (
            <div 
              key={shelter.id}
              className="p-3 rounded-lg bg-slate-950/70 border border-slate-800/80 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-xs text-slate-100 truncate">{shelter.name}</h4>
                  <span className="px-1.5 py-0.5 text-[10px] rounded font-bold bg-emerald-950 text-emerald-400 border border-emerald-800">
                    {shelter.status}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 mt-1 line-clamp-1">{shelter.location.address}</p>
              </div>
              <div className="mt-3 pt-2 border-t border-slate-800/60 flex items-center justify-between text-xs text-slate-300">
                <span>Occupancy: {shelter.currentOccupancy} / {shelter.capacity}</span>
                <span className="text-teal-400 font-mono text-[11px]">{shelter.contactPhone}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Emergency Helplines Quick Call */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
        <a 
          href="tel:112"
          className="p-2.5 rounded-lg bg-slate-900 hover:bg-slate-850 border border-slate-800 text-slate-200 font-semibold flex items-center justify-center gap-1.5 transition"
        >
          <PhoneCall className="w-3.5 h-3.5 text-rose-400" />
          <span>112 (National SOS)</span>
        </a>
        <a 
          href="tel:1070"
          className="p-2.5 rounded-lg bg-slate-900 hover:bg-slate-850 border border-slate-800 text-slate-200 font-semibold flex items-center justify-center gap-1.5 transition"
        >
          <PhoneCall className="w-3.5 h-3.5 text-cyan-400" />
          <span>1070 (State EOC)</span>
        </a>
        <a 
          href="tel:1077"
          className="p-2.5 rounded-lg bg-slate-900 hover:bg-slate-850 border border-slate-800 text-slate-200 font-semibold flex items-center justify-center gap-1.5 transition"
        >
          <PhoneCall className="w-3.5 h-3.5 text-teal-400" />
          <span>1077 (District Control)</span>
        </a>
        <a 
          href="tel:1913"
          className="p-2.5 rounded-lg bg-slate-900 hover:bg-slate-850 border border-slate-800 text-slate-200 font-semibold flex items-center justify-center gap-1.5 transition"
        >
          <PhoneCall className="w-3.5 h-3.5 text-amber-400" />
          <span>1913 (GCC Flood Desk)</span>
        </a>
      </div>
    </div>
  );
};
