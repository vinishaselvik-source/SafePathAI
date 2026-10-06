import { 
  TripDetails, 
  RouteOption, 
  IncidentReport, 
  Hospital, 
  EssentialService, 
  ChecklistItem, 
  TrustedContact, 
  CheckInPoint, 
  TravelReadiness 
} from '../types';

export const initialTripDetails: TripDetails = {
  startingPoint: 'Chennai, Tamil Nadu',
  destination: 'Pondicherry (Puducherry)',
  travelType: 'roadtrip',
  transport: 'car',
  departureTime: '2026-10-06T21:30',
  preferences: {
    preferSafer: true,
    avoidPoorLighting: true,
    avoidRoadDamage: true,
    preferPopulated: true,
    preferEmergencyAccess: true,
    avoidHeavyTraffic: true,
    preferFuelAvailability: true,
  }
};

export const mockReadinessScore: TravelReadiness = {
  totalScore: 78,
  breakdown: {
    routeCondition: { score: 18, max: 20 },
    weatherPrep: { score: 12, max: 20 },
    essentialItems: { score: 16, max: 20 },
    phoneBattery: { score: 18, max: 20 },
    emergencyPrep: { score: 14, max: 20 },
  },
  recommendation: "Before you leave, carry rain protection, charge your phone above 60%, save the offline safety route pack, and add an active emergency contact."
};

export const mockRoutes: RouteOption[] = [
  {
    id: 'route-b',
    name: 'Route B — East Coast Highway (ECR)',
    type: 'recommended',
    isAiRecommended: true,
    distance: '155 km',
    time: '3h 15m',
    safetyScore: 91,
    warnings: ['⚠️ Moderate coastal crosswinds', '📶 18-min low connectivity stretch near Marakkanam'],
    benefits: [
      '✅ 24/7 Emergency hospital coverage along route',
      '✅ Well-lit populated coastal stretches',
      '✅ Frequent fuel & EV charging stations',
      '✅ Lowest accident frequency rating (0.04/km)'
    ],
    scoreExplanation: 'Route B is AI Recommended because it offers maximum emergency service density, excellent street lighting, and lower historical incident density despite coastal breeze.',
    breakdown: {
      roadCondition: 19,
      traffic: 14,
      recentIncidents: 14,
      lighting: 9,
      connectivity: 7,
      emergencyAccess: 15,
      weatherImpact: 13,
    },
    coordinates: [
      [13.0827, 80.2707],
      [12.9800, 80.2200],
      [12.8000, 80.2400],
      [12.6269, 80.1927],
      [12.3500, 79.9800],
      [11.9416, 79.8083]
    ]
  },
  {
    id: 'route-a',
    name: 'Route A — Express Highway (NH32 via Tindivanam)',
    type: 'fastest',
    isAiRecommended: false,
    distance: '162 km',
    time: '2h 57m (18m faster)',
    safetyScore: 64,
    warnings: [
      '🚧 Heavy bridge widening construction near Chengalpattu',
      '🚦 Severe bottleneck traffic reported at Tindivanam toll gate',
      '⚠️ High speed heavy vehicle lane merging risk'
    ],
    benefits: ['✅ 4-lane wide express asphalt', '✅ Multiple rest stops'],
    scoreExplanation: 'Route A is the fastest by 18 minutes, but scores 64/100 due to major active highway construction, high heavy-vehicle traffic density, and delayed emergency response times.',
    breakdown: {
      roadCondition: 12,
      traffic: 8,
      recentIncidents: 9,
      lighting: 7,
      connectivity: 9,
      emergencyAccess: 10,
      weatherImpact: 9,
    },
    coordinates: [
      [13.0827, 80.2707],
      [12.7900, 79.9800],
      [12.2300, 79.6500],
      [11.9416, 79.8083]
    ]
  },
  {
    id: 'route-c',
    name: 'Route C — OMR Interior Corridor (via Kalpakkam)',
    type: 'alternative',
    isAiRecommended: false,
    distance: '159 km',
    time: '3h 22m',
    safetyScore: 82,
    warnings: [
      '🌑 Poor street illumination between Sadras and Pudupattinam',
      '⚠️ Moderate local commuter traffic during evening hours'
    ],
    benefits: [
      '✅ High density of open pharmacies and fuel stations',
      '✅ Good cellular tower connectivity (5G uninterrupted)',
      '✅ Well-maintained secondary tarmac'
    ],
    scoreExplanation: 'Route C provides steady cellular coverage and frequent essential stops, but scores 82/100 due to dim lighting along the Kalpakkam interior bypass.',
    breakdown: {
      roadCondition: 17,
      traffic: 12,
      recentIncidents: 13,
      lighting: 6,
      connectivity: 10,
      emergencyAccess: 12,
      weatherImpact: 12,
    },
    coordinates: [
      [13.0827, 80.2707],
      [12.8300, 80.1500],
      [12.6500, 80.0500],
      [12.1000, 79.9000],
      [11.9416, 79.8083]
    ]
  }
];

