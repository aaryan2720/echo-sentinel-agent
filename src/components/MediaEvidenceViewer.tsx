import React, { useState, useRef, useEffect } from 'react';
import ReactCompareImage from 'react-compare-image';
import WaveSurfer from 'wavesurfer.js';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Slider } from '@/components/ui/slider';
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Volume2, 
  VolumeX,
  Download,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Activity,
  FileVideo,
  FileAudio,
  Image as ImageIcon,
} from 'lucide-react';

interface DetectionHighlight {
  timestamp: number;
  type: 'face-manipulation' | 'audio-anomaly' | 'artifact' | 'lip-sync-mismatch';
  confidence: number;
  description: string;
}

interface MediaEvidenceViewerProps {
  mediaUrl: string;
  mediaType: 'video' | 'audio' | 'image';
  detections?: DetectionHighlight[];
  originalImageUrl?: string;
  metadata?: {
    duration?: number;
    resolution?: string;
    format?: string;
    size?: string;
  };
}

export function MediaEvidenceViewer({ 
  mediaUrl, 
  mediaType, 
  detections = [],
  originalImageUrl,
  metadata 
}: MediaEvidenceViewerProps) {
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [showForensics, setShowForensics] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const waveformRef = useRef<HTMLDivElement>(null);
  const wavesurferRef = useRef<WaveSurfer | null>(null);

  // Initialize WaveSurfer for audio
  useEffect(() => {
    if (mediaType === 'audio' && waveformRef.current && !wavesurferRef.current) {
      wavesurferRef.current = WaveSurfer.create({
        container: waveformRef.current,
        waveColor: '#94a3b8',
        progressColor: '#3b82f6',
        cursorColor: '#ef4444',
        barWidth: 2,
        barRadius: 3,
        cursorWidth: 2,
        height: 100,
        barGap: 2,
      });

      wavesurferRef.current.load(mediaUrl);

      wavesurferRef.current.on('ready', () => {
        setDuration(wavesurferRef.current?.getDuration() || 0);
      });

      wavesurferRef.current.on('audioprocess', () => {
        setCurrentTime(wavesurferRef.current?.getCurrentTime() || 0);
      });

      return () => {
        wavesurferRef.current?.destroy();
        wavesurferRef.current = null;
      };
    }
  }, [mediaType, mediaUrl]);

  // Video time update
  useEffect(() => {
    if (videoRef.current) {
      const video = videoRef.current;
      const handleTimeUpdate = () => setCurrentTime(video.currentTime);
      const handleDurationChange = () => setDuration(video.duration);
      
      video.addEventListener('timeupdate', handleTimeUpdate);
      video.addEventListener('durationchange', handleDurationChange);
      
      return () => {
        video.removeEventListener('timeupdate', handleTimeUpdate);
        video.removeEventListener('durationchange', handleDurationChange);
      };
    }
  }, []);

  const handlePlayPause = () => {
    if (mediaType === 'audio' && wavesurferRef.current) {
      wavesurferRef.current.playPause();
      setPlaying(!playing);
    } else if (videoRef.current) {
      if (playing) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setPlaying(!playing);
    }
  };

  const handleSeek = (value: number[]) => {
    const seekTime = (value[0] / 100) * duration;
    if (mediaType === 'audio' && wavesurferRef.current) {
      wavesurferRef.current.seekTo(value[0] / 100);
    } else if (videoRef.current) {
      videoRef.current.currentTime = seekTime;
    }
  };

  const skipTime = (seconds: number) => {
    const newTime = Math.max(0, Math.min(currentTime + seconds, duration));
    if (mediaType === 'audio' && wavesurferRef.current) {
      wavesurferRef.current.seekTo(newTime / duration);
    } else if (videoRef.current) {
      videoRef.current.currentTime = newTime;
    }
  };

  const formatTime = (seconds: number) => {
    if (isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getDetectionIcon = (type: DetectionHighlight['type']) => {
    switch (type) {
      case 'face-manipulation': return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'audio-anomaly': return <Activity className="h-4 w-4 text-orange-500" />;
      case 'artifact': return <XCircle className="h-4 w-4 text-yellow-500" />;
      case 'lip-sync-mismatch': return <AlertTriangle className="h-4 w-4 text-red-500" />;
      default: return <CheckCircle className="h-4 w-4 text-green-500" />;
    }
  };

  const getDetectionColor = (type: DetectionHighlight['type']) => {
    switch (type) {
      case 'face-manipulation': return 'bg-red-500/20 border-red-500';
      case 'audio-anomaly': return 'bg-orange-500/20 border-orange-500';
      case 'artifact': return 'bg-yellow-500/20 border-yellow-500';
      case 'lip-sync-mismatch': return 'bg-red-500/20 border-red-500';
      default: return 'bg-green-500/20 border-green-500';
    }
  };

  const getCurrentDetections = () => {
    return detections.filter(d => 
      Math.abs(d.timestamp - currentTime) < 1
    );
  };

  const renderVideoPlayer = () => (
    <div className="relative aspect-video bg-black rounded-lg overflow-hidden group">
      <video
        ref={videoRef}
        src={mediaUrl}
        className="w-full h-full"
        crossOrigin="anonymous"
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onLoadedData={() => setIsLoading(false)}
        onError={(e) => {
          console.error('Video load error:', e);
          setIsLoading(false);
        }}
      />
      
      {/* Loading Indicator */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50">
          <div className="text-white text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-2"></div>
            <p className="text-sm">Loading video...</p>
          </div>
        </div>
      )}
      
      {/* Forensics Overlay */}
      {showForensics && getCurrentDetections().length > 0 && (
        <div className="absolute top-4 left-4 right-4 space-y-2 z-10">
          {getCurrentDetections().map((detection, idx) => (
            <div
              key={idx}
              className={`p-3 rounded-lg border-2 backdrop-blur-sm ${getDetectionColor(detection.type)}`}
            >
              <div className="flex items-center gap-2">
                {getDetectionIcon(detection.type)}
                <span className="text-sm font-semibold text-white">
                  {detection.description}
                </span>
                <Badge variant="secondary" className="ml-auto">
                  {(detection.confidence * 100).toFixed(0)}% confident
                </Badge>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Controls */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="space-y-2">
          {/* Progress Bar */}
          <div className="relative">
            <Slider
              value={[duration > 0 ? (currentTime / duration) * 100 : 0]}
              onValueChange={handleSeek}
              max={100}
              step={0.1}
              className="cursor-pointer"
            />
            {/* Detection Markers */}
            {detections.map((detection, idx) => (
              <div
                key={idx}
                className="absolute top-0 w-1 h-2 bg-red-500"
                style={{ left: `${(detection.timestamp / duration) * 100}%` }}
                title={detection.description}
              />
            ))}
          </div>

          {/* Controls */}
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="ghost"
              onClick={handlePlayPause}
              className="text-white hover:bg-white/20"
            >
              {playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            </Button>

            <Button
              size="sm"
              variant="ghost"
              onClick={() => skipTime(-5)}
              className="text-white hover:bg-white/20"
            >
              <SkipBack className="h-4 w-4" />
            </Button>

            <Button
              size="sm"
              variant="ghost"
              onClick={() => skipTime(5)}
              className="text-white hover:bg-white/20"
            >
              <SkipForward className="h-4 w-4" />
            </Button>

            <span className="text-white text-sm">
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>

            <div className="flex items-center gap-2 ml-auto">
              <select
                value={playbackRate}
                onChange={(e) => {
                  const rate = Number(e.target.value);
                  setPlaybackRate(rate);
                  if (videoRef.current) videoRef.current.playbackRate = rate;
                }}
                className="bg-white/10 text-white text-sm rounded px-2 py-1"
              >
                <option value={0.25}>0.25x</option>
                <option value={0.5}>0.5x</option>
                <option value={1}>1x</option>
                <option value={1.5}>1.5x</option>
                <option value={2}>2x</option>
              </select>

              <Button
                size="sm"
                variant="ghost"
                onClick={() => {
                  setMuted(!muted);
                  if (videoRef.current) videoRef.current.muted = !muted;
                }}
                className="text-white hover:bg-white/20"
              >
                {muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
              </Button>

              <Button
                size="sm"
                variant="ghost"
                onClick={() => setShowForensics(!showForensics)}
                className="text-white hover:bg-white/20"
              >
                <AlertTriangle className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderAudioPlayer = () => (
    <div className="space-y-4">
      <Card className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950">
        <CardContent className="p-6">
          {/* Waveform */}
          <div ref={waveformRef} className="mb-4" />

          {/* Controls */}
          <div className="flex items-center gap-4">
            <Button
              size="lg"
              onClick={handlePlayPause}
              className="rounded-full w-12 h-12"
            >
              {playing ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
            </Button>

            <div className="flex-1">
              <div className="text-sm text-muted-foreground mb-1">
                {formatTime(currentTime)} / {formatTime(duration)}
              </div>
              <Slider
                value={[duration > 0 ? (currentTime / duration) * 100 : 0]}
                onValueChange={handleSeek}
                max={100}
                step={0.1}
              />
            </div>

            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                setMuted(!muted);
                if (wavesurferRef.current) wavesurferRef.current.setMuted(!muted);
              }}
            >
              {muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Audio Anomalies */}
      {detections.filter(d => d.type === 'audio-anomaly').length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2">
              <Activity className="h-4 w-4" />
              Audio Anomalies Detected
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {detections.filter(d => d.type === 'audio-anomaly').map((detection, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-3 p-3 bg-orange-50 dark:bg-orange-950/20 rounded-lg border border-orange-200 dark:border-orange-800 cursor-pointer hover:bg-orange-100 dark:hover:bg-orange-950/30"
                  onClick={() => {
                    wavesurferRef.current?.seekTo(detection.timestamp / duration);
                  }}
                >
                  <AlertTriangle className="h-4 w-4 text-orange-500 mt-0.5" />
                  <div className="flex-1">
                    <div className="text-sm font-medium">{detection.description}</div>
                    <div className="text-xs text-muted-foreground">
                      At {formatTime(detection.timestamp)} • {(detection.confidence * 100).toFixed(0)}% confidence
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );

  const renderImageComparison = () => (
    <div className="space-y-4">
      {originalImageUrl ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2">
              <ImageIcon className="h-4 w-4" />
              Before/After Comparison
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg overflow-hidden">
              <ReactCompareImage
                leftImage={originalImageUrl}
                rightImage={mediaUrl}
                leftImageLabel="Original"
                rightImageLabel="Analyzed"
                sliderLineColor="#3b82f6"
              />
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
          <img 
            src={mediaUrl} 
            alt="Evidence" 
            className="w-full h-full object-contain"
          />
          
          {/* Detection Highlights */}
          {showForensics && detections.map((detection, idx) => (
            <div
              key={idx}
              className="absolute top-4 left-4 right-4"
            >
              <div className={`p-3 rounded-lg border-2 backdrop-blur-sm ${getDetectionColor(detection.type)}`}>
                <div className="flex items-center gap-2">
                  {getDetectionIcon(detection.type)}
                  <span className="text-sm font-semibold text-white">
                    {detection.description}
                  </span>
                  <Badge variant="secondary" className="ml-auto">
                    {(detection.confidence * 100).toFixed(0)}% confident
                  </Badge>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-4">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              {mediaType === 'video' && <FileVideo className="h-5 w-5" />}
              {mediaType === 'audio' && <FileAudio className="h-5 w-5" />}
              {mediaType === 'image' && <ImageIcon className="h-5 w-5" />}
              Media Evidence Analysis
            </CardTitle>
            <div className="flex items-center gap-2">
              <Badge variant="outline">
                {detections.length} {detections.length === 1 ? 'detection' : 'detections'}
              </Badge>
              <Button size="sm" variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Media Player */}
      <Tabs defaultValue="player" className="w-full">
        <TabsList>
          <TabsTrigger value="player">Player</TabsTrigger>
          <TabsTrigger value="detections">
            Detections ({detections.length})
          </TabsTrigger>
          <TabsTrigger value="metadata">Metadata</TabsTrigger>
        </TabsList>

        <TabsContent value="player" className="space-y-4">
          {mediaType === 'video' && renderVideoPlayer()}
          {mediaType === 'audio' && renderAudioPlayer()}
          {mediaType === 'image' && renderImageComparison()}
        </TabsContent>

        <TabsContent value="detections">
          <Card>
            <CardContent className="p-6">
              {detections.length > 0 ? (
                <div className="space-y-3">
                  {detections.map((detection, idx) => (
                    <div
                      key={idx}
                      className={`p-4 rounded-lg border-2 ${getDetectionColor(detection.type)} cursor-pointer hover:shadow-md transition-shadow`}
                      onClick={() => {
                        if (mediaType === 'video' && videoRef.current) {
                          videoRef.current.currentTime = detection.timestamp;
                        } else if (mediaType === 'audio') {
                          wavesurferRef.current?.seekTo(detection.timestamp / duration);
                        }
                      }}
                    >
                      <div className="flex items-start gap-3">
                        {getDetectionIcon(detection.type)}
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-semibold capitalize">
                              {detection.type.replace(/-/g, ' ')}
                            </span>
                            <Badge variant="secondary">
                              {(detection.confidence * 100).toFixed(0)}% confident
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">
                            {detection.description}
                          </p>
                          {mediaType !== 'image' && (
                            <div className="text-xs text-muted-foreground">
                              Timestamp: {formatTime(detection.timestamp)}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <CheckCircle className="h-12 w-12 mx-auto mb-2 text-green-500" />
                  <p>No anomalies detected in this media</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="metadata">
          <Card>
            <CardContent className="p-6">
              <dl className="grid grid-cols-2 gap-4">
                <div>
                  <dt className="text-sm text-muted-foreground">Type</dt>
                  <dd className="text-sm font-medium capitalize">{mediaType}</dd>
                </div>
                {metadata?.duration && (
                  <div>
                    <dt className="text-sm text-muted-foreground">Duration</dt>
                    <dd className="text-sm font-medium">{formatTime(metadata.duration)}</dd>
                  </div>
                )}
                {metadata?.resolution && (
                  <div>
                    <dt className="text-sm text-muted-foreground">Resolution</dt>
                    <dd className="text-sm font-medium">{metadata.resolution}</dd>
                  </div>
                )}
                {metadata?.format && (
                  <div>
                    <dt className="text-sm text-muted-foreground">Format</dt>
                    <dd className="text-sm font-medium">{metadata.format}</dd>
                  </div>
                )}
                {metadata?.size && (
                  <div>
                    <dt className="text-sm text-muted-foreground">Size</dt>
                    <dd className="text-sm font-medium">{metadata.size}</dd>
                  </div>
                )}
                <div>
                  <dt className="text-sm text-muted-foreground">Detections</dt>
                  <dd className="text-sm font-medium">{detections.length} anomalies</dd>
                </div>
                <div>
                  <dt className="text-sm text-muted-foreground">Status</dt>
                  <dd className="text-sm font-medium">
                    {detections.length > 0 ? (
                      <Badge variant="destructive">Suspicious</Badge>
                    ) : (
                      <Badge variant="secondary">Clean</Badge>
                    )}
                  </dd>
                </div>
              </dl>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
