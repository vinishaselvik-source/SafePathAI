import React from 'react';
import { Wifi, Battery, Signal, Smartphone, Monitor } from 'lucide-react';

interface MobileDeviceFrameProps {
  children: React.ReactNode;
  isMobileSimulated: boolean;
  onToggleSimulator: () => void;
}

export const MobileDeviceFrame: React.FC<MobileDeviceFrameProps> = ({ 
  children, 
  isMobileSimulated, 
  onToggleSimulator 
}) => {
  if (!isMobileSimulated) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-[#070a12] text-slate-100 flex flex-col items-center justify-start sm:justify-center p-0 sm:p-4 md:p-6 relative overflow-x-hidden font-sans">
      {/* Background Ambience */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-rose-600/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Top Device Simulator Floating Switcher */}
      <div className="hidden sm:flex items-center gap-3 mb-3 z-50 bg-slate-900/90 backdrop-blur border border-slate-800 rounded-full px-4 py-1.5 shadow-2xl text-xs">
        <span className="flex items-center gap-1.5 text-rose-400 font-bold">
          <Smartphone className="w-4 h-4" />
          <span>Mobile Device Simulation Active</span>
        </span>
        <span className="text-slate-600">|</span>
        <button
          onClick={onToggleSimulator}
          className="text-slate-400 hover:text-white font-medium flex items-center gap-1 transition"
        >
          <Monitor className="w-3.5 h-3.5" />
          <span>Switch to Desktop View</span>
        </button>
      </div>

      {/* STRICT MOBILE DEVICE CONTAINER (iPhone / Android Native Dimensions) */}
      <div className="w-full sm:w-[410px] h-screen sm:h-[840px] bg-[#0b0f19] border-0 sm:border-[10px] border-slate-800 rounded-none sm:rounded-[44px] shadow-2xl shadow-rose-950/30 flex flex-col relative overflow-hidden ring-1 ring-slate-700/50">
        
        {/* Dynamic Island Notch */}
        <div className="hidden sm:flex absolute top-0 left-1/2 -translate-x-1/2 z-50 w-28 h-5 bg-slate-950 rounded-b-xl items-center justify-center gap-2">
          <div className="w-2 h-2 rounded-full bg-slate-900 border border-slate-800" />
          <div className="w-2.5 h-2.5 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center">
            <div className="w-1 h-1 rounded-full bg-emerald-400" />
          </div>
        </div>

        {/* Mobile Status Bar (9:41, 5G, Wifi, 84%) */}
        <div className="pt-2 sm:pt-6 px-5 pb-1.5 bg-[#0b0f19]/95 backdrop-blur-md flex items-center justify-between text-[11px] font-mono font-bold text-slate-300 border-b border-slate-850 z-40 select-none">
          <span>9:41</span>
          <div className="flex items-center gap-2 text-xs">
            <Signal className="w-3.5 h-3.5 text-slate-300" />
            <span className="text-[10px] text-teal-400 font-extrabold">5G</span>
            <Wifi className="w-3.5 h-3.5 text-teal-400" />
            <div className="flex items-center gap-1">
              <span className="text-[10px]">84%</span>
              <Battery className="w-4 h-4 text-emerald-400 fill-emerald-400/30" />
            </div>
          </div>
        </div>

        {/* Scrollable Mobile App Body */}
        <div className="flex-1 overflow-y-auto relative scrollbar-none pb-14">
          {children}
        </div>

        {/* Mobile Safe Indicator Bar */}
        <div className="py-1.5 bg-[#0b0f19]/95 backdrop-blur-md flex items-center justify-center z-40 border-t border-slate-850">
          <div className="w-28 h-1 bg-slate-600 rounded-full" />
        </div>
      </div>
    </div>
  );
};