export const mockIncidents: IncidentReport[] = [
  {
    id: 'inc-1',
    type: 'waterlogging',
    title: 'Monsoon Waterlogging Reported',
    locationName: 'ECR Kovalam Stretch (2.1 km ahead)',
    lat: 12.8000,
    lng: 80.2400,
    distanceAheadKm: 2.1,
    timeAgoMinutes: 8,
    severity: 'medium',
    confirmationCount: 6,
    confidence: 'high',
    description: '4-inch standing water accumulation on left lane following rain shower. Passable at 20 km/h.'
  },
  {
    id: 'inc-2',
    type: 'construction',
    title: 'Bridge Expansion Flyover Work',
    locationName: 'NH32 Chengalpattu Flyover',
    lat: 12.7900,
    lng: 79.9800,
    distanceAheadKm: 28.5,
    timeAgoMinutes: 24,
    severity: 'high',
    confirmationCount: 14,
    confidence: 'high',
    description: 'Lanes merged from 4 to 2. Expect 15-minute bottleneck queue.'
  },
  {
    id: 'inc-3',
    type: 'lighting',
    title: 'Streetlight Circuit Failure',
    locationName: 'Marakkanam Salt Pans Bypass',
    lat: 12.3500,
    lng: 79.9800,
    distanceAheadKm: 74.0,
    timeAgoMinutes: 45,
    severity: 'medium',
    confirmationCount: 3,
    confidence: 'likely',
    description: '3 km stretch without active streetlamps. High-beam headlight usage advised.'
  }
];

export const mockHospitals: Hospital[] = [
  {
    id: 'hosp-1',
    name: 'Apollo Hospital (Specialty & Emergency)',
    rating: 4.8,
    lat: 12.9800,
    lng: 80.2200,
    distanceKm: 2.4,
    etaMinutes: 8,
    emergencyPhone: '+91 44 2829 0200',
    receptionPhone: '+91 44 2829 3333',
    available247: true,
    ambulanceAvailable: true,
    icuAvailable: true,
    address: 'OMR Road, Near Perungudi Toll, Chennai',
    services: ['24x7 Emergency Room', 'Trauma Care Unit', 'Advanced ICU', 'On-site Ambulance', '24h Pharmacy']
  },
  {
    id: 'hosp-2',
    name: 'Chettinad Super Speciality Hospital',
    rating: 4.6,
    lat: 12.8000,
    lng: 80.2400,
    distanceKm: 18.2,
    etaMinutes: 22,
    emergencyPhone: '+91 44 4741 1000',
    receptionPhone: '+91 44 4741 3000',
    available247: true,
    ambulanceAvailable: true,
    icuAvailable: true,
    address: 'IT Highway, Kelambakkam, ECR Link Road',
    services: ['24x7 Emergency', 'Cardiac Care', 'Level-1 Trauma Center', 'Blood Bank', 'Ambulance Hotline']
  },
  {
    id: 'hosp-3',
    name: 'JIPMER Emergency Super Specialty Hospital',
    rating: 4.9,
    lat: 11.9500,
    lng: 79.8100,
    distanceKm: 148.0,
    etaMinutes: 180,
    emergencyPhone: '+91 413 2296 000',
    receptionPhone: '+91 413 2272 380',
    available247: true,
    ambulanceAvailable: true,
    icuAvailable: true,
    address: 'Gorimedu, Puducherry',
    services: ['Level-1 Emergency & Trauma', '24x7 Crisis Support', 'Pediatric Intensive Care', 'Burn Ward']
  },
  {
    id: 'hosp-4',
    name: 'SIMS Super Speciality Hospital',
    rating: 4.7,
    lat: 13.0500,
    lng: 80.2100,
    distanceKm: 7.1,
    etaMinutes: 14,
    emergencyPhone: '+91 44 2000 2000',
    receptionPhone: '+91 44 2000 4000',
    available247: true,
    ambulanceAvailable: true,
    icuAvailable: true,
    address: '1, Jawaharlal Nehru Salai, Vadapalani, Chennai',
    services: ['Emergency Care', 'Polytrauma', 'Helipad Access', 'Critical Care']
  }
];

