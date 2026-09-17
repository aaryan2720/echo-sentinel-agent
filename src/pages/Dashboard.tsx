import { HeroSection } from "@/components/HeroSection";
import { MonitoringDashboard } from "@/components/MonitoringDashboard";
import { NetworkGraph } from "@/components/NetworkGraph";
import { ThreatFeed } from "@/components/ThreatFeed";
import { PlatformStatus } from "@/components/PlatformStatus";
import { StatsOverview } from "@/components/StatsOverview";
import { DemoBanner } from "@/components/DemoBanner";
import { LastUpdated } from "@/components/LastUpdated";
import { LiveDetectionFeed } from "@/components/LiveDetectionFeed";
import { HumanReviewInterface } from "@/components/HumanReviewInterface";
import { AgentCommunicationViz } from "@/components/AgentCommunicationViz";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/Logo";
import { LogOut, UserCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const Dashboard = () => {
  const navigate = useNavigate();
  const [isReviewOpen, setIsReviewOpen] = useState(false);

  return (
    <div className="min-h-screen relative">
      <DemoBanner />
      
      {/* Ambient Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse-glow" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: '1s' }} />
      </div>

      {/* Header */}
      <header className="relative z-10 container mx-auto px-4 py-4 border-b border-border/50 mt-12">
        <nav className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 cursor-pointer hover-lift" onClick={() => navigate('/dashboard')}>
              <Logo />
              <span className="text-2xl font-bold font-mono text-primary">EchoBreaker</span>
            </div>
            <div className="flex gap-4">
              <Button variant="default" className="font-mono hover-lift">
                Dashboard
              </Button>
              <Button variant="ghost" onClick={() => navigate('/analytics')} className="font-mono hover-glow">
                Analytics
              </Button>
              <Button variant="ghost" onClick={() => navigate('/agents')} className="font-mono hover-glow">
                Agents
              </Button>
              <Button variant="ghost" onClick={() => navigate('/network')} className="font-mono hover-glow">
                Network
              </Button>
              <Button variant="ghost" onClick={() => navigate('/incidents')} className="font-mono hover-glow">
                Incidents
              </Button>
              <Button variant="ghost" onClick={() => navigate('/alerts')} className="font-mono hover-glow">
                Alerts
              </Button>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <LastUpdated />
            <Button 
              variant="default" 
              onClick={() => setIsReviewOpen(true)}
              className="font-mono hover-lift bg-orange-600 hover:bg-orange-700"
            >
              <UserCheck className="w-4 h-4 mr-2" />
              Review Queue (5)
            </Button>
            <Button 
              variant="outline" 
              onClick={() => navigate('/')}
              className="font-mono hover-lift"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </nav>
      </header>

      <div className="relative z-10">
        <HeroSection />
        
        {/* Human Review Interface */}
        <HumanReviewInterface 
          isOpen={isReviewOpen}
          onClose={() => setIsReviewOpen(false)}
        />
        <StatsOverview />
        <div className="container mx-auto px-4 py-12 space-y-8">
          <LiveDetectionFeed />
          
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

          {/* Agent Communication Visualization */}
          <AgentCommunicationViz />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
