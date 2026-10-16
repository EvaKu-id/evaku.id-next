import { PALETTE } from "@/lib/palette";

const NODES = {
  hub: [60, 110],
  a: [190, 50],
  b: [200, 170],
  c: [330, 110],
  v1: [330, 30],
  v2: [470, 110],
  v3: [330, 200],
} as const;

type NodeKey = keyof typeof NODES;
const EDGES: [NodeKey, NodeKey, 0 | 1 | 2][] = [
  ["hub", "a", 0], ["hub", "b", 0], ["a", "v1", 0], ["a", "c", 1], ["b", "c", 2], ["c", "v2", 2], ["b", "v3", 0],
];
const COLORS = { 0: PALETTE.statusSafe, 1: PALETTE.statusLimited, 2: PALETTE.statusCut } as const;

export function IsolationDiagram() {
  return (
    <svg viewBox="0 0 540 240" className="w-full" role="img" aria-label="Graf jalan dari posko ke tiga desa: satu terjangkau, satu hanya truk, satu terputus">
      {EDGES.map(([from, to, status]) => (
        <g key={`${from}-${to}`}>
          <line x1={NODES[from][0]} y1={NODES[from][1]} x2={NODES[to][0]} y2={NODES[to][1]} stroke={COLORS[status]} strokeWidth="5" strokeLinecap="round" />
          {status === 2 ? <line x1={NODES[from][0]} y1={NODES[from][1]} x2={NODES[to][0]} y2={NODES[to][1]} stroke="var(--surface)" strokeWidth="1.8" strokeDasharray="5 5" /> : null}
        </g>
      ))}
      {(["a", "b", "c"] as const).map((key) => (
        <circle key={key} cx={NODES[key][0]} cy={NODES[key][1]} r="5" fill="var(--surface)" stroke={PALETTE.muted} strokeWidth="2" />
      ))}
      <rect x={NODES.hub[0] - 14} y={NODES.hub[1] - 14} width="28" height="28" rx="6" fill={PALETTE.ink} />
      <text x={NODES.hub[0]} y={NODES.hub[1] + 32} textAnchor="middle" fontSize="12" fontWeight="600" fill={PALETTE.ink}>Posko</text>
      {[
        { key: "v1" as const, label: "Terjangkau", color: PALETTE.statusSafe },
        { key: "v3" as const, label: "Terjangkau", color: PALETTE.statusSafe },
        { key: "v2" as const, label: "Terisolasi total", color: PALETTE.statusCut },
      ].map(({ key, label, color }) => (
        <g key={key}>
          <circle cx={NODES[key][0]} cy={NODES[key][1]} r="13" fill={`${color}33`} stroke={color} strokeWidth="2.5" />
          <text x={NODES[key][0]} y={NODES[key][1] + (key === "v1" ? -20 : 30)} textAnchor="middle" fontSize="12" fontWeight="600" fill={PALETTE.ink}>{label}</text>
        </g>
      ))}
      <text x="268" y="96" fontSize="10" fill={PALETTE.statusLimited}>hanya truk</text>
    </svg>
  );
}
