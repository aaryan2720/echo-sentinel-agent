import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Logo } from "@/components/Logo";
import { DemoBanner } from "@/components/DemoBanner";
import { Shield, Lock, ArrowRight, CheckCircle2, KeyRound, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("analyst@echobreaker.ai");
  const [password, setPassword] = useState("••••••••••••");
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    toast({
      title: isLogin ? "Authentication Verified" : "Account Provisioned",
      description: "Redirecting to Sentinel SOC dashboard...",
    });
    
    setTimeout(() => {
      navigate('/dashboard');
    }, 400);
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-background text-foreground relative selection:bg-primary/20 selection:text-primary overflow-hidden">
      <DemoBanner />

      {/* Ambient background glows */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-primary/[0.04] rounded-full blur-[140px]" />
      </div>

      {/* Header */}
      <header className="relative z-10 container mx-auto px-6 py-6 flex items-center justify-between">
        <div
          onClick={() => navigate('/')}
          className="flex items-center gap-2.5 cursor-pointer"
        >
          <Logo />
          <span className="text-xl font-bold tracking-tight text-foreground">
            EchoBreaker
          </span>
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate('/')}
          className="text-xs text-muted-foreground hover:text-foreground"
        >
          ← Return to Public Site
        </Button>
      </header>

      {/* Center Auth Card */}
      <div className="relative z-10 w-full max-w-md mx-auto px-4 py-8">
        <div className="text-center mb-6 space-y-2">
          <Badge variant="outline" className="font-mono text-xs text-primary border-primary/30">
            Sentinel SOC Security Clearance
          </Badge>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            {isLogin ? "Sign In to Sentinel SOC" : "Provision Analyst Access"}
          </h1>
          <p className="text-xs text-muted-foreground max-w-xs mx-auto">
            {isLogin
              ? "Access real-time deepfake feeds, GNN cluster graphs, and verified dossiers"
              : "Create credentials for investigative intelligence access"}
          </p>
        </div>

        <div className="soc-card rounded-2xl p-6 sm:p-8 space-y-5">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5 text-xs">
              <Label htmlFor="email" className="font-medium text-foreground">
                Organization Email Address
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="analyst@newsroom.org"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-secondary/40 border-border text-xs h-10"
              />
            </div>

            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between items-center">
                <Label htmlFor="password" className="font-medium text-foreground">
                  Security Passkey
                </Label>
                {isLogin && (
                  <span className="text-[11px] text-primary cursor-pointer hover:underline">
                    Forgot key?
                  </span>
                )}
              </div>
              <Input
                id="password"
                type="password"
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="bg-secondary/40 border-border text-xs h-10 font-mono"
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90 text-xs h-10 font-medium shadow-md gap-2 mt-2"
            >
              <KeyRound className="w-3.5 h-3.5" />
              {isLogin ? "Authenticate & Enter SOC" : "Create Analyst Account"}
            </Button>
          </form>

          {/* Quick Demo Bypass Banner */}
          <div className="p-3 rounded-lg bg-primary/10 border border-primary/20 text-xs text-muted-foreground flex items-center justify-between">
            <span>Demo credentials pre-filled</span>
            <Button
              size="sm"
              variant="outline"
              onClick={() => navigate("/dashboard")}
              className="text-[11px] h-6 border-primary/40 text-primary hover:bg-primary/10"
            >
              Quick Demo Bypass →
            </Button>
          </div>

          <div className="pt-2 text-center text-xs">
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              {isLogin
                ? "Need credentials for your organization? Provision access"
                : "Already authorized? Sign in to your portal"}
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 py-6 text-center text-xs text-muted-foreground">
        <p>Secured with end-to-end cryptographic hashing • Mumbai Hacks 2025</p>
      </footer>
    </div>
  );
}
