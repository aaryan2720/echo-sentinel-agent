import { HeroSection } from "@/components/HeroSection";
import { MonitoringDashboard } from "@/components/MonitoringDashboard";
import { NetworkGraph } from "@/components/NetworkGraph";
import { ThreatFeed } from "@/components/ThreatFeed";
import { PlatformStatus } from "@/components/PlatformStatus";
import { StatsOverview } from "@/components/StatsOverview";

const Index = () => {
  return (
    <div className="min-h-screen relative">
      {/* Ambient Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse-glow" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: '1s' }} />
      </div>

      <div className="relative z-10">
        <HeroSection />
        <StatsOverview />
        <div className="container mx-auto px-4 py-12 space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <MonitoringDashboard />
            </div>
            <div>
              <ThreatFeed />
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <NetworkGraph />
            <PlatformStatus />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
