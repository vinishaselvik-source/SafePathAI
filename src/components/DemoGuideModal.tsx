import React from 'react';
import { X, CheckCircle2, ShieldAlert, Radio, WifiOff, Users, MapPin, Building2, BookOpen } from 'lucide-react';

interface DemoGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DemoGuideModal: React.FC<DemoGuideModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const scenarios = [
    {
      title: '1. Life-Threatening Rescue SOS (Figure 3.1)',
      desc: 'On the Citizen Home page, hold the red "SEND RESCUE SOS" button for 2 seconds. Fill the emergency details and submit. An incident is created immediately with a unique ID (e.g. SOS-TN-1065) and appears in the Live Triage Room.',
      icon: ShieldAlert,
      badge: 'Citizen Workflow'
    },
    {
      title: '2. Offline IndexedDB Persistence & Automatic Sync',
      desc: 'Click "Simulate Offline" in the top bar. Submit an SOS alert. Notice the alert is stored securely in the browser IndexedDB (`STORE_NAME=sos_queue`). It survives page reloads! Click "Simulate Offline" again to reconnect: the queue automatically synchronizes with the EOC server with zero duplicate records.',
      icon: WifiOff,
      badge: 'Offline-First'
    },
    {
      title: '3. Ad-Hoc Software Mesh Network Simulator (Figure 4.2.2)',
      desc: 'Navigate to "Mesh Simulator". Drag nodes to test signal range disconnects. Adjust the "Signal Range" slider. Click "Broadcast SOS Packet" to watch multi-hop packet flooding in real time with TTL=7, duplicate packet suppression, and gateway uplink delivery to the central server.',
      icon: Radio,
      badge: 'Mesh Relay'
    },
    {
      title: '4. Responder Triage & Status Lifecycle (Figure 5.1.1)',
      desc: 'Switch role to "Responder" and go to "Alerts & Triage". Inspect active cards (SOS-TN-1048, SOS-TN-1052). Click "Advance Status" to transition incidents through ACKNOWLEDGED -> ASSIGNED -> IN_PROGRESS -> RESOLVED with field operational notes.',
      icon: Users,
      badge: 'Responder Room'
    },
    {
      title: '5. Interactive Disaster Map with Pulse Beacons',
      desc: 'Navigate to "Risk Map". View geo-tagged incidents with red pulsing beacons for critical priority, green markers for relief shelters with live occupancy gauges, and blue pins for civic hazards.',
      icon: MapPin,
      badge: 'Leaflet GIS'
    },
    {
      title: '6. CityZen Civic Infrastructure Reporting',
      desc: 'Navigate to "CityZen" to report blocked drains, road waterlogging, and slope cracks. Switch to "District Admin" or "Responder" to review, verify, and assign municipal departments (GCC, PWD, TNEB).',
      icon: Building2,
      badge: 'Civic Screening'
    },
    {
      title: '7. Trilingual Localization (EN / தமிழ் / हिंदी)',
      desc: 'Use the language dropdown in the header to switch between English, Tamil (தமிழ்), and Hindi (हिंदी). All critical safety instructions and UI terms are translated using reviewed emergency safety definitions.',
      icon: BookOpen,
      badge: 'Accessibility'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden my-8">
        <div className="bg-gradient-to-r from-cyan-950 via-slate-900 to-slate-900 p-5 border-b border-cyan-900/40 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-cyan-600/30 text-cyan-400 border border-cyan-600/50">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-black text-white">
                SAROS Master Demonstration Guide
              </h2>
              <p className="text-xs text-slate-400">
                Evaluation walkthrough based on RMKCET CSE PDL-III report
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close Demo Guide"
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 max-h-[70vh] overflow-y-auto space-y-3.5 text-xs">
          {scenarios.map((sc, idx) => {
            const Icon = sc.icon;
            return (
              <div
                key={idx}
                className="p-3.5 rounded-xl bg-slate-950 border border-slate-850 hover:border-slate-700 transition space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 font-bold text-slate-100 text-sm">
                    <Icon className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                    <span>{sc.title}</span>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-800 text-slate-300">
                    {sc.badge}
                  </span>
                </div>
                <p className="text-slate-300 leading-relaxed pl-6">
                  {sc.desc}
                </p>
              </div>
            );
          })}
        </div>

        <div className="p-4 bg-slate-950 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs rounded-xl shadow"
          >
            Close & Start Testing
          </button>
        </div>
      </div>
    </div>
  );
};
