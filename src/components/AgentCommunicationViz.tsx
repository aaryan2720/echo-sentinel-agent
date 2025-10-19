import React, { useState, useCallback, useEffect } from 'react';
import ReactFlow, {
  Node,
  Edge,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  MarkerType,
  BackgroundVariant,
  NodeTypes,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, Eye, AlertTriangle, CheckCircle2, FileText, Radio, Zap } from 'lucide-react';

// Agent status type
type AgentStatus = 'idle' | 'processing' | 'complete' | 'error';

// Agent node data interface
interface AgentNodeData {
  label: string;
  status: AgentStatus;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  tasksCompleted: number;
  currentTask?: string;
}

// Custom Agent Node Component
const AgentNode = ({ data }: { data: AgentNodeData }) => {
  const statusColors = {
    idle: 'bg-gray-700 border-gray-600',
    processing: 'bg-blue-900 border-blue-500 animate-pulse',
    complete: 'bg-green-900 border-green-500',
    error: 'bg-red-900 border-red-500',
  };

  const statusBadges = {
    idle: { label: 'Idle', className: 'bg-gray-600 text-gray-200' },
    processing: { label: 'Processing', className: 'bg-blue-600 text-blue-100' },
    complete: { label: 'Complete', className: 'bg-green-600 text-green-100' },
    error: { label: 'Error', className: 'bg-red-600 text-red-100' },
  };

  const Icon = data.icon;

  return (
    <div className={`border-2 rounded-lg p-4 min-w-[220px] ${statusColors[data.status]} transition-all`}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Icon className="w-5 h-5 text-orange-400" />
          <span className="font-mono font-bold text-white text-sm">{data.label}</span>
        </div>
        <Badge className={statusBadges[data.status].className}>
          {statusBadges[data.status].label}
        </Badge>
      </div>
      <p className="text-xs text-gray-300 mb-2">{data.description}</p>
      <div className="flex items-center justify-between text-xs text-gray-400">
        <span>Tasks: {data.tasksCompleted}</span>
        {data.status === 'processing' && data.currentTask && (
          <span className="text-blue-300 animate-pulse">• {data.currentTask}</span>
        )}
      </div>
    </div>
  );
};

// Node types for ReactFlow
const nodeTypes: NodeTypes = {
  agentNode: AgentNode,
};

// Initial nodes configuration
const initialNodes: Node<AgentNodeData>[] = [
  {
    id: 'monitor',
    type: 'agentNode',
    position: { x: 50, y: 50 },
    data: {
      label: 'Monitor Agent',
      status: 'processing',
      description: 'Scans social media platforms',
      icon: Eye,
      tasksCompleted: 847,
      currentTask: 'Scanning Twitter',
    },
  },
  {
    id: 'detector',
    type: 'agentNode',
    position: { x: 350, y: 50 },
    data: {
      label: 'Detector Agent',
      status: 'processing',
      description: 'Identifies deepfake content',
      icon: AlertTriangle,
      tasksCompleted: 423,
      currentTask: 'Analyzing video',
    },
  },
  {
    id: 'analyzer',
    type: 'agentNode',
    position: { x: 650, y: 50 },
    data: {
      label: 'Analyzer Agent',
      status: 'complete',
      description: 'Performs forensic analysis',
      icon: Activity,
      tasksCompleted: 312,
    },
  },
  {
    id: 'verifier',
    type: 'agentNode',
    position: { x: 200, y: 250 },
    data: {
      label: 'Verifier Agent',
      status: 'processing',
      description: 'Cross-references with databases',
      icon: CheckCircle2,
      tasksCompleted: 289,
      currentTask: 'Checking sources',
    },
  },
  {
    id: 'reporter',
    type: 'agentNode',
    position: { x: 500, y: 250 },
    data: {
      label: 'Reporter Agent',
      status: 'idle',
      description: 'Generates incident reports',
      icon: FileText,
      tasksCompleted: 156,
    },
  },
  {
    id: 'coordinator',
    type: 'agentNode',
    position: { x: 350, y: 450 },
    data: {
      label: 'Coordinator Agent',
      status: 'complete',
      description: 'Orchestrates agent workflow',
      icon: Radio,
      tasksCompleted: 1024,
    },
  },
];

