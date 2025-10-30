"""
Analysis API endpoints
"""
from fastapi import APIRouter, UploadFile, File, HTTPException, BackgroundTasks
from fastapi.responses import JSONResponse
from pydantic import BaseModel, HttpUrl
from loguru import logger
import tempfile
import os
from pathlib import Path
import httpx
from typing import Optional

from app.services.video_analyzer import get_video_analyzer
from app.config import get_settings

router = APIRouter()
settings = get_settings()


class VideoURLRequest(BaseModel):
    """Request model for video URL analysis"""
    url: HttpUrl


class AnalysisResponse(BaseModel):
    """Response model for analysis"""
    verdict: str
    confidence: float
    processing_time: float
    model: str
    frame_count: Optional[int] = None
    probabilities: Optional[dict] = None


async def cleanup_temp_file(file_path: str):
    """Delete temporary file after processing"""
    try:
        if os.path.exists(file_path):
            os.unlink(file_path)
            logger.debug(f"🗑️  Cleaned up temp file: {file_path}")
    except Exception as e:
        logger.warning(f"⚠️  Failed to cleanup temp file {file_path}: {e}")


@router.post("/analyze/video", response_model=AnalysisResponse)
async def analyze_video_file(
    background_tasks: BackgroundTasks,
    file: UploadFile = File(...)
):
    """
    Analyze uploaded video file for deepfakes
    
    Args:
        file: Video file (mp4, avi, mov, etc.)
    
    Returns:
        Analysis result with verdict and confidence
    """
    temp_file = None
    
    try:
        # Validate file type
        content_type = file.content_type or ""
        if not content_type.startswith("video/"):
            raise HTTPException(
                status_code=400,
                detail=f"Invalid file type: {content_type}. Expected video file."
            )
        
        # Check file size
        file.file.seek(0, 2)  # Seek to end
        file_size = file.file.tell()
        file.file.seek(0)  # Reset to beginning
        
        max_size = settings.max_video_size_mb * 1024 * 1024  # Convert to bytes
        if file_size > max_size:
            raise HTTPException(
                status_code=400,
                detail=f"File too large: {file_size / 1024 / 1024:.2f}MB. Max size: {settings.max_video_size_mb}MB"
            )
        
        logger.info(f"📤 Received video upload: {file.filename} ({file_size / 1024 / 1024:.2f}MB)")
        
        # Save to temporary file
        suffix = Path(file.filename).suffix or ".mp4"
        with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as tmp:
            content = await file.read()
            tmp.write(content)
            temp_file = tmp.name
        
        logger.debug(f"💾 Saved to temp file: {temp_file}")
        
        # Analyze video
        analyzer = get_video_analyzer()
        result = await analyzer.analyze_video(temp_file)
        
        # Schedule cleanup
        background_tasks.add_task(cleanup_temp_file, temp_file)
        
        return result
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"❌ Video analysis failed: {e}")
        if temp_file:
            await cleanup_temp_file(temp_file)
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")


@router.post("/analyze/video-url", response_model=AnalysisResponse)
async def analyze_video_url(
    background_tasks: BackgroundTasks,
    request: VideoURLRequest
):
    """
    Analyze video from URL (supports direct URLs and some social media)
    
    Args:
        request: VideoURLRequest with video URL
    
    Returns:
        Analysis result with verdict and confidence
    """
    temp_file = None
    
    try:
        url = str(request.url)
        logger.info(f"🔗 Processing video URL: {url}")
        
        # Validate and potentially extract direct video URL
        try:
            extracted_url = await extract_video_url(url)
            if extracted_url != url:
                logger.info(f"📱 Extracted direct URL: {extracted_url}")
                url = extracted_url
        except HTTPException as extraction_error:
            # Re-raise HTTP exceptions (these are user-facing errors)
            raise extraction_error
        
        # Download video
        async with httpx.AsyncClient(
            timeout=60.0,  # Increased timeout for social media
            follow_redirects=True,
            headers={
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            }
        ) as client:
            response = await client.get(url)
            response.raise_for_status()
            
            # Check content type
            content_type = response.headers.get("content-type", "")
            
            # If we get HTML, this is likely a social media page, not a direct video
            if content_type.startswith("text/html"):
                raise HTTPException(
                    status_code=400,
                    detail="URL points to a webpage (HTML), not a direct video file. Social media URLs need video extraction. Please use a direct video URL (.mp4, .webm, etc.) or upload the video file directly."
                )
            
            if not (content_type.startswith("video/") or content_type.startswith("application/")):
                # Some edge cases might still work
                logger.warning(f"⚠️ Unexpected content-type: {content_type}, trying anyway...")
            
            # Check size
            content_length = response.headers.get("content-length")
            if content_length:
                size_mb = int(content_length) / 1024 / 1024
                if size_mb > settings.max_video_size_mb:
                    raise HTTPException(
                        status_code=400,
                        detail=f"Video too large: {size_mb:.2f}MB. Max size: {settings.max_video_size_mb}MB"
                    )
            
            # Save to temp file
            suffix = Path(url).suffix or ".mp4"
            with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as tmp:
                tmp.write(response.content)
                temp_file = tmp.name
        
        logger.debug(f"💾 Downloaded to temp file: {temp_file}")
        
        # Analyze video
        analyzer = get_video_analyzer()
        result = await analyzer.analyze_video(temp_file)
        
        # Add original URL to result
        result["original_url"] = str(request.url)
        if extracted_url != str(request.url):
            result["extracted_url"] = extracted_url
        
        # Schedule cleanup
        background_tasks.add_task(cleanup_temp_file, temp_file)
        
        return result
        
    except httpx.HTTPError as e:
        logger.error(f"❌ Failed to download video: {e}")
        raise HTTPException(status_code=400, detail=f"Failed to download video: {str(e)}")
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"❌ Video analysis failed: {e}")
        if temp_file:
            await cleanup_temp_file(temp_file)
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")


