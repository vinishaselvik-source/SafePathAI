import React from 'react';
import { NavView } from '../types';
import { 
  ShieldCheck, 
  MapPin, 
  Luggage, 
  AlertTriangle, 
  Hospital, 
  Bot, 
  ArrowRight, 
  Play, 
  Sparkles, 
  Activity, 
  WifiOff, 
  Moon, 
  BatteryCharging 
} from 'lucide-react';

interface LandingPageProps {
  onNavigate: (view: NavView) => void;
  onExploreDemo: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onNavigate, onExploreDemo }) => {
  return (
    <div className="space-y-16 pb-16">
      
      {/* Hero Section */}
      <section className="relative pt-8 md:pt-16 pb-12 overflow-hidden">
        {/* Ambient background glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-cyan-500/15 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute top-1/3 left-1/4 w-[350px] h-[250px] bg-blue-600/15 rounded-full blur-[100px] pointer-events-none"></div>

        <div className="max-w-5xl mx-auto text-center space-y-6 relative z-10 px-4">
          
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-card border border-cyan-500/30 text-cyan-300 text-xs font-semibold shadow-glow-cyan animate-pulse">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span>AI-POWERED TRAVEL SAFETY & PREPARATION PLATFORM</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white font-sans leading-[1.1]">
            Travel smarter. <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-teal-300 to-blue-400">
              Stay safer.
            </span>
          </h1>

          <p className="max-w-2xl mx-auto text-base sm:text-lg text-slate-300 font-normal leading-relaxed">
            SafePath AI doesn't just ask <span className="text-slate-100 font-semibold italic">“What is the fastest route?”</span> — it answers <span className="text-cyan-300 font-semibold">“What is the safest suitable route right now, am I prepared, and where can I get emergency help?”</span>
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <button
              onClick={() => onNavigate('plantrip')}
              className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-cyan-500 via-cyan-400 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-navy-950 font-extrabold text-base rounded-2xl shadow-glow-cyan transform hover:-translate-y-0.5 transition-all flex items-center justify-center gap-3"
            >
              <MapPin className="w-5 h-5 stroke-[2.5]" />
              <span>Plan My Journey</span>
              <ArrowRight className="w-5 h-5" />
            </button>

            <button
              onClick={onExploreDemo}
              className="w-full sm:w-auto px-8 py-4 glass-panel hover:bg-navy-800/80 text-white font-bold text-base rounded-2xl border border-slate-700 hover:border-cyan-400/50 transition-all flex items-center justify-center gap-3"
            >
              <Play className="w-5 h-5 text-cyan-400 fill-cyan-400" />
              <span>Explore Chennai → Pondicherry Demo</span>
            </button>
          </div>

          {/* Value props badges */}
          <div className="pt-8 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400 font-medium border-t border-white/5 max-w-3xl mx-auto">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-cyan-400" />
              <span>Route Safety Intelligence</span>
            </div>
            <div className="flex items-center gap-2">
              <Luggage className="w-4 h-4 text-teal-400" />
              <span>Weather-based Packing</span>
            </div>
            <div className="flex items-center gap-2">
              <Hospital className="w-4 h-4 text-rose-400" />
              <span>1-Tap Hospital Dispatch</span>
            </div>
            <div className="flex items-center gap-2">
              <WifiOff className="w-4 h-4 text-emerald-400" />
              <span>Offline Safety Pack</span>
            </div>
          </div>

        </div>

        {/* Hero Interactive App Mockup Preview */}
        <div className="max-w-6xl mx-auto mt-12 px-4">
          <div className="glass-panel p-4 md:p-6 rounded-3xl border border-white/10 shadow-2xl relative overflow-hidden">
            
            {/* Header bar of preview */}
            <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-4">
              <div className="flex items-center gap-3">
                <span className="w-3 h-3 rounded-full bg-rose-500"></span>
                <span className="w-3 h-3 rounded-full bg-amber-500"></span>
                <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
                <span className="text-xs font-mono text-slate-400 ml-2">safepath.ai / active-journey-monitor</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  SAFETY BUBBLE ACTIVE
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-cyan-500/20 text-cyan-300">
                  READINESS 78/100
                </span>
              </div>
            </div>

            {/* Simulated UI layout */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Route Summary */}
              <div className="glass-card p-4 rounded-2xl border border-white/5 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white">Chennai → Pondicherry</span>
                  <span className="text-xs font-bold text-cyan-400">91/100 Safe</span>
                </div>
                <div className="text-xs text-slate-300 space-y-1 font-mono">
                  <p>Distance: 155 km · ECR Route</p>
                  <p>ETA: 3h 15m · Car</p>
                  <p>Weather: 28°C · Moderate Rain</p>
                </div>
                <div className="p-2.5 bg-emerald-950/40 border border-emerald-500/30 rounded-xl text-[11px] text-emerald-300">
                  ✅ AI Recommended: Lowest accident rate & 24/7 hospital access.
                </div>
              </div>

              {/* Map Preview */}
              <div className="glass-card p-4 rounded-2xl border border-white/5 bg-navy-900/90 relative overflow-hidden flex flex-col justify-between min-h-[140px]">
                <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#00f5d4_1px,transparent_1px)] [background-size:16px_16px]"></div>
                <div className="relative z-10 flex items-center justify-between text-xs font-semibold">
                  <span className="text-cyan-400 flex items-center gap-1"><Activity className="w-3.5 h-3.5" /> Live Map Overlay</span>
                  <span className="text-[10px] text-amber-400 bg-amber-500/20 px-2 py-0.5 rounded">1 Incident Ahead</span>
                </div>
                <div className="relative z-10 my-3 flex items-center justify-between px-2 text-xs font-mono">
                  <span className="px-2 py-1 bg-cyan-500/20 border border-cyan-400 text-cyan-300 rounded">📍 Chennai Start</span>
                  <div className="flex-1 h-0.5 bg-gradient-to-r from-cyan-400 via-amber-400 to-emerald-400 mx-2"></div>
                  <span className="px-2 py-1 bg-emerald-500/20 border border-emerald-400 text-emerald-300 rounded">📍 Pondicherry</span>
                </div>
                <div className="relative z-10 text-[10px] text-slate-400 flex items-center justify-between">
                  <span>Apollo Hospital: 2.4 km away</span>
                  <span className="text-cyan-300 font-bold">Interactive Leaflet Active</span>
                </div>
              </div>

              {/* Copilot Advice */}
              <div className="glass-card p-4 rounded-2xl border border-white/5 space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-white">
                  <Bot className="w-4 h-4 text-cyan-400" />
                  <span>AI Copilot Briefing</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  “Route B is recommended. Waterlogging reported 2.1km ahead on coastal stretch. Maintain 25 km/h. Phone battery at 42% — charging station available at Km 12.”
                </p>
                <button 
                  onClick={onExploreDemo}
                  className="w-full py-1.5 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 rounded-xl text-xs font-bold transition-colors"
                >
                  Launch Full Interactive Prototype
                </button>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Feature Showcase Grid */}
      <section className="max-w-6xl mx-auto px-4 space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-extrabold text-white">
            Everything you need for complete journey safety
          </h2>
          <p className="text-slate-400 text-sm">
            Designed for solo travelers, families, road trippers, and late-night commuters.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          <div className="glass-panel p-6 rounded-2xl border border-white/5 space-y-4 hover:border-cyan-500/30 transition-all">
            <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">🗺️ Safer Routes</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Calculates safety scores based on lighting, road quality, hospital proximity, accident frequency, and connectivity—not just speed.
            </p>
          </div>

          <div className="glass-panel p-6 rounded-2xl border border-white/5 space-y-4 hover:border-cyan-500/30 transition-all">
            <div className="w-12 h-12 rounded-xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400">
              <Luggage className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">🎒 Smart Travel Preparation</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Auto-generates tailored checklists based on destination weather, journey duration, mode of transport, and vehicle checks.
            </p>
          </div>

          <div className="glass-panel p-6 rounded-2xl border border-white/5 space-y-4 hover:border-cyan-500/30 transition-all">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">⚠️ Live Incident Conditions</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Crowdsourced community hazard reporting verified by AI algorithms (High Confidence, Likely, Unconfirmed) with instant auto-rerouting.
            </p>
          </div>

          <div className="glass-panel p-6 rounded-2xl border border-white/5 space-y-4 hover:border-cyan-500/30 transition-all">
            <div className="w-12 h-12 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400">
              <Hospital className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">🏥 Nearby Hospital Finder</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Instant 1-tap navigation to verified 24/7 hospitals with ICU status, ambulance availability, emergency hotlines, and location sharing.
            </p>
          </div>

          <div className="glass-panel p-6 rounded-2xl border border-white/5 space-y-4 hover:border-cyan-500/30 transition-all">
            <div className="w-12 h-12 rounded-xl bg-violet-500/10 border border-violet-500/30 flex items-center justify-center text-violet-400">
              <Moon className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">🌙 Night Safety & Bubble</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Specialized night route mode prioritizing well-lit, populated roads with an active virtual safety perimeter and timed smart check-ins.
            </p>
          </div>

          <div className="glass-panel p-6 rounded-2xl border border-white/5 space-y-4 hover:border-cyan-500/30 transition-all">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <BatteryCharging className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">📡 Offline Pack & Battery</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Low connectivity zone alerts, battery survival advisories, and offline safety pack saving so your emergency details work everywhere.
            </p>
          </div>

        </div>
      </section>

      {/* Complete Journey Flow Steps */}
      <section className="max-w-5xl mx-auto px-4 py-8 glass-panel rounded-3xl border border-white/10">
        <h2 className="text-2xl font-extrabold text-white text-center mb-8">
          The Complete Journey Experience
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-6 gap-3 text-center">
          <div className="p-3 glass-card rounded-xl border border-white/5">
            <span className="text-[10px] font-mono text-cyan-400 font-bold block mb-1">STEP 1</span>
            <span className="text-xs font-bold text-white">Before Travel</span>
            <p className="text-[10px] text-slate-400 mt-1">Readiness Score & Checklist</p>
          </div>
          <div className="p-3 glass-card rounded-xl border border-white/5">
            <span className="text-[10px] font-mono text-cyan-400 font-bold block mb-1">STEP 2</span>
            <span className="text-xs font-bold text-white">Route Planning</span>
            <p className="text-[10px] text-slate-400 mt-1">AI Safety Analysis</p>
          </div>
          <div className="p-3 glass-card rounded-xl border border-white/5">
            <span className="text-[10px] font-mono text-cyan-400 font-bold block mb-1">STEP 3</span>
            <span className="text-xs font-bold text-white">Preparation</span>
            <p className="text-[10px] text-slate-400 mt-1">Offline Safety Pack</p>
          </div>
          <div className="p-3 glass-card rounded-xl border border-white/5">
            <span className="text-[10px] font-mono text-cyan-400 font-bold block mb-1">STEP 4</span>
            <span className="text-xs font-bold text-white">Live Journey</span>
            <p className="text-[10px] text-slate-400 mt-1">Safety Bubble & Check-in</p>
          </div>
          <div className="p-3 glass-card rounded-xl border border-white/5">
            <span className="text-[10px] font-mono text-cyan-400 font-bold block mb-1">STEP 5</span>
            <span className="text-xs font-bold text-white">Adapting</span>
            <p className="text-[10px] text-slate-400 mt-1">Dynamic Auto-Reroute</p>
          </div>
          <div className="p-3 glass-card rounded-xl border border-white/5">
            <span className="text-[10px] font-mono text-cyan-400 font-bold block mb-1">STEP 6</span>
            <span className="text-xs font-bold text-white">Emergency</span>
            <p className="text-[10px] text-slate-400 mt-1">1-Tap Hospital & SOS</p>
          </div>
        </div>
      </section>

    </div>
  );
};
