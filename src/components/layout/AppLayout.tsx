import { ReactNode, useState } from "react";
import { DemoBanner } from "@/components/DemoBanner";
import { AppNavbar } from "@/components/layout/AppNavbar";
import { HumanReviewInterface } from "@/components/HumanReviewInterface";
import { LastUpdated } from "@/components/LastUpdated";

interface AppLayoutProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
  actions?: ReactNode;
  showLastUpdated?: boolean;
  maxWidth?: "default" | "full" | "narrow";
}

export function AppLayout({
  children,
  title,
  subtitle,
  actions,
  showLastUpdated = true,
  maxWidth = "default",
}: AppLayoutProps) {
  const [isReviewOpen, setIsReviewOpen] = useState(false);

  const containerWidthClass = {
    default: "container mx-auto px-4 sm:px-6 lg:px-8",
    full: "w-full px-4 sm:px-6 lg:px-8",
    narrow: "max-w-5xl mx-auto px-4 sm:px-6",
  }[maxWidth];

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col relative selection:bg-primary/20 selection:text-primary">
      <DemoBanner />

      {/* Ambient Cyber Light Fields */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-0 left-1/3 w-[600px] h-[350px] bg-primary/[0.035] rounded-full blur-[140px]" />
        <div className="absolute top-1/2 right-10 w-[500px] h-[400px] bg-accent/[0.025] rounded-full blur-[140px]" />
      </div>

      {/* Unified Top Navbar */}
      <AppNavbar onOpenReviewQueue={() => setIsReviewOpen(true)} reviewCount={5} />

      {/* Global Human Review Modal */}
      <HumanReviewInterface
        isOpen={isReviewOpen}
        onClose={() => setIsReviewOpen(false)}
      />

      {/* Main Surface Content */}
      <main className="relative z-10 flex-1 py-6 sm:py-8">
        <div className={containerWidthClass}>
          {/* Standardized Page Header */}
          {(title || actions) && (
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 mb-6 border-b border-border/50">
              <div>
                {title && (
                  <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground flex items-center gap-3">
                    {title}
                  </h1>
                )}
                {subtitle && (
                  <p className="text-sm sm:text-base text-muted-foreground mt-1 max-w-3xl">
                    {subtitle}
                  </p>
                )}
              </div>

              <div className="flex items-center gap-3 flex-wrap">
                {showLastUpdated && <LastUpdated />}
                {actions}
              </div>
            </div>
          )}

          {children}
        </div>
      </main>

      {/* Subtle Operational Footer */}
      <footer className="relative z-10 border-t border-border/40 py-4 bg-background/50">
        <div className="container mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <span className="flex h-1.5 w-1.5 rounded-full bg-success"></span>
            <span>EchoBreaker Sentinel SOC v2.4</span>
            <span className="text-border">|</span>
            <span>Autonomous Disinformation & Deepfake Defense</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="font-mono text-[11px]">API Latency: 24ms</span>
            <span className="text-border">|</span>
            <span className="font-mono text-[11px]">Sync: Healthy</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

// EchoBreaker Sentinel (AI-03)
