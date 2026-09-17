/**
 * URL Analysis Page
 * Analyze social media URLs for deepfake content
 */

import { useState, useEffect } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  AlertCircle, 
  CheckCircle2, 
  XCircle, 
  Link as LinkIcon, 
  Loader2, 
  Upload, 
  BarChart3, 
  Globe, 
  Clock, 
  Shield, 
  AlertTriangle,
  Terminal,
  Trash2,
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { urlAnalysisService, type URLAnalysisResult, type BatchAnalysisProgress } from '@/services/urlAnalysisService';
import { socialMediaExtractor } from '@/services/socialMediaExtractor';

export default function URLAnalysisPage() {
  const navigate = useNavigate();
  const [singleUrl, setSingleUrl] = useState('');
  const [batchUrls, setBatchUrls] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState<URLAnalysisResult[]>([]);
  const [batchProgress, setBatchProgress] = useState<BatchAnalysisProgress | null>(null);
  const [logs, setLogs] = useState<string[]>([
    `[${new Date().toLocaleTimeString()}] [READY] yt-dlp & media scraper initialized`,
    `[${new Date().toLocaleTimeString()}] [READY] VideoMAE deepfake inference model loaded`,
  ]);

  const sampleUrls = {
    youtube_short: 'https://www.youtube.com/shorts/hxeEq4yqhNc',
    youtube_video: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    twitter: 'https://twitter.com/user/status/1234567890',
    instagram: 'https://instagram.com/p/ABC123/',
    tiktok: 'https://www.tiktok.com/@user/video/1234567890',
    direct_mp4: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
  };

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prev => [...prev, `[${timestamp}] ${message}`]);
  };

  const clearResults = () => {
    setResults([]);
    setLogs([]);
    setBatchProgress(null);
  };

  const analyzeSingleURL = async (url: string) => {
    if (!url.trim()) {
      addLog('❌ Please enter a valid URL');
      return;
    }

    setIsAnalyzing(true);
    addLog(`🔗 Ingesting URL stream: ${url}`);

    try {
      const result = await urlAnalysisService.analyzeURL(url);
      
      addLog(`✅ Analysis complete: ${result.analysisSuccess ? 
        `${result.verdict} (${(result.confidence! * 100).toFixed(1)}% confidence)` : 
        'Failed - ' + (result.extractionError || result.analysisError)
      }`);
      
      setResults(prev => [result, ...prev]);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      addLog(`❌ Analysis error: ${errorMessage}`);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const analyzeBatchURLs = async () => {
    const urls = batchUrls.split('\n').map(url => url.trim()).filter(Boolean);
    
    if (urls.length === 0) {
      addLog('❌ Please enter URLs (one per line)');
      return;
    }

    const { valid, invalid } = urlAnalysisService.validateURLs(urls);
    if (invalid.length > 0) {
      addLog(`⚠️ ${invalid.length} invalid URLs ignored`);
    }
    
    if (valid.length === 0) {
      addLog('❌ No valid URLs to process');
      return;
    }

    setIsAnalyzing(true);
    addLog(`🚀 Deploying batch analysis on ${valid.length} URLs...`);

    try {
      const batchRes = await urlAnalysisService.analyzeBatchURLs(valid, (progress) => {
        setBatchProgress(progress);
      });
      setResults(prev => [...batchRes, ...prev]);
      const stats = urlAnalysisService.getAnalysisStats(batchRes);
      addLog(`✅ Batch finished: ${stats.successful}/${stats.total} processed, ${stats.fake} synthetic flagged`);
    } catch (error) {
      addLog(`❌ Batch analysis error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsAnalyzing(false);
      setBatchProgress(null);
    }
  };

  const getVerdictBadge = (result: URLAnalysisResult) => {
    if (!result.analysisSuccess) {
      return <Badge variant="outline" className="bg-destructive/10 text-destructive border-destructive/30 font-mono text-[10px]">FAILED</Badge>;
    }
    if (result.verdict === 'FAKE') {
      return <Badge variant="destructive" className="bg-destructive/20 text-destructive border-destructive/30 font-mono text-[10px]">SYNTHETIC (FAKE)</Badge>;
    }
    return <Badge className="bg-success/20 text-success border-success/30 font-mono text-[10px]">AUTHENTIC (REAL)</Badge>;
  };

  return (
    <AppLayout
      title="Social Media URL Forensic Inspector"
      subtitle="Paste video links from YouTube, X, TikTok, or Instagram to extract streams and run frame-level deepfake inference"
      actions={
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={clearResults}
            className="text-xs font-medium border-border hover:bg-secondary/60"
          >
            Clear History
          </Button>
          <Button
            size="sm"
            onClick={() => navigate("/incidents")}
            className="text-xs font-medium bg-primary text-primary-foreground hover:bg-primary/90"
          >
            View Incidents
          </Button>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Main Interface Tabs */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Form Column */}
          <div className="soc-card rounded-xl p-6 space-y-5 lg:col-span-1">
            <Tabs defaultValue="single" className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-secondary/60 border border-border/70 p-1 mb-4">
                <TabsTrigger value="single" className="text-xs data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                  Single Link
                </TabsTrigger>
                <TabsTrigger value="batch" className="text-xs data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                  Batch Queue
                </TabsTrigger>
              </TabsList>

              {/* Single URL Tab */}
              <TabsContent value="single" className="space-y-4 outline-none">
                <div className="space-y-1.5">
                  <Label htmlFor="single-url" className="text-xs font-medium text-foreground">
                    Video or Post URL
                  </Label>
                  <div className="relative">
                    <LinkIcon className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
                    <Input
                      id="single-url"
                      placeholder="https://youtube.com/shorts/..."
                      value={singleUrl}
                      onChange={(e) => setSingleUrl(e.target.value)}
                      className="pl-9 h-9 text-xs bg-secondary/40 border-border"
                    />
                  </div>
                </div>

                {/* Preset sample links */}
                <div className="space-y-1.5">
                  <span className="text-[10px] text-muted-foreground font-mono">Sample Test Links:</span>
                  <div className="flex flex-wrap gap-1.5">
                    <button
                      type="button"
                      onClick={() => setSingleUrl(sampleUrls.youtube_short)}
                      className="text-[10px] px-2 py-0.5 rounded bg-secondary/80 hover:bg-primary/20 hover:text-primary transition-colors border border-border"
                    >
                      YouTube Short
                    </button>
                    <button
                      type="button"
                      onClick={() => setSingleUrl(sampleUrls.tiktok)}
                      className="text-[10px] px-2 py-0.5 rounded bg-secondary/80 hover:bg-primary/20 hover:text-primary transition-colors border border-border"
                    >
                      TikTok Clip
                    </button>
                    <button
                      type="button"
                      onClick={() => setSingleUrl(sampleUrls.direct_mp4)}
                      className="text-[10px] px-2 py-0.5 rounded bg-secondary/80 hover:bg-primary/20 hover:text-primary transition-colors border border-border"
                    >
                      Direct MP4
                    </button>
                  </div>
                </div>

                <Button
                  onClick={() => analyzeSingleURL(singleUrl)}
                  disabled={isAnalyzing || !singleUrl.trim()}
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90 text-xs h-9 font-medium gap-2"
                >
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      Analyzing Media Stream...
                    </>
                  ) : (
                    <>
                      <Shield className="w-3.5 h-3.5" />
                      Run Deepfake Analysis
                    </>
                  )}
                </Button>
              </TabsContent>

              {/* Batch URLs Tab */}
              <TabsContent value="batch" className="space-y-4 outline-none">
                <div className="space-y-1.5">
                  <Label htmlFor="batch-urls" className="text-xs font-medium text-foreground">
                    Multiple URLs (one per line)
                  </Label>
                  <Textarea
                    id="batch-urls"
                    placeholder="https://youtube.com/watch?v=...&#10;https://twitter.com/user/status/..."
                    value={batchUrls}
                    onChange={(e) => setBatchUrls(e.target.value)}
                    rows={4}
                    className="text-xs bg-secondary/40 border-border resize-none"
                  />
                </div>

                {batchProgress && (
                  <div className="space-y-1.5 p-3 rounded-lg bg-secondary/40 border border-border">
                    <div className="flex justify-between text-[11px] font-mono">
                      <span>Batch Progress</span>
                      <span>{batchProgress.completed + batchProgress.failed} / {batchProgress.total}</span>
                    </div>
                    <Progress value={((batchProgress.completed + batchProgress.failed) / batchProgress.total) * 100} className="h-1.5" />
                  </div>
                )}

                <Button
                  onClick={analyzeBatchURLs}
                  disabled={isAnalyzing || !batchUrls.trim()}
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90 text-xs h-9 font-medium gap-2"
                >
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      Processing Queue...
                    </>
                  ) : (
                    <>
                      <BarChart3 className="w-3.5 h-3.5" />
                      Analyze All URLs
                    </>
                  )}
                </Button>
              </TabsContent>
            </Tabs>
          </div>

          {/* Right Results & Logs Column */}
          <div className="space-y-6 lg:col-span-2">
            {/* Analysis Results Stream */}
            <div className="soc-card rounded-xl p-6 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-border/50">
                <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-primary" />
                  Forensic Results Feed ({results.length})
                </h3>
                <span className="text-xs text-muted-foreground font-mono">VideoMAE ViT</span>
              </div>

              {results.length === 0 ? (
                <div className="p-8 text-center rounded-lg bg-secondary/20 border border-border/40 text-xs text-muted-foreground space-y-1">
                  <Globe className="w-8 h-8 text-muted-foreground/50 mx-auto mb-2" />
                  <p className="font-medium text-foreground">No media analyzed yet</p>
                  <p>Paste a social media video link to inspect frame authenticity</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {results.map((res, i) => (
                    <div
                      key={i}
                      className="p-4 rounded-lg bg-secondary/40 border border-border/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          {getVerdictBadge(res)}
                          {res.confidence !== undefined && (
                            <span className="font-mono text-[11px] font-bold text-foreground">
                              {(res.confidence * 100).toFixed(1)}% Confidence
                            </span>
                          )}
                        </div>
                        <div className="font-mono text-[11px] text-muted-foreground line-clamp-1 max-w-md">
                          {res.url}
                        </div>
                        {res.analysisDetails?.modelName && (
                          <div className="text-[10px] text-muted-foreground font-mono">
                            Model: {res.analysisDetails.modelName} • Frames: {res.analysisDetails.framesAnalyzed || 16}
                          </div>
                        )}
                      </div>

                      {res.verdict === 'FAKE' && (
                        <Button
                          size="sm"
                          onClick={() => navigate("/incidents")}
                          className="text-xs h-7 bg-destructive/90 text-destructive-foreground hover:bg-destructive self-start sm:self-center"
                        >
                          Escalate to Incident
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Terminal Logs */}
            <div className="soc-card rounded-xl p-5 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-border/50">
                <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground">
                  <Terminal className="w-4 h-4 text-primary" />
                  Extraction & Inference Logs
                </div>
                <button
                  onClick={() => setLogs([])}
                  className="text-[11px] text-muted-foreground hover:text-foreground flex items-center gap-1 font-mono"
                >
                  <Trash2 className="w-3 h-3" /> Clear
                </button>
              </div>

              <div className="p-3.5 rounded-lg bg-black/85 border border-border/70 font-mono text-[11px] text-emerald-400 space-y-1.5 max-h-48 overflow-y-auto">
                {logs.map((log, idx) => (
                  <div key={idx} className="leading-relaxed">{log}</div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}