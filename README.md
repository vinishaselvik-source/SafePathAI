# SAROS — Search and Rescue Operating System
### Product Development Lab — III (24AI511)
**Department of Computer Science and Engineering**  
**R.M.K. College of Engineering and Technology (Autonomous)**  
*October 2026*

**Project Team:**
- **Yamuna A M** (111624102243)
- **Vinisha Selvi K** (111624102238)
- **Ramyaa S** (111624102250)

**Supervisor:** Ms. Yuvasri B  
**Head of the Department:** Dr. R. Raja Guru  

---

## 1. System Vision & Overview

During severe catastrophic disasters such as urban floods, cyclones, landslides, and infrastructure damage, conventional cellular and internet connectivity frequently collapses or becomes congested. 

**SAROS (Search and Rescue Operating System)** is an integrated disaster-preparedness and emergency-response web application designed to connect citizens, volunteers, emergency responders, and district administrators in a unified operational picture.

### Key Capabilities
1. **Emergency Rescue SOS (Hold-to-Trigger)**: 2-second progressive hold trigger with GPS and manual map coordinate selection.
2. **Offline-First Persistence**: High-reliability offline storage in client-side **IndexedDB** (`STORE_NAME=sos_queue`). Survives browser reloads and automatically syncs to central servers upon network reconnection with duplicate deduplication.
3. **Software Mesh Relay Simulator**: Interactive ad-hoc flooding network simulation demonstrating store-and-forward routing, hop limit control ($TTL=7$), duplicate suppression by packet ID, and gateway internet uplink.
4. **Live Responder Control Room & Triage**: Geo-spatial distance triage cards (`SOS-TN-1048`, `SOS-TN-1052`, etc.) with real-time status advancement (`SUBMITTED` $\to$ `ACKNOWLEDGED` $\to$ `ASSIGNED` $\to$ `IN_PROGRESS` $\to$ `RESOLVED`).
5. **Interactive Disaster GIS Map**: Integrated Leaflet & OpenStreetMap mapping engine with custom color-coded status beacons, pulsing critical markers, relief shelter occupancy gauges, and civic hazard pins.
6. **CityZen Civic Infrastructure Screening**: Crowdsourced reporting of blocked stormwater drains, road waterlogging, damaged causeways, and canal bund cracks with municipal review and agency dispatch (GCC, PWD, WRD, TNEB).
7. **Disaster Management Plans (DMP) & Shelters**: Hazard SOPs for Floods, Cyclones, Earthquakes, and Heatwaves; interactive safety checklists; emergency relief centers; and rescue resource inventory.
8. **Trilingual Localization**: Pre-reviewed safety translations in **English**, **Tamil (தமிழ்)**, and **Hindi (हिंदी)**.
9. **District Admin Control Room**: Real-time Recharts KPI cards, incident trends, user role administration, and immutable forensic audit logs.

---

## 2. Technology Stack

- **Frontend**: React 18, TypeScript 5, Vite 5, Tailwind CSS 3, Lucide React, Recharts 3
- **Mapping**: Leaflet 1.9, OpenStreetMap Tiles (100% Free Tier, No Paid API Keys)
- **Offline Storage**: Browser IndexedDB API with persistent store-and-forward queue
- **Backend**: Node.js, Express.js REST API with Role-Based Access Control (RBAC)
- **Database & Cloud**: Resilient JSON store with Cloud Firestore adapter and Firebase Security Rules
- **Testing**: Vitest 4 with automated test suite covering SOS idempotency, mesh routing, RBAC, and i18n

---

## 3. Project Structure

