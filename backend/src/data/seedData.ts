import { User, Incident, CivicReport, Shelter, Resource, DisasterPlan, ActivityLog } from '../types.js';

export const SEED_USERS: User[] = [
  {
    id: 'usr-citizen-01',
    name: 'Ananya Ramanathan',
    email: 'ananya@saros.tn.gov.in',
    role: 'citizen',
    phone: '+91 98401 23456',
    ward: 'Ward 177 - Velachery, Chennai',
    location: { lat: 12.9815, lng: 80.2180, address: 'Bhuvaneshwari Nagar, Velachery, Chennai' },
    createdAt: '2026-10-10T08:00:00.000Z',
  },
  {
    id: 'usr-volunteer-01',
    name: 'Karthik Sivakumar',
    email: 'karthik.vol@saros.tn.gov.in',
    role: 'volunteer',
    phone: '+91 94440 98765',
    ward: 'Ward 175 - Adyar Basin',
    agency: 'Tamil Nadu Disaster Volunteer Force (TNDVF)',
    skills: ['First Aid (CPR certified)', 'HAM Radio Operator (VU2TNR)', 'Swimmer/Rescue Boat Assistant'],
    createdAt: '2026-10-10T08:30:00.000Z',
  },
  {
    id: 'usr-responder-01',
    name: 'Commander R. Senthil Nathan',
    email: 'senthil.ndrf@saros.tn.gov.in',
    role: 'responder',
    phone: '+91 94421 11223',
    badgeNumber: 'NDRF-4BN-882',
    agency: '4th Battalion NDRF Arakkonam / TN Fire & Rescue',
    ward: 'Regional EOC Chennai South',
    createdAt: '2026-10-09T06:00:00.000Z',
  },
  {
    id: 'usr-admin-01',
    name: 'Dr. V. Rajeshwari IAS',
    email: 'admin.disaster@saros.tn.gov.in',
    role: 'admin',
    phone: '+91 94450 00112',
    badgeNumber: 'IAS-TN-DIS-09',
    agency: 'State Disaster Management Authority (TNSDMA)',
    ward: 'State Emergency Operations Center (SEOC), Ezhilagam',
    createdAt: '2026-10-08T04:00:00.000Z',
  }
];

