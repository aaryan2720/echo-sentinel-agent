import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/Logo";
import { DemoBanner } from "@/components/DemoBanner";
import { LastUpdated } from "@/components/LastUpdated";
import { InteractiveNetworkGraph } from "@/components/InteractiveNetworkGraph";
import { LogOut, Network as NetworkIcon, Users, Share2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useNotification } from "@/hooks/use-notification";

const Network = () => {
  const navigate = useNavigate();
  const { showSuccess, showInfo } = useNotification();

  const handleExportNetwork = (clusterId: number, clusterName: string) => {
    showInfo("Export Started", `Exporting network graph for ${clusterName}...`);
    setTimeout(() => {
      showSuccess("Export Complete", "Network topology data exported successfully.");
    }, 1500);
  };

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
              <Button variant="ghost" onClick={() => navigate('/agents')} className="font-mono hover-lift">
                Agents
              </Button>
              <Button variant="default" className="font-mono hover-glow">
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
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold mb-2 font-mono text-primary">
                Network Analysis
              </h1>
              <p className="text-muted-foreground">Coordinated influence operations and bot networks</p>
            </div>
            <LastUpdated />
          </div>
        </div>

        {/* Large Network Graph */}
        <Card className="p-6 bg-card/50 backdrop-blur-sm border-primary/20 mb-6 card-interactive">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <NetworkIcon className="w-5 h-5 text-primary" />
              <h2 className="text-xl font-bold text-primary font-mono">
                Interactive Network Graph
              </h2>
            </div>
            <Badge variant="outline" className="font-mono">
              23 Nodes • 31 Connections
            </Badge>
          </div>

          <InteractiveNetworkGraph />
        </Card>

        {/* Cluster Details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {clusters.map((cluster, idx) => (
            <Card
              key={cluster.id}
              className="p-6 bg-card/50 backdrop-blur-sm border-primary/20 animate-fade-in-up card-interactive"
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

              <Button 
                variant="outline" 
                className="w-full mt-4 font-mono hover-lift"
                onClick={() => handleExportNetwork(cluster.id, cluster.name)}
              >
                <Share2 className="w-4 h-4 mr-2" />
                Export Network
              </Button>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Network;