export const mockEssentials: EssentialService[] = [
  {
    id: 'ess-1',
    name: 'Apollo Hospital Emergency',
    category: 'hospital',
    lat: 12.9800,
    lng: 80.2200,
    distanceKm: 2.4,
    isOpen: true,
    address: 'OMR Road, Perungudi, Chennai',
    phone: '+91 44 2829 0200',
    details: '24/7 Emergency Care & ICU'
  },
  {
    id: 'ess-2',
    name: 'Tamil Nadu Police Station (ECR Neelankarai)',
    category: 'police',
    lat: 12.9500,
    lng: 80.2500,
    distanceKm: 4.2,
    isOpen: true,
    address: 'ECR Main Road, Neelankarai, Chennai',
    phone: '100 / +91 44 2449 0100',
    details: 'Highway Patrol Headquarters'
  },
  {
    id: 'ess-3',
    name: 'Indian Oil Swagath Grand Fuel & Food Plaza',
    category: 'fuel',
    lat: 12.8500,
    lng: 80.2450,
    distanceKm: 11.5,
    isOpen: true,
    address: 'ECR Highway Km 24, Muttukadu',
    phone: '+91 98400 12345',
    details: 'Pure Petrol/Diesel, Clean Restrooms, 24h Cafe'
  },
  {
    id: 'ess-4',
    name: 'Zeon Fast EV Supercharger (60kW DC)',
    category: 'ev',
    lat: 12.6269,
    lng: 80.1927,
    distanceKm: 52.0,
    isOpen: true,
    address: 'Mahabalipuram Bypass Food Court',
    phone: '+91 800 123 4567',
    details: 'Dual CCS2 Gun 60kW DC Charging'
  },
  {
    id: 'ess-5',
    name: 'Apollo Pharmacy 24 Hours',
    category: 'pharmacy',
    lat: 12.9750,
    lng: 80.2400,
    distanceKm: 3.1,
    isOpen: true,
    address: 'East Coast Road, Palavakkam',
    phone: '+91 44 2451 9999',
    details: 'First-aid & Prescription Medicines'
  },
  {
    id: 'ess-6',
    name: 'SBI 24x7 Cash ATM & Deposit',
    category: 'atm',
    lat: 12.8200,
    lng: 80.2410,
    distanceKm: 14.0,
    isOpen: true,
    address: 'Covelong Junction ECR',
    details: 'Active Cash Dispenser'
  },
  {
    id: 'ess-7',
    name: 'Highway Rest Stop & Family Restrooms',
    category: 'restroom',
    lat: 12.6100,
    lng: 80.1800,
    distanceKm: 55.0,
    isOpen: true,
    address: 'Mahabalipuram Toll Plaza Annex',
    details: 'Clean Hygienic Restrooms & Baby Care Room'
  }
];

export const mockChecklistItems: ChecklistItem[] = [
  { id: 'c-1', category: 'essentials', text: 'Smartphone charged above 80%', checked: true, recommendedReason: 'Vital for live route updates & emergency contact' },
  { id: 'c-2', category: 'essentials', text: 'Govt Issued Photo ID Card (Driving License/Aadhaar)', checked: true },
  { id: 'c-3', category: 'essentials', text: 'Physical Wallet with ₹2,000 Cash for toll/cash-only stops', checked: true },
  { id: 'c-4', category: 'essentials', text: 'Car Charger & High-speed USB-C Cable', checked: true },
  { id: 'c-5', category: 'weather', text: 'Compact Umbrella & Waterproof Rain Poncho', checked: false, recommendedReason: 'Monsoon shower forecast along coastal ECR' },
  { id: 'c-6', category: 'weather', text: '2x 1-Litre Sealed Drinking Water Bottles', checked: true },
  { id: 'c-7', category: 'weather', text: 'Waterproof pouch for phone & key fob', checked: false },
  { id: 'c-8', category: 'emergency', text: 'Compact First-Aid Kit (Bandages, Antiseptic, Paracetamol)', checked: false, recommendedReason: 'Essential solo travel safety precaution' },
  { id: 'c-9', category: 'emergency', text: 'LED Rechargeable Flashlight with SOS strobe function', checked: false, recommendedReason: 'Recommended for night travel stretches' },
  { id: 'c-10', category: 'emergency', text: '2 Emergency Contacts added to SafePath Safety Circle', checked: true },
  { id: 'c-11', category: 'roadtrip', text: 'Vehicle Registration Document (RC) & Insurance Copy', checked: true },
  { id: 'c-12', category: 'roadtrip', text: 'Spare Tyre Pressure Check & Jack / Wrench tool set', checked: false },
  { id: 'c-13', category: 'roadtrip', text: 'SafePath Offline Safety Pack downloaded', checked: false, recommendedReason: 'Covers 18-min Marakkanam low-connectivity zone' },
];

export const mockTrustedContacts: TrustedContact[] = [
  { id: 'ct-1', name: 'Rohan Sharma', relation: 'Brother / Emergency Contact 1', phone: '+91 98765 43210', email: 'rohan.sharma@example.com', isNotified: true },
  { id: 'ct-2', name: 'Priya Sundaram', relation: 'Spouse / Safety Circle', phone: '+91 98123 45678', email: 'priya.s@example.com', isNotified: true },
  { id: 'ct-3', name: 'Anand Kumar', relation: 'Travel Companion / Friend', phone: '+91 97111 22334', email: 'anand.k@example.com', isNotified: false }
];

export const mockCheckIns: CheckInPoint[] = [
  { id: 'chk-1', locationName: 'Chennai ECR Toll Plaza Start', targetTime: '09:30 PM', status: 'completed' },
  { id: 'chk-2', locationName: 'Mahabalipuram Checkpoint (Km 55)', targetTime: '10:45 PM', status: 'pending' },
  { id: 'chk-3', locationName: 'Pondicherry Hotel Arrival', targetTime: '12:45 AM', status: 'pending' }
];

export const mockCopilotSuggestions = [
  "Why is Route B recommended over Route A?",
  "Where is the nearest 24/7 hospital with ICU?",
  "What should I pack for rain on ECR?",
  "I have 35% battery left. What safety steps should I take?",
  "Which stretches have poor cellular network?",
  "Is night driving safe on this route?"
];
