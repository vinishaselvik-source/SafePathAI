import { 
  Incident, CivicReport, Shelter, Resource, DisasterPlan, 
  ActivityLog, UserProfile, IncidentStatus, CivicStatus, UserRole 
} from '../types';

const API_BASE = typeof window !== 'undefined' ? '/api' : 'http://localhost:5000/api';

class ApiService {
  private currentRole: UserRole = 'citizen';
  private currentUserId: string = 'usr-citizen-01';
  private currentUserName: string = 'Ananya Ramanathan';

  setSession(role: UserRole, id: string, name: string) {
    this.currentRole = role;
    this.currentUserId = id;
    this.currentUserName = name;
  }

  private getHeaders(): HeadersInit {
    return {
      'Content-Type': 'application/json',
      'x-user-role': this.currentRole,
      'x-user-id': this.currentUserId,
      'x-user-name': encodeURIComponent(this.currentUserName),
    };
  }

  // --- Incidents ---
  async getIncidents(filter?: { category?: string; status?: string; priority?: string; search?: string }): Promise<Incident[]> {
    const params = new URLSearchParams();
    if (filter?.category && filter.category !== 'ALL') params.set('category', filter.category);
    if (filter?.status && filter.status !== 'ALL') params.set('status', filter.status);
    if (filter?.priority && filter.priority !== 'ALL') params.set('priority', filter.priority);
    if (filter?.search) params.set('search', filter.search);

    const res = await fetch(`${API_BASE}/incidents?${params.toString()}`, {
      headers: this.getHeaders()
    });
    if (!res.ok) throw new Error(`Failed to fetch incidents: ${res.statusText}`);
    const body = await res.json();
    return body.data;
  }

  async getIncident(id: string): Promise<Incident> {
    const res = await fetch(`${API_BASE}/incidents/${id}`, {
      headers: this.getHeaders()
    });
    if (!res.ok) throw new Error(`Incident not found: ${id}`);
    const body = await res.json();
    return body.data;
  }

