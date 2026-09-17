import { LucideIcon } from "lucide-react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export const EmptyState = ({ 
  icon: Icon, 
  title, 
  description, 
  actionLabel, 
  onAction 
}: EmptyStateProps) => {
  return (
    <Card className="p-12 bg-card/50 backdrop-blur-sm border-primary/20 text-center">
      <div className="flex flex-col items-center gap-4 animate-fade-in">
        <div className="p-6 bg-primary/10 rounded-full animate-pulse-glow">
          <Icon className="w-12 h-12 text-primary" />
        </div>
        <div className="space-y-2">
          <h3 className="text-xl font-bold text-foreground">{title}</h3>
          <p className="text-muted-foreground max-w-md">{description}</p>
        </div>
        {actionLabel && onAction && (
          <Button onClick={onAction} className="mt-4 font-mono">
            {actionLabel}
          </Button>
        )}
      </div>
    </Card>
  );
};
