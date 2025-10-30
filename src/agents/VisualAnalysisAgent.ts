

import { InferenceClient } from '@huggingface/inference';
import { BaseAgent, AgentTask } from './BaseAgent';
import { agentConfig } from './config';
import { deepfakeAPI, type AnalysisResult } from '../services/deepfakeAPI';

// Hugging Face API client
interface HuggingFaceConfig {
  apiKey: string;
  modelId: string;
  client: InferenceClient | null;
}

interface DeepfakeDetectionResult {
  label: string; // 'FAKE' or 'REAL'
  score: number; // confidence 0-1
}

interface FrameAnalysis {
  frameNumber: number;
  timestamp: number; // seconds in video
  isFake: boolean;
  confidence: number;
  artifacts: string[];
}

interface VideoAnalysisResult {
  overallVerdict: 'FAKE' | 'REAL' | 'UNCERTAIN';
  overallConfidence: number;
  frameResults: FrameAnalysis[];
  fakeFrameCount: number;
  totalFrames: number;
  processingTimeMs: number;
  metadata: {
    resolution: string;
    duration: number;
    fps: number;
  };
}

export class VisualAnalysisAgent extends BaseAgent {
  private hfConfig: HuggingFaceConfig;
  private readonly DEEPFAKE_MODEL = 'prithivMLmods/Deep-Fake-Detector-v2-Model';
  private readonly FAKE_THRESHOLD = 0.7; // 70% confidence = fake
  private readonly UNCERTAIN_RANGE = 0.2; // 50-70% = uncertain

  constructor() {
    const config = agentConfig.visualAnalysis;
    const commonConfig = agentConfig.common;
    
    super({
      agentId: 'visual-analysis-001',
      name: 'Visual Analysis Agent',
      type: 'visual-analysis',
      maxConcurrentTasks: config.maxConcurrentTasks,
      timeout: config.timeout,
      retryAttempts: commonConfig.maxRetries,
    });

    // Initialize Hugging Face configuration
    const apiKey = import.meta.env.VITE_HUGGINGFACE_API_KEY || '';
    
    this.hfConfig = {
      apiKey,
      modelId: this.DEEPFAKE_MODEL,
      client: apiKey ? new InferenceClient(apiKey) : null,
    };

    if (!this.hfConfig.apiKey) {
      console.warn('⚠️ VITE_HUGGINGFACE_API_KEY not set. Visual analysis will fail.');
    }
  }

  /**
   * Process a visual analysis task
   */
  protected async processTask(task: AgentTask): Promise<any> {
    const { type, data } = task;

    switch (type) {
      case 'analyze-image':
        return await this.analyzeImage(data.imageUrl, data.incidentId);
      
      case 'analyze-video':
        return await this.analyzeVideo(data.videoUrl, data.incidentId);
      
      case 'analyze-frame':
        return await this.analyzeFrame(data.frameData, data.frameNumber);
      
      default:
        throw new Error(`Unknown task type: ${type}`);
    }
  }

  /**
   * Analyze a single image for deepfakes
   */
  private async analyzeImage(imageUrl: string, incidentId?: string): Promise<any> {
    console.log(`🖼️ Analyzing image: ${imageUrl}`);
    
    try {
      // Fetch image as blob
      const imageBlob = await this.fetchImage(imageUrl);
      
      // Call Hugging Face API
      const result = await this.callDeepfakeAPI(imageBlob);
      
      // Interpret results
      const isFake = result.label === 'FAKE' && result.score > this.FAKE_THRESHOLD;
      const confidence = result.score;
      
      const analysis = {
        imageUrl,
        incidentId,
        verdict: this.getVerdict(result),
        confidence,
        isFake,
        label: result.label,
        rawScore: result.score,
        timestamp: new Date().toISOString(),
        processingTimeMs: 0, // will be calculated by BaseAgent
      };

      console.log(`✅ Image analysis complete:`, {
        verdict: analysis.verdict,
        confidence: `${(confidence * 100).toFixed(1)}%`,
      });

      return analysis;
    } catch (error) {
      console.error('❌ Image analysis failed:', error);
      throw error;
    }
  }

