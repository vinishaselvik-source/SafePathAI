import React, { useState } from 'react';
import { EssentialService, EssentialCategory, NavView } from '../types';
import { 
  Compass, 
  Hospital, 
  ShieldAlert, 
  Flame, 
  Fuel, 
  Zap, 
  Pill, 
  CreditCard, 
  Utensils, 
  Phone, 
  Navigation, 
  Share2, 
  CheckCircle2, 
  XCircle 
} from 'lucide-react';

interface NearbyEssentialsViewProps {
  essentials: EssentialService[];
  onNavigateToMap: () => void;
}

export const NearbyEssentialsView: React.FC<NearbyEssentialsViewProps> = ({ essentials, onNavigateToMap }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [shareNotice, setShareNotice] = useState<string | null>(null);

  const categoryIcons: Record<EssentialCategory, React.ComponentType<{ className?: string }>> = {
    hospital: Hospital,
    police: ShieldAlert,
    fire: Flame,
    fuel: Fuel,
    ev: Zap,
    restroom: Compass,
    supermarket: Compass,
    pharmacy: Pill,
    atm: CreditCard,
    food: Utensils,
  };

  const filtered = selectedCategory === 'all'
    ? essentials
    : essentials.filter(e => e.category === selectedCategory);

  const handleShare = (name: string) => {
    setShareNotice(`Location details for "${name}" copied to clipboard & shared with Safety Circle.`);
    setTimeout(() => setShareNotice(null), 3000);
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white flex items-center gap-2">
            <Compass className="w-7 h-7 text-cyan-400" />
            <span>Nearby Essentials & Emergency Services</span>
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm mt-1">
            Discover verified emergency care, fuel stations, EV superchargers, pharmacies, and ATMs along your route.
          </p>
        </div>
      </div>

      {/* Share Toast Notification */}
      {shareNotice && (
        <div className="p-3 bg-cyan-950/80 border border-cyan-500/40 rounded-xl text-xs text-cyan-300 font-semibold flex items-center gap-2 animate-in fade-in duration-200">
          <Share2 className="w-4 h-4 text-cyan-400" />
          <span>{shareNotice}</span>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2">
        {[
          { id: 'all', label: 'All Places' },
          { id: 'hospital', label: '🏥 Hospitals' },
          { id: 'police', label: '🚓 Police' },
          { id: 'fuel', label: '⛽ Fuel' },
          { id: 'ev', label: '🔋 EV Chargers' },
          { id: 'pharmacy', label: '💊 Pharmacy' },
          { id: 'atm', label: '🏧 ATMs' },
          { id: 'restroom', label: '🚻 Restrooms' },
        ].map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              selectedCategory === cat.id
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400 shadow-glow-cyan'
                : 'bg-navy-900 text-slate-400 hover:text-white border border-slate-700/60'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Grid of Essential Services */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((item) => {
          const Icon = categoryIcons[item.category] || Compass;
          return (
            <div
              key={item.id}
              className="glass-panel p-5 rounded-2xl border border-white/10 hover:border-cyan-500/40 transition-all flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                    <Icon className="w-5 h-5" />
                  </div>

                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1 ${
                    item.isOpen ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                  }`}>
                    {item.isOpen ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                    {item.isOpen ? 'OPEN NOW' : 'CLOSED'}
                  </span>
                </div>

                <h3 className="text-sm font-extrabold text-white">{item.name}</h3>
                <p className="text-xs text-slate-300 mt-1">{item.address}</p>
                {item.details && <p className="text-[11px] text-cyan-300/90 font-mono mt-1">{item.details}</p>}
              </div>

              <div className="space-y-3 pt-3 border-t border-white/10">
                <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
                  <span>Distance: <strong className="text-white">{item.distanceKm} km</strong></span>
                  {item.phone && <span className="text-slate-300 font-bold">{item.phone}</span>}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  {item.phone && (
                    <a
                      href={`tel:${item.phone}`}
                      className="flex-1 py-2 bg-navy-800 hover:bg-navy-700 text-cyan-300 border border-cyan-500/30 rounded-xl text-xs font-bold text-center flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <Phone className="w-3.5 h-3.5" /> Call
                    </a>
                  )}

                  <button
                    onClick={onNavigateToMap}
                    className="flex-1 py-2 bg-cyan-500 hover:bg-cyan-400 text-navy-950 rounded-xl text-xs font-bold text-center flex items-center justify-center gap-1.5 transition-colors shadow-glow-cyan"
                  >
                    <Navigation className="w-3.5 h-3.5" /> Navigate
                  </button>

                  <button
                    onClick={() => handleShare(item.name)}
                    className="p-2 glass-card hover:bg-navy-800 text-slate-300 rounded-xl border border-white/10 transition-colors"
                    title="Share Location"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
};
