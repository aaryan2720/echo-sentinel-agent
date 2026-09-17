import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Logo } from "@/components/Logo";
import { LogOut, Settings as SettingsIcon, Bell, Shield, Database, Webhook } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Settings = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen relative">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse-glow" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: '1s' }} />
      </div>

      <header className="relative z-10 container mx-auto px-4 py-4 border-b border-border/50">
        <nav className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/dashboard')}>
              <Logo />
              <span className="text-2xl font-bold font-mono text-primary">EchoBreaker</span>
            </div>
            <div className="flex gap-4">
              <Button variant="ghost" onClick={() => navigate('/dashboard')} className="font-mono">
                Dashboard
              </Button>
              <Button variant="ghost" onClick={() => navigate('/analytics')} className="font-mono">
                Analytics
              </Button>
              <Button variant="ghost" onClick={() => navigate('/agents')} className="font-mono">
                Agents
              </Button>
              <Button variant="ghost" onClick={() => navigate('/network')} className="font-mono">
                Network
              </Button>
              <Button variant="ghost" onClick={() => navigate('/incidents')} className="font-mono">
                Incidents
              </Button>
              <Button variant="ghost" onClick={() => navigate('/alerts')} className="font-mono">
                Alerts
              </Button>
            </div>
          </div>
          <Button variant="outline" onClick={() => navigate('/')} className="font-mono">
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
        </nav>
      </header>

      <div className="relative z-10 container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 font-mono text-primary">
            Settings & Configuration
          </h1>
          <p className="text-muted-foreground">Configure system behavior, integrations, and alert thresholds</p>
        </div>

        <div className="space-y-6">
          {/* Alert Configuration */}
          <Card className="p-6 bg-card/50 backdrop-blur-sm border-primary/20">
            <div className="flex items-center gap-3 mb-6">
              <Bell className="w-6 h-6 text-primary" />
              <h2 className="text-2xl font-bold text-foreground font-mono">Alert Configuration</h2>
            </div>

            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label htmlFor="critical-alerts" className="font-mono">Critical Alerts</Label>
                  <p className="text-sm text-muted-foreground">Receive notifications for critical threats</p>
                </div>
                <Switch id="critical-alerts" defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label htmlFor="email-alerts" className="font-mono">Email Notifications</Label>
                  <p className="text-sm text-muted-foreground">Send alerts via email</p>
                </div>
                <Switch id="email-alerts" defaultChecked />
              </div>

              <div className="space-y-2">
                <Label htmlFor="alert-threshold" className="font-mono">Alert Threshold</Label>
                <Input
                  id="alert-threshold"
                  type="number"
                  placeholder="85"
                  defaultValue="85"
                  className="font-mono"
                />
                <p className="text-sm text-muted-foreground">Minimum confidence score (0-100) to trigger alerts</p>
              </div>
            </div>
          </Card>

          {/* Platform Connectors */}
          <Card className="p-6 bg-card/50 backdrop-blur-sm border-primary/20">
            <div className="flex items-center gap-3 mb-6">
              <Database className="w-6 h-6 text-primary" />
              <h2 className="text-2xl font-bold text-foreground font-mono">Platform Connectors</h2>
            </div>

            <div className="space-y-4">
              {['X (Twitter)', 'YouTube', 'Telegram', 'Reddit', 'Facebook'].map((platform) => (
                <div key={platform} className="flex items-center justify-between p-4 bg-background/50 rounded-lg">
                  <div>
                    <p className="font-semibold text-foreground font-mono">{platform}</p>
                    <p className="text-sm text-muted-foreground">Status: Active</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              ))}
            </div>
          </Card>

          {/* Webhook Integration */}
          <Card className="p-6 bg-card/50 backdrop-blur-sm border-primary/20">
            <div className="flex items-center gap-3 mb-6">
              <Webhook className="w-6 h-6 text-primary" />
              <h2 className="text-2xl font-bold text-foreground font-mono">Webhook Integration</h2>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="webhook-url" className="font-mono">Webhook URL</Label>
                <Input
                  id="webhook-url"
                  type="url"
                  placeholder="https://your-service.com/webhook"
                  className="font-mono"
                />
                <p className="text-sm text-muted-foreground">Receive real-time alerts via webhook</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="webhook-secret" className="font-mono">Webhook Secret</Label>
                <Input
                  id="webhook-secret"
                  type="password"
                  placeholder="Enter secret key"
                  className="font-mono"
                />
              </div>

              <Button variant="outline" className="w-full font-mono">
                Test Webhook
              </Button>
            </div>
          </Card>

          {/* Detection Thresholds */}
          <Card className="p-6 bg-card/50 backdrop-blur-sm border-primary/20">
            <div className="flex items-center gap-3 mb-6">
              <Shield className="w-6 h-6 text-primary" />
              <h2 className="text-2xl font-bold text-foreground font-mono">Detection Thresholds</h2>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="deepfake-threshold" className="font-mono">Deepfake Detection Sensitivity</Label>
                <Input
                  id="deepfake-threshold"
                  type="range"
                  min="0"
                  max="100"
                  defaultValue="85"
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-muted-foreground font-mono">
                  <span>Low</span>
                  <span>85%</span>
                  <span>High</span>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="coordination-threshold" className="font-mono">Coordination Detection Sensitivity</Label>
                <Input
                  id="coordination-threshold"
                  type="range"
                  min="0"
                  max="100"
                  defaultValue="75"
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-muted-foreground font-mono">
                  <span>Low</span>
                  <span>75%</span>
                  <span>High</span>
                </div>
              </div>
            </div>
          </Card>

          {/* Save Button */}
          <div className="flex gap-4">
            <Button className="flex-1 font-mono" size="lg">
              <SettingsIcon className="w-4 h-4 mr-2" />
              Save Changes
            </Button>
            <Button variant="outline" className="flex-1 font-mono" size="lg">
              Reset to Defaults
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
