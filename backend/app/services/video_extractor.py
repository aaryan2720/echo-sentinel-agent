"""
Video Extraction Service
Extracts video files from social media URLs using yt-dlp
"""

import os
import tempfile
import yt_dlp
from typing import Optional, Dict, Any
from pathlib import Path
import logging

logger = logging.getLogger(__name__)

class VideoExtractor:
    """Service for extracting videos from social media URLs"""
    
    def __init__(self):
        # Configure yt-dlp options for optimal video extraction
        self.ydl_opts = {
            'format': 'best[ext=mp4][height<=720]/best[height<=720]/best',  # Prefer mp4, max 720p for processing speed
            'quiet': True,  # Reduce verbose output
            'no_warnings': True,
            'extractaudio': False,
            'writesubtitles': False,
            'writeautomaticsub': False,
            'ignoreerrors': True,  # Continue on download errors
        }
    
    def extract_video_info(self, url: str) -> Optional[Dict[str, Any]]:
        """
        Extract video information without downloading
        Returns metadata about the video
        """
        try:
            with yt_dlp.YoutubeDL({'quiet': True, 'no_warnings': True}) as ydl:
                info = ydl.extract_info(url, download=False)
                
                if info:
                    return {
                        'title': info.get('title', 'Unknown'),
                        'duration': info.get('duration', 0),
                        'uploader': info.get('uploader', 'Unknown'),
                        'platform': info.get('extractor_key', 'Unknown'),
                        'url': url,
                        'thumbnail': info.get('thumbnail'),
                        'description': info.get('description', '')[:200] + '...' if info.get('description', '') else '',
                        'view_count': info.get('view_count', 0),
                        'upload_date': info.get('upload_date'),
                    }
                    
        except Exception as e:
            logger.error(f"Failed to extract video info for {url}: {str(e)}")
            return None
    
    def download_video(self, url: str, output_dir: Optional[str] = None) -> Optional[str]:
        """
        Download video from social media URL
        Returns the path to the downloaded video file
        """
        try:
            # Create temporary directory if none provided
            if output_dir is None:
                output_dir = tempfile.mkdtemp(prefix='video_extract_')
            
            # Configure output template
            output_template = os.path.join(output_dir, '%(title).50s.%(ext)s')
            
            # Update yt-dlp options with output path
            opts = self.ydl_opts.copy()
            opts['outtmpl'] = output_template
            
            with yt_dlp.YoutubeDL(opts) as ydl:
                # Use simpler approach - let yt-dlp handle the filename
                try:
                    # Download the video directly
                    ydl.download([url])
                    
                    # Find the downloaded file in the output directory
                    downloaded_files = []
                    for file in os.listdir(output_dir):
                        if file.endswith(('.mp4', '.webm', '.mkv', '.mov', '.avi')):
                            filepath = os.path.join(output_dir, file)
                            if os.path.getsize(filepath) > 0:
                                downloaded_files.append(filepath)
                    
                    if downloaded_files:
                        # Return the first (and likely only) video file
                        filepath = downloaded_files[0]
                        logger.info(f"Successfully downloaded video: {os.path.basename(filepath)}")
                        return filepath
                    else:
                        logger.error(f"No video files found after download in {output_dir}")
                        return None
                        
                except Exception as download_error:
                    logger.error(f"Download failed: {str(download_error)}")
                    return None
                    
        except Exception as e:
            logger.error(f"Failed to download video from {url}: {str(e)}")
            return None
    
    def extract_and_analyze_ready(self, url: str) -> tuple[Optional[str], Optional[Dict[str, Any]]]:
        """
        Extract video and prepare for analysis
        Returns (video_file_path, video_info)
        """
        try:
            # First get video info
            info = self.extract_video_info(url)
            if not info:
                logger.error(f"Could not extract video info for {url}")
                return None, None
            
            # Validate info structure
            if not isinstance(info, dict):
                logger.error(f"Invalid info structure for {url}: {type(info)}")
                return None, None
            
            # Check if video is reasonable for analysis
            duration = info.get('duration', 0)
            if duration and duration > 300:  # 5 minutes max for processing efficiency
                logger.warning(f"Video too long ({duration}s) for analysis: {url}")
                return None, info
            
            # Download the video
            video_path = self.download_video(url)
            if not video_path:
                logger.error(f"Failed to download video from {url}")
                return None, info
            
            logger.info(f"Successfully extracted video: {info.get('title', 'Unknown')} ({duration}s)")
            return video_path, info
            
        except Exception as e:
            logger.error(f"Failed to extract and prepare video {url}: {str(e)}")
            import traceback
            traceback.print_exc()
            return None, None
    
    def cleanup_video(self, video_path: str) -> None:
        """Clean up downloaded video file"""
        try:
            if video_path and os.path.exists(video_path):
                os.remove(video_path)
                
                # Also try to remove the parent directory if it's a temp dir
                parent_dir = os.path.dirname(video_path)
                if parent_dir and 'video_extract_' in parent_dir:
                    try:
                        os.rmdir(parent_dir)
                    except OSError:
                        pass  # Directory not empty or other issue
                        
        except Exception as e:
            logger.warning(f"Failed to cleanup video file {video_path}: {str(e)}")
    
    @staticmethod
    def get_supported_platforms() -> list[str]:
        """Get list of platforms supported by yt-dlp"""
        return [
            'YouTube', 'Instagram', 'Twitter/X', 'TikTok', 
            'Facebook', 'Reddit', 'Twitch', 'LinkedIn',
            'Vimeo', 'Dailymotion', 'Rumble'
        ]
    
    @staticmethod
    def is_social_media_url(url: str) -> bool:
        """Check if URL is from a supported social media platform"""
        social_domains = [
            'youtube.com', 'youtu.be', 'instagram.com',
            'twitter.com', 'x.com', 'tiktok.com',
            'facebook.com', 'fb.watch', 'reddit.com',
            'twitch.tv', 'linkedin.com', 'vimeo.com'
        ]
        
        url_lower = url.lower()
        return any(domain in url_lower for domain in social_domains)


# Global instance
video_extractor = VideoExtractor()