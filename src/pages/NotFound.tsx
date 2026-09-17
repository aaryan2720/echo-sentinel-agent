import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Logo } from "@/components/Logo";
import { DemoBanner } from "@/components/DemoBanner";
import { ShieldAlert, ArrowLeft, Home, Radio, HelpCircle } from "lucide-react";

export default function NotFound() {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error("404 Error: Non-existent route requested:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col justify-between relative selection:bg-primary/20 selection:text-primary overflow-hidden">
      <DemoBanner />

      {/* Ambient Glows */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-destructive/[0.04] rounded-full blur-[140px]" />
      </div>

      {/* Top Bar */}
      <header className="relative z-10 container mx-auto px-6 py-6 flex items-center justify-between">
        <div onClick={() => navigate("/")} className="flex items-center gap-2 cursor-pointer">
          <Logo />
          <span className="text-xl font-bold tracking-tight text-foreground">EchoBreaker</span>
        </div>
      </header>

      {/* Main 404 Surface */}
      <div className="relative z-10 container mx-auto px-4 py-16 text-center max-w-lg">
        <div className="soc-card rounded-2xl p-8 sm:p-10 space-y-6">
          <div className="p-3 rounded-xl bg-destructive/10 border border-destructive/25 text-destructive w-fit mx-auto">
            <ShieldAlert className="w-10 h-10" />
          </div>

          <div className="space-y-2">
            <div className="font-mono text-4xl sm:text-5xl font-extrabold text-foreground">404</div>
            <h1 className="text-lg font-bold text-foreground">Route Not Found in Sentinel Mesh</h1>
            <p className="text-xs text-muted-foreground font-mono">
              The endpoint <span className="text-primary">{location.pathname}</span> is either unmapped or restricted.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Button
              onClick={() => navigate("/dashboard")}
              className="w-full sm:w-auto text-xs bg-primary text-primary-foreground hover:bg-primary/90 gap-2 h-9"
            >
              <Home className="w-3.5 h-3.5" />
              Sentinel Dashboard
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate(-1)}
              className="w-full sm:w-auto text-xs border-border hover:bg-secondary/60 gap-2 h-9"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Go Back
            </Button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 py-6 text-center text-xs text-muted-foreground">
        EchoBreaker Sentinel SOC • 404 Isolation Handler
      </footer>
    </div>
  );
}
