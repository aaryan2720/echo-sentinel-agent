import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Activity, Twitter, Youtube, MessageCircle, Send } from "lucide-react";

const platforms = [
  {
    name: "X (Twitter)",
    icon: Twitter,
    status: "active",
    scanned: "1.2M",
    threats: 234,
    lastUpdate: "2s ago",
  },
  {
    name: "YouTube",
    icon: Youtube,
    status: "active",
    scanned: "847K",
    threats: 156,
    lastUpdate: "5s ago",
  },
  {
    name: "Telegram",
    icon: Send,
    status: "active",
    scanned: "623K",
    threats: 89,
    lastUpdate: "3s ago",
  },
  {
    name: "Reddit",
    icon: MessageCircle,
    status: "scanning",
    scanned: "445K",
    threats: 67,
    lastUpdate: "1s ago",
  },
];

export const PlatformStatus = () => {
  return (
    <Card className="p-6 bg-card/50 backdrop-blur-sm border-primary/20">
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-primary" />
          <h2 className="text-xl font-bold text-primary font-mono">
            Platform Monitoring
          </h2>
        </div>

        <div className="space-y-3">
          {platforms.map((platform, index) => {
            const Icon = platform.icon;
            const isActive = platform.status === "active";
            
            return (
              <div
                key={platform.name}
                className="p-4 rounded-lg bg-background/50 border border-border hover:border-primary/50 transition-all animate-fade-in-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/10 border border-primary/30">
                      <Icon className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">
                        {platform.name}
                      </h3>
                      <p className="text-xs text-muted-foreground font-mono">
                        Updated {platform.lastUpdate}
                      </p>
                    </div>
                  </div>
                  
                  <Badge
                    variant={isActive ? "default" : "outline"}
                    className={`font-mono ${isActive ? "bg-success text-success-foreground" : "animate-pulse"}`}
                  >
                    {platform.status}
                  </Badge>
                </div>

                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="p-2 rounded bg-muted/30">
                    <p className="text-xs text-muted-foreground font-mono">Scanned</p>
                    <p className="font-bold text-foreground">{platform.scanned}</p>
                  </div>
                  <div className="p-2 rounded bg-destructive/10">
                    <p className="text-xs text-muted-foreground font-mono">Threats</p>
                    <p className="font-bold text-destructive">{platform.threats}</p>
                  </div>
                </div>

                {/* Progress indicator */}
                <div className="mt-3 h-1 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary animate-scan"
                    style={{ width: "100%" }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Card>
  );
};
