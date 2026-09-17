import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/Logo";
import { LogOut, FileText, Download, AlertTriangle, Users, Clock, TrendingUp } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Incidents = () => {
  const navigate = useNavigate();

  const incidents = [
    {
      id: "INC-2024-001",
      title: "Political Deepfake Video Campaign",
      description: "Coordinated spread of manipulated video showing false political statement. Detected 187 coordinated accounts amplifying across X and Telegram.",
      timestamp: "2024-10-15 14:23:00",
      severity: "critical",
      status: "active",
      accounts: 187,
      reach: "2.4M",
      platforms: ["X", "Telegram", "YouTube"],
      confidence: 96,
      evidence: 43,
    },
    {
      id: "INC-2024-002",
      title: "Audio Clone Impersonation",
      description: "Synthetic voice clone of public figure spreading misinformation about health policy. Audio analysis shows clear synthetic artifacts.",
      timestamp: "2024-10-15 11:45:00",
      severity: "high",
      status: "investigating",
      accounts: 92,
      reach: "890K",
      platforms: ["WhatsApp", "Telegram"],
      confidence: 91,
      evidence: 28,
    },
    {
      id: "INC-2024-003",
      title: "Coordinated Meme Manipulation Network",
      description: "Bot network spreading doctored images with false claims. Pattern shows synchronized posting across 234 accounts.",
      timestamp: "2024-10-15 09:12:00",
      severity: "high",
      status: "active",
      accounts: 234,
      reach: "4.1M",
      platforms: ["X", "Reddit", "Facebook"],
      confidence: 88,
      evidence: 67,
    },
    {
      id: "INC-2024-004",
      title: "Synthetic Profile Cluster",
      description: "Network of AI-generated profile pictures and bios amplifying specific narratives. GNN detected coordination patterns.",
      timestamp: "2024-10-14 18:30:00",
      severity: "medium",
      status: "resolved",
      accounts: 145,
      reach: "1.2M",
      platforms: ["X", "Instagram"],
      confidence: 84,
      evidence: 52,
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
              <Button variant="ghost" onClick={() => navigate('/agents')} className="font-mono">
                Agents
              </Button>
              <Button variant="ghost" onClick={() => navigate('/network')} className="font-mono">
                Network
              </Button>
              <Button variant="default" className="font-mono">
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
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2 font-mono text-primary">
              Incident Reports
            </h1>
            <p className="text-muted-foreground">Detailed forensic analysis of coordinated misinformation campaigns</p>
          </div>
          <Button className="font-mono">
            <Download className="w-4 h-4 mr-2" />
            Export All Reports
          </Button>
        </div>

        <div className="space-y-6">
          {incidents.map((incident, idx) => (
            <Card
              key={incident.id}
              className="p-6 bg-card/50 backdrop-blur-sm border-primary/20 animate-fade-in-up hover:border-primary/40 transition-all"
              style={{ animationDelay: `${idx * 100}ms` }}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <Badge variant="outline" className="font-mono text-xs">
                      {incident.id}
                    </Badge>
                    <Badge
                      variant={
                        incident.severity === 'critical'
                          ? 'destructive'
                          : incident.severity === 'high'
                          ? 'default'
                          : 'outline'
                      }
                      className="font-mono"
                    >
                      {incident.severity}
                    </Badge>
                    <Badge
                      variant={incident.status === 'active' ? 'default' : 'outline'}
                      className={incident.status === 'active' ? 'bg-success' : ''}
                    >
                      {incident.status}
                    </Badge>
                  </div>
                  
                  <h3 className="text-2xl font-bold text-foreground mb-2">{incident.title}</h3>
                  <p className="text-muted-foreground mb-4">{incident.description}</p>
                  
                  <div className="flex items-center gap-2 text-sm text-muted-foreground font-mono mb-4">
                    <Clock className="w-4 h-4" />
                    {incident.timestamp}
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div className="p-3 bg-background/50 rounded-lg">
                      <div className="flex items-center gap-2 mb-1">
                        <Users className="w-4 h-4 text-primary" />
                        <p className="text-xs text-muted-foreground font-mono">Accounts</p>
                      </div>
                      <p className="text-lg font-bold text-foreground">{incident.accounts}</p>
                    </div>
                    
                    <div className="p-3 bg-background/50 rounded-lg">
                      <div className="flex items-center gap-2 mb-1">
                        <TrendingUp className="w-4 h-4 text-accent" />
                        <p className="text-xs text-muted-foreground font-mono">Reach</p>
                      </div>
                      <p className="text-lg font-bold text-accent">{incident.reach}</p>
                    </div>
                    
                    <div className="p-3 bg-background/50 rounded-lg">
                      <div className="flex items-center gap-2 mb-1">
                        <AlertTriangle className="w-4 h-4 text-warning" />
                        <p className="text-xs text-muted-foreground font-mono">Confidence</p>
                      </div>
                      <p className="text-lg font-bold text-primary">{incident.confidence}%</p>
                    </div>
                    
                    <div className="p-3 bg-background/50 rounded-lg">
                      <div className="flex items-center gap-2 mb-1">
                        <FileText className="w-4 h-4 text-success" />
                        <p className="text-xs text-muted-foreground font-mono">Evidence</p>
                      </div>
                      <p className="text-lg font-bold text-foreground">{incident.evidence}</p>
                    </div>
                  </div>

                  <div className="flex gap-2 flex-wrap">
                    {incident.platforms.map((platform) => (
                      <Badge key={platform} variant="outline" className="font-mono text-xs">
                        {platform}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <Button variant="default" className="font-mono flex-1">
                  <FileText className="w-4 h-4 mr-2" />
                  View Full Report
                </Button>
                <Button variant="outline" className="font-mono">
                  <Download className="w-4 h-4 mr-2" />
                  Download PDF
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Incidents;
