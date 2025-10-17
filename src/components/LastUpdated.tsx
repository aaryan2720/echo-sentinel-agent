import { Clock } from "lucide-react";
import { useEffect, useState } from "react";

export const LastUpdated = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit' 
    });
  };

  return (
    <div className="flex items-center gap-2 text-sm text-muted-foreground animate-fade-in-up">
      <Clock className="w-4 h-4 animate-pulse" />
      <span>Last updated: {formatTime(time)}</span>
    </div>
  );
};
