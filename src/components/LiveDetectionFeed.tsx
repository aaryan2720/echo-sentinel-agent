import { useEffect, useState } from 'react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Scan, Eye, AlertCircle, CheckCircle, Clock } from 'lucide-react';

interface DetectionItem {
  id: string;
  content: string;
  platform: string;
  status: 'analyzing' | 'detected' | 'clean' | 'alert';
  confidence?: number;
  type?: string;
  timestamp: string;
}

export const LiveDetectionFeed = () => {
  const [items, setItems] = useState<DetectionItem[]>([]);
  const [velocity, setVelocity] = useState(42);

  // Sample detection types
  const detectionSamples = [
    { content: 'Political figure deepfake video', type: 'Deepfake Video', platform: 'X', confidence: 94 },
    { content: 'Synthetic voice clone audio', type: 'Audio Clone', platform: 'Telegram', confidence: 89 },
    { content: 'Coordinated bot network detected', type: 'Bot Network', platform: 'X', confidence: 96 },
    { content: 'Manipulated image campaign', type: 'Image Manipulation', platform: 'Instagram', confidence: 87 },
    { content: 'Disinformation narrative spike', type: 'Text Analysis', platform: 'WhatsApp', confidence: 91 },
    { content: 'Face swap detection', type: 'Deepfake Video', platform: 'YouTube', confidence: 93 },
    { content: 'Synthetic profile cluster', type: 'Bot Network', platform: 'Facebook', confidence: 88 },
  ];

  useEffect(() => {
    const addNewItem = () => {
      const sample = detectionSamples[Math.floor(Math.random() * detectionSamples.length)];
      const newItem: DetectionItem = {
        id: `det-${Date.now()}`,
        content: sample.content,
        platform: sample.platform,
        status: 'analyzing',
        timestamp: new Date().toLocaleTimeString(),
      };

      setItems(prev => [newItem, ...prev].slice(0, 10));

      // Update status after delay
      setTimeout(() => {
        setItems(prev => prev.map(item => 
          item.id === newItem.id 
            ? { ...item, status: Math.random() > 0.2 ? 'detected' : 'clean', confidence: sample.confidence, type: sample.type }
            : item
        ));
      }, 2000);

      // Create alert for high confidence detections
      setTimeout(() => {
        if (sample.confidence > 90) {
          setItems(prev => prev.map(item => 
            item.id === newItem.id && item.status === 'detected'
              ? { ...item, status: 'alert' }
              : item
          ));
        }
      }, 3000);
    };

    // Add initial items
    const initialItems = Array.from({ length: 5 }, (_, i) => {
      const sample = detectionSamples[i % detectionSamples.length];
      return {
        id: `det-init-${i}`,
        content: sample.content,
        platform: sample.platform,
        status: (i % 3 === 0 ? 'alert' : i % 3 === 1 ? 'detected' : 'clean') as DetectionItem['status'],
        confidence: sample.confidence,
        type: sample.type,
        timestamp: new Date(Date.now() - i * 60000).toLocaleTimeString(),
      };
    });
    setItems(initialItems);

    // Add new items periodically
    const interval = setInterval(addNewItem, 4000);

    // Update velocity
    const velocityInterval = setInterval(() => {
      setVelocity(prev => Math.max(20, Math.min(80, prev + Math.floor(Math.random() * 11) - 5)));
    }, 3000);

    return () => {
      clearInterval(interval);
      clearInterval(velocityInterval);
    };
  }, []);

  const getStatusIcon = (status: DetectionItem['status']) => {
    switch (status) {
      case 'analyzing':
        return <Clock className="w-4 h-4 text-primary animate-pulse" />;
      case 'detected':
        return <Eye className="w-4 h-4 text-warning" />;
      case 'alert':
        return <AlertCircle className="w-4 h-4 text-destructive animate-pulse" />;
      case 'clean':
        return <CheckCircle className="w-4 h-4 text-success" />;
    }
  };

  const getStatusBadge = (item: DetectionItem) => {
    switch (item.status) {
      case 'analyzing':
        return <Badge variant="outline" className="animate-pulse">Analyzing...</Badge>;
      case 'detected':
        return <Badge variant="default">{item.confidence}% Suspicious</Badge>;
      case 'alert':
        return <Badge variant="destructive" className="animate-pulse">{item.confidence}% THREAT</Badge>;
      case 'clean':
        return <Badge variant="outline" className="text-success">Clean</Badge>;
    }
  };

  return (
    <Card className="p-6 bg-card/50 backdrop-blur-sm border-primary/20">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Scan className="w-5 h-5 text-primary" />
          <h2 className="text-xl font-bold text-primary font-mono">
            Live Detection Feed
          </h2>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="font-mono">
            <div className="w-2 h-2 bg-primary rounded-full animate-pulse mr-2" />
            LIVE
          </Badge>
          <div className="text-sm font-mono text-muted-foreground">
            {velocity} items/min
          </div>
        </div>
      </div>

      <div className="space-y-2 max-h-[400px] overflow-y-auto scrollbar-thin">
        {items.map((item, idx) => (
          <div
            key={item.id}
            className="p-3 bg-background/50 rounded-lg border border-border/50 hover:border-primary/30 transition-all animate-fade-in-up"
            style={{ animationDelay: `${idx * 50}ms` }}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3 flex-1">
                <div className="mt-0.5">
                  {getStatusIcon(item.status)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-mono font-semibold text-foreground truncate">
                      {item.content}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground font-mono">
                    <span>{item.platform}</span>
                    {item.type && (
                      <>
                        <span>•</span>
                        <span>{item.type}</span>
                      </>
                    )}
                    <span>•</span>
                    <span>{item.timestamp}</span>
                  </div>
                </div>
              </div>
              <div className="flex-shrink-0">
                {getStatusBadge(item)}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 pt-4 border-t border-border/50">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-primary font-mono">
              {items.filter(i => i.status === 'alert').length}
            </div>
            <div className="text-xs text-muted-foreground font-mono">Critical Alerts</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-warning font-mono">
              {items.filter(i => i.status === 'detected').length}
            </div>
            <div className="text-xs text-muted-foreground font-mono">Detections</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-success font-mono">
              {items.filter(i => i.status === 'clean').length}
            </div>
            <div className="text-xs text-muted-foreground font-mono">Clean</div>
          </div>
        </div>
      </div>
    </Card>
  );
};
