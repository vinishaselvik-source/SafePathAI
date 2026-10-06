import React, { useState, useEffect } from 'react';
import { 
  NavView, 
  TripDetails, 
  RouteOption, 
  IncidentReport, 
  Hospital, 
  EssentialService, 
  ChecklistItem, 
  TrustedContact, 
  CheckInPoint, 
  TravelReadiness 
} from './types';
import { FamousPlace } from './data/famousPlaces';
import { 
  initialTripDetails, 
  mockReadinessScore, 
  mockRoutes, 
  mockIncidents, 
  mockHospitals, 
  mockEssentials, 
  mockChecklistItems, 
  mockTrustedContacts, 
  mockCheckIns 
} from './data/mockData';
import { loadOfflineState, saveOfflineState, STORAGE_KEYS } from './utils/offlineStorage';
import { getRoutesForDestination } from './utils/routesGenerator';

import { MobileDeviceFrame } from './components/MobileDeviceFrame';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { DashboardView } from './components/DashboardView';
import { PlanTripView } from './components/PlanTripView';
import { SafeRoutesView } from './components/SafeRoutesView';
import { InteractiveMapView } from './components/InteractiveMapView';
import { ChecklistView } from './components/ChecklistView';
import { SafetyRadarView } from './components/SafetyRadarView';
import { NearbyEssentialsView } from './components/NearbyEssentialsView';
import { HospitalFinderView } from './components/HospitalFinderView';
import { JourneyMonitorView } from './components/JourneyMonitorView';
import { EmergencySOSModal } from './components/EmergencySOSModal';
import { OfflinePackModal } from './components/OfflinePackModal';
import { AICopilotDrawer } from './components/AICopilotDrawer';
import { ProfileView } from './components/ProfileView';
import { FamousPlacesView } from './components/FamousPlacesView';

import { ShieldAlert } from 'lucide-react';

