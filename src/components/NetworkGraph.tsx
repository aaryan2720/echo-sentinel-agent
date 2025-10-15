import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Network } from "lucide-react";

export const NetworkGraph = () => {
  const nodes = [
    { id: 1, x: 50, y: 50, size: 12, connections: 8, threat: "high" },
    { id: 2, x: 150, y: 80, size: 8, connections: 5, threat: "medium" },
    { id: 3, x: 120, y: 150, size: 10, connections: 6, threat: "high" },
    { id: 4, x: 200, y: 120, size: 6, connections: 3, threat: "low" },
    { id: 5, x: 250, y: 60, size: 9, connections: 4, threat: "medium" },
    { id: 6, x: 80, y: 200, size: 7, connections: 4, threat: "medium" },
    { id: 7, x: 220, y: 200, size: 8, connections: 5, threat: "high" },
  ];

  const connections = [
    { from: 1, to: 2 },
    { from: 1, to: 3 },
    { from: 2, to: 5 },
    { from: 3, to: 6 },
    { from: 3, to: 7 },
    { from: 4, to: 5 },
    { from: 5, to: 7 },
  ];

  const getThreatColor = (threat: string) => {
    switch (threat) {
      case "high":
        return "hsl(0 85% 60%)";
      case "medium":
        return "hsl(30 100% 55%)";
      default:
        return "hsl(145 80% 50%)";
    }
  };

  return (
    <Card className="p-6 bg-card/50 backdrop-blur-sm border-primary/20">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Network className="w-5 h-5 text-primary" />
            <h2 className="text-xl font-bold text-primary font-mono">
              Coordinated Network Map
            </h2>
          </div>
          <Badge variant="outline" className="font-mono">
            234 Networks Detected
          </Badge>
        </div>

        <div className="relative h-64 bg-background/30 rounded-lg border border-border p-4 overflow-hidden">
          {/* SVG for connections */}
          <svg className="absolute inset-0 w-full h-full" style={{ zIndex: 1 }}>
            {connections.map((conn, idx) => {
              const from = nodes.find((n) => n.id === conn.from);
              const to = nodes.find((n) => n.id === conn.to);
              if (!from || !to) return null;
              
              return (
                <line
                  key={idx}
                  x1={from.x}
                  y1={from.y}
                  x2={to.x}
                  y2={to.y}
                  stroke="hsl(180 100% 50% / 0.2)"
                  strokeWidth="1"
                  className="animate-pulse"
                />
              );
            })}
          </svg>

          {/* Nodes */}
          {nodes.map((node, idx) => (
            <div
              key={node.id}
              className="absolute rounded-full animate-pulse-glow cursor-pointer group"
              style={{
                left: node.x,
                top: node.y,
                width: node.size * 4,
                height: node.size * 4,
                backgroundColor: getThreatColor(node.threat),
                boxShadow: `0 0 ${node.size * 2}px ${getThreatColor(node.threat)}`,
                transform: 'translate(-50%, -50%)',
                zIndex: 2,
                animationDelay: `${idx * 0.2}s`,
              }}
            >
              <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-popover px-2 py-1 rounded text-xs whitespace-nowrap font-mono">
                {node.connections} connections
              </div>
            </div>
          ))}

          {/* Ambient glow effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-accent/5 animate-pulse" />
        </div>

        <div className="flex gap-4 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-destructive" />
            <span className="text-muted-foreground font-mono">High Threat</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-warning" />
            <span className="text-muted-foreground font-mono">Medium</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-success" />
            <span className="text-muted-foreground font-mono">Low</span>
          </div>
        </div>
      </div>
    </Card>
  );
};
