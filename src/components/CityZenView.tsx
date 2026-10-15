import React, { useState, useEffect } from 'react';
import { 
  Building2, AlertTriangle, CheckCircle2, Clock, 
  MapPin, Image, PlusCircle, Shield, Filter, Search, ArrowRight, Check, X 
} from 'lucide-react';
import { CivicReport, CivicCategory, CivicStatus, UserRole } from '../types';
import { api } from '../services/api';

interface CityZenViewProps {
  currentRole: UserRole;
}

export const CityZenView: React.FC<CityZenViewProps> = ({ currentRole }) => {
  const [reports, setReports] = useState<CivicReport[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [filterCategory, setFilterCategory] = useState<string>('ALL');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [showSubmitModal, setShowSubmitModal] = useState<boolean>(false);

  // Form State
  const [category, setCategory] = useState<CivicCategory>('BLOCKED_DRAIN');
  const [description, setDescription] = useState<string>('');
  const [address, setAddress] = useState<string>('Velachery Bypass Road Junction');
  const [lat, setLat] = useState<number>(12.9825);
  const [lng, setLng] = useState<number>(80.2190);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Verification modal for responders/admin
  const [verifyModal, setVerifyModal] = useState<boolean>(false);
  const [selectedReport, setSelectedReport] = useState<CivicReport | null>(null);
  const [newStatus, setNewStatus] = useState<CivicStatus>('VERIFIED');
  const [assignedAgency, setAssignedAgency] = useState<string>('Greater Chennai Corporation (GCC)');
  const [verificationNotes, setVerificationNotes] = useState<string>('');

  const fetchReports = async () => {
    try {
      setLoading(true);
      const data = await api.getCivicReports({
        category: filterCategory,
        status: filterStatus
      });
      setReports(data);
    } catch (err) {
      console.error('Failed to fetch civic reports:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, [filterCategory, filterStatus]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) return;

    try {
      setIsSubmitting(true);
      await api.createCivicReport({
        category,
        description,
        location: { lat, lng, address },
        userName: 'Ananya Ramanathan (Citizen)'
      });
      setShowSubmitModal(false);
      setDescription('');
      fetchReports();
    } catch (err: any) {
      alert(`Submission failed: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerify = async () => {
    if (!selectedReport) return;
    try {
      await api.verifyCivicReport(selectedReport.id, newStatus, verificationNotes, assignedAgency);
      setVerifyModal(false);
      setVerificationNotes('');
      fetchReports();
    } catch (err: any) {
      alert(`Verification failed: ${err.message}`);
    }
  };

  const categories: Array<{ id: CivicCategory; label: string }> = [
    { id: 'BLOCKED_DRAIN', label: 'Blocked Drain / Stormwater Culvert' },
    { id: 'WATERLOGGING', label: 'Severe Road Waterlogging & Stagnation' },
    { id: 'DAMAGED_ROAD', label: 'Damaged Road / Bridge Causeway Crater' },
    { id: 'FALLEN_TREE', label: 'Fallen Tree Across Electrical Cables' },
    { id: 'SLOPE_CRACK', label: 'Canal Bund / Hill Slope Fissure' },
    { id: 'OTHER', label: 'Other Civic Infrastructure Danger' }
  ];

  const canVerify = currentRole === 'responder' || currentRole === 'admin';

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-950/60 via-slate-900 to-slate-900 border border-blue-900/50 rounded-2xl p-6 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-blue-600/20 text-blue-400 border border-blue-600/40">
              <Building2 className="w-6 h-6" />
            </span>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-white">
                CityZen Civic Infrastructure Risk Screening
              </h1>
              <p className="text-xs text-slate-400 mt-0.5">
                Pre-emptive municipal reporting to prevent catastrophic disaster cascades
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={() => setShowSubmitModal(true)}
          className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow-lg transition flex items-center gap-2 whitespace-nowrap self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Report Civic Problem</span>
        </button>
      </div>

      {/* Advisory Note */}
      <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-slate-400 flex items-start gap-2.5">
        <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
        <span>
          <strong>Operational Guideline:</strong> Civic reports inform hazard screening and municipal maintenance. Reports remain <em>Unverified</em> until reviewed by authorized municipal engineers and are not automatic life-threatening SOS rescue calls.
        </span>
      </div>

      {/* Filters */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 flex flex-wrap items-center justify-between gap-3 text-xs">
        <span className="font-bold text-slate-300">
          Total Reports: <strong className="text-white">{reports.length}</strong>
        </span>

        <div className="flex items-center gap-2">
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="bg-slate-950 text-slate-300 border border-slate-800 rounded-lg px-2.5 py-1.5 focus:outline-none"
          >
            <option value="ALL">All Civic Categories</option>
            {categories.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
          </select>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="bg-slate-950 text-slate-300 border border-slate-800 rounded-lg px-2.5 py-1.5 focus:outline-none"
          >
            <option value="ALL">All Review Statuses</option>
            <option value="REPORTED">Reported (Pending Review)</option>
            <option value="VERIFIED">Verified by Municipal Inspector</option>
            <option value="IN_PROGRESS">Remediation In Progress</option>
            <option value="RESOLVED">Resolved & Cleared</option>
          </select>
        </div>
      </div>

      {/* Report Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {loading && (
          <div className="col-span-2 text-center py-12 text-slate-500">Loading civic reports...</div>
        )}

        {!loading && reports.length === 0 && (
          <div className="col-span-2 text-center py-12 text-slate-500 bg-slate-900/40 rounded-xl border border-slate-800">
            No civic reports found matching current filters.
          </div>
        )}

        {reports.map((report) => (
          <div
            key={report.id}
            className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col justify-between space-y-3"
          >
            <div>
              <div className="flex items-center justify-between gap-2">
                <span className="font-bold text-xs text-blue-400 font-mono">
                  {report.id}
                </span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider ${
                  report.status === 'VERIFIED'
                    ? 'bg-cyan-950 text-cyan-300 border border-cyan-800'
                    : report.status === 'IN_PROGRESS'
                    ? 'bg-amber-950 text-amber-300 border border-amber-800'
                    : report.status === 'RESOLVED'
                    ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                    : 'bg-slate-800 text-slate-300 border border-slate-700'
                }`}>
                  {report.status}
                </span>
              </div>

              <h3 className="font-bold text-sm text-slate-100 mt-2">
                {report.category.replace('_', ' ')}
              </h3>

              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                {report.description}
              </p>

              <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mt-2">
                <MapPin className="w-3.5 h-3.5 text-blue-400 flex-shrink-0" />
                <span className="truncate">{report.location.address}</span>
              </div>

              {report.verificationNotes && (
                <div className="mt-3 p-2.5 rounded-lg bg-slate-950 border border-slate-850 text-xs text-teal-300/90">
                  <strong>Inspection Note:</strong> {report.verificationNotes}
                  {report.assignedAgency && (
                    <span className="block text-[11px] text-slate-400 mt-0.5">
                      Agency: {report.assignedAgency}
                    </span>
                  )}
                </div>
              )}
            </div>

            <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
              <span>Reported by {report.userName}</span>
              {canVerify && (
                <button
                  onClick={() => {
                    setSelectedReport(report);
                    setVerifyModal(true);
                  }}
                  className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition"
                >
                  Review / Verify →
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Citizen Submission Modal */}
      {showSubmitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-lg p-5 space-y-4 shadow-2xl">
            <h3 className="text-base font-extrabold text-white flex items-center gap-2">
              <Building2 className="w-5 h-5 text-blue-400" />
              <span>Submit CityZen Civic Infrastructure Issue</span>
            </h3>

            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-bold mb-1">Issue Category *</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as CivicCategory)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none"
                >
                  {categories.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Problem Description *</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe obstruction, depth of water, cracked structure, or danger to vehicles..."
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Location Address</label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowSubmitModal(false)}
                  className="px-3 py-1.5 rounded-lg text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg shadow-lg"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit to Municipal Board'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Review / Verify Modal */}
      {verifyModal && selectedReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md p-5 space-y-4 shadow-2xl text-xs">
            <h3 className="text-base font-extrabold text-white">
              Municipal Review: {selectedReport.id}
            </h3>

            <div>
              <label className="block text-slate-400 font-bold mb-1">Update Status</label>
              <select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value as CivicStatus)}
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none"
              >
                <option value="VERIFIED">VERIFIED (Field Verified by Inspector)</option>
                <option value="IN_PROGRESS">IN_PROGRESS (Agency Machinery Deployed)</option>
                <option value="RESOLVED">RESOLVED (Cleared & Repaired)</option>
                <option value="REJECTED">REJECTED (Duplicate / Non-Hazard)</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-400 font-bold mb-1">Assign Responsible Agency</label>
              <select
                value={assignedAgency}
                onChange={(e) => setAssignedAgency(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none"
              >
                <option value="Greater Chennai Corporation (GCC)">Greater Chennai Corporation (GCC)</option>
                <option value="Public Works Department (PWD)">Public Works Department (PWD)</option>
                <option value="Water Resources Department (WRD)">Water Resources Department (WRD)</option>
                <option value="Tamil Nadu Electricity Board (TANGEDCO)">Tamil Nadu Electricity Board (TANGEDCO)</option>
                <option value="State Highways Department">State Highways Department</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-400 font-bold mb-1">Official Remediation Note</label>
              <textarea
                rows={2}
                value={verificationNotes}
                onChange={(e) => setVerificationNotes(e.target.value)}
                placeholder="e.g. Suction pump stationed at culvert mouth, silt removed..."
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setVerifyModal(false)}
                className="px-3 py-1.5 rounded-lg text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleVerify}
                className="px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white font-bold rounded-lg shadow-lg"
              >
                Save Review
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
