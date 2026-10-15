import React, { useState, useEffect, useRef } from 'react';
import { 
  Radio, Wifi, WifiOff, Battery, ShieldAlert, 
  Send, RefreshCw, Terminal, Layers, Info, CheckCircle2, AlertTriangle, ArrowRight 
} from 'lucide-react';
import { MeshNode } from '../types';
import { meshSimulator, RoutingLogEntry } from '../services/meshNetwork';

export const MeshSimulatorView: React.FC = () => {
  const [nodes, setNodes] = useState<MeshNode[]>(meshSimulator.nodes);
  const [selectedNodeId, setSelectedNodeId] = useState<string>('node-citizen-01');
  const [signalRange, setSignalRange] = useState<number>(meshSimulator.signalRange);
  const [isAirplaneMode, setIsAirplaneMode] = useState<boolean>(meshSimulator.isAirplaneMode);
  const [batterySaver, setBatterySaver] = useState<boolean>(meshSimulator.batterySaver);
  const [logs, setLogs] = useState<RoutingLogEntry[]>(meshSimulator.logs);
  const [dedupCount, setDedupCount] = useState<number>(meshSimulator.dedupCount);
  const [isBroadcasting, setIsBroadcasting] = useState<boolean>(false);
  const [draggingNodeId, setDraggingNodeId] = useState<string | null>(null);

  const svgRef = useRef<SVGSVGElement | null>(null);

  // Sync state with simulator instance
  const updateState = () => {
    setNodes([...meshSimulator.nodes]);
    setLogs([...meshSimulator.logs]);
    setDedupCount(meshSimulator.dedupCount);
  };

  useEffect(() => {
    const unsub = meshSimulator.subscribe(updateState);
    return () => unsub();
  }, []);

  const selectedNode = nodes.find(n => n.id === selectedNodeId) || nodes[0];

  // Dragging logic for nodes
  const handleMouseDown = (nodeId: string) => {
    setSelectedNodeId(nodeId);
    setDraggingNodeId(nodeId);
  };

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!draggingNodeId || !svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    const x = Math.max(40, Math.min(rect.width - 40, e.clientX - rect.left));
    const y = Math.max(40, Math.min(rect.height - 40, e.clientY - rect.top));
    meshSimulator.updateNodePosition(draggingNodeId, x, y);
  };

  const handleMouseUp = () => {
    setDraggingNodeId(null);
  };

  const handleRangeChange = (val: number) => {
    setSignalRange(val);
    meshSimulator.setSignalRange(val);
  };

  const handleToggleAirplane = () => {
    const next = !isAirplaneMode;
    setIsAirplaneMode(next);
    meshSimulator.setAirplaneMode(next);
  };

  const handleToggleSaver = () => {
    const next = !batterySaver;
    setBatterySaver(next);
    meshSimulator.setBatterySaver(next);
  };

  const handleBroadcastSOS = async () => {
    if (isBroadcasting) return;
    setIsBroadcasting(true);

    await meshSimulator.broadcastEmergencyPacket(selectedNode.id, {
      category: 'MEDICAL',
      description: `Emergency rescue broadcast triggered from ${selectedNode.name}`,
      peopleCount: 2,
      priority: 'CRITICAL',
      location: {
        lat: 12.9815,
        lng: 80.2180,
        address: `${selectedNode.name} Mesh Geolocation`
      }
    });

    setIsBroadcasting(false);
  };

  // Calculate links between nodes based on signal range
  const links: Array<{ from: MeshNode; to: MeshNode; active: boolean }> = [];
  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      const a = nodes[i];
      const b = nodes[j];
      const dx = b.x - a.x;
      const dy = b.y - a.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist <= signalRange) {
        links.push({
          from: a,
          to: b,
          active: a.isOnline && b.isOnline && !isAirplaneMode
        });
      }
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-5 space-y-4">
      {/* Title & Metrics Bar (Figure 4.2.2) */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-wrap items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-red-600/20 text-red-400 border border-red-600/40">
            <Radio className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-black tracking-wide text-white">
                SAROS TN-MESH
              </h1>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-teal-500/20 text-teal-300 border border-teal-500/40">
                P2P FLOODING
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Software Ad-Hoc Store-and-Forward Mesh Simulator
            </p>
          </div>
        </div>

        {/* Live Metrics Tiles */}
        <div className="flex items-center gap-3 text-xs">
          <div className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800">
            <span className="text-[10px] text-slate-400 block font-mono">RADIO PROTOCOL</span>
            <span className="font-bold text-teal-400">BLE 5.2 / P2P Flooding</span>
          </div>

          <div className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800">
            <span className="text-[10px] text-slate-400 block font-mono">ESTIMATED LATENCY</span>
            <span className="font-bold text-cyan-400">42ms to Gateway</span>
          </div>

          <div className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800">
            <span className="text-[10px] text-slate-400 block font-mono">OFFLINE CACHE</span>
            <span className="font-bold text-amber-400">Store & Forward Active</span>
          </div>

          <div className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800">
            <span className="text-[10px] text-slate-400 block font-mono">DEDUPLICATION</span>
            <span className="font-bold text-emerald-400">{dedupCount} Deduplicated by ID</span>
          </div>
        </div>
      </div>

      {/* Control Bar: Signal Range slider, Airplane mode, Battery saver */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3 flex flex-wrap items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-3 flex-1 min-w-[260px]">
          <span className="font-bold text-slate-300 whitespace-nowrap">
            Signal Range: <strong className="text-cyan-400">{signalRange}px</strong>
          </span>
          <input
            type="range"
            min={90}
            max={260}
            value={signalRange}
            onChange={(e) => handleRangeChange(parseInt(e.target.value))}
            className="w-full max-w-xs accent-red-500 cursor-pointer"
          />
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleToggleAirplane}
            className={`px-3 py-1.5 rounded-lg font-bold border transition flex items-center gap-1.5 ${
              isAirplaneMode
                ? 'bg-rose-950 text-rose-300 border-rose-600'
                : 'bg-slate-950 text-slate-300 border-slate-800 hover:border-slate-700'
            }`}
          >
            {isAirplaneMode ? <WifiOff className="w-3.5 h-3.5" /> : <Wifi className="w-3.5 h-3.5" />}
            <span>{isAirplaneMode ? '✈️ Airplane Mode ON' : '✈️ Airplane Mode'}</span>
          </button>

          <button
            onClick={handleToggleSaver}
            className={`px-3 py-1.5 rounded-lg font-bold border transition flex items-center gap-1.5 ${
              batterySaver
                ? 'bg-amber-950 text-amber-300 border-amber-600'
                : 'bg-slate-950 text-slate-300 border-slate-800 hover:border-slate-700'
            }`}
          >
            <Battery className="w-3.5 h-3.5" />
            <span>{batterySaver ? '🔋 Saver ON (0.4%/hr)' : '🔋 Saver OFF (1.2%/hr drain)'}</span>
          </button>

          <button
            onClick={handleBroadcastSOS}
            disabled={isBroadcasting}
            className="px-4 py-1.5 rounded-lg font-black text-white bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 shadow-lg shadow-red-950/60 transition flex items-center gap-1.5 disabled:opacity-50"
          >
            <Send className="w-3.5 h-3.5" />
            <span>{isBroadcasting ? 'Broadcasting...' : 'Broadcast SOS Packet'}</span>
          </button>
        </div>
      </div>

      {/* Main Simulation Layout: Topology Canvas (Left) + Inspector & Logs (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Topology Canvas (8 cols) */}
        <div className="lg:col-span-8 bg-slate-950 border border-slate-800 rounded-xl p-3 relative overflow-hidden shadow-2xl flex flex-col justify-between min-h-[460px]">
          <svg
            ref={svgRef}
            className="w-full h-full min-h-[400px] cursor-grab active:cursor-grabbing select-none"
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
            {/* Draw Links between connected nodes */}
            {links.map((link, idx) => (
              <line
                key={`link-${idx}`}
                x1={link.from.x}
                y1={link.from.y}
                x2={link.to.x}
                y2={link.to.y}
                stroke={link.active ? '#0d9488' : '#334155'}
                strokeWidth={link.active ? 1.5 : 1}
                strokeDasharray={link.active ? '4 2' : '2 2'}
                opacity={link.active ? 0.7 : 0.3}
              />
            ))}

            {/* Draw Range Circle for Selected Node */}
            {selectedNode && (
              <circle
                cx={selectedNode.x}
                cy={selectedNode.y}
                r={signalRange}
                fill="rgba(14, 165, 233, 0.04)"
                stroke="rgba(14, 165, 233, 0.4)"
                strokeDasharray="4 4"
              />
            )}

            {/* Draw Nodes */}
            {nodes.map((node) => {
              const isSelected = node.id === selectedNode.id;
              let fill = '#0284c7'; // Citizen blue
              let border = '#38bdf8';
              if (node.type === 'responder') {
                fill = '#0d9488'; // Teal
                border = '#2dd4bf';
              } else if (node.type === 'gateway') {
                fill = '#9333ea'; // Purple
                border = '#c084fc';
              } else if (node.id === 'node-citizen-01') {
                fill = '#e11d48'; // Red origin
                border = '#fb7185';
              }

              if (!node.isOnline) {
                fill = '#475569';
                border = '#64748b';
              }

              return (
                <g
                  key={node.id}
                  transform={`translate(${node.x}, ${node.y})`}
                  onMouseDown={() => handleMouseDown(node.id)}
                  onClick={() => setSelectedNodeId(node.id)}
                  className="cursor-pointer"
                >
                  {/* Pulsing ring if alerting origin */}
                  {node.id === 'node-citizen-01' && node.isOnline && (
                    <circle r="22" fill="none" stroke="#e11d48" strokeWidth="2" className="animate-ping opacity-60" />
                  )}

                  {/* Selection indicator */}
                  {isSelected && (
                    <circle r="19" fill="none" stroke="#38bdf8" strokeWidth="2.5" />
                  )}

                  {/* Main Node Circle */}
                  <circle
                    r="14"
                    fill={fill}
                    stroke={border}
                    strokeWidth="2"
                    className="transition-transform hover:scale-110"
                  />

                  {/* Node icon / label */}
                  <text
                    y="4"
                    textAnchor="middle"
                    fill="#ffffff"
                    fontSize="9"
                    fontWeight="bold"
                    pointerEvents="none"
                  >
                    {node.type === 'gateway' ? 'GW' : node.type === 'responder' ? 'NDRF' : 'P2P'}
                  </text>

                  {/* Node Name Label */}
                  <text
                    y="25"
                    textAnchor="middle"
                    fill={node.isOnline ? '#e2e8f0' : '#64748b'}
                    fontSize="10"
                    fontWeight="600"
                    pointerEvents="none"
                  >
                    {node.name}
                  </text>
                </g>
              );
            })}
          </svg>

          {/* Canvas Footer Legend & Instruction */}
          <div className="flex flex-wrap items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-900 gap-2">
            <span className="flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 text-cyan-400" />
              <span>Drag any node to test range disconnects · Click node to toggle online/offline</span>
            </span>

            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500" /> Alerting Citizen
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-500" /> Citizen / Relay
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-teal-500" /> Responder
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-purple-500" /> Gateway (Internet)
              </span>
            </div>
          </div>
        </div>

        {/* Right Panel: Selected Node Inspector & Routing Logs (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          {/* Selected Node Inspector (Figure 4.2.2) */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-xl space-y-3">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-extrabold text-sm text-slate-100 flex items-center gap-1.5">
                  <span className={`w-2 h-2 rounded-full ${selectedNode.isOnline ? 'bg-teal-400' : 'bg-rose-500'}`} />
                  {selectedNode.name}
                </h3>
                <p className="text-[11px] font-mono text-slate-400 uppercase tracking-wider mt-0.5">
                  {selectedNode.deviceModel}
                </p>
              </div>
              <button
                onClick={() => meshSimulator.toggleNodeOnline(selectedNode.id)}
                className={`px-2 py-1 rounded text-[11px] font-bold border transition ${
                  selectedNode.isOnline
                    ? 'bg-teal-950 text-teal-300 border-teal-700'
                    : 'bg-rose-950 text-rose-300 border-rose-700'
                }`}
              >
                {selectedNode.isOnline ? 'Online' : 'Offline'}
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs pt-1 border-t border-slate-850">
              <div className="p-2 rounded bg-slate-950 border border-slate-850">
                <span className="text-[10px] text-slate-400 block">Battery Level</span>
                <span className="font-bold text-slate-200">{selectedNode.batteryLevel}%</span>
              </div>
              <div className="p-2 rounded bg-slate-950 border border-slate-850">
                <span className="text-[10px] text-slate-400 block">Offline Queue</span>
                <span className="font-bold text-amber-400">{selectedNode.queueCount} packets</span>
              </div>
            </div>

            <div className="text-xs space-y-1 text-slate-300 pt-1">
              <div>
                <span className="text-slate-400">Device Interface Language:</span>{' '}
                <strong className="text-slate-200">{selectedNode.language}</strong>
              </div>
              <div>
                <span className="text-slate-400">Uplink Capability:</span>{' '}
                <strong className="text-cyan-300">{selectedNode.uplinkCapability}</strong>
              </div>
            </div>
          </div>

          {/* Real-time Packet Routing Logs Console (Figure 4.2.2) */}
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-3.5 shadow-xl flex flex-col h-[320px]">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-teal-400" />
                <span className="text-xs font-bold text-slate-200">
                  REAL-TIME PACKET ROUTING LOGS
                </span>
              </div>
              <span className="text-[10px] text-slate-400 font-mono">Flooding / TTL=7</span>
            </div>

            <div className="flex-1 overflow-y-auto space-y-2 pt-2 text-[11px] font-mono scrollbar-thin">
              {logs.length === 0 && (
                <div className="text-slate-500 italic p-2">No packet routing events logged yet.</div>
              )}
              {logs.map((log) => {
                let color = 'text-slate-300';
                if (log.type === 'gateway') color = 'text-teal-400 font-bold';
                if (log.type === 'hop') color = 'text-cyan-300';
                if (log.type === 'dedup') color = 'text-amber-400';
                if (log.type === 'dropped') color = 'text-rose-400';

                return (
                  <div key={log.id} className="leading-relaxed">
                    <span className="text-slate-500 mr-1.5">{log.timeFormatted}</span>
                    <span className={color}>{log.message}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