export const App: React.FC = () => {
  // Mobile App Navigation: Defaults to Dashboard
  const [currentView, setCurrentView] = useState<NavView>('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  
  // Theme Preference: Persisted in localStorage ('dark' or 'light')
  const [isNightMode, setIsNightMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('safepath_theme_preference');
    return saved ? saved === 'dark' : true;
  });

  // Sync theme mode to document root and localStorage
  useEffect(() => {
    const mode = isNightMode ? 'dark' : 'light';
    localStorage.setItem('safepath_theme_preference', mode);
    if (isNightMode) {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.add('light');
      document.documentElement.classList.remove('dark');
    }
  }, [isNightMode]);

  // Target Famous Place selection for map
  const [selectedPlaceTarget, setSelectedPlaceTarget] = useState<FamousPlace | null>(null);

  // Modals & Drawers
  const [isSOSOpen, setIsSOSOpen] = useState<boolean>(false);
  const [isCopilotOpen, setIsCopilotOpen] = useState<boolean>(false);
  const [isOfflineModalOpen, setIsOfflineModalOpen] = useState<boolean>(false);
  
  // Offline Persistent State
  const [isOfflineMode, setIsOfflineMode] = useState<boolean>(() => 
    loadOfflineState(STORAGE_KEYS.OFFLINE_PACK, false)
  );
  const [tripDetails, setTripDetails] = useState<TripDetails>(() => 
    loadOfflineState(STORAGE_KEYS.TRIP_DETAILS, initialTripDetails)
  );
  const [checklistItems, setChecklistItems] = useState<ChecklistItem[]>(() => 
    loadOfflineState(STORAGE_KEYS.CHECKLIST, mockChecklistItems)
  );
  const [incidents, setIncidents] = useState<IncidentReport[]>(() => 
    loadOfflineState(STORAGE_KEYS.INCIDENTS, mockIncidents)
  );
  const [trustedContacts, setTrustedContacts] = useState<TrustedContact[]>(() => 
    loadOfflineState(STORAGE_KEYS.CONTACTS, mockTrustedContacts)
  );

  // In-memory Data State
  const [readiness, setReadiness] = useState<TravelReadiness>(mockReadinessScore);
  const [routes, setRoutes] = useState<RouteOption[]>(mockRoutes);
  const [selectedRouteId, setSelectedRouteId] = useState<string>('route-b');
  const [hospitals, setHospitals] = useState<Hospital[]>(mockHospitals);
  const [essentials, setEssentials] = useState<EssentialService[]>(mockEssentials);
  const [checkIns, setCheckIns] = useState<CheckInPoint[]>(mockCheckIns);
  
  // Search & Demo Simulators
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isIncidentTriggered, setIsIncidentTriggered] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const activeRoute = routes.find(r => r.id === selectedRouteId) || routes[0];
  const nearestHospital = hospitals[0];

  // Sync state to local storage for offline resilience
  useEffect(() => {
    saveOfflineState(STORAGE_KEYS.OFFLINE_PACK, isOfflineMode);
  }, [isOfflineMode]);

  useEffect(() => {
    saveOfflineState(STORAGE_KEYS.TRIP_DETAILS, tripDetails);
    const newRoutes = getRoutesForDestination(tripDetails.destination);
    setRoutes(newRoutes);
  }, [tripDetails.destination]);

  useEffect(() => {
    saveOfflineState(STORAGE_KEYS.CHECKLIST, checklistItems);
  }, [checklistItems]);

  useEffect(() => {
    saveOfflineState(STORAGE_KEYS.INCIDENTS, incidents);
  }, [incidents]);

  useEffect(() => {
    saveOfflineState(STORAGE_KEYS.CONTACTS, trustedContacts);
  }, [trustedContacts]);

  // Helper for toast notifications
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 5000);
  };

  const handleTriggerSimulatedIncident = () => {
    if (!isIncidentTriggered) {
      setIsIncidentTriggered(true);
      showToast("⚠️ LIVE HAZARD: Waterlogging 2.1km ahead on Route B! AI rerouting recommended.");
    } else {
      setIsIncidentTriggered(false);
      showToast("🟢 Hazard resolved. Route B clear.");
    }
  };

  const handleRecalculateRoute = () => {
    setSelectedRouteId('route-c');
    setIsIncidentTriggered(false);
    showToast("✅ Switched to Route C (OMR Interior Bypass - 82/100).");
  };

  const handleSelectHospitalForRoute = (hosp: Hospital) => {
    showToast(`🚑 Emergency Route: Heading to ${hosp.name} (${hosp.distanceKm} km · ~${hosp.etaMinutes}m).`);
    setSelectedPlaceTarget(null);
    setCurrentView('livemap');
  };

  const handleNavigateToMapWithPlace = (place: FamousPlace) => {
    setSelectedPlaceTarget(place);
    showToast(`✨ Viewing Famous Place on Map: ${place.name} (${place.distanceKm} km away).`);
    setCurrentView('livemap');
  };

  const handleAddToTrip = (place: FamousPlace) => {
    const newItem: ChecklistItem = {
      id: `c-fp-${Date.now()}`,
      category: 'essentials',
      text: `Visit ${place.name} (${place.district})`,
      checked: true,
      recommendedReason: `Added from Famous Places Nearby`
    };
    setChecklistItems(prev => [newItem, ...prev]);
    showToast(`✨ Added "${place.name}" to your travel checklist!`);
  };

  return (
    <MobileDeviceFrame>
      <div className={`flex flex-col min-h-full select-none ${isNightMode ? 'bg-[#12161f] text-slate-100' : 'bg-slate-50 text-slate-900'}`}>
        
        {/* Mobile Header Bar */}
        <Header
          currentView={currentView}
          onNavigate={(view) => {
            setCurrentView(view);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onTriggerSOS={() => setIsSOSOpen(true)}
          onToggleCopilot={() => setIsCopilotOpen(!isCopilotOpen)}
          isNightMode={isNightMode}
          onToggleNightMode={() => {
            setIsNightMode(!isNightMode);
            showToast(!isNightMode ? "🌙 Dark Mode Enabled" : "☀️ Light Mode Enabled");
          }}
          isOfflineMode={isOfflineMode}
          onToggleOfflineMode={() => setIsOfflineModalOpen(true)}
          mobileMenuOpen={mobileMenuOpen}
          setMobileMenuOpen={setMobileMenuOpen}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />

        {/* Global Native Toast Notification */}
        {toastMessage && (
          <div className="sticky top-[50px] z-30 px-3 py-2 bg-emerald-500 text-slate-950 font-extrabold text-[11px] text-center shadow-md flex items-center justify-center gap-1.5 animate-in slide-in-from-top font-sans">
            <ShieldAlert className="w-3.5 h-3.5 shrink-0" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Mobile slide-out drawer menu */}
        {mobileMenuOpen && (
          <div className="glass-nav p-3 space-y-1 border-b border-white/10 z-30 font-sans">
            {[
              { id: 'dashboard', label: '📱 Home Dashboard' },
              { id: 'famousplaces', label: '✨ Famous Places Nearby' },
              { id: 'plantrip', label: '🗺️ Plan Trip' },
              { id: 'saferoutes', label: '🛡️ Safe Routes' },
              { id: 'livemap', label: '📍 Live Map (India)' },
              { id: 'checklist', label: '🎒 Travel Checklist' },
              { id: 'radar', label: '⚠️ Safety Radar' },
              { id: 'hospitals', label: '🏥 Nearby Hospitals' },
              { id: 'essentials', label: '📍 Nearby Essentials' },
              { id: 'journeymonitor', label: '🚗 Journey Monitor' },
              { id: 'emergency', label: '🚨 Emergency SOS' },
              { id: 'copilot', label: '🤖 AI Travel Copilot' },
              { id: 'profile', label: '👤 Safety Circle' },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setCurrentView(item.id as NavView);
                  setMobileMenuOpen(false);
                }}
                className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold transition-colors ${
                  currentView === item.id ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' : 'text-slate-300 hover:bg-slate-800/50'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        )}

        {/* Mobile Viewport Content */}
        <main className="flex-1 p-3 font-sans space-y-4">
          
          {currentView === 'dashboard' && (
            <DashboardView
              onNavigate={(view) => setCurrentView(view)}
              onTriggerSOS={() => setIsSOSOpen(true)}
              onToggleOffline={() => setIsOfflineModalOpen(true)}
              readiness={readiness}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              tripDetails={tripDetails}
              setTripDetails={setTripDetails}
            />
          )}

          {currentView === 'famousplaces' && (
            <FamousPlacesView
              tripDetails={tripDetails}
              onNavigateToMapWithPlace={handleNavigateToMapWithPlace}
              onAddToTrip={handleAddToTrip}
            />
          )}

          {currentView === 'plantrip' && (
            <PlanTripView
              tripDetails={tripDetails}
              setTripDetails={setTripDetails}
              onNavigate={(view) => setCurrentView(view)}
            />
          )}

          {currentView === 'saferoutes' && (
            <SafeRoutesView
              routes={routes}
              selectedRouteId={selectedRouteId}
              onSelectRoute={(id) => setSelectedRouteId(id)}
              onNavigate={(view) => setCurrentView(view)}
              onTriggerSimulatedIncident={handleTriggerSimulatedIncident}
              isIncidentTriggered={isIncidentTriggered}
              tripDetails={tripDetails}
            />
          )}

          {currentView === 'livemap' && (
            <InteractiveMapView
              routes={routes}
              selectedRouteId={selectedRouteId}
              incidents={incidents}
              hospitals={hospitals}
              essentials={essentials}
              onNavigate={(view) => setCurrentView(view)}
              onSelectHospital={(hosp) => handleSelectHospitalForRoute(hosp)}
              isIncidentTriggered={isIncidentTriggered}
              isOfflineMode={isOfflineMode}
              selectedPlaceTarget={selectedPlaceTarget}
              onClearPlaceTarget={() => setSelectedPlaceTarget(null)}
              selectedDestinationName={tripDetails.destination}
              isDarkMode={isNightMode}
            />
          )}

          {currentView === 'checklist' && (
            <ChecklistView
              items={checklistItems}
              setItems={setChecklistItems}
            />
          )}

          {currentView === 'radar' && (
            <SafetyRadarView
              incidents={incidents}
              onAddIncident={(newInc) => {
                setIncidents(prev => [newInc, ...prev]);
                showToast(`Report received: High Confidence verification.`);
              }}
            />
          )}

          {currentView === 'essentials' && (
            <NearbyEssentialsView
              essentials={essentials}
              onNavigateToMap={() => setCurrentView('livemap')}
            />
          )}

          {currentView === 'hospitals' && (
            <HospitalFinderView
              hospitals={hospitals}
              onSelectHospitalForRoute={(hosp) => handleSelectHospitalForRoute(hosp)}
              onNavigateToMap={() => setCurrentView('livemap')}
            />
          )}

          {currentView === 'journeymonitor' && (
            <JourneyMonitorView
              activeRoute={activeRoute}
              checkIns={checkIns}
              onRecalculateRoute={handleRecalculateRoute}
              onNavigate={(view) => setCurrentView(view)}
              isIncidentTriggered={isIncidentTriggered}
              onTriggerSimulatedIncident={handleTriggerSimulatedIncident}
            />
          )}

          {currentView === 'emergency' && (
            <div className="space-y-4 text-center py-6">
              <h1 className="text-xl font-black text-white font-sans">🚨 Emergency Protocol</h1>
              <button
                onClick={() => setIsSOSOpen(true)}
                className="w-full py-4 bg-gradient-to-r from-red-600 to-rose-600 text-white font-black text-sm rounded-2xl shadow-glow-rose uppercase tracking-wider font-sans"
              >
                LAUNCH EMERGENCY SOS DISPATCH
              </button>
            </div>
          )}

          {currentView === 'copilot' && (
            <div className="space-y-4 text-center py-6">
              <h1 className="text-xl font-black text-white font-sans">🤖 SafePath AI Copilot</h1>
              <button
                onClick={() => setIsCopilotOpen(true)}
                className="w-full py-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-black text-sm rounded-2xl shadow-glow-cyan uppercase tracking-wide font-sans"
              >
                OPEN AI CHAT DRAWER
              </button>
            </div>
          )}

          {currentView === 'profile' && (
            <ProfileView
              contacts={trustedContacts}
              setContacts={setTrustedContacts}
            />
          )}
        </main>

        {/* Mobile Native Bottom App Bar */}
        <BottomNav
          currentView={currentView}
          onNavigate={(view) => setCurrentView(view)}
          onTriggerSOS={() => setIsSOSOpen(true)}
        />

        {/* MODALS & BOTTOM SHEETS */}
        <EmergencySOSModal
          isOpen={isSOSOpen}
          onClose={() => setIsSOSOpen(false)}
          contacts={trustedContacts}
          nearestHospital={nearestHospital}
          onNavigate={(view) => setCurrentView(view)}
        />

        <OfflinePackModal
          isOpen={isOfflineModalOpen}
          onClose={() => setIsOfflineModalOpen(false)}
          isOfflineMode={isOfflineMode}
          onToggleOffline={() => setIsOfflineMode(!isOfflineMode)}
        />

        <AICopilotDrawer
          isOpen={isCopilotOpen}
          onClose={() => setIsCopilotOpen(false)}
          tripDetails={tripDetails}
          setTripDetails={setTripDetails}
          onNavigate={(view) => setCurrentView(view)}
          onTriggerSOS={() => setIsSOSOpen(true)}
        />

      </div>
    </MobileDeviceFrame>
  );
};
