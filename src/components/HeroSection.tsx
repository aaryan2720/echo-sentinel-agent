import { Shield, Scan, Network, AlertTriangle } from "lucide-react";
import { Button } from "./ui/button";

export const HeroSection = () => {
  return (
    <section className="relative overflow-hidden py-20 px-4">
      {/* Animated scanning line */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/10 to-transparent animate-scan" />
      </div>

      <div className="container mx-auto relative z-10">
        <div className="text-center space-y-6 max-w-4xl mx-auto">
          {/* Status Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-card/50 border border-primary/30 backdrop-blur-sm">
            <div className="w-2 h-2 bg-success rounded-full animate-pulse-glow" />
            <span className="text-sm font-mono text-muted-foreground">AGENT STATUS: ACTIVE</span>
          </div>

          {/* Main Heading */}
          <div className="space-y-4">
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
              <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent animate-pulse-glow">
                EchoBreaker
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground font-light">
              Autonomous AI Agent for Deepfake & Propaganda Detection
            </p>
          </div>

          {/* Feature Pills */}
          <div className="flex flex-wrap justify-center gap-3 py-6">
            {[
              { icon: Scan, label: "Real-time Scanning" },
              { icon: Network, label: "Network Mapping" },
              { icon: Shield, label: "Deepfake Detection" },
              { icon: AlertTriangle, label: "Threat Analysis" },
            ].map(({ icon: Icon, label }) => (
              <div
                key={label}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-card/30 border border-primary/20 backdrop-blur-sm"
              >
                <Icon className="w-4 h-4 text-primary" />
                <span className="text-sm font-mono">{label}</span>
              </div>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-wrap justify-center gap-4">
            <Button
              size="lg"
              className="bg-primary text-primary-foreground hover:bg-primary/90 glow-primary font-mono"
            >
              View Live Dashboard
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-primary/30 hover:bg-primary/10 font-mono"
            >
              Documentation
            </Button>
          </div>

          {/* Live Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12 max-w-3xl mx-auto">
            {[
              { label: "Content Scanned", value: "1.2M+", status: "success" },
              { label: "Deepfakes Detected", value: "847", status: "warning" },
              { label: "Networks Mapped", value: "234", status: "primary" },
              { label: "Active Alerts", value: "12", status: "destructive" },
            ].map((metric) => (
              <div
                key={metric.label}
                className="p-4 rounded-lg bg-card/50 border border-border backdrop-blur-sm"
              >
                <div className={`text-2xl font-bold text-${metric.status}`}>
                  {metric.value}
                </div>
                <div className="text-xs text-muted-foreground font-mono mt-1">
                  {metric.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
