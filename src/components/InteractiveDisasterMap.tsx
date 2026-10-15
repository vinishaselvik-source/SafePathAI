import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { 
  Filter, Layers, MapPin, AlertTriangle, Home, 
  Waves, Radio, Info, Eye, CheckCircle2, Navigation, Crosshair 
} from 'lucide-react';
import { Incident, Shelter, CivicReport } from '../types';
import { api } from '../services/api';

interface InteractiveDisasterMapProps {
  onSelectIncident?: (incident: Incident) => void;
  selectedIncident?: Incident | null;
  pickMode?: boolean;
  onLocationPicked?: (loc: { lat: number; lng: number; address: string }) => void;
}

export const InteractiveDisasterMap: React.FC<InteractiveDisasterMapProps> = ({
  onSelectIncident,
  selectedIncident,
  pickMode = false,
  onLocationPicked
}) => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);

  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [shelters, setShelters] = useState<Shelter[]>([]);
  const [civicReports, setCivicReports] = useState<CivicReport[]>([]);
  const [showIncidents, setShowIncidents] = useState<boolean>(true);
  const [showShelters, setShowShelters] = useState<boolean>(true);
  const [showCivic, setShowCivic] = useState<boolean>(true);
  const [filterPriority, setFilterPriority] = useState<string>('ALL');
  const [activeDetail, setActiveDetail] = useState<Incident | Shelter | CivicReport | null>(null);

  // Fetch all map data
  useEffect(() => {
    Promise.all([
      api.getIncidents(),
      api.getShelters(),
      api.getCivicReports()
    ]).then(([incData, shData, civData]) => {
      setIncidents(incData);
      setShelters(shData);
      setCivicReports(civData);
    }).catch(err => {
      console.error('Error fetching map dataset:', err);
    });
  }, []);

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    // Centered at Velachery / Tamil Nadu (12.9815, 80.2180)
    const map = L.map(mapContainerRef.current, {
      center: [12.9815, 80.2180],
      zoom: 12,
      zoomControl: false
    });

    L.control.zoom({ position: 'bottomright' }).addTo(map);

    // OpenStreetMap free tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors | SAROS EOC GIS',
      maxZoom: 19
    }).addTo(map);

    markersLayerRef.current = L.layerGroup().addTo(map);
    mapInstanceRef.current = map;

    // Click handler for location pick mode
    map.on('click', (e: L.LeafletMouseEvent) => {
      if (onLocationPicked) {
        onLocationPicked({
          lat: e.latlng.lat,
          lng: e.latlng.lng,
          address: `Lat ${e.latlng.lat.toFixed(4)}, Lng ${e.latlng.lng.toFixed(4)}`
        });
      }
    });

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Pan to selected incident if prop changes
  useEffect(() => {
    if (selectedIncident && mapInstanceRef.current) {
      mapInstanceRef.current.flyTo(
        [selectedIncident.location.lat, selectedIncident.location.lng],
        14,
        { duration: 1.2 }
      );
      setActiveDetail(selectedIncident);
    }
  }, [selectedIncident]);

  // Render markers when data or filters change
  useEffect(() => {
    if (!mapInstanceRef.current || !markersLayerRef.current) return;
    markersLayerRef.current.clearLayers();

    // 1. Incident Markers
    if (showIncidents) {
      incidents.forEach((inc) => {
        if (filterPriority !== 'ALL' && inc.priority !== filterPriority) return;

        const isCritical = inc.priority === 'CRITICAL';
        const colorClass = isCritical ? 'bg-red-600 border-red-300' : inc.priority === 'HIGH' ? 'bg-orange-500 border-orange-200' : 'bg-amber-400 border-amber-100';

        const iconHtml = `
          <div class="relative flex items-center justify-center">
            ${isCritical ? '<div class="absolute w-8 h-8 rounded-full bg-red-500/40 animate-ping"></div>' : ''}
            <div class="w-6 h-6 rounded-full ${colorClass} border-2 shadow-lg flex items-center justify-center text-white text-[10px] font-black">
              !
            </div>
          </div>
        `;

        const customIcon = L.divIcon({
          className: 'saros-map-icon',
          html: iconHtml,
          iconSize: [24, 24],
          iconAnchor: [12, 12]
        });

        const marker = L.marker([inc.location.lat, inc.location.lng], { icon: customIcon });

        marker.on('click', () => {
          setActiveDetail(inc);
          if (onSelectIncident) onSelectIncident(inc);
        });

        markersLayerRef.current!.addLayer(marker);
      });
    }

    // 2. Shelter Markers
    if (showShelters) {
      shelters.forEach((sh) => {
        const iconHtml = `
          <div class="w-6 h-6 rounded-full bg-emerald-600 border-2 border-emerald-200 shadow-lg flex items-center justify-center text-white text-[10px] font-bold">
            H
          </div>
        `;
        const customIcon = L.divIcon({
          className: 'saros-shelter-icon',
          html: iconHtml,
          iconSize: [24, 24],
          iconAnchor: [12, 12]
        });

        const marker = L.marker([sh.location.lat, sh.location.lng], { icon: customIcon });
        marker.on('click', () => setActiveDetail(sh));
        markersLayerRef.current!.addLayer(marker);
      });
    }

    // 3. Civic Report Markers
    if (showCivic) {
      civicReports.forEach((civ) => {
        const iconHtml = `
          <div class="w-5 h-5 rounded-md bg-blue-600 border border-blue-200 shadow flex items-center justify-center text-white text-[9px] font-bold">
            C
          </div>
        `;
        const customIcon = L.divIcon({
          className: 'saros-civic-icon',
          html: iconHtml,
          iconSize: [20, 20],
          iconAnchor: [10, 10]
        });

        const marker = L.marker([civ.location.lat, civ.location.lng], { icon: customIcon });
        marker.on('click', () => setActiveDetail(civ));
        markersLayerRef.current!.addLayer(marker);
      });
    }
  }, [incidents, shelters, civicReports, showIncidents, showShelters, showCivic, filterPriority]);

  return (
    <div className="relative w-full h-[calc(100vh-140px)] min-h-[500px] bg-slate-950 flex flex-col">
      {/* Top Map Filter Controls */}
      <div className="absolute top-3 left-3 right-3 z-[1000] flex flex-wrap items-center justify-between gap-2 pointer-events-none">
        {/* Layer Toggles (Pointer events auto) */}
        <div className="pointer-events-auto bg-slate-900/90 backdrop-blur border border-slate-800 rounded-xl p-1.5 flex items-center gap-1.5 shadow-xl text-xs">
          <button
            onClick={() => setShowIncidents(!showIncidents)}
            className={`px-2.5 py-1 rounded-lg font-bold transition flex items-center gap-1 ${
              showIncidents ? 'bg-red-950 text-red-300 border border-red-800' : 'text-slate-400 hover:text-white'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-red-500" />
            <span>Incidents ({incidents.length})</span>
          </button>

          <button
            onClick={() => setShowShelters(!showShelters)}
            className={`px-2.5 py-1 rounded-lg font-bold transition flex items-center gap-1 ${
              showShelters ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' : 'text-slate-400 hover:text-white'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>Shelters ({shelters.length})</span>
          </button>

          <button
            onClick={() => setShowCivic(!showCivic)}
            className={`px-2.5 py-1 rounded-lg font-bold transition flex items-center gap-1 ${
              showCivic ? 'bg-blue-950 text-blue-300 border border-blue-800' : 'text-slate-400 hover:text-white'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-blue-500" />
            <span>Civic Hazards ({civicReports.length})</span>
          </button>
        </div>

        {/* Priority Filter */}
        <div className="pointer-events-auto bg-slate-900/90 backdrop-blur border border-slate-800 rounded-xl px-2.5 py-1.5 shadow-xl text-xs flex items-center gap-2">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            className="bg-transparent text-slate-200 font-semibold focus:outline-none cursor-pointer"
          >
            <option value="ALL" className="bg-slate-900">All Priorities</option>
            <option value="CRITICAL" className="bg-slate-900">Critical Only</option>
            <option value="HIGH" className="bg-slate-900">High Only</option>
            <option value="MEDIUM" className="bg-slate-900">Medium Only</option>
          </select>
        </div>
      </div>

      {/* Leaflet Map Div */}
      <div ref={mapContainerRef} className="w-full h-full z-0" />

      {/* Click-to-pick indicator if in pick mode */}
      {pickMode && (
        <div className="absolute top-16 left-1/2 -translate-x-1/2 z-[1000] bg-cyan-950/90 border border-cyan-600 text-cyan-200 text-xs font-bold px-4 py-2 rounded-full shadow-2xl flex items-center gap-2">
          <Crosshair className="w-4 h-4 text-cyan-400 animate-spin" />
          <span>Click anywhere on map to select incident location</span>
        </div>
      )}

      {/* Selected Feature Detail Drawer */}
      {activeDetail && (
        <div className="absolute bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:w-96 z-[1000] bg-slate-900/95 backdrop-blur-md border border-slate-700/80 rounded-2xl p-4 shadow-2xl space-y-3">
          <div className="flex items-start justify-between">
            <div>
              {'category' in activeDetail && 'priority' in activeDetail ? (
                // Incident
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-white text-sm font-mono">
                      {activeDetail.id}
                    </span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                      activeDetail.priority === 'CRITICAL' ? 'bg-red-950 text-red-400 border border-red-800' : 'bg-orange-950 text-orange-400'
                    }`}>
                      {activeDetail.category}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 mt-1 font-medium leading-relaxed">
                    {activeDetail.description}
                  </p>
                  <p className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-red-400" />
                    <span>{activeDetail.location.address}</span>
                  </p>
                  <div className="mt-2 pt-2 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
                    <span>Status: <strong className="text-teal-400">{activeDetail.status}</strong></span>
                    <span>People in danger: <strong className="text-white">{activeDetail.peopleCount}</strong></span>
                  </div>
                </div>
              ) : 'capacity' in activeDetail ? (
                // Shelter
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-white text-sm">
                      {activeDetail.name}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950 text-emerald-400 border border-emerald-800">
                      {activeDetail.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 mt-1">{activeDetail.location.address}</p>
                  <div className="mt-2 pt-2 border-t border-slate-800 space-y-1 text-xs">
                    <div className="flex justify-between text-slate-400">
                      <span>Occupancy:</span>
                      <strong className="text-white">{activeDetail.currentOccupancy} / {activeDetail.capacity}</strong>
                    </div>
                    <div className="text-[11px] text-teal-400">
                      Manager: {activeDetail.managerName} ({activeDetail.contactPhone})
                    </div>
                  </div>
                </div>
              ) : (
                // Civic Report
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-white text-sm font-mono">
                      {activeDetail.id}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-950 text-blue-400 border border-blue-800">
                      {activeDetail.category}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 mt-1">{activeDetail.description}</p>
                  <p className="text-[11px] text-slate-400 mt-1">{activeDetail.location.address}</p>
                  <div className="mt-2 pt-2 border-t border-slate-800 text-xs text-slate-400">
                    Status: <strong className="text-blue-400">{activeDetail.status}</strong>
                  </div>
                </div>
              )}
            </div>
            <button
              onClick={() => setActiveDetail(null)}
              className="p-1 rounded text-slate-400 hover:text-white"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
