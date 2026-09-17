import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Video, Image, FileText, TrendingUp } from "lucide-react";
import { Progress } from "./ui/progress";

const detections = [
  {
    id: 1,
    type: "video",
    platform: "X (Twitter)",
    content: "Political deepfake video detected",
    confidence: 94,
    status: "threat-high",
    timestamp: "2 min ago",
  },
  {
    id: 2,
    type: "image",
    platform: "Telegram",
    content: "Manipulated protest image",
    confidence: 87,
    status: "threat-medium",
    timestamp: "5 min ago",
  },
  {
    id: 3,
    type: "text",
    platform: "Reddit",
    content: "Coordinated propaganda narrative",
    confidence: 91,
    status: "threat-high",
    timestamp: "8 min ago",
  },
  {
    id: 4,
    type: "video",
    platform: "YouTube",
    content: "Synthetic voice audio detected",
    confidence: 76,
    status: "threat-medium",
    timestamp: "12 min ago",
  },
  {
    id: 5,
    type: "image",
    platform: "X (Twitter)",
    content: "AI-generated profile images",
    confidence: 89,
    status: "threat-medium",
    timestamp: "15 min ago",
  },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case "threat-high":
      return "destructive";
    case "threat-medium":
      return "warning";
    default:
      return "success";
  }
};

const getIcon = (type: string) => {
  switch (type) {
    case "video":
      return Video;
    case "image":
      return Image;
    case "text":
      return FileText;
    default:
      return TrendingUp;
  }
};

export const MonitoringDashboard = () => {
  return (
    <Card className="p-6 bg-card/50 backdrop-blur-sm border-primary/20">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-primary font-mono">
            Real-time Detection Stream
          </h2>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-success rounded-full animate-pulse-glow" />
            <span className="text-sm text-muted-foreground font-mono">LIVE</span>
          </div>
        </div>

        <div className="space-y-3">
          {detections.map((detection, index) => {
            const Icon = getIcon(detection.type);
            const statusColor = getStatusColor(detection.status);
            
            return (
              <div
                key={detection.id}
                className="p-4 rounded-lg bg-background/50 border border-border hover:border-primary/50 transition-all group animate-fade-in-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex items-start gap-4">
                  <div className={`p-2 rounded-lg bg-${statusColor}/10 border border-${statusColor}/30`}>
                    <Icon className={`w-5 h-5 text-${statusColor}`} />
                  </div>
                  
                  <div className="flex-1 space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                          {detection.content}
                        </h3>
                        <p className="text-sm text-muted-foreground font-mono">
                          {detection.platform}
                        </p>
                      </div>
                      <Badge variant="outline" className="font-mono text-xs">
                        {detection.timestamp}
                      </Badge>
                    </div>
                    
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground font-mono">Confidence</span>
                        <span className={`font-bold text-${statusColor}`}>
                          {detection.confidence}%
                        </span>
                      </div>
                      <Progress 
                        value={detection.confidence} 
                        className="h-1.5"
                      />
                    </div>
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
