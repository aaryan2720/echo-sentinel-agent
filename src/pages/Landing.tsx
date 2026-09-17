import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Logo } from "@/components/Logo";
import { DemoBanner } from "@/components/DemoBanner";
import { 
  Network, 
  AlertTriangle, 
  Brain, 
  ArrowRight, 
  Scan, 
  Eye, 
  Shield, 
  Zap, 
  Users, 
  Globe,
  Radio,
  CheckCircle2,
  Lock,
  Layers,
  Sparkles,
  Terminal,
  Activity
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Landing() {
  const navigate = useNavigate();

  const agents = [
    {
      icon: Scan,
      title: "Continuous Monitoring Agent",
      description: "Autonomously ingests high-velocity streams across X, Telegram, YouTube, and Reddit. Prioritizes spikes using velocity scoring and geolocation clustering.",
      badge: "Real-Time Ingestion",
      color: "text-primary",
      bg: "bg-primary/10 border-primary/20",
    },
    {
      icon: Eye,
      title: "Multimodal Deepfake Detector",
      description: "Applies Vision Transformers, voice spectrogram artifacts analysis, and NLP cross-verification to generate confidence scores and frame-level evidence.",
      badge: "ViT + Audio Forensics",
      color: "text-accent",
      bg: "bg-accent/10 border-accent/20",
    },
    {
      icon: Network,
      title: "Coordination Detection Agent",
      description: "Constructs live propagation graphs using Graph Neural Networks. Flags synchronized posting, template reuse, and bot amplification rings.",
      badge: "GNN Topology",
      color: "text-warning",
      bg: "bg-warning/10 border-warning/20",
    },
    {
      icon: Brain,
      title: "Causality & Attribution Agent",
      description: "Traces media origin hashes, seed accounts, and timeline provenance to pinpoint coordinated threat actors and campaign playbooks.",
      badge: "Provenance Mapping",
      color: "text-success",
      bg: "bg-success/10 border-success/20",
    },
    {
      icon: Zap,
      title: "Response & Reporting Agent",
      description: "Autonomously synthesizes forensic dossiers, PDF evidence packs, and instant webhook dispatches for newsrooms and platform moderators.",
      badge: "Dossier Synthesis",
      color: "text-destructive",
      bg: "bg-destructive/10 border-destructive/20",
    },
    {
      icon: Shield,
      title: "Self-Improving Agent",
      description: "Ingests human analyst feedback from the review queue and updates model embeddings to defend against evolving evasion techniques.",
      badge: "Active HITL Feedback",
      color: "text-primary",
      bg: "bg-primary/10 border-primary/20",
    },
  ];

  const targetAudiences = [
    {
      icon: Users,
      title: "Journalists & Newsrooms",
      description: "Receive high-fidelity alerts with verified evidence chains, frame breakdowns, and downloadable forensic dossiers before unverified clips go viral.",
    },
    {
      icon: Shield,
      title: "Fact-Checking Organizations",
      description: "Streamline investigation timelines with explainable AI reasoning, media hash cross-references, and network propagation analysis.",
    },
    {
      icon: Globe,
      title: "Platform Trust & Safety",
      description: "Leverage automated cluster mapping and synchronized behavior telemetry to neutralize coordinated bot operations at scale.",
    },
    {
      icon: AlertTriangle,
      title: "Election & Crisis Authorities",
      description: "Maintain real-time situational awareness during sensitive elections and emergency situations with proactive threat velocity monitors.",
    },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col relative selection:bg-primary/20 selection:text-primary overflow-x-hidden">
      <DemoBanner />

      {/* Ambient background glows */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-primary/[0.04] rounded-full blur-[160px]" />
        <div className="absolute top-1/3 right-10 w-[400px] h-[400px] bg-accent/[0.03] rounded-full blur-[140px]" />
      </div>

      {/* Top Navbar */}
      <header className="sticky top-0 z-40 w-full border-b border-border/70 bg-background/80 backdrop-blur-md">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <Logo />
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold tracking-tight text-foreground">EchoBreaker</span>
              <span className="hidden sm:inline-block text-[10px] uppercase font-mono tracking-wider px-1.5 py-0.5 rounded bg-primary/10 text-primary border border-primary/25">
                Sentinel AI
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/50 border border-border text-xs text-muted-foreground">
              <span className="flex h-2 w-2 rounded-full bg-success"></span>
              <span>Autonomous Sentinel Active</span>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate("/auth")}
              className="text-xs font-medium"
            >
              Sign In
            </Button>
            <Button
              size="sm"
              onClick={() => navigate("/dashboard")}
              className="text-xs font-medium bg-primary text-primary-foreground hover:bg-primary/90"
            >
              Launch Dashboard
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex-1">
        {/* Hero Section */}
        <section className="container mx-auto px-4 sm:px-6 pt-16 pb-20 lg:pt-24 lg:pb-28 text-center max-w-5xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 border border-primary/25 text-xs font-medium text-primary mb-8 animate-fade-in-up">
            <Radio className="w-3.5 h-3.5 text-primary animate-pulse" />
            <span>Autonomous Disinformation & Deepfake Defense System</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-foreground mb-6 leading-[1.1]">
            Detect & Disrupt <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-accent to-primary">
              Coordinated Deepfake Campaigns
            </span>
          </h1>

          <p className="text-base sm:text-lg lg:text-xl text-muted-foreground max-w-3xl mx-auto mb-10 leading-relaxed">
            An agentic multimodal AI platform that continuously tracks social media, detects synthetic media with ViT forensics, maps bot propagation graphs, and generates evidence dossiers for rapid verification.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Button
              size="lg"
              onClick={() => navigate("/dashboard")}
              className="w-full sm:w-auto h-12 px-8 text-base font-medium shadow-lg hover:shadow-primary/20 hover-lift"
            >
              Enter Sentinel Console
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => navigate("/url-analysis")}
              className="w-full sm:w-auto h-12 px-8 text-base font-medium border-border hover:bg-secondary/60 hover-lift"
            >
              Inspect Media URL
            </Button>
          </div>

          {/* Quick Telemetry Strip */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto text-left">
            <div className="p-4 rounded-lg bg-card/60 border border-border/70 backdrop-blur-sm">
              <div className="text-xs text-muted-foreground font-mono uppercase mb-1">Active Agents</div>
              <div className="text-2xl font-bold font-data text-foreground">6 / 6 Live</div>
              <div className="text-[11px] text-success mt-1 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> Fully Autonomous
              </div>
            </div>
            <div className="p-4 rounded-lg bg-card/60 border border-border/70 backdrop-blur-sm">
              <div className="text-xs text-muted-foreground font-mono uppercase mb-1">Detection Precision</div>
              <div className="text-2xl font-bold font-data text-foreground">96.4%</div>
              <div className="text-[11px] text-primary mt-1">ViT + Audio Forensics</div>
            </div>
            <div className="p-4 rounded-lg bg-card/60 border border-border/70 backdrop-blur-sm">
              <div className="text-xs text-muted-foreground font-mono uppercase mb-1">Bot Clusters Mapped</div>
              <div className="text-2xl font-bold font-data text-foreground">1,420+</div>
              <div className="text-[11px] text-accent mt-1">GNN Graph Topology</div>
            </div>
            <div className="p-4 rounded-lg bg-card/60 border border-border/70 backdrop-blur-sm">
              <div className="text-xs text-muted-foreground font-mono uppercase mb-1">Verification Speed</div>
              <div className="text-2xl font-bold font-data text-foreground">&lt; 15 sec</div>
              <div className="text-[11px] text-success mt-1">Automated Dossiers</div>
            </div>
          </div>
        </section>

        {/* Problem Statement Card */}
        <section className="container mx-auto px-4 sm:px-6 pb-20 max-w-5xl">
          <div className="p-6 sm:p-8 rounded-xl bg-destructive/5 border border-destructive/20 relative overflow-hidden">
            <div className="flex items-start gap-4">
              <div className="p-2.5 rounded-lg bg-destructive/10 border border-destructive/25 text-destructive flex-shrink-0">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div className="space-y-2">
                <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                  The Critical Problem: Asymmetric Information Warfare
                </h2>
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                  Adversaries deploy high-fidelity deepfakes, synthetic voice clones, and coordinated bot rings across X, Telegram, and TikTok to manipulate elections and public health narratives. Standard reactive fact-checking takes hours or days. EchoBreaker automates detection, graph attribution, and forensic reporting in real time before the narrative spreads.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 6 Autonomous AI Agents Architecture */}
        <section className="container mx-auto px-4 sm:px-6 py-16 border-t border-border/50 max-w-6xl">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <Badge variant="outline" className="mb-3 font-mono text-xs text-primary border-primary/30">
              Sentinel Architecture
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground mb-4">
              6 Autonomous Agents Operating 24/7
            </h2>
            <p className="text-muted-foreground text-base">
              Each specialized agent executes deterministic pipelines, communicates via message bus, and feeds continuous telemetry into the central SOC.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {agents.map((agent) => {
              const Icon = agent.icon;
              return (
                <div
                  key={agent.title}
                  className="soc-card rounded-xl p-6 flex flex-col justify-between hover-lift group"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className={`p-2.5 rounded-lg ${agent.bg}`}>
                        <Icon className={`w-5 h-5 ${agent.color}`} />
                      </div>
                      <span className="text-[11px] font-mono text-muted-foreground px-2 py-0.5 rounded bg-secondary/80 border border-border">
                        {agent.badge}
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                      {agent.title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {agent.description}
                    </p>
                  </div>

                  <div className="pt-4 mt-4 border-t border-border/50 flex items-center justify-between text-xs text-muted-foreground">
                    <span className="flex items-center gap-1.5">
                      <span className="flex h-1.5 w-1.5 rounded-full bg-success"></span>
                      Status: Active
                    </span>
                    <span className="font-mono text-[11px]">99.8% uptime</span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Use Cases Grid */}
        <section className="container mx-auto px-4 sm:px-6 py-16 border-t border-border/50 max-w-6xl">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <h2 className="text-3xl font-bold tracking-tight text-foreground mb-3">
              Actionable Intelligence for Critical Defenders
            </h2>
            <p className="text-muted-foreground text-sm sm:text-base">
              Designed specifically for organizations on the front lines of information integrity.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {targetAudiences.map((aud) => {
              const Icon = aud.icon;
              return (
                <div key={aud.title} className="soc-card rounded-xl p-6 flex items-start gap-4">
                  <div className="p-3 rounded-lg bg-primary/10 border border-primary/20 text-primary flex-shrink-0">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-foreground mb-1.5">{aud.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{aud.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Quick Testing & Forensics Bar */}
        <section className="container mx-auto px-4 sm:px-6 py-12 border-t border-border/50 max-w-5xl">
          <div className="p-6 rounded-xl bg-card/60 border border-border/70 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-1 text-center md:text-left">
              <div className="text-sm font-bold text-foreground flex items-center justify-center md:justify-start gap-2">
                <Terminal className="w-4 h-4 text-primary" />
                Live Verification & Testing Suite
              </div>
              <p className="text-xs text-muted-foreground">
                Run immediate single-item visual tests, inspect Instagram hashtag streams, or view backend status.
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-2.5">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => navigate("/url-analysis")}
                className="text-xs font-medium"
              >
                URL Inspector
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => navigate("/instagram-monitoring")}
                className="text-xs font-medium"
              >
                Instagram Stream
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => navigate("/visual-test")}
                className="text-xs font-medium"
              >
                ViT Forensics
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => navigate("/system-status")}
                className="text-xs font-medium"
              >
                Diagnostics
              </Button>
            </div>
          </div>
        </section>
      </main>

      {/* Production Footer */}
      <footer className="border-t border-border/70 bg-card/40 py-8 relative z-10">
        <div className="container mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <Logo />
            <span className="font-bold text-foreground">EchoBreaker Sentinel</span>
            <span>— Mumbai Hacks 2025 Autonomous Defense Initiative</span>
          </div>

          <div className="flex items-center gap-6">
            <button onClick={() => navigate("/dashboard")} className="hover:text-primary transition-colors">
              Dashboard
            </button>
            <button onClick={() => navigate("/incidents")} className="hover:text-primary transition-colors">
              Incidents
            </button>
            <button onClick={() => navigate("/network")} className="hover:text-primary transition-colors">
              Network Graph
            </button>
            <button onClick={() => navigate("/system-status")} className="hover:text-primary transition-colors">
              System Telemetry
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}

// EchoBreaker Sentinel (AI-03)
