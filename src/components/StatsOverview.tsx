import { Card } from "./ui/card";
import { Shield, Eye, Network, TrendingUp } from "lucide-react";

const stats = [
  {
    label: "Content Monitored",
    value: "3.2M+",
    change: "+12.5%",
    icon: Eye,
    color: "primary",
  },
  {
    label: "Deepfakes Blocked",
    value: "1,847",
    change: "+8.2%",
    icon: Shield,
    color: "destructive",
  },
  {
    label: "Networks Mapped",
    value: "234",
    change: "+15.3%",
    icon: Network,
    color: "warning",
  },
  {
    label: "Trust Score",
    value: "94.2%",
    change: "+2.1%",
    icon: TrendingUp,
    color: "success",
  },
];

export const StatsOverview = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          
          return (
            <Card
              key={stat.label}
              className="p-6 bg-card/50 backdrop-blur-sm border-primary/20 hover:border-primary/50 transition-all group animate-fade-in-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground font-mono">
                    {stat.label}
                  </p>
                  <p className="text-3xl font-bold text-foreground group-hover:text-primary transition-colors">
                    {stat.value}
                  </p>
                  <div className="flex items-center gap-1">
                    <TrendingUp className="w-3 h-3 text-success" />
                    <span className="text-xs text-success font-mono">
                      {stat.change}
                    </span>
                  </div>
                </div>
                
                <div className={`p-3 rounded-lg bg-${stat.color}/10 border border-${stat.color}/30 group-hover:scale-110 transition-transform`}>
                  <Icon className={`w-6 h-6 text-${stat.color}`} />
                </div>
              </div>

              {/* Mini chart visualization */}
              <div className="mt-4 h-12 flex items-end gap-1">
                {[40, 60, 45, 75, 55, 80, 70, 90].map((height, idx) => (
                  <div
                    key={idx}
                    className={`flex-1 bg-${stat.color}/30 rounded-t transition-all group-hover:bg-${stat.color}/50`}
                    style={{
                      height: `${height}%`,
                      animationDelay: `${idx * 0.1}s`,
                    }}
                  />
                ))}
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
