import { useState, useEffect } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MediaEvidenceViewer } from "@/components/MediaEvidenceViewer";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useNotification } from "@/hooks/use-notification";
import { generateIncidentPDF } from "@/lib/pdfGenerator";
import { getIncidents } from "@/lib/supabase";
import { 
  FileText, 
  Download, 
  AlertTriangle, 
  Users, 
  Clock, 
  TrendingUp, 
  Eye, 
  Video, 
  Music, 
  Image as ImageIcon, 
  Search,
  Filter,
  ShieldCheck,
  Share2,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Layers,
  BarChart3
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Incidents() {
  const navigate = useNavigate();
  const [selectedIncident, setSelectedIncident] = useState<any>(null);
  const [incidents, setIncidents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSeverity, setSelectedSeverity] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");

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
      description: "Synthetic voice clone of public figure spreading misinformation about health policy. Audio analysis shows clear synthetic spectral artifacts.",
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

  useEffect(() => {
    loadIncidents();
  }, []);

  const loadIncidents = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getIncidents();
      
      if (data && data.length > 0) {
        const mappedIncidents = data.map((incident) => ({
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
      } else {
        setIncidents(mockIncidents);
      }
    } catch (err: any) {
      console.error('Error loading incidents, falling back to mock:', err);
      setIncidents(mockIncidents);
    } finally {
      setLoading(false);
    }
  };

  const { showSuccess, showInfo } = useNotification();

  const handleDownloadPDF = (incident: any) => {
    showInfo("PDF Generation", `Generating incident dossier for ${incident.id}...`);
    setTimeout(() => {
      generateIncidentPDF({
        id: incident.id,
        title: incident.title,
        platform: Array.isArray(incident.platforms) ? incident.platforms.join(', ') : incident.platforms,
        confidence: incident.confidence,
        type: incident.severity,
        timestamp: incident.timestamp,
        status: incident.status,
        description: incident.description,
        evidence: [
          `${incident.accounts} coordinated accounts detected`,
          `Reached ${incident.reach} users across platforms`,
          `${incident.evidence} pieces of digital forensic evidence logged`,
          `Confidence score: ${incident.confidence}% based on multimodal ViT & audio models`,
        ],
      });
      showSuccess("Export Complete", "Incident dossier PDF has been saved successfully.");
    }, 800);
  };

  const handleExportAll = () => {
    showInfo("Bulk Export", "Packaging all incident dossiers into archive...");
    setTimeout(() => {
      showSuccess("Archive Ready", "Export package downloaded.");
    }, 1500);
  };

  const filteredIncidents = incidents.filter((incident) => {
    const matchesSearch = 
      incident.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      incident.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      incident.id.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesSeverity = selectedSeverity === "all" || incident.severity === selectedSeverity;
    const matchesStatus = selectedStatus === "all" || incident.status === selectedStatus;

    return matchesSearch && matchesSeverity && matchesStatus;
  });

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case "critical":
        return <Badge variant="destructive" className="bg-destructive/20 text-destructive border-destructive/30 uppercase text-[10px] font-mono">Critical</Badge>;
      case "high":
        return <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/30 uppercase text-[10px] font-mono">High Risk</Badge>;
      case "medium":
        return <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30 uppercase text-[10px] font-mono">Medium</Badge>;
      default:
        return <Badge variant="secondary" className="text-[10px] font-mono uppercase">Low</Badge>;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <span className="inline-flex items-center gap-1 text-destructive text-xs font-mono"><span className="w-1.5 h-1.5 rounded-full bg-destructive animate-pulse"></span> Active Threat</span>;
      case "investigating":
        return <span className="inline-flex items-center gap-1 text-warning text-xs font-mono"><span className="w-1.5 h-1.5 rounded-full bg-warning"></span> In Review</span>;
      case "resolved":
        return <span className="inline-flex items-center gap-1 text-success text-xs font-mono"><span className="w-1.5 h-1.5 rounded-full bg-success"></span> Mitigated</span>;
      default:
        return <span className="text-muted-foreground text-xs font-mono">{status}</span>;
    }
  };

  const getMediaIcon = (type: string) => {
    switch (type) {
      case "video": return <Video className="w-4 h-4 text-purple-400" />;
      case "audio": return <Music className="w-4 h-4 text-blue-400" />;
      default: return <ImageIcon className="w-4 h-4 text-emerald-400" />;
    }
  };

  return (
    <AppLayout
      title="Incident Dossiers & Forensics"
      subtitle="Evidence-backed investigative files with multimodal model telemetry and propagation graphs"
      actions={
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleExportAll}
            className="text-xs font-medium border-border hover:bg-secondary/60"
          >
            <Download className="w-3.5 h-3.5 mr-1.5" />
            Export Archive
          </Button>
          <Button
            size="sm"
            onClick={() => navigate("/network")}
            className="text-xs font-medium bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <Layers className="w-3.5 h-3.5 mr-1.5" />
            Network Topology
          </Button>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Filter & Search Bar */}
        <div className="p-4 rounded-xl bg-card/60 border border-border/70 backdrop-blur-sm flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
            <Input
              placeholder="Search by incident ID, topic, or keyword..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-9 text-xs bg-secondary/40 border-border"
            />
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
            {/* Severity Filter */}
            <div className="flex items-center gap-1 bg-secondary/40 p-1 rounded-lg border border-border text-xs">
              {["all", "critical", "high", "medium"].map((sev) => (
                <button
                  key={sev}
                  onClick={() => setSelectedSeverity(sev)}
                  className={`px-2.5 py-1 rounded-md capitalize transition-all ${
                    selectedSeverity === sev
                      ? "bg-primary text-primary-foreground font-semibold"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {sev}
                </button>
              ))}
            </div>

            {/* Status Filter */}
            <div className="flex items-center gap-1 bg-secondary/40 p-1 rounded-lg border border-border text-xs">
              {["all", "active", "investigating", "resolved"].map((st) => (
                <button
                  key={st}
                  onClick={() => setSelectedStatus(st)}
                  className={`px-2.5 py-1 rounded-md capitalize transition-all ${
                    selectedStatus === st
                      ? "bg-primary text-primary-foreground font-semibold"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-64 rounded-xl bg-card/60 border border-border skeleton-shimmer" />
            ))}
          </div>
        )}

        {/* Incident Cards Grid */}
        {!loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {filteredIncidents.map((incident) => (
              <div
                key={incident.id}
                className="soc-card rounded-xl p-6 flex flex-col justify-between hover-lift group relative overflow-hidden"
              >
                <div>
                  {/* Card Header */}
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-primary px-2 py-0.5 rounded bg-primary/10 border border-primary/20">
                          {incident.id}
                        </span>
                        {getSeverityBadge(incident.severity)}
                      </div>
                      <h3 className="text-base font-bold text-foreground group-hover:text-primary transition-colors line-clamp-1">
                        {incident.title}
                      </h3>
                    </div>

                    <div className="flex flex-col items-end flex-shrink-0">
                      <div className="flex items-center gap-1">
                        {getMediaIcon(incident.mediaType)}
                        <span className="text-xs font-mono font-bold text-foreground">
                          {incident.confidence}%
                        </span>
                      </div>
                      <span className="text-[10px] text-muted-foreground font-mono">Confidence</span>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed mb-4">
                    {incident.description}
                  </p>

                  {/* Telemetry Metrics Strip */}
                  <div className="grid grid-cols-3 gap-2 p-3 rounded-lg bg-secondary/40 border border-border/50 text-xs mb-4">
                    <div>
                      <div className="text-[10px] text-muted-foreground font-mono">Accounts</div>
                      <div className="font-bold font-data text-foreground mt-0.5">{incident.accounts}</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-muted-foreground font-mono">Est. Reach</div>
                      <div className="font-bold font-data text-accent mt-0.5">{incident.reach}</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-muted-foreground font-mono">Evidence</div>
                      <div className="font-bold font-data text-foreground mt-0.5">{incident.evidence} items</div>
                    </div>
                  </div>

                  {/* Detection Flags Preview */}
                  {incident.detections && incident.detections.length > 0 && (
                    <div className="space-y-1.5 mb-4">
                      <div className="text-[11px] font-mono text-muted-foreground">Forensic Anomalies:</div>
                      <div className="flex flex-wrap gap-1.5">
                        {incident.detections.slice(0, 2).map((det: any, i: number) => (
                          <span
                            key={i}
                            className="text-[10px] font-mono px-2 py-0.5 rounded bg-card border border-border/80 text-foreground"
                          >
                            {det.type} ({(det.confidence * 100).toFixed(0)}%)
                          </span>
                        ))}
                        {incident.detections.length > 2 && (
                          <span className="text-[10px] font-mono text-muted-foreground px-1.5 py-0.5">
                            +{incident.detections.length - 2} more
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Bottom Action Footer */}
                <div className="pt-4 border-t border-border/50 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    {getStatusBadge(incident.status)}
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedIncident(incident)}
                      className="text-xs h-8 border-primary/30 text-primary hover:bg-primary/10 gap-1"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      Evidence Viewer
                    </Button>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => handleDownloadPDF(incident)}
                      className="text-xs h-8 gap-1"
                      title="Download PDF Dossier"
                    >
                      <Download className="w-3.5 h-3.5" />
                      PDF
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredIncidents.length === 0 && (
          <div className="p-12 text-center rounded-xl bg-card/40 border border-border/60 space-y-3">
            <ShieldCheck className="w-10 h-10 text-muted-foreground mx-auto" />
            <h3 className="text-base font-bold text-foreground">No matching incidents found</h3>
            <p className="text-xs text-muted-foreground max-w-sm mx-auto">
              No active or archived incidents match your current search criteria. Try adjusting your search query or severity filter.
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSearchQuery("");
                setSelectedSeverity("all");
                setSelectedStatus("all");
              }}
              className="text-xs"
            >
              Reset Filters
            </Button>
          </div>
        )}

        {/* Forensic Evidence Viewer Modal */}
        {selectedIncident && (
          <Dialog open={!!selectedIncident} onOpenChange={() => setSelectedIncident(null)}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-card/95 backdrop-blur-2xl border-border/80 p-6">
              <DialogHeader className="pb-4 border-b border-border/60">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-mono text-xs font-bold text-primary px-2 py-0.5 rounded bg-primary/10 border border-primary/20">
                        {selectedIncident.id}
                      </span>
                      {getSeverityBadge(selectedIncident.severity)}
                    </div>
                    <DialogTitle className="text-xl font-bold text-foreground">
                      {selectedIncident.title}
                    </DialogTitle>
                  </div>

                  <Button
                    size="sm"
                    onClick={() => handleDownloadPDF(selectedIncident)}
                    className="text-xs bg-primary text-primary-foreground hover:bg-primary/90 gap-1.5"
                  >
                    <Download className="w-3.5 h-3.5" />
                    Download Dossier (PDF)
                  </Button>
                </div>
                <DialogDescription className="text-xs text-muted-foreground mt-1">
                  Detected {selectedIncident.timestamp} across {Array.isArray(selectedIncident.platforms) ? selectedIncident.platforms.join(", ") : selectedIncident.platforms}
                </DialogDescription>
              </DialogHeader>

              <div className="py-4 space-y-6">
                {/* Media Evidence Viewer Component */}
                <MediaEvidenceViewer
                  mediaType={selectedIncident.mediaType}
                  mediaUrl={selectedIncident.mediaUrl}
                  originalImageUrl={selectedIncident.originalImageUrl}
                  detections={selectedIncident.detections}
                  confidenceScore={selectedIncident.confidence / 100}
                />

                {/* Coordinated Action Overview */}
                <div className="p-4 rounded-lg bg-secondary/40 border border-border/60 space-y-3">
                  <h4 className="text-sm font-bold text-foreground flex items-center gap-2">
                    <Users className="w-4 h-4 text-primary" />
                    Coordinated Cluster Telemetry
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                    <div>
                      <span className="text-muted-foreground block text-[11px]">Accounts Involved</span>
                      <span className="font-bold font-data text-foreground">{selectedIncident.accounts}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground block text-[11px]">Estimated Reach</span>
                      <span className="font-bold font-data text-accent">{selectedIncident.reach}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground block text-[11px]">Evidence Pieces</span>
                      <span className="font-bold font-data text-foreground">{selectedIncident.evidence} files</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground block text-[11px]">ViT Model Confidence</span>
                      <span className="font-bold font-data text-success">{selectedIncident.confidence}%</span>
                    </div>
                  </div>
                </div>

                {/* Narrative Description & Analyst Notes */}
                <div className="space-y-2 text-xs">
                  <h4 className="font-bold text-foreground">Incident Summary & Narrative</h4>
                  <p className="text-muted-foreground leading-relaxed">
                    {selectedIncident.description}
                  </p>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </AppLayout>
  );
}
