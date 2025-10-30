/**
 * Social Media URL Extractor Service
 * Handles extracting video URLs from various platforms
 */

interface VideoMetadata {
  title?: string;
  author?: string;
  duration?: number;
  thumbnail?: string;
  platform: string;
  originalUrl: string;
  directVideoUrl?: string;
}

interface ExtractionResult {
  success: boolean;
  videoUrl?: string;
  metadata?: VideoMetadata;
  error?: string;
  needsProxy?: boolean;
}

class SocialMediaExtractor {
  
  /**
   * Extract video information from social media URLs
   */
  async extractVideoUrl(url: string): Promise<ExtractionResult> {
    try {
      console.log(`🔍 Extracting video from: ${url}`);
      
      const platform = this.detectPlatform(url);
      
      switch (platform) {
        case 'twitter':
        case 'x':
          return await this.extractTwitterVideo(url);
        
        case 'instagram':
          return await this.extractInstagramVideo(url);
        
        case 'tiktok':
          return await this.extractTikTokVideo(url);
        
        case 'youtube':
          return await this.extractYouTubeVideo(url);
        
        case 'direct':
          return this.handleDirectVideo(url);
        
        default:
          return {
            success: false,
            error: `Unsupported platform: ${platform}. Supported: Twitter/X, Instagram, TikTok, YouTube, direct video URLs.`
          };
      }
    } catch (error) {
      console.error('❌ Video extraction failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown extraction error'
      };
    }
  }

  /**
   * Detect platform from URL
   */
  private detectPlatform(url: string): string {
    const urlLower = url.toLowerCase();
    
    if (urlLower.includes('twitter.com') || urlLower.includes('x.com')) {
      return 'twitter';
    }
    if (urlLower.includes('instagram.com')) {
      return 'instagram';
    }
    if (urlLower.includes('tiktok.com')) {
      return 'tiktok';
    }
    if (urlLower.includes('youtube.com') || urlLower.includes('youtu.be')) {
      return 'youtube';
    }
    if (urlLower.match(/\.(mp4|webm|mov|avi|mkv)(\?|$)/)) {
      return 'direct';
    }
    
    return 'unknown';
  }

  /**
   * Extract Twitter/X videos using yt-dlp approach
   */
  private async extractTwitterVideo(url: string): Promise<ExtractionResult> {
    try {
      // For now, return instructions to use our proxy service
      // In production, this would use a backend service with yt-dlp
      
      console.log('🐦 Detected Twitter/X video');
      
      // Extract tweet ID for metadata
      const tweetIdMatch = url.match(/status\/(\d+)/);
      const tweetId = tweetIdMatch ? tweetIdMatch[1] : null;
      
      return {
        success: false,
        needsProxy: true,
        metadata: {
          platform: 'Twitter/X',
          originalUrl: url,
        },
        error: 'Twitter/X videos require backend processing. Use our URL analysis service or download the video manually.'
      };
    } catch (error) {
      return {
        success: false,
        error: `Twitter extraction failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }

  /**
   * Extract Instagram videos
   */
  private async extractInstagramVideo(url: string): Promise<ExtractionResult> {
    try {
      console.log('📷 Detected Instagram video');
      
      // Extract post ID for metadata
      const postIdMatch = url.match(/\/p\/([^\/]+)/);
      const postId = postIdMatch ? postIdMatch[1] : null;
      
      return {
        success: false,
        needsProxy: true,
        metadata: {
          platform: 'Instagram',
          originalUrl: url,
        },
        error: 'Instagram videos require backend processing. Use our URL analysis service or download the video manually.'
      };
    } catch (error) {
      return {
        success: false,
        error: `Instagram extraction failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }

  /**
   * Extract TikTok videos
   */
  private async extractTikTokVideo(url: string): Promise<ExtractionResult> {
    try {
      console.log('🎵 Detected TikTok video');
      
      return {
        success: false,
        needsProxy: true,
        metadata: {
          platform: 'TikTok',
          originalUrl: url,
        },
        error: 'TikTok videos require backend processing. Use our URL analysis service or download the video manually.'
      };
    } catch (error) {
      return {
        success: false,
        error: `TikTok extraction failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }

  /**
   * Extract YouTube videos (for reference, but needs backend)
   */
  private async extractYouTubeVideo(url: string): Promise<ExtractionResult> {
    try {
      console.log('📺 Detected YouTube video');
      
      // Extract video ID
      const videoIdMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/);
      const videoId = videoIdMatch ? videoIdMatch[1] : null;
      
      return {
        success: false,
        needsProxy: true,
        metadata: {
          platform: 'YouTube',
          originalUrl: url,
        },
        error: 'YouTube videos require backend processing due to CORS restrictions. Use our URL analysis service.'
      };
    } catch (error) {
      return {
        success: false,
        error: `YouTube extraction failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }

  /**
   * Handle direct video URLs
   */
  private handleDirectVideo(url: string): ExtractionResult {
    console.log('🎬 Detected direct video URL');
    
    return {
      success: true,
      videoUrl: url,
      metadata: {
        platform: 'Direct Video',
        originalUrl: url,
        directVideoUrl: url,
      }
    };
  }

  /**
   * Get supported platforms list
   */
  getSupportedPlatforms(): string[] {
    return [
      'Twitter/X (x.com, twitter.com)',
      'Instagram (instagram.com)',
      'TikTok (tiktok.com)',
      'YouTube (youtube.com, youtu.be)',
      'Direct video URLs (.mp4, .webm, .mov, etc.)'
    ];
  }

  /**
   * Validate if URL looks like a valid video URL
   */
  isValidVideoUrl(url: string): boolean {
    try {
      new URL(url);
      const platform = this.detectPlatform(url);
      return platform !== 'unknown';
    } catch {
      return false;
    }
  }
}

// Export singleton instance
export const socialMediaExtractor = new SocialMediaExtractor();
export type { ExtractionResult, VideoMetadata };