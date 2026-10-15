import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { 
  User, Incident, CivicReport, Shelter, Resource, DisasterPlan, ActivityLog,
  IncidentStatus, CivicStatus, UserRole 
} from '../types.js';
import { 
  SEED_USERS, SEED_INCIDENTS, SEED_CIVIC_REPORTS, 
  SEED_SHELTERS, SEED_RESOURCES, SEED_DISASTER_PLANS, SEED_ACTIVITY_LOGS 
} from '../data/seedData.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_FILE = process.env.VERCEL 
  ? path.join('/tmp', 'saros_db.json')
  : path.join(__dirname, '../../data/db.json');

interface DatabaseSchema {
  users: User[];
  incidents: Incident[];
  civicReports: CivicReport[];
  shelters: Shelter[];
  resources: Resource[];
  disasterPlans: DisasterPlan[];
  activityLogs: ActivityLog[];
}

class Store {
  private data: DatabaseSchema;

  constructor() {
    this.data = this.loadData();
  }

  private loadData(): DatabaseSchema {
    try {
      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        return JSON.parse(raw);
      }
    } catch (err) {
      console.warn('[SAROS DB] Failed to read db.json, falling back to seed data:', err);
    }

    const initialData: DatabaseSchema = {
      users: [...SEED_USERS],
      incidents: [...SEED_INCIDENTS],
      civicReports: [...SEED_CIVIC_REPORTS],
      shelters: [...SEED_SHELTERS],
      resources: [...SEED_RESOURCES],
      disasterPlans: [...SEED_DISASTER_PLANS],
      activityLogs: [...SEED_ACTIVITY_LOGS]
    };
    this.saveData(initialData);
    return initialData;
  }

  private saveData(dataToSave: DatabaseSchema = this.data): void {
    try {
      const dir = path.dirname(DB_FILE);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.writeFileSync(DB_FILE, JSON.stringify(dataToSave, null, 2), 'utf-8');
    } catch (err) {
      console.error('[SAROS DB] Error persisting database file:', err);
    }
  }

  // --- Users & Roles ---
  getUsers(): User[] {
    return this.data.users;
  }

  getUserById(id: string): User | undefined {
    return this.data.users.find(u => u.id === id);
  }

  updateUserRole(id: string, newRole: UserRole, adminActor: string): User {
    const user = this.data.users.find(u => u.id === id);
    if (!user) throw new Error('User not found');
    user.role = newRole;
    this.addActivityLog({
      id: `LOG-${Date.now()}`,
      timestamp: new Date().toISOString(),
      action: 'USER_ROLE_UPDATED',
      actorName: adminActor,
      actorRole: 'admin',
      details: `Updated role of ${user.name} (${user.email}) to ${newRole}`,
      entityType: 'SYSTEM',
      entityId: user.id
    });
    this.saveData();
    return user;
  }

  // --- Incidents (SOS) with Idempotency ---
  getIncidents(filter?: { category?: string; status?: string; priority?: string; search?: string }): Incident[] {
    let list = [...this.data.incidents];
    if (filter) {
      if (filter.category && filter.category !== 'ALL') {
        list = list.filter(i => i.category === filter.category);
      }
      if (filter.status && filter.status !== 'ALL') {
        list = list.filter(i => i.status === filter.status);
      }
      if (filter.priority && filter.priority !== 'ALL') {
        list = list.filter(i => i.priority === filter.priority);
      }
      if (filter.search) {
        const q = filter.search.toLowerCase();
        list = list.filter(i => 
          i.id.toLowerCase().includes(q) ||
          i.description.toLowerCase().includes(q) ||
          i.location.address.toLowerCase().includes(q) ||
          i.userName.toLowerCase().includes(q)
        );
      }
    }
    // Sort newest first
    return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  getIncidentById(id: string): Incident | undefined {
    return this.data.incidents.find(i => i.id === id || i.clientIncidentId === id);
  }

  createIncident(input: Omit<Incident, 'id' | 'statusHistory' | 'createdAt' | 'updatedAt'> & { id?: string }): { incident: Incident; isDuplicate: boolean } {
    // 1. Check idempotency: does clientIncidentId already exist?
    const existing = this.data.incidents.find(i => i.clientIncidentId === input.clientIncidentId);
    if (existing) {
      return { incident: existing, isDuplicate: true };
    }

    const timestamp = new Date().toISOString();
    const id = input.id || `SOS-TN-${1000 + this.data.incidents.length + 1}`;

    const newIncident: Incident = {
      ...input,
      id,
      status: input.status || 'SUBMITTED',
      statusHistory: [
        {
          status: input.status || 'SUBMITTED',
          timestamp,
          updatedBy: input.userName || 'Citizen Reporter',
          role: 'citizen',
          note: `Incident registered via ${input.submissionMethod}`
        }
      ],
      createdAt: timestamp,
      updatedAt: timestamp
    };

    this.data.incidents.unshift(newIncident);

    this.addActivityLog({
      id: `LOG-${Date.now()}`,
      timestamp,
      action: 'SOS_CREATED',
      actorName: newIncident.userName,
      actorRole: 'citizen',
      details: `New SOS ${newIncident.id} (${newIncident.category}) reported at ${newIncident.location.address}`,
      entityType: 'INCIDENT',
      entityId: newIncident.id
    });

    this.saveData();
    return { incident: newIncident, isDuplicate: false };
  }

  updateIncidentStatus(
    id: string, 
    newStatus: IncidentStatus, 
    actor: { name: string; role: UserRole }, 
    note?: string
  ): Incident {
    const incident = this.data.incidents.find(i => i.id === id);
    if (!incident) throw new Error(`Incident ${id} not found`);

    const timestamp = new Date().toISOString();
    incident.status = newStatus;
    incident.updatedAt = timestamp;

    if (note) {
      incident.responderNotes = incident.responderNotes || [];
      incident.responderNotes.push({
        timestamp,
        responderName: actor.name,
        text: note
      });
    }

    incident.statusHistory.push({
      status: newStatus,
      timestamp,
      updatedBy: actor.name,
      role: actor.role,
      note: note || `Status transitioned to ${newStatus}`
    });

    this.addActivityLog({
      id: `LOG-${Date.now()}`,
      timestamp,
      action: `INCIDENT_STATUS_${newStatus}`,
      actorName: actor.name,
      actorRole: actor.role,
      details: `Incident ${incident.id} status changed to ${newStatus}. Note: ${note || 'None'}`,
      entityType: 'INCIDENT',
      entityId: incident.id
    });

    this.saveData();
    return incident;
  }

  assignIncident(
    id: string, 
    assignedTo: { id: string; name: string; role: string }, 
    assigner: { name: string; role: UserRole }
  ): Incident {
    const incident = this.data.incidents.find(i => i.id === id);
    if (!incident) throw new Error(`Incident ${id} not found`);

    const timestamp = new Date().toISOString();
    incident.assignedTo = {
      ...assignedTo,
      assignedAt: timestamp
    };
    if (incident.status === 'SUBMITTED' || incident.status === 'ACKNOWLEDGED') {
      incident.status = 'ASSIGNED';
    }
    incident.updatedAt = timestamp;

    incident.statusHistory.push({
      status: incident.status,
      timestamp,
      updatedBy: assigner.name,
      role: assigner.role,
      note: `Assigned response to ${assignedTo.name} (${assignedTo.role})`
    });

    this.addActivityLog({
      id: `LOG-${Date.now()}`,
      timestamp,
      action: 'INCIDENT_ASSIGNED',
      actorName: assigner.name,
      actorRole: assigner.role,
      details: `Assigned ${incident.id} to ${assignedTo.name}`,
      entityType: 'INCIDENT',
      entityId: incident.id
    });

    this.saveData();
    return incident;
  }

  // --- CityZen Civic Reports ---
  getCivicReports(filter?: { category?: string; status?: string }): CivicReport[] {
    let list = [...this.data.civicReports];
    if (filter) {
      if (filter.category && filter.category !== 'ALL') {
        list = list.filter(r => r.category === filter.category);
      }
      if (filter.status && filter.status !== 'ALL') {
        list = list.filter(r => r.status === filter.status);
      }
    }
    return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  createCivicReport(input: Omit<CivicReport, 'id' | 'status' | 'createdAt' | 'updatedAt'>): CivicReport {
    const timestamp = new Date().toISOString();
    const id = `CIV-TN-${2000 + this.data.civicReports.length + 1}`;

    const newReport: CivicReport = {
      ...input,
      id,
      status: 'REPORTED',
      createdAt: timestamp,
      updatedAt: timestamp
    };

    this.data.civicReports.unshift(newReport);

    this.addActivityLog({
      id: `LOG-${Date.now()}`,
      timestamp,
      action: 'CIVIC_REPORTED',
      actorName: newReport.userName,
      actorRole: 'citizen',
      details: `Civic issue ${newReport.id} (${newReport.category}) submitted at ${newReport.location.address}`,
      entityType: 'CIVIC',
      entityId: newReport.id
    });

    this.saveData();
    return newReport;
  }

  updateCivicReportStatus(
    id: string, 
    status: CivicStatus, 
    verifier: { name: string; role: UserRole },
    verificationNotes?: string,
    assignedAgency?: string
  ): CivicReport {
    const report = this.data.civicReports.find(r => r.id === id);
    if (!report) throw new Error(`Civic report ${id} not found`);

    const timestamp = new Date().toISOString();
    report.status = status;
    report.updatedAt = timestamp;
    if (verificationNotes) report.verificationNotes = verificationNotes;
    if (assignedAgency) report.assignedAgency = assignedAgency;
    report.verifiedBy = verifier.name;

    this.addActivityLog({
      id: `LOG-${Date.now()}`,
      timestamp,
      action: `CIVIC_STATUS_${status}`,
      actorName: verifier.name,
      actorRole: verifier.role,
      details: `Civic report ${report.id} marked ${status}. Agency: ${assignedAgency || 'N/A'}`,
      entityType: 'CIVIC',
      entityId: report.id
    });

    this.saveData();
    return report;
  }

  // --- Shelters ---
  getShelters(): Shelter[] {
    return this.data.shelters;
  }

  updateShelterOccupancy(id: string, occupancy: number, status?: Shelter['status']): Shelter {
    const shelter = this.data.shelters.find(s => s.id === id);
    if (!shelter) throw new Error(`Shelter ${id} not found`);
    shelter.currentOccupancy = occupancy;
    if (status) shelter.status = status;
    this.saveData();
    return shelter;
  }

  // --- Resources ---
  getResources(): Resource[] {
    return this.data.resources;
  }

  updateResourceAllocation(id: string, deployedDelta: number): Resource {
    const res = this.data.resources.find(r => r.id === id);
    if (!res) throw new Error(`Resource ${id} not found`);
    res.deployedQuantity = Math.max(0, Math.min(res.totalQuantity, res.deployedQuantity + deployedDelta));
    res.availableQuantity = res.totalQuantity - res.deployedQuantity;
    res.status = res.availableQuantity === 0 ? 'DEPLOYED' : 'READY';
    this.saveData();
    return res;
  }

  // --- Disaster Management Plans ---
  getDisasterPlans(): DisasterPlan[] {
    return this.data.disasterPlans;
  }

  updateDisasterPlan(id: string, update: Partial<DisasterPlan>): DisasterPlan {
    const plan = this.data.disasterPlans.find(p => p.id === id);
    if (!plan) throw new Error(`Plan ${id} not found`);
    Object.assign(plan, update, { lastUpdated: new Date().toISOString() });
    this.saveData();
    return plan;
  }

  // --- Activity Logs ---
  getActivityLogs(): ActivityLog[] {
    return [...this.data.activityLogs].sort(
      (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
  }

  addActivityLog(log: ActivityLog): void {
    this.data.activityLogs.unshift(log);
    // Keep max 200 logs
    if (this.data.activityLogs.length > 200) {
      this.data.activityLogs.pop();
    }
  }

  // --- Dashboard Analytics Summary ---
  getAnalyticsSummary() {
    const incidents = this.data.incidents;
    const totalIncidents = incidents.length;
    const openIncidents = incidents.filter(i => ['SUBMITTED', 'ACKNOWLEDGED', 'ASSIGNED', 'IN_PROGRESS'].includes(i.status)).length;
    const criticalIncidents = incidents.filter(i => i.priority === 'CRITICAL' && i.status !== 'RESOLVED' && i.status !== 'CLOSED').length;
    const acknowledgedIncidents = incidents.filter(i => i.status === 'ACKNOWLEDGED').length;
    const activeAssignments = incidents.filter(i => ['ASSIGNED', 'IN_PROGRESS'].includes(i.status)).length;
    const resolvedIncidents = incidents.filter(i => ['RESOLVED', 'CLOSED'].includes(i.status)).length;

    // By category
    const categoryCounts: Record<string, number> = {};
    incidents.forEach(i => {
      categoryCounts[i.category] = (categoryCounts[i.category] || 0) + 1;
    });

    // By status
    const statusCounts: Record<string, number> = {};
    incidents.forEach(i => {
      statusCounts[i.status] = (statusCounts[i.status] || 0) + 1;
    });

    // Shelters occupancy
    const totalShelterCapacity = this.data.shelters.reduce((acc, s) => acc + s.capacity, 0);
    const totalShelterOccupancy = this.data.shelters.reduce((acc, s) => acc + s.currentOccupancy, 0);

    // Civic stats
    const civicTotal = this.data.civicReports.length;
    const civicVerified = this.data.civicReports.filter(c => c.status === 'VERIFIED' || c.status === 'IN_PROGRESS').length;
    const civicResolved = this.data.civicReports.filter(c => c.status === 'RESOLVED').length;

    return {
      totalIncidents,
      openIncidents,
      criticalIncidents,
      acknowledgedIncidents,
      activeAssignments,
      resolvedIncidents,
      categoryCounts,
      statusCounts,
      shelterStats: {
        totalShelters: this.data.shelters.length,
        capacity: totalShelterCapacity,
        occupancy: totalShelterOccupancy,
        available: totalShelterCapacity - totalShelterOccupancy
      },
      civicStats: {
        total: civicTotal,
        verified: civicVerified,
        resolved: civicResolved,
        pending: civicTotal - civicVerified - civicResolved
      },
      recentActivity: this.getActivityLogs().slice(0, 10)
    };
  }
}

export const store = new Store();
