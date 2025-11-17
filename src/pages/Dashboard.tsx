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
import { EnhancedDashboardOverview } from "@/components/EnhancedDashboardOverview";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/Logo";
import { LogOut, UserCheck, Instagram } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
              <Button variant="ghost" onClick={() => navigate('/instagram-monitoring')} className="font-mono hover-glow">
                Instagram
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
        {/* Human Review Interface */}
        <HumanReviewInterface 
          isOpen={isReviewOpen}
          onClose={() => setIsReviewOpen(false)}
        />

        {/* Main Dashboard Content with Tabs */}
        <div className="container mx-auto px-4 py-8">
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger value="overview" className="text-lg">🚀 Phase 1 Overview</TabsTrigger>
              <TabsTrigger value="monitoring" className="text-lg">📊 Live Monitoring</TabsTrigger>
              <TabsTrigger value="dev-tools" className="text-lg">🔧 Dev Tools</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-8">
              <EnhancedDashboardOverview />
            </TabsContent>

            <TabsContent value="monitoring" className="space-y-8">
              <StatsOverview />
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
            </TabsContent>

            <TabsContent value="dev-tools" className="space-y-8">
              {/* Development & Testing Tools */}
              <div className="bg-gradient-to-br from-card/30 to-card/50 border border-border/30 rounded-lg p-8">
                <h2 className="text-3xl font-bold text-center mb-6 gradient-text">🚀 Development & Testing Tools</h2>
                <p className="text-center text-muted-foreground mb-6">Quick access to all testing capabilities and system monitoring</p>
              
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {/* Instagram Monitoring - NEW Phase 1 Feature! */}
                  <Button
                    onClick={() => navigate('/instagram-monitoring')}
                    className="h-24 flex flex-col items-center justify-center gap-2 bg-gradient-to-br from-pink-600 to-pink-700 hover:from-pink-700 hover:to-pink-800 text-white border-0 hover-lift relative"
                  >
                    <div className="absolute top-1 right-1 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                      NEW!
                    </div>
                    <Instagram className="w-6 h-6" />
                    <span className="text-lg font-bold">Instagram Monitor</span>
                    <span className="text-sm opacity-90">Auto Hashtag Detection</span>
                  </Button>

                  {/* URL Analysis */}
                  <Button
                    onClick={() => navigate('/url-analysis')}
                    className="h-24 flex flex-col items-center justify-center gap-2 bg-gradient-to-br from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white border-0 hover-lift"
                  >
                    <span className="text-lg font-bold">🎬 URL Analysis</span>
                    <span className="text-sm opacity-90">Social Media Deepfake Detection</span>
                  </Button>

                  {/* Video Testing */}
                  <Button
                    onClick={() => navigate('/visual-test')}
                    className="h-24 flex flex-col items-center justify-center gap-2 bg-gradient-to-br from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white border-0 hover-lift"
                  >
                    <span className="text-lg font-bold">🎥 Video Testing</span>
                    <span className="text-sm opacity-90">Visual Analysis Agent</span>
                  </Button>

                  {/* Database Testing */}
                  <Button
                    onClick={() => navigate('/db-test')}
                    className="h-24 flex flex-col items-center justify-center gap-2 bg-gradient-to-br from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white border-0 hover-lift"
                  >
                    <span className="text-lg font-bold">🗄️ Database Test</span>
                    <span className="text-sm opacity-90">Supabase Integration</span>
                  </Button>

                  {/* Agent Testing */}
                  <Button
                    onClick={() => navigate('/agent-test')}
                    className="h-24 flex flex-col items-center justify-center gap-2 bg-gradient-to-br from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white border-0 hover-lift"
                  >
                    <span className="text-lg font-bold">🤖 Agent Test</span>
                    <span className="text-sm opacity-90">Agent Communication</span>
                  </Button>

                  {/* Backend API Documentation */}
                  <Button
                    onClick={() => window.open('http://localhost:8001/docs', '_blank')}
                    className="h-24 flex flex-col items-center justify-center gap-2 bg-gradient-to-br from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white border-0 hover-lift"
                  >
                    <span className="text-lg font-bold">📚 API Docs</span>
                    <span className="text-sm opacity-90">FastAPI Documentation</span>
                  </Button>

                  {/* Backend Health Check */}
                  <Button
                    onClick={() => window.open('http://localhost:8001/api/models', '_blank')}
                    className="h-24 flex flex-col items-center justify-center gap-2 bg-gradient-to-br from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white border-0 hover-lift"
                  >
                    <span className="text-lg font-bold">⚡ Backend Status</span>
                    <span className="text-sm opacity-90">Models & Health Check</span>
                  </Button>

                  {/* System Status Dashboard */}
                  <Button
                    onClick={() => navigate('/system-status')}
                    className="h-24 flex flex-col items-center justify-center gap-2 bg-gradient-to-br from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white border-0 hover-lift"
                  >
                    <span className="text-lg font-bold">📊 System Status</span>
                    <span className="text-sm opacity-90">All Endpoints & Tools</span>
                  </Button>
                </div>

                {/* Additional Quick Actions */}
                <div className="mt-6 p-4 bg-card/50 rounded-lg border border-border/50">
                  <h3 className="font-semibold mb-3">Quick Actions</h3>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      onClick={() => window.open('http://localhost:8001/redoc', '_blank')}
                      variant="outline"
                      size="sm"
                      className="hover-glow"
                    >
                      📖 ReDoc API
                    </Button>
                    <Button
                      onClick={() => navigate('/settings')}
                      variant="outline"
                      size="sm"
                      className="hover-glow"
                    >
                      ⚙️ Settings
                    </Button>
                    <Button
                      onClick={() => window.open('https://github.com/aaryan2720/echo-sentinel-agent', '_blank')}
                      variant="outline"
                      size="sm"
                      className="hover-glow"
                    >
                      🐙 GitHub Repo
                    </Button>
                    <Button
                      onClick={() => window.open('http://localhost:5173', '_blank')}
                      variant="outline"
                      size="sm"
                      className="hover-glow"
                    >
                      🏠 Landing Page
                    </Button>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};



export default Dashboard;