export const SEED_INCIDENTS: Incident[] = [
  {
    id: 'SOS-TN-1048',
    clientIncidentId: 'cid-tn-1048-seed',
    userId: 'usr-cit-1048',
    userName: 'Meenakshi Sundaram',
    category: 'MEDICAL',
    description: 'Elderly cardiac patient requiring oxygen cylinder backup, floodwater entered ground floor.',
    location: {
      lat: 12.2253,
      lng: 79.0747,
      address: 'Vengikkal Municipal Ward 4, Tiruvannamalai',
      ward: 'Ward 4'
    },
    peopleCount: 1,
    priority: 'CRITICAL',
    status: 'IN_PROGRESS',
    submissionMethod: 'MESH_RELAY',
    meshHops: 4,
    assignedTo: {
      id: 'usr-responder-01',
      name: 'Commander R. Senthil Nathan (NDRF)',
      role: 'responder',
      assignedAt: '2026-10-15T09:40:00.000Z'
    },
    responderNotes: [
      {
        timestamp: '2026-10-15T10:05:00.000Z',
        responderName: 'Commander R. Senthil Nathan',
        text: 'Ambulance team dispatched with portable oxygen unit via bypass route.'
      }
    ],
    statusHistory: [
      { status: 'SUBMITTED', timestamp: '2026-10-15T09:30:00.000Z', updatedBy: 'Meenakshi Sundaram', role: 'citizen' },
      { status: 'ACKNOWLEDGED', timestamp: '2026-10-15T09:35:00.000Z', updatedBy: 'Control Room EOC', role: 'responder' },
      { status: 'ASSIGNED', timestamp: '2026-10-15T09:40:00.000Z', updatedBy: 'Control Room EOC', role: 'admin' },
      { status: 'IN_PROGRESS', timestamp: '2026-10-15T10:05:00.000Z', updatedBy: 'Commander R. Senthil Nathan', role: 'responder' }
    ],
    createdAt: '2026-10-15T09:30:00.000Z',
    updatedAt: '2026-10-15T10:05:00.000Z'
  },
  {
    id: 'SOS-TN-1052',
    clientIncidentId: 'cid-tn-1052-seed',
    userId: 'usr-cit-1052',
    userName: 'K. Murugan',
    category: 'FOOD_WATER',
    description: 'Hamlet surrounded by flash flood streams. 5 villagers including 2 children stranded on terrace without drinking water.',
    location: {
      lat: 12.5085,
      lng: 79.1234,
      address: 'Polur Foothills Agricultural Hamlet',
      ward: 'Polur Taluk'
    },
    peopleCount: 5,
    priority: 'HIGH',
    status: 'ASSIGNED',
    submissionMethod: 'MESH_RELAY',
    meshHops: 3,
    assignedTo: {
      id: 'usr-volunteer-01',
      name: 'Karthik Sivakumar (Volunteer TNDVF)',
      role: 'volunteer',
      assignedAt: '2026-10-15T10:15:00.000Z'
    },
    statusHistory: [
      { status: 'SUBMITTED', timestamp: '2026-10-15T09:55:00.000Z', updatedBy: 'K. Murugan', role: 'citizen' },
      { status: 'ACKNOWLEDGED', timestamp: '2026-10-15T10:00:00.000Z', updatedBy: 'Control Room', role: 'responder' },
      { status: 'ASSIGNED', timestamp: '2026-10-15T10:15:00.000Z', updatedBy: 'Control Room', role: 'admin' }
    ],
    createdAt: '2026-10-15T09:55:00.000Z',
    updatedAt: '2026-10-15T10:15:00.000Z'
  },
  {
    id: 'SOS-TN-1056',
    clientIncidentId: 'cid-tn-1056-seed',
    userId: 'usr-cit-1056',
    userName: 'G. Selvan',
    category: 'FIRE',
    description: 'Electrical transformer sparking and diesel generator leak near flooded canal bund.',
    location: {
      lat: 12.1812,
      lng: 78.9876,
      address: 'Sathanur Dam Canal Outflow',
      ward: 'Thandarampattu'
    },
    peopleCount: 3,
    priority: 'HIGH',
    status: 'ACKNOWLEDGED',
    submissionMethod: 'MESH_RELAY',
    meshHops: 2,
    statusHistory: [
      { status: 'SUBMITTED', timestamp: '2026-10-15T10:30:00.000Z', updatedBy: 'G. Selvan', role: 'citizen' },
      { status: 'ACKNOWLEDGED', timestamp: '2026-10-15T10:35:00.000Z', updatedBy: 'TNEB Emergency Desk', role: 'responder' }
    ],
    createdAt: '2026-10-15T10:30:00.000Z',
    updatedAt: '2026-10-15T10:35:00.000Z'
  },
  {
    id: 'SOS-TN-1060',
    clientIncidentId: 'cid-tn-1060-seed',
    userId: 'usr-cit-1060',
    userName: 'P. Vijayalakshmi',
    category: 'MEDICAL',
    description: 'Vehicle trapped on inundated highway causeway. Single occupant with severe hypothermia.',
    location: {
      lat: 12.2310,
      lng: 79.6500,
      address: 'Tindivanam Highway Causeway, NH 32',
      ward: 'Tindivanam'
    },
    peopleCount: 1,
    priority: 'CRITICAL',
    status: 'IN_PROGRESS',
    submissionMethod: 'ONLINE_DIRECT',
    meshHops: 1,
    assignedTo: {
      id: 'usr-responder-01',
      name: 'Highway Patrol Rescue Unit #9',
      role: 'responder',
      assignedAt: '2026-10-15T11:00:00.000Z'
    },
    statusHistory: [
      { status: 'SUBMITTED', timestamp: '2026-10-15T10:50:00.000Z', updatedBy: 'P. Vijayalakshmi', role: 'citizen' },
      { status: 'ACKNOWLEDGED', timestamp: '2026-10-15T10:52:00.000Z', updatedBy: 'Control Room EOC', role: 'responder' },
      { status: 'IN_PROGRESS', timestamp: '2026-10-15T11:00:00.000Z', updatedBy: 'Highway Patrol Rescue Unit #9', role: 'responder' }
    ],
    createdAt: '2026-10-15T10:50:00.000Z',
    updatedAt: '2026-10-15T11:00:00.000Z'
  },
  {
    id: 'SOS-TN-1064',
    clientIncidentId: 'cid-tn-1064-seed',
    userId: 'usr-cit-1064',
    userName: 'R. Balaji',
    category: 'FLOOD',
    description: 'Rapid water level rising inside apartment complex ground floor, 4 family members including an infant.',
    location: {
      lat: 12.9812,
      lng: 80.2185,
      address: 'Ram Nagar South 3rd Cross, Velachery Basin, Chennai',
      ward: 'Ward 177'
    },
    peopleCount: 4,
    priority: 'CRITICAL',
    status: 'IN_PROGRESS',
    submissionMethod: 'ONLINE_DIRECT',
    meshHops: 1,
    assignedTo: {
      id: 'usr-responder-01',
      name: 'Rescue Boat / Ambulance Unit TN-02',
      role: 'responder',
      assignedAt: '2026-10-15T11:20:00.000Z'
    },
    statusHistory: [
      { status: 'SUBMITTED', timestamp: '2026-10-15T11:10:00.000Z', updatedBy: 'R. Balaji', role: 'citizen' },
      { status: 'ACKNOWLEDGED', timestamp: '2026-10-15T11:12:00.000Z', updatedBy: 'EOC Velachery', role: 'responder' },
      { status: 'ASSIGNED', timestamp: '2026-10-15T11:20:00.000Z', updatedBy: 'EOC Velachery', role: 'responder' },
      { status: 'IN_PROGRESS', timestamp: '2026-10-15T11:25:00.000Z', updatedBy: 'Rescue Boat Team #2', role: 'responder' }
    ],
    createdAt: '2026-10-15T11:10:00.000Z',
    updatedAt: '2026-10-15T11:25:00.000Z'
  }
];