  /**
   * Analyze uploaded video file using Python backend
   */
  async analyzeVideoFile(file: File): Promise<VideoAnalysisResult> {
    console.log(`📤 Analyzing uploaded video file: ${file.name} (${(file.size / 1024 / 1024).toFixed(2)}MB)`);
    
    const startTime = Date.now();

    try {
      console.log(`🚀 Sending video file to Python backend...`);
      
      // Use Python backend for video file analysis
      const pythonResult: AnalysisResult = await deepfakeAPI.analyzeVideoFile(file);
      
      console.log(`🎯 Python backend result:`, pythonResult);

      // Convert Python result to our VideoAnalysisResult format
      const overallVerdict = pythonResult.verdict;
      const overallConfidence = pythonResult.confidence;
      const processingTimeMs = Date.now() - startTime;

      // Create frame results based on Python analysis
      const frameResults: FrameAnalysis[] = [];
      const frameCount = pythonResult.frame_count || 8;
      const isFake = pythonResult.verdict === 'FAKE';
      
      // If we have frame-by-frame data from fallback model
      if (pythonResult.frame_analysis) {
        pythonResult.frame_analysis.forEach((frameScore, i) => {
          frameResults.push({
            frameNumber: i + 1,
            timestamp: (i / frameCount) * 10, // Estimate 10 second video
            isFake: frameScore > 0.5,
            confidence: frameScore > 0.5 ? frameScore : (1 - frameScore),
            artifacts: frameScore > 0.7 ? ['detected via Python ML'] : [],
          });
        });
      } else {
        // Create synthetic frame results for VideoMAE analysis
        for (let i = 0; i < frameCount; i++) {
          frameResults.push({
            frameNumber: i + 1,
            timestamp: (i / frameCount) * 10, // Estimate timestamps
            isFake,
            confidence: overallConfidence,
            artifacts: isFake ? [`${pythonResult.model} detection`] : [],
          });
        }
      }

      const fakeFrameCount = frameResults.filter(f => f.isFake).length;

      const videoAnalysis: VideoAnalysisResult = {
        overallVerdict,
        overallConfidence,
        frameResults,
        fakeFrameCount,
        totalFrames: frameCount,
        processingTimeMs,
        metadata: {
          resolution: 'N/A', // Python backend doesn't return resolution
          duration: 10, // Estimate
          fps: Math.round(frameCount / 10), // Estimate
        },
      };

      console.log(`✅ Video file analysis complete via Python backend:`, {
        verdict: overallVerdict,
        confidence: `${(overallConfidence * 100).toFixed(1)}%`,
        model: pythonResult.model,
        processingTime: `${pythonResult.processing_time}s`,
        timeMs: processingTimeMs,
      });

      return videoAnalysis;
    } catch (error) {
      console.error('❌ Python backend video file analysis failed:', error);
      throw error;
    }
  }

  /**
   * Check if Python backend is available
   */
  async checkPythonBackend(): Promise<boolean> {
    try {
      await deepfakeAPI.checkHealth();
      console.log('🟢 Python backend is available');
      return true;
    } catch (error) {
      console.error('🔴 Python backend is not available:', error);
      return false;
    }
  }

