import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/Logo";
import { DemoBanner } from "@/components/DemoBanner";
import { LastUpdated } from "@/components/LastUpdated";
import { LogOut, TrendingUp, Globe, Download } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useNotification } from "@/hooks/use-notification";

const Analytics = () => {
  const navigate = useNavigate();
  const { showSuccess, showInfo } = useNotification();

  const handleExportReport = () => {
    showInfo("Export Started", "Generating analytics report...");
    setTimeout(() => {
      showSuccess("Export Complete", "Analytics report has been downloaded successfully.");
    }, 1500);
  };

  const regions = [
    { name: "North America", threats: 1247, change: "+12%" },
    { name: "Europe", threats: 896, change: "+8%" },
    { name: "Asia Pacific", threats: 2341, change: "+23%" },
    { name: "Latin America", threats: 445, change: "-5%" },
    { name: "Middle East", threats: 678, change: "+15%" },
  ];

  const trends = [
    { topic: "Political Deepfakes", count: 3421, severity: "high" },
    { topic: "Financial Scams", count: 2156, severity: "high" },
    { topic: "Health Misinformation", count: 1879, severity: "medium" },
    { topic: "Synthetic Profiles", count: 1234, severity: "medium" },
    { topic: "Voice Cloning", count: 987, severity: "low" },
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
              <Button variant="default" className="font-mono hover-glow">
                Analytics
              </Button>
              <Button variant="ghost" onClick={() => navigate('/agents')} className="font-mono hover-lift">
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
              Analytics & Reports
            </h1>
            <p className="text-muted-foreground">Misinformation trends and geographic distribution</p>
          </div>
          <div className="flex items-center gap-4">
            <LastUpdated />
            <Button className="font-mono hover-lift" onClick={handleExportReport}>
              <Download className="w-4 h-4 mr-2" />
              Export Report
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <Card className="p-6 bg-card/50 backdrop-blur-sm border-primary/20 card-interactive">
            <div className="flex items-center gap-2 mb-4">
              <Globe className="w-5 h-5 text-primary" />
              <h2 className="text-xl font-bold text-primary font-mono">
                Geographic Distribution
              </h2>
            </div>
            
            <div className="space-y-3">
              {regions.map((region, idx) => (
                <div
                  key={region.name}
                  className="p-4 bg-background/50 rounded-lg border border-border animate-fade-in-up"
                  style={{ animationDelay: `${idx * 100}ms` }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-foreground">{region.name}</h3>
                    <Badge
                      variant={region.change.startsWith('+') ? 'destructive' : 'default'}
                      className="font-mono"
                    >
                      {region.change}
                    </Badge>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold text-primary">{region.threats}</span>
                    <span className="text-sm text-muted-foreground font-mono">threats detected</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-6 bg-card/50 backdrop-blur-sm border-primary/20 card-interactive">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-5 h-5 text-primary" />
              <h2 className="text-xl font-bold text-primary font-mono">
                Trending Threats
              </h2>
            </div>
            
            <div className="space-y-3">
              {trends.map((trend, idx) => (
                <div
                  key={trend.topic}
                  className="p-4 bg-background/50 rounded-lg border border-border hover:border-primary/50 transition-all animate-fade-in-up"
                  style={{ animationDelay: `${idx * 100}ms` }}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-semibold text-foreground mb-1">{trend.topic}</h3>
                      <p className="text-sm text-muted-foreground font-mono">
                        {trend.count} detections
                      </p>
                    </div>
                    <Badge
                      variant={
                        trend.severity === 'high'
                          ? 'destructive'
                          : trend.severity === 'medium'
                          ? 'default'
                          : 'outline'
                      }
                      className="font-mono"
                    >
                      {trend.severity}
                    </Badge>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary"
                      style={{ width: `${(trend.count / 3500) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Heatmap placeholder */}
        <Card className="p-6 bg-card/50 backdrop-blur-sm border-primary/20 card-interactive">
          <h2 className="text-xl font-bold text-primary font-mono mb-4">
            Global Misinformation Heatmap
          </h2>
          <div className="h-96 bg-background/30 rounded-lg border border-border flex items-center justify-center">
            <div className="text-center">
              <Globe className="w-16 h-16 text-primary/30 mx-auto mb-4 animate-pulse" />
              <p className="text-muted-foreground font-mono">Interactive map visualization</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Analytics;
