/**
 * URL Analysis Page
 * Analyze social media URLs for deepfake content
 */

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  AlertCircle, 
  CheckCircle2, 
  XCircle, 
  Link, 
  Loader2, 
  Upload,
  BarChart3,
  Globe,
  Clock,
  Shield,
  AlertTriangle
} from 'lucide-react';

import { urlAnalysisService, type URLAnalysisResult, type BatchAnalysisProgress } from '@/services/urlAnalysisService';
import { socialMediaExtractor } from '@/services/socialMediaExtractor';

export default function URLAnalysisPage() {
  const [singleUrl, setSingleUrl] = useState('');
  const [batchUrls, setBatchUrls] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState<URLAnalysisResult[]>([]);
  const [batchProgress, setBatchProgress] = useState<BatchAnalysisProgress | null>(null);
  const [logs, setLogs] = useState<string[]>([]);

  // Sample URLs for testing
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
      addLog('❌ Please enter a URL');
      return;
    }

    setIsAnalyzing(true);
    addLog(`🔗 Analyzing URL: ${url}`);

    try {
      const result = await urlAnalysisService.analyzeURL(url);
      
      addLog(`✅ Analysis complete: ${result.analysisSuccess ? 
        `${result.verdict} (${(result.confidence! * 100).toFixed(1)}% confidence)` : 
        'Failed - ' + (result.extractionError || result.analysisError)
      }`);
      
      setResults(prev => [result, ...prev]);
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      
      // Check if it's an extraction failure
      if (errorMessage.includes('Failed to extract video') || errorMessage.includes('private, deleted')) {
        addLog(`⚠️ Video Extraction Failed: ${errorMessage}`);
        addLog(`💡 Possible causes: Private video, deleted content, geo-blocked, or age-restricted`);
        addLog(`� Try: Different URL, public videos, or direct video file upload`);
      } else if (errorMessage.includes('Video too long')) {
        addLog(`⏱️ Video Duration Limit: ${errorMessage}`);
        addLog(`� Tip: Videos longer than 5 minutes are not supported for performance reasons`);
      } else {
        addLog(`❌ Analysis failed: ${errorMessage}`);
      }
    } finally {
      setIsAnalyzing(false);
    }
  };

  const analyzeBatchURLs = async () => {
    const urls = batchUrls.split('\n').map(url => url.trim()).filter(url => url);
    
    if (urls.length === 0) {
      addLog('❌ Please enter URLs (one per line)');
      return;
    }

    // Validate URLs
    const { valid, invalid } = urlAnalysisService.validateURLs(urls);
    
    if (invalid.length > 0) {
      addLog(`⚠️ ${invalid.length} invalid URLs found: ${invalid.join(', ')}`);
    }
    
    if (valid.length === 0) {
      addLog('❌ No valid URLs to process');
      return;
    }

    setIsAnalyzing(true);
    addLog(`🚀 Starting batch analysis of ${valid.length} URLs...`);

    try {
      const results = await urlAnalysisService.analyzeBatchURLs(valid, (progress) => {
        setBatchProgress(progress);
        
        if (progress.completed + progress.failed > 0) {
          addLog(`📊 Progress: ${progress.completed + progress.failed}/${progress.total} completed`);
        }
      });
      
      setResults(prev => [...results, ...prev]);
      
      const stats = urlAnalysisService.getAnalysisStats(results);
      addLog(`✅ Batch complete: ${stats.successful}/${stats.total} successful, ${stats.fake} fake detected`);
      
    } catch (error) {
      addLog(`❌ Batch analysis failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsAnalyzing(false);
      setBatchProgress(null);
    }
  };

  const getVerdictBadge = (result: URLAnalysisResult) => {
    if (!result.analysisSuccess) {
      return <Badge variant="destructive">Failed</Badge>;
    }
    
    if (result.verdict === 'FAKE') {
      return <Badge variant="destructive">FAKE</Badge>;
    }
    
    return <Badge variant="default">REAL</Badge>;
  };

  const getConfidenceColor = (confidence?: number) => {
    if (!confidence) return 'text-gray-500';
    if (confidence > 0.8) return 'text-green-600';
    if (confidence > 0.6) return 'text-yellow-600';
    return 'text-red-600';
  };

  const stats = results.length > 0 ? urlAnalysisService.getAnalysisStats(results) : null;

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">Social Media URL Analysis</h1>
        <p className="text-muted-foreground">
          Analyze videos from Twitter/X, Instagram, TikTok, YouTube, and direct URLs for deepfake content
        </p>
      </div>

      {/* URL Support Information */}
      <div className="grid md:grid-cols-2 gap-4">
        <Alert>
          <Globe className="h-4 w-4" />
          <AlertDescription>
            <strong>Supported Platforms:</strong> {socialMediaExtractor.getSupportedPlatforms().join(' • ')}
          </AlertDescription>
        </Alert>
        
        <Alert>
          <CheckCircle2 className="h-4 w-4" />
          <AlertDescription>
            <strong>✅ Fully Working:</strong> All social media platforms + direct video URLs<br/>
            <strong>🚀 Powered by:</strong> yt-dlp video extraction technology
          </AlertDescription>
        </Alert>
      </div>

      <Tabs defaultValue="single" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="single">Single URL</TabsTrigger>
          <TabsTrigger value="batch">Batch Analysis</TabsTrigger>
        </TabsList>

        {/* Single URL Analysis */}
        <TabsContent value="single" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Link className="w-5 h-5" />
                Single URL Analysis
              </CardTitle>
              <CardDescription>
                Analyze a single social media post or video URL
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="singleUrl">URL</Label>
                <Input
                  id="singleUrl"
                  type="url"
                  placeholder="https://twitter.com/user/status/123... or https://instagram.com/p/ABC..."
                  value={singleUrl}
                  onChange={(e) => setSingleUrl(e.target.value)}
                  disabled={isAnalyzing}
                />
              </div>

              <div className="flex gap-2 flex-wrap">
                <Button 
                  onClick={() => analyzeSingleURL(singleUrl)}
                  disabled={isAnalyzing}
                >
                  {isAnalyzing && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  Analyze URL
                </Button>
                
                {/* Sample URL buttons */}
                {Object.entries(sampleUrls).map(([platform, url]) => (
                  <Button 
                    key={platform}
                    onClick={() => {
                      setSingleUrl(url);
                      analyzeSingleURL(url);
                    }}
                    variant="outline"
                    size="sm"
                    disabled={isAnalyzing}
                  >
                    Try {platform}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Batch URL Analysis */}
        <TabsContent value="batch" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="w-5 h-5" />
                Batch URL Analysis
              </CardTitle>
              <CardDescription>
                Analyze multiple URLs at once (one per line)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="batchUrls">URLs (one per line)</Label>
                <Textarea
                  id="batchUrls"
                  placeholder={`https://twitter.com/user/status/123
https://instagram.com/p/ABC123/
https://www.tiktok.com/@user/video/456
https://example.com/video.mp4`}
                  value={batchUrls}
                  onChange={(e) => setBatchUrls(e.target.value)}
                  disabled={isAnalyzing}
                  rows={8}
                />
              </div>

              <div className="flex gap-2">
                <Button 
                  onClick={analyzeBatchURLs}
                  disabled={isAnalyzing}
                >
                  {isAnalyzing && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  Analyze Batch
                </Button>
                <Button 
                  onClick={() => setBatchUrls(Object.values(sampleUrls).join('\n'))}
                  variant="outline"
                  disabled={isAnalyzing}
                >
                  Load Sample URLs
                </Button>
              </div>

              {/* Batch Progress */}
              {batchProgress && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progress: {batchProgress.completed + batchProgress.failed} / {batchProgress.total}</span>
                    <span>{Math.round(((batchProgress.completed + batchProgress.failed) / batchProgress.total) * 100)}%</span>
                  </div>
                  <Progress value={((batchProgress.completed + batchProgress.failed) / batchProgress.total) * 100} />
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Statistics */}
      {stats && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Analysis Statistics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{stats.successful}</div>
                <div className="text-sm text-muted-foreground">Successful</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">{stats.fake}</div>
                <div className="text-sm text-muted-foreground">Deepfakes</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{stats.real}</div>
                <div className="text-sm text-muted-foreground">Real Videos</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-600">{stats.failed}</div>
                <div className="text-sm text-muted-foreground">Failed</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Results */}
      {results.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Analysis Results</span>
              <Button onClick={clearResults} variant="outline" size="sm">
                Clear Results
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {results.map((result, index) => (
                <div key={index} className="border rounded-lg p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {getVerdictBadge(result)}
                      <Badge variant="outline">{result.platform}</Badge>
                      {result.confidence && (
                        <span className={`text-sm font-medium ${getConfidenceColor(result.confidence)}`}>
                          {(result.confidence * 100).toFixed(1)}%
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="w-4 h-4" />
                      {(result.totalProcessingTime / 1000).toFixed(1)}s
                    </div>
                  </div>
                  
                  <div className="text-sm break-all">
                    <strong>URL:</strong> {result.url}
                  </div>
                  
                  {result.model && (
                    <div className="text-sm text-muted-foreground">
                      <strong>Model:</strong> {result.model}
                    </div>
                  )}
                  
                  {(result.extractionError || result.analysisError) && (
                    <div className="text-sm text-red-600">
                      <AlertTriangle className="w-4 h-4 inline mr-1" />
                      <strong>Error:</strong> {result.extractionError || result.analysisError}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Activity Log */}
      {logs.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Activity Log</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-gray-50 rounded-lg p-4 max-h-60 overflow-y-auto font-mono text-sm">
              {logs.map((log, index) => (
                <div key={index} className="mb-1">
                  {log}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}