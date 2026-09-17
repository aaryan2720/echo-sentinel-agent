import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  TrendingUp, 
  Globe, 
  Download, 
  BarChart3, 
  Radio, 
  Layers, 
  PieChart, 
  ShieldAlert, 
  Target,
  Users,
  MapPin,
  Calendar
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useNotification } from "@/hooks/use-notification";

export default function Analytics() {
  const navigate = useNavigate();
  const { showSuccess, showInfo } = useNotification();
  const [selectedTimeframe, setSelectedTimeframe] = useState("7d");

  const handleExportReport = () => {
    showInfo("Export Started", "Compiling cross-platform analytics telemetry dossier...");
    setTimeout(() => {
      showSuccess("Export Complete", "Analytics report (PDF + CSV) downloaded successfully.");
    }, 1200);
  };

  const regions = [
    { name: "Asia Pacific", threats: 2341, change: "+23%", percent: 42, topVector: "Deepfake Video" },
    { name: "North America", threats: 1247, change: "+12%", percent: 22, topVector: "Audio Voice Clone" },
    { name: "Europe", threats: 896, change: "+8%", percent: 16, topVector: "Coordinated Bots" },
    { name: "Middle East", threats: 678, change: "+15%", percent: 12, topVector: "Doctored Images" },
    { name: "Latin America", threats: 445, change: "-5%", percent: 8, topVector: "Meme Networks" },
  ];

  const trends = [
    { topic: "Political Deepfake Speeches", count: 3421, severity: "high", change: "+42%", percentage: 94 },
    { topic: "Synthetic CEO Voice Scams", count: 2156, severity: "high", change: "+28%", percentage: 68 },
    { topic: "Vaccine & Health Misinformation", count: 1879, severity: "medium", change: "+12%", percentage: 55 },
    { topic: "AI-Generated Astroturf Profiles", count: 1234, severity: "medium", change: "-4%", percentage: 38 },
    { topic: "Manipulated Crisis Footage", count: 987, severity: "low", change: "+6%", percentage: 29 },
  ];

  const platformBreakdown = [
    { platform: "X (Twitter)", share: 38, count: "4,120", color: "bg-blue-500" },
    { platform: "Telegram", share: 29, count: "3,145", color: "bg-cyan-500" },
    { platform: "TikTok", share: 18, count: "1,950", color: "bg-pink-500" },
    { platform: "YouTube Shorts", share: 15, count: "1,620", color: "bg-red-500" },
  ];

  return (
    <AppLayout
      title="Threat Intelligence & Analytics"
      subtitle="Macro trends, geographic threat concentration, vector analysis, and cross-platform propagation velocity"
      actions={
        <div className="flex items-center gap-2">
          {/* Timeframe Selector */}
          <div className="flex items-center gap-1 bg-secondary/50 p-1 rounded-lg border border-border text-xs">
            {["24h", "7d", "30d", "90d"].map((tf) => (
              <button
                key={tf}
                onClick={() => setSelectedTimeframe(tf)}
                className={`px-2.5 py-1 rounded-md transition-all ${
                  selectedTimeframe === tf
                    ? "bg-primary text-primary-foreground font-semibold"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {tf}
              </button>
            ))}
          </div>

          <Button
            size="sm"
            onClick={handleExportReport}
            className="text-xs font-medium bg-primary text-primary-foreground hover:bg-primary/90 gap-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            Export Executive Report
          </Button>
        </div>
      }
    >
      <div className="space-y-6">
        {/* KPI Strip */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="soc-card rounded-xl p-4 hover-lift">
            <div className="text-xs text-muted-foreground font-mono">Total Threats Flagged</div>
            <div className="text-2xl font-bold font-data text-foreground mt-1">10,835</div>
            <div className="text-[11px] text-destructive mt-1 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" /> +14.2% vs previous period
            </div>
          </div>

          <div className="soc-card rounded-xl p-4 hover-lift">
            <div className="text-xs text-muted-foreground font-mono">Deepfake Video Ratio</div>
            <div className="text-2xl font-bold font-data text-accent mt-1">54.8%</div>
            <div className="text-[11px] text-muted-foreground mt-1">Leading attack vector</div>
          </div>

          <div className="soc-card rounded-xl p-4 hover-lift">
            <div className="text-xs text-muted-foreground font-mono">Avg Propagation Velocity</div>
            <div className="text-2xl font-bold font-data text-foreground mt-1">340 reshares/hr</div>
            <div className="text-[11px] text-warning mt-1">High viral potential</div>
          </div>

          <div className="soc-card rounded-xl p-4 hover-lift">
            <div className="text-xs text-muted-foreground font-mono">Automated Mitigations</div>
            <div className="text-2xl font-bold font-data text-success mt-1">92.4%</div>
            <div className="text-[11px] text-success mt-1">Dispatched to partners</div>
          </div>
        </div>

        {/* Geographic & Trending Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Geographic Distribution */}
          <div className="soc-card rounded-xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-border/50">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-primary/10 text-primary">
                  <Globe className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-foreground">Geographic Concentration</h3>
                  <p className="text-[11px] text-muted-foreground">Threat origins & targeting hotspots</p>
                </div>
              </div>
              <Badge variant="outline" className="text-[10px] font-mono">
                5 Major Regions
              </Badge>
            </div>

            <div className="space-y-3.5">
              {regions.map((region) => (
                <div key={region.name} className="space-y-1.5 text-xs">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-foreground">{region.name}</span>
                      <span className="text-[10px] text-muted-foreground font-mono">({region.topVector})</span>
                    </div>
                    <div className="flex items-center gap-2 font-mono">
                      <span className="text-foreground font-bold">{region.threats.toLocaleString()}</span>
                      <span className={`text-[10px] ${region.change.startsWith("+") ? "text-destructive" : "text-success"}`}>
                        {region.change}
                      </span>
                    </div>
                  </div>
                  <div className="h-1.5 w-full bg-secondary/80 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full transition-all duration-500"
                      style={{ width: `${region.percent * 2.2}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Trending Narratives */}
          <div className="soc-card rounded-xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-border/50">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-warning/10 text-warning">
                  <TrendingUp className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-foreground">Top Misinformation Topics</h3>
                  <p className="text-[11px] text-muted-foreground">Narratives with highest amplification velocity</p>
                </div>
              </div>
              <span className="text-[10px] font-mono text-muted-foreground">Ranked by volume</span>
            </div>

            <div className="space-y-3">
              {trends.map((trend) => (
                <div
                  key={trend.topic}
                  className="p-3 rounded-lg bg-secondary/40 border border-border/50 hover:border-primary/40 transition-all space-y-2 text-xs"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="font-bold text-foreground line-clamp-1">{trend.topic}</div>
                      <div className="text-[11px] text-muted-foreground font-mono mt-0.5">
                        {trend.count.toLocaleString()} detections • {trend.change} surge
                      </div>
                    </div>
                    <Badge
                      className={`text-[9px] font-mono uppercase ${
                        trend.severity === "high"
                          ? "bg-destructive/20 text-destructive border-destructive/30"
                          : "bg-warning/20 text-warning border-warning/30"
                      }`}
                    >
                      {trend.severity}
                    </Badge>
                  </div>

                  <div className="h-1 w-full bg-secondary rounded-full overflow-hidden">
                    <div
                      className="h-full bg-accent rounded-full"
                      style={{ width: `${trend.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Platform Share Breakdown */}
        <div className="soc-card rounded-xl p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-border/50">
            <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-primary" />
              Cross-Platform Ingestion Breakdown
            </h3>
            <span className="text-xs text-muted-foreground font-mono">10,835 Total Signals</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {platformBreakdown.map((p) => (
              <div key={p.platform} className="p-3.5 rounded-lg bg-secondary/40 border border-border/60">
                <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                  <span>{p.platform}</span>
                  <span className="font-mono font-bold text-foreground">{p.share}%</span>
                </div>
                <div className="text-lg font-bold font-data text-foreground">{p.count}</div>
                <div className="h-1.5 w-full bg-secondary mt-2 rounded-full overflow-hidden">
                  <div className={`h-full ${p.color} rounded-full`} style={{ width: `${p.share * 2}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
