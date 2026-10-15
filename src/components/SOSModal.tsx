import React, { useState } from 'react';
import { 
  X, AlertOctagon, MapPin, Users, HeartPulse, 
  Flame, Waves, HelpCircle, WifiOff, CheckCircle2, ShieldAlert 
} from 'lucide-react';
import { IncidentCategory, IncidentPriority, SupportedLanguage } from '../types';
import { TRANSLATIONS } from '../locales/translations';
import { offlineStore } from '../services/offlineStore';
import { api } from '../services/api';

interface SOSModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: SupportedLanguage;
  onIncidentCreated: () => void;
  defaultLocation?: { lat: number; lng: number; address: string; ward?: string };
}

export const SOSModal: React.FC<SOSModalProps> = ({
  isOpen,
  onClose,
  language,
  onIncidentCreated,
  defaultLocation = {
    lat: 12.9815,
    lng: 80.2180,
    address: 'Bhuvaneshwari Nagar, Velachery, Chennai',
    ward: 'Ward 177'
  }
}) => {
  const t = TRANSLATIONS[language];

  const [category, setCategory] = useState<IncidentCategory>('FLOOD');
  const [description, setDescription] = useState<string>('');
  const [peopleCount, setPeopleCount] = useState<number>(2);
  const [priority, setPriority] = useState<IncidentPriority>('CRITICAL');
  const [address, setAddress] = useState<string>(defaultLocation.address);
  const [lat, setLat] = useState<number>(defaultLocation.lat);
  const [lng, setLng] = useState<number>(defaultLocation.lng);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const categories: Array<{ id: IncidentCategory; label: string; icon: any; color: string }> = [
    { id: 'FLOOD', label: t.catFlood, icon: Waves, color: 'text-cyan-400 border-cyan-800 bg-cyan-950/40' },
    { id: 'MEDICAL', label: t.catMedical, icon: HeartPulse, color: 'text-rose-400 border-rose-800 bg-rose-950/40' },
    { id: 'FOOD_WATER', label: t.catFoodWater, icon: HelpCircle, color: 'text-amber-400 border-amber-800 bg-amber-950/40' },
    { id: 'FIRE', label: t.catFire, icon: Flame, color: 'text-orange-400 border-orange-800 bg-orange-950/40' },
    { id: 'TRAPPED', label: t.catTrapped, icon: AlertOctagon, color: 'text-red-400 border-red-800 bg-red-950/40' },
    { id: 'OTHER', label: t.catOther, icon: ShieldAlert, color: 'text-slate-300 border-slate-700 bg-slate-900' }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!description.trim()) {
      setErrorMsg('Please describe your emergency situation.');
      return;
    }

    setIsSubmitting(true);
    const clientIncidentId = `SOS-CLIENT-${Date.now()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

    try {
      const isOnline = offlineStore.isOnline();

      if (!isOnline) {
        // Enqueue to IndexedDB
        await offlineStore.enqueueSOS({
          clientIncidentId,
          category,
          description,
          location: { lat, lng, address, ward: defaultLocation.ward },
          peopleCount,
          priority,
          userName: 'Ananya Ramanathan (Citizen)',
          userId: 'usr-citizen-01'
        });

        setSubmitSuccess('SOS STORED OFFLINE: Saved securely in IndexedDB. Will sync automatically upon reconnection.');
      } else {
        // Direct online submission
        const result = await api.createIncident({
          clientIncidentId,
          category,
          description,
          location: { lat, lng, address, ward: defaultLocation.ward },
          peopleCount,
          priority,
          submissionMethod: 'ONLINE_DIRECT',
          meshHops: 0,
          userName: 'Ananya Ramanathan (Citizen)'
        });

        setSubmitSuccess(`SOS BROADCAST SUCCESSFUL: Incident ${result.incident.id} registered with State EOC.`);
      }

      onIncidentCreated();
      setTimeout(() => {
        setIsSubmitting(false);
        setSubmitSuccess(null);
        onClose();
      }, 2000);
    } catch (err: any) {
      console.error('Submission failed:', err);
      // Fallback: enqueue locally if network call failed
      await offlineStore.enqueueSOS({
        clientIncidentId,
        category,
        description,
        location: { lat, lng, address, ward: defaultLocation.ward },
        peopleCount,
        priority,
        userName: 'Ananya Ramanathan (Citizen)',
        userId: 'usr-citizen-01'
      });

      setSubmitSuccess('NETWORK ERROR -> FALLBACK: SOS queued into local IndexedDB safely.');
      onIncidentCreated();
      setTimeout(() => {
        setIsSubmitting(false);
        setSubmitSuccess(null);
        onClose();
      }, 2500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden my-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-red-950 via-slate-900 to-slate-900 p-5 border-b border-red-900/40 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-red-600/30 text-red-400 border border-red-600/50">
              <AlertOctagon className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h2 className="text-lg font-black text-white">{t.modalSosTitle}</h2>
              <p className="text-xs text-slate-400">{t.modalSosSubtitle}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close SOS Modal"
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Offline Warning Banner if disconnected */}
        {!offlineStore.isOnline() && (
          <div className="bg-amber-950/80 border-b border-amber-700/60 p-3 px-5 flex items-center gap-2.5 text-xs text-amber-200">
            <WifiOff className="w-4 h-4 text-amber-400 flex-shrink-0" />
            <span>{t.offlineQueueNotice}</span>
          </div>
        )}

        {/* Success Alert */}
        {submitSuccess && (
          <div className="m-5 p-4 rounded-xl bg-emerald-950/80 border border-emerald-600/60 text-emerald-300 text-xs font-bold flex items-center gap-2.5 animate-fadeIn">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
            <span>{submitSuccess}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
          {errorMsg && (
            <div className="p-3 rounded-lg bg-rose-950/80 border border-rose-700 text-rose-300 font-semibold">
              {errorMsg}
            </div>
          )}

          {/* Category Selector */}
          <div>
            <label className="block text-slate-300 font-bold mb-2">
              {t.categoryLabel} *
            </label>
            <div className="grid grid-cols-2 gap-2">
              {categories.map((cat) => {
                const Icon = cat.icon;
                const isSelected = category === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setCategory(cat.id)}
                    className={`p-2.5 rounded-lg border text-left flex items-center gap-2 transition ${
                      isSelected
                        ? `${cat.color} ring-2 ring-red-500 font-bold`
                        : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <Icon className="w-4 h-4 flex-shrink-0" />
                    <span className="truncate">{cat.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-slate-300 font-bold mb-1.5">
              {t.descLabel} *
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={t.descPlaceholder}
              className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-red-500"
              required
            />
          </div>

          {/* Location */}
          <div>
            <label className="block text-slate-300 font-bold mb-1.5">
              {t.locationLabel}
            </label>
            <div className="space-y-2">
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-300">
                <MapPin className="w-4 h-4 text-red-400 flex-shrink-0" />
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="bg-transparent flex-1 text-slate-200 focus:outline-none"
                  placeholder="Address or landmark"
                />
              </div>
              <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-400">
                <div className="px-2.5 py-1.5 rounded bg-slate-950/50 border border-slate-850">
                  Latitude: <strong className="text-slate-200">{lat.toFixed(4)}</strong>
                </div>
                <div className="px-2.5 py-1.5 rounded bg-slate-950/50 border border-slate-850">
                  Longitude: <strong className="text-slate-200">{lng.toFixed(4)}</strong>
                </div>
              </div>
            </div>
          </div>

          {/* People Count & Priority */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-bold mb-1.5 flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-cyan-400" />
                <span>{t.peopleCountLabel}</span>
              </label>
              <input
                type="number"
                min={1}
                max={100}
                value={peopleCount}
                onChange={(e) => setPeopleCount(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-bold mb-1.5">
                {t.priorityLabel}
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as IncidentPriority)}
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none focus:border-red-500"
              >
                <option value="CRITICAL">🔴 CRITICAL (Immediate Life Threat)</option>
                <option value="HIGH">🟠 HIGH (Urgent Rescue Required)</option>
                <option value="MEDIUM">🟡 MEDIUM (Relief & Medical)</option>
              </select>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-3">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 px-4 rounded-xl font-black text-sm uppercase tracking-wider text-white bg-gradient-to-r from-red-600 via-rose-600 to-red-700 hover:from-red-500 hover:to-rose-600 shadow-xl shadow-red-950/80 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <AlertOctagon className="w-4 h-4" />
              <span>{isSubmitting ? 'Transmitting Alert...' : t.submitSosBtn}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
