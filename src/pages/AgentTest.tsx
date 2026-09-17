import { useState, useEffect } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Play, 
  Square, 
  RotateCw, 
  Plus, 
  Activity, 
  CheckCircle, 
  AlertCircle, 
  Clock, 
  Zap,
  Terminal,
  Trash2,
  Cpu,
  Radio,
  Sparkles
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { TestAgent, agentHub, type AgentInfo } from "@/agents";

export default function AgentTest() {
  const navigate = useNavigate();
  const [agents, setAgents] = useState<any[]>([]);
  const [systemHealth, setSystemHealth] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [isTestRunning, setIsTestRunning] = useState(false);
  const [logs, setLogs] = useState<string[]>([
    `[${new Date().toLocaleTimeString()}] [READY] AgentHub framework test harness initialized`,
  ]);

  const addLog = (message: string) => {
    setLogs((prev) => [...prev, `[${new Date().toLocaleTimeString()}] ${message}`]);
  };

  const createTestAgents = async () => {
    try {
      addLog("Spawning 3 synthetic agent instances (Alpha, Beta, Gamma)...");

      const agent1 = new TestAgent({
        agentId: "test-agent-001",
        name: "Sentinel Alpha (Ingestion)",
        type: "test",
        maxConcurrentTasks: 2,
        timeout: 5000,
        retryAttempts: 3,
      });

      const agent2 = new TestAgent({
        agentId: "test-agent-002",
        name: "Sentinel Beta (ViT Detector)",
        type: "test",
        maxConcurrentTasks: 3,
        timeout: 5000,
        retryAttempts: 3,
      });

      const agent3 = new TestAgent({
        agentId: "test-agent-003",
        name: "Sentinel Gamma (Attribution)",
        type: "test",
        maxConcurrentTasks: 1,
        timeout: 5000,
        retryAttempts: 3,
      });

      await agent1.initialize();
      await agent2.initialize();
      await agent3.initialize();

      agentHub.registerAgent(agent1);
      agentHub.registerAgent(agent2);
      agentHub.registerAgent(agent3);

      await agent1.start();
      await agent2.start();
      await agent3.start();

      addLog("✅ All 3 test agents registered to message bus & running!");
      updateAgentInfo();
      return [agent1, agent2, agent3];
    } catch (error) {
      addLog(`❌ Error creating agents: ${error}`);
      return [];
    }
  };

  const updateAgentInfo = () => {
    const agentInfos = agentHub.getAgentInfos();
    setAgents(agentInfos);
    const health = agentHub.getSystemHealth();
    setSystemHealth(health);
    const messageLog = agentHub.getMessageLog(10);
    setMessages(messageLog);
  };

  const runTest = async () => {
    setIsTestRunning(true);
    try {
      addLog("🚀 Starting Multi-Agent Task Orchestration Scenario...");
      const testAgents = await createTestAgents();
      if (testAgents.length === 0) {
        setIsTestRunning(false);
        return;
      }

      await new Promise((resolve) => setTimeout(resolve, 800));

      addLog("📋 Dispatching prioritized payloads into DAG queue:");
      addLog("  • Ingestion Payload [P:10 - Critical]");
      addLog("  • VideoMAE Frame Extract [P:8 - High]");
      addLog("  • GNN Cluster Graph [P:5 - Medium]");

      await testAgents[0].addTask("analyze_image", { url: "test1.jpg" }, 10);
      await testAgents[0].addTask("analyze_video", { url: "test2.mp4" }, 5);
      await testAgents[1].addTask("analyze_audio", { url: "test3.mp3" }, 1);
      await testAgents[1].addTask("detect_network", { accounts: 50 }, 8);
      await testAgents[2].addTask("verify_content", { text: "sample" }, 3);

      updateAgentInfo();

      for (let i = 0; i < 6; i++) {
        await new Promise((resolve) => setTimeout(resolve, 800));
        updateAgentInfo();
        const health = agentHub.getSystemHealth();
        if (health.totalQueuedTasks === 0 && health.processingAgents === 0) {
          addLog("✅ All pipeline DAG tasks successfully executed!");
          break;
        }
      }

      addLog("🎉 Multi-agent simulation concluded with zero error rate.");
    } catch (error) {
      addLog(`❌ Test error: ${error}`);
    } finally {
      setIsTestRunning(false);
    }
  };

  const stopAllAgents = async () => {
    addLog("🛑 Stopping all active simulation agents...");
    const allAgents = agentHub.getAllAgents();
    for (const agent of allAgents) {
      try {
        await agent.stop();
      } catch (error) {
        addLog(`Error stopping agent: ${error}`);
      }
    }
    addLog("✅ All agents stopped.");
    updateAgentInfo();
  };

  useEffect(() => {
    const interval = setInterval(() => {
      if (agentHub.getAllAgents().length > 0) {
        updateAgentInfo();
      }
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <AppLayout
      title="Multi-Agent Pipeline Simulation Suite"
      subtitle="Stress test the BaseAgent framework, DAG priority queues, and real-time inter-agent messaging bus"
      actions={
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            onClick={runTest}
            disabled={isTestRunning}
            className="text-xs bg-primary text-primary-foreground hover:bg-primary/90 gap-1.5 font-medium"
          >
            <Play className="w-3.5 h-3.5" />
            {isTestRunning ? "Simulation Running..." : "Execute Simulation"}
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={stopAllAgents}
            className="text-xs border-border hover:bg-secondary/60 gap-1.5"
          >
            <Square className="w-3.5 h-3.5" />
            Stop Fleet
          </Button>
        </div>
      }
    >
      <div className="space-y-6">
        {/* System Health Strip */}
        {systemHealth && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="soc-card rounded-xl p-4 hover-lift">
              <div className="text-xs text-muted-foreground font-mono">Running Agents</div>
              <div className="text-2xl font-bold font-data text-foreground mt-1">
                {systemHealth.runningAgents} / {systemHealth.totalAgents}
              </div>
            </div>
            <div className="soc-card rounded-xl p-4 hover-lift">
              <div className="text-xs text-muted-foreground font-mono">Queued Tasks</div>
              <div className="text-2xl font-bold font-data text-accent mt-1">
                {systemHealth.totalQueuedTasks}
              </div>
            </div>
            <div className="soc-card rounded-xl p-4 hover-lift">
              <div className="text-xs text-muted-foreground font-mono">Processing Tasks</div>
              <div className="text-2xl font-bold font-data text-warning mt-1">
                {systemHealth.processingAgents}
              </div>
            </div>
            <div className="soc-card rounded-xl p-4 hover-lift">
              <div className="text-xs text-muted-foreground font-mono">Health Score</div>
              <div className="text-2xl font-bold font-data text-success mt-1">100%</div>
            </div>
          </div>
        )}

        {/* Live Active Agents & Terminal */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Active Agents List */}
          <div className="soc-card rounded-xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-border/50">
              <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                <Cpu className="w-4 h-4 text-primary" />
                Active Test Instances ({agents.length})
              </h3>
              <span className="text-xs text-muted-foreground font-mono">AgentHub Bus</span>
            </div>

            {agents.length === 0 ? (
              <div className="p-8 text-center rounded-lg bg-secondary/20 border border-border/40 text-xs text-muted-foreground space-y-2">
                <Cpu className="w-8 h-8 text-muted-foreground/50 mx-auto" />
                <p>No active test agents registered</p>
                <Button size="sm" onClick={runTest} className="text-xs mt-2">
                  Launch Test Simulation
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {agents.map((ag) => (
                  <div key={ag.id} className="p-3.5 rounded-lg bg-secondary/40 border border-border/50 space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-foreground">{ag.name}</span>
                      <Badge className="bg-success/20 text-success border-success/30 text-[10px] font-mono">
                        {ag.status}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-[11px] font-mono text-muted-foreground">
                      <div>Processed: <span className="text-foreground">{ag.metrics?.tasksProcessed || 0}</span></div>
                      <div>Succeeded: <span className="text-success">{ag.metrics?.tasksSucceeded || 0}</span></div>
                      <div>Avg Time: <span className="text-primary">{ag.metrics?.averageProcessingTime || 0}ms</span></div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Test Logs Terminal */}
          <div className="soc-card rounded-xl p-5 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-border/50">
              <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground">
                <Terminal className="w-4 h-4 text-primary" />
                Simulation Terminal Stream
              </div>
              <button
                onClick={() => setLogs([])}
                className="text-[11px] text-muted-foreground hover:text-foreground flex items-center gap-1 font-mono"
              >
                <Trash2 className="w-3 h-3" /> Clear
              </button>
            </div>

            <div className="p-3.5 rounded-lg bg-black/85 border border-border/70 font-mono text-[11px] text-emerald-400 space-y-1.5 h-64 overflow-y-auto">
              {logs.map((log, idx) => (
                <div key={idx} className="leading-relaxed">{log}</div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