export const SEED_CIVIC_REPORTS: CivicReport[] = [
  {
    id: 'CIV-TN-2041',
    userId: 'usr-citizen-01',
    userName: 'Ananya Ramanathan',
    category: 'WATERLOGGING',
    description: 'Knee-deep water stagnation blocking Velachery bypass service lane, causing traffic paralysis.',
    location: {
      lat: 12.9825,
      lng: 80.2190,
      address: 'Velachery Main Road Junction, Ward 177',
      ward: 'Ward 177'
    },
    status: 'VERIFIED',
    verificationNotes: 'Verified by Ward 177 sanitary inspector. Heavy suction pump positioned.',
    assignedAgency: 'Greater Chennai Corporation (GCC)',
    verifiedBy: 'Insp. M. Shanmugam',
    createdAt: '2026-10-15T08:15:00.000Z',
    updatedAt: '2026-10-15T09:00:00.000Z'
  },
  {
    id: 'CIV-TN-2045',
    userId: 'usr-cit-1052',
    userName: 'D. Elango',
    category: 'BLOCKED_DRAIN',
    description: 'Stormwater culvert clogged with tree branches and plastic debris near storm drain channel #4.',
    location: {
      lat: 12.9770,
      lng: 80.2210,
      address: 'Taramani Link Road Culvert, Velachery',
      ward: 'Ward 177'
    },
    status: 'IN_PROGRESS',
    verificationNotes: 'Excavator and JCB team deployed to clear culvert choke.',
    assignedAgency: 'Public Works Department (PWD)',
    verifiedBy: 'AE R. Kumaran',
    createdAt: '2026-10-15T08:45:00.000Z',
    updatedAt: '2026-10-15T09:30:00.000Z'
  },
  {
    id: 'CIV-TN-2049',
    userId: 'usr-volunteer-01',
    userName: 'Karthik Sivakumar',
    category: 'FALLEN_TREE',
    description: 'Large banyan branch snapped across 11kV overhead electrical wire, high risk of electrocution.',
    location: {
      lat: 12.9840,
      lng: 80.2160,
      address: 'Dhandeeswaram Main Road, Velachery',
      ward: 'Ward 177'
    },
    status: 'REPORTED',
    assignedAgency: 'TNEB & GCC Parks Wing',
    createdAt: '2026-10-15T10:10:00.000Z',
    updatedAt: '2026-10-15T10:10:00.000Z'
  },
  {
    id: 'CIV-TN-2053',
    userId: 'usr-cit-1056',
    userName: 'S. Saravanan',
    category: 'SLOPE_CRACK',
    description: 'Visible 2-meter soil fissures along canal bund embankment; risk of bund collapse if water surges.',
    location: {
      lat: 12.1850,
      lng: 78.9910,
      address: 'Sathanur Left Bank Bund, Tiruvannamalai',
      ward: 'Thandarampattu'
    },
    status: 'VERIFIED',
    verificationNotes: 'WRD engineers dispatched with sandbags and earthmovers to reinforce bund.',
    assignedAgency: 'Water Resources Department (WRD)',
    verifiedBy: 'EE K. Prabhakaran',
    createdAt: '2026-10-15T09:20:00.000Z',
    updatedAt: '2026-10-15T10:00:00.000Z'
  }
];

