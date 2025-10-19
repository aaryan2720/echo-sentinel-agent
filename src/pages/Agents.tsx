import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/Logo";
import { DemoBanner } from "@/components/DemoBanner";
import { LastUpdated } from "@/components/LastUpdated";
import { LogOut, Brain, Activity, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useNotification } from "@/hooks/use-notification";
import { getAgents } from "@/lib/supabase";
import { useState, useEffect } from "react";

const Agents = () => {
  const navigate = useNavigate();
  const { showSuccess, showInfo, showWarning } = useNotification();
  const [agents, setAgents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadAgents();
  }, []);

  const loadAgents = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getAgents();
      setAgents(data);
    } catch (err: any) {
      console.error('Error loading agents:', err);
      setError(err.message || 'Failed to load agents');
    } finally {
      setLoading(false);
    }
  };

  const handleRestartAgent = (agentId: string, agentName: string) => {
    showWarning("Restarting Agent", `${agentName} is being restarted...`);
    setTimeout(() => {
      showSuccess("Agent Online", `${agentName} has been restarted successfully.`);
    }, 2000);
  };

  const handleViewLogs = (agentId: number, agentName: string) => {
    showInfo("Loading Logs", `Fetching execution logs for ${agentName}...`);
  };

  // Calculate stats from loaded agents
  const activeAgents = agents.filter(a => a.status === 'idle' || a.status === 'processing').length;
  const processingAgents = agents.filter(a => a.status === 'processing').length;
  const totalTasks = agents.reduce((sum, a) => sum + (a.tasks_completed || 0), 0);
  const avgAccuracy = agents.length > 0
    ? (agents.reduce((sum, a) => sum + (a.metadata?.accuracy || 0), 0) / agents.length).toFixed(1)
    : '0.0';

  return (
    <div className="min-h-screen relative">
      <DemoBanner />
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse-glow" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: '1s' }} />
      </div>

      <header className="relative z-10 container mx-auto px-4 py-4 border-b border-border/50 mt-12">
        <nav className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/dashboard')}>
              <Logo />
              <span className="text-2xl font-bold font-mono text-primary">EchoBreaker</span>
            </div>
            <div className="flex gap-4">
              <Button variant="ghost" onClick={() => navigate('/dashboard')} className="font-mono hover-lift">
                Dashboard
              </Button>
              <Button variant="ghost" onClick={() => navigate('/analytics')} className="font-mono hover-lift">
                Analytics
              </Button>
              <Button variant="default" className="font-mono hover-glow">
                Agents
              </Button>
              <Button variant="ghost" onClick={() => navigate('/network')} className="font-mono hover-lift">
                Network
              </Button>
              <Button variant="ghost" onClick={() => navigate('/incidents')} className="font-mono hover-lift">
                Incidents
              </Button>
              <Button variant="ghost" onClick={() => navigate('/alerts')} className="font-mono hover-lift">
                Alerts
              </Button>
            </div>
          </div>
          <Button variant="outline" onClick={() => navigate('/')} className="font-mono">
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
        </nav>
      </header>

      <div className="relative z-10 container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2 font-mono text-primary">
              Agentic AI Status
            </h1>
            <p className="text-muted-foreground">Autonomous agents monitoring and detecting misinformation</p>
          </div>
          <LastUpdated />
        </div>

        {/* Agent Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="p-4 bg-card/50 backdrop-blur-sm border-primary/20 card-interactive">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-success" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground font-mono">Active Agents</p>
                <p className="text-2xl font-bold text-foreground">{activeAgents}</p>
              </div>
            </div>
          </Card>
          
          <Card className="p-4 bg-card/50 backdrop-blur-sm border-primary/20 card-interactive">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-warning/10 rounded-lg flex items-center justify-center">
                <Activity className="w-6 h-6 text-warning" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground font-mono">Processing</p>
                <p className="text-2xl font-bold text-foreground">{processingAgents}</p>
              </div>
            </div>
          </Card>

          <Card className="p-4 bg-card/50 backdrop-blur-sm border-primary/20">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <Brain className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground font-mono">Tasks Completed</p>
                <p className="text-2xl font-bold text-foreground">{totalTasks.toLocaleString()}</p>
              </div>
            </div>
          </Card>

          <Card className="p-4 bg-card/50 backdrop-blur-sm border-primary/20 card-interactive">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-accent" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground font-mono">Avg Accuracy</p>
                <p className="text-2xl font-bold text-foreground">{avgAccuracy}%</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-20">
            <div className="text-center space-y-4">
              <Loader2 className="w-12 h-12 text-primary animate-spin mx-auto" />
              <p className="text-muted-foreground font-mono">Loading agents from database...</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <Card className="p-8 bg-destructive/10 border-destructive/50">
            <div className="text-center space-y-4">
              <AlertCircle className="w-12 h-12 text-destructive mx-auto" />
              <h3 className="text-xl font-bold text-destructive">Failed to Load Agents</h3>
              <p className="text-muted-foreground">{error}</p>
              <Button onClick={loadAgents} variant="outline">
                Try Again
              </Button>
            </div>
          </Card>
        )}

        {/* Agents List */}
        {!loading && !error && (
        <div className="space-y-4">
          {agents.map((agent, idx) => (
            <Card
              key={agent.agent_id}
              className="p-6 bg-card/50 backdrop-blur-sm border-primary/20 animate-fade-in-up card-interactive"
              style={{ animationDelay: `${idx * 100}ms` }}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center border border-primary/30">
                    <Brain className="w-8 h-8 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-foreground mb-1">{agent.name}</h3>
                    <p className="text-sm text-muted-foreground font-mono">{agent.agent_type}</p>
                  </div>
                </div>
                
                <Badge
                  variant={agent.status === "idle" ? "default" : "outline"}
                  className={`font-mono ${agent.status === "idle" ? "bg-success" : agent.status === "processing" ? "animate-pulse bg-warning" : ""}`}
                >
                  {agent.status}
                </Badge>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div className="p-3 bg-background/50 rounded-lg">
                  <p className="text-xs text-muted-foreground font-mono mb-1">Tasks Completed</p>
                  <p className="text-lg font-bold text-foreground">{agent.tasks_completed || 0}</p>
                </div>
                <div className="p-3 bg-background/50 rounded-lg">
                  <p className="text-xs text-muted-foreground font-mono mb-1">Accuracy</p>
                  <p className="text-lg font-bold text-primary">{agent.metadata?.accuracy || 0}%</p>
                </div>
                <div className="p-3 bg-background/50 rounded-lg">
                  <p className="text-xs text-muted-foreground font-mono mb-1">Uptime</p>
                  <p className="text-lg font-bold text-success">{agent.metadata?.uptime || '0%'}</p>
                </div>
                <div className="p-3 bg-background/50 rounded-lg col-span-2 md:col-span-1">
                  <p className="text-xs text-muted-foreground font-mono mb-1">Current Task</p>
                  <p className="text-sm font-semibold text-foreground">{agent.current_task || 'Idle'}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 mt-4">
                <Button
                  variant="outline"
                  size="sm"
                  className="font-mono hover-lift"
                  onClick={() => handleViewLogs(agent.agent_id, agent.name)}
                >
                  View Logs
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="font-mono hover-lift"
                  onClick={() => handleRestartAgent(agent.agent_id, agent.name)}
                >
                  Restart
                </Button>
              </div>

              <div className="flex items-center gap-2 mt-4">
                <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary animate-scan"
                    style={{ width: "100%" }}
                  />
                </div>
                <Activity className="w-4 h-4 text-primary animate-pulse" />
              </div>
            </Card>
          ))}
        </div>
        )}
      </div>
    </div>
  );
};

export default Agents;
