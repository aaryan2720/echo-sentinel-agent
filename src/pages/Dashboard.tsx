import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { MonitoringDashboard } from "@/components/MonitoringDashboard";
import { NetworkGraph } from "@/components/NetworkGraph";
import { ThreatFeed } from "@/components/ThreatFeed";
import { PlatformStatus } from "@/components/PlatformStatus";
import { StatsOverview } from "@/components/StatsOverview";
import { LiveDetectionFeed } from "@/components/LiveDetectionFeed";
import { AgentCommunicationViz } from "@/components/AgentCommunicationViz";
import { EnhancedDashboardOverview } from "@/components/EnhancedDashboardOverview";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Instagram, 
  Globe, 
  Video, 
  Database, 
  Cpu, 
  BookOpen, 
  Activity, 
  Terminal, 
  Sparkles,
  ExternalLink,
  ShieldCheck,
  Zap
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();

  return (
    <AppLayout
      title="Sentinel Threat Intelligence SOC"
      subtitle="Autonomous multimodal detection, propagation mapping, and live incident mitigation"
      actions={
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="font-mono text-xs text-primary border-primary/30 py-1 px-2.5">
            <span className="w-2 h-2 rounded-full bg-success mr-2 animate-pulse"></span>
            SOC Status: Operational
          </Badge>
          <Button
            size="sm"
            onClick={() => navigate("/incidents")}
            className="text-xs font-medium bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <ShieldCheck className="w-3.5 h-3.5 mr-1.5" />
            Active Incidents
          </Button>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Main Dashboard Navigation Tabs */}
        <Tabs defaultValue="overview" className="w-full">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <TabsList className="grid grid-cols-3 w-full sm:w-[480px] bg-secondary/60 border border-border/70 p-1">
              <TabsTrigger value="overview" className="text-xs sm:text-sm data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                Executive Overview
              </TabsTrigger>
              <TabsTrigger value="monitoring" className="text-xs sm:text-sm data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                Live Sentinel Feed
              </TabsTrigger>
              <TabsTrigger value="dev-tools" className="text-xs sm:text-sm data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                Forensics & Tools
              </TabsTrigger>
            </TabsList>

            <div className="hidden lg:flex items-center gap-2 text-xs text-muted-foreground font-mono">
              <span className="px-2 py-0.5 rounded bg-muted/60 border border-border/50">Model: ViT-B/16 + Whisper</span>
              <span className="px-2 py-0.5 rounded bg-muted/60 border border-border/50">Cluster Engine: GNN-GraphSAGE</span>
            </div>
          </div>

          {/* Tab 1: Executive Overview */}
          <TabsContent value="overview" className="space-y-6 outline-none">
            <EnhancedDashboardOverview />
          </TabsContent>

          {/* Tab 2: Live Monitoring */}
          <TabsContent value="monitoring" className="space-y-6 outline-none">
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

            {/* Agent Communication Graph */}
            <AgentCommunicationViz />
          </TabsContent>

          {/* Tab 3: Development & Testing Tools */}
          <TabsContent value="dev-tools" className="space-y-6 outline-none">
            <div className="p-6 rounded-xl bg-card/60 border border-border/70 backdrop-blur-sm space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border/60">
                <div>
                  <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                    <Terminal className="w-5 h-5 text-primary" />
                    Forensic Verification & Diagnostics Suite
                  </h2>
                  <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
                    Direct access to multimodal test harnesses, scrapers, model endpoints, and database inspectors
                  </p>
                </div>
                <Badge variant="outline" className="w-fit text-xs font-mono text-primary border-primary/30">
                  Dev Environment
                </Badge>
              </div>

              {/* Forensic & Monitoring Tools Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Instagram Monitoring */}
                <div
                  onClick={() => navigate("/instagram-monitoring")}
                  className="soc-card rounded-xl p-5 cursor-pointer hover-lift flex flex-col justify-between group"
                >
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between">
                      <div className="p-2 rounded-lg bg-pink-500/10 text-pink-400 border border-pink-500/20">
                        <Instagram className="w-5 h-5" />
                      </div>
                      <Badge className="bg-pink-500/20 text-pink-300 border-pink-500/30 text-[10px]">
                        Phase 1 Ready
                      </Badge>
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">
                        Instagram Live Monitor
                      </h3>
                      <p className="text-xs text-muted-foreground mt-1">
                        Automated hashtag polling, synthetic media scanner & instant incident filing.
                      </p>
                    </div>
                  </div>
                  <div className="pt-3 mt-3 border-t border-border/40 text-[11px] text-primary flex items-center gap-1 font-medium">
                    Open Inspector →
                  </div>
                </div>

                {/* URL Analysis */}
                <div
                  onClick={() => navigate("/url-analysis")}
                  className="soc-card rounded-xl p-5 cursor-pointer hover-lift flex flex-col justify-between group"
                >
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between">
                      <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20">
                        <Globe className="w-5 h-5" />
                      </div>
                      <span className="text-[10px] font-mono text-muted-foreground">yt-dlp Engine</span>
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">
                        Social URL Forensics
                      </h3>
                      <p className="text-xs text-muted-foreground mt-1">
                        Extract media streams from YouTube, X, TikTok and test deepfake authenticity.
                      </p>
                    </div>
                  </div>
                  <div className="pt-3 mt-3 border-t border-border/40 text-[11px] text-primary flex items-center gap-1 font-medium">
                    Analyze URL →
                  </div>
                </div>

                {/* Visual Testing */}
                <div
                  onClick={() => navigate("/visual-test")}
                  className="soc-card rounded-xl p-5 cursor-pointer hover-lift flex flex-col justify-between group"
                >
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between">
                      <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400 border border-purple-500/20">
                        <Video className="w-5 h-5" />
                      </div>
                      <span className="text-[10px] font-mono text-muted-foreground">Frame Analysis</span>
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">
                        ViT Deepfake Forensics
                      </h3>
                      <p className="text-xs text-muted-foreground mt-1">
                        Frame-by-frame visual manipulation artifacts and temporal coherence inspector.
                      </p>
                    </div>
                  </div>
                  <div className="pt-3 mt-3 border-t border-border/40 text-[11px] text-primary flex items-center gap-1 font-medium">
                    Test Video →
                  </div>
                </div>

                {/* Database Testing */}
                <div
                  onClick={() => navigate("/db-test")}
                  className="soc-card rounded-xl p-5 cursor-pointer hover-lift flex flex-col justify-between group"
                >
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between">
                      <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        <Database className="w-5 h-5" />
                      </div>
                      <span className="text-[10px] font-mono text-muted-foreground">Supabase</span>
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">
                        Database Telemetry
                      </h3>
                      <p className="text-xs text-muted-foreground mt-1">
                        Validate schemas, inspect incidents table, query agent logs, and seed mock data.
                      </p>
                    </div>
                  </div>
                  <div className="pt-3 mt-3 border-t border-border/40 text-[11px] text-primary flex items-center gap-1 font-medium">
                    View Tables →
                  </div>
                </div>

                {/* Agent Communication Testing */}
                <div
                  onClick={() => navigate("/agent-test")}
                  className="soc-card rounded-xl p-5 cursor-pointer hover-lift flex flex-col justify-between group"
                >
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between">
                      <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
                        <Cpu className="w-5 h-5" />
                      </div>
                      <span className="text-[10px] font-mono text-muted-foreground">Bus Inspector</span>
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">
                        Multi-Agent Testing
                      </h3>
                      <p className="text-xs text-muted-foreground mt-1">
                        Simulate message pass between monitoring, detector, attribution, and reporting agents.
                      </p>
                    </div>
                  </div>
                  <div className="pt-3 mt-3 border-t border-border/40 text-[11px] text-primary flex items-center gap-1 font-medium">
                    Run Simulation →
                  </div>
                </div>

                {/* System Status Dashboard */}
                <div
                  onClick={() => navigate("/system-status")}
                  className="soc-card rounded-xl p-5 cursor-pointer hover-lift flex flex-col justify-between group"
                >
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between">
                      <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                        <Activity className="w-5 h-5" />
                      </div>
                      <span className="text-[10px] font-mono text-muted-foreground">Endpoints</span>
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">
                        System Health & Latency
                      </h3>
                      <p className="text-xs text-muted-foreground mt-1">
                        Comprehensive ping dashboard across API routes, ML models, and storage endpoints.
                      </p>
                    </div>
                  </div>
                  <div className="pt-3 mt-3 border-t border-border/40 text-[11px] text-primary flex items-center gap-1 font-medium">
                    Ping Services →
                  </div>
                </div>
              </div>

              {/* Quick Documentation & External Actions */}
              <div className="p-4 rounded-lg bg-background/50 border border-border/60 flex flex-wrap items-center justify-between gap-3">
                <div className="text-xs text-muted-foreground">
                  Need raw API specifications or model inference documentation?
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <Button
                    onClick={() => window.open("http://localhost:8001/docs", "_blank")}
                    variant="outline"
                    size="sm"
                    className="text-xs gap-1.5"
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    Swagger OpenAPI
                    <ExternalLink className="w-3 h-3 opacity-60" />
                  </Button>
                  <Button
                    onClick={() => window.open("http://localhost:8001/redoc", "_blank")}
                    variant="outline"
                    size="sm"
                    className="text-xs gap-1.5"
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    ReDoc API
                    <ExternalLink className="w-3 h-3 opacity-60" />
                  </Button>
                  <Button
                    onClick={() => navigate("/settings")}
                    variant="secondary"
                    size="sm"
                    className="text-xs gap-1.5"
                  >
                    Config Settings
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}

// EchoBreaker Sentinel (AI-03)
