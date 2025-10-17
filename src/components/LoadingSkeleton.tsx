import { Card } from "./ui/card";

export const LoadingSkeleton = ({ count = 3 }: { count?: number }) => {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <Card key={i} className="p-6 bg-card/50 backdrop-blur-sm border-primary/20 animate-fade-in">
          <div className="space-y-4">
            {/* Header skeleton */}
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-2 flex-1">
                <div className="h-6 w-3/4 bg-muted rounded skeleton" />
                <div className="h-4 w-1/2 bg-muted rounded skeleton" />
              </div>
              <div className="h-8 w-24 bg-muted rounded skeleton" />
            </div>

            {/* Stats skeleton */}
            <div className="flex gap-4">
              <div className="h-4 w-20 bg-muted rounded skeleton" />
              <div className="h-4 w-20 bg-muted rounded skeleton" />
              <div className="h-4 w-20 bg-muted rounded skeleton" />
            </div>

            {/* Description skeleton */}
            <div className="space-y-2">
              <div className="h-3 w-full bg-muted rounded skeleton" />
              <div className="h-3 w-5/6 bg-muted rounded skeleton" />
            </div>

            {/* Action buttons skeleton */}
            <div className="flex gap-2 pt-2">
              <div className="h-9 w-32 bg-muted rounded skeleton" />
              <div className="h-9 w-32 bg-muted rounded skeleton" />
            </div>
          </div>
        </Card>
      ))}
    </>
  );
};

export const TableLoadingSkeleton = ({ rows = 5 }: { rows?: number }) => {
  return (
    <div className="space-y-2">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 p-4 bg-background/50 rounded-lg border border-border">
          <div className="h-10 w-10 bg-muted rounded skeleton" />
          <div className="flex-1 space-y-2">
            <div className="h-4 w-3/4 bg-muted rounded skeleton" />
            <div className="h-3 w-1/2 bg-muted rounded skeleton" />
          </div>
          <div className="h-8 w-24 bg-muted rounded skeleton" />
        </div>
      ))}
    </div>
  );
};
