import React from 'react';
import { Wifi, Battery, Signal } from 'lucide-react';

interface MobileDeviceFrameProps {
  children: React.ReactNode;
}

export const MobileDeviceFrame: React.FC<MobileDeviceFrameProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-[#0b0f19] text-slate-100 flex flex-col items-center justify-center p-0 md:p-6 relative overflow-x-hidden font-sans">
      
      {/* Ambient background blur for mobile app showcase */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-[160px] pointer-events-none"></div>

      {/* STRICT MOBILE DEVICE CONTAINER (iPhone 16 Pro Dimensions: 410px width x 870px height) */}
      <div className="w-full md:w-[410px] h-screen md:h-[860px] bg-[#12161f] border-0 md:border-[10px] border-slate-800/90 rounded-none md:rounded-[48px] shadow-2xl shadow-emerald-950/40 flex flex-col relative overflow-hidden ring-1 ring-emerald-500/30">
        
        {/* Dynamic Island Notch (iOS style) */}
        <div className="hidden md:flex absolute top-0 left-1/2 -translate-x-1/2 z-50 w-32 h-6 bg-slate-900 rounded-b-2xl items-center justify-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-slate-800 border border-slate-700"></div>
          <div className="w-3 h-3 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center">
            <div className="w-1 h-1 rounded-full bg-emerald-400"></div>
          </div>
        </div>

        {/* Native Mobile Status Bar (9:41, 5G, Wifi, Battery) */}
        <div className="pt-2 md:pt-7 px-5 pb-2 bg-[#12161f]/95 backdrop-blur-md flex items-center justify-between text-[11px] font-mono font-bold text-slate-300 border-b border-white/5 z-40 select-none">
          <span>9:41</span>
          <div className="flex items-center gap-2 text-xs">
            <Signal className="w-3.5 h-3.5 text-slate-300" />
            <span className="text-[10px] text-emerald-400 font-extrabold">5G</span>
            <Wifi className="w-3.5 h-3.5 text-emerald-400" />
            <div className="flex items-center gap-1">
              <span className="text-[10px]">84%</span>
              <Battery className="w-4 h-4 text-emerald-400 fill-emerald-400/30" />
            </div>
          </div>
        </div>

        {/* Scrollable Mobile App Body */}
        <div className="flex-1 overflow-y-auto relative scrollbar-none">
          {children}
        </div>

        {/* iOS Native Bottom Home Indicator Bar */}
        <div className="py-2 bg-[#12161f]/95 backdrop-blur-md flex items-center justify-center z-40 border-t border-white/5">
          <div className="w-32 h-1 bg-slate-600 rounded-full"></div>
        </div>

      </div>
    </div>
  );
};
