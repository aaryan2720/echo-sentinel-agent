import { Button } from "@/components/ui/button";
import { Shield, Network, AlertTriangle, Brain, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Ambient Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse-glow" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: '1s' }} />
      </div>

      {/* Header */}
      <header className="relative z-10 container mx-auto px-4 py-6">
        <nav className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="w-8 h-8 text-primary" />
            <span className="text-2xl font-bold font-mono text-primary">EchoBreaker</span>
          </div>
          <Button 
            variant="outline" 
            onClick={() => navigate('/auth')}
            className="font-mono"
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

          <p className="text-xl text-muted-foreground mb-12 max-w-3xl mx-auto animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            EchoBreaker is an agentic AI system that autonomously scans, detects, and maps 
            coordinated misinformation networks across social media platforms in real-time.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
            <Button 
              size="lg" 
              onClick={() => navigate('/auth')}
              className="font-mono text-lg group"
            >
              Get Started
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              onClick={() => navigate('/dashboard')}
              className="font-mono text-lg"
            >
              View Live Dashboard
            </Button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 py-20">
          <div className="p-6 bg-card/50 backdrop-blur-sm border border-primary/20 rounded-lg animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
            <div className="w-12 h-12 bg-primary/10 border border-primary/30 rounded-lg flex items-center justify-center mb-4">
              <Network className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-xl font-bold mb-2">Network Mapping</h3>
            <p className="text-muted-foreground">
              Graph Neural Networks detect coordinated influence operations and bot networks spreading misinformation.
            </p>
          </div>

          <div className="p-6 bg-card/50 backdrop-blur-sm border border-primary/20 rounded-lg animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
            <div className="w-12 h-12 bg-primary/10 border border-primary/30 rounded-lg flex items-center justify-center mb-4">
              <AlertTriangle className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-xl font-bold mb-2">Deepfake Detection</h3>
            <p className="text-muted-foreground">
              Vision and Audio Transformers identify synthetic media, voice cloning, and visual tampering in real-time.
            </p>
          </div>

          <div className="p-6 bg-card/50 backdrop-blur-sm border border-primary/20 rounded-lg animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
            <div className="w-12 h-12 bg-primary/10 border border-primary/30 rounded-lg flex items-center justify-center mb-4">
              <Brain className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-xl font-bold mb-2">Agentic Intelligence</h3>
            <p className="text-muted-foreground">
              Autonomous AI agents continuously monitor, learn, and adapt to new misinformation patterns without human intervention.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Landing;
