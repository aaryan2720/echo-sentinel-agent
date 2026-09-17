import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { InteractiveNetworkGraph } from "@/components/InteractiveNetworkGraph";
import { 
  Network as NetworkIcon, 
  Users, 
  Share2, 
  Download, 
  ShieldAlert, 
  Layers, 
  Sparkles,
  Info,
  Radio
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useNotification } from "@/hooks/use-notification";

export default function Network() {
  const navigate = useNavigate();
  const { showSuccess, showInfo } = useNotification();
  const [selectedCluster, setSelectedCluster] = useState<number | null>(null);

  const handleExportNetwork = (clusterId: number, clusterName: string) => {
    showInfo("Export Started", `Exporting GNN topology data for "${clusterName}"...`);
    setTimeout(() => {
      showSuccess("Export Complete", "Network topology JSON & Gephi format exported.");
    }, 1200);
  };

  const clusters = [
    {
      id: 1,
      name: "Political Disinformation Network",
      accounts: 187,
      posts: 3421,
      reach: "2.4M",
      threat: "critical",
      density: "0.84",
      platforms: ["X", "Telegram"],
      syncScore: "94%",
    },
    {
      id: 2,
      name: "Deepfake Sharing Ring",
      accounts: 92,
      posts: 1567,
      reach: "890K",
      threat: "high",
      density: "0.72",
      platforms: ["WhatsApp", "Telegram"],
      syncScore: "89%",
    },
    {
      id: 3,
      name: "Coordinated Amplification Group",
      accounts: 234,
      posts: 5678,
      reach: "4.1M",
      threat: "critical",
      density: "0.91",
      platforms: ["X", "Reddit", "Facebook"],
      syncScore: "96%",
    },
    {
      id: 4,
      name: "Synthetic Profile Cluster",
      accounts: 145,
      posts: 2134,
      reach: "1.2M",
      threat: "medium",
      density: "0.65",
      platforms: ["Instagram", "TikTok"],
      syncScore: "78%",
    },
  ];

  return (
    <AppLayout
      title="Graph Neural Network Analysis"
      subtitle="Coordinated propagation network topology, synchronized account clusters, and origin seed attribution"
      actions={
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="font-mono text-xs text-primary border-primary/30 py-1 px-2.5">
            <Radio className="w-3 h-3 text-primary mr-1.5 animate-pulse" />
            Live GNN Topology
          </Badge>
          <Button
            size="sm"
            onClick={() => handleExportNetwork(0, "All Clusters")}
            className="text-xs font-medium bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <Download className="w-3.5 h-3.5 mr-1.5" />
            Export Graph Topology
          </Button>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Interactive Network Graph Card */}
        <div className="soc-card rounded-xl p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-border/50">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10 text-primary border border-primary/20">
                <NetworkIcon className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-foreground">
                  Interactive Propagation Topology
                </h2>
                <p className="text-xs text-muted-foreground">
                  Drag nodes to inspect clustering, synchronized message bursts, and core bot hubs
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Badge variant="outline" className="font-mono text-[11px] text-muted-foreground">
                23 Nodes • 31 Directed Edges
              </Badge>
              <Badge className="bg-destructive/20 text-destructive border-destructive/30 text-[10px] font-mono uppercase">
                2 Critical Clusters
              </Badge>
            </div>
          </div>

          <InteractiveNetworkGraph />
        </div>

        {/* Identified Coordinated Clusters Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                <Users className="w-5 h-5 text-primary" />
                Detected Coordinated Clusters ({clusters.length})
              </h2>
              <p className="text-xs text-muted-foreground">
                Ranked by narrative velocity, synchronization density score, and cross-platform reach
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {clusters.map((cluster) => {
              const isCritical = cluster.threat === "critical";
              const isHigh = cluster.threat === "high";

              return (
                <div
                  key={cluster.id}
                  className={`soc-card rounded-xl p-5 flex flex-col justify-between hover-lift transition-all ${
                    selectedCluster === cluster.id ? "soc-card-active" : ""
                  }`}
                  onClick={() => setSelectedCluster(cluster.id)}
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3">
                        <div
                          className={`p-2.5 rounded-lg border flex-shrink-0 ${
                            isCritical
                              ? "bg-destructive/10 border-destructive/30 text-destructive"
                              : isHigh
                              ? "bg-warning/10 border-warning/30 text-warning"
                              : "bg-primary/10 border-primary/30 text-primary"
                          }`}
                        >
                          <Users className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-secondary/80 text-muted-foreground border border-border">
                              #{cluster.id}
                            </span>
                            <h3 className="text-sm font-bold text-foreground">
                              {cluster.name}
                            </h3>
                          </div>
                          <p className="text-[11px] text-muted-foreground mt-0.5">
                            Platforms: {cluster.platforms.join(", ")}
                          </p>
                        </div>
                      </div>

                      <Badge
                        variant={isCritical ? "destructive" : isHigh ? "default" : "outline"}
                        className={`text-[10px] font-mono uppercase ${
                          isHigh ? "bg-orange-500/20 text-orange-400 border-orange-500/30" : ""
                        }`}
                      >
                        {cluster.threat}
                      </Badge>
                    </div>

                    {/* Metrics Grid */}
                    <div className="grid grid-cols-4 gap-2 p-2.5 rounded-lg bg-secondary/40 border border-border/50 text-xs">
                      <div>
                        <div className="text-[10px] text-muted-foreground font-mono">Accounts</div>
                        <div className="font-bold font-data text-foreground mt-0.5">{cluster.accounts}</div>
                      </div>
                      <div>
                        <div className="text-[10px] text-muted-foreground font-mono">Posts</div>
                        <div className="font-bold font-data text-primary mt-0.5">{cluster.posts}</div>
                      </div>
                      <div>
                        <div className="text-[10px] text-muted-foreground font-mono">Reach</div>
                        <div className="font-bold font-data text-accent mt-0.5">{cluster.reach}</div>
                      </div>
                      <div>
                        <div className="text-[10px] text-muted-foreground font-mono">Sync Rate</div>
                        <div className="font-bold font-data text-success mt-0.5">{cluster.syncScore}</div>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-3 mt-3 border-t border-border/40 flex items-center justify-between">
                    <span className="text-[11px] font-mono text-muted-foreground">
                      Graph Density: {cluster.density}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-xs h-7 gap-1 border-border hover:bg-secondary/60"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleExportNetwork(cluster.id, cluster.name);
                      }}
                    >
                      <Share2 className="w-3 h-3" />
                      Export Cluster
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
