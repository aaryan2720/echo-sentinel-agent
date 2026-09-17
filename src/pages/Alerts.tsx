import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/Logo";
import { DemoBanner } from "@/components/DemoBanner";
import { LastUpdated } from "@/components/LastUpdated";
import { LogOut, Bell, CheckCircle, AlertCircle, Clock, TrendingUp } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useNotification } from "@/hooks/use-notification";

const Alerts = () => {
  const navigate = useNavigate();
  const { showSuccess, showWarning, showInfo } = useNotification();

  const handleAcknowledge = (alertId: number, title: string) => {
    showInfo("Alert Acknowledged", `Marking "${title}" as acknowledged...`);
    setTimeout(() => {
      showSuccess("Updated", "Alert status updated successfully.");
    }, 1000);
  };

  const handleInvestigate = (alertId: number, title: string) => {
    showWarning("Investigation Started", `Opening investigation workflow for "${title}"...`);
  };

  const alerts = [
    {
      id: 1,
      title: "Surge in coordinated deepfake posts detected",
      description: "Pattern analysis shows 47 accounts posting similar deepfake content within 15-minute window",
      timestamp: "2 minutes ago",
      severity: "critical",
      status: "unread",
      category: "Deepfake Detection",
      actionRequired: true,
    },
    {
      id: 2,
      title: "New bot network identified on Telegram",
      description: "GNN detected 89 accounts with synchronized behavior patterns",
      timestamp: "18 minutes ago",
      severity: "high",
      status: "unread",
      category: "Network Mapping",
      actionRequired: true,
    },
    {
      id: 3,
      title: "Audio clone attempt flagged",
      description: "Synthetic voice detected impersonating verified public figure",
      timestamp: "1 hour ago",
      severity: "high",
      status: "investigating",
      category: "Audio Analysis",
      actionRequired: false,
    },
    {
      id: 4,
      title: "Trending misinformation narrative detected",
      description: "Rapid spread of false claim across multiple platforms. 234 reshares in 30 minutes.",
      timestamp: "2 hours ago",
      severity: "medium",
      status: "investigating",
      category: "Pattern Recognition",
      actionRequired: false,
    },
    {
      id: 5,
      title: "Cross-platform coordination detected",
      description: "Same content template spread across X, Telegram, and WhatsApp by linked accounts",
      timestamp: "3 hours ago",
      severity: "high",
      status: "resolved",
      category: "Network Mapping",
      actionRequired: false,
    },
    {
      id: 6,
      title: "Image manipulation campaign identified",
      description: "Doctored images spreading with false context. Visual forensics confirms tampering.",
      timestamp: "5 hours ago",
      severity: "medium",
      status: "resolved",
      category: "Deepfake Detection",
      actionRequired: false,
    },
  ];

  const stats = [
    { label: "Active Alerts", value: "12", icon: AlertCircle, color: "destructive" },
    { label: "Resolved Today", value: "47", icon: CheckCircle, color: "success" },
    { label: "Avg Response Time", value: "8m", icon: Clock, color: "primary" },
    { label: "Critical", value: "3", icon: TrendingUp, color: "warning" },
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
              <Button variant="ghost" onClick={() => navigate('/network')} className="font-mono hover-lift">
                Network
              </Button>
              <Button variant="ghost" onClick={() => navigate('/incidents')} className="font-mono hover-lift">
                Incidents
              </Button>
              <Button variant="default" className="font-mono hover-glow">
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
              System Alerts
            </h1>
            <p className="text-muted-foreground">Real-time threat notifications and action items</p>
          </div>
          <LastUpdated />
        </div>

        <div className="flex justify-end gap-3 mb-6">
          <Button variant="outline" className="font-mono hover-lift">
            Mark All Read
          </Button>
          <Button className="font-mono hover-lift">
            <Bell className="w-4 h-4 mr-2" />
            Configure Alerts
          </Button>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, idx) => (
            <Card
              key={stat.label}
              className="p-4 bg-card/50 backdrop-blur-sm border-primary/20 animate-fade-in-up card-interactive"
              style={{ animationDelay: `${idx * 50}ms` }}
            >
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 bg-${stat.color}/10 rounded-lg flex items-center justify-center`}>
                  <stat.icon className={`w-6 h-6 text-${stat.color}`} />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground font-mono">{stat.label}</p>
                  <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Alerts List */}
        <div className="space-y-4">
          {alerts.map((alert, idx) => (
            <Card
              key={alert.id}
              className={`p-6 bg-card/50 backdrop-blur-sm border-primary/20 animate-fade-in-up hover:border-primary/40 transition-all card-interactive ${
                alert.status === 'unread' ? 'border-l-4 border-l-primary' : ''
              }`}
              style={{ animationDelay: `${idx * 50}ms` }}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <Badge
                      variant={
                        alert.severity === 'critical'
                          ? 'destructive'
                          : alert.severity === 'high'
                          ? 'default'
                          : 'outline'
                      }
                      className="font-mono"
                    >
                      {alert.severity}
                    </Badge>
                    <Badge variant="outline" className="font-mono text-xs">
                      {alert.category}
                    </Badge>
                    {alert.actionRequired && (
                      <Badge variant="default" className="bg-warning font-mono">
                        Action Required
                      </Badge>
                    )}
                    <span className="text-sm text-muted-foreground font-mono">{alert.timestamp}</span>
                  </div>
                  
                  <h3 className="text-xl font-bold text-foreground mb-2">{alert.title}</h3>
                  <p className="text-muted-foreground mb-4">{alert.description}</p>
                  
                  <div className="flex gap-3">
                    {alert.actionRequired && alert.status === 'unread' && (
                      <Button 
                        variant="default" 
                        size="sm" 
                        className="font-mono hover-lift"
                        onClick={() => handleInvestigate(alert.id, alert.title)}
                      >
                        Investigate
                      </Button>
                    )}
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="font-mono hover-lift"
                      onClick={() => handleAcknowledge(alert.id, alert.title)}
                    >
                      Acknowledge
                    </Button>
                  </div>
                </div>
                
                <div className={`ml-4 ${
                  alert.status === 'unread' 
                    ? 'w-3 h-3 bg-primary rounded-full animate-pulse-glow' 
                    : 'w-3 h-3 bg-muted rounded-full'
                }`} />
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Alerts;
