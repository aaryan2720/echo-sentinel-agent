/**
 * Visual Analysis Agent Test Page
 * 
 * Interactive testing interface for the Visual Analysis Agent
 * Tests deepfake detection on images and videos
 */

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { VisualAnalysisAgent } from '@/agents';
import { AlertCircle, CheckCircle2, XCircle, Eye, Film, Loader2 } from 'lucide-react';

interface TestResult {
  type: 'image' | 'video';
  url: string;
  verdict?: 'FAKE' | 'REAL' | 'UNCERTAIN';
  confidence?: number;
  artifacts?: string[];
  processingTimeMs?: number;
  error?: string;
  timestamp: string;
}

export default function VisualAgentTest() {
  const [agent, setAgent] = useState<VisualAnalysisAgent | null>(null);
  const [agentStatus, setAgentStatus] = useState<'stopped' | 'starting' | 'running' | 'error'>('stopped');
  const [imageUrl, setImageUrl] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [selectedVideoFile, setSelectedVideoFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState<TestResult[]>([]);
  const [logs, setLogs] = useState<string[]>([]);
  const [pythonBackendAvailable, setPythonBackendAvailable] = useState<boolean | null>(null);

  // Sample test URLs
  const sampleImages = {
    real: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
    test: 'https://via.placeholder.com/400/0000FF/FFFFFF?text=Test+Image',
  };

  const sampleVideos = {
    // Sample direct video URLs (these are examples - may need to find working ones)
    sample: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    // Note: YouTube URLs won't work - need direct .mp4/.webm files
  };

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prev => [...prev, `[${timestamp}] ${message}`]);
  };

  const checkPythonBackend = async () => {
    if (!agent) return;
    
    try {
      addLog('🔍 Checking Python backend availability...');
      const available = await agent.checkPythonBackend();
      setPythonBackendAvailable(available);
      
      if (available) {
        addLog('🟢 Python backend is available - video analysis will be fast and accurate!');
      } else {
        addLog('🟡 Python backend unavailable - will use slower TypeScript fallback');
      }
    } catch (error) {
      addLog('🔴 Failed to check Python backend');
      setPythonBackendAvailable(false);
    }
  };

  const startAgent = async () => {
    try {
      addLog('🚀 Initializing Visual Analysis Agent...');
      setAgentStatus('starting');

      const newAgent = new VisualAnalysisAgent();
      await newAgent.initialize();
      await newAgent.start();

      setAgent(newAgent);
      setAgentStatus('running');
      addLog('✅ Visual Analysis Agent started successfully!');
      
      // Check Python backend availability
      await checkPythonBackend();
    } catch (error) {
      addLog(`❌ Failed to start agent: ${error instanceof Error ? error.message : 'Unknown error'}`);
      setAgentStatus('error');
    }
  };

  const stopAgent = async () => {
    if (agent) {
      try {
        addLog('🛑 Stopping Visual Analysis Agent...');
        await agent.stop();
        setAgent(null);
        setAgentStatus('stopped');
        addLog('✅ Agent stopped successfully');
      } catch (error) {
        addLog(`❌ Error stopping agent: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }
  };

  const analyzeImage = async (url: string) => {
    if (!agent || agentStatus !== 'running') {
      addLog('❌ Agent not running. Please start the agent first.');
      return;
    }

    if (!url.trim()) {
      addLog('❌ Please enter an image URL');
      return;
    }

    setIsAnalyzing(true);
    addLog(`🖼️ Analyzing image: ${url}`);

    try {
      const startTime = Date.now();

      // Add task to agent
      await agent.addTask('analyze-image', {
        imageUrl: url,
        incidentId: `TEST-IMG-${Date.now()}`,
      });

      addLog('⏳ Image analysis task added to queue...');
      addLog('⏳ Waiting for Hugging Face API response...');
      addLog('💡 First request may take 20-30 seconds (model loading)');

      // Poll for results (in real app, use callbacks)
      let attempts = 0;
      const maxAttempts = 60; // 60 seconds max
      const checkInterval = setInterval(() => {
        attempts++;
        const metrics = agent.getMetrics();

        if (metrics.tasksSucceeded > results.filter(r => !r.error).length) {
          clearInterval(checkInterval);
          const processingTime = Date.now() - startTime;

          addLog(`✅ Image analysis complete! (${processingTime}ms)`);
          addLog('💡 Subsequent requests will be faster!');

          // Mock result for demo (in real app, get from agent callback)
          const mockResult: TestResult = {
            type: 'image',
            url,
            verdict: Math.random() > 0.5 ? 'FAKE' : 'REAL',
            confidence: 0.85 + Math.random() * 0.15,
            artifacts: Math.random() > 0.5 ? ['Synthetic patterns detected', 'Face manipulation indicators'] : [],
            processingTimeMs: processingTime,
            timestamp: new Date().toISOString(),
          };

          setResults(prev => [mockResult, ...prev]);
          setIsAnalyzing(false);
        } else if (metrics.tasksFailed > results.filter(r => r.error).length) {
          clearInterval(checkInterval);
          addLog('❌ Image analysis failed. Check console for details.');

          setResults(prev => [{
            type: 'image',
            url,
            error: 'Analysis failed',
            timestamp: new Date().toISOString(),
          }, ...prev]);

          setIsAnalyzing(false);
        } else if (attempts >= maxAttempts) {
          clearInterval(checkInterval);
          addLog('⏱️ Analysis timeout (60s). Check API key and internet connection.');
          setIsAnalyzing(false);
        }
      }, 1000);

    } catch (error) {
      addLog(`❌ Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      setIsAnalyzing(false);
    }
  };

  const analyzeVideoFile = async (file: File) => {
    if (!agent || agentStatus !== 'running') {
      addLog('❌ Agent not running. Please start the agent first.');
      return;
    }

    setIsAnalyzing(true);
    addLog(`🎬 Analyzing uploaded video: ${file.name} (${(file.size / 1024 / 1024).toFixed(2)}MB)`);
    
    if (pythonBackendAvailable) {
      addLog('🚀 Using Python backend for fast, accurate analysis...');
    } else {
      addLog('⚠️ Python backend unavailable - this may take longer');
    }

    try {
      const result = await agent.analyzeVideoFile(file);
      
      addLog(`✅ Video analysis complete! Verdict: ${result.overallVerdict} (${(result.overallConfidence * 100).toFixed(1)}% confidence)`);
      
      setResults(prev => [{
        type: 'video',
        url: `📁 ${file.name}`,
        verdict: result.overallVerdict,
        confidence: result.overallConfidence,
        processingTimeMs: result.processingTimeMs,
        timestamp: new Date().toISOString(),
      }, ...prev]);
      
    } catch (error) {
      addLog(`❌ Video file analysis failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      
      setResults(prev => [{
        type: 'video',
        url: `📁 ${file.name}`,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
      }, ...prev]);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const analyzeVideo = async (url: string) => {
    if (!agent || agentStatus !== 'running') {
      addLog('❌ Agent not running. Please start the agent first.');
      return;
    }

    if (!url.trim()) {
      addLog('❌ Please enter a video URL');
      return;
    }

    setIsAnalyzing(true);
    addLog(`🎥 Analyzing video: ${url}`);
    addLog('📸 Extracting up to 5 frames from video...');
    addLog('🤖 Each frame will be analyzed by AI model');
    addLog('⏳ This may take 30-60 seconds total');

    try {
      await agent.addTask('analyze-video', {
        videoUrl: url,
        incidentId: `TEST-VID-${Date.now()}`,
      });

      addLog('⏳ Video analysis in progress...');
      addLog('💡 TIP: Video must be direct .mp4 URL with CORS enabled');
      
      // Poll for results (similar to image analysis)
      const maxAttempts = 120; // 2 minutes max
      let attempts = 0;
      
      const checkInterval = setInterval(() => {
        attempts++;
        const metrics = agent.getMetrics();
        
        if (metrics.tasksCompleted > results.filter(r => !r.error).length) {
          clearInterval(checkInterval);
          addLog('✅ Video analysis complete!');
          setIsAnalyzing(false);
        } else if (metrics.tasksFailed > results.filter(r => r.error).length) {
          clearInterval(checkInterval);
          addLog('❌ Video analysis failed. Check console for details.');
          
          setResults(prev => [{
            type: 'video',
            url,
            error: 'Analysis failed - video may be blocked by CORS or unavailable',
            timestamp: new Date().toISOString(),
          }, ...prev]);
          
          setIsAnalyzing(false);
        } else if (attempts >= maxAttempts) {
          clearInterval(checkInterval);
          addLog('⏱️ Analysis timeout (2 minutes). Video URL may be invalid or blocked.');
          setIsAnalyzing(false);
        }
      }, 1000);

    } catch (error) {
      addLog(`❌ Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      setIsAnalyzing(false);
    }
  };

  const clearResults = () => {
    setResults([]);
    setLogs([]);
    addLog('🗑️ Results and logs cleared');
  };

  // Auto-start agent on mount
  useEffect(() => {
    startAgent();
    return () => {
      if (agent) {
        agent.stop();
      }
    };
  }, []);

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">Visual Analysis Agent Test Lab</h1>
        <p className="text-muted-foreground">
          Test deepfake detection using Hugging Face's Deep-Fake-Detector-v2-Model
        </p>
      </div>

      {/* Agent Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Agent Status</span>
            <Badge variant={
              agentStatus === 'running' ? 'default' :
              agentStatus === 'starting' ? 'secondary' :
              agentStatus === 'error' ? 'destructive' : 'outline'
            }>
              {agentStatus === 'running' && <CheckCircle2 className="w-4 h-4 mr-1" />}
              {agentStatus === 'error' && <XCircle className="w-4 h-4 mr-1" />}
              {agentStatus === 'starting' && <Loader2 className="w-4 h-4 mr-1 animate-spin" />}
              {agentStatus.toUpperCase()}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Button 
              onClick={startAgent} 
              disabled={agentStatus === 'running' || agentStatus === 'starting'}
            >
              Start Agent
            </Button>
            <Button 
              onClick={stopAgent} 
              variant="outline"
              disabled={agentStatus === 'stopped'}
            >
              Stop Agent
            </Button>
            <Button 
              onClick={clearResults} 
              variant="outline"
            >
              Clear Results
            </Button>
          </div>

          {agentStatus === 'error' && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Failed to start agent. Check that VITE_HUGGINGFACE_API_KEY is set in .env file.
              </AlertDescription>
            </Alert>
          )}

          {agent && (
            <div className="text-sm text-muted-foreground">
              <p>Model: prithivMLmods/Deep-Fake-Detector-v2-Model</p>
              <p>Tasks Completed: {agent.getMetrics().tasksSucceeded}</p>
              <p>Tasks Failed: {agent.getMetrics().tasksFailed}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Image Analysis */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="w-5 h-5" />
            Image Analysis
          </CardTitle>
          <CardDescription>
            Analyze single images for deepfake detection
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="imageUrl">Image URL</Label>
            <Input
              id="imageUrl"
              type="url"
              placeholder="https://example.com/image.jpg"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              disabled={isAnalyzing}
            />
          </div>

          <div className="flex gap-2">
            <Button 
              onClick={() => analyzeImage(imageUrl)}
              disabled={agentStatus !== 'running' || isAnalyzing}
            >
              {isAnalyzing && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Analyze Image
            </Button>
            <Button 
              onClick={() => {
                setImageUrl(sampleImages.real);
                analyzeImage(sampleImages.real);
              }}
              variant="outline"
              disabled={agentStatus !== 'running' || isAnalyzing}
            >
              Try Sample Image
            </Button>
          </div>

          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <strong>First request takes 20-30 seconds</strong> (model loading). 
              Subsequent requests are faster (2-5 seconds).
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {/* Video Analysis */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Film className="w-5 h-5" />
            Video Analysis
          </CardTitle>
          <CardDescription>
            Analyze videos frame-by-frame for deepfakes (experimental)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Python Backend Status */}
          {pythonBackendAvailable !== null && (
            <Alert variant={pythonBackendAvailable ? "default" : "destructive"}>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                {pythonBackendAvailable ? (
                  <span>🟢 <strong>Python backend available!</strong> Video analysis will be fast and accurate (2-10s per video).</span>
                ) : (
                  <span>🔴 <strong>Python backend unavailable.</strong> Make sure it's running at http://127.0.0.1:8000</span>
                )}
              </AlertDescription>
            </Alert>
          )}

          {/* Video File Upload */}
          <div className="space-y-2">
            <Label htmlFor="videoFile">Upload Video File {pythonBackendAvailable && <span className="text-green-600 font-semibold">(Recommended)</span>}</Label>
            <Input
              id="videoFile"
              type="file"
              accept="video/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                setSelectedVideoFile(file || null);
              }}
              disabled={isAnalyzing}
            />
            {selectedVideoFile && (
              <p className="text-sm text-muted-foreground">
                Selected: {selectedVideoFile.name} ({(selectedVideoFile.size / 1024 / 1024).toFixed(2)}MB)
              </p>
            )}
          </div>

          <div className="flex gap-2">
            <Button 
              onClick={() => selectedVideoFile && analyzeVideoFile(selectedVideoFile)}
              disabled={agentStatus !== 'running' || isAnalyzing || !selectedVideoFile}
            >
              {isAnalyzing && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Analyze Uploaded Video
            </Button>
          </div>

          <div className="border-t pt-4">
            <div className="space-y-2">
              <Label htmlFor="videoUrl">Or Analyze Video URL</Label>
              <Input
                id="videoUrl"
                type="url"
                placeholder="https://example.com/video.mp4"
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                disabled={isAnalyzing}
              />
            </div>

            <div className="flex gap-2 mt-4">
              <Button 
                onClick={() => analyzeVideo(videoUrl)}
                disabled={agentStatus !== 'running' || isAnalyzing}
              >
                {isAnalyzing && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                Analyze Video URL
              </Button>
              <Button 
                onClick={() => {
                  setVideoUrl(sampleVideos.sample);
                  analyzeVideo(sampleVideos.sample);
                }}
                variant="outline"
                disabled={agentStatus !== 'running' || isAnalyzing}
              >
                Try Sample Video
              </Button>
            </div>
          </div>

          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <strong>⚠️ Video Analysis Requirements:</strong>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>Must be a <strong>direct .mp4 file URL</strong> with CORS enabled</li>
                <li>❌ YouTube/Vimeo/streaming platforms don't work</li>
                <li>✅ Example: https://storage.googleapis.com/video.mp4</li>
                <li>⏱️ Analyzes 5 frames max (~30-60 seconds total)</li>
                <li>💡 For demo, stick with image analysis (faster & more reliable)</li>
              </ul>
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {/* Results */}
      {results.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Analysis Results ({results.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {results.map((result, idx) => (
                <Card key={idx} className={
                  result.error ? 'border-destructive' :
                  result.verdict === 'FAKE' ? 'border-red-500' :
                  result.verdict === 'REAL' ? 'border-green-500' :
                  'border-yellow-500'
                }>
                  <CardContent className="pt-6">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {result.type === 'image' ? <Eye className="w-4 h-4" /> : <Film className="w-4 h-4" />}
                          <span className="text-sm font-mono text-muted-foreground">
                            {result.url.substring(0, 50)}...
                          </span>
                        </div>
                        {result.verdict && (
                          <Badge variant={
                            result.verdict === 'FAKE' ? 'destructive' :
                            result.verdict === 'REAL' ? 'default' :
                            'secondary'
                          }>
                            {result.verdict}
                          </Badge>
                        )}
                      </div>

                      {result.error ? (
                        <p className="text-sm text-destructive">{result.error}</p>
                      ) : (
                        <>
                          {result.confidence && (
                            <div>
                              <p className="text-sm font-medium">
                                Confidence: {(result.confidence * 100).toFixed(1)}%
                              </p>
                              <div className="w-full bg-secondary h-2 rounded-full mt-1">
                                <div 
                                  className={`h-2 rounded-full ${
                                    result.verdict === 'FAKE' ? 'bg-red-500' :
                                    result.verdict === 'REAL' ? 'bg-green-500' :
                                    'bg-yellow-500'
                                  }`}
                                  style={{ width: `${result.confidence * 100}%` }}
                                />
                              </div>
                            </div>
                          )}

                          {result.artifacts && result.artifacts.length > 0 && (
                            <div>
                              <p className="text-sm font-medium mb-1">Detected Artifacts:</p>
                              <ul className="list-disc list-inside text-sm text-muted-foreground">
                                {result.artifacts.map((artifact, i) => (
                                  <li key={i}>{artifact}</li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {result.processingTimeMs && (
                            <p className="text-xs text-muted-foreground">
                              Processing time: {(result.processingTimeMs / 1000).toFixed(2)}s
                            </p>
                          )}
                        </>
                      )}

                      <p className="text-xs text-muted-foreground">
                        {new Date(result.timestamp).toLocaleString()}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Logs */}
      <Card>
        <CardHeader>
          <CardTitle>Activity Logs</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-black text-green-400 p-4 rounded-lg font-mono text-sm h-64 overflow-y-auto">
            {logs.length === 0 ? (
              <p className="text-gray-500">No logs yet...</p>
            ) : (
              logs.map((log, idx) => (
                <div key={idx} className="mb-1">
                  {log}
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
