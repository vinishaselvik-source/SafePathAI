import React, { useState } from 'react';
import { NavView, RouteOption, TripDetails } from '../types';
import { 
  ShieldCheck, 
  Sparkles, 
  AlertTriangle, 
  Clock, 
  Navigation, 
  Activity, 
  Info
} from 'lucide-react';

interface SafeRoutesViewProps {
  routes: RouteOption[];
  selectedRouteId: string;
  onSelectRoute: (routeId: string) => void;
  onNavigate: (view: NavView) => void;
  onTriggerSimulatedIncident: () => void;
  isIncidentTriggered: boolean;
  tripDetails: TripDetails;
}

export const SafeRoutesView: React.FC<SafeRoutesViewProps> = ({
  routes,
  selectedRouteId,
  onSelectRoute,
  onNavigate,
  onTriggerSimulatedIncident,
  isIncidentTriggered,
  tripDetails,
}) => {
  const [activeTab, setActiveTab] = useState<string>(selectedRouteId || 'route-b');
  const destLower = tripDetails.destination.toLowerCase();

  const isKerala = destLower.includes('kerala') || destLower.includes('kochi') || destLower.includes('munnar');
  const isTirunelveli = destLower.includes('tirunelveli') || destLower.includes('nellai');

  let displayRoutes = routes;

  if (isTirunelveli) {
    displayRoutes = [
      {
        id: 'route-b',
        name: 'Route B — NH44 Express Corridor via Madurai (Recommended)',
        type: 'recommended' as const,
        isAiRecommended: true,
        distance: '620 km',
        time: '9h 45m',
        safetyScore: 93,
        warnings: ['💨 Gusty winds near Aralvaimozhi pass', '🚦 Moderate toll booth queue at Madurai bypass'],
        benefits: [
          '✅ 24/7 Level-1 Trauma Care access along Madurai & Trichy Expressways',
          '✅ 4-Lane wide divided asphalt with active street lighting',
          '✅ High density of fuel plazas & clean highway restrooms'
        ],
        scoreExplanation: 'Route B via NH44 is AI Recommended for Tirunelveli travel because it offers 4-lane divided highway protection and 24/7 emergency medical coverage.',
        breakdown: { roadCondition: 19, traffic: 15, recentIncidents: 15, lighting: 9, connectivity: 9, emergencyAccess: 15, weatherImpact: 11 },
        coordinates: [[13.0827, 80.2707], [10.7905, 78.7047], [9.9252, 78.1198], [8.7139, 77.7567]]
      },
      {
        id: 'route-a',
        name: 'Route A — ECR & Coastal NH32 Corridor',
        type: 'fastest' as const,
        isAiRecommended: false,
        distance: '610 km',
        time: '9h 30m (15m faster)',
        safetyScore: 82,
        warnings: ['🚧 Bridge repair near Ramanathapuram link road', '🚦 Heavy local commuter traffic in town stretches'],
        benefits: ['✅ Coastal breeze route', '✅ Direct ECR connectivity'],
        scoreExplanation: 'Route A is slightly shorter, but scores 82/100 due to single-lane undivided bridge repair stretches.',
        breakdown: { roadCondition: 14, traffic: 10, recentIncidents: 12, lighting: 7, connectivity: 8, emergencyAccess: 11, weatherImpact: 10 },
        coordinates: [[13.0827, 80.2707], [11.9416, 79.8083], [9.2876, 79.3129], [8.7139, 77.7567]]
      },
      {
        id: 'route-c',
        name: 'Route C — Secondary Interior Highway via Dindigul',
        type: 'alternative' as const,
        isAiRecommended: false,
        distance: '640 km',
        time: '10h 15m',
        safetyScore: 88,
        warnings: ['🌑 Unlit agricultural bypass stretches', '⚠️ Slow moving tractor traffic near Sattur'],
        benefits: ['✅ Uninterrupted 5G cellular connectivity', '✅ Multiple local food stalls'],
        scoreExplanation: 'Route C provides continuous 5G signal but scores 88/100 due to unlit bypass stretches.',
        breakdown: { roadCondition: 16, traffic: 12, recentIncidents: 13, lighting: 7, connectivity: 10, emergencyAccess: 12, weatherImpact: 12 },
        coordinates: [[13.0827, 80.2707], [10.3673, 77.9803], [8.7139, 77.7567]]
      }
    ];
  } else if (isKerala) {
    displayRoutes = [
      {
        id: 'route-b',
        name: 'Route B — NH544 Palakkad Gap Corridor (Recommended)',
        type: 'recommended' as const,
        isAiRecommended: true,
        distance: '685 km',
        time: '11h 30m',
        safetyScore: 92,
        warnings: ['🌧️ Monsoon showers near Palakkad Gap', '📶 15-min low connectivity stretch near Walayar Ghat'],
        benefits: [
          '✅ 24/7 Trauma hospital access along Salem-Coimbatore Expressway',
          '✅ 4-Lane asphalt with excellent street lighting',
          '✅ High density of open fuel & EV superchargers'
        ],
        scoreExplanation: 'Route B via Palakkad Gap is AI Recommended for Kerala travel because it offers 4-lane divided highway protection and high emergency hospital density.',
        breakdown: { roadCondition: 19, traffic: 14, recentIncidents: 15, lighting: 9, connectivity: 8, emergencyAccess: 15, weatherImpact: 12 },
        coordinates: [[13.0827, 80.2707], [11.6643, 78.1460], [11.0168, 76.9558], [10.7867, 76.6547], [9.9312, 76.2673]]
      },
      {
        id: 'route-a',
        name: 'Route A — NH44 via Dindigul & Theni Pass',
        type: 'fastest' as const,
        isAiRecommended: false,
        distance: '585 km',
        time: '10h 45m (45m faster)',
        safetyScore: 84,
        warnings: ['🚧 Bridge repair near Theni pass', '🚦 Heavy truck traffic on Kumily ghats'],
        benefits: ['✅ Shorter overall distance', '✅ Scenic Western Ghats views'],
        scoreExplanation: 'Route A is faster by 45 minutes to Munnar/Central Kerala, but scores 84/100 due to active bridge repair.',
        breakdown: { roadCondition: 15, traffic: 11, recentIncidents: 12, lighting: 7, connectivity: 7, emergencyAccess: 12, weatherImpact: 10 },
        coordinates: [[13.0827, 80.2707], [10.3673, 77.9803], [10.0104, 77.4768], [10.0889, 77.0595]]
      },
      {
        id: 'route-c',
        name: 'Route C — NH66 Coastal Highway via Kanyakumari',
        type: 'alternative' as const,
        isAiRecommended: false,
        distance: '740 km',
        time: '13h 00m',
        safetyScore: 79,
        warnings: ['🌧️ Heavy coastal monsoon rain', '🚦 High city traffic near Trivandrum'],
        benefits: ['✅ Continuous 5G mobile tower signal', '✅ Coastal rest plazas'],
        scoreExplanation: 'Route C provides steady cellular signal but scores 79/100 due to coastal rain and city traffic bottlenecks.',
        breakdown: { roadCondition: 14, traffic: 9, recentIncidents: 11, lighting: 8, connectivity: 10, emergencyAccess: 13, weatherImpact: 14 },
        coordinates: [[13.0827, 80.2707], [8.0883, 77.5385], [8.5241, 76.9366], [9.9312, 76.2673]]
      }
    ];
  }

  return (
    <div className="space-y-4 pb-4">
      
      {/* Title Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-extrabold text-white font-sans flex items-center gap-1.5">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <span>AI Route Safety ({tripDetails.destination})</span>
          </h1>
          <p className="text-slate-400 text-[10px] font-medium">
            Evaluating 3 paths for <strong className="text-white">{tripDetails.startingPoint} → {tripDetails.destination}</strong>.
          </p>
        </div>

        <button
          onClick={onTriggerSimulatedIncident}
          className={`px-3 py-1.5 rounded-xl font-bold text-[11px] transition-all flex items-center gap-1 border ${
            isIncidentTriggered ? 'bg-amber-500/20 text-amber-300 border-amber-500/40' : 'bg-rose-600/20 text-rose-300 border-rose-500/40'
          }`}
        >
          <Activity className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
          <span>{isIncidentTriggered ? 'Rerouted' : 'Simulate Hazard'}</span>
        </button>
      </div>

      {/* Safety Disclaimer Banner */}
      <div className="p-2.5 glass-card rounded-xl border border-emerald-500/30 bg-navy-900/60 flex items-start gap-2 text-[11px] text-slate-300">
        <Info className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold text-emerald-300">{tripDetails.destination} Route AI:</span> Route B via 4-lane expressway is recommended today for optimal emergency hospital coverage.
        </div>
      </div>

      {/* THREE ROUTE CARDS */}
      <div className="space-y-3">
        {displayRoutes.map((route) => {
          const isSelected = route.id === selectedRouteId;
          const isRecommended = route.isAiRecommended;
          
          return (
            <div
              key={route.id}
              onClick={() => setActiveTab(route.id)}
              className={`glass-panel p-4 rounded-2xl border transition-all relative flex flex-col justify-between cursor-pointer ${
                isRecommended
                  ? 'border-emerald-400/80 bg-navy-900/90 shadow-glow-cyan'
                  : isSelected
                  ? 'border-cyan-500/60 bg-navy-900/70'
                  : 'border-white/5 hover:border-white/20'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">
                  {route.type === 'recommended' ? 'Route B (Recommended)' : route.type === 'fastest' ? 'Route A (Fastest)' : 'Route C (Alt)'}
                </span>
                
                {isRecommended ? (
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-500 text-slate-950 flex items-center gap-1">
                    <Sparkles className="w-3 h-3 stroke-[3]" /> AI Recommended
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono text-slate-400 bg-navy-800 border border-slate-700">
                    {route.type === 'fastest' ? 'Fastest' : 'Alternative'}
                  </span>
                )}
              </div>

              <div className="space-y-2">
                <div>
                  <h3 className="text-sm font-extrabold text-white">{route.name}</h3>
                  <div className="flex items-center gap-2 text-[11px] text-slate-300 font-mono mt-0.5">
                    <span>{route.distance}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3 text-emerald-400" /> {route.time}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between p-2 glass-card rounded-xl border border-white/5">
                  <span className="text-xs font-semibold text-slate-300">Safety Score</span>
                  <span className="px-2.5 py-0.5 rounded-lg text-xs font-mono font-extrabold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                    {route.safetyScore} / 100
                  </span>
                </div>

                {route.warnings.length > 0 && (
                  <div className="space-y-1">
                    {route.warnings.map((w, idx) => (
                      <div key={idx} className="text-[11px] text-amber-200 bg-amber-950/30 p-1.5 rounded-lg border border-amber-500/20 flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3 text-amber-400 shrink-0" />
                        <span>{w}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="mt-3 pt-2 border-t border-white/10 flex items-center gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectRoute(route.id);
                    onNavigate('journeymonitor');
                  }}
                  className={`flex-1 py-2 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-1.5 ${
                    isSelected
                      ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-glow-cyan'
                      : 'bg-navy-800 hover:bg-navy-700 text-white border border-slate-700'
                  }`}
                >
                  <Navigation className="w-3.5 h-3.5" />
                  <span>{isSelected ? 'Active Route' : 'Select Route'}</span>
                </button>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectRoute(route.id);
                    onNavigate('livemap');
                  }}
                  className="p-2 glass-card hover:bg-navy-800 text-cyan-300 rounded-xl border border-white/10"
                  title="View on Map"
                >
                  <Activity className="w-3.5 h-3.5" />
                </button>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
};
