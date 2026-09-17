/**
 * Python Backend API Service for Deepfake Detection
 * Replaces the broken TypeScript VisualAnalysisAgent
 */

interface AnalysisResult {
  verdict: 'REAL' | 'FAKE';
  confidence: number;
  processing_time: number;
  model: string;
  frame_count: number;
  probabilities: {
    fake: number;
    real: number;
  };
  frame_analysis?: number[]; // For image-based fallback
}

interface ApiError {
  detail: string;
}

class DeepfakeAPIService {
  private baseUrl: string;

  constructor() {
    // Use environment variable or fallback to localhost
    this.baseUrl = import.meta.env.VITE_PYTHON_API_URL || 'http://127.0.0.1:8000';
  }

  /**
   * Analyze uploaded video file for deepfakes
   */
  async analyzeVideoFile(file: File): Promise<AnalysisResult> {
    try {
      console.log(`🎬 Uploading video to Python backend: ${file.name} (${(file.size / 1024 / 1024).toFixed(2)}MB)`);

      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch(`${this.baseUrl}/api/analyze/video`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData: ApiError = await response.json();
        throw new Error(`Analysis failed: ${errorData.detail || response.statusText}`);
      }

      const result: AnalysisResult = await response.json();
      
      console.log(`✅ Analysis complete: ${result.verdict} (${(result.confidence * 100).toFixed(1)}% confidence)`);
      
      return result;

    } catch (error) {
      console.error('❌ Video analysis failed:', error);
      throw error;
    }
  }

  /**
   * Analyze video from URL
   */
  async analyzeVideoUrl(url: string): Promise<AnalysisResult> {
    try {
      console.log(`🔗 Analyzing video from URL: ${url}`);

      const response = await fetch(`${this.baseUrl}/api/analyze/video-url`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
      });

      if (!response.ok) {
        const errorData: ApiError = await response.json();
        throw new Error(`Analysis failed: ${errorData.detail || response.statusText}`);
      }

      const result: AnalysisResult = await response.json();
      
      console.log(`✅ URL analysis complete: ${result.verdict} (${(result.confidence * 100).toFixed(1)}% confidence)`);
      
      return result;

    } catch (error) {
      console.error('❌ URL analysis failed:', error);
      throw error;
    }
  }

  /**
   * Check if Python backend is healthy
   */
  async checkHealth(): Promise<{ status: string; models: any; gpu_enabled: boolean }> {
    try {
      const response = await fetch(`${this.baseUrl}/health`);
      
      if (!response.ok) {
        throw new Error(`Health check failed: ${response.statusText}`);
      }

      const health = await response.json();
      console.log('🟢 Python backend is healthy:', health);
      
      return health;

    } catch (error) {
      console.error('🔴 Python backend health check failed:', error);
      throw error;
    }
  }

  /**
   * Get model information
   */
  async getModelInfo(): Promise<any> {
    try {
      const response = await fetch(`${this.baseUrl}/api/models`);
      
      if (!response.ok) {
        throw new Error(`Model info failed: ${response.statusText}`);
      }

      const models = await response.json();
      console.log('🤖 Model info:', models);
      
      return models;

    } catch (error) {
      console.error('❌ Failed to get model info:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const deepfakeAPI = new DeepfakeAPIService();
export type { AnalysisResult };