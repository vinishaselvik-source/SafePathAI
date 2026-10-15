import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, Waves, Wind, Activity, Sun, 
  Home, CheckSquare, Square, PhoneCall, MapPin, Truck, AlertCircle, RefreshCw 
} from 'lucide-react';
import { DisasterPlan, Shelter, Resource, SupportedLanguage } from '../types';
import { api } from '../services/api';

interface PreparednessViewProps {
  language: SupportedLanguage;
}

export const PreparednessView: React.FC<PreparednessViewProps> = ({ language }) => {
  const [plans, setPlans] = useState<DisasterPlan[]>([]);
  const [shelters, setShelters] = useState<Shelter[]>([]);
  const [resources, setResources] = useState<Resource[]>([]);
  const [activeTab, setActiveTab] = useState<'plans' | 'shelters' | 'resources'>('plans');
  const [selectedHazard, setSelectedHazard] = useState<string>('FLOOD');
  const [checkedSteps, setCheckedSteps] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    Promise.all([
      api.getDisasterPlans(),
      api.getShelters(),
      api.getResources().catch(() => []) // Allowed for volunteer/responder/admin
    ]).then(([p, s, r]) => {
      setPlans(p);
      setShelters(s);
      setResources(r);
    }).catch(err => {
      console.error('Error fetching preparedness data:', err);
    }).finally(() => {
      setLoading(false);
    });
  }, []);

  const toggleCheck = (key: string) => {
    setCheckedSteps(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const activePlan = plans.find(p => p.hazardType === selectedHazard) || plans[0];

  const hazardIcons: Record<string, any> = {
    FLOOD: Waves,
    CYCLONE: Wind,
    EARTHQUAKE: Activity,
    HEATWAVE: Sun
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-teal-950/60 via-slate-900 to-slate-900 border border-teal-900/50 rounded-2xl p-6 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-teal-600/20 text-teal-400 border border-teal-600/40">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-white">
              Disaster Preparedness & Resource Management
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Verified SOP guides, community shelter directory, and relief inventory
            </p>
          </div>
        </div>

        {/* View Switcher Tabs */}
        <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
          <button
            onClick={() => setActiveTab('plans')}
            className={`px-3 py-1.5 rounded-lg font-bold transition ${
              activeTab === 'plans' ? 'bg-teal-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Safety Plans (SOP)
          </button>
          <button
            onClick={() => setActiveTab('shelters')}
            className={`px-3 py-1.5 rounded-lg font-bold transition ${
              activeTab === 'shelters' ? 'bg-teal-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Relief Shelters ({shelters.length})
          </button>
          <button
            onClick={() => setActiveTab('resources')}
            className={`px-3 py-1.5 rounded-lg font-bold transition ${
              activeTab === 'resources' ? 'bg-teal-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Rescue Equipment ({resources.length})
          </button>
        </div>
      </div>

      {/* Tab 1: Disaster Management Plans */}
      {activeTab === 'plans' && (
        <div className="space-y-5">
          {/* Hazard Selector Pills */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {(['FLOOD', 'CYCLONE', 'EARTHQUAKE', 'HEATWAVE'] as const).map((h) => {
              const Icon = hazardIcons[h];
              const isSelected = selectedHazard === h;
              return (
                <button
                  key={h}
                  onClick={() => setSelectedHazard(h)}
                  className={`p-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition ${
                    isSelected
                      ? 'bg-teal-950/80 border-teal-500 text-teal-300 shadow-lg'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{h}</span>
                </button>
              );
            })}
          </div>

          {activePlan && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
              <div>
                <div className="flex items-center justify-between">
                  <h2 className="text-base sm:text-lg font-black text-white">
                    {activePlan.title}
                  </h2>
                  <span className="px-2.5 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-amber-950 text-amber-300 border border-amber-800">
                    Alert: {activePlan.alertLevel}
                  </span>
                </div>
                <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                  {activePlan.summary}
                </p>
              </div>

              {/* Safety Checklist */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Interactive Emergency Safety Checklist
                </h3>
                <div className="space-y-2">
                  {activePlan.safetyChecklist.map((step, idx) => {
                    const key = `${activePlan.id}-${idx}`;
                    const isChecked = !!checkedSteps[key];
                    return (
                      <div
                        key={idx}
                        onClick={() => toggleCheck(key)}
                        className={`p-3 rounded-xl border cursor-pointer transition flex items-start gap-3 text-xs leading-relaxed ${
                          isChecked
                            ? 'bg-emerald-950/40 border-emerald-800/80 text-emerald-200 line-through opacity-80'
                            : 'bg-slate-950 border-slate-850 text-slate-200 hover:border-slate-700'
                        }`}
                      >
                        {isChecked ? (
                          <CheckSquare className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                        ) : (
                          <Square className="w-4 h-4 text-slate-500 flex-shrink-0 mt-0.5" />
                        )}
                        <span>{step}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Evacuation Routes */}
              <div className="space-y-2">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Designated High-Ground Evacuation Corridors
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {activePlan.evacuationRoutes.map((route, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-slate-950 border border-slate-850 text-slate-300 flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                      <span>{route}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Emergency Helplines */}
              <div className="space-y-2 pt-2 border-t border-slate-800">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Emergency Agency Contact Directory
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                  {activePlan.emergencyContacts.map((contact, idx) => (
                    <div key={idx} className="p-2.5 rounded-lg bg-slate-950 border border-slate-850 flex items-center justify-between">
                      <span className="text-slate-300 font-medium truncate">{contact.agency}</span>
                      <a href={`tel:${contact.phone}`} className="text-teal-400 font-mono font-bold hover:underline">
                        {contact.phone}
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Shelters Directory */}
      {activeTab === 'shelters' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {shelters.map((shelter) => {
            const pct = Math.round((shelter.currentOccupancy / shelter.capacity) * 100);
            const isFull = pct >= 90;

            return (
              <div
                key={shelter.id}
                className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-mono text-emerald-400 font-bold">{shelter.id}</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                      isFull ? 'bg-rose-950 text-rose-300 border border-rose-800' : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                    }`}>
                      {shelter.status}
                    </span>
                  </div>

                  <h3 className="text-base font-black text-white mt-1">
                    {shelter.name}
                  </h3>

                  <p className="text-xs text-slate-400 mt-1 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                    <span>{shelter.location.address}</span>
                  </p>

                  {/* Occupancy Bar */}
                  <div className="mt-4 space-y-1.5">
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="text-slate-400">Shelter Capacity</span>
                      <span className="text-slate-200">
                        {shelter.currentOccupancy} / {shelter.capacity} people ({pct}%)
                      </span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-950 overflow-hidden">
                      <div
                        style={{ width: `${pct}%` }}
                        className={`h-full rounded-full ${
                          isFull ? 'bg-red-500' : pct > 60 ? 'bg-amber-400' : 'bg-emerald-400'
                        }`}
                      />
                    </div>
                  </div>

                  {/* Facilities */}
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {shelter.facilities.map((fac, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded bg-slate-950 border border-slate-850 text-[10px] font-medium text-slate-300"
                      >
                        ✓ {fac}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
                  <span>Manager: <strong className="text-slate-200">{shelter.managerName}</strong></span>
                  <a href={`tel:${shelter.contactPhone}`} className="text-teal-400 font-mono font-bold hover:underline">
                    {shelter.contactPhone}
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Tab 3: Emergency Resources Inventory */}
      {activeTab === 'resources' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {resources.map((res) => (
              <div
                key={res.id}
                className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-cyan-400 font-bold">{res.id}</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-slate-800 text-slate-300">
                    {res.status}
                  </span>
                </div>

                <h3 className="font-bold text-sm text-white">{res.name}</h3>
                <p className="text-xs text-slate-400">Base: {res.baseLocation}</p>

                <div className="grid grid-cols-3 gap-2 pt-2 text-center text-xs">
                  <div className="p-2 rounded bg-slate-950 border border-slate-850">
                    <span className="text-[10px] text-slate-400 block">Total</span>
                    <strong className="text-white">{res.totalQuantity}</strong>
                  </div>
                  <div className="p-2 rounded bg-slate-950 border border-slate-850">
                    <span className="text-[10px] text-slate-400 block">Available</span>
                    <strong className="text-emerald-400">{res.availableQuantity}</strong>
                  </div>
                  <div className="p-2 rounded bg-slate-950 border border-slate-850">
                    <span className="text-[10px] text-slate-400 block">Deployed</span>
                    <strong className="text-amber-400">{res.deployedQuantity}</strong>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
