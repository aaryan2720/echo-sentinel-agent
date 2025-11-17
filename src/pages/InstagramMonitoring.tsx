/**
 * Instagram Monitoring Dashboard Component
 * Manage Instagram hashtag monitoring and view real-time detections
 */

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  AlertCircle, 
  CheckCircle2, 
  XCircle, 
  Instagram, 
  Loader2, 
  Play,
  Pause,
  BarChart3,
  Hash,
  Activity,
  TrendingUp
} from 'lucide-react';

interface MonitoringJob {
  id: string;
  hashtags: string[];
  posts_scanned: number;
  deepfakes_found: number;
  last_scan: string | null;
  active: boolean;
}

interface MonitoringStatus {
  active_jobs: number;
  total_hashtags: number;
  posts_scanned: number;
  deepfakes_detected: number;
  detection_rate: number;
  jobs: MonitoringJob[];
}

export default function InstagramMonitoringPage() {
  const [hashtags, setHashtags] = useState('');
  const [keywords, setKeywords] = useState('');
  const [isStarting, setIsStarting] = useState(false);
  const [monitoringStatus, setMonitoringStatus] = useState<MonitoringStatus | null>(null);
  const [logs, setLogs] = useState<string[]>([]);

  // Popular hashtags for quick start
  const popularHashtags = [
    'politics, election2024, breaking',
    'celebrity, hollywood, entertainment',
    'crypto, bitcoin, nft',
    'deepfake, ai, fake',
    'viral, trending, news'
  ];

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prev => [...prev, `[${timestamp}] ${message}`]);
  };

  // Fetch monitoring status
  const fetchMonitoringStatus = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/instagram/monitor/status');
      if (response.ok) {
        const status = await response.json();
        setMonitoringStatus(status);
      }
    } catch (error) {
      console.error('Failed to fetch monitoring status:', error);
    }
  };

  // Start monitoring
  const startMonitoring = async () => {
    const hashtagList = hashtags.split(',').map(h => h.trim().replace('#', ''));
    const keywordList = keywords.split(',').map(k => k.trim()).filter(k => k);

    if (hashtagList.length === 0 || hashtagList[0] === '') {
      addLog('❌ Please enter at least one hashtag');
      return;
    }

    setIsStarting(true);
    addLog(`🚀 Starting Instagram monitoring for: #${hashtagList.join(', #')}`);

    try {
      const response = await fetch('http://localhost:8000/api/instagram/monitor/start', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          hashtags: hashtagList,
          keywords: keywordList.length > 0 ? keywordList : undefined,
        }),
      });

      if (response.ok) {
        const result = await response.json();
        addLog(`✅ Monitoring started successfully! Job ID: ${result.job_id}`);
        addLog(`📊 Monitoring ${result.hashtags.length} hashtags`);
        
        // Refresh status
        setTimeout(fetchMonitoringStatus, 1000);
      } else {
        const error = await response.json();
        addLog(`❌ Failed to start monitoring: ${error.detail}`);
      }
    } catch (error) {
      addLog(`❌ Error starting monitoring: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsStarting(false);
    }
  };

  // Stop monitoring job
  const stopMonitoring = async (jobId: string) => {
    addLog(`⏹️ Stopping monitoring job: ${jobId}`);

    try {
      const response = await fetch(`http://localhost:8000/api/instagram/monitor/stop/${jobId}`, {
        method: 'POST',
      });

      if (response.ok) {
        const result = await response.json();
        addLog(`✅ ${result.message}`);
        
        // Refresh status
        setTimeout(fetchMonitoringStatus, 1000);
      } else {
        const error = await response.json();
        addLog(`❌ Failed to stop monitoring: ${error.detail}`);
      }
    } catch (error) {
      addLog(`❌ Error stopping monitoring: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  // Auto-refresh monitoring status
  useEffect(() => {
    fetchMonitoringStatus();
    const interval = setInterval(fetchMonitoringStatus, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const clearResults = () => {
    setLogs([]);
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
          <Instagram className="w-8 h-8 text-pink-500" />
          Instagram Monitoring
        </h1>
        <p className="text-muted-foreground">
          Monitor Instagram hashtags in real-time for deepfake content and suspicious activity
        </p>
      </div>

      {/* Status Overview */}
      {monitoringStatus && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{monitoringStatus.active_jobs}</div>
                <div className="text-sm text-muted-foreground">Active Jobs</div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{monitoringStatus.total_hashtags}</div>
                <div className="text-sm text-muted-foreground">Hashtags Monitored</div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">{monitoringStatus.posts_scanned}</div>
                <div className="text-sm text-muted-foreground">Posts Scanned</div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">{monitoringStatus.deepfakes_detected}</div>
                <div className="text-sm text-muted-foreground">Deepfakes Found</div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <Tabs defaultValue="setup" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="setup">Setup Monitoring</TabsTrigger>
          <TabsTrigger value="status">Active Jobs</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
        </TabsList>

        {/* Setup Monitoring */}
        <TabsContent value="setup" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Hash className="w-5 h-5" />
                Setup Instagram Monitoring
              </CardTitle>
              <CardDescription>
                Configure hashtags and keywords to monitor for potential deepfake content
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="hashtags">Hashtags to Monitor (comma-separated)</Label>
                <Input
                  id="hashtags"
                  placeholder="politics, election2024, breaking, celebrity"
                  value={hashtags}
                  onChange={(e) => setHashtags(e.target.value)}
                  disabled={isStarting}
                />
                <p className="text-sm text-muted-foreground">
                  Enter hashtags without # symbol. Example: politics, breaking, viral
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="keywords">Additional Keywords (optional)</Label>
                <Input
                  id="keywords"
                  placeholder="deepfake, fake, generated, suspicious"
                  value={keywords}
                  onChange={(e) => setKeywords(e.target.value)}
                  disabled={isStarting}
                />
                <p className="text-sm text-muted-foreground">
                  Keywords to look for in post captions for enhanced detection
                </p>
              </div>

              <div className="flex gap-2 flex-wrap">
                <Button 
                  onClick={startMonitoring}
                  disabled={isStarting}
                  className="bg-pink-600 hover:bg-pink-700"
                >
                  {isStarting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  <Play className="w-4 h-4 mr-2" />
                  Start Monitoring
                </Button>
                
                {/* Quick start buttons */}
                {popularHashtags.map((tags, index) => (
                  <Button 
                    key={index}
                    onClick={() => setHashtags(tags)}
                    variant="outline"
                    size="sm"
                    disabled={isStarting}
                  >
                    {tags.split(',')[0]}+
                  </Button>
                ))}
              </div>

              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  <strong>Note:</strong> Instagram monitoring uses simulated data for demo purposes. 
                  In production, this would connect to Instagram's API or use web scraping.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Active Jobs */}
        <TabsContent value="status" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5" />
                Active Monitoring Jobs
              </CardTitle>
            </CardHeader>
            <CardContent>
              {monitoringStatus && monitoringStatus.jobs.length > 0 ? (
                <div className="space-y-4">
                  {monitoringStatus.jobs.map((job) => (
                    <div key={job.id} className="border rounded-lg p-4 space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Badge variant={job.active ? "default" : "secondary"}>
                            {job.active ? "Active" : "Stopped"}
                          </Badge>
                          <span className="font-medium">Job {job.id.split('_')[1]}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          {job.active && (
                            <Button
                              onClick={() => stopMonitoring(job.id)}
                              variant="outline"
                              size="sm"
                            >
                              <Pause className="w-4 h-4 mr-1" />
                              Stop
                            </Button>
                          )}
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Hashtags:</span>
                          <div className="font-medium">#{job.hashtags.join(', #')}</div>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Posts Scanned:</span>
                          <div className="font-medium">{job.posts_scanned}</div>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Deepfakes Found:</span>
                          <div className="font-medium text-red-600">{job.deepfakes_found}</div>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Last Scan:</span>
                          <div className="font-medium">
                            {job.last_scan ? new Date(job.last_scan).toLocaleTimeString() : 'Never'}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Instagram className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                  <p className="text-muted-foreground">No active monitoring jobs</p>
                  <p className="text-sm text-muted-foreground">Start monitoring hashtags to see jobs here</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Insights */}
        <TabsContent value="insights" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Monitoring Insights
              </CardTitle>
            </CardHeader>
            <CardContent>
              {monitoringStatus ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="border rounded-lg p-4">
                      <h4 className="font-medium mb-2">Detection Performance</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Detection Rate:</span>
                          <span className="font-medium">{monitoringStatus.detection_rate.toFixed(1)}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Posts per Hour:</span>
                          <span className="font-medium">~50</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Response Time:</span>
                          <span className="font-medium"> 5 min</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="border rounded-lg p-4">
                      <h4 className="font-medium mb-2">Platform Coverage</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Instagram:</span>
                          <Badge variant="default">Active</Badge>
                        </div>
                        <div className="flex justify-between">
                          <span>Twitter/X:</span>
                          <Badge variant="secondary">Planned</Badge>
                        </div>
                        <div className="flex justify-between">
                          <span>TikTok:</span>
                          <Badge variant="secondary">Planned</Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {monitoringStatus.deepfakes_detected > 0 && (
                    <Alert>
                      <TrendingUp className="h-4 w-4" />
                      <AlertDescription>
                        <strong>Alert:</strong> {monitoringStatus.deepfakes_detected} deepfake(s) detected! 
                        Check the Incidents page for details.
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
              ) : (
                <div className="text-center py-8">
                  <BarChart3 className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                  <p className="text-muted-foreground">Start monitoring to see insights</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Activity Log */}
      {logs.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Activity Log</span>
              <Button onClick={clearResults} variant="outline" size="sm">
                Clear Log
              </Button>
            </CardTitle>
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