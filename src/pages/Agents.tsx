import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/Logo";
import { LogOut, Brain, Activity, CheckCircle, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Agents = () => {
  const navigate = useNavigate();

  const agents = [
    {
      id: 1,
      name: "Content Scanner Agent",
      type: "Vision Transformer",
      status: "active",
      tasksCompleted: 1247,
      currentTask: "Scanning trending videos on X",
      accuracy: 94,
      uptime: "99.8%",
    },
    {
      id: 2,
      name: "Audio Analysis Agent",
      type: "Audio Transformer",
      status: "active",
      tasksCompleted: 892,
      currentTask: "Analyzing voice patterns",
      accuracy: 91,
      uptime: "98.5%",
    },
    {
      id: 3,
      name: "Network Mapper Agent",
      type: "Graph Neural Network",
      status: "active",
      tasksCompleted: 2341,
      currentTask: "Mapping coordinated networks",
      accuracy: 96,
      uptime: "99.9%",
    },
    {
      id: 4,
      name: "Pattern Recognition Agent",
      type: "LangChain Reasoning",
      status: "processing",
      tasksCompleted: 1567,
      currentTask: "Identifying propaganda patterns",
      accuracy: 89,
      uptime: "97.2%",
    },
    {
      id: 5,
      name: "Platform Monitor Agent",
      type: "Multi-Platform Crawler",
      status: "active",
      tasksCompleted: 3421,
      currentTask: "Monitoring Telegram channels",
      accuracy: 92,
      uptime: "99.1%",
    },
  ];

  return (
    <div className="min-h-screen relative">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse-glow" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: '1s' }} />
      </div>

      <header className="relative z-10 container mx-auto px-4 py-4 border-b border-border/50">
        <nav className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/dashboard')}>
              <Logo />
              <span className="text-2xl font-bold font-mono text-primary">EchoBreaker</span>
            </div>
            <div className="flex gap-4">
              <Button variant="ghost" onClick={() => navigate('/dashboard')} className="font-mono">
                Dashboard
              </Button>
              <Button variant="ghost" onClick={() => navigate('/analytics')} className="font-mono">
                Analytics
              </Button>
              <Button variant="default" className="font-mono">
                Agents
              </Button>
              <Button variant="ghost" onClick={() => navigate('/network')} className="font-mono">
                Network
              </Button>
              <Button variant="ghost" onClick={() => navigate('/incidents')} className="font-mono">
                Incidents
              </Button>
              <Button variant="ghost" onClick={() => navigate('/alerts')} className="font-mono">
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
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 font-mono text-primary">
            Agentic AI Status
          </h1>
          <p className="text-muted-foreground">Autonomous agents monitoring and detecting misinformation</p>
        </div>

        {/* Agent Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="p-4 bg-card/50 backdrop-blur-sm border-primary/20">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-success" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground font-mono">Active Agents</p>
                <p className="text-2xl font-bold text-foreground">4</p>
              </div>
            </div>
          </Card>
          
          <Card className="p-4 bg-card/50 backdrop-blur-sm border-primary/20">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-warning/10 rounded-lg flex items-center justify-center">
                <Activity className="w-6 h-6 text-warning" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground font-mono">Processing</p>
                <p className="text-2xl font-bold text-foreground">1</p>
              </div>
            </div>
          </Card>

          <Card className="p-4 bg-card/50 backdrop-blur-sm border-primary/20">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <Brain className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground font-mono">Tasks Today</p>
                <p className="text-2xl font-bold text-foreground">9.4K</p>
              </div>
            </div>
          </Card>

          <Card className="p-4 bg-card/50 backdrop-blur-sm border-primary/20">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-accent" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground font-mono">Avg Accuracy</p>
                <p className="text-2xl font-bold text-foreground">92.4%</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Agents List */}
        <div className="space-y-4">
          {agents.map((agent, idx) => (
            <Card
              key={agent.id}
              className="p-6 bg-card/50 backdrop-blur-sm border-primary/20 animate-fade-in-up"
              style={{ animationDelay: `${idx * 100}ms` }}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center border border-primary/30">
                    <Brain className="w-8 h-8 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-foreground mb-1">{agent.name}</h3>
                    <p className="text-sm text-muted-foreground font-mono">{agent.type}</p>
                  </div>
                </div>
                
                <Badge
                  variant={agent.status === "active" ? "default" : "outline"}
                  className={`font-mono ${agent.status === "active" ? "bg-success" : "animate-pulse"}`}
                >
                  {agent.status}
                </Badge>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div className="p-3 bg-background/50 rounded-lg">
                  <p className="text-xs text-muted-foreground font-mono mb-1">Tasks Completed</p>
                  <p className="text-lg font-bold text-foreground">{agent.tasksCompleted}</p>
                </div>
                <div className="p-3 bg-background/50 rounded-lg">
                  <p className="text-xs text-muted-foreground font-mono mb-1">Accuracy</p>
                  <p className="text-lg font-bold text-primary">{agent.accuracy}%</p>
                </div>
                <div className="p-3 bg-background/50 rounded-lg">
                  <p className="text-xs text-muted-foreground font-mono mb-1">Uptime</p>
                  <p className="text-lg font-bold text-success">{agent.uptime}</p>
                </div>
                <div className="p-3 bg-background/50 rounded-lg col-span-2 md:col-span-1">
                  <p className="text-xs text-muted-foreground font-mono mb-1">Current Task</p>
                  <p className="text-sm font-semibold text-foreground">{agent.currentTask}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
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
      </div>
    </div>
  );
};

export default Agents;
