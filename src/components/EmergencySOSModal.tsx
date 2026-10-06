import React, { useState } from 'react';
import { 
  AlertOctagon, 
  Phone, 
  MapPin, 
  Users, 
  Hospital as HospitalIcon, 
  ShieldAlert, 
  Send, 
  X,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { TrustedContact, Hospital, NavView } from '../types';

interface EmergencySOSModalProps {
  isOpen: boolean;
  onClose: () => void;
  contacts: TrustedContact[];
  nearestHospital: Hospital;
  onNavigate: (view: NavView) => void;
}

export const EmergencySOSModal: React.FC<EmergencySOSModalProps> = ({
  isOpen,
  onClose,
  contacts,
  nearestHospital,
  onNavigate,
}) => {
  const [confirmed, setConfirmed] = useState<boolean>(false);
  const [notifiedState, setNotifiedState] = useState<boolean>(false);
  const [dialingNumber, setDialingNumber] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleConfirmSOS = () => {
    setConfirmed(true);
    setNotifiedState(true);
  };

  const handleDial = (number: string) => {
    setDialingNumber(number);
    setTimeout(() => setDialingNumber(null), 4000);
  };

  return (
    <div className="fixed inset-0 z-50 glass-nav bg-navy-950/90 backdrop-blur-xl flex items-center justify-center p-4">
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border-2 border-rose-500/50 max-w-xl w-full space-y-6 relative shadow-2xl shadow-rose-950/50 animate-in zoom-in-95 duration-200">
        
        {/* Close Button */}
        <button
          onClick={() => {
            setConfirmed(false);
            setNotifiedState(false);
            onClose();
          }}
          className="absolute top-4 right-4 p-2 rounded-xl bg-navy-800 text-slate-400 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        {!confirmed ? (
          /* STEP 1: Confirmation Screen */
          <div className="text-center space-y-5">
            <div className="w-20 h-20 rounded-full bg-rose-500/20 border-2 border-rose-500/50 flex items-center justify-center text-rose-400 mx-auto animate-bounce">
              <AlertOctagon className="w-10 h-10 stroke-[2.5]" />
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-extrabold text-white">Activate Emergency SOS Protocol?</h2>
              <p className="text-xs text-slate-300 max-w-md mx-auto leading-relaxed">
                This will immediately broadcast your live GPS coordinates, notify your 3 Safety Circle contacts, and connect you to local emergency care.
              </p>
            </div>

            <div className="p-3 bg-rose-950/60 border border-rose-500/30 rounded-xl text-[11px] text-rose-300">
              ⚠️ Confirming will send automated emergency SMS alerts.
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                onClick={() => onClose()}
                className="flex-1 py-3 bg-navy-800 hover:bg-navy-700 text-slate-300 font-bold text-xs rounded-xl"
              >
                Cancel / Accidental Tap
              </button>

              <button
                onClick={handleConfirmSOS}
                className="flex-1 py-3 bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white font-extrabold text-xs rounded-xl shadow-glow-rose uppercase tracking-wider"
              >
                🚨 YES, DISPATCH EMERGENCY SOS
              </button>
            </div>
          </div>
        ) : (
          /* STEP 2: Active Dispatch Screen */
          <div className="space-y-5">
            <div className="flex items-center justify-between border-b border-rose-500/30 pb-3">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-rose-500 animate-ping"></span>
                <h2 className="text-lg font-extrabold text-rose-400">EMERGENCY ASSISTANCE PROTOCOL</h2>
              </div>
              <span className="text-[10px] font-mono font-bold bg-rose-500/20 text-rose-300 px-2 py-0.5 rounded border border-rose-500/30">
                GPS LIVE ACTIVE
              </span>
            </div>

            {/* Notification Confirmation Toast */}
            {notifiedState && (
              <div className="p-3 bg-emerald-950/80 border border-emerald-500/40 rounded-xl text-xs text-emerald-300 font-semibold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>“I may need assistance. My current location has been shared.” sent to 3 contacts.</span>
              </div>
            )}

            {dialingNumber && (
              <div className="p-3 bg-rose-950/80 border border-rose-500/40 rounded-xl text-xs text-rose-300 font-semibold flex items-center gap-2 animate-pulse">
                <Phone className="w-4 h-4 text-rose-400 shrink-0" />
                <span>Simulating Direct Call to <strong>{dialingNumber}</strong>...</span>
              </div>
            )}

            {/* Emergency Action Buttons Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              
              <button
                onClick={() => handleDial('108')}
                className="p-3.5 bg-rose-950/60 hover:bg-rose-900/80 border border-rose-500/40 rounded-2xl text-left transition-all group"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-rose-500/20 flex items-center justify-center text-rose-400 font-bold text-xs">
                    108
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-white">Call National Ambulance</h3>
                    <p className="text-[10px] text-slate-300">Medical emergency dispatch</p>
                  </div>
                </div>
              </button>

              <button
                onClick={() => handleDial('100')}
                className="p-3.5 bg-navy-900/80 hover:bg-navy-800 border border-blue-500/40 rounded-2xl text-left transition-all group"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-blue-500/20 flex items-center justify-center text-blue-400 font-bold text-xs">
                    100
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-white">Call Highway Police</h3>
                    <p className="text-[10px] text-slate-300">Immediate security patrol</p>
                  </div>
                </div>
              </button>

              <button
                onClick={() => {
                  onClose();
                  onNavigate('hospitals');
                }}
                className="p-3.5 bg-navy-900/80 hover:bg-navy-800 border border-cyan-500/40 rounded-2xl text-left transition-all"
              >
                <div className="flex items-center gap-2.5">
                  <HospitalIcon className="w-6 h-6 text-cyan-400 shrink-0" />
                  <div>
                    <h3 className="text-xs font-bold text-white">Apollo Hospital (2.4 km)</h3>
                    <p className="text-[10px] text-cyan-300 font-semibold">1-Tap Emergency Route</p>
                  </div>
                </div>
              </button>

              <button
                onClick={() => {
                  onClose();
                  onNavigate('profile');
                }}
                className="p-3.5 bg-navy-900/80 hover:bg-navy-800 border border-purple-500/40 rounded-2xl text-left transition-all"
              >
                <div className="flex items-center gap-2.5">
                  <Users className="w-6 h-6 text-purple-400 shrink-0" />
                  <div>
                    <h3 className="text-xs font-bold text-white">Safety Circle Contacts</h3>
                    <p className="text-[10px] text-slate-300">Rohan, Priya, Anand notified</p>
                  </div>
                </div>
              </button>

            </div>

            {/* Disclaimer */}
            <p className="text-[10px] text-slate-400 text-center pt-2">
              Demo information — verify with official emergency services (108 / 100).
            </p>

          </div>
        )}

      </div>
    </div>
  );
};
