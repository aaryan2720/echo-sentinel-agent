import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/Logo";
import { LogOut, Network as NetworkIcon, Users, Share2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Network = () => {
  const navigate = useNavigate();

  const clusters = [
    {
      id: 1,
      name: "Political Disinformation Network",
      accounts: 187,
      posts: 3421,
      reach: "2.4M",
      threat: "critical",
    },
    {
      id: 2,
      name: "Deepfake Sharing Ring",
      accounts: 92,
      posts: 1567,
      reach: "890K",
      threat: "high",
    },
    {
      id: 3,
      name: "Coordinated Amplification Group",
      accounts: 234,
      posts: 5678,
      reach: "4.1M",
      threat: "critical",
    },
    {
      id: 4,
      name: "Synthetic Profile Cluster",
      accounts: 145,
      posts: 2134,
      reach: "1.2M",
      threat: "medium",
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
              <Button variant="default" className="font-mono">
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
            Network Analysis
          </h1>
          <p className="text-muted-foreground">Coordinated influence operations and bot networks</p>
        </div>

        {/* Large Network Graph */}
        <Card className="p-6 bg-card/50 backdrop-blur-sm border-primary/20 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <NetworkIcon className="w-5 h-5 text-primary" />
              <h2 className="text-xl font-bold text-primary font-mono">
                Interactive Network Graph
              </h2>
            </div>
            <Badge variant="outline" className="font-mono">
              658 Networks Detected
            </Badge>
          </div>

          <div className="h-[500px] bg-background/30 rounded-lg border border-border flex items-center justify-center relative overflow-hidden">
            {/* Enhanced network visualization */}
            <svg className="absolute inset-0 w-full h-full" style={{ zIndex: 1 }}>
              {/* Central cluster */}
              <circle cx="400" cy="250" r="60" fill="hsl(0 85% 60% / 0.2)" stroke="hsl(0 85% 60%)" strokeWidth="2" className="animate-pulse" />
              <circle cx="400" cy="250" r="12" fill="hsl(0 85% 60%)" />
              
              {/* Satellite nodes */}
              {[...Array(12)].map((_, i) => {
                const angle = (i * 30) * (Math.PI / 180);
                const radius = 120 + Math.random() * 80;
                const x = 400 + Math.cos(angle) * radius;
                const y = 250 + Math.sin(angle) * radius;
                const size = 6 + Math.random() * 6;
                
                return (
                  <g key={i}>
                    <line
                      x1="400"
                      y1="250"
                      x2={x}
                      y2={y}
                      stroke="hsl(180 100% 50% / 0.3)"
                      strokeWidth="1"
                      className="animate-pulse"
                    />
                    <circle
                      cx={x}
                      cy={y}
                      r={size}
                      fill={i % 3 === 0 ? "hsl(0 85% 60%)" : i % 3 === 1 ? "hsl(30 100% 55%)" : "hsl(145 80% 50%)"}
                      className="animate-pulse-glow cursor-pointer"
                      style={{ animationDelay: `${i * 0.15}s` }}
                    />
                  </g>
                );
              })}
            </svg>
            
            <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-accent/5 animate-pulse pointer-events-none" />
          </div>
        </Card>

        {/* Cluster Details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {clusters.map((cluster, idx) => (
            <Card
              key={cluster.id}
              className="p-6 bg-card/50 backdrop-blur-sm border-primary/20 animate-fade-in-up"
              style={{ animationDelay: `${idx * 100}ms` }}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-3">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center border ${
                    cluster.threat === 'critical' 
                      ? 'bg-destructive/10 border-destructive/30' 
                      : cluster.threat === 'high'
                      ? 'bg-warning/10 border-warning/30'
                      : 'bg-primary/10 border-primary/30'
                  }`}>
                    <Users className={`w-6 h-6 ${
                      cluster.threat === 'critical' 
                        ? 'text-destructive' 
                        : cluster.threat === 'high'
                        ? 'text-warning'
                        : 'text-primary'
                    }`} />
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground mb-1">{cluster.name}</h3>
                    <p className="text-sm text-muted-foreground font-mono">
                      Network ID: #{cluster.id}
                    </p>
                  </div>
                </div>
                <Badge
                  variant={cluster.threat === 'critical' ? 'destructive' : cluster.threat === 'high' ? 'default' : 'outline'}
                  className="font-mono"
                >
                  {cluster.threat}
                </Badge>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="p-3 bg-background/50 rounded-lg">
                  <p className="text-xs text-muted-foreground font-mono mb-1">Accounts</p>
                  <p className="text-lg font-bold text-foreground">{cluster.accounts}</p>
                </div>
                <div className="p-3 bg-background/50 rounded-lg">
                  <p className="text-xs text-muted-foreground font-mono mb-1">Posts</p>
                  <p className="text-lg font-bold text-primary">{cluster.posts}</p>
                </div>
                <div className="p-3 bg-background/50 rounded-lg">
                  <p className="text-xs text-muted-foreground font-mono mb-1">Reach</p>
                  <p className="text-lg font-bold text-accent">{cluster.reach}</p>
                </div>
              </div>

              <Button variant="outline" className="w-full mt-4 font-mono">
                <Share2 className="w-4 h-4 mr-2" />
                View Details
              </Button>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Network;
