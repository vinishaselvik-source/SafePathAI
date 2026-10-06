import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { RouteOption, IncidentReport, Hospital, EssentialService, NavView } from '../types';
import { FamousPlace } from '../data/famousPlaces';
import { getCityCoordinates } from '../utils/cityCoordinates';
import { 
  Hospital as HospitalIcon, 
  Layers, 
  Phone, 
  ArrowRight,
  WifiOff,
  Navigation,
  Search,
  MapPin,
  Sparkles
} from 'lucide-react';

interface InteractiveMapViewProps {
  routes: RouteOption[];
  selectedRouteId: string;
  incidents: IncidentReport[];
  hospitals: Hospital[];
  essentials: EssentialService[];
  onNavigate: (view: NavView) => void;
  onSelectHospital: (hospital: Hospital) => void;
  isIncidentTriggered: boolean;
  isOfflineMode: boolean;
  selectedPlaceTarget?: FamousPlace | null;
  onClearPlaceTarget?: () => void;
  selectedDestinationName?: string;
  isDarkMode?: boolean;
}

export const InteractiveMapView: React.FC<InteractiveMapViewProps> = ({
  routes,
  selectedRouteId,
  incidents,
  hospitals,
  essentials,
  onNavigate,
  onSelectHospital,
  isIncidentTriggered,
  isOfflineMode,
  selectedPlaceTarget,
  onClearPlaceTarget,
  selectedDestinationName,
  isDarkMode = true,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  // MapTiler API Key
  const mapTilerKey = import.meta.env.VITE_MAPTILER_API_KEY || 'AopN0ATG9XHTPQUoVqRE';

  // Map Style Options
  const mapStyles = {
    hybrid: `https://api.maptiler.com/maps/hybrid/256/{z}/{x}/{y}.jpg?key=${mapTilerKey}`,
    streets: `https://api.maptiler.com/maps/streets-v2/256/{z}/{x}/{y}.png?key=${mapTilerKey}`,
    outdoor: `https://api.maptiler.com/maps/outdoor-v2/256/{z}/{x}/{y}.png?key=${mapTilerKey}`,
    dark: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyage/{z}/{x}/{y}{r}.png',
    osm: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
  };

  const [activeStyle, setActiveStyle] = useState<keyof typeof mapStyles>('hybrid');
  const [mapSearchText, setMapSearchText] = useState<string>('');

  // Filters state
  const [activeFilters, setActiveFilters] = useState<{
    incidents: boolean;
    hospitals: boolean;
    police: boolean;
    fuel: boolean;
  }>({
    incidents: true,
    hospitals: true,
    police: true,
    fuel: true,
  });

  const [selectedHospitalMap, setSelectedHospitalMap] = useState<Hospital>(hospitals[0]);
  const [callingState, setCallingState] = useState<string | null>(null);

  const toggleFilter = (key: keyof typeof activeFilters) => {
    setActiveFilters(prev => ({ ...prev, [key]: !prev[key] }));
  };

  // Re-center map to specific lat/lng
  const handleFlyToLocation = (lat: number, lng: number, zoom = 14) => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo([lat, lng], zoom, {
        duration: 1.5,
        easeLinearity: 0.25
      });
    }
  };

  const handleFlyToCitySearch = (cityName: string) => {
    const loc = getCityCoordinates(cityName);
    handleFlyToLocation(loc.lat, loc.lng, loc.zoom);
  };

  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }

    // Determine initial center
    let initialLat = 12.5;
    let initialLng = 80.0;
    let initialZoom = 9;

    if (selectedPlaceTarget) {
      initialLat = selectedPlaceTarget.lat;
      initialLng = selectedPlaceTarget.lng;
      initialZoom = 14;
    } else if (selectedDestinationName) {
      const loc = getCityCoordinates(selectedDestinationName);
      initialLat = loc.lat;
      initialLng = loc.lng;
      initialZoom = loc.zoom;
    }

    const map = L.map(mapContainerRef.current, {
      center: [initialLat, initialLng],
      zoom: initialZoom,
      zoomControl: true,
    });

    mapInstanceRef.current = map;

    // Apply Map Style
    L.tileLayer(mapStyles[activeStyle], {
      attribution: '© MapTiler © OpenStreetMap · SafePath AI',
      subdomains: 'abcd',
      maxZoom: 19
    }).addTo(map);

    // Draw Routes
    routes.forEach(r => {
      const isSelected = r.id === selectedRouteId;
      const color = r.id === 'route-b' ? '#34d399' : r.id === 'route-a' ? '#f87171' : '#fbbf24';

      const polyline = L.polyline(r.coordinates, {
        color: color,
        weight: isSelected ? 6 : 4,
        opacity: isSelected ? 0.95 : 0.45,
        dashArray: isSelected ? undefined : '6, 8',
      }).addTo(map);

      polyline.bindPopup(`
        <div style="font-family: Inter, sans-serif;">
          <h4 style="font-family: Outfit, sans-serif; font-weight: 800; color: #0f172a; margin-bottom: 2px;">${r.name}</h4>
          <p style="font-size: 11px; color: #64748b; margin-bottom: 4px;">${r.distance} · ${r.time}</p>
          <div style="background: rgba(52, 211, 153, 0.15); padding: 4px 8px; border-radius: 6px;">
            <span style="font-size: 11px; color: #059669; font-weight: 700;">Safety Score: ${r.safetyScore}/100</span>
          </div>
        </div>
      `);
    });

    // Start & Destination Markers
    const startIcon = L.divIcon({
      className: 'custom-start-marker',
      html: `<div style="background: #34d399; color: #0f172a; font-family: Outfit, sans-serif; font-weight: 800; font-size: 10px; padding: 4px 8px; border-radius: 999px; border: 2px solid #fff; box-shadow: 0 4px 12px rgba(52,211,153,0.4);">📍 CHENNAI</div>`,
      iconSize: [100, 28],
      iconAnchor: [50, 14]
    });

    const destIcon = L.divIcon({
      className: 'custom-dest-marker',
      html: `<div style="background: #0ea5e9; color: #ffffff; font-family: Outfit, sans-serif; font-weight: 800; font-size: 10px; padding: 4px 8px; border-radius: 999px; border: 2px solid #fff; box-shadow: 0 4px 12px rgba(14,165,233,0.4);">📍 ${selectedDestinationName || 'DESTINATION'}</div>`,
      iconSize: [120, 28],
      iconAnchor: [60, 14]
    });

    L.marker([13.0827, 80.2707], { icon: startIcon }).addTo(map).bindPopup('<b>Start:</b> Chennai');
    
    if (selectedDestinationName) {
      const loc = getCityCoordinates(selectedDestinationName);
      L.marker([loc.lat, loc.lng], { icon: destIcon }).addTo(map).bindPopup(`<b>Destination:</b> ${selectedDestinationName}`);
    }

    // IF A FAMOUS PLACE IS TARGETED: DRAW HIGHLIGHTED FAMOUS PLACE MARKER!
    if (selectedPlaceTarget) {
      const placeIcon = L.divIcon({
        className: 'custom-place-marker',
        html: `<div style="background: #fbbf24; color: #0f172a; font-family: Outfit, sans-serif; font-weight: 900; font-size: 11px; padding: 5px 10px; border-radius: 12px; border: 2px solid #fff; box-shadow: 0 0 16px rgba(251,191,36,0.8); display: flex; align-items: center; gap: 4px;">✨ ${selectedPlaceTarget.name}</div>`,
        iconSize: [160, 32],
        iconAnchor: [80, 16]
      });

      const m = L.marker([selectedPlaceTarget.lat, selectedPlaceTarget.lng], { icon: placeIcon }).addTo(map);
      m.bindPopup(`
        <div style="font-family: Inter, sans-serif; min-width: 180px;">
          <span style="background: rgba(251,191,36,0.2); color: #d97706; font-size: 10px; font-weight: 700; padding: 2px 6px; border-radius: 4px;">${selectedPlaceTarget.category.toUpperCase()}</span>
          <h4 style="font-family: Outfit, sans-serif; font-weight: 800; color: #0f172a; margin-top: 4px; margin-bottom: 2px;">${selectedPlaceTarget.name}</h4>
          <p style="font-size: 11px; color: #475569;">${selectedPlaceTarget.description}</p>
        </div>
      `).openPopup();
    }

    // Hospitals
    if (activeFilters.hospitals) {
      hospitals.forEach(hosp => {
        const hospIcon = L.divIcon({
          className: 'custom-hosp-marker',
          html: `<div style="background: #34d399; color: #0f172a; font-weight: 900; font-size: 13px; width: 32px; height: 32px; border-radius: 10px; display: flex; align-items: center; justify-content: center; border: 2px solid #fff; box-shadow: 0 0 14px rgba(52,211,153,0.6);">🏥</div>`,
          iconSize: [32, 32],
          iconAnchor: [16, 16]
        });

        const m = L.marker([hosp.lat, hosp.lng], { icon: hospIcon }).addTo(map);
        m.on('click', () => setSelectedHospitalMap(hosp));
      });
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [selectedRouteId, activeFilters, activeStyle, isIncidentTriggered, isOfflineMode, selectedPlaceTarget, selectedDestinationName]);

  return (
    <div className="space-y-3 pb-2">
      
      {/* Title Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-base sm:text-lg font-extrabold text-white font-sans flex items-center gap-1.5">
            <Layers className="w-5 h-5 text-emerald-400" />
            <span>Map Location & Famous Places</span>
          </h1>
          <p className="text-slate-400 text-[10px] font-medium">
            {selectedPlaceTarget ? `Target: ${selectedPlaceTarget.name}` : `Destination: ${selectedDestinationName || 'Pondicherry'}`}
          </p>
        </div>

        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
          MAPTILER SATELLITE
        </span>
      </div>

      {/* MAP CITY RE-CENTERING SEARCH BAR */}
      <div className="relative">
        <Search className="w-4 h-4 text-emerald-400 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={mapSearchText}
          onChange={(e) => setMapSearchText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleFlyToCitySearch(mapSearchText);
          }}
          placeholder="Search place to center map (e.g. Pondicherry, Promenade Beach, Munnar)..."
          className="w-full pl-9 pr-20 py-2 bg-navy-900 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none focus:border-emerald-400"
        />
        <button
          onClick={() => handleFlyToCitySearch(mapSearchText)}
          className="absolute right-1 top-1/2 -translate-y-1/2 px-2.5 py-1 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-[10px] rounded-lg transition-all"
        >
          Update Map
        </button>
      </div>

      {/* MAP STYLE SWITCHER BAR */}
      <div className="flex items-center gap-1 overflow-x-auto scrollbar-none text-xs">
        {[
          { id: 'hybrid', label: '🛰️ Satellite Hybrid' },
          { id: 'streets', label: '🗺️ MapTiler Streets' },
          { id: 'outdoor', label: '🏔️ Outdoor' },
          { id: 'dark', label: '🌑 Dark Vector' },
          { id: 'osm', label: '🌐 OpenStreetMap' },
        ].map((st) => (
          <button
            key={st.id}
            onClick={() => setActiveStyle(st.id as keyof typeof mapStyles)}
            className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border transition-all shrink-0 ${
              activeStyle === st.id
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-glow-cyan'
                : 'bg-navy-900 text-slate-400 border-slate-700'
            }`}
          >
            {st.label}
          </button>
        ))}
      </div>

      {/* LEAFLET MAP CONTAINER */}
      <div className="glass-panel rounded-2xl border border-emerald-500/30 p-1.5 relative h-[360px] overflow-hidden shadow-lg">
        <div ref={mapContainerRef} className="w-full h-full rounded-xl" />

        {selectedPlaceTarget && (
          <div className="absolute top-3 left-3 z-[500] glass-card px-3 py-2 rounded-xl border border-amber-500/50 text-[10px] font-mono text-amber-300 font-bold bg-slate-950/90 shadow-xl flex items-center gap-2 backdrop-blur-md">
            <div>
              <span className="block text-amber-400 text-[9px]">✨ VIEWING TOURIST SPOT:</span>
              <span className="text-white text-xs font-sans">{selectedPlaceTarget.name} ({selectedPlaceTarget.district})</span>
            </div>
            {onClearPlaceTarget && (
              <button
                onClick={onClearPlaceTarget}
                className="px-2.5 py-1 bg-amber-500 hover:bg-amber-400 text-slate-950 text-[10px] font-extrabold rounded-lg shrink-0 ml-1 transition-all shadow-md uppercase font-sans"
              >
                ↩ Return to Route
              </button>
            )}
          </div>
        )}

        <div className="absolute bottom-3 right-3 z-[500] glass-card px-2 py-1 rounded-md border border-emerald-500/30 text-[9px] font-mono text-emerald-300">
          🛰️ MapTiler Satellite Key Active
        </div>
      </div>

      {/* MAP PAGE INTEGRATED HOSPITAL DRAWER CARD */}
      <div className="glass-panel p-3.5 rounded-2xl border border-emerald-500/40 bg-navy-900/90 space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <HospitalIcon className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-extrabold text-white">{selectedHospitalMap.name}</h3>
              <p className="text-[10px] text-slate-300 font-mono">📍 {selectedHospitalMap.distanceKm} km away · ~{selectedHospitalMap.etaMinutes} min ETA</p>
            </div>
          </div>

          <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
            24/7 ICU READY
          </span>
        </div>

        {callingState && (
          <div className="p-2 bg-rose-950/80 border border-rose-500/40 rounded-lg text-[10px] text-rose-300 font-bold flex items-center gap-1.5 animate-pulse">
            <Phone className="w-3 h-3 text-rose-400 animate-bounce" />
            <span>Dialing Hotline {callingState}...</span>
          </div>
        )}

        <div className="flex gap-2 pt-1">
          <button
            onClick={() => {
              setCallingState(selectedHospitalMap.emergencyPhone);
              setTimeout(() => setCallingState(null), 3000);
            }}
            className="flex-1 py-2 bg-navy-800 hover:bg-navy-700 text-emerald-300 border border-emerald-500/30 text-xs font-bold rounded-xl flex items-center justify-center gap-1"
          >
            <Phone className="w-3.5 h-3.5" />
            <span>Call Care</span>
          </button>

          <button
            onClick={() => onSelectHospital(selectedHospitalMap)}
            className="flex-1 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-extrabold rounded-xl shadow-glow-cyan flex items-center justify-center gap-1 uppercase"
          >
            <Navigation className="w-3.5 h-3.5" />
            <span>Take Me There</span>
          </button>
        </div>
      </div>

    </div>
  );
};
