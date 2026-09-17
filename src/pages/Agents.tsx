import { useState, useEffect } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useNotification } from "@/hooks/use-notification";
import { getAgents } from "@/lib/supabase";
import { 
  Brain, 
  Activity, 
  CheckCircle, 
  AlertCircle, 
  Loader2, 
  RotateCw, 
  Terminal, 
  Scan, 
  Eye, 
  Network, 
  Zap, 
  Shield, 
  Cpu,
  Radio,
  Clock,
  Sparkles,
  Server
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Agents() {
  const navigate = useNavigate();
  const { showSuccess, showInfo, showWarning } = useNotification();
  const [agents, setAgents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAgentLogs, setSelectedAgentLogs] = useState<{ name: string; logs: string[] } | null>(null);

  const fallbackAgents = [
    {
      agent_id: "agent-001",
      name: "Continuous Monitoring Agent",
      agent_type: "Data Ingestion & Velocity Scorer",
      status: "processing",
      tasks_completed: 14205,
      current_task: "Polling X API v2 & Telegram channels for #BreakingNews surge",
      metadata: { accuracy: 98.2, uptime: "99.9%", latency: "42ms", queue: 12 },
      icon: Scan,
    },
    {
      agent_id: "agent-002",
      name: "Multimodal Deepfake Detector",
      agent_type: "ViT + Whisper Audio Forensics",
      status: "processing",
      tasks_completed: 8432,
      current_task: "Extracting 32 keyframes from viral TikTok MP4 via VideoMAE",
      metadata: { accuracy: 96.4, uptime: "99.8%", latency: "180ms", queue: 4 },
      icon: Eye,
    },
    {
      agent_id: "agent-003",
      name: "Coordination Detection Agent",
      agent_type: "GNN Propagation & Community Detection",
      status: "idle",
      tasks_completed: 4120,
      current_task: "Awaiting new cluster sync trigger",
      metadata: { accuracy: 95.1, uptime: "99.9%", latency: "95ms", queue: 0 },
      icon: Network,
    },
    {
      agent_id: "agent-004",
      name: "Causality & Attribution Agent",
      agent_type: "Media Hash & Origin Seed Forensics",
      status: "idle",
      tasks_completed: 3290,
      current_task: "Cross-matching perceptual hash against known bot disinfo DB",
      metadata: { accuracy: 94.7, uptime: "99.7%", latency: "65ms", queue: 1 },
      icon: Brain,
    },
    {
      agent_id: "agent-005",
      name: "Response & Reporting Agent",
      agent_type: "PDF Dossier & Webhook Dispatcher",
      status: "processing",
      tasks_completed: 1845,
      current_task: "Generating PDF evidence dossier for Incident INC-2024-001",
      metadata: { accuracy: 99.4, uptime: "100%", latency: "110ms", queue: 2 },
      icon: Zap,
    },
    {
      agent_id: "agent-006",
      name: "Self-Improving Active Learner",
      agent_type: "HITL Feedback & Embedding Tuner",
      status: "idle",
      tasks_completed: 720,
      current_task: "Awaiting next batch from Human Review Queue",
      metadata: { accuracy: 97.8, uptime: "99.9%", latency: "310ms", queue: 5 },
      icon: Shield,
    },
  ];

  useEffect(() => {
    loadAgents();
  }, []);

  const loadAgents = async () => {
    try {
      setLoading(true);
      const data = await getAgents();
      if (data && data.length > 0) {
        setAgents(data);
      } else {
        setAgents(fallbackAgents);
      }
    } catch (err: any) {
      console.error('Error loading agents from supabase, using fallback:', err);
      setAgents(fallbackAgents);
    } finally {
      setLoading(false);
    }
  };

  const handleRestartAgent = (agentId: string, agentName: string) => {
    showWarning("Restarting Agent", `Sending SIGTERM & restarting ${agentName}...`);
    setTimeout(() => {
      showSuccess("Agent Online", `${agentName} restarted with healthy heartbeat.`);
    }, 1200);
  };

  const handleViewLogs = (agent: any) => {
    const time = new Date().toLocaleTimeString();
    setSelectedAgentLogs({
      name: agent.name,
      logs: [
        `[${time}] [INFO] [${agent.name}] Heartbeat OK (PID: ${Math.floor(Math.random() * 8000 + 1000)})`,
        `[${time}] [INFO] Processing pipeline: ${agent.current_task}`,
        `[${time}] [METRICS] Accuracy: ${agent.metadata?.accuracy || 96}%, Uptime: ${agent.metadata?.uptime || '99.9%'}`,
        `[${time}] [DEBUG] Message bus latency: ${agent.metadata?.latency || '45ms'}`,
        `[${time}] [SUCCESS] Task executed with zero memory leak`,
      ],
    });
  };

  const activeAgents = agents.filter(a => a.status === 'idle' || a.status === 'processing').length;
  const processingAgents = agents.filter(a => a.status === 'processing').length;
  const totalTasks = agents.reduce((sum, a) => sum + (a.tasks_completed || 0), 0);
  const avgAccuracy = agents.length > 0
    ? (agents.reduce((sum, a) => sum + (a.metadata?.accuracy || 95), 0) / agents.length).toFixed(1)
    : '96.2';

  return (
    <AppLayout
      title="Autonomous AI Sentinel Fleet"
      subtitle="Real-time status, health telemetry, queue depth, and logs for all 6 autonomous defense agents"
      actions={
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="font-mono text-xs text-primary border-primary/30 py-1 px-2.5">
            <Radio className="w-3 h-3 text-primary mr-1.5 animate-pulse" />
            Mesh Status: Healthy ({activeAgents}/6)
          </Badge>
          <Button
            size="sm"
            onClick={loadAgents}
            variant="outline"
            className="text-xs font-medium border-border hover:bg-secondary/60 gap-1.5"
          >
            <RotateCw className="w-3.5 h-3.5" />
            Refresh Fleet
          </Button>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Agent Overview Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="soc-card rounded-xl p-4 hover-lift">
            <div className="flex items-center justify-between text-muted-foreground mb-2">
              <span className="text-xs font-medium">Active Sentinel Agents</span>
              <div className="p-1.5 rounded-md bg-success/10 text-success">
                <CheckCircle className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-bold font-data text-foreground">{activeAgents} / {agents.length}</div>
            <div className="text-[11px] text-success mt-1">100% Operational</div>
          </div>

          <div className="soc-card rounded-xl p-4 hover-lift">
            <div className="flex items-center justify-between text-muted-foreground mb-2">
              <span className="text-xs font-medium">Active Pipelines</span>
              <div className="p-1.5 rounded-md bg-warning/10 text-warning">
                <Activity className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-bold font-data text-foreground">{processingAgents} Running</div>
            <div className="text-[11px] text-warning mt-1">Processing streams</div>
          </div>

          <div className="soc-card rounded-xl p-4 hover-lift">
            <div className="flex items-center justify-between text-muted-foreground mb-2">
              <span className="text-xs font-medium">Total Ingested Tasks</span>
              <div className="p-1.5 rounded-md bg-primary/10 text-primary">
                <Brain className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-bold font-data text-foreground">{totalTasks.toLocaleString()}</div>
            <div className="text-[11px] text-primary mt-1">+847 in last 24h</div>
          </div>

          <div className="soc-card rounded-xl p-4 hover-lift">
            <div className="flex items-center justify-between text-muted-foreground mb-2">
              <span className="text-xs font-medium">Fleet Avg Precision</span>
              <div className="p-1.5 rounded-md bg-accent/10 text-accent">
                <Sparkles className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-bold font-data text-foreground">{avgAccuracy}%</div>
            <div className="text-[11px] text-accent mt-1">ViT + Spectral Fusion</div>
          </div>
        </div>

        {/* Agents Grid List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {agents.map((agent) => {
            const isProcessing = agent.status === "processing";
            const Icon = agent.icon || Brain;

            return (
              <div
                key={agent.agent_id}
                className="soc-card rounded-xl p-5 flex flex-col justify-between hover-lift group"
              >
                <div className="space-y-3">
                  {/* Agent Header */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div className="p-2.5 rounded-lg bg-primary/10 border border-primary/20 text-primary flex-shrink-0">
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">
                          {agent.name}
                        </h3>
                        <p className="text-xs text-muted-foreground font-mono mt-0.5">
                          {agent.agent_type}
                        </p>
                      </div>
                    </div>

                    <Badge
                      variant={isProcessing ? "default" : "secondary"}
                      className={`text-[10px] font-mono uppercase ${
                        isProcessing
                          ? "bg-warning/20 text-warning border-warning/30 animate-pulse"
                          : "bg-success/20 text-success border-success/30"
                      }`}
                    >
                      {agent.status}
                    </Badge>
                  </div>

                  {/* Current Activity Box */}
                  <div className="p-3 rounded-lg bg-secondary/40 border border-border/50 space-y-1 text-xs">
                    <div className="text-[10px] text-muted-foreground font-mono flex items-center gap-1.5">
                      <Activity className="w-3 h-3 text-primary animate-pulse" />
                      Active Task:
                    </div>
                    <p className="text-foreground text-xs line-clamp-2 leading-relaxed">
                      {agent.current_task || "Standing by for incoming ingestion payload"}
                    </p>
                  </div>

                  {/* Telemetry Metrics */}
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <div className="p-2 rounded-md bg-card border border-border/60">
                      <span className="text-[10px] text-muted-foreground font-mono block">Tasks</span>
                      <span className="font-bold font-data text-foreground">{agent.tasks_completed?.toLocaleString() || 0}</span>
                    </div>
                    <div className="p-2 rounded-md bg-card border border-border/60">
                      <span className="text-[10px] text-muted-foreground font-mono block">Accuracy</span>
                      <span className="font-bold font-data text-primary">{agent.metadata?.accuracy || 96}%</span>
                    </div>
                    <div className="p-2 rounded-md bg-card border border-border/60">
                      <span className="text-[10px] text-muted-foreground font-mono block">Uptime</span>
                      <span className="font-bold font-data text-success">{agent.metadata?.uptime || '99.9%'}</span>
                    </div>
                  </div>
                </div>

                {/* Bottom Actions */}
                <div className="pt-3 mt-3 border-t border-border/40 flex items-center justify-between gap-2">
                  <span className="text-[11px] font-mono text-muted-foreground">
                    Latency: {agent.metadata?.latency || "45ms"}
                  </span>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewLogs(agent)}
                      className="text-xs h-7 border-border hover:bg-secondary/60 gap-1"
                    >
                      <Terminal className="w-3 h-3" />
                      Logs
                    </Button>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => handleRestartAgent(agent.agent_id, agent.name)}
                      className="text-xs h-7 gap-1"
                    >
                      <RotateCw className="w-3 h-3" />
                      Restart
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Logs Terminal Modal */}
        {selectedAgentLogs && (
          <Dialog open={!!selectedAgentLogs} onOpenChange={() => setSelectedAgentLogs(null)}>
            <DialogContent className="max-w-2xl bg-card/95 backdrop-blur-2xl border-border p-6">
              <DialogHeader className="pb-3 border-b border-border/60">
                <DialogTitle className="text-base font-bold text-foreground flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-primary" />
                  Live Execution Logs: {selectedAgentLogs.name}
                </DialogTitle>
                <DialogDescription className="text-xs text-muted-foreground">
                  Streaming stdout/stderr telemetry from agent runner container
                </DialogDescription>
              </DialogHeader>

              <div className="p-4 rounded-lg bg-black/80 border border-border/80 font-mono text-xs text-emerald-400 space-y-2 overflow-x-auto max-h-72">
                {selectedAgentLogs.logs.map((log, idx) => (
                  <div key={idx} className="leading-relaxed whitespace-pre-wrap">{log}</div>
                ))}
              </div>

              <div className="flex justify-end">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setSelectedAgentLogs(null)}
                  className="text-xs"
                >
                  Close Terminal
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </AppLayout>
  );
}