  async createIncident(incidentData: {
    clientIncidentId: string;
    category: string;
    description: string;
    location: { lat: number; lng: number; address: string; ward?: string };
    peopleCount: number;
    priority: string;
    submissionMethod?: string;
    meshHops?: number;
    userName?: string;
  }): Promise<{ incident: Incident; isDuplicate: boolean }> {
    const res = await fetch(`${API_BASE}/incidents`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(incidentData)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: res.statusText }));
      throw new Error(err.error || `HTTP ${res.status}`);
    }
    const body = await res.json();
    return { incident: body.data, isDuplicate: body.isDuplicate };
  }

  async updateIncidentStatus(id: string, status: IncidentStatus, note?: string): Promise<Incident> {
    const res = await fetch(`${API_BASE}/incidents/${id}/status`, {
      method: 'PATCH',
      headers: this.getHeaders(),
      body: JSON.stringify({ status, note })
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: res.statusText }));
      throw new Error(err.error || `HTTP ${res.status}`);
    }
    const body = await res.json();
    return body.data;
  }

  async assignIncident(id: string, assignedTo: { id: string; name: string; role: string }): Promise<Incident> {
    const res = await fetch(`${API_BASE}/incidents/${id}/assign`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({
        assignedToId: assignedTo.id,
        assignedToName: assignedTo.name,
        assignedToRole: assignedTo.role
      })
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: res.statusText }));
      throw new Error(err.error || `HTTP ${res.status}`);
    }
    const body = await res.json();
    return body.data;
  }

  // --- CityZen Civic Reports ---
  async getCivicReports(filter?: { category?: string; status?: string }): Promise<CivicReport[]> {
    const params = new URLSearchParams();
    if (filter?.category && filter.category !== 'ALL') params.set('category', filter.category);
    if (filter?.status && filter.status !== 'ALL') params.set('status', filter.status);

    const res = await fetch(`${API_BASE}/civic?${params.toString()}`, {
      headers: this.getHeaders()
    });
    if (!res.ok) throw new Error('Failed to fetch civic reports');
    const body = await res.json();
    return body.data;
  }

  async createCivicReport(reportData: {
    category: string;
    description: string;
    location: { lat: number; lng: number; address: string; ward?: string };
    imageUrl?: string;
    userName?: string;
  }): Promise<CivicReport> {
    const res = await fetch(`${API_BASE}/civic`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(reportData)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: res.statusText }));
      throw new Error(err.error || `HTTP ${res.status}`);
    }
    const body = await res.json();
    return body.data;
  }

  async verifyCivicReport(id: string, status: CivicStatus, notes?: string, agency?: string): Promise<CivicReport> {
    const res = await fetch(`${API_BASE}/civic/${id}/verify`, {
      method: 'PATCH',
      headers: this.getHeaders(),
      body: JSON.stringify({ status, verificationNotes: notes, assignedAgency: agency })
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: res.statusText }));
      throw new Error(err.error || `HTTP ${res.status}`);
    }
    const body = await res.json();
    return body.data;
  }

  // --- Shelters ---
  async getShelters(): Promise<Shelter[]> {
    const res = await fetch(`${API_BASE}/shelters`, {
      headers: this.getHeaders()
    });
    if (!res.ok) throw new Error('Failed to fetch shelters');
    const body = await res.json();
    return body.data;
  }

  async updateShelterOccupancy(id: string, occupancy: number, status?: Shelter['status']): Promise<Shelter> {
    const res = await fetch(`${API_BASE}/shelters/${id}/occupancy`, {
      method: 'PATCH',
      headers: this.getHeaders(),
      body: JSON.stringify({ occupancy, status })
    });
    if (!res.ok) throw new Error('Failed to update shelter');
    const body = await res.json();
    return body.data;
  }

  // --- Resources ---
  async getResources(): Promise<Resource[]> {
    const res = await fetch(`${API_BASE}/resources`, {
      headers: this.getHeaders()
    });
    if (!res.ok) throw new Error('Failed to fetch resources');
    const body = await res.json();
    return body.data;
  }

  async updateResourceDeployment(id: string, delta: number): Promise<Resource> {
    const res = await fetch(`${API_BASE}/resources/${id}/deploy`, {
      method: 'PATCH',
      headers: this.getHeaders(),
      body: JSON.stringify({ delta })
    });
    if (!res.ok) throw new Error('Failed to deploy resource');
    const body = await res.json();
    return body.data;
  }

  // --- Disaster Management Plans ---
  async getDisasterPlans(): Promise<DisasterPlan[]> {
    const res = await fetch(`${API_BASE}/plans`, {
      headers: this.getHeaders()
    });
    if (!res.ok) throw new Error('Failed to fetch disaster plans');
    const body = await res.json();
    return body.data;
  }

  async updateDisasterPlan(id: string, plan: Partial<DisasterPlan>): Promise<DisasterPlan> {
    const res = await fetch(`${API_BASE}/plans/${id}`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify(plan)
    });
    if (!res.ok) throw new Error('Failed to update plan');
    const body = await res.json();
    return body.data;
  }

  // --- Analytics ---
  async getDashboardAnalytics(): Promise<any> {
    const res = await fetch(`${API_BASE}/analytics/dashboard`, {
      headers: this.getHeaders()
    });
    if (!res.ok) throw new Error('Failed to fetch analytics');
    const body = await res.json();
    return body.data;
  }

  // --- Users & Roles (Admin) ---
  async getUsers(): Promise<UserProfile[]> {
    const res = await fetch(`${API_BASE}/auth/users`, {
      headers: this.getHeaders()
    });
    if (!res.ok) throw new Error('Failed to fetch users');
    const body = await res.json();
    return body.data;
  }

  async updateUserRole(id: string, role: UserRole): Promise<UserProfile> {
    const res = await fetch(`${API_BASE}/auth/users/${id}/role`, {
      method: 'PATCH',
      headers: this.getHeaders(),
      body: JSON.stringify({ role })
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: res.statusText }));
      throw new Error(err.error || 'Failed to update user role');
    }
    const body = await res.json();
    return body.data;
  }

  // --- Activity Logs ---
  async getActivityLogs(): Promise<ActivityLog[]> {
    const res = await fetch(`${API_BASE}/logs`, {
      headers: this.getHeaders()
    });
    if (!res.ok) throw new Error('Failed to fetch logs');
    const body = await res.json();
    return body.data;
  }
}

export const api = new ApiService();
