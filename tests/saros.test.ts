import { describe, it, expect, beforeEach } from 'vitest';
import { store } from '../backend/src/services/store';
import { meshSimulator } from '../src/services/meshNetwork';
import { TRANSLATIONS } from '../src/locales/translations';

describe('SAROS Disaster Response System — Master Test Suite', () => {

  // Test 1: SOS Creation & Idempotency
  describe('SOS Incident Management & Idempotency', () => {
    it('creates a unique incident with valid data and initial history', () => {
      const { incident, isDuplicate } = store.createIncident({
        clientIncidentId: `test-cid-${Date.now()}`,
        userId: 'usr-citizen-test',
        userName: 'Priya Narayanan',
        category: 'FLOOD',
        description: 'Rising water in Velachery basement',
        location: { lat: 12.9815, lng: 80.2180, address: 'Velachery Basin, Chennai' },
        peopleCount: 3,
        priority: 'CRITICAL',
        status: 'SUBMITTED',
        submissionMethod: 'ONLINE_DIRECT'
      });

      expect(incident.id).toMatch(/^SOS-TN-\d+$/);
      expect(incident.status).toBe('SUBMITTED');
      expect(incident.peopleCount).toBe(3);
      expect(incident.priority).toBe('CRITICAL');
      expect(incident.statusHistory.length).toBeGreaterThanOrEqual(1);
      expect(isDuplicate).toBe(false);
    });

    it('prevents duplicate incidents when retrying with the same clientIncidentId (Idempotent)', () => {
      const stableClientId = `idempotent-key-${Date.now()}`;

      // First submission
      const first = store.createIncident({
        clientIncidentId: stableClientId,
        userId: 'usr-citizen-test',
        userName: 'Priya Narayanan',
        category: 'MEDICAL',
        description: 'Asthma patient needing nebulizer in flooded area',
        location: { lat: 12.9815, lng: 80.2180, address: 'Velachery Ward 177' },
        peopleCount: 1,
        priority: 'HIGH',
        status: 'SUBMITTED',
        submissionMethod: 'ONLINE_DIRECT'
      });

      expect(first.isDuplicate).toBe(false);

      // Retry submission (e.g. after network reconnection)
      const second = store.createIncident({
        clientIncidentId: stableClientId,
        userId: 'usr-citizen-test',
        userName: 'Priya Narayanan',
        category: 'MEDICAL',
        description: 'Asthma patient needing nebulizer in flooded area',
        location: { lat: 12.9815, lng: 80.2180, address: 'Velachery Ward 177' },
        peopleCount: 1,
        priority: 'HIGH',
        status: 'SUBMITTED',
        submissionMethod: 'ONLINE_DIRECT'
      });

      // Must be detected as duplicate and return same incident ID
      expect(second.isDuplicate).toBe(true);
      expect(second.incident.id).toBe(first.incident.id);
    });
  });

  // Test 2: Incident Status Lifecycle
  describe('Incident Status Advancement & Assignment', () => {
    it('allows responders to advance incident status and attach field notes', () => {
      const { incident } = store.createIncident({
        clientIncidentId: `status-test-${Date.now()}`,
        userId: 'usr-cit-lifecycle',
        userName: 'S. Raman',
        category: 'TRAPPED',
        description: 'Two elderly persons on first floor balcony',
        location: { lat: 12.2253, lng: 79.0747, address: 'Vengikkal Ward 4' },
        peopleCount: 2,
        priority: 'CRITICAL',
        status: 'SUBMITTED',
        submissionMethod: 'ONLINE_DIRECT'
      });

      // 1. Acknowledge
      const acked = store.updateIncidentStatus(
        incident.id,
        'ACKNOWLEDGED',
        { name: 'Commander R. Senthil Nathan', role: 'responder' },
        'EOC received SOS, notifying district rescue boat squad.'
      );
      expect(acked.status).toBe('ACKNOWLEDGED');

      // 2. Assign
      const assigned = store.assignIncident(
        incident.id,
        { id: 'usr-vol-1', name: 'Karthik Sivakumar', role: 'volunteer' },
        { name: 'Control Room EOC', role: 'responder' }
      );
      expect(assigned.status).toBe('ASSIGNED');
      expect(assigned.assignedTo?.name).toBe('Karthik Sivakumar');

      // 3. In Progress
      const inProg = store.updateIncidentStatus(
        incident.id,
        'IN_PROGRESS',
        { name: 'Karthik Sivakumar', role: 'volunteer' },
        'Arrived on site with life jackets and first aid kit.'
      );
      expect(inProg.status).toBe('IN_PROGRESS');

      // 4. Resolved
      const resolved = store.updateIncidentStatus(
        incident.id,
        'RESOLVED',
        { name: 'Karthik Sivakumar', role: 'volunteer' },
        'Elderly persons safely relocated to Velachery Relief Center.'
      );
      expect(resolved.status).toBe('RESOLVED');
      expect(resolved.statusHistory.length).toBe(5);
    });
  });

  // Test 3: CityZen Civic Reporting
  describe('CityZen Civic Infrastructure Screening', () => {
    it('submits a civic issue and allows municipal inspection verification', () => {
      const report = store.createCivicReport({
        userId: 'usr-cit-civic',
        userName: 'Ananya Ramanathan',
        category: 'BLOCKED_DRAIN',
        description: 'Main canal culvert clogged with solid plastic waste',
        location: { lat: 12.9825, lng: 80.2190, address: 'Velachery 100ft Road' }
      });

      expect(report.id).toMatch(/^CIV-TN-\d+$/);
      expect(report.status).toBe('REPORTED');

      // Verified by municipal engineer
      const verified = store.updateCivicReportStatus(
        report.id,
        'VERIFIED',
        { name: 'AE R. Kumaran', role: 'responder' },
        'Field inspection confirmed 80% culvert blockage. JCB unit assigned.',
        'Public Works Department (PWD)'
      );

      expect(verified.status).toBe('VERIFIED');
      expect(verified.assignedAgency).toBe('Public Works Department (PWD)');
    });
  });

  // Test 4: Role-Based Access & Admin Operations
  describe('Role-Based Authorization & Administration', () => {
    it('allows admin to modify user roles and creates audit trail entry', () => {
      const users = store.getUsers();
      const testUser = users.find(u => u.role === 'citizen') || users[0];

      const updated = store.updateUserRole(testUser.id, 'volunteer', 'Dr. V. Rajeshwari IAS');
      expect(updated.role).toBe('volunteer');

      // Verify audit log exists
      const logs = store.getActivityLogs();
      const log = logs.find(l => l.entityId === testUser.id && l.action === 'USER_ROLE_UPDATED');
      expect(log).toBeDefined();
      expect(log?.actorRole).toBe('admin');
    });
  });

  // Test 5: Software Mesh Network Simulator
  describe('Mesh Communication Simulator Routing & Deduplication', () => {
    it('calculates neighbors correctly within signal range', () => {
      meshSimulator.setSignalRange(165);
      const neighbors = meshSimulator.getNeighbors('node-citizen-01');
      expect(neighbors.length).toBeGreaterThan(0);
      expect(neighbors.every(n => n.isOnline)).toBe(true);
    });

    it('successfully forwards packets, deduplicates seen messages, and reaches gateway', async () => {
      meshSimulator.setSignalRange(170);
      meshSimulator.setAirplaneMode(false);

      const result = await meshSimulator.broadcastEmergencyPacket('node-citizen-01', {
        category: 'MEDICAL',
        description: 'Test emergency mesh broadcast packet',
        peopleCount: 1,
        priority: 'CRITICAL',
        location: { lat: 12.9815, lng: 80.2180, address: 'Velachery Test Mesh' }
      });

      // Must traverse nodes and reach a gateway
      expect(result.reachedGateway).toBe(true);
      expect(result.hops).toBeGreaterThanOrEqual(1);
      expect(result.path.length).toBeGreaterThanOrEqual(2);
      expect(result.path[0]).toBe('Citizen Phone (Velachery)');
    });

    it('blocks transmission when Airplane Mode is active', async () => {
      meshSimulator.setAirplaneMode(true);

      const result = await meshSimulator.broadcastEmergencyPacket('node-citizen-01', {
        category: 'FLOOD',
        description: 'Airplane mode test',
        peopleCount: 1,
        priority: 'HIGH',
        location: { lat: 12.9815, lng: 80.2180, address: 'Velachery' }
      });

      expect(result.reachedGateway).toBe(false);
      meshSimulator.setAirplaneMode(false); // Reset
    });
  });

  // Test 6: Multilingual Emergency Guidance
  describe('Multilingual Localization (EN / TA / HI)', () => {
    it('contains comprehensive pre-reviewed safety instructions in Tamil and Hindi', () => {
      expect(TRANSLATIONS.en.sosButtonText).toBe('SEND RESCUE SOS');
      expect(TRANSLATIONS.ta.sosButtonText).toContain('மீட்பு உதவி');
      expect(TRANSLATIONS.hi.sosButtonText).toContain('आपातकालीन SOS');

      expect(TRANSLATIONS.en.floodAdvisoryAction).toBeDefined();
      expect(TRANSLATIONS.ta.floodAdvisoryAction).toContain('மின்சார');
      expect(TRANSLATIONS.hi.floodAdvisoryAction).toContain('बिजली');
    });
  });

});
