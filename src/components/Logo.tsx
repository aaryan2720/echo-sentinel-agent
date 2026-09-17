import { Network, Scan, Shield } from "lucide-react";

export const Logo = ({ className = "" }: { className?: string }) => {
  return (
    <div className={`relative inline-flex items-center ${className}`}>
      {/* Animated scanning rings */}
      <div className="relative w-8 h-8">
        <div className="absolute inset-0 border-2 border-primary/30 rounded-full animate-pulse-glow" />
        <div className="absolute inset-1 border-2 border-accent/40 rounded-full animate-pulse-glow" style={{ animationDelay: '0.3s' }} />
        
        {/* Core shield with network overlay */}
        <div className="absolute inset-0 flex items-center justify-center">
          <Shield className="w-4 h-4 text-primary absolute" />
          <Network className="w-3 h-3 text-accent absolute animate-pulse" style={{ animationDelay: '0.6s' }} />
        </div>
        
        {/* Scanning line */}
        <div className="absolute inset-0 overflow-hidden rounded-full">
          <div className="absolute top-1/2 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-primary to-transparent animate-scan" />
        </div>
      </div>
    </div>
  );
};
