import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { 
  Settings as SettingsIcon, 
  Bell, 
  Shield, 
  Database, 
  Webhook, 
  Save, 
  RotateCcw,
  Sliders,
  Radio,
  CheckCircle2,
  Key
} from "lucide-react";
import { useNotification } from "@/hooks/use-notification";

export default function Settings() {
  const { showSuccess, showInfo } = useNotification();
  const [criticalAlerts, setCriticalAlerts] = useState(true);
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [confidenceThreshold, setConfidenceThreshold] = useState("85");
  const [coordinationThreshold, setCoordinationThreshold] = useState("75");
  const [webhookUrl, setWebhookUrl] = useState("https://api.newsroom-dispatch.org/v1/alerts");
  const [webhookSecret, setWebhookSecret] = useState("whsec_98f418d220_sentinel");

  const [connectors, setConnectors] = useState([
    { name: "X (Twitter) v2 Stream", status: "Active", enabled: true },
    { name: "Telegram Bot Broadcasts", status: "Active", enabled: true },
    { name: "YouTube RSS & Shorts Ingest", status: "Active", enabled: true },
    { name: "Reddit Crisis Subreddits", status: "Active", enabled: true },
    { name: "TikTok Viral Scraper", status: "Active", enabled: true },
    { name: "Meta / Instagram Graph API", status: "Active", enabled: true },
  ]);

  const toggleConnector = (index: number) => {
    setConnectors(prev => prev.map((c, i) => i === index ? { ...c, enabled: !c.enabled } : c));
  };

  const handleSaveSettings = () => {
    showSuccess("Configuration Saved", "Sentinel SOC thresholds and connector rules updated.");
  };

  const handleTestWebhook = () => {
    showInfo("Webhook Test", "Dispatching test mock incident dossier to endpoint...");
    setTimeout(() => {
      showSuccess("Webhook Delivered", "HTTP 200 OK received from target endpoint.");
    }, 1000);
  };

  const handleResetDefaults = () => {
    setConfidenceThreshold("85");
    setCoordinationThreshold("75");
    setCriticalAlerts(true);
    setEmailAlerts(true);
    showInfo("Reset", "Restored default Sentinel SOC parameters.");
  };

  return (
    <AppLayout
      title="System Configuration & Rules"
      subtitle="Tune multimodal detection sensitivity, automated incident thresholds, webhook dispatches, and platform connectors"
      maxWidth="narrow"
      actions={
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            onClick={handleSaveSettings}
            className="text-xs font-medium bg-primary text-primary-foreground hover:bg-primary/90 gap-1.5"
          >
            <Save className="w-3.5 h-3.5" />
            Save Configuration
          </Button>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Detection Thresholds Card */}
        <div className="soc-card rounded-xl p-6 space-y-5">
          <div className="flex items-center gap-3 pb-3 border-b border-border/50">
            <div className="p-2 rounded-lg bg-primary/10 text-primary">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-foreground">
                Model Inference & Sensitivity Thresholds
              </h3>
              <p className="text-xs text-muted-foreground">
                Adjust confidence cutoffs required to escalate detected signals into verified incidents
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label htmlFor="deepfake-threshold" className="font-medium text-foreground">
                  Deepfake Detection Cutoff
                </Label>
                <span className="font-mono font-bold text-primary">{confidenceThreshold}%</span>
              </div>
              <Input
                id="deepfake-threshold"
                type="range"
                min="50"
                max="99"
                value={confidenceThreshold}
                onChange={(e) => setConfidenceThreshold(e.target.value)}
                className="h-2 bg-secondary cursor-pointer accent-primary"
              />
              <p className="text-[11px] text-muted-foreground">
                Detections below {confidenceThreshold}% are routed to passive background monitoring.
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label htmlFor="coordination-threshold" className="font-medium text-foreground">
                  GNN Coordination Threshold
                </Label>
                <span className="font-mono font-bold text-accent">{coordinationThreshold}%</span>
              </div>
              <Input
                id="coordination-threshold"
                type="range"
                min="50"
                max="99"
                value={coordinationThreshold}
                onChange={(e) => setCoordinationThreshold(e.target.value)}
                className="h-2 bg-secondary cursor-pointer accent-accent"
              />
              <p className="text-[11px] text-muted-foreground">
                Synchronized posting score required to flag a coordinated bot cluster.
              </p>
            </div>
          </div>
        </div>

        {/* Alert Notifications Card */}
        <div className="soc-card rounded-xl p-6 space-y-5">
          <div className="flex items-center gap-3 pb-3 border-b border-border/50">
            <div className="p-2 rounded-lg bg-warning/10 text-warning">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-foreground">
                Escalation & Notification Channels
              </h3>
              <p className="text-xs text-muted-foreground">
                Configure immediate alert triggers for SOC duty engineers and editors
              </p>
            </div>
          </div>

          <div className="space-y-4 text-xs">
            <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/40 border border-border/50">
              <div className="space-y-0.5">
                <div className="font-medium text-foreground">Critical Severity Surge Alerts</div>
                <div className="text-[11px] text-muted-foreground">
                  Immediate browser push and high-priority banner notifications
                </div>
              </div>
              <Switch checked={criticalAlerts} onCheckedChange={setCriticalAlerts} />
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/40 border border-border/50">
              <div className="space-y-0.5">
                <div className="font-medium text-foreground">Newsroom Email Digest Dispatch</div>
                <div className="text-[11px] text-muted-foreground">
                  Send hourly summary dossiers of new incidents to fact-checking partners
                </div>
              </div>
              <Switch checked={emailAlerts} onCheckedChange={setEmailAlerts} />
            </div>
          </div>
        </div>

        {/* Platform Ingestion Connectors */}
        <div className="soc-card rounded-xl p-6 space-y-5">
          <div className="flex items-center gap-3 pb-3 border-b border-border/50">
            <div className="p-2 rounded-lg bg-accent/10 text-accent">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-foreground">
                Active Social Ingestion Connectors
              </h3>
              <p className="text-xs text-muted-foreground">
                Manage autonomous streaming crawlers across supported digital networks
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            {connectors.map((c, idx) => (
              <div
                key={c.name}
                className="p-3.5 rounded-lg bg-secondary/40 border border-border/50 flex items-center justify-between"
              >
                <div>
                  <div className="font-medium text-foreground">{c.name}</div>
                  <div className="text-[11px] text-muted-foreground flex items-center gap-1.5 mt-0.5">
                    <span className={`w-1.5 h-1.5 rounded-full ${c.enabled ? "bg-success" : "bg-muted-foreground"}`}></span>
                    {c.enabled ? "Streaming Active" : "Paused"}
                  </div>
                </div>
                <Switch checked={c.enabled} onCheckedChange={() => toggleConnector(idx)} />
              </div>
            ))}
          </div>
        </div>

        {/* Webhook Dispatches */}
        <div className="soc-card rounded-xl p-6 space-y-5">
          <div className="flex items-center gap-3 pb-3 border-b border-border/50">
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
              <Webhook className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-foreground">
                External Webhook & SIEM Dispatch
              </h3>
              <p className="text-xs text-muted-foreground">
                Transmit structured JSON payload whenever a verified deepfake incident is created
              </p>
            </div>
          </div>

          <div className="space-y-4 text-xs">
            <div className="space-y-1.5">
              <Label htmlFor="webhook-url" className="font-medium text-foreground">
                Target Webhook URL
              </Label>
              <Input
                id="webhook-url"
                value={webhookUrl}
                onChange={(e) => setWebhookUrl(e.target.value)}
                className="bg-secondary/40 border-border text-xs h-9 font-mono"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="webhook-secret" className="font-medium text-foreground">
                HMAC Signature Secret
              </Label>
              <Input
                id="webhook-secret"
                type="password"
                value={webhookSecret}
                onChange={(e) => setWebhookSecret(e.target.value)}
                className="bg-secondary/40 border-border text-xs h-9 font-mono"
              />
            </div>

            <div className="pt-2 flex justify-end">
              <Button
                variant="outline"
                size="sm"
                onClick={handleTestWebhook}
                className="text-xs border-border hover:bg-secondary/60"
              >
                Send Ping Test
              </Button>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center justify-end gap-3 pt-4">
          <Button
            variant="outline"
            size="sm"
            onClick={handleResetDefaults}
            className="text-xs border-border hover:bg-secondary/60 gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset Defaults
          </Button>
          <Button
            size="sm"
            onClick={handleSaveSettings}
            className="text-xs bg-primary text-primary-foreground hover:bg-primary/90 gap-1.5 font-medium"
          >
            <Save className="w-3.5 h-3.5" />
            Save Configuration
          </Button>
        </div>
      </div>
    </AppLayout>
  );
}

// EchoBreaker Sentinel (AI-03)
