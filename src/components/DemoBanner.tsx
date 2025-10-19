import { AlertCircle, X } from "lucide-react";
import { useState } from "react";
import { Button } from "./ui/button";

export const DemoBanner = () => {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-primary/20 via-accent/20 to-primary/20 border-b border-primary/30 backdrop-blur-sm animate-slide-in-top">
      <div className="container mx-auto px-4 py-2">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 animate-pulse">
              <AlertCircle className="w-5 h-5 text-primary" />
            </div>
            <p className="text-sm font-mono text-foreground">
              <span className="font-bold text-primary">🎯 DEMO MODE</span> — 
              Full access to all features • No login required • 
              <span className="text-accent ml-1">Mumbai Hacks 2025</span>
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsVisible(false)}
            className="hover:bg-primary/10"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};