// Initial edges (connections between agents)
const initialEdges: Edge[] = [
  {
    id: 'monitor-detector',
    source: 'monitor',
    target: 'detector',
    type: 'smoothstep',
    animated: true,
    label: 'Media feed',
    markerEnd: { type: MarkerType.ArrowClosed, color: '#fb923c' },
    style: { stroke: '#fb923c', strokeWidth: 2 },
  },
  {
    id: 'detector-analyzer',
    source: 'detector',
    target: 'analyzer',
    type: 'smoothstep',
    animated: true,
    label: 'Detection result',
    markerEnd: { type: MarkerType.ArrowClosed, color: '#fb923c' },
    style: { stroke: '#fb923c', strokeWidth: 2 },
  },
  {
    id: 'monitor-verifier',
    source: 'monitor',
    target: 'verifier',
    type: 'smoothstep',
    animated: true,
    label: 'Metadata',
    markerEnd: { type: MarkerType.ArrowClosed, color: '#3b82f6' },
    style: { stroke: '#3b82f6', strokeWidth: 2 },
  },
  {
    id: 'analyzer-verifier',
    source: 'analyzer',
    target: 'verifier',
    type: 'smoothstep',
    animated: true,
    label: 'Analysis data',
    markerEnd: { type: MarkerType.ArrowClosed, color: '#3b82f6' },
    style: { stroke: '#3b82f6', strokeWidth: 2 },
  },
  {
    id: 'verifier-reporter',
    source: 'verifier',
    target: 'reporter',
    type: 'smoothstep',
    animated: true,
    label: 'Verified data',
    markerEnd: { type: MarkerType.ArrowClosed, color: '#10b981' },
    style: { stroke: '#10b981', strokeWidth: 2 },
  },
  {
    id: 'coordinator-monitor',
    source: 'coordinator',
    target: 'monitor',
    type: 'smoothstep',
    animated: false,
    label: 'Control',
    markerEnd: { type: MarkerType.ArrowClosed, color: '#6b7280' },
    style: { stroke: '#6b7280', strokeWidth: 1, strokeDasharray: '5 5' },
  },
  {
    id: 'coordinator-detector',
    source: 'coordinator',
    target: 'detector',
    type: 'smoothstep',
    animated: false,
    label: 'Control',
    markerEnd: { type: MarkerType.ArrowClosed, color: '#6b7280' },
    style: { stroke: '#6b7280', strokeWidth: 1, strokeDasharray: '5 5' },
  },
  {
    id: 'coordinator-reporter',
    source: 'coordinator',
    target: 'reporter',
    type: 'smoothstep',
    animated: false,
    label: 'Control',
    markerEnd: { type: MarkerType.ArrowClosed, color: '#6b7280' },
    style: { stroke: '#6b7280', strokeWidth: 1, strokeDasharray: '5 5' },
  },
];

