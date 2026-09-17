/**
 * URL Analysis Service
 * Coordinates between social media extraction and deepfake analysis
 */

import { socialMediaExtractor, type ExtractionResult } from './socialMediaExtractor';
import { deepfakeAPI, type AnalysisResult } from './deepfakeAPI';

interface URLAnalysisResult {
  url: string;
  platform: string;
  extractionSuccess: boolean;
  analysisSuccess: boolean;
  
  // Extraction results
  videoUrl?: string;
  metadata?: any;
  extractionError?: string;
  
  // Analysis results
  verdict?: 'REAL' | 'FAKE';
  confidence?: number;
  processingTime?: number;
  model?: string;
  analysisError?: string;
  
  // Overall
  timestamp: string;
  totalProcessingTime: number;
}

interface BatchAnalysisProgress {
  total: number;
  completed: number;
  failed: number;
  inProgress: boolean;
  results: URLAnalysisResult[];
  startTime: number;
}

class URLAnalysisService {
  
  /**
   * Analyze a single social media URL
   */
  async analyzeURL(url: string): Promise<URLAnalysisResult> {
    const startTime = Date.now();
    console.log(`🔗 Starting URL analysis: ${url}`);
    
    const result: URLAnalysisResult = {
      url,
      platform: 'Unknown',
      extractionSuccess: false,
      analysisSuccess: false,
      timestamp: new Date().toISOString(),
      totalProcessingTime: 0,
    };

    try {
      // Step 1: Extract video from social media URL
      console.log('📥 Step 1: Extracting video from URL...');
      const extraction: ExtractionResult = await socialMediaExtractor.extractVideoUrl(url);
      
      result.platform = extraction.metadata?.platform || 'Unknown';
      result.extractionSuccess = extraction.success;
      result.metadata = extraction.metadata;
      
      if (!extraction.success) {
        result.extractionError = extraction.error;
        
        // If it needs proxy/backend processing, try direct Python backend
        if (extraction.needsProxy) {
          console.log('🔄 Attempting direct URL analysis via Python backend...');
          return await this.analyzeURLViaPythonBackend(url, result, startTime);
        }
        
        result.totalProcessingTime = Date.now() - startTime;
        return result;
      }

      result.videoUrl = extraction.videoUrl;
      
      // Step 2: Analyze extracted video for deepfakes
      console.log('🤖 Step 2: Analyzing video for deepfakes...');
      const analysis: AnalysisResult = await deepfakeAPI.analyzeVideoUrl(extraction.videoUrl!);
      
      result.analysisSuccess = true;
      result.verdict = analysis.verdict;
      result.confidence = analysis.confidence;
      result.processingTime = analysis.processing_time;
      result.model = analysis.model;
      
      result.totalProcessingTime = Date.now() - startTime;
      
      console.log(`✅ URL analysis complete: ${result.verdict} (${(result.confidence! * 100).toFixed(1)}% confidence)`);
      
      return result;

    } catch (error) {
      console.error('❌ URL analysis failed:', error);
      
      result.analysisError = error instanceof Error ? error.message : 'Unknown analysis error';
      result.totalProcessingTime = Date.now() - startTime;
      
      return result;
    }
  }

  /**
   * Try to analyze URL directly via Python backend (for social media URLs)
   */
  private async analyzeURLViaPythonBackend(url: string, result: URLAnalysisResult, startTime: number): Promise<URLAnalysisResult> {
    try {
      console.log('🐍 Attempting Python backend direct URL analysis...');
      
      // Try to use Python backend's video-url endpoint directly
      const analysis: AnalysisResult = await deepfakeAPI.analyzeVideoUrl(url);
      
      result.analysisSuccess = true;
      result.verdict = analysis.verdict;
      result.confidence = analysis.confidence;
      result.processingTime = analysis.processing_time;
      result.model = analysis.model;
      result.videoUrl = url; // The Python backend handled extraction
      
      console.log(`✅ Python backend analysis successful: ${result.verdict} (${(result.confidence! * 100).toFixed(1)}% confidence)`);
      
    } catch (pythonError) {
      console.error('❌ Python backend also failed:', pythonError);
      result.analysisError = `Extraction failed: ${result.extractionError}. Direct analysis also failed: ${pythonError instanceof Error ? pythonError.message : 'Unknown error'}`;
    }
    
    result.totalProcessingTime = Date.now() - startTime;
    return result;
  }

