export type UserRole = 'citizen' | 'volunteer' | 'responder' | 'admin';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone?: string;
  ward?: string;
  badgeNumber?: string;
  agency?: string;
  skills?: string[];
}

export type IncidentCategory = 
  | 'FLOOD' 
  | 'MEDICAL' 
  | 'FOOD_WATER' 
  | 'FIRE' 
  | 'TRAPPED' 
  | 'OTHER';

export type IncidentPriority = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';

export type IncidentStatus = 
  | 'QUEUED_OFFLINE' 
  | 'SUBMITTED' 
  | 'ACKNOWLEDGED' 
  | 'ASSIGNED' 
  | 'IN_PROGRESS' 
  | 'RESOLVED' 
  | 'CLOSED'
  | 'FAILED';

export interface StatusHistoryEntry {
  status: IncidentStatus;
  timestamp: string;
  updatedBy: string;
  role: UserRole;
  note?: string;
}

export interface Incident {
  id: string;
  clientIncidentId: string;
  userId: string;
  userName: string;
  category: IncidentCategory;
  description: string;
  location: {
    lat: number;
    lng: number;
    address: string;
    ward?: string;
  };
  peopleCount: number;
  priority: IncidentPriority;
  status: IncidentStatus;
  submissionMethod: 'ONLINE_DIRECT' | 'OFFLINE_SYNC' | 'MESH_RELAY';
  meshHops?: number;
  assignedTo?: {
    id: string;
    name: string;
    role: string;
    assignedAt: string;
  };
  responderNotes?: Array<{
    timestamp: string;
    responderName: string;
    text: string;
  }>;
  statusHistory: StatusHistoryEntry[];
  createdAt: string;
  updatedAt: string;
}

export type CivicCategory = 
  | 'BLOCKED_DRAIN' 
  | 'WATERLOGGING' 
  | 'DAMAGED_ROAD' 
  | 'FALLEN_TREE' 
  | 'SLOPE_CRACK' 
  | 'OTHER';

export type CivicStatus = 'REPORTED' | 'VERIFIED' | 'IN_PROGRESS' | 'RESOLVED' | 'REJECTED';

export interface CivicReport {
  id: string;
  userId: string;
  userName: string;
  category: CivicCategory;
  description: string;
  location: {
    lat: number;
    lng: number;
    address: string;
    ward?: string;
  };
  imageUrl?: string;
  status: CivicStatus;
  verificationNotes?: string;
  assignedAgency?: string;
  verifiedBy?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Shelter {
  id: string;
  name: string;
  location: {
    lat: number;
    lng: number;
    address: string;
  };
  capacity: number;
  currentOccupancy: number;
  status: 'OPEN' | 'FULL' | 'EVACUATING' | 'STANDBY';
  facilities: string[];
  contactPhone: string;
  managerName: string;
}

export interface Resource {
  id: string;
  name: string;
  category: 'RESCUE_VEHICLE' | 'MEDICAL_KIT' | 'FOOD_RATION' | 'GENERATOR' | 'WATER_PURIFIER';
  totalQuantity: number;
  availableQuantity: number;
  deployedQuantity: number;
  baseLocation: string;
  status: 'READY' | 'DEPLOYED' | 'MAINTENANCE';
}

export interface DisasterPlan {
  id: string;
  hazardType: 'FLOOD' | 'CYCLONE' | 'EARTHQUAKE' | 'HEATWAVE';
  title: string;
  alertLevel: 'NORMAL' | 'WATCH' | 'WARNING' | 'EMERGENCY';
  summary: string;
  safetyChecklist: string[];
  evacuationRoutes: string[];
  emergencyContacts: Array<{ agency: string; phone: string }>;
  lastUpdated: string;
}

export interface ActivityLog {
  id: string;
  timestamp: string;
  action: string;
  actorName: string;
  actorRole: UserRole;
  details: string;
  entityType: 'INCIDENT' | 'CIVIC' | 'SHELTER' | 'RESOURCE' | 'SYSTEM';
  entityId: string;
}

// Offline queue payload
export interface OfflineQueueItem {
  clientIncidentId: string;
  category: IncidentCategory;
  description: string;
  location: {
    lat: number;
    lng: number;
    address: string;
    ward?: string;
  };
  peopleCount: number;
  priority: IncidentPriority;
  userName: string;
  userId: string;
  queuedAt: string;
  retryCount: number;
  lastError?: string;
  syncStatus: 'QUEUED' | 'SYNCING' | 'FAILED';
}

// Mesh Simulator Types
export type MeshNodeType = 'citizen' | 'volunteer' | 'responder' | 'gateway';

export interface MeshNode {
  id: string;
  name: string;
  type: MeshNodeType;
  deviceModel: string;
  x: number;
  y: number;
  isOnline: boolean;
  batteryLevel: number;
  queueCount: number;
  language: string;
  uplinkCapability: 'None (BLE Mesh)' | 'Cellular / Wi-Fi' | 'Satellite / Fiber Backbone';
  processedPacketIds: Set<string>;
}

export interface MeshPacket {
  id: string; // Packet UUID
  sourceNodeId: string;
  incidentData: Partial<Incident>;
  hopsRemaining: number;
  path: string[];
  timestamp: string;
  deliveredToGateway: boolean;
}

export type SupportedLanguage = 'en' | 'ta' | 'hi';

// Re-export legacy types to maintain complete backward compatibility with older files
export * from './legacy';