export const AgentCommunicationViz: React.FC = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [selectedAgent, setSelectedAgent] = useState<AgentNodeData | null>(null);

  // Simulate agent status changes
  useEffect(() => {
    const interval = setInterval(() => {
      setNodes((nds) =>
        nds.map((node) => {
          const statuses: AgentStatus[] = ['idle', 'processing', 'complete'];
          const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
          
          // Randomly update agent status and tasks
          if (Math.random() > 0.7) {
            return {
              ...node,
              data: {
                ...node.data,
                status: randomStatus,
                tasksCompleted: node.data.tasksCompleted + (randomStatus === 'complete' ? 1 : 0),
                currentTask: randomStatus === 'processing' 
                  ? ['Analyzing', 'Scanning', 'Processing', 'Verifying'][Math.floor(Math.random() * 4)]
                  : undefined,
              },
            };
          }
          return node;
        })
      );
    }, 3000);

    return () => clearInterval(interval);
  }, [setNodes]);

  // Handle node click to show details
  const onNodeClick = useCallback((_: React.MouseEvent, node: Node<AgentNodeData>) => {
    setSelectedAgent(node.data);
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-orange-600/20 rounded-lg">
          <Zap className="w-6 h-6 text-orange-500" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-white font-mono">Agent Communication Network</h2>
          <p className="text-gray-400 text-sm">Real-time visualization of AI agent interactions</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* React Flow Visualization */}
        <Card className="lg:col-span-2 bg-black/40 border-orange-500/20 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white font-mono">Network Graph</CardTitle>
            <CardDescription className="text-gray-400">
              Interactive view of agent communication flows
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div style={{ height: '600px' }} className="bg-gray-900/50 rounded-lg border border-gray-800">
              <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onNodeClick={onNodeClick}
                nodeTypes={nodeTypes}
                fitView
                minZoom={0.5}
                maxZoom={1.5}
                defaultEdgeOptions={{
                  animated: true,
                }}
              >
                <Background 
                  variant={BackgroundVariant.Dots} 
                  gap={20} 
                  size={1} 
                  color="#374151"
                />
                <Controls className="bg-gray-800 border-gray-700" />
              </ReactFlow>
            </div>
          </CardContent>
        </Card>

        {/* Agent Details Panel */}
        <Card className="bg-black/40 border-orange-500/20 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white font-mono">Agent Details</CardTitle>
            <CardDescription className="text-gray-400">
              {selectedAgent ? 'Click an agent to view details' : 'Select an agent to view information'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {selectedAgent ? (
              <div className="space-y-4">
                <div className="flex items-center gap-3 pb-4 border-b border-gray-700">
                  <div className="p-2 bg-orange-600/20 rounded-lg">
                    {React.createElement(selectedAgent.icon, { className: "w-6 h-6 text-orange-500" })}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white font-mono">{selectedAgent.label}</h3>
                    <Badge className={
                      selectedAgent.status === 'idle' ? 'bg-gray-600' :
                      selectedAgent.status === 'processing' ? 'bg-blue-600 animate-pulse' :
                      selectedAgent.status === 'complete' ? 'bg-green-600' : 'bg-red-600'
                    }>
                      {selectedAgent.status.toUpperCase()}
                    </Badge>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="text-xs text-gray-400 uppercase tracking-wide">Description</label>
                    <p className="text-sm text-gray-200 mt-1">{selectedAgent.description}</p>
                  </div>

                  <div>
                    <label className="text-xs text-gray-400 uppercase tracking-wide">Tasks Completed</label>
                    <p className="text-2xl font-bold text-white font-mono">{selectedAgent.tasksCompleted}</p>
                  </div>

                  {selectedAgent.currentTask && (
                    <div>
                      <label className="text-xs text-gray-400 uppercase tracking-wide">Current Task</label>
                      <p className="text-sm text-blue-300 mt-1 animate-pulse">
                        • {selectedAgent.currentTask}
                      </p>
                    </div>
                  )}

                  <div className="pt-4 border-t border-gray-700">
                    <label className="text-xs text-gray-400 uppercase tracking-wide mb-2 block">
                      Capabilities
                    </label>
                    <div className="space-y-2">
                      {selectedAgent.label === 'Monitor Agent' && (
                        <>
                          <div className="text-xs text-gray-300">✓ Social media scanning</div>
                          <div className="text-xs text-gray-300">✓ Content ingestion</div>
                          <div className="text-xs text-gray-300">✓ Real-time monitoring</div>
                        </>
                      )}
                      {selectedAgent.label === 'Detector Agent' && (
                        <>
                          <div className="text-xs text-gray-300">✓ Deepfake detection</div>
                          <div className="text-xs text-gray-300">✓ ML-based analysis</div>
                          <div className="text-xs text-gray-300">✓ Confidence scoring</div>
                        </>
                      )}
                      {selectedAgent.label === 'Analyzer Agent' && (
                        <>
                          <div className="text-xs text-gray-300">✓ Forensic analysis</div>
                          <div className="text-xs text-gray-300">✓ Metadata extraction</div>
                          <div className="text-xs text-gray-300">✓ Pattern recognition</div>
                        </>
                      )}
                      {selectedAgent.label === 'Verifier Agent' && (
                        <>
                          <div className="text-xs text-gray-300">✓ Source verification</div>
                          <div className="text-xs text-gray-300">✓ Database cross-reference</div>
                          <div className="text-xs text-gray-300">✓ Authenticity checking</div>
                        </>
                      )}
                      {selectedAgent.label === 'Reporter Agent' && (
                        <>
                          <div className="text-xs text-gray-300">✓ Report generation</div>
                          <div className="text-xs text-gray-300">✓ PDF export</div>
                          <div className="text-xs text-gray-300">✓ Alert notification</div>
                        </>
                      )}
                      {selectedAgent.label === 'Coordinator Agent' && (
                        <>
                          <div className="text-xs text-gray-300">✓ Workflow orchestration</div>
                          <div className="text-xs text-gray-300">✓ Task distribution</div>
                          <div className="text-xs text-gray-300">✓ System monitoring</div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Zap className="w-8 h-8 text-gray-600" />
                </div>
                <p className="text-gray-500 text-sm">Click on any agent node to view its details</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Legend */}
      <Card className="bg-black/40 border-orange-500/20 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white font-mono text-lg">Legend</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-orange-500"></div>
              <span className="text-sm text-gray-300">Data Flow (Active)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-500"></div>
              <span className="text-sm text-gray-300">Metadata Flow</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span className="text-sm text-gray-300">Verified Data</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-gray-500"></div>
              <span className="text-sm text-gray-300">Control Signal</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
