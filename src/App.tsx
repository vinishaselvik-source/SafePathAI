import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { LoginPage, DEMO_ACCOUNTS } from './components/LoginPage';
import { CitizenPortal } from './components/CitizenPortal';
import { SOSModal } from './components/SOSModal';
import { MeshSimulatorView } from './components/MeshSimulatorView';
import { ResponderControlRoom } from './components/ResponderControlRoom';
import { InteractiveDisasterMap } from './components/InteractiveDisasterMap';
import { CityZenView } from './components/CityZenView';
import { PreparednessView } from './components/PreparednessView';
import { AdminDashboard } from './components/AdminDashboard';
import { VolunteerPortal } from './components/VolunteerPortal';
import { DemoGuideModal } from './components/DemoGuideModal';
import { MobileDeviceFrame } from './components/MobileDeviceFrame';
import { BottomNav } from './components/BottomNav';
import { ProfileModal } from './components/ProfileModal';
import { UserRole, SupportedLanguage, Incident, UserProfile } from './types';
import { offlineStore } from './services/offlineStore';
import { api } from './services/api';
import { WifiOff, AlertTriangle } from 'lucide-react';

export function App() {
  // Authentication State
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    try {
      const saved = localStorage.getItem('saros_auth_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [currentRole, setCurrentRole] = useState<UserRole>(() => {
    return currentUser?.role || 'citizen';
  });

  const [isSimulatedOffline, setIsSimulatedOffline] = useState<boolean>(offlineStore.getSimulatedOffline());
  const [isOnline, setIsOnline] = useState<boolean>(offlineStore.isOnline());
  const [language, setLanguage] = useState<SupportedLanguage>('en');
  const [activeTab, setActiveTab] = useState<string>('home');
  const [showSOSModal, setShowSOSModal] = useState<boolean>(false);
  const [showDemoGuide, setShowDemoGuide] = useState<boolean>(false);
  const [showProfileModal, setShowProfileModal] = useState<boolean>(false);
  const [isMobileSimulated, setIsMobileSimulated] = useState<boolean>(false);
  const [selectedIncidentForMap, setSelectedIncidentForMap] = useState<Incident | null>(null);
  const [offlineCount, setOfflineCount] = useState<number>(0);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  // Sync session with API service whenever user/role changes
  useEffect(() => {
    if (currentUser) {
      api.setSession(currentUser.role, currentUser.id, currentUser.name);
      localStorage.setItem('saros_auth_user', JSON.stringify(currentUser));
    }
  }, [currentUser]);

  // Capture PWA installation prompt
  useEffect(() => {
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
  }, []);

  const handleInstallApp = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;
      if (choiceResult.outcome === 'accepted') {
        console.log('User installed SAROS as PWA');
      }
      setDeferredPrompt(null);
    } else {
      alert('To install SAROS on your phone: Tap your browser share or menu button (⋮ or ⬆) and select "Add to Home Screen".');
    }
  };

  // Monitor offline store state & queue count
  const refreshNetworkState = async () => {
    setIsSimulatedOffline(offlineStore.getSimulatedOffline());
    setIsOnline(offlineStore.isOnline());
    const queue = await offlineStore.getQueue();
    setOfflineCount(queue.length);
  };

  useEffect(() => {
    refreshNetworkState();
    const unsub = offlineStore.subscribe(refreshNetworkState);
    return () => unsub();
  }, []);

  const handleToggleSimulatedOffline = () => {
    const next = !isSimulatedOffline;
    offlineStore.setSimulatedOffline(next);
    refreshNetworkState();
  };

  const handleLocateOnMap = (incident: Incident) => {
    setSelectedIncidentForMap(incident);
    setActiveTab('map');
  };

  const handleMobileNavTab = (tab: string) => {
    if (tab === 'profile') {
      setShowProfileModal(true);
    } else {
      setActiveTab(tab);
    }
  };

  const handleLogin = (user: UserProfile) => {
    setCurrentUser(user);
    setCurrentRole(user.role);
    setActiveTab('home');
    api.setSession(user.role, user.id, user.name);
    try {
      localStorage.setItem('saros_auth_user', JSON.stringify(user));
    } catch {}
  };

  const handleSignOut = () => {
    setCurrentUser(null);
    try {
      localStorage.removeItem('saros_auth_user');
    } catch {}
  };

  const handleSwitchRole = (newRole: UserRole) => {
    const demoUser = DEMO_ACCOUNTS[newRole];
    setCurrentUser(demoUser);
    setCurrentRole(newRole);
    setActiveTab('home');
    api.setSession(newRole, demoUser.id, demoUser.name);
    try {
      localStorage.setItem('saros_auth_user', JSON.stringify(demoUser));
    } catch {}
  };

  // If user is not authenticated, show the Login Page
  if (!currentUser) {
    return (
      <LoginPage
        onLogin={handleLogin}
        language={language}
        onLanguageChange={setLanguage}
      />
    );
  }

  // Render role-specific primary dashboard when activeTab === 'home'
  const renderHomeDashboard = () => {
    switch (currentRole) {
      case 'volunteer':
        return <VolunteerPortal />;
      case 'responder':
        return (
          <ResponderControlRoom
            currentRole={currentRole}
            onLocateIncidentOnMap={handleLocateOnMap}
          />
        );
      case 'admin':
        return <AdminDashboard />;
      case 'citizen':
      default:
        return (
          <CitizenPortal
            language={language}
            onTriggerSOSModal={() => setShowSOSModal(true)}
            onOpenCityZen={() => setActiveTab('cityzen')}
            onOpenMap={() => setActiveTab('map')}
            onOpenShelters={() => setActiveTab('preparedness')}
          />
        );
    }
  };

  const appContent = (
    <div className="min-h-screen bg-[#0b0f19] text-slate-100 flex flex-col font-sans selection:bg-rose-500 selection:text-white pb-16 sm:pb-0">
      {/* Clean Top Navbar without duplicate bottom tabs */}
      <Navbar
        currentRole={currentRole}
        currentUserName={currentUser.name}
        onRoleChange={handleSwitchRole}
        isSimulatedOffline={isSimulatedOffline}
        onToggleSimulatedOffline={handleToggleSimulatedOffline}
        isOnline={isOnline}
        language={language}
        onLanguageChange={setLanguage}
        onOpenDemoGuide={() => setShowDemoGuide(true)}
        onSignOut={handleSignOut}
        isMobileSimulated={isMobileSimulated}
        onToggleMobileSimulated={() => setIsMobileSimulated(!isMobileSimulated)}
        onInstallApp={handleInstallApp}
      />

      {/* Persistent Offline Alert Bar (if disconnected or simulating) */}
      {!isOnline && (
        <div className="bg-gradient-to-r from-rose-950 via-amber-950 to-rose-950 border-b border-amber-600/40 px-4 py-2 text-xs text-amber-200 flex items-center justify-between">
          <div className="flex items-center gap-2 max-w-4xl">
            <WifiOff className="w-4 h-4 text-amber-400 flex-shrink-0 animate-pulse" />
            <span>
              <strong>OFFLINE MODE ACTIVE:</strong> Emergency reports will be persisted in device IndexedDB and forwarded via ad-hoc SAROS mesh relays until an EOC gateway is reached.
            </span>
          </div>
          {offlineCount > 0 && (
            <span className="px-2.5 py-0.5 rounded-full bg-amber-500 text-slate-950 font-black text-[11px] whitespace-nowrap">
              {offlineCount} SOS Queued
            </span>
          )}
        </div>
      )}

      {/* Main Content Area: Each role has its dedicated dashboard */}
      <main className="flex-1">
        {activeTab === 'home' && renderHomeDashboard()}

        {activeTab === 'map' && (
          <InteractiveDisasterMap
            selectedIncident={selectedIncidentForMap}
            onSelectIncident={(inc) => setSelectedIncidentForMap(inc)}
          />
        )}

        {activeTab === 'mesh' && (
          <MeshSimulatorView />
        )}

        {activeTab === 'control' && (
          <ResponderControlRoom
            currentRole={currentRole}
            onLocateIncidentOnMap={handleLocateOnMap}
          />
        )}

        {(activeTab === 'cityZen' || activeTab === 'cityzen') && (
          <CityZenView currentRole={currentRole} />
        )}

        {activeTab === 'preparedness' && (
          <PreparednessView language={language} />
        )}
      </main>

      {/* Footer with RMKCET CSE PDL-III accreditation */}
      <footer className="bg-slate-950 border-t border-slate-900 py-6 px-4 text-xs text-slate-400 hidden sm:block">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <span className="font-bold text-slate-200">SAROS</span>
              <span>— Search and Rescue Operating System</span>
              <span className="px-1.5 py-0.5 rounded text-[10px] bg-slate-900 text-teal-400 border border-slate-800">Mobile PWA Ready</span>
            </div>
            <p className="text-[11px] text-slate-400">
              Department of Computer Science and Engineering · R.M.K. College of Engineering and Technology
            </p>
            <p className="text-[11px] text-slate-400">
              Product Development Lab - III (24AI511) · Yamuna A M (111624102243) · Vinisha Selvi K (111624102238) · Ramyaa S (111624102250)
            </p>
          </div>

          <div className="flex items-center gap-3 text-xs">
            <button
              onClick={() => setShowDemoGuide(true)}
              className="text-cyan-400 hover:text-cyan-300 font-semibold"
            >
              Demonstration Guide
            </button>
            <span className="text-slate-700">|</span>
            <button
              onClick={handleInstallApp}
              className="text-emerald-400 hover:text-emerald-300 font-semibold"
            >
              Install App
            </button>
            <span className="text-slate-700">|</span>
            <button
              onClick={handleSignOut}
              className="text-rose-400 hover:text-rose-300 font-semibold"
            >
              Sign Out
            </button>
          </div>
        </div>
      </footer>

      {/* Native Mobile Bottom Navigation Bar (Figure 3.1) - Dynamically tailored to current role */}
      <BottomNav
        activeTab={activeTab}
        onSelectTab={handleMobileNavTab}
        language={language}
        currentRole={currentRole}
      />

      {/* Emergency SOS Modal */}
      <SOSModal
        isOpen={showSOSModal}
        onClose={() => setShowSOSModal(false)}
        language={language}
        onIncidentCreated={() => {}}
      />

      {/* Master Demo Guide Modal */}
      <DemoGuideModal
        isOpen={showDemoGuide}
        onClose={() => setShowDemoGuide(false)}
      />

      {/* Mobile Profile Modal */}
      <ProfileModal
        isOpen={showProfileModal}
        onClose={() => setShowProfileModal(false)}
        currentRole={currentRole}
        onRoleChange={(r) => {
          handleSwitchRole(r);
          setShowProfileModal(false);
        }}
        language={language}
        onLanguageChange={setLanguage}
        isSimulatedOffline={isSimulatedOffline}
        onToggleOffline={handleToggleSimulatedOffline}
        onOpenDemoGuide={() => setShowDemoGuide(true)}
        onSignOut={handleSignOut}
      />
    </div>
  );

  return (
    <MobileDeviceFrame
      isMobileSimulated={isMobileSimulated}
      onToggleSimulator={() => setIsMobileSimulated(false)}
    >
      {appContent}
    </MobileDeviceFrame>
  );
}

export default App;
