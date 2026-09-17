import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/Logo";
import { DemoBanner } from "@/components/DemoBanner";
import { LastUpdated } from "@/components/LastUpdated";
import { MediaEvidenceViewer } from "@/components/MediaEvidenceViewer";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useNotification } from "@/hooks/use-notification";
import { generateIncidentPDF } from "@/lib/pdfGenerator";
import { getIncidents } from "@/lib/supabase";
import { LogOut, FileText, Download, AlertTriangle, Users, Clock, TrendingUp, Eye, Video, Music, Image as ImageIcon, Play, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

const Incidents = () => {
  const navigate = useNavigate();
  const [selectedIncident, setSelectedIncident] = useState<any>(null);
  const [incidents, setIncidents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadIncidents();
  }, []);

  const loadIncidents = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getIncidents();
      
      // Map database incidents to UI format
      const mappedIncidents = data.map(incident => ({
        id: incident.incident_id,
        title: incident.title,
        description: incident.description,
        timestamp: new Date(incident.detected_at).toLocaleString(),
        severity: incident.severity,
        status: incident.status,
        accounts: incident.metadata?.accounts_involved || 0,
        reach: incident.metadata?.estimated_reach || '0',
        platforms: [incident.platform],
        confidence: Math.round(incident.confidence_score),
        evidence: incident.metadata?.evidence_count || 0,
        mediaType: incident.media_type || 'image',
        mediaUrl: incident.media_url || '',
        detections: incident.metadata?.detections || [],
        originalImageUrl: incident.metadata?.original_image_url,
      }));
      
      setIncidents(mappedIncidents);
    } catch (err: any) {
      console.error('Error loading incidents:', err);
      setError(err.message || 'Failed to load incidents');
    } finally {
      setLoading(false);
    }
  };

  const mockIncidents = [
    {
      id: "INC-2024-001",
      title: "Political Deepfake Video Campaign",
      description: "Coordinated spread of manipulated video showing false political statement. Detected 187 coordinated accounts amplifying across X and Telegram.",
      timestamp: "2024-10-15 14:23:00",
      severity: "critical",
      status: "active",
      accounts: 187,
      reach: "2.4M",
      platforms: ["X", "Telegram", "YouTube"],
      confidence: 96,
      evidence: 43,
      mediaType: "video" as const,
      mediaUrl: "https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/360/Big_Buck_Bunny_360_10s_1MB.mp4",
      detections: [
        { timestamp: 1.5, type: "face-manipulation" as const, confidence: 0.96, description: "Facial region shows deep learning manipulation artifacts" },
        { timestamp: 4.2, type: "lip-sync-mismatch" as const, confidence: 0.89, description: "Lip movements don't match audio waveform" },
        { timestamp: 7.8, type: "artifact" as const, confidence: 0.74, description: "Digital artifacts detected around facial boundaries" },
      ],
    },
    {
      id: "INC-2024-002",
      title: "Audio Clone Impersonation",
      description: "Synthetic voice clone of public figure spreading misinformation about health policy. Audio analysis shows clear synthetic artifacts.",
      timestamp: "2024-10-15 11:45:00",
      severity: "high",
      status: "investigating",
      accounts: 92,
      reach: "890K",
      platforms: ["WhatsApp", "Telegram"],
      confidence: 91,
      evidence: 28,
      mediaType: "audio" as const,
      mediaUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
      detections: [
        { timestamp: 3.2, type: "audio-anomaly" as const, confidence: 0.91, description: "Spectral anomalies indicate synthetic voice generation" },
        { timestamp: 8.7, type: "audio-anomaly" as const, confidence: 0.85, description: "Unnatural prosody patterns detected" },
        { timestamp: 15.4, type: "audio-anomaly" as const, confidence: 0.78, description: "Voice timbre inconsistency suggests AI generation" },
      ],
    },
    {
      id: "INC-2024-003",
      title: "Coordinated Meme Manipulation Network",
      description: "Bot network spreading doctored images with false claims. Pattern shows synchronized posting across 234 accounts.",
      timestamp: "2024-10-15 09:12:00",
      severity: "high",
      status: "active",
      accounts: 234,
      reach: "4.1M",
      platforms: ["X", "Reddit", "Facebook"],
      confidence: 88,
      evidence: 67,
      mediaType: "image" as const,
      mediaUrl: "https://images.unsplash.com/photo-1614730321146-b6fa6a46bcb4?w=800",
      originalImageUrl: "https://images.unsplash.com/photo-1614730321146-b6fa6a46bcb4?w=800&sat=-100",
      detections: [
        { timestamp: 0, type: "artifact" as const, confidence: 0.88, description: "Image manipulation artifacts detected in text overlay region" },
        { timestamp: 0, type: "face-manipulation" as const, confidence: 0.72, description: "Possible facial feature manipulation" },
      ],
    },
    {
      id: "INC-2024-004",
      title: "Synthetic Profile Cluster",
      description: "Network of AI-generated profile pictures and bios amplifying specific narratives. GNN detected coordination patterns.",
      timestamp: "2024-10-14 18:30:00",
      severity: "medium",
      status: "resolved",
      accounts: 145,
      reach: "1.2M",
      platforms: ["X", "Instagram"],
      confidence: 84,
      evidence: 52,
      mediaType: "image" as const,
      mediaUrl: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400",
      detections: [
        { timestamp: 0, type: "artifact" as const, confidence: 0.84, description: "AI-generated face detected - StyleGAN artifacts present" },
      ],
    },
  ];

  const { showSuccess, showInfo } = useNotification();

  const handleDownloadPDF = (incident: any) => {
    showInfo("PDF Download", `Generating incident report for ${incident.id}...`);
    
    // Generate actual PDF
    setTimeout(() => {
      generateIncidentPDF({
        id: incident.id,
        title: incident.title,
        platform: incident.platforms.join(', '),
        confidence: incident.confidence,
        type: incident.severity,
        timestamp: incident.timestamp,
        status: incident.status,
        description: incident.description,
        evidence: [
          `${incident.accounts} coordinated accounts detected`,
          `Reached ${incident.reach} users across platforms`,
          `${incident.evidence} pieces of digital evidence collected`,
          `Confidence score: ${incident.confidence}% based on multimodal analysis`,
        ],
      });
      showSuccess("Download Complete", "Incident report PDF has been downloaded successfully.");
    }, 800);
  };

  const handleViewReport = (incidentId: string) => {
    showInfo("Opening Report", `Loading full details for ${incidentId}...`);
  };

  return (
    <div className="min-h-screen relative">
      <DemoBanner />
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse-glow" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: '1s' }} />
      </div>

            {/* Header */}
      <header className="relative z-10 container mx-auto px-4 py-4 border-b border-border/50 mt-12">
        <nav className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/dashboard')}>
              <Logo />
              <span className="text-2xl font-bold font-mono text-primary">EchoBreaker</span>
            </div>
            <div className="flex gap-4">
              <Button variant="ghost" onClick={() => navigate('/dashboard')} className="font-mono">
                Dashboard
              </Button>
              <Button variant="ghost" onClick={() => navigate('/analytics')} className="font-mono">
                Analytics
              </Button>
              <Button variant="ghost" onClick={() => navigate('/agents')} className="font-mono">
                Agents
              </Button>
              <Button variant="ghost" onClick={() => navigate('/network')} className="font-mono">
                Network
              </Button>
              <Button variant="default" className="font-mono">
                Incidents
              </Button>
              <Button variant="ghost" onClick={() => navigate('/alerts')} className="font-mono">
                Alerts
              </Button>
            </div>
          </div>
          <Button variant="outline" onClick={() => navigate('/')} className="font-mono">
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
        </nav>
      </header>

      <div className="relative z-10 container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2 font-mono text-primary">
              Incident Reports
            </h1>
            <p className="text-muted-foreground">Detailed forensic analysis of coordinated misinformation campaigns</p>
          </div>
          <Button className="font-mono">
            <Download className="w-4 h-4 mr-2" />
            Export All Reports
          </Button>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-20">
            <div className="text-center space-y-4">
              <Loader2 className="w-12 h-12 text-primary animate-spin mx-auto" />
              <p className="text-muted-foreground font-mono">Loading incidents from database...</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <Card className="p-8 bg-destructive/10 border-destructive/50">
            <div className="text-center space-y-4">
              <AlertTriangle className="w-12 h-12 text-destructive mx-auto" />
              <h3 className="text-xl font-bold text-destructive">Failed to Load Incidents</h3>
              <p className="text-muted-foreground">{error}</p>
              <Button onClick={loadIncidents} variant="outline">
                Try Again
              </Button>
            </div>
          </Card>
        )}

        {/* Incidents List */}
        {!loading && !error && (
          <div className="space-y-6">
            {incidents.map((incident, idx) => (
            <Card
              key={incident.id}
              className="p-6 bg-card/50 backdrop-blur-sm border-primary/20 animate-fade-in-up hover:border-primary/40 transition-all card-interactive"
              style={{ animationDelay: `${idx * 100}ms` }}
            >
              <div className="flex items-start gap-6 mb-4">
                {/* Media Thumbnail */}
                <div className="relative group cursor-pointer flex-shrink-0">
                  <div className="w-48 h-32 rounded-lg overflow-hidden bg-gray-900 border-2 border-gray-700 group-hover:border-orange-500 transition-all">
                    {incident.mediaType === 'video' && (
                      <div className="relative w-full h-full">
                        <video 
                          src={incident.mediaUrl} 
                          className="w-full h-full object-cover"
                          muted
                          preload="metadata"
                        />
                        <div className="absolute inset-0 flex items-center justify-center bg-black/50 group-hover:bg-black/30 transition-all">
                          <div className="bg-orange-600 rounded-full p-3">
                            <Play className="w-6 h-6 text-white" />
                          </div>
                        </div>
                        <div className="absolute top-2 right-2 bg-black/70 px-2 py-1 rounded flex items-center gap-1">
                          <Video className="w-3 h-3 text-orange-500" />
                          <span className="text-xs text-white font-mono">VIDEO</span>
                        </div>
                      </div>
                    )}
                    {incident.mediaType === 'audio' && (
                      <div className="relative w-full h-full bg-gradient-to-br from-purple-900 to-blue-900 flex items-center justify-center">
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Music className="w-12 h-12 text-purple-300" />
                        </div>
                        <div className="absolute top-2 right-2 bg-black/70 px-2 py-1 rounded flex items-center gap-1">
                          <Music className="w-3 h-3 text-purple-500" />
                          <span className="text-xs text-white font-mono">AUDIO</span>
                        </div>
                        {/* Audio waveform visualization */}
                        <div className="absolute bottom-4 left-4 right-4 flex items-end gap-1 justify-center">
                          {[...Array(20)].map((_, i) => (
                            <div 
                              key={i} 
                              className="bg-purple-400 w-1 rounded-t animate-pulse"
                              style={{ 
                                height: `${Math.random() * 40 + 20}px`,
                                animationDelay: `${i * 0.1}s` 
                              }}
                            />
                          ))}
                        </div>
                      </div>
                    )}
                    {incident.mediaType === 'image' && (
                      <div className="relative w-full h-full">
                        <img 
                          src={incident.mediaUrl} 
                          alt={incident.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-all" />
                        <div className="absolute top-2 right-2 bg-black/70 px-2 py-1 rounded flex items-center gap-1">
                          <ImageIcon className="w-3 h-3 text-green-500" />
                          <span className="text-xs text-white font-mono">IMAGE</span>
                        </div>
                      </div>
                    )}
                  </div>
                  {/* Confidence Badge */}
                  <div className="absolute -bottom-2 -right-2 bg-orange-600 text-white px-3 py-1 rounded-full text-xs font-bold font-mono shadow-lg">
                    {incident.confidence}%
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <Badge variant="outline" className="font-mono text-xs">
                      {incident.id}
                    </Badge>
                    <Badge
                      variant={
                        incident.severity === 'critical'
                          ? 'destructive'
                          : incident.severity === 'high'
                          ? 'default'
                          : 'outline'
                      }
                      className="font-mono"
                    >
                      {incident.severity}
                    </Badge>
                    <Badge
                      variant={incident.status === 'active' ? 'default' : 'outline'}
                      className={incident.status === 'active' ? 'bg-success' : ''}
                    >
                      {incident.status}
                    </Badge>
                  </div>
                  
                  <h3 className="text-2xl font-bold text-foreground mb-2">{incident.title}</h3>
                  <p className="text-muted-foreground mb-4">{incident.description}</p>
                  
                  <div className="flex items-center gap-2 text-sm text-muted-foreground font-mono mb-4">
                    <Clock className="w-4 h-4" />
                    {incident.timestamp}
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div className="p-3 bg-background/50 rounded-lg">
                      <div className="flex items-center gap-2 mb-1">
                        <Users className="w-4 h-4 text-primary" />
                        <p className="text-xs text-muted-foreground font-mono">Accounts</p>
                      </div>
                      <p className="text-lg font-bold text-foreground">{incident.accounts}</p>
                    </div>
                    
                    <div className="p-3 bg-background/50 rounded-lg">
                      <div className="flex items-center gap-2 mb-1">
                        <TrendingUp className="w-4 h-4 text-accent" />
                        <p className="text-xs text-muted-foreground font-mono">Reach</p>
                      </div>
                      <p className="text-lg font-bold text-accent">{incident.reach}</p>
                    </div>
                    
                    <div className="p-3 bg-background/50 rounded-lg">
                      <div className="flex items-center gap-2 mb-1">
                        <AlertTriangle className="w-4 h-4 text-warning" />
                        <p className="text-xs text-muted-foreground font-mono">Confidence</p>
                      </div>
                      <p className="text-lg font-bold text-primary">{incident.confidence}%</p>
                    </div>
                    
                    <div className="p-3 bg-background/50 rounded-lg">
                      <div className="flex items-center gap-2 mb-1">
                        <FileText className="w-4 h-4 text-success" />
                        <p className="text-xs text-muted-foreground font-mono">Evidence</p>
                      </div>
                      <p className="text-lg font-bold text-foreground">{incident.evidence}</p>
                    </div>
                  </div>

                  <div className="flex gap-2 flex-wrap">
                    {incident.platforms.map((platform) => (
                      <Badge key={platform} variant="outline" className="font-mono text-xs">
                        {platform}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button 
                      variant="default" 
                      className="font-mono flex-1 hover-lift"
                      onClick={() => setSelectedIncident(incident)}
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      View Evidence
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle className="font-mono text-2xl">
                        {selectedIncident?.title || incident.title}
                      </DialogTitle>
                    </DialogHeader>
                    {selectedIncident && (
                      <MediaEvidenceViewer
                        mediaUrl={selectedIncident.mediaUrl}
                        mediaType={selectedIncident.mediaType}
                        detections={selectedIncident.detections}
                        originalImageUrl={selectedIncident.originalImageUrl}
                        metadata={{
                          duration: selectedIncident.mediaType === 'video' ? 20 : selectedIncident.mediaType === 'audio' ? 30 : undefined,
                          resolution: selectedIncident.mediaType === 'video' ? '1920x1080' : undefined,
                          format: selectedIncident.mediaType === 'video' ? 'MP4' : selectedIncident.mediaType === 'audio' ? 'MP3' : 'JPEG',
                          size: '12.4 MB',
                        }}
                      />
                    )}
                  </DialogContent>
                </Dialog>
                <Button 
                  variant="outline" 
                  className="font-mono hover-lift"
                  onClick={() => handleDownloadPDF(incident)}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download PDF
                </Button>
              </div>
            </Card>
          ))}
        </div>
        )}
      </div>
    </div>
  );
};
export default Incidents;