export const SEED_SHELTERS: Shelter[] = [
  {
    id: 'SHELTER-TN-01',
    name: 'Velachery Community Relief Center #4',
    location: {
      lat: 12.9830,
      lng: 80.2220,
      address: 'Corporation Community Hall, Velachery Bypass Road, Chennai'
    },
    capacity: 450,
    currentOccupancy: 210,
    status: 'OPEN',
    facilities: ['Medical Post', 'Clean RO Drinking Water', 'Community Kitchen', 'Diesel Generator Backup', 'Women & Child Safe Zone'],
    contactPhone: '+91 44 2244 5566',
    managerName: 'Thiru M. Arumugam'
  },
  {
    id: 'SHELTER-TN-02',
    name: 'Tiruvannamalai District Relief Camp #1',
    location: {
      lat: 12.2280,
      lng: 79.0680,
      address: 'Government Higher Secondary School Campus, Vengikkal'
    },
    capacity: 600,
    currentOccupancy: 380,
    status: 'OPEN',
    facilities: ['Field Hospital (4 Doctors)', 'Purified Water Tanker', 'Dry Rations Store', 'Solar Emergency Lighting'],
    contactPhone: '+91 4175 233445',
    managerName: 'Dr. C. Shanthi'
  },
  {
    id: 'SHELTER-TN-03',
    name: 'Polur Taluk Cyclone & Flood Evacuation Center',
    location: {
      lat: 12.5100,
      lng: 79.1300,
      address: 'Taluk Office Multipurpose Cyclone Shelter, Polur'
    },
    capacity: 300,
    currentOccupancy: 95,
    status: 'OPEN',
    facilities: ['Shelter Hall', 'Paramedic Desk', 'Inflatable Beds', 'Ham Radio Station VU2POL'],
    contactPhone: '+91 4181 222333',
    managerName: 'Thiru S. Balamurugan'
  },
  {
    id: 'SHELTER-TN-04',
    name: 'Tindivanam Highway Transit Relief Center',
    location: {
      lat: 12.2350,
      lng: 79.6450,
      address: 'Municipal Town Hall, NH 32 Junction, Tindivanam'
    },
    capacity: 250,
    currentOccupancy: 240,
    status: 'FULL',
    facilities: ['Emergency Dormitory', 'First Aid Station', 'Transit Food Packets'],
    contactPhone: '+91 4147 224488',
    managerName: 'Thiru K. Natarajan'
  }
];

