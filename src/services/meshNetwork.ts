import { MeshNode, MeshPacket } from '../types';
import { api } from './api';

export interface RoutingLogEntry {
  id: string;
  timestamp: string;
  timeFormatted: string;
  message: string;
  type: 'info' | 'hop' | 'gateway' | 'dedup' | 'dropped';
}

export const INITIAL_MESH_NODES: MeshNode[] = [
  {
    id: 'node-citizen-01',
    name: 'Citizen Phone (Velachery)',
    type: 'citizen',
    deviceModel: 'REDMI NOTE 12 (BLE 5.2)',
    x: 100,
    y: 220,
    isOnline: true,
    batteryLevel: 68,
    queueCount: 0,
    language: 'Tamil (தமிழ்)',
    uplinkCapability: 'None (BLE Mesh)',
    processedPacketIds: new Set()
  },
  {
    id: 'node-relay-01',
    name: 'Relay Phone',
    type: 'citizen',
    deviceModel: 'SAMSUNG GALAXY M34',
    x: 230,
    y: 150,
    isOnline: true,
    batteryLevel: 82,
    queueCount: 0,
    language: 'Tamil (தமிழ்)',
    uplinkCapability: 'None (BLE Mesh)',
    processedPacketIds: new Set()
  },
  {
    id: 'node-cit-02',
    name: 'Citizen Phone (Adyar)',
    type: 'citizen',
    deviceModel: 'REALME 11 PRO',
    x: 230,
    y: 320,
    isOnline: true,
    batteryLevel: 54,
    queueCount: 0,
    language: 'English',
    uplinkCapability: 'None (BLE Mesh)',
    processedPacketIds: new Set()
  },
  {
    id: 'node-ndrf-01',
    name: 'NDRF Responder Handset',
    type: 'responder',
    deviceModel: 'RUGGED KYOCERA DURAFORCE',
    x: 370,
    y: 170,
    isOnline: true,
    batteryLevel: 91,
    queueCount: 0,
    language: 'English / Tamil',
    uplinkCapability: 'None (BLE Mesh)',
    processedPacketIds: new Set()
  },
  {
    id: 'node-vol-01',
    name: 'Volunteer Relay (TNDVF)',
    type: 'volunteer',
    deviceModel: 'ONEPLUS NORD CE 3',
    x: 380,
    y: 310,
    isOnline: true,
    batteryLevel: 75,
    queueCount: 0,
    language: 'Tamil (தமிழ்)',
    uplinkCapability: 'None (BLE Mesh)',
    processedPacketIds: new Set()
  },
  {
    id: 'node-vol-02',
    name: 'Relay Volunteer',
    type: 'volunteer',
    deviceModel: 'MOTOROLA G84 5G',
    x: 360,
    y: 430,
    isOnline: true,
    batteryLevel: 63,
    queueCount: 0,
    language: 'Tamil (தமிழ்)',
    uplinkCapability: 'None (BLE Mesh)',
    processedPacketIds: new Set()
  },
  {
    id: 'node-scout-01',
    name: 'Civil Defence Scout Phone',
    type: 'volunteer',
    deviceModel: 'VIVO T2X 5G',
    x: 500,
    y: 180,
    isOnline: true,
    batteryLevel: 79,
    queueCount: 0,
    language: 'Hindi / Tamil',
    uplinkCapability: 'None (BLE Mesh)',
    processedPacketIds: new Set()
  },
  {
    id: 'node-cit-03',
    name: 'Citizen Phone',
    type: 'citizen',
    deviceModel: 'POCO M6 PRO',
    x: 520,
    y: 300,
    isOnline: true,
    batteryLevel: 41,
    queueCount: 0,
    language: 'Tamil (தமிழ்)',
    uplinkCapability: 'None (BLE Mesh)',
    processedPacketIds: new Set()
  },
  {
    id: 'node-gw-01',
    name: 'District Gateway Tower #1',
    type: 'gateway',
    deviceModel: 'SAROS EOC IOT GATEWAY GW-TN-01',
    x: 670,
    y: 190,
    isOnline: true,
    batteryLevel: 100,
    queueCount: 0,
    language: 'System EOC English',
    uplinkCapability: 'Satellite / Fiber Backbone',
    processedPacketIds: new Set()
  },
  {
    id: 'node-gw-02',
    name: 'District Gateway Station #2',
    type: 'gateway',
    deviceModel: 'DISTRICT COLLECTORATE STATION',
    x: 680,
    y: 340,
    isOnline: true,
    batteryLevel: 100,
    queueCount: 0,
    language: 'System EOC English',
    uplinkCapability: 'Cellular / Wi-Fi',
    processedPacketIds: new Set()
  }
];