async def extract_video_url(url: str) -> str:
    """
    Extract direct video URL from social media URLs
    Returns the original URL if extraction fails
    """
    try:
        url_lower = url.lower()
        
        # Check if this is a social media URL that needs extraction
        social_platforms = ['youtube.com', 'youtu.be', 'twitter.com', 'x.com', 'instagram.com', 'tiktok.com']
        
        if any(platform in url_lower for platform in social_platforms):
            logger.info(f"🔍 Social media URL detected: {url}")
            
            # For YouTube, we need special handling
            if 'youtube.com' in url_lower or 'youtu.be' in url_lower:
                raise HTTPException(
                    status_code=400,
                    detail="YouTube URLs require video extraction service. YouTube doesn't allow direct video downloads due to copyright protection. Please download the video manually and upload the file instead."
                )
            
            # For other social media platforms
            if any(platform in url_lower for platform in ['twitter.com', 'x.com', 'instagram.com', 'tiktok.com']):
                raise HTTPException(
                    status_code=400,
                    detail=f"Social media URL detected but video extraction service not yet implemented. Please download the video manually and upload the file instead, or use a direct video URL (.mp4, .webm, etc.)"
                )
            
        return url
        
    except HTTPException:
        raise
    except Exception as e:
        logger.warning(f"⚠️ URL extraction failed: {e}, using original URL")
        return url


@router.post("/analyze/social-media", response_model=AnalysisResponse)
async def analyze_social_media_url(
    background_tasks: BackgroundTasks,
    request: VideoURLRequest
):
    """
    Analyze video from social media URL with enhanced extraction
    
    Args:
        request: VideoURLRequest with social media URL
    
    Returns:
        Analysis result with verdict and confidence
    """
    try:
        url = str(request.url)
        logger.info(f"📱 Analyzing social media URL: {url}")
        
        # Detect platform
        platform = detect_platform(url)
        logger.info(f"🔍 Detected platform: {platform}")
        
        if platform == "unsupported":
            raise HTTPException(
                status_code=400,
                detail="Unsupported social media platform. Supported: Twitter/X, Instagram, TikTok, YouTube, direct video URLs"
            )
        
        # For now, delegate to the video-url endpoint
        # In production, this would have platform-specific extraction logic
        return await analyze_video_url(background_tasks, request)
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"❌ Social media analysis failed: {e}")
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")


def detect_platform(url: str) -> str:
    """Detect social media platform from URL"""
    url_lower = url.lower()
    
    if 'twitter.com' in url_lower or 'x.com' in url_lower:
        return 'twitter'
    elif 'instagram.com' in url_lower:
        return 'instagram'
    elif 'tiktok.com' in url_lower:
        return 'tiktok'
    elif 'youtube.com' in url_lower or 'youtu.be' in url_lower:
        return 'youtube'
    elif any(ext in url_lower for ext in ['.mp4', '.webm', '.mov', '.avi']):
        return 'direct'
    else:
        return 'unsupported'


@router.get("/models")
async def get_models():
    """Get information about loaded models"""
    return {
        "video_model": settings.video_model_name,
        "image_model": settings.image_model_name,
        "device": "cuda" if settings.use_gpu else "cpu",
        "max_video_size_mb": settings.max_video_size_mb,
        "supported_platforms": [
            "Twitter/X (x.com, twitter.com)",
            "Instagram (instagram.com)", 
            "TikTok (tiktok.com)",
            "YouTube (youtube.com, youtu.be)",
            "Direct video URLs (.mp4, .webm, .mov, etc.)"
        ]
    }
