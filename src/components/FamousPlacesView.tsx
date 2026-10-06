import React from 'react';
import { FamousPlace, getFamousPlacesForDestination } from '../data/famousPlaces';
import { TripDetails } from '../types';
import { Sparkles, MapPin, Star, Clock, Eye, PlusCircle, Navigation, Compass } from 'lucide-react';

interface FamousPlacesViewProps {
  tripDetails: TripDetails;
  onNavigateToMapWithPlace: (place: FamousPlace) => void;
  onAddToTrip: (place: FamousPlace) => void;
}

export const FamousPlacesView: React.FC<FamousPlacesViewProps> = ({
  tripDetails,
  onNavigateToMapWithPlace,
  onAddToTrip,
}) => {
  const famousPlaces = getFamousPlacesForDestination(tripDetails.destination);

  return (
    <div className="space-y-4 pb-6 font-sans">
      
      {/* Header Banner */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-black text-white flex items-center gap-1.5 font-sans">
            <Sparkles className="w-5 h-5 text-amber-400" />
            <span>🌟 Famous Places Nearby</span>
          </h2>
          <p className="text-slate-400 text-[11px] font-medium">
            Top tourist attractions near <strong className="text-white">{tripDetails.destination}</strong>.
          </p>
        </div>

        <span className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold">
          {famousPlaces.length} ATTRACTIONS
        </span>
      </div>

      {/* Places Cards Grid */}
      <div className="space-y-3.5">
        {famousPlaces.map((place) => (
          <div
            key={place.id}
            className="glass-panel rounded-2xl border border-white/10 overflow-hidden flex flex-col justify-between hover:border-amber-500/50 transition-all shadow-md group bg-navy-900/80"
          >
            {/* Image Banner with Badge Overlays */}
            <div className="relative h-36 w-full overflow-hidden bg-slate-900">
              <img
                src={place.image}
                alt={place.name}
                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/20" />
              
              {/* Category & District Badges */}
              <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                <span className="px-2.5 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wider bg-slate-950/90 text-amber-400 border border-amber-500/40 backdrop-blur-md">
                  {place.category}
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[9px] font-bold bg-navy-950/90 text-cyan-300 border border-cyan-500/30 backdrop-blur-md flex items-center gap-1">
                  <MapPin className="w-2.5 h-2.5 text-cyan-400" />
                  <span>{place.district}</span>
                </span>
              </div>

              {/* Rating Badge */}
              <div className="absolute top-2.5 right-2.5 px-2.5 py-0.5 rounded-lg text-[10px] font-mono font-black bg-slate-950/90 text-amber-300 border border-amber-500/40 backdrop-blur-md flex items-center gap-1">
                <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                <span>{place.rating}</span>
              </div>

              {/* Distance & Travel Time overlay */}
              <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between text-[10px] font-mono font-bold text-slate-200">
                <span className="bg-slate-950/90 px-2 py-0.5 rounded-md border border-white/10 backdrop-blur-md">
                  📏 {place.distanceKm} km from destination
                </span>
                <span className="bg-slate-950/90 px-2 py-0.5 rounded-md border border-white/10 backdrop-blur-md flex items-center gap-1 text-emerald-300">
                  <Clock className="w-3 h-3 text-emerald-400" /> Drive: ~{place.estTime}
                </span>
              </div>
            </div>

            {/* Place Details Body */}
            <div className="p-3.5 space-y-2">
              <div>
                <h3 className="text-sm font-extrabold text-white flex items-center gap-1">
                  <span>📍 {place.name}</span>
                </h3>
                <div className="text-[10px] font-mono font-bold text-amber-300 bg-amber-950/40 border border-amber-500/30 px-2 py-1 rounded-lg mt-1.5 flex items-center gap-1.5 w-fit">
                  <span>⏰ Visiting Hours:</span>
                  <span className="text-white font-sans font-semibold">{place.openingHours}</span>
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed mt-1.5">
                  📝 {place.description}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 border-t border-white/10 flex items-center gap-2">
                <button
                  onClick={() => onNavigateToMapWithPlace(place)}
                  className="flex-1 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-extrabold text-xs rounded-xl shadow-glow-cyan flex items-center justify-center gap-1.5 transition-all uppercase tracking-wider"
                >
                  <Eye className="w-3.5 h-3.5 stroke-[2.5]" />
                  <span>View on Map</span>
                </button>

                <button
                  onClick={() => onAddToTrip(place)}
                  className="flex-1 py-2 bg-navy-800 hover:bg-navy-750 text-amber-300 border border-amber-500/40 text-xs font-extrabold rounded-xl flex items-center justify-center gap-1.5 transition-all uppercase tracking-wider"
                >
                  <PlusCircle className="w-3.5 h-3.5 text-amber-400" />
                  <span>Add to Trip</span>
                </button>
              </div>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
};
