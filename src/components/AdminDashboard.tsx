import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, BarChart3, Users, FileText, 
  CheckCircle2, Clock, AlertTriangle, RefreshCw, UserCheck, Activity 
} from 'lucide-react';
import { 
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, 
  PieChart, Pie, Cell, Legend 
} from 'recharts';
import { UserProfile, ActivityLog, UserRole } from '../types';
import { api } from '../services/api';

export const AdminDashboard: React.FC = () => {
  const [analytics, setAnalytics] = useState<any>(null);
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<'analytics' | 'users' | 'logs'>('analytics');

  const fetchData = async () => {
    try {
      setLoading(true);
      const [analyticsData, usersData, logsData] = await Promise.all([
        api.getDashboardAnalytics(),
        api.getUsers().catch(() => []),
        api.getActivityLogs().catch(() => [])
      ]);
      setAnalytics(analyticsData);
      setUsers(usersData);
      setLogs(logsData);
    } catch (err) {
      console.error('Error fetching admin dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleRoleChange = async (userId: string, newRole: UserRole) => {
    try {
      await api.updateUserRole(userId, newRole);
      fetchData();
    } catch (err: any) {
      alert(`Role change failed: ${err.message}`);
    }
  };

  if (loading && !analytics) {
    return <div className="text-center py-16 text-slate-500">Loading District Control Room Analytics...</div>;
  }

  // Chart data formatting
  const categoryChartData = analytics?.categoryCounts 
    ? Object.keys(analytics.categoryCounts).map(cat => ({
        name: cat.replace('_', ' '),
        count: analytics.categoryCounts[cat]
      }))
    : [];

  const statusChartData = analytics?.statusCounts
    ? Object.keys(analytics.statusCounts).map(st => ({
        name: st.replace('_', ' '),
        count: analytics.statusCounts[st]
      }))
    : [];

  const PIE_COLORS = ['#ef4444', '#f97316', '#06b6d4', '#10b981', '#8b5cf6'];

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-rose-950/60 via-slate-900 to-slate-900 border border-rose-900/50 rounded-2xl p-6 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-rose-600/20 text-rose-400 border border-rose-600/40">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-white">
              District Administrator EOC Control Room
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Live disaster intelligence, role administration, and forensic audit trail
            </p>
          </div>
        </div>

        {/* View Tabs */}
        <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
          <button
            onClick={() => setActiveTab('analytics')}
            className={`px-3 py-1.5 rounded-lg font-bold transition ${
              activeTab === 'analytics' ? 'bg-rose-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Analytics & KPIs
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`px-3 py-1.5 rounded-lg font-bold transition ${
              activeTab === 'users' ? 'bg-rose-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Users & Roles ({users.length})
          </button>
          <button
            onClick={() => setActiveTab('logs')}
            className={`px-3 py-1.5 rounded-lg font-bold transition ${
              activeTab === 'logs' ? 'bg-rose-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Audit Logs ({logs.length})
          </button>
        </div>
      </div>

      {/* Tab 1: Operational KPIs & Analytics */}
      {activeTab === 'analytics' && analytics && (
        <div className="space-y-6">
          {/* KPI Stat Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-lg">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Total SOS</span>
              <span className="text-2xl font-black text-white">{analytics.totalIncidents}</span>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-lg">
              <span className="text-[10px] font-bold text-red-400 uppercase tracking-wider block">Critical Prio</span>
              <span className="text-2xl font-black text-red-400">{analytics.criticalIncidents}</span>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-lg">
              <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block">Open Incidents</span>
              <span className="text-2xl font-black text-amber-400">{analytics.openIncidents}</span>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-lg">
              <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider block">Active Units</span>
              <span className="text-2xl font-black text-cyan-400">{analytics.activeAssignments}</span>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-lg">
              <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block">Resolved</span>
              <span className="text-2xl font-black text-emerald-400">{analytics.resolvedIncidents}</span>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-lg">
              <span className="text-[10px] font-bold text-blue-400 uppercase tracking-wider block">Civic Reports</span>
              <span className="text-2xl font-black text-blue-400">{analytics.civicStats?.total || 0}</span>
            </div>
          </div>

          {/* Recharts Analytics: Categories & Status */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Category Chart */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3">
              <h3 className="font-extrabold text-sm text-white flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-cyan-400" />
                <span>Emergency Incidents by Category</span>
              </h3>
              <div className="h-60">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={categoryChartData}>
                    <XAxis dataKey="name" stroke="#64748b" fontSize={11} />
                    <YAxis stroke="#64748b" fontSize={11} allowDecimals={false} />
                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', color: '#fff' }} />
                    <Bar dataKey="count" fill="#06b6d4" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Status Distribution Chart */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3">
              <h3 className="font-extrabold text-sm text-white flex items-center gap-2">
                <Activity className="w-4 h-4 text-rose-400" />
                <span>Incident Response Status Distribution</span>
              </h3>
              <div className="h-60">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={statusChartData}
                      cx="50%"
                      cy="50%"
                      outerRadius={75}
                      dataKey="count"
                      label={({ name, percent }: { name?: string; percent?: number }) => `${name ?? ''}: ${((percent ?? 0) * 100).toFixed(0)}%`}
                      fontSize={11}
                    >
                      {statusChartData.map((_entry, index) => (
                        <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', color: '#fff' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: User Role Management */}
      {activeTab === 'users' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-sm text-white flex items-center gap-2">
              <Users className="w-4 h-4 text-rose-400" />
              <span>Registered Accounts & Role-Based Access Control</span>
            </h3>
            <span className="text-xs text-slate-400 font-mono">Privileged Admin Enforced</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-950 text-slate-400 font-mono text-[11px] border-b border-slate-800">
                <tr>
                  <th className="p-3">User</th>
                  <th className="p-3">Ward / Area</th>
                  <th className="p-3">Agency / Specialization</th>
                  <th className="p-3">Assigned Role</th>
                  <th className="p-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-300">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-850/50">
                    <td className="p-3 font-medium">
                      <div className="text-white font-bold">{u.name}</div>
                      <div className="text-[11px] text-slate-400">{u.email}</div>
                    </td>
                    <td className="p-3 text-slate-300">{u.ward || 'General Public'}</td>
                    <td className="p-3 text-slate-400">{u.agency || u.skills?.join(', ') || 'N/A'}</td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded font-black text-[10px] uppercase tracking-wider ${
                        u.role === 'admin'
                          ? 'bg-rose-950 text-rose-300 border border-rose-800'
                          : u.role === 'responder'
                          ? 'bg-cyan-950 text-cyan-300 border border-cyan-800'
                          : u.role === 'volunteer'
                          ? 'bg-amber-950 text-amber-300 border border-amber-800'
                          : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                      }`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <select
                        value={u.role}
                        onChange={(e) => handleRoleChange(u.id, e.target.value as UserRole)}
                        className="bg-slate-950 text-slate-200 border border-slate-800 rounded-md px-2 py-1 text-xs focus:outline-none"
                      >
                        <option value="citizen">Citizen</option>
                        <option value="volunteer">Volunteer</option>
                        <option value="responder">Responder</option>
                        <option value="admin">District Admin</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Activity & Audit Trail Logs */}
      {activeTab === 'logs' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-sm text-white flex items-center gap-2">
              <FileText className="w-4 h-4 text-teal-400" />
              <span>Immutable Forensic Audit Trail</span>
            </h3>
            <span className="text-xs text-slate-400">Append-only operational event stream</span>
          </div>

          <div className="space-y-2 text-xs">
            {logs.map((log) => (
              <div
                key={log.id}
                className="p-3 rounded-xl bg-slate-950 border border-slate-850 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-cyan-400 font-bold">{log.action}</span>
                    <span className="text-slate-400">by</span>
                    <strong className="text-slate-200">{log.actorName}</strong>
                    <span className="px-1.5 py-0.2 rounded bg-slate-800 text-[10px] text-slate-300 uppercase font-mono">
                      {log.actorRole}
                    </span>
                  </div>
                  <p className="text-slate-300 mt-1">{log.details}</p>
                </div>
                <div className="text-[11px] text-slate-500 font-mono whitespace-nowrap">
                  {new Date(log.timestamp).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
