import React, { useState } from 'react';
import { NavView, TripDetails, TripType, TransportMode } from '../types';
import { DESTINATIONS_DIRECTORY, DestinationInfo } from '../data/destinations';
import { 
  MapPin, 
  Car, 
  Bike, 
  Bus, 
  Train, 
  User, 
  Users, 
  Briefcase, 
  Compass, 
  Mountain, 
  ShieldCheck, 
  Sparkles,
  ArrowRight,
  Luggage,
  AlertCircle
} from 'lucide-react';

interface PlanTripViewProps {
  tripDetails: TripDetails;
  setTripDetails: React.Dispatch<React.SetStateAction<TripDetails>>;
  onNavigate: (view: NavView) => void;
}

export const PlanTripView: React.FC<PlanTripViewProps> = ({
  tripDetails,
  setTripDetails,
  onNavigate,
}) => {
  const [formState, setFormState] = useState<TripDetails>(tripDetails);
  const [selectedDestinationId, setSelectedDestinationId] = useState<string>('pondicherry');

  const selectedDestObj: DestinationInfo = DESTINATIONS_DIRECTORY.find(d => d.id === selectedDestinationId) || DESTINATIONS_DIRECTORY[0];

  const travelTypes: { id: TripType; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'solo', label: 'Solo', icon: User },
    { id: 'family', label: 'Family', icon: Users },
    { id: 'friends', label: 'Friends', icon: Users },
    { id: 'business', label: 'Business', icon: Briefcase },
    { id: 'roadtrip', label: 'Road Trip', icon: Compass },
    { id: 'trekking', label: 'Trekking', icon: Mountain },
  ];

  const transportModes: { id: TransportMode; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'car', label: 'Car', icon: Car },
    { id: 'bike', label: 'Bike', icon: Bike },
    { id: 'bus', label: 'Bus', icon: Bus },
    { id: 'train', label: 'Train', icon: Train },
  ];

  const handleSelectDestination = (dest: DestinationInfo) => {
    setSelectedDestinationId(dest.id);
    setFormState(prev => ({
      ...prev,
      destination: dest.name
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTripDetails(formState);
    onNavigate('saferoutes');
  };

  return (
    <div className="space-y-4 pb-4">
      
      {/* Title */}
      <div>
        <h1 className="text-lg font-black text-white flex items-center gap-1.5 font-sans">
          <MapPin className="w-5 h-5 text-emerald-400" />
          <span>Plan Safe Trip (22+ South India Places)</span>
        </h1>
        <p className="text-slate-400 text-[11px]">
          Select destination to view required packing gear, road advisory, & safety score.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        
        {/* DESTINATION SELECTION GRID (22 Places) */}
        <div className="glass-panel p-3.5 rounded-2xl border border-emerald-500/30 space-y-2.5">
          <label className="block text-xs font-extrabold text-white flex items-center justify-between">
            <span>Select Destination ({DESTINATIONS_DIRECTORY.length} Places Available):</span>
            <span className="text-[10px] font-mono text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded">
              {selectedDestObj.category.toUpperCase()}
            </span>
          </label>

          <div className="grid grid-cols-2 gap-1.5 max-h-48 overflow-y-auto pr-1">
            {DESTINATIONS_DIRECTORY.map((dest) => {
              const isSelected = selectedDestinationId === dest.id;
              return (
                <button
                  type="button"
                  key={dest.id}
                  onClick={() => handleSelectDestination(dest)}
                  className={`p-2 rounded-xl text-left border transition-all text-xs font-bold truncate ${
                    isSelected
                      ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300 shadow-glow-cyan'
                      : 'bg-navy-900 border-slate-700/60 text-slate-300 hover:bg-slate-800/50'
                  }`}
                >
                  <span className="block truncate">{dest.name}</span>
                  <span className="text-[9px] font-mono text-slate-400 font-normal">
                    {dest.distanceFromChennaiKm} km · {dest.estTime}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* DESTINATION SPECIFIC REQUIRED GEAR & ADVISORY BOX */}
        <div className="glass-panel p-4 rounded-2xl border border-white/10 space-y-3 bg-navy-900/90">
          <div className="flex items-center justify-between border-b border-white/10 pb-2">
            <div>
              <h2 className="text-xs font-extrabold text-white flex items-center gap-1.5">
                <Luggage className="w-4 h-4 text-emerald-400" />
                <span>Required Gear for {selectedDestObj.name}</span>
              </h2>
              <p className="text-[10px] text-slate-400 font-mono mt-0.5">
                Weather: {selectedDestObj.weatherForecast} · Safety: {selectedDestObj.safetyRating}/100
              </p>
            </div>
          </div>

          <div className="space-y-1.5">
            <span className="text-[10px] font-bold text-emerald-300 uppercase tracking-wider">Mandatory Travel Items:</span>
            <div className="grid grid-cols-1 gap-1">
              {selectedDestObj.requiredGear.map((item, idx) => (
                <div key={idx} className="text-xs text-slate-200 bg-navy-950 p-2 rounded-lg border border-white/5 flex items-center gap-2">
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="p-2.5 bg-amber-950/40 border border-amber-500/30 rounded-xl text-[11px] text-amber-200 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-amber-300">Travel Advisory: </span>
              <span>{selectedDestObj.travelAdvisory}</span>
            </div>
          </div>
        </div>

        {/* Transport & Travel Mode */}
        <div className="glass-panel p-3.5 rounded-2xl border border-white/10 space-y-3">
          <div>
            <label className="block text-xs font-bold text-white mb-1.5">Mode of Transport</label>
            <div className="grid grid-cols-4 gap-2">
              {transportModes.map((m) => {
                const Icon = m.icon;
                const selected = formState.transport === m.id;
                return (
                  <button
                    type="button"
                    key={m.id}
                    onClick={() => setFormState({ ...formState, transport: m.id })}
                    className={`p-2 rounded-xl border flex flex-col items-center justify-center gap-1 text-xs font-bold transition-all ${
                      selected
                        ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300'
                        : 'bg-navy-900 border-slate-700 text-slate-400'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="text-[10px]">{m.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-white mb-1.5">Travel Type</label>
            <div className="grid grid-cols-3 gap-2">
              {travelTypes.map((t) => {
                const selected = formState.travelType === t.id;
                return (
                  <button
                    type="button"
                    key={t.id}
                    onClick={() => setFormState({ ...formState, travelType: t.id })}
                    className={`p-2 rounded-xl border text-center text-xs font-bold transition-all ${
                      selected
                        ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300'
                        : 'bg-navy-900 border-slate-700 text-slate-400'
                    }`}
                  >
                    {t.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Submit CTA */}
        <button
          type="submit"
          className="w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-extrabold text-xs rounded-xl shadow-glow-cyan flex items-center justify-center gap-2 uppercase tracking-wide"
        >
          <Sparkles className="w-4 h-4" />
          <span>Generate Safe Travel Plan</span>
          <ArrowRight className="w-4 h-4" />
        </button>

      </form>

    </div>
  );
};