export const SEED_RESOURCES: Resource[] = [
  {
    id: 'RES-TN-01',
    name: 'FRP Motorized Rescue Boats (40HP Yamaha)',
    category: 'RESCUE_VEHICLE',
    totalQuantity: 12,
    availableQuantity: 4,
    deployedQuantity: 8,
    baseLocation: 'NDRF Base Arakkonam / Velachery EOC Staging',
    status: 'DEPLOYED'
  },
  {
    id: 'RES-TN-02',
    name: 'High-Capacity Mobile De-watering Pumps (100 HP)',
    category: 'GENERATOR',
    totalQuantity: 25,
    availableQuantity: 9,
    deployedQuantity: 16,
    baseLocation: 'GCC Ripon Building Yard / Velachery Lake Outflow',
    status: 'DEPLOYED'
  },
  {
    id: 'RES-TN-03',
    name: 'Trauma & Paramedic Emergency Kits',
    category: 'MEDICAL_KIT',
    totalQuantity: 80,
    availableQuantity: 34,
    deployedQuantity: 46,
    baseLocation: 'Government Royapettah Hospital & District HQ',
    status: 'READY'
  },
  {
    id: 'RES-TN-04',
    name: 'Emergency Ready-to-Eat Food & Water Packs (Family/3-day)',
    category: 'FOOD_RATION',
    totalQuantity: 5000,
    availableQuantity: 2850,
    deployedQuantity: 2150,
    baseLocation: 'Civil Supplies Godown, Chromepet & Vengikkal',
    status: 'READY'
  },
  {
    id: 'RES-TN-05',
    name: 'Solar-Diesel Hybrid Silent Generators (15 kVA)',
    category: 'GENERATOR',
    totalQuantity: 18,
    availableQuantity: 6,
    deployedQuantity: 12,
    baseLocation: 'District Collectorate Compound',
    status: 'DEPLOYED'
  }
];

export const SEED_DISASTER_PLANS: DisasterPlan[] = [
  {
    id: 'PLAN-TN-FLOOD',
    hazardType: 'FLOOD',
    title: 'Tamil Nadu Standard Operating Procedure: Urban Inundation & Riverine Floods',
    alertLevel: 'WARNING',
    summary: 'Standard emergency protocols during severe depression, monsoon surge, or dam water releases.',
    safetyChecklist: [
      'Turn off ground mains electricity switches and gas cylinders immediately before water enters the house.',
      'Relocate elderly individuals, infants, and medical patients to the first floor or nearest shelter before roads submerge.',
      'Charge mobile phones and power banks to 100%; store essential documents in watertight zip-lock pouches.',
      'Boil all municipal/tanker water for at least 10 minutes before consumption to prevent water-borne disease.',
      'Keep away from downed electric poles, flooded culverts, and fast-flowing open storm channels.'
    ],
    evacuationRoutes: [
      'Velachery Bypass -> Inner Ring Road Elevated Expressway -> St. Thomas Mount High Grounds',
      'Vengikkal Ward 4 -> Collectorate Bypass -> District Sports Stadium Relief Hub',
      'Polur Foothills -> SH-9 High Ridge Road -> Multipurpose Cyclone Shelter'
    ],
    emergencyContacts: [
      { agency: 'Disaster Management Toll Free', phone: '1070 / 1077' },
      { agency: 'State Emergency Response (Police / Fire / Ambulance)', phone: '112' },
      { agency: 'Greater Chennai Corporation Flood Helpline', phone: '1913' },
      { agency: 'NDRF 24x7 Control Room (Arakkonam)', phone: '04177 246594' },
      { agency: 'Electricity Breakdown (TANGEDCO Minnagam)', phone: '94987 94987' }
    ],
    lastUpdated: '2026-10-15T06:00:00.000Z'
  },
  {
    id: 'PLAN-TN-CYCLONE',
    hazardType: 'CYCLONE',
    title: 'Cyclone Preparedness & High-Wind Shelter Advisory',
    alertLevel: 'WATCH',
    summary: 'Protective measures against gale winds exceeding 90 km/h, storm surges, and falling trees.',
    safetyChecklist: [
      'Board up or tape large glass windows in criss-cross pattern to prevent fragmentation.',
      'Secure loose rooftop objects, tin sheets, solar water heater panels, and satellite dishes.',
      'Do not venture outside during the eye of the cyclone; the calm is temporary and destructive winds will reverse.',
      'Avoid parking four-wheelers beneath old trees or billboard hoardings.'
    ],
    evacuationRoutes: [
      'Coastal Zone A (Within 500m of shoreline) -> Designated Cyclone Centers inland'
    ],
    emergencyContacts: [
      { agency: 'Fisheries Emergency Cell', phone: '044 2433 6311' },
      { agency: 'Coast Guard Maritime Rescue Co-ordination', phone: '1554' }
    ],
    lastUpdated: '2026-10-14T12:00:00.000Z'
  },
  {
    id: 'PLAN-TN-EARTHQUAKE',
    hazardType: 'EARTHQUAKE',
    title: 'Seismic Safety: Drop, Cover, and Hold On Protocol',
    alertLevel: 'NORMAL',
    summary: 'Procedures for tremor response, post-shock structural checks, and safe assembly points.',
    safetyChecklist: [
      'DROP down onto your hands and knees immediately when shaking starts.',
      'COVER your head and neck under a sturdy table or desk.',
      'HOLD ON to your shelter until shaking stops completely.',
      'Do not use elevators; use stairwells after tremors cease and check for gas leaks before turning on lights.'
    ],
    evacuationRoutes: [
      'Open Playgrounds, Public Parks, and Wide Road Junctions away from high-rise masonry'
    ],
    emergencyContacts: [
      { agency: 'National Disaster Management Authority (NDMA)', phone: '011 26701728' },
      { agency: 'State Seismic Cell', phone: '1070' }
    ],
    lastUpdated: '2026-10-12T10:00:00.000Z'
  },
  {
    id: 'PLAN-TN-HEATWAVE',
    hazardType: 'HEATWAVE',
    title: 'Extreme Heatwave & Dehydration Action Protocol',
    alertLevel: 'NORMAL',
    summary: 'Advisory for wet-bulb temperatures and heat index over 42°C.',
    safetyChecklist: [
      'Avoid direct outdoor sun exposure between 11:00 AM and 3:30 PM.',
      'Drink ORS, coconut water, lemon water, and buttermilk frequently even if not feeling thirsty.',
      'Wear loose, light-colored cotton clothing and cover head with a damp cloth or umbrella.',
      'Never leave children or elderly persons in parked vehicles.'
    ],
    evacuationRoutes: [
      'Air-conditioned Public Transit Hubs, Cooling Shelters, and Shaded Primary Health Centers'
    ],
    emergencyContacts: [
      { agency: '108 Emergency Ambulance Heatstroke Wing', phone: '108' }
    ],
    lastUpdated: '2026-10-10T08:00:00.000Z'
  }
];