  /**
   * Analyze multiple URLs in batch
   */
  async analyzeBatchURLs(
    urls: string[], 
    onProgress?: (progress: BatchAnalysisProgress) => void
  ): Promise<URLAnalysisResult[]> {
    const startTime = Date.now();
    const progress: BatchAnalysisProgress = {
      total: urls.length,
      completed: 0,
      failed: 0,
      inProgress: true,
      results: [],
      startTime,
    };

    console.log(`🔗 Starting batch analysis of ${urls.length} URLs...`);
    onProgress?.(progress);

    const results: URLAnalysisResult[] = [];

    // Process URLs one by one (to avoid overwhelming services)
    for (let i = 0; i < urls.length; i++) {
      const url = urls[i];
      
      try {
        console.log(`📊 Processing ${i + 1}/${urls.length}: ${url}`);
        
        const result = await this.analyzeURL(url);
        results.push(result);
        
        if (result.analysisSuccess) {
          progress.completed++;
        } else {
          progress.failed++;
        }
        
      } catch (error) {
        console.error(`❌ Failed to process URL ${i + 1}:`, error);
        
        results.push({
          url,
          platform: 'Unknown',
          extractionSuccess: false,
          analysisSuccess: false,
          analysisError: error instanceof Error ? error.message : 'Unknown error',
          timestamp: new Date().toISOString(),
          totalProcessingTime: 0,
        });
        
        progress.failed++;
      }
      
      progress.results = [...results];
      onProgress?.(progress);
      
      // Small delay to avoid rate limiting
      if (i < urls.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    progress.inProgress = false;
    onProgress?.(progress);

    const totalTime = Date.now() - startTime;
    console.log(`✅ Batch analysis complete: ${progress.completed} successful, ${progress.failed} failed in ${(totalTime / 1000).toFixed(1)}s`);

    return results;
  }

  /**
   * Validate URLs before processing
   */
  validateURLs(urls: string[]): { valid: string[]; invalid: string[] } {
    const valid: string[] = [];
    const invalid: string[] = [];

    urls.forEach(url => {
      if (socialMediaExtractor.isValidVideoUrl(url.trim())) {
        valid.push(url.trim());
      } else {
        invalid.push(url.trim());
      }
    });

    return { valid, invalid };
  }

  /**
   * Get analysis statistics
   */
  getAnalysisStats(results: URLAnalysisResult[]) {
    const stats = {
      total: results.length,
      successful: results.filter(r => r.analysisSuccess).length,
      failed: results.filter(r => !r.analysisSuccess).length,
      fake: results.filter(r => r.verdict === 'FAKE').length,
      real: results.filter(r => r.verdict === 'REAL').length,
      platforms: {} as Record<string, number>,
      avgProcessingTime: 0,
    };

    // Platform breakdown
    results.forEach(result => {
      const platform = result.platform || 'Unknown';
      stats.platforms[platform] = (stats.platforms[platform] || 0) + 1;
    });

    // Average processing time
    const validTimes = results.filter(r => r.totalProcessingTime > 0);
    if (validTimes.length > 0) {
      stats.avgProcessingTime = validTimes.reduce((sum, r) => sum + r.totalProcessingTime, 0) / validTimes.length;
    }

    return stats;
  }
}

// Export singleton instance
export const urlAnalysisService = new URLAnalysisService();
export type { URLAnalysisResult, BatchAnalysisProgress };