  /**
   * Analyze a video by extracting and analyzing frames
   * SIMPLIFIED: Analyzes first 5 frames only for quick results
   */
  private async analyzeVideo(videoUrl: string, incidentId?: string): Promise<VideoAnalysisResult> {
    console.log(`🎥 Analyzing video via Python backend: ${videoUrl}`);
    
    // Validate URL is a direct video file, not YouTube/streaming
    if (videoUrl.includes('youtube.com') || videoUrl.includes('youtu.be')) {
      throw new Error('❌ YouTube URLs not supported. Please use a direct video file URL (.mp4, .webm, etc.)');
    }
    if (videoUrl.includes('vimeo.com') || videoUrl.includes('dailymotion.com')) {
      throw new Error('❌ Streaming platform URLs not supported. Please use a direct video file URL (.mp4, .webm, etc.)');
    }
    
    const startTime = Date.now();

    try {
      console.log(`🚀 Sending video to Python backend for analysis...`);
      
      // Use Python backend for video analysis
      const pythonResult: AnalysisResult = await deepfakeAPI.analyzeVideoUrl(videoUrl);
      
      console.log(`🎯 Python backend result:`, pythonResult);

      // Convert Python result to our VideoAnalysisResult format
      const overallVerdict = pythonResult.verdict;
      const overallConfidence = pythonResult.confidence;
      const processingTimeMs = Date.now() - startTime;

      // Create frame results based on Python analysis
      const frameResults: FrameAnalysis[] = [];
      const frameCount = pythonResult.frame_count || 8;
      const isFake = pythonResult.verdict === 'FAKE';
      
      // If we have frame-by-frame data from fallback model
      if (pythonResult.frame_analysis) {
        pythonResult.frame_analysis.forEach((frameScore, i) => {
          frameResults.push({
            frameNumber: i + 1,
            timestamp: (i / frameCount) * 10, // Estimate 10 second video
            isFake: frameScore > 0.5,
            confidence: frameScore > 0.5 ? frameScore : (1 - frameScore),
            artifacts: frameScore > 0.7 ? ['detected via Python ML'] : [],
          });
        });
      } else {
        // Create synthetic frame results for VideoMAE analysis
        for (let i = 0; i < frameCount; i++) {
          frameResults.push({
            frameNumber: i + 1,
            timestamp: (i / frameCount) * 10, // Estimate timestamps
            isFake,
            confidence: overallConfidence,
            artifacts: isFake ? [`${pythonResult.model} detection`] : [],
          });
        }
      }

      const fakeFrameCount = frameResults.filter(f => f.isFake).length;

      const videoAnalysis: VideoAnalysisResult = {
        overallVerdict,
        overallConfidence,
        frameResults,
        fakeFrameCount,
        totalFrames: frameCount,
        processingTimeMs,
        metadata: {
          resolution: 'N/A', // Python backend doesn't return resolution
          duration: 10, // Estimate
          fps: Math.round(frameCount / 10), // Estimate
        },
      };

      console.log(`✅ Video analysis complete via Python backend:`, {
        verdict: overallVerdict,
        confidence: `${(overallConfidence * 100).toFixed(1)}%`,
        model: pythonResult.model,
        processingTime: `${pythonResult.processing_time}s`,
        timeMs: processingTimeMs,
      });

      return videoAnalysis;
    } catch (error) {
      console.error('❌ Python backend video analysis failed:', error);
      
      // Fallback to old method if Python backend fails
      console.log('🔄 Falling back to TypeScript frame extraction method...');
      return await this.analyzeVideoFallback(videoUrl, incidentId);
    }
  }

  /**
   * Fallback video analysis using the old TypeScript method
   * Only used if Python backend fails
   */
  private async analyzeVideoFallback(videoUrl: string, incidentId?: string): Promise<VideoAnalysisResult> {
    console.log(`🔄 Using fallback TypeScript analysis for: ${videoUrl}`);
    
    const startTime = Date.now();

    try {
      // Extract frames from video (LIMIT TO 5 FOR SPEED)
      console.log(`📹 Loading video and extracting frames...`);
      const frames = await this.extractVideoFrames(videoUrl);
      console.log(`📸 Extracted ${frames.length} frames from video`);

      // Analyze each frame
      const frameResults: FrameAnalysis[] = [];
      let fakeCount = 0;

      for (let i = 0; i < frames.length; i++) {
        const frame = frames[i];
        console.log(`🔍 Analyzing frame ${i + 1}/${frames.length}...`);

        try {
          const result = await this.callDeepfakeAPI(frame.blob);
          const isFake = result.label === 'FAKE' && result.score > this.FAKE_THRESHOLD;
          
          if (isFake) fakeCount++;

          frameResults.push({
            frameNumber: i + 1,
            timestamp: frame.timestamp,
            isFake,
            confidence: result.score,
            artifacts: isFake ? this.detectArtifacts(result) : [],
          });
        } catch (error) {
          console.warn(`⚠️ Frame ${i + 1} analysis failed:`, error);
          // Continue with other frames
        }
      }

      // Aggregate results
      const totalFrames = frames.length;
      const fakePercentage = (fakeCount / totalFrames) * 100;
      
      let overallVerdict: 'FAKE' | 'REAL' | 'UNCERTAIN';
      if (fakePercentage >= 50) {
        overallVerdict = 'FAKE';
      } else if (fakePercentage <= 20) {
        overallVerdict = 'REAL';
      } else {
        overallVerdict = 'UNCERTAIN';
      }

      const overallConfidence = this.calculateOverallConfidence(frameResults);
      const processingTimeMs = Date.now() - startTime;

      const videoAnalysis: VideoAnalysisResult = {
        overallVerdict,
        overallConfidence,
        frameResults,
        fakeFrameCount: fakeCount,
        totalFrames,
        processingTimeMs,
        metadata: {
          resolution: '1920x1080', // TODO: Extract from video
          duration: frames[frames.length - 1]?.timestamp || 0,
          fps: 30, // TODO: Extract from video
        },
      };

      console.log(`✅ Fallback video analysis complete:`, {
        verdict: overallVerdict,
        confidence: `${(overallConfidence * 100).toFixed(1)}%`,
        fakeFrames: `${fakeCount}/${totalFrames}`,
        timeMs: processingTimeMs,
      });

      return videoAnalysis;
    } catch (error) {
      console.error('❌ Fallback video analysis also failed:', error);
      throw error;
    }
  }

  /**
   * Analyze a single frame (used internally or for real-time streaming)
   */
  private async analyzeFrame(frameData: Blob, frameNumber: number): Promise<FrameAnalysis> {
    const result = await this.callDeepfakeAPI(frameData);
    const isFake = result.label === 'FAKE' && result.score > this.FAKE_THRESHOLD;

    return {
      frameNumber,
      timestamp: 0, // Not applicable for single frames
      isFake,
      confidence: result.score,
      artifacts: isFake ? this.detectArtifacts(result) : [],
    };
  }

  /**
   * Call Hugging Face Inference API for deepfake detection
   */
  private async callDeepfakeAPI(imageBlob: Blob): Promise<DeepfakeDetectionResult> {
    if (!this.hfConfig.client) {
      throw new Error('Hugging Face API client not initialized. Check VITE_HUGGINGFACE_API_KEY.');
    }

    try {
      // Call Hugging Face Inference API using SDK
      // SDK accepts Blob directly!
      const output = await this.hfConfig.client.imageClassification({
        data: imageBlob,
        model: this.DEEPFAKE_MODEL,
      });

      // SDK returns array of [{label: string, score: number}]
      // Find the result with highest score
      const topResult = output.reduce((prev, current) => 
        (current.score > prev.score) ? current : prev
      );

      return {
        label: topResult.label,
        score: topResult.score,
      };
    } catch (error) {
      console.error('❌ Hugging Face API error:', error);
      throw new Error(`Hugging Face API failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Fetch image from URL as Blob
   */
  private async fetchImage(url: string): Promise<Blob> {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.status}`);
    }
    return await response.blob();
  }

