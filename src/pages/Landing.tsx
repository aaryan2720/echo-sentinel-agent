import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Logo } from "@/components/Logo";
import { DemoBanner } from "@/components/DemoBanner";
import { Network, AlertTriangle, Brain, ArrowRight, Scan, Eye, Shield, Zap, Users, Globe } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen relative overflow-hidden">
      <DemoBanner />
      {/* Ambient Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse-glow" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: '1s' }} />
      </div>

      {/* Header */}
      <header className="relative z-10 container mx-auto px-4 py-6 mt-12">
        <nav className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Logo />
            <span className="text-2xl font-bold font-mono text-primary">EchoBreaker</span>
          </div>
          <Button 
            variant="outline" 
            onClick={() => navigate('/auth')}
            className="font-mono hover-lift"
          >
            Sign In
          </Button>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="relative z-10 container mx-auto px-4">
        <div className="max-w-5xl mx-auto text-center py-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/30 rounded-full mb-8 animate-fade-in-up">
            <Brain className="w-4 h-4 text-primary" />
            <span className="text-sm font-mono text-primary">Agentic AI-Powered Detection</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            Autonomous Detection of
            <br />
            <span className="text-primary">Deepfakes & Propaganda</span>
          </h1>

          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            An agentic multimodal AI system that continuously monitors, detects synthetic media, 
            maps propagation networks, and generates actionable incident reports for journalists 
            and fact-checkers — autonomously disrupting coordinated influence operations before they spread.
          </p>

          {/* Problem Highlight */}
          <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-6 max-w-3xl mx-auto mb-12 animate-fade-in-up" style={{ animationDelay: '0.25s' }}>
            <div className="flex items-start gap-4">
              <AlertTriangle className="w-6 h-6 text-destructive flex-shrink-0 mt-1" />
              <div className="text-left">
                <h3 className="text-lg font-bold text-destructive mb-2">The Problem</h3>
                <p className="text-muted-foreground">
                  Adversaries exploit digital platforms with deepfakes, voice clones, and coordinated bot networks 
                  to spread misinformation. Traditional fact-checking reacts too slowly, and most systems miss 
                  <span className="text-foreground font-semibold"> coordinated campaigns</span> — where separate 
                  actors amplify narratives together. During crises, these operations cause outsized harm: 
                  violence, election interference, and suppression of truth.
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
            <Button 
              size="lg" 
              onClick={() => navigate('/auth')}
              className="font-mono text-lg group hover-lift"
            >
              Get Started
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              onClick={() => navigate('/dashboard')}
              className="font-mono text-lg hover-lift"
            >
              View Live Dashboard
            </Button>
          </div>
        </div>

        {/* Core Agent Capabilities */}
        <div className="max-w-6xl mx-auto py-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-primary">
              6 Autonomous AI Agents Working 24/7
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Each agent continuously executes specialized tasks, learns from patterns, and coordinates 
              with others to detect threats before they spread.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: Scan,
                title: "Continuous Monitoring Agent",
                description: "Autonomously polls APIs and crawlers across X, YouTube, Telegram, Reddit. Prioritizes analysis based on velocity, novelty, and geographic concentration.",
                color: "primary"
              },
              {
                icon: Eye,
                title: "Multimodal Deepfake Detection",
                description: "Runs ViT-based visual detectors, audio cloning detection, and NLP veracity checks. Produces confidence scores and flags suspicious items.",
                color: "accent"
              },
              {
                icon: Network,
                title: "Coordination Detection Agent",
                description: "Builds propagation graphs using GNNs. Identifies coordinated clusters through synchronized posting, reused content, and timing patterns.",
                color: "warning"
              },
              {
                icon: Brain,
                title: "Causality & Attribution",
                description: "Traces origin seeds, content provenance, and media hashes. Suggests coordinating actors and tactics like bot amplification.",
                color: "success"
              },
              {
                icon: Zap,
                title: "Response & Reporting Agent",
                description: "Generates human-readable incident reports, forensic dossiers, and heatmaps. Triggers real-time alerts to media partners.",
                color: "destructive"
              },
              {
                icon: Shield,
                title: "Self-Improving Agent",
                description: "Aggregates human feedback on detections. Periodically retrains models with new ground truth to adapt to adversarial tactics.",
                color: "primary"
              },
            ].map((agent, idx) => (
              <Card
                key={agent.title}
                className="p-6 bg-card/50 backdrop-blur-sm border-primary/20 animate-fade-in-up hover:border-primary/40 transition-all card-interactive"
                style={{ animationDelay: `${idx * 100}ms` }}
              >
                <div className={`w-12 h-12 bg-${agent.color}/10 border border-${agent.color}/30 rounded-lg flex items-center justify-center mb-4`}>
                  <agent.icon className={`w-6 h-6 text-${agent.color}`} />
                </div>
                <h3 className="text-lg font-bold mb-2 text-foreground">{agent.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{agent.description}</p>
              </Card>
            ))}
          </div>
        </div>

        {/* Use Cases & Impact */}
        <div className="max-w-6xl mx-auto py-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-primary">
              Built For Those Fighting Misinformation
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Providing actionable intelligence for rapid response and evidence-backed reporting
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                icon: Users,
                title: "Journalists & Newsrooms",
                description: "Receive rapid alerts with traceable evidence chains. Investigate coordinated campaigns with forensic dossiers, network graphs, and media artifacts — all structured for fast verification.",
              },
              {
                icon: Shield,
                title: "Fact-Checking Organizations",
                description: "Access structured incident reports with confidence scores, propagation timelines, and cluster analysis. Reduce time-to-verification with explainable AI outputs.",
              },
              {
                icon: Globe,
                title: "Social Media Platforms",
                description: "Integrate via API for priority moderation signals. Receive coordinated network detections that help identify bot clusters and synthetic account operations.",
              },
              {
                icon: AlertTriangle,
                title: "Election & Public Safety Authorities",
                description: "Gain situational awareness during crises. Track cross-platform campaigns, geographic hotspots, and narrative velocity with real-time heatmaps.",
              },
            ].map((useCase, idx) => (
              <Card
                key={useCase.title}
                className="p-6 bg-card/50 backdrop-blur-sm border-primary/20 animate-fade-in-up card-interactive"
                style={{ animationDelay: `${idx * 100}ms` }}
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary/10 border border-primary/30 rounded-lg flex items-center justify-center flex-shrink-0">
                    <useCase.icon className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2 text-foreground">{useCase.title}</h3>
                    <p className="text-muted-foreground">{useCase.description}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="max-w-4xl mx-auto text-center py-20">
          <Card className="p-12 bg-card/50 backdrop-blur-sm border-primary/20 card-interactive">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-primary">
              Early Detection. Evidence-Backed Reports. Autonomous Action.
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Join the fight against coordinated misinformation. See the system in action.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                onClick={() => navigate('/dashboard')}
                className="font-mono text-lg group hover-lift"
              >
                View Live Demo
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                onClick={() => navigate('/auth')}
                className="font-mono text-lg hover-lift"
              >
                Request Access
              </Button>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Landing;
