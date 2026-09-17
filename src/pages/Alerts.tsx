import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Bell, 
  CheckCircle, 
  AlertCircle, 
  Clock, 
  TrendingUp, 
  ShieldAlert, 
  Radio, 
  CheckCheck, 
  SlidersHorizontal,
  ArrowRight,
  ExternalLink
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useNotification } from "@/hooks/use-notification";

export default function Alerts() {
  const navigate = useNavigate();
  const { showSuccess, showWarning, showInfo } = useNotification();
  const [selectedCategory, setSelectedCategory] = useState("all");

  const [alertsList, setAlertsList] = useState([
    {
      id: 1,
      title: "Surge in coordinated deepfake posts detected",
      description: "Vision Transformer pattern analysis shows 47 accounts posting similar synthetic deepfake video snippets within a 15-minute window.",
      timestamp: "2 minutes ago",
      severity: "critical",
      status: "unread",
      category: "Deepfake Detection",
      actionRequired: true,
      route: "/incidents",
    },
    {
      id: 2,
      title: "New coordinated bot network identified on Telegram",
      description: "GNN cluster analysis detected 89 accounts with synchronized broadcast patterns and shared media hashes.",
      timestamp: "18 minutes ago",
      severity: "high",
      status: "unread",
      category: "Network Mapping",
      actionRequired: true,
      route: "/network",
    },
    {
      id: 3,
      title: "Synthetic voice clone impersonation flagged",
      description: "Audio spectrogram anomaly detected synthetic voice impersonating verified election official on WhatsApp audio channels.",
      timestamp: "1 hour ago",
      severity: "high",
      status: "investigating",
      category: "Audio Analysis",
      actionRequired: false,
      route: "/incidents",
    },
    {
      id: 4,
      title: "Trending misinformation narrative velocity spike",
      description: "Rapid spread of unverified election tampering claim across 4 platforms. 234 reshares in 30 minutes.",
      timestamp: "2 hours ago",
      severity: "medium",
      status: "investigating",
      category: "Pattern Recognition",
      actionRequired: false,
      route: "/analytics",
    },
    {
      id: 5,
      title: "Cross-platform coordination campaign mitigated",
      description: "Same content template spread across X and Telegram has been isolated. Origin seeds flagged.",
      timestamp: "3 hours ago",
      severity: "high",
      status: "resolved",
      category: "Network Mapping",
      actionRequired: false,
      route: "/network",
    },
    {
      id: 6,
      title: "Image manipulation campaign neutralized",
      description: "Doctored crisis imagery spreading with false timestamp. Visual forensics confirmed tampering artifacts.",
      timestamp: "5 hours ago",
      severity: "medium",
      status: "resolved",
      category: "Deepfake Detection",
      actionRequired: false,
      route: "/incidents",
    },
  ]);

  const handleAcknowledge = (alertId: number, title: string) => {
    setAlertsList((prev) =>
      prev.map((a) => (a.id === alertId ? { ...a, status: "resolved", actionRequired: false } : a))
    );
    showSuccess("Alert Acknowledged", `Marked "${title}" as acknowledged.`);
  };

  const handleMarkAllRead = () => {
    setAlertsList((prev) => prev.map((a) => ({ ...a, status: "read" })));
    showSuccess("All Read", "All active alerts marked as read.");
  };

  const handleInvestigate = (alert: any) => {
    showWarning("Investigation Started", `Opening investigative workflow for "${alert.title}"...`);
    if (alert.route) {
      setTimeout(() => navigate(alert.route), 400);
    }
  };

  const filteredAlerts = alertsList.filter((alert) => {
    if (selectedCategory === "all") return true;
    if (selectedCategory === "critical") return alert.severity === "critical";
    if (selectedCategory === "unread") return alert.status === "unread";
    return alert.category.toLowerCase().includes(selectedCategory.toLowerCase());
  });

  const unreadCount = alertsList.filter((a) => a.status === "unread").length;

  return (
    <AppLayout
      title="Real-Time Sentinel Alert Center"
      subtitle="Priority escalation feed, velocity spikes, bot ring alarms, and analyst action queues"
      actions={
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleMarkAllRead}
            className="text-xs font-medium border-border hover:bg-secondary/60 gap-1.5"
          >
            <CheckCheck className="w-3.5 h-3.5" />
            Mark All Read
          </Button>
          <Button
            size="sm"
            onClick={() => navigate("/settings")}
            className="text-xs font-medium bg-primary text-primary-foreground hover:bg-primary/90 gap-1.5"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            Notification Rules
          </Button>
        </div>
      }
    >
      <div className="space-y-6">
        {/* KPI Strip */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="soc-card rounded-xl p-4 hover-lift">
            <div className="flex items-center justify-between text-muted-foreground mb-2">
              <span className="text-xs font-medium">Unread Alerts</span>
              <div className="p-1.5 rounded-md bg-destructive/10 text-destructive">
                <AlertCircle className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-bold font-data text-foreground">{unreadCount} Pending</div>
            <div className="text-[11px] text-destructive mt-1">Requires analyst triage</div>
          </div>

          <div className="soc-card rounded-xl p-4 hover-lift">
            <div className="flex items-center justify-between text-muted-foreground mb-2">
              <span className="text-xs font-medium">Resolved Today</span>
              <div className="p-1.5 rounded-md bg-success/10 text-success">
                <CheckCircle className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-bold font-data text-foreground">47 Handled</div>
            <div className="text-[11px] text-success mt-1">100% SLA compliance</div>
          </div>

          <div className="soc-card rounded-xl p-4 hover-lift">
            <div className="flex items-center justify-between text-muted-foreground mb-2">
              <span className="text-xs font-medium">Avg Triage Speed</span>
              <div className="p-1.5 rounded-md bg-primary/10 text-primary">
                <Clock className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-bold font-data text-foreground">4.2 min</div>
            <div className="text-[11px] text-primary mt-1">Autonomous pre-triage</div>
          </div>

          <div className="soc-card rounded-xl p-4 hover-lift">
            <div className="flex items-center justify-between text-muted-foreground mb-2">
              <span className="text-xs font-medium">Critical Velocity</span>
              <div className="p-1.5 rounded-md bg-warning/10 text-warning">
                <TrendingUp className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-bold font-data text-foreground">2 Active</div>
            <div className="text-[11px] text-warning mt-1">Surge detected</div>
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          {[
            { id: "all", label: "All Alerts" },
            { id: "unread", label: `Unread (${unreadCount})` },
            { id: "critical", label: "Critical Severity" },
            { id: "deepfake", label: "Deepfakes" },
            { id: "network", label: "Bot Networks" },
            { id: "audio", label: "Audio Clones" },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all whitespace-nowrap ${
                selectedCategory === cat.id
                  ? "bg-primary text-primary-foreground font-semibold shadow-sm"
                  : "bg-secondary/40 text-muted-foreground hover:text-foreground hover:bg-secondary/70 border border-border/50"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Alerts Stream List */}
        <div className="space-y-3.5">
          {filteredAlerts.map((alert) => {
            const isUnread = alert.status === "unread";
            const isCritical = alert.severity === "critical";
            const isHigh = alert.severity === "high";

            return (
              <div
                key={alert.id}
                className={`soc-card rounded-xl p-5 hover-lift transition-all relative ${
                  isUnread ? "bg-card/90 border-primary/40 shadow-sm" : "opacity-85"
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      {isUnread && (
                        <span className="flex h-2 w-2 rounded-full bg-primary animate-ping"></span>
                      )}
                      <Badge
                        variant={isCritical ? "destructive" : isHigh ? "default" : "secondary"}
                        className={`text-[10px] font-mono uppercase ${
                          isHigh ? "bg-orange-500/20 text-orange-400 border-orange-500/30" : ""
                        }`}
                      >
                        {alert.severity}
                      </Badge>
                      <Badge variant="outline" className="text-[10px] font-mono text-muted-foreground">
                        {alert.category}
                      </Badge>
                      {alert.actionRequired && (
                        <Badge className="bg-warning/20 text-warning border-warning/30 text-[10px] font-mono">
                          Action Required
                        </Badge>
                      )}
                      <span className="text-[11px] text-muted-foreground font-mono ml-auto sm:ml-0">
                        {alert.timestamp}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-foreground">
                      {alert.title}
                    </h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {alert.description}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 sm:self-center flex-shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-border/40">
                    {alert.actionRequired && isUnread && (
                      <Button
                        size="sm"
                        onClick={() => handleInvestigate(alert)}
                        className="text-xs h-8 bg-primary text-primary-foreground hover:bg-primary/90 gap-1 font-medium"
                      >
                        Investigate
                        <ArrowRight className="w-3 h-3" />
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleAcknowledge(alert.id, alert.title)}
                      className="text-xs h-8 border-border hover:bg-secondary/60 text-muted-foreground hover:text-foreground"
                    >
                      {alert.status === "resolved" ? "Acknowledged ✓" : "Acknowledge"}
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </AppLayout>
  );
}

// EchoBreaker Sentinel (AI-03)
