import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Shield } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Bypass authentication for now
    toast({
      title: isLogin ? "Welcome back!" : "Account created!",
      description: "Redirecting to dashboard...",
    });
    
    setTimeout(() => {
      navigate('/dashboard');
    }, 500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Ambient Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse-glow" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: '1s' }} />
      </div>

      <div className="relative z-10 w-full max-w-md px-4">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-4">
            <Shield className="w-10 h-10 text-primary" />
            <span className="text-3xl font-bold font-mono text-primary">EchoBreaker</span>
          </div>
          <p className="text-muted-foreground">
            {isLogin ? "Sign in to access your dashboard" : "Create your account"}
          </p>
        </div>

        <Card className="p-8 bg-card/50 backdrop-blur-sm border-primary/20">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-mono text-foreground">Email</label>
              <Input
                type="email"
                placeholder="agent@echobreaker.ai"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="font-mono"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-mono text-foreground">Password</label>
              <Input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="font-mono"
              />
            </div>

            <Button type="submit" className="w-full font-mono" size="lg">
              {isLogin ? "Sign In" : "Sign Up"}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="text-sm text-primary hover:underline font-mono"
            >
              {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
            </button>
          </div>
        </Card>

        <div className="mt-4 text-center">
          <button
            onClick={() => navigate('/')}
            className="text-sm text-muted-foreground hover:text-primary font-mono"
          >
            ← Back to home
          </button>
        </div>
      </div>
    </div>
  );
};

export default Auth;
