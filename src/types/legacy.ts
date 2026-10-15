export type NavView = 
  | 'landing' 
  | 'dashboard' 
  | 'plantrip' 
  | 'saferoutes' 
  | 'livemap' 
  | 'checklist' 
  | 'radar' 
  | 'essentials' 
  | 'hospitals' 
  | 'journeymonitor' 
  | 'emergency' 
  | 'copilot' 
  | 'profile'
  | 'famousplaces';

export type TripType = 'solo' | 'family' | 'friends' | 'business' | 'roadtrip' | 'trekking';
export type TransportMode = 'car' | 'bike' | 'bus' | 'train' | 'walking';

export interface TripPreferences {
  preferSafer: boolean;
  avoidPoorLighting: boolean;
  avoidRoadDamage: boolean;
  preferPopulated: boolean;
  preferEmergencyAccess: boolean;
  avoidHeavyTraffic: boolean;
  preferFuelAvailability: boolean;
}

export interface TripDetails {
  startingPoint: string;
  destination: string;
  travelType: TripType;
  transport: TransportMode;
  departureTime: string;
  preferences: TripPreferences;
}

export interface ScoreFactor {
  name: string;
  score: number;
  maxScore: number;
  status: 'good' | 'warning' | 'critical';
  details: string;
}

export interface RouteOption {
  id: string;
  name: string;
  type: 'fastest' | 'recommended' | 'alternative';
  isAiRecommended?: boolean;
  distance: string;
  time: string;
  safetyScore: number;
  warnings: string[];
  benefits: string[];
  scoreExplanation: string;
  breakdown: {
    roadCondition: number;
    traffic: number;
    recentIncidents: number;
    lighting: number;
    connectivity: number;
    emergencyAccess: number;
    weatherImpact: number;
  };
  coordinates: [number, number][];
}

export type IncidentType = 
  | 'accident' 
  | 'waterlogging' 
  | 'roaddamage' 
  | 'construction' 
  | 'lighting' 
  | 'roadblock' 
  | 'crowd' 
  | 'other';

export interface IncidentReport {
  id: string;
  type: IncidentType;
  title: string;
  locationName: string;
  lat: number;
  lng: number;
  distanceAheadKm: number;
  timeAgoMinutes: number;
  severity: 'low' | 'medium' | 'high';
  confirmationCount: number;
  confidence: 'high' | 'likely' | 'unconfirmed';
  description: string;
}

export interface Hospital {
  id: string;
  name: string;
  rating: number;
  lat: number;
  lng: number;
  distanceKm: number;
  etaMinutes: number;
  emergencyPhone: string;
  receptionPhone: string;
  available247: boolean;
  ambulanceAvailable: boolean;
  icuAvailable: boolean;
  address: string;
  services: string[];
}

export type EssentialCategory = 
  | 'hospital' 
  | 'police' 
  | 'fire' 
  | 'fuel' 
  | 'ev' 
  | 'restroom' 
  | 'supermarket' 
  | 'pharmacy' 
  | 'atm' 
  | 'food';

export interface EssentialService {
  id: string;
  name: string;
  category: EssentialCategory;
  lat: number;
  lng: number;
  distanceKm: number;
  isOpen: boolean;
  address: string;
  phone?: string;
  details?: string;
}

export interface ChecklistItem {
  id: string;
  category: 'essentials' | 'weather' | 'emergency' | 'roadtrip';
  text: string;
  checked: boolean;
  recommendedReason?: string;
}

export interface TrustedContact {
  id: string;
  name: string;
  relation: string;
  phone: string;
  email: string;
  isNotified?: boolean;
}

export interface CheckInPoint {
  id: string;
  locationName: string;
  targetTime: string;
  status: 'pending' | 'completed' | 'missed';
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
}

export interface TravelReadiness {
  totalScore: number;
  breakdown: {
    routeCondition: { score: number; max: number };
    weatherPrep: { score: number; max: number };
    essentialItems: { score: number; max: number };
    phoneBattery: { score: number; max: number };
    emergencyPrep: { score: number; max: number };
  };
  recommendation: string;
}
