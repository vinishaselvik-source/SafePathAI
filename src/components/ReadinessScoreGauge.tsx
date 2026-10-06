import React from 'react';
import { TravelReadiness } from '../types';
import { ShieldCheck, Zap, AlertTriangle, Battery, Umbrella, Navigation } from 'lucide-react';

interface ReadinessScoreGaugeProps {
  readiness: TravelReadiness;
  onOptimizeClick?: () => void;
}

export const ReadinessScoreGauge: React.FC<ReadinessScoreGaugeProps> = ({ readiness, onOptimizeClick }) => {
  const score = readiness.totalScore;
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  const getScoreColor = (val: number) => {
    if (val >= 80) return '#34d399'; // Mint Green
    if (val >= 60) return '#fbbf24'; // Warm Gold
    return '#f87171'; // Red
  };

  const currentColor = getScoreColor(score);

  return (
    <div className="glass-panel rounded-2xl p-6 relative overflow-hidden">
      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
        
        {/* Left: Circular Gauge */}
        <div className="relative flex flex-col items-center justify-center">
          <svg className="w-44 h-44 transform -rotate-90">
            {/* Background Track */}
            <circle
              cx="88"
              cy="88"
              r={radius}
              stroke="rgba(255, 255, 255, 0.08)"
              strokeWidth="12"
              fill="transparent"
            />
            {/* Active Gauge */}
            <circle
              cx="88"
              cy="88"
              r={radius}
              stroke={currentColor}
              strokeWidth="12"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              fill="transparent"
              className="transition-all duration-1000 ease-out"
              style={{ filter: `drop-shadow(0 0 10px ${currentColor}80)` }}
            />
          </svg>

          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className="text-4xl font-extrabold tracking-tight text-white font-sans">
              {score}
            </span>
            <span className="text-xs text-slate-400 font-medium tracking-wide uppercase mt-0.5">
              Out of 100
            </span>
          </div>

          <div className="mt-3 inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
            <ShieldCheck className="w-3.5 h-3.5 mr-1 text-emerald-400" />
            {score >= 75 ? "You're Almost Ready" : "Preparation Needed"}
          </div>
        </div>

        {/* Right: Breakdown & AI Advice */}
        <div className="flex-1 w-full space-y-4">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <span>Travel Readiness Analysis</span>
              <span className="text-xs bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded font-mono font-bold">AI REAL-TIME</span>
            </h3>
            <p className="text-xs text-slate-300 mt-1">
              Evaluated across route hazards, weather warnings, equipment, and battery longevity.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            <div className="glass-card p-2.5 rounded-xl border border-white/5">
              <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                <span className="flex items-center gap-1"><Navigation className="w-3 h-3 text-emerald-400" /> Route</span>
                <span className="font-mono text-emerald-400 font-bold">{readiness.breakdown.routeCondition.score}/20</span>
              </div>
              <div className="w-full bg-navy-950 rounded-full h-1.5 overflow-hidden">
                <div className="bg-emerald-400 h-1.5 rounded-full" style={{ width: '90%' }}></div>
              </div>
            </div>

            <div className="glass-card p-2.5 rounded-xl border border-white/5">
              <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                <span className="flex items-center gap-1"><Umbrella className="w-3 h-3 text-amber-400" /> Weather</span>
                <span className="font-mono text-amber-400 font-bold">{readiness.breakdown.weatherPrep.score}/20</span>
              </div>
              <div className="w-full bg-navy-950 rounded-full h-1.5 overflow-hidden">
                <div className="bg-amber-400 h-1.5 rounded-full" style={{ width: '60%' }}></div>
              </div>
            </div>

            <div className="glass-card p-2.5 rounded-xl border border-white/5">
              <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                <span className="flex items-center gap-1"><Zap className="w-3 h-3 text-emerald-400" /> Items</span>
                <span className="font-mono text-emerald-400 font-bold">{readiness.breakdown.essentialItems.score}/20</span>
              </div>
              <div className="w-full bg-navy-950 rounded-full h-1.5 overflow-hidden">
                <div className="bg-emerald-400 h-1.5 rounded-full" style={{ width: '80%' }}></div>
              </div>
            </div>

            <div className="glass-card p-2.5 rounded-xl border border-white/5">
              <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                <span className="flex items-center gap-1"><Battery className="w-3 h-3 text-emerald-400" /> Battery</span>
                <span className="font-mono text-emerald-400 font-bold">{readiness.breakdown.phoneBattery.score}/20</span>
              </div>
              <div className="w-full bg-navy-950 rounded-full h-1.5 overflow-hidden">
                <div className="bg-emerald-400 h-1.5 rounded-full" style={{ width: '90%' }}></div>
              </div>
            </div>

            <div className="glass-card p-2.5 rounded-xl border border-white/5 col-span-2 sm:col-span-2">
              <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                <span className="flex items-center gap-1"><AlertTriangle className="w-3 h-3 text-amber-400" /> Emergency Prep</span>
                <span className="font-mono text-amber-400 font-bold">{readiness.breakdown.emergencyPrep.score}/20</span>
              </div>
              <div className="w-full bg-navy-950 rounded-full h-1.5 overflow-hidden">
                <div className="bg-amber-400 h-1.5 rounded-full" style={{ width: '70%' }}></div>
              </div>
            </div>
          </div>

          <div className="p-3 bg-emerald-950/40 border border-emerald-500/30 rounded-xl flex items-start gap-2.5">
            <ShieldCheck className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
            <div className="flex-1 text-xs">
              <span className="font-semibold text-emerald-300">AI Safety Recommendation:</span>
              <p className="text-slate-300 mt-0.5 leading-relaxed">
                {readiness.recommendation}
              </p>
            </div>
            {onOptimizeClick && (
              <button
                onClick={onOptimizeClick}
                className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-lg text-xs transition-colors shrink-0 shadow-sm"
              >
                Optimize
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