```text
SafeAI/
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── data/
│   │   │   └── seedData.ts       # Realistic Tamil Nadu disaster seed scenario
│   │   ├── middleware/
│   │   │   └── auth.ts           # RBAC authorization middleware
│   │   ├── routes/
│   │   │   ├── incidents.ts      # SOS emergency lifecycle & assignment
│   │   │   ├── civicReports.ts   # CityZen municipal review
│   │   │   ├── shelters.ts       # Emergency shelter occupancy
│   │   │   ├── resources.ts      # Rescue equipment inventory
│   │   │   ├── plans.ts          # Disaster management plans (DMP)
│   │   │   ├── analytics.ts      # Control room aggregated metrics
│   │   │   ├── auth.ts           # User and role administration
│   │   │   └── logs.ts           # Forensic activity trail
│   │   ├── services/
│   │   │   └── store.ts          # Unified data layer with idempotency
│   │   ├── types.ts              # Backend TypeScript interfaces
│   │   └── server.ts             # Express application entrypoint
├── src/
│   ├── components/
│   │   ├── Navbar.tsx            # Header with role switcher & offline toggle
│   │   ├── CitizenPortal.tsx     # Citizen dashboard & 2-second hold SOS
│   │   ├── SOSModal.tsx          # Emergency reporting modal with GPS
│   │   ├── MeshSimulatorView.tsx # Ad-hoc mesh simulation topology
│   │   ├── ResponderControlRoom.tsx # Live triage cards & status stepper
│   │   ├── InteractiveDisasterMap.tsx # Leaflet GIS map with pulse beacons
│   │   ├── CityZenView.tsx       # Civic hazard reporting & verification
│   │   ├── PreparednessView.tsx  # SOP checklists, shelters, and resources
│   │   ├── AdminDashboard.tsx    # Recharts analytics & role management
│   │   ├── VolunteerPortal.tsx   # Volunteer task board & on-site updates
│   │   └── DemoGuideModal.tsx    # Evaluation walkthrough guide
│   ├── locales/
│   │   └── translations.ts       # Trilingual dictionary (EN, TA, HI)
│   ├── services/
│   │   ├── api.ts                # REST API client with role headers
│   │   ├── offlineStore.ts       # IndexedDB persistence & sync manager
│   │   └── meshNetwork.ts        # Mesh flooding, TTL & deduplication engine
│   ├── types/
│   │   ├── index.ts              # Domain interfaces
│   │   └── legacy.ts             # Backwards-compatible type exports
│   ├── App.tsx                   # Main application orchestration
│   └── main.tsx
├── tests/
│   └── saros.test.ts             # Automated test suite
├── firestore.rules               # Production Firebase Security Rules
├── .env.example                  # Environment template
├── package.json
└── README.md
```

---

## 4. Quick Start & Execution

### Prerequisites
- Node.js (v18 or higher)
- npm (v9 or higher)

### 1. Install Dependencies
```bash
npm install
```

### 2. Run the Full Application (Client + Server Concurrently)
```bash
npm run dev
```
- **Backend API**: `http://localhost:5000`
- **Frontend App**: `http://localhost:3000`

### 3. Run Individual Components
- Start frontend only: `npm run dev:client`
- Start backend only: `npm run dev:server`
- Execute test suite: `npm test`
- Build for production: `npm run build`

---

## 5. Walkthrough of Evaluated Scenarios

1. **SOS Creation & Tracking**: Trigger an alert on the Home screen. An incident with a unique tracking number (e.g., `SOS-TN-1065`) is immediately dispatched.
2. **Offline-First Resilience**: Click `Simulate Offline` in the navigation bar. Submit an SOS alert. The alert is saved into the browser's IndexedDB. Re-enable online status: the alert syncs automatically to the server without creating duplicates.
3. **Software Mesh Routing**: Navigate to the `Mesh Simulator`. Adjust the signal slider or drag nodes to create disconnected islands. Click `Broadcast SOS Packet` to observe step-by-step flooding, $TTL=7$ decrement, deduplication of already-seen packet IDs, and gateway server ingestion.
4. **Triage Lifecycle**: Switch to `Responder` and open `Alerts & Triage`. Advance incident statuses (`ACKNOWLEDGED` $\to$ `ASSIGNED` $\to$ `IN_PROGRESS` $\to$ `RESOLVED`) and attach responder field notes.
5. **Interactive Leaflet GIS**: View incidents with pulsing red beacons, green shelters with live capacity bars, and blue civic infrastructure issues.
6. **CityZen Civic Screening**: Submit blocked drain or road waterlogging reports. Review and assign responsible agencies (GCC, PWD, TNEB).
7. **Trilingual Localization**: Switch between English, Tamil (தமிழ்), and Hindi (हिंदी) with reviewed emergency advisories.

---

## 6. Verification & Test Execution Results

```text
 ✓ tests/saros.test.ts (9 tests) 177ms
   ✓ SOS Incident Management & Idempotency
     ✓ creates a unique incident with valid data and initial history
     ✓ prevents duplicate incidents when retrying with the same clientIncidentId
   ✓ Incident Status Advancement & Assignment
     ✓ allows responders to advance incident status and attach field notes
   ✓ CityZen Civic Infrastructure Screening
     ✓ submits a civic issue and allows municipal inspection verification
   ✓ Role-Based Authorization & Administration
     ✓ allows admin to modify user roles and creates audit trail entry
   ✓ Mesh Communication Simulator Routing & Deduplication
     ✓ calculates neighbors correctly within signal range
     ✓ successfully forwards packets, deduplicates seen messages, and reaches gateway
     ✓ blocks transmission when Airplane Mode is active
   ✓ Multilingual Localization (EN / TA / HI)
     ✓ contains comprehensive pre-reviewed safety instructions in Tamil and Hindi

 Test Files  1 passed (1)
      Tests  9 passed (9)
```
Production bundle compiled successfully via `tsc && vite build` in `22.22s`.

---

## 7. Disclaimer

SAROS is an academic prototype developed for **Product Development Lab III (24AI511)** at R.M.K. College of Engineering and Technology. It is intended for simulation and proof-of-concept evaluation and does not replace official national emergency response services (such as ERSS-112 or NDMA).
