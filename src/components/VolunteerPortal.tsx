import React, { useState, useEffect } from 'react';
import { 
  HeartHandshake, CheckCircle2, Clock, MapPin, 
  Users, CheckSquare, MessageSquare, AlertTriangle 
} from 'lucide-react';
import { Incident } from '../types';
import { api } from '../services/api';

export const VolunteerPortal: React.FC = () => {
  const [tasks, setTasks] = useState<Incident[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedTask, setSelectedTask] = useState<Incident | null>(null);
  const [completionNote, setCompletionNote] = useState<string>('');

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const allIncidents = await api.getIncidents();
      // Filter incidents suitable for volunteer tasks (Food/water, elderly checks, evacuation assistance)
      const volunteerEligible = allIncidents.filter(i => 
        i.status === 'ASSIGNED' || i.status === 'IN_PROGRESS' || i.category === 'FOOD_WATER'
      );
      setTasks(volunteerEligible);
    } catch (err) {
      console.error('Error fetching volunteer tasks:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleAcceptTask = async (incident: Incident) => {
    try {
      await api.assignIncident(incident.id, {
        id: 'usr-volunteer-01',
        name: 'Karthik Sivakumar (Volunteer TNDVF)',
        role: 'volunteer'
      });
      fetchTasks();
    } catch (err: any) {
      alert(`Accept failed: ${err.message}`);
    }
  };

  const handleUpdateStatus = async (incident: Incident, status: Incident['status'], note: string) => {
    try {
      await api.updateIncidentStatus(incident.id, status, note);
      setSelectedTask(null);
      setCompletionNote('');
      fetchTasks();
    } catch (err: any) {
      alert(`Status update failed: ${err.message}`);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 space-y-6">
      {/* Banner */}
      <div className="bg-gradient-to-r from-amber-950/60 via-slate-900 to-slate-900 border border-amber-900/50 rounded-2xl p-6 shadow-xl flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-amber-600/20 text-amber-400 border border-amber-600/40">
            <HeartHandshake className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-white">
              Tamil Nadu Disaster Volunteer Force (TNDVF)
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Authorized volunteer field assignments and community relief distribution
            </p>
          </div>
        </div>
      </div>

      {/* Task List */}
      <div className="space-y-3">
        <h2 className="text-sm font-bold text-slate-300">
          Available Field Operations & Active Assignments ({tasks.length})
        </h2>

        {loading && <div className="text-center py-12 text-slate-500">Loading assignments...</div>}

        {!loading && tasks.length === 0 && (
          <div className="text-center py-12 text-slate-500 bg-slate-900/40 rounded-xl border border-slate-800">
            No active volunteer tasks pending at this time.
          </div>
        )}

        {tasks.map((task) => (
          <div
            key={task.id}
            className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4"
          >
            <div className="space-y-1.5 flex-1">
              <div className="flex items-center gap-2">
                <span className="font-bold text-xs text-amber-400 font-mono">{task.id}</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-slate-800 text-slate-300">
                  {task.category}
                </span>
                <span className="text-xs text-slate-400">· {task.location.address}</span>
              </div>

              <p className="text-xs text-slate-200 leading-relaxed">{task.description}</p>

              <div className="flex items-center gap-3 text-[11px] text-slate-400">
                <span>Affected People: <strong className="text-white">{task.peopleCount}</strong></span>
                <span>Current Status: <strong className="text-teal-400">{task.status}</strong></span>
                {task.assignedTo && (
                  <span className="text-amber-300">Assigned: {task.assignedTo.name}</span>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2 flex-shrink-0">
              {task.status === 'ASSIGNED' ? (
                <button
                  onClick={() => handleUpdateStatus(task, 'IN_PROGRESS', 'Volunteer arrived on site, commencing assistance')}
                  className="px-3 py-1.5 bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs rounded-lg shadow"
                >
                  Mark On-Site
                </button>
              ) : task.status === 'IN_PROGRESS' ? (
                <button
                  onClick={() => handleUpdateStatus(task, 'RESOLVED', 'Relief delivered, persons verified safe and stable')}
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-lg shadow"
                >
                  Mark Completed
                </button>
              ) : (
                <button
                  onClick={() => handleAcceptTask(task)}
                  className="px-3 py-1.5 bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs rounded-lg shadow"
                >
                  Accept Assignment
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