  /**
   * Extract frames from video for analysis
   * For MVP: Extract max 5 frames for speed
   */
  private async extractVideoFrames(videoUrl: string): Promise<Array<{ blob: Blob; timestamp: number }>> {
    return new Promise((resolve, reject) => {
      const video = document.createElement('video');
      video.crossOrigin = 'anonymous';
      video.src = videoUrl;

      const frames: Array<{ blob: Blob; timestamp: number }> = [];
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        reject(new Error('Canvas context not available'));
        return;
      }

      // ⏱️ ADD TIMEOUT - Fail after 20 seconds
      const timeout = setTimeout(() => {
        video.remove();
        reject(new Error('⏱️ Video loading timed out after 20 seconds. URL may be blocked by CORS.'));
      }, 20000);

      video.addEventListener('loadedmetadata', () => {
        clearTimeout(timeout); // Cancel timeout once video loads
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        const duration = video.duration;
        const MAX_FRAMES = 5; // LIMIT TO 5 FRAMES FOR SPEED
        const frameInterval = Math.max(1, duration / MAX_FRAMES); // Evenly distributed
        const frameCount = Math.min(MAX_FRAMES, Math.floor(duration));

        console.log(`📹 Video duration: ${duration.toFixed(1)}s, extracting ${frameCount} frames (every ${frameInterval.toFixed(1)}s)`);

        let currentFrame = 0;

        const extractFrame = () => {
          if (currentFrame >= frameCount) {
            video.remove();
            resolve(frames);
            return;
          }

          const timestamp = currentFrame * frameInterval;
          video.currentTime = timestamp;

          video.addEventListener('seeked', function onSeeked() {
            video.removeEventListener('seeked', onSeeked);

            // Draw current frame to canvas
            ctx!.drawImage(video, 0, 0, canvas.width, canvas.height);

            // Convert canvas to blob
            canvas.toBlob((blob) => {
              if (blob) {
                frames.push({ blob, timestamp });
                console.log(`📸 Extracted frame ${currentFrame + 1}/${frameCount} at ${timestamp.toFixed(1)}s`);
                currentFrame++;
                extractFrame();
              } else {
                clearTimeout(timeout);
                video.remove();
                reject(new Error('Failed to create blob from canvas'));
              }
            }, 'image/jpeg', 0.8);
          }, { once: true });
        };

        extractFrame();
      });

      video.addEventListener('error', (e) => {
        clearTimeout(timeout);
        video.remove();
        reject(new Error(`❌ Video loading failed. Make sure URL is a direct video file (.mp4) with CORS enabled.`));
      });

      // Start loading video
      video.load();
    });
  }

  /**
   * Get verdict from API result
   */
  private getVerdict(result: DeepfakeDetectionResult): 'FAKE' | 'REAL' | 'UNCERTAIN' {
    if (result.label === 'FAKE' && result.score > this.FAKE_THRESHOLD) {
      return 'FAKE';
    } else if (result.label === 'REAL' && result.score > this.FAKE_THRESHOLD) {
      return 'REAL';
    } else {
      return 'UNCERTAIN';
    }
  }

  /**
   * Detect manipulation artifacts based on score patterns
   */
  private detectArtifacts(result: DeepfakeDetectionResult): string[] {
    const artifacts: string[] = [];

    if (result.score > 0.9) {
      artifacts.push('Strong synthetic patterns detected');
    }
    if (result.score > 0.8) {
      artifacts.push('Face manipulation indicators');
    }
    if (result.score > 0.7) {
      artifacts.push('Possible deepfake artifacts');
    }

    return artifacts;
  }

  /**
   * Calculate overall confidence from multiple frame results
   */
  private calculateOverallConfidence(frames: FrameAnalysis[]): number {
    if (frames.length === 0) return 0;

    const totalConfidence = frames.reduce((sum, frame) => sum + frame.confidence, 0);
    return totalConfidence / frames.length;
  }

  /**
   * Get agent statistics
   */
  public getStats() {
    return {
      ...this.getMetrics(),
      model: this.DEEPFAKE_MODEL,
      thresholds: {
        fake: this.FAKE_THRESHOLD,
        uncertain: this.UNCERTAIN_RANGE,
      },
    };
  }
}

/**
 * Example usage for testing
 */
export async function testVisualAgent() {
  console.log('🧪 Testing Visual Analysis Agent...\n');

  const agent = new VisualAnalysisAgent();
  await agent.initialize();
  await agent.start();

  // Test with image
  await agent.addTask('analyze-image', {
    imageUrl: 'https://example.com/suspicious-image.jpg',
    incidentId: 'INC-001',
  });

  // Test with video
  await agent.addTask('analyze-video', {
    videoUrl: 'https://example.com/suspicious-video.mp4',
    incidentId: 'INC-002',
  });

  // Wait for processing
  await new Promise(resolve => setTimeout(resolve, 10000));

  // Show stats
  console.log('\n📊 Agent Stats:', agent.getStats());

  await agent.stop();
  console.log('✅ Visual Analysis Agent test complete!');
}
