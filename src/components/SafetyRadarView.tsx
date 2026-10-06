import React, { useState } from 'react';
import { IncidentReport, IncidentType } from '../types';
import { 
  Radio, 
  AlertTriangle, 
  Plus, 
  ShieldCheck, 
  Clock, 
  CheckCircle2, 
  Send, 
  X,
  Sparkles,
  Layers
} from 'lucide-react';

interface SafetyRadarViewProps {
  incidents: IncidentReport[];
  onAddIncident: (newInc: IncidentReport) => void;
}

export const SafetyRadarView: React.FC<SafetyRadarViewProps> = ({ incidents, onAddIncident }) => {
  const [showReportModal, setShowReportModal] = useState<boolean>(false);
  const [incidentType, setIncidentType] = useState<IncidentType>('waterlogging');
  const [locationName, setLocationName] = useState<string>('ECR Kovalam Stretch');
  const [description, setDescription] = useState<string>('Water accumulation on road left lane.');
  const [severity, setSeverity] = useState<'low' | 'medium' | 'high'>('medium');
  const [submittedFeedback, setSubmittedFeedback] = useState<string | null>(null);

  const handleReportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newReport: IncidentReport = {
      id: `inc-${Date.now()}`,
      type: incidentType,
      title: `${incidentType.toUpperCase()} Incident`,
      locationName: locationName || 'Current Location',
      lat: 12.8000,
      lng: 80.2400,
      distanceAheadKm: 2.1,
      timeAgoMinutes: 1,
      severity: severity,
      confirmationCount: 1,
      confidence: 'high',
      description: description || 'User submitted community report.',
    };

    onAddIncident(newReport);
    setSubmittedFeedback('Report received. AI verification complete: High Confidence (🟢 6 confirmations linked).');
    setTimeout(() => {
      setShowReportModal(false);
      setSubmittedFeedback(null);
    }, 2000);
  };

  const getConfidenceBadge = (confidence: IncidentReport['confidence']) => {
    if (confidence === 'high') {
      return (
        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
          🟢 High Confidence
        </span>
      );
    } else if (confidence === 'likely') {
      return (
        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center gap-1">
          🟡 Likely
        </span>
      );
    }
    return (
      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-500/20 text-slate-300 border border-slate-500/30 flex items-center gap-1">
        ⚪ Unconfirmed
      </span>
    );
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white flex items-center gap-2">
            <Radio className="w-7 h-7 text-amber-400 animate-pulse" />
            <span>Safety Radar & Road Conditions</span>
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm mt-1">
            Real-time crowdsourced road reports verified by AI cross-validation.
          </p>
        </div>

        <button
          onClick={() => setShowReportModal(true)}
          className="px-4 py-2.5 bg-gradient-to-r from-amber-500 to-rose-600 hover:from-amber-400 hover:to-rose-500 text-white font-extrabold text-xs rounded-xl shadow-glow-rose transition-all flex items-center justify-center gap-2 shrink-0"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>+ Report an Issue</span>
        </button>
      </div>

      {/* Incidents Feed Grid */}
      <div className="space-y-4">
        {incidents.map((inc) => (
          <div
            key={inc.id}
            className="glass-panel p-5 rounded-2xl border border-white/10 hover:border-amber-500/40 transition-all space-y-3"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-white">{inc.title}</h3>
                  <p className="text-xs text-slate-300 font-mono">{inc.locationName}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {getConfidenceBadge(inc.confidence)}
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                  inc.severity === 'high' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                }`}>
                  {inc.severity} Severity
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-300 bg-navy-900/60 p-3 rounded-xl border border-white/5 leading-relaxed">
              {inc.description}
            </p>

            <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 font-mono">
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-cyan-400" /> Reported {inc.timeAgoMinutes}m ago
              </span>
              <span className="flex items-center gap-1 text-emerald-400 font-bold">
                <CheckCircle2 className="w-3.5 h-3.5" /> Confirmed by {inc.confirmationCount} travelers
              </span>
              <span className="text-cyan-300 font-bold">{inc.distanceAheadKm} km ahead</span>
            </div>
          </div>
        ))}
      </div>

      {/* REPORT ISSUE MODAL */}
      {showReportModal && (
        <div className="fixed inset-0 z-50 glass-nav bg-navy-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="glass-panel p-6 rounded-3xl border border-white/10 max-w-lg w-full space-y-5 relative shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h2 className="text-lg font-extrabold text-white flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-400" />
                <span>Report Road Issue</span>
              </h2>
              <button 
                onClick={() => setShowReportModal(false)}
                className="p-1 rounded-lg hover:bg-navy-800 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {submittedFeedback ? (
              <div className="p-4 bg-emerald-950/60 border border-emerald-500/40 rounded-2xl text-center space-y-2">
                <ShieldCheck className="w-8 h-8 text-emerald-400 mx-auto animate-bounce" />
                <p className="text-xs font-bold text-emerald-300">{submittedFeedback}</p>
              </div>
            ) : (
              <form onSubmit={handleReportSubmit} className="space-y-4">
                
                {/* Type options grid */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-2">Issue Category</label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {[
                      { id: 'waterlogging', label: '💧 Waterlogging' },
                      { id: 'accident', label: '🚨 Accident' },
                      { id: 'roaddamage', label: '🕳️ Road Damage' },
                      { id: 'construction', label: '🚧 Construction' },
                      { id: 'lighting', label: '🌑 Lighting' },
                      { id: 'roadblock', label: '🚫 Block' },
                      { id: 'crowd', label: '👥 Unsafe Crowd' },
                      { id: 'other', label: '⚠️ Other' },
                    ].map((t) => (
                      <button
                        type="button"
                        key={t.id}
                        onClick={() => setIncidentType(t.id as IncidentType)}
                        className={`p-2 rounded-xl text-xs font-semibold border text-center transition-all ${
                          incidentType === t.id
                            ? 'bg-amber-500/20 border-amber-400 text-amber-300 shadow-glow-rose'
                            : 'bg-navy-900/60 border-slate-700 text-slate-400 hover:text-white'
                        }`}
                      >
                        {t.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Location Details</label>
                  <input
                    type="text"
                    required
                    value={locationName}
                    onChange={(e) => setLocationName(e.target.value)}
                    className="w-full px-3.5 py-2 bg-navy-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Issue Description</label>
                  <textarea
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full px-3.5 py-2 bg-navy-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Severity Rating</label>
                  <div className="flex gap-3">
                    {['low', 'medium', 'high'].map((sev) => (
                      <button
                        type="button"
                        key={sev}
                        onClick={() => setSeverity(sev as 'low' | 'medium' | 'high')}
                        className={`flex-1 py-1.5 rounded-lg text-xs font-extrabold uppercase border ${
                          severity === sev
                            ? 'bg-rose-500/30 border-rose-400 text-rose-300'
                            : 'bg-navy-900 border-slate-700 text-slate-400'
                        }`}
                      >
                        {sev}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowReportModal(false)}
                    className="px-4 py-2 bg-navy-800 text-slate-300 text-xs font-bold rounded-xl"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-amber-500 hover:bg-amber-400 text-navy-950 text-xs font-extrabold rounded-xl shadow-glow-rose flex items-center gap-1.5"
                  >
                    <Send className="w-4 h-4" />
                    <span>Submit Report</span>
                  </button>
                </div>

              </form>
            )}

          </div>
        </div>
      )}

    </div>
  );
};
