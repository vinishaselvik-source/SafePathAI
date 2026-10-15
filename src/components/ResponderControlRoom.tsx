import React, { useState, useEffect } from 'react';
import { 
  AlertTriangle, Shield, CheckCircle2, Clock, 
  MapPin, Users, Radio, ChevronRight, UserPlus, Filter, Search, MessageSquare, ArrowUpRight 
} from 'lucide-react';
import { Incident, IncidentStatus, UserRole } from '../types';
import { api } from '../services/api';

interface ResponderControlRoomProps {
  currentRole: UserRole;
  onLocateIncidentOnMap: (incident: Incident) => void;
}

export const ResponderControlRoom: React.FC<ResponderControlRoomProps> = ({
  currentRole,
  onLocateIncidentOnMap
}) => {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [filterCategory, setFilterCategory] = useState<string>('ALL');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);
  const [advanceStatusModal, setAdvanceStatusModal] = useState<boolean>(false);
  const [newStatus, setNewStatus] = useState<IncidentStatus>('ACKNOWLEDGED');
  const [responderNote, setResponderNote] = useState<string>('');
  const [assignmentModal, setAssignmentModal] = useState<boolean>(false);
  const [assigneeName, setAssigneeName] = useState<string>('Karthik Sivakumar (Volunteer TNDVF)');
  const [assigneeRole, setAssigneeRole] = useState<string>('volunteer');

  const fetchIncidents = async () => {
    try {
      setLoading(true);
      const data = await api.getIncidents({
        category: filterCategory,
        status: filterStatus,
        search: searchQuery
      });
      setIncidents(data);
    } catch (err) {
      console.error('Failed to fetch triage incidents:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIncidents();
  }, [filterCategory, filterStatus, searchQuery]);

  const handleAdvanceStatus = async () => {
    if (!selectedIncident) return;
    try {
      await api.updateIncidentStatus(selectedIncident.id, newStatus, responderNote);
      setAdvanceStatusModal(false);
      setResponderNote('');
      fetchIncidents();
    } catch (err: any) {
      alert(`Status update failed: ${err.message}`);
    }
  };

  const handleAssignTeam = async () => {
    if (!selectedIncident) return;
    try {
      await api.assignIncident(selectedIncident.id, {
        id: `usr-assigned-${Date.now()}`,
        name: assigneeName,
        role: assigneeRole
      });
      setAssignmentModal(false);
      fetchIncidents();
    } catch (err: any) {
      alert(`Assignment failed: ${err.message}`);
    }
  };

  const getNextRecommendedStatus = (current: IncidentStatus): IncidentStatus => {
    switch (current) {
      case 'SUBMITTED': return 'ACKNOWLEDGED';
      case 'ACKNOWLEDGED': return 'ASSIGNED';
      case 'ASSIGNED': return 'IN_PROGRESS';
      case 'IN_PROGRESS': return 'RESOLVED';
      case 'RESOLVED': return 'CLOSED';
      default: return 'IN_PROGRESS';
    }
  };

  const openAdvanceModal = (inc: Incident) => {
    setSelectedIncident(inc);
    setNewStatus(getNextRecommendedStatus(inc.status));
    setAdvanceStatusModal(true);
  };

  const openAssignModal = (inc: Incident) => {
    setSelectedIncident(inc);
    setAssignmentModal(true);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-5">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
            SAROS Emergency Triage & Control Room
          </h1>
          <p className="text-xs text-slate-400">
            Field incident dispatch, live mesh status advancement, and responder coordination
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchIncidents}
            className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-800 transition"
          >
            Refresh Feed
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 flex-1 min-w-[220px]">
          <Search className="w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by ID (e.g. SOS-TN-1048), description, ward..."
            className="bg-transparent flex-1 text-slate-200 focus:outline-none placeholder-slate-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="bg-slate-950 text-slate-300 border border-slate-800 rounded-lg px-2.5 py-1.5 focus:outline-none"
          >
            <option value="ALL">All Categories</option>
            <option value="FLOOD">Flooding</option>
            <option value="MEDICAL">Medical Emergency</option>
            <option value="FOOD_WATER">Food & Water</option>
            <option value="FIRE">Fire</option>
            <option value="TRAPPED">Trapped</option>
          </select>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="bg-slate-950 text-slate-300 border border-slate-800 rounded-lg px-2.5 py-1.5 focus:outline-none"
          >
            <option value="ALL">All Statuses</option>
            <option value="SUBMITTED">Submitted</option>
            <option value="ACKNOWLEDGED">Acknowledged</option>
            <option value="ASSIGNED">Assigned</option>
            <option value="IN_PROGRESS">On Site / In Progress</option>
            <option value="RESOLVED">Resolved</option>
          </select>
        </div>
      </div>

      {/* Incident List matching Figure 5.1.1 cards */}
      <div className="space-y-3">
        {loading && (
          <div className="text-center py-12 text-slate-500">Loading emergency triage queue...</div>
        )}

        {!loading && incidents.length === 0 && (
          <div className="text-center py-12 text-slate-500 bg-slate-900/40 rounded-xl border border-slate-800">
            No incidents found matching current filters.
          </div>
        )}

        {incidents.map((inc) => {
          const isCritical = inc.priority === 'CRITICAL';
          const isHigh = inc.priority === 'HIGH';

          return (
            <div
              key={inc.id}
              className={`rounded-2xl p-4 sm:p-5 border transition-all duration-150 shadow-xl relative overflow-hidden ${
                isCritical
                  ? 'bg-gradient-to-r from-slate-900 via-slate-900 to-rose-950/20 border-rose-900/50 hover:border-rose-700'
                  : 'bg-slate-900 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                {/* Left: Icon + ID + Badges + Location */}
                <div className="flex items-start gap-3 flex-1">
                  <div className={`p-2.5 rounded-xl mt-0.5 border flex-shrink-0 ${
                    isCritical 
                      ? 'bg-rose-950 text-rose-400 border-rose-800' 
                      : 'bg-teal-950 text-teal-400 border-teal-800'
                  }`}>
                    <AlertTriangle className="w-5 h-5" />
                  </div>

                  <div className="space-y-1 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-extrabold text-sm sm:text-base text-slate-100 font-mono tracking-wide">
                        {inc.id}
                      </span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider ${
                        isCritical 
                          ? 'bg-rose-900/60 text-rose-300 border border-rose-700' 
                          : 'bg-cyan-950 text-cyan-300 border border-cyan-800'
                      }`}>
                        {inc.category.replace('_', ' ')}
                      </span>
                      <span className="text-xs text-slate-400 font-medium">
                        · {inc.location.address}
                      </span>
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed pr-2">
                      {inc.description}
                    </p>

                    {/* Metadata chips (1 person · 4 mesh hops · ON SITE) */}
                    <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px]">
                      <span className="px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-slate-300 font-medium">
                        {inc.peopleCount} {inc.peopleCount === 1 ? 'person' : 'people'}
                      </span>

                      {inc.meshHops !== undefined && inc.meshHops > 0 && (
                        <span className="px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-cyan-300 font-medium flex items-center gap-1">
                          <Radio className="w-3 h-3" />
                          {inc.meshHops} mesh hops
                        </span>
                      )}

                      <span className={`px-2.5 py-0.5 rounded font-black text-[10px] uppercase tracking-wider ${
                        inc.status === 'IN_PROGRESS' 
                          ? 'bg-teal-950 text-teal-300 border border-teal-700' 
                          : inc.status === 'ASSIGNED'
                          ? 'bg-cyan-950 text-cyan-300 border border-cyan-700'
                          : inc.status === 'ACKNOWLEDGED'
                          ? 'bg-amber-950 text-amber-300 border border-amber-700'
                          : inc.status === 'RESOLVED'
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-700'
                          : 'bg-rose-950 text-rose-300 border border-rose-700'
                      }`}>
                        {inc.status.replace('_', ' ')}
                      </span>

                      {inc.assignedTo && (
                        <span className="text-[11px] text-teal-400 font-medium">
                          Assigned: {inc.assignedTo.name}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right: Distance & Action Buttons (Advance Status >) */}
                <div className="flex sm:flex-col items-center sm:items-end justify-between gap-2 flex-shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-800">
                  <div className="text-right">
                    <span className="text-xs font-bold text-teal-400 block">
                      ~147.2 km away
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">
                      {new Date(inc.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onLocateIncidentOnMap(inc)}
                      title="Locate on Map"
                      className="p-1.5 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 text-xs transition"
                    >
                      <MapPin className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => openAssignModal(inc)}
                      title="Assign Volunteer or Team"
                      className="p-1.5 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-800 text-teal-400 text-xs transition flex items-center gap-1"
                    >
                      <UserPlus className="w-3.5 h-3.5" />
                    </button>

                    {/* Advance Status Button (Matching Figure 5.1.1) */}
                    <button
                      onClick={() => openAdvanceModal(inc)}
                      className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-bold text-xs shadow transition flex items-center gap-1 whitespace-nowrap"
                    >
                      <span>Advance Status</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Advance Status Modal */}
      {advanceStatusModal && selectedIncident && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md p-5 space-y-4 shadow-2xl">
            <h3 className="text-base font-extrabold text-white">
              Advance Incident Status: {selectedIncident.id}
            </h3>

            <div>
              <label className="block text-xs text-slate-400 font-bold mb-1">
                Target Operational Status
              </label>
              <select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value as IncidentStatus)}
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 text-xs focus:outline-none"
              >
                <option value="ACKNOWLEDGED">ACKNOWLEDGED (EOC Logged)</option>
                <option value="ASSIGNED">ASSIGNED (Team Dispatched)</option>
                <option value="IN_PROGRESS">IN_PROGRESS (Responders On Site)</option>
                <option value="RESOLVED">RESOLVED (Affected Persons Safe)</option>
                <option value="CLOSED">CLOSED (Incident Archived)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs text-slate-400 font-bold mb-1">
                Responder Operational Field Note
              </label>
              <textarea
                rows={2}
                value={responderNote}
                onChange={(e) => setResponderNote(e.target.value)}
                placeholder="e.g. Inflatable boat deployed, reached terrace, provided first aid..."
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 text-xs focus:outline-none placeholder-slate-500"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setAdvanceStatusModal(false)}
                className="px-3 py-1.5 rounded-lg text-xs text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleAdvanceStatus}
                className="px-4 py-2 rounded-lg bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs shadow-lg"
              >
                Confirm Status Transition
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Assignment Modal */}
      {assignmentModal && selectedIncident && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md p-5 space-y-4 shadow-2xl">
            <h3 className="text-base font-extrabold text-white">
              Assign Response Unit for {selectedIncident.id}
            </h3>

            <div>
              <label className="block text-xs text-slate-400 font-bold mb-1">
                Select Volunteer or Response Agency
              </label>
              <select
                value={assigneeName}
                onChange={(e) => setAssigneeName(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 text-xs focus:outline-none"
              >
                <option value="Karthik Sivakumar (Volunteer TNDVF)">Karthik Sivakumar (Volunteer TNDVF - First Aid)</option>
                <option value="NDRF 4BN Rescue Boat Team Alpha">NDRF 4BN Rescue Boat Team Alpha</option>
                <option value="TN Fire & Rescue Quick Response Unit">TN Fire & Rescue Quick Response Unit</option>
                <option value="108 Paramedic Ambulance Crew #12">108 Paramedic Ambulance Crew #12</option>
                <option value="Civil Defence Scout Ward 177">Civil Defence Scout Ward 177</option>
              </select>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setAssignmentModal(false)}
                className="px-3 py-1.5 rounded-lg text-xs text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleAssignTeam}
                className="px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs shadow-lg"
              >
                Confirm Assignment
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
