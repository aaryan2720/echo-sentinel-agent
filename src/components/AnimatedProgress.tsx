import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

interface AnimatedProgressProps {
  value: number;
  max?: number;
  className?: string;
  showLabel?: boolean;
  variant?: "default" | "success" | "warning" | "danger";
}

export const AnimatedProgress = ({ 
  value, 
  max = 100, 
  className,
  showLabel = true,
  variant = "default"
}: AnimatedProgressProps) => {
  const [animatedValue, setAnimatedValue] = useState(0);
  const percentage = (value / max) * 100;

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedValue(percentage);
    }, 100);

    return () => clearTimeout(timer);
  }, [percentage]);

  const getVariantColor = () => {
    switch (variant) {
      case "success":
        return "bg-success";
      case "warning":
        return "bg-warning";
      case "danger":
        return "bg-destructive";
      default:
        return "bg-primary";
    }
  };

  const getGlowColor = () => {
    switch (variant) {
      case "success":
        return "shadow-[0_0_10px_hsl(var(--success)/0.5)]";
      case "warning":
        return "shadow-[0_0_10px_hsl(var(--warning)/0.5)]";
      case "danger":
        return "shadow-[0_0_10px_hsl(var(--destructive)/0.5)]";
      default:
        return "shadow-[0_0_10px_hsl(var(--primary)/0.5)]";
    }
  };

  return (
    <div className={cn("w-full", className)}>
      <div className="relative h-2 bg-muted rounded-full overflow-hidden">
        <div
          className={cn(
            "h-full rounded-full transition-all duration-1000 ease-out",
            getVariantColor(),
            getGlowColor()
          )}
          style={{ width: `${animatedValue}%` }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
        </div>
      </div>
      {showLabel && (
        <div className="flex justify-between items-center mt-1">
          <span className="text-xs text-muted-foreground">Confidence</span>
          <span className={cn(
            "text-xs font-bold font-mono",
            variant === "success" && "text-success",
            variant === "warning" && "text-warning",
            variant === "danger" && "text-destructive",
            variant === "default" && "text-primary"
          )}>
            {Math.round(percentage)}%
          </span>
        </div>
      )}
    </div>
  );
};
