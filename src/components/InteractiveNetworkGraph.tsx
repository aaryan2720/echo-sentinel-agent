import { useCallback, useState } from 'react';
import ReactFlow, {
  Node,
  Edge,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  ConnectionMode,
  Panel,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { Badge } from './ui/badge';
import { Card } from './ui/card';
import { AlertCircle, Users, TrendingUp } from 'lucide-react';

interface NetworkNodeData {
  label: string;
  type: 'bot' | 'human' | 'suspicious' | 'central';
  posts: number;
  followers: number;
  threat: 'critical' | 'high' | 'medium' | 'low';
}

const nodeTypes = {
  custom: ({ data }: { data: NetworkNodeData }) => {
    const getNodeColor = () => {
      if (data.type === 'central') return 'bg-destructive/20 border-destructive';
      if (data.type === 'bot') return 'bg-warning/20 border-warning';
      if (data.type === 'suspicious') return 'bg-accent/20 border-accent';
      return 'bg-primary/20 border-primary';
    };

    const getIcon = () => {
      if (data.type === 'central') return AlertCircle;
      if (data.threat === 'critical') return TrendingUp;
      return Users;
    };

    const Icon = getIcon();

    return (
      <div className={`px-4 py-3 rounded-lg border-2 ${getNodeColor()} backdrop-blur-sm cursor-pointer hover:scale-110 transition-transform shadow-lg`}>
        <div className="flex items-center gap-2">
          <Icon className="w-4 h-4" />
          <span className="text-xs font-mono font-bold">{data.label}</span>
        </div>
        {data.posts && (
          <div className="text-[10px] text-muted-foreground mt-1 font-mono">
            {data.posts} posts • {data.followers} followers
          </div>
        )}
      </div>
    );
  },
};

export const InteractiveNetworkGraph = () => {
  const [selectedNode, setSelectedNode] = useState<Node<NetworkNodeData> | null>(null);

  // Generate network data
  const generateNodes = (): Node<NetworkNodeData>[] => {
    const nodes: Node<NetworkNodeData>[] = [];
    
    // Central node (main bot account)
    nodes.push({
      id: 'central',
      type: 'custom',
      position: { x: 400, y: 250 },
      data: {
        label: '@propaganda_hub',
        type: 'central',
        posts: 3421,
        followers: 234000,
        threat: 'critical',
      },
    });

    // Bot cluster 1 (political bots)
    const cluster1Positions = [
      { x: 200, y: 100 }, { x: 150, y: 200 }, { x: 180, y: 300 },
    ];
    cluster1Positions.forEach((pos, idx) => {
      nodes.push({
        id: `bot1-${idx}`,
        type: 'custom',
        position: pos,
        data: {
          label: `@bot_${1000 + idx}`,
          type: 'bot',
          posts: 100 + idx * 50,
          followers: 5000 + idx * 1000,
          threat: 'high',
        },
      });
    });

    // Bot cluster 2 (amplifiers)
    const cluster2Positions = [
      { x: 600, y: 100 }, { x: 650, y: 200 }, { x: 620, y: 320 }, { x: 700, y: 250 },
    ];
    cluster2Positions.forEach((pos, idx) => {
      nodes.push({
        id: `bot2-${idx}`,
        type: 'custom',
        position: pos,
        data: {
          label: `@echo_${2000 + idx}`,
          type: 'bot',
          posts: 80 + idx * 40,
          followers: 3000 + idx * 800,
          threat: 'high',
        },
      });
    });

    // Suspicious accounts
    const suspiciousPositions = [
      { x: 300, y: 450 }, { x: 500, y: 450 }, { x: 400, y: 500 },
    ];
    suspiciousPositions.forEach((pos, idx) => {
      nodes.push({
        id: `sus-${idx}`,
        type: 'custom',
        position: pos,
        data: {
          label: `@user_${idx}`,
          type: 'suspicious',
          posts: 50 + idx * 20,
          followers: 2000 + idx * 500,
          threat: 'medium',
        },
      });
    });

    // Human accounts (legitimate)
    const humanPositions = [
      { x: 250, y: 400 }, { x: 550, y: 400 },
    ];
    humanPositions.forEach((pos, idx) => {
      nodes.push({
        id: `human-${idx}`,
        type: 'custom',
        position: pos,
        data: {
          label: `@verified_${idx}`,
          type: 'human',
          posts: 30,
          followers: 10000 + idx * 5000,
          threat: 'low',
        },
      });
    });

    return nodes;
  };

  const generateEdges = (): Edge[] => {
    const edges: Edge[] = [];

    // Connect central node to clusters
    ['bot1-0', 'bot1-1', 'bot1-2'].forEach(id => {
      edges.push({
        id: `central-${id}`,
        source: 'central',
        target: id,
        animated: true,
        style: { stroke: 'hsl(0 85% 60%)', strokeWidth: 2 },
      });
    });

    ['bot2-0', 'bot2-1', 'bot2-2', 'bot2-3'].forEach(id => {
      edges.push({
        id: `central-${id}`,
        source: 'central',
        target: id,
        animated: true,
        style: { stroke: 'hsl(0 85% 60%)', strokeWidth: 2 },
      });
    });

    // Connect bots to suspicious accounts
    ['sus-0', 'sus-1', 'sus-2'].forEach((id, idx) => {
      edges.push({
        id: `bot-${id}`,
        source: `bot1-${idx % 3}`,
        target: id,
        style: { stroke: 'hsl(30 100% 55%)', strokeWidth: 1 },
      });
    });

    // Connect suspicious to human accounts
    edges.push({
      id: 'sus-human-0',
      source: 'sus-0',
      target: 'human-0',
      style: { stroke: 'hsl(180 100% 50% / 0.5)', strokeWidth: 1 },
    });

    edges.push({
      id: 'sus-human-1',
      source: 'sus-1',
      target: 'human-1',
      style: { stroke: 'hsl(180 100% 50% / 0.5)', strokeWidth: 1 },
    });

    return edges;
  };

  const [nodes, setNodes, onNodesChange] = useNodesState(generateNodes());
  const [edges, setEdges, onEdgesChange] = useEdgesState(generateEdges());

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const onNodeClick = useCallback((_: React.MouseEvent, node: Node<NetworkNodeData>) => {
    setSelectedNode(node);
  }, []);

  return (
    <div className="h-[600px] w-full rounded-lg border border-border bg-background/30 relative">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={onNodeClick}
        nodeTypes={nodeTypes}
        connectionMode={ConnectionMode.Loose}
        fitView
        className="rounded-lg"
      >
        <Background />
        <Controls className="bg-card border border-border rounded-lg" />
        
        <Panel position="top-left" className="bg-transparent">
          <Card className="p-3 bg-card/95 backdrop-blur-sm border-primary/20">
            <div className="space-y-2 text-xs font-mono">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-destructive/60" />
                <span>Central Node (High Threat)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-warning/60" />
                <span>Bot Account</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-accent/60" />
                <span>Suspicious</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-primary/60" />
                <span>Human (Verified)</span>
              </div>
            </div>
          </Card>
        </Panel>

        <Panel position="top-right" className="bg-transparent">
          <Card className="p-3 bg-card/95 backdrop-blur-sm border-primary/20">
            <div className="text-xs font-mono space-y-1">
              <div className="font-bold text-primary">Network Stats</div>
              <div>Total Nodes: {nodes.length}</div>
              <div>Connections: {edges.length}</div>
              <div>Bots Detected: {nodes.filter(n => n.data.type === 'bot').length}</div>
              <div className="text-destructive font-bold mt-2">⚠️ Coordinated Activity</div>
            </div>
          </Card>
        </Panel>
      </ReactFlow>

      {/* Node Details Sidebar */}
      {selectedNode && (
        <div className="absolute right-4 bottom-4 w-80 animate-slide-in-right">
          <Card className="p-4 bg-card/95 backdrop-blur-sm border-primary/20">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-foreground font-mono">Account Details</h3>
              <Badge variant={selectedNode.data.threat === 'critical' ? 'destructive' : 'default'}>
                {selectedNode.data.threat}
              </Badge>
            </div>
            
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground font-mono">Username:</span>
                <span className="font-mono font-bold">{selectedNode.data.label}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground font-mono">Type:</span>
                <span className="font-mono capitalize">{selectedNode.data.type}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground font-mono">Posts:</span>
                <span className="font-mono">{selectedNode.data.posts}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground font-mono">Followers:</span>
                <span className="font-mono">{selectedNode.data.followers?.toLocaleString()}</span>
              </div>
              
              {selectedNode.data.type === 'bot' && (
                <div className="mt-3 p-2 bg-destructive/10 rounded border border-destructive/30">
                  <p className="text-xs text-destructive font-mono">
                    <AlertCircle className="w-3 h-3 inline mr-1" />
                    Bot behavior detected: Synchronized posting pattern
                  </p>
                </div>
              )}
              
              {selectedNode.data.type === 'central' && (
                <div className="mt-3 p-2 bg-destructive/10 rounded border border-destructive/30">
                  <p className="text-xs text-destructive font-mono">
                    <AlertCircle className="w-3 h-3 inline mr-1" />
                    Central node: Controls {edges.filter(e => e.source === selectedNode.id).length} connected accounts
                  </p>
                </div>
              )}
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};
