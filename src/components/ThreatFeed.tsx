import { Card } from "./ui/card";
import { AlertTriangle, AlertCircle, Info } from "lucide-react";
import { Badge } from "./ui/badge";

const alerts = [
  {
    id: 1,
    type: "critical",
    title: "Large-scale propaganda campaign",
    description: "187 coordinated accounts detected",
    timestamp: "Just now",
  },
  {
    id: 2,
    type: "warning",
    title: "Deepfake video spreading",
    description: "Viral on X, 45K shares in 2 hours",
    timestamp: "3 min ago",
  },
  {
    id: 3,
    type: "info",
    title: "Network pattern identified",
    description: "Similar to previous campaign",
    timestamp: "12 min ago",
  },
  {
    id: 4,
    type: "critical",
    title: "Synthetic media cluster",
    description: "AI-generated images spreading",
    timestamp: "18 min ago",
  },
  {
    id: 5,
    type: "warning",
    title: "Voice cloning detected",
    description: "Celebrity voice manipulated",
    timestamp: "25 min ago",
  },
];

export const ThreatFeed = () => {
  const getAlertIcon = (type: string) => {
    switch (type) {
      case "critical":
        return AlertTriangle;
      case "warning":
        return AlertCircle;
      default:
        return Info;
    }
  };

  const getAlertColor = (type: string) => {
    switch (type) {
      case "critical":
        return "destructive";
      case "warning":
        return "warning";
      default:
        return "primary";
    }
  };

  return (
    <Card className="p-6 bg-card/50 backdrop-blur-sm border-primary/20 h-full">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-primary font-mono">
            Active Alerts
          </h2>
          <Badge variant="destructive" className="font-mono animate-pulse-glow">
            12 Active
          </Badge>
        </div>

        <div className="space-y-3 max-h-[600px] overflow-y-auto">
          {alerts.map((alert, index) => {
            const Icon = getAlertIcon(alert.type);
            const color = getAlertColor(alert.type);
            
            return (
              <div
                key={alert.id}
                className="p-3 rounded-lg bg-background/50 border border-border hover:border-primary/50 transition-all cursor-pointer group animate-fade-in-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-lg bg-${color}/10 border border-${color}/30 group-hover:scale-110 transition-transform`}>
                    <Icon className={`w-4 h-4 text-${color}`} />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-sm text-foreground group-hover:text-primary transition-colors">
                      {alert.title}
                    </h3>
                    <p className="text-xs text-muted-foreground mt-1">
                      {alert.description}
                    </p>
                    <p className="text-xs text-muted-foreground/60 mt-1 font-mono">
                      {alert.timestamp}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Card>
  );
};