export const SEED_ACTIVITY_LOGS: ActivityLog[] = [
  {
    id: 'LOG-001',
    timestamp: '2026-10-15T09:35:00.000Z',
    action: 'INCIDENT_ACKNOWLEDGED',
    actorName: 'Control Room EOC',
    actorRole: 'responder',
    details: 'Acknowledged SOS-TN-1048 (Cardiac emergency in flooded zone)',
    entityType: 'INCIDENT',
    entityId: 'SOS-TN-1048'
  },
  {
    id: 'LOG-002',
    timestamp: '2026-10-15T09:40:00.000Z',
    action: 'INCIDENT_ASSIGNED',
    actorName: 'Control Room EOC',
    actorRole: 'admin',
    details: 'Assigned SOS-TN-1048 to Commander R. Senthil Nathan (NDRF 4BN)',
    entityType: 'INCIDENT',
    entityId: 'SOS-TN-1048'
  },
  {
    id: 'LOG-003',
    timestamp: '2026-10-15T10:00:00.000Z',
    action: 'CIVIC_VERIFIED',
    actorName: 'Insp. M. Shanmugam',
    actorRole: 'responder',
    details: 'Verified CIV-TN-2041 (Waterlogging on Velachery Bypass Service Lane)',
    entityType: 'CIVIC',
    entityId: 'CIV-TN-2041'
  },
  {
    id: 'LOG-004',
    timestamp: '2026-10-15T11:20:00.000Z',
    action: 'RESOURCE_DEPLOYED',
    actorName: 'Commander R. Senthil Nathan',
    actorRole: 'responder',
    details: 'Dispatched 2 FRP motorized boats to Ward 177 Velachery Basin',
    entityType: 'RESOURCE',
    entityId: 'RES-TN-01'
  }
];