export class MeshNetworkSimulator {
  nodes: MeshNode[];
  signalRange: number = 165; // pixels
  isAirplaneMode: boolean = false;
  batterySaver: boolean = false;
  logs: RoutingLogEntry[] = [];
  dedupCount: number = 12;
  activePackets: MeshPacket[] = [];
  private listeners: Array<() => void> = [];

  constructor() {
    this.nodes = INITIAL_MESH_NODES.map(n => ({
      ...n,
      processedPacketIds: new Set()
    }));
    this.addLog('SAROS Mesh Layer initialized. 10 nodes synchronized across Bluetooth LE 5.2 / Wi-Fi Aware ad-hoc topology.', 'info');
    this.addLog('Gateway GW-TN-01 connected to Fiber/Starlink backbone (EOC uplink ready).', 'gateway');
  }

  subscribe(listener: () => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notify() {
    this.listeners.forEach(l => l());
  }

  addLog(message: string, type: RoutingLogEntry['type']) {
    const now = new Date();
    const timeFormatted = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    this.logs.unshift({
      id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      timestamp: now.toISOString(),
      timeFormatted,
      message,
      type
    });
    if (this.logs.length > 50) this.logs.pop();
    this.notify();
  }

  updateNodePosition(id: string, x: number, y: number) {
    const node = this.nodes.find(n => n.id === id);
    if (node) {
      node.x = x;
      node.y = y;
      this.notify();
    }
  }

  toggleNodeOnline(id: string) {
    const node = this.nodes.find(n => n.id === id);
    if (node) {
      node.isOnline = !node.isOnline;
      this.addLog(`Node '${node.name}' status toggled to ${node.isOnline ? 'ONLINE' : 'OFFLINE (Disconnected)'}`, 'info');
      this.notify();
    }
  }

  setSignalRange(range: number) {
    this.signalRange = range;
    this.notify();
  }

  setAirplaneMode(airplane: boolean) {
    this.isAirplaneMode = airplane;
    if (airplane) {
      this.addLog('Airplane mode activated on source device. All BLE and Wi-Fi transmissions paused.', 'dropped');
    } else {
      this.addLog('Airplane mode deactivated. Radio receivers active.', 'info');
    }
    this.notify();
  }

  setBatterySaver(saver: boolean) {
    this.batterySaver = saver;
    this.notify();
  }

  getNeighbors(nodeId: string): MeshNode[] {
    const origin = this.nodes.find(n => n.id === nodeId);
    if (!origin || !origin.isOnline) return [];

    return this.nodes.filter(target => {
      if (target.id === nodeId || !target.isOnline) return false;
      const dx = target.x - origin.x;
      const dy = target.y - origin.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      return dist <= this.signalRange;
    });
  }

  // Multi-hop packet flooding simulation
  async broadcastEmergencyPacket(originNodeId: string, payload: {
    category: string;
    description: string;
    peopleCount: number;
    priority: string;
    location: { lat: number; lng: number; address: string };
  }): Promise<{ reachedGateway: boolean; hops: number; path: string[] }> {
    if (this.isAirplaneMode) {
      this.addLog('Transmission blocked: Airplane Mode is active!', 'dropped');
      return { reachedGateway: false, hops: 0, path: [] };
    }

    const origin = this.nodes.find(n => n.id === originNodeId);
    if (!origin || !origin.isOnline) {
      this.addLog(`Origin node '${origin?.name || originNodeId}' is offline or disconnected!`, 'dropped');
      return { reachedGateway: false, hops: 0, path: [] };
    }

    const packetId = `PKT-TN-${Date.now().toString(36).toUpperCase()}`;
    const packet: MeshPacket = {
      id: packetId,
      sourceNodeId: originNodeId,
      incidentData: {
        category: payload.category as any,
        description: payload.description,
        peopleCount: payload.peopleCount,
        priority: payload.priority as any,
        location: payload.location,
        submissionMethod: 'MESH_RELAY'
      },
      hopsRemaining: 7, // Max TTL
      path: [origin.name],
      timestamp: new Date().toISOString(),
      deliveredToGateway: false
    };

    origin.processedPacketIds.add(packetId);
    this.addLog(`[TX] Origin '${origin.name}' initiated SOS packet ${packetId} (TTL=7, Prio=${payload.priority})`, 'hop');

    // Breadth-first / step-by-step flooding
    let currentWave: { node: MeshNode; hopsLeft: number; currentPath: string[] }[] = [
      { node: origin, hopsLeft: 7, currentPath: [origin.name] }
    ];

    let reachedGateway = false;
    let finalPath: string[] = [origin.name];
    let totalHops = 0;

    while (currentWave.length > 0 && !reachedGateway) {
      const nextWave: { node: MeshNode; hopsLeft: number; currentPath: string[] }[] = [];

      for (const item of currentWave) {
        if (item.hopsLeft <= 0) {
          this.addLog(`Packet ${packetId} TTL expired at node '${item.node.name}'. Dropped.`, 'dropped');
          continue;
        }

        const neighbors = this.getNeighbors(item.node.id);

        for (const neighbor of neighbors) {
          // Duplicate suppression
          if (neighbor.processedPacketIds.has(packetId)) {
            this.dedupCount += 1;
            this.addLog(`Duplicate packet ${packetId} suppressed by '${neighbor.name}' (Already seen)`, 'dedup');
            continue;
          }

          neighbor.processedPacketIds.add(packetId);
          const newPath = [...item.currentPath, neighbor.name];
          const newHopsLeft = item.hopsLeft - 1;

          this.addLog(
            `[RELAY] Hop from '${item.node.name}' -> '${neighbor.name}' (TTL=${newHopsLeft})`,
            'hop'
          );

          if (neighbor.type === 'gateway') {
            reachedGateway = true;
            finalPath = newPath;
            totalHops = newPath.length - 1;
            this.addLog(
              `[GATEWAY UPLINK] Packet ${packetId} reached '${neighbor.name}' in ${totalHops} hops! Ingesting to SAROS EOC Central Database...`,
              'gateway'
            );

            // Ingest to live backend database via Gateway
            try {
              await api.createIncident({
                clientIncidentId: packetId,
                category: payload.category,
                description: `[Relayed via SAROS Mesh Network - ${totalHops} hops] ${payload.description}`,
                location: payload.location,
                peopleCount: payload.peopleCount,
                priority: payload.priority,
                submissionMethod: 'MESH_RELAY',
                meshHops: totalHops,
                userName: `Mesh Citizen (${origin.deviceModel})`
              });
              this.addLog(`[SERVER CONFIRMED] Gateway successfully committed incident ${packetId} to Central EOC database!`, 'gateway');
            } catch (err: any) {
              console.error('[Mesh Gateway Ingestion Error]:', err);
            }

            break;
          }

          nextWave.push({ node: neighbor, hopsLeft: newHopsLeft, currentPath: newPath });
        }

        if (reachedGateway) break;
      }

      currentWave = nextWave;
      this.notify();
    }

    if (!reachedGateway) {
      this.addLog(`[ISOLATED] Packet ${packetId} failed to reach any Gateway tower. Mesh path broken or nodes out of signal range.`, 'dropped');
    }

    this.notify();
    return { reachedGateway, hops: totalHops, path: finalPath };
  }
}

export const meshSimulator = new MeshNetworkSimulator();
