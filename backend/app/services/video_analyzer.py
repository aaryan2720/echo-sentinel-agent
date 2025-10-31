"""
VideoMAE-based deepfake detection service
"""
import torch
from transformers import VideoMAEForVideoClassification, VideoMAEImageProcessor
from loguru import logger
import av
import numpy as np
from typing import Dict, Any, Optional
import time
from pathlib import Path
from PIL import Image

from app.config import get_settings


class VideoAnalyzer:
    """
    Video deepfake detector with fallback to image-based analysis
    Primary: VideoMAE, Fallback: Image classification on frames
    """
    
    def __init__(self):
        self.settings = get_settings()
        self.model_name = self.settings.video_model_name
        self.device = "cuda" if torch.cuda.is_available() and self.settings.use_gpu else "cpu"
        
        logger.info(f"🎬 Initializing VideoAnalyzer with {self.model_name}")
        logger.info(f"🔧 Device: {self.device}")
        
        self.model: Optional[VideoMAEForVideoClassification] = None
        self.processor: Optional[VideoMAEImageProcessor] = None
        self.use_fallback = False
        self._load_model()
    
    def _load_model(self):
        """Load VideoMAE model and processor with fallback"""
        try:
            logger.info(f"📥 Loading model: {self.model_name}")
            
            # Try to load the VideoMAE model
            try:
                # Try to load the processor with error handling
                try:
                    self.processor = VideoMAEImageProcessor.from_pretrained(self.model_name)
                    logger.info(f"🔍 Processor config - size: {self.processor.size}")
                except Exception as e:
                    logger.warning(f"⚠️ Failed to load specific processor: {e}")
                    logger.info("🔄 Falling back to Microsoft VideoMAE processor")
                    # Fallback to base VideoMAE processor
                    self.processor = VideoMAEImageProcessor.from_pretrained("MCG-NJU/videomae-base")
                    logger.info(f"🔍 Fallback processor size: {self.processor.size}")
                
                # Load model
                self.model = VideoMAEForVideoClassification.from_pretrained(self.model_name)
                self.model.to(self.device)
                self.model.eval()  # Set to evaluation mode
                
                logger.success(f"✅ VideoMAE model loaded successfully on {self.device}")
                self.use_fallback = False
                
            except Exception as video_error:
                logger.error(f"❌ VideoMAE model failed: {video_error}")
                logger.info("🔄 Switching to image-based fallback approach")
                self.use_fallback = True
                self._load_image_model()
            
        except Exception as e:
            logger.error(f"❌ Failed to load any model: {e}")
            raise
    
    def _load_image_model(self):
        """Load image-based deepfake detector as fallback"""
        from transformers import AutoImageProcessor, AutoModelForImageClassification
        
        try:
            # Use a reliable image-based deepfake detector
            fallback_model = "dima806/deepfake_vs_real_image_detection"
            
            logger.info(f"📥 Loading fallback image model: {fallback_model}")
            
            self.processor = AutoImageProcessor.from_pretrained(fallback_model)
            self.model = AutoModelForImageClassification.from_pretrained(fallback_model)
            self.model.to(self.device)
            self.model.eval()
            
            logger.success(f"✅ Fallback image model loaded successfully")
            
        except Exception as e:
            logger.error(f"❌ Fallback model also failed: {e}")
            raise
    
    def extract_frames(self, video_path: str, num_frames: int = 16) -> np.ndarray:
        """
        Extract frames from video using PyAV
        
        Args:
            video_path: Path to video file
            num_frames: Number of frames to extract (default: 16 for VideoMAE)
        
        Returns:
            numpy array of shape (num_frames, height, width, 3)
        """
        try:
            container = av.open(video_path)
            
            # Get video stream
            video_stream = container.streams.video[0]
            total_frames = video_stream.frames
            
            # Calculate frame indices to extract
            if total_frames < num_frames:
                indices = list(range(total_frames))
                # Pad if needed
                while len(indices) < num_frames:
                    indices.append(indices[-1])
            else:
                # Sample uniformly across video
                indices = np.linspace(0, total_frames - 1, num_frames, dtype=int)
            
            frames = []
            frame_idx = 0
            target_idx = 0
            
            for frame in container.decode(video=0):
                if target_idx >= len(indices):
                    break
                
                if frame_idx == indices[target_idx]:
                    # Convert frame to numpy array
                    img = frame.to_ndarray(format='rgb24')
                    frames.append(img)
                    target_idx += 1
                
                frame_idx += 1
            
            container.close()
            
            # Stack frames into array
            frames_array = np.stack(frames)
            
            logger.debug(f"📸 Extracted {len(frames)} frames from video (shape: {frames_array.shape})")
            
            return frames_array
            
        except Exception as e:
            logger.error(f"❌ Frame extraction failed: {e}")
            raise
    
    async def analyze_video(self, video_path: str) -> Dict[str, Any]:
        """
        Analyze video for deepfake detection
        Uses VideoMAE if available, falls back to image analysis
        """
        start_time = time.time()
        
        try:
            logger.info(f"🎬 Analyzing video: {video_path}")
            
            if self.use_fallback:
                return await self._analyze_video_with_images(video_path, start_time)
            else:
                return await self._analyze_video_with_videomae(video_path, start_time)
                
        except Exception as e:
            logger.error(f"❌ Video analysis failed: {e}")
            if not self.use_fallback:
                logger.info("🔄 Trying fallback image analysis")
                try:
                    self.use_fallback = True
                    self._load_image_model()
                    return await self._analyze_video_with_images(video_path, start_time)
                except Exception as fallback_error:
                    logger.error(f"❌ Fallback also failed: {fallback_error}")
            raise
    
    async def _analyze_video_with_videomae(self, video_path: str, start_time: float) -> Dict[str, Any]:
        """Analyze video using VideoMAE model"""
        # Extract correct number of frames for this model (32 frames as per config)
        frames = self.extract_frames(video_path, num_frames=32)
        frame_count = len(frames)
        
        # Convert numpy arrays to PIL Images
        pil_frames = [Image.fromarray(frame) for frame in frames]
        logger.debug(f"🖼️  Converted {len(pil_frames)} frames to PIL Images")
        
        # Preprocess for VideoMAE
        inputs = self.processor(pil_frames, return_tensors="pt")
        logger.debug(f"✅ VideoMAE preprocessing - shape: {inputs['pixel_values'].shape}")
        
        # Move to device
        inputs = {k: v.to(self.device) for k, v in inputs.items()}
        
        # Run inference
        with torch.no_grad():
            outputs = self.model(**inputs)
            logits = outputs.logits
        
        # Get predictions with better confidence handling
        probabilities = torch.nn.functional.softmax(logits, dim=-1)[0]
        fake_prob = probabilities[0].item()  # deepfake probability
        real_prob = probabilities[1].item()  # real probability
        
        # Use confidence thresholds to avoid false positives
        confidence_threshold = 0.75  # Higher threshold for more conservative predictions
        
        if fake_prob > confidence_threshold:
            verdict = "FAKE"
            confidence = fake_prob
        elif real_prob > confidence_threshold:
            verdict = "REAL" 
            confidence = real_prob
        else:
            # If neither class has high confidence, default to REAL (conservative approach)
            verdict = "REAL"
            confidence = real_prob
            logger.info(f"⚠️ Low confidence prediction - defaulting to REAL (fake: {fake_prob:.3f}, real: {real_prob:.3f})")
        
        processing_time = time.time() - start_time
        
        result = {
            "verdict": verdict,
            "confidence": round(confidence, 4),
            "processing_time": round(processing_time, 2),
            "model": f"{self.model_name} (VideoMAE)",
            "frame_count": frame_count,
            "probabilities": {
                "fake": round(fake_prob, 4),
                "real": round(real_prob, 4)
            },
            "analysis_notes": f"Using conservative 75% confidence threshold. Requires {confidence_threshold:.0%}+ confidence to classify as FAKE.",
            "threshold_used": confidence_threshold
        }
        
        logger.success(f"✅ VideoMAE analysis: {verdict} ({confidence:.2%}) in {processing_time:.2f}s")
        return result
    
    async def _analyze_video_with_images(self, video_path: str, start_time: float) -> Dict[str, Any]:
        """Analyze video using image-based model on individual frames"""
        # Extract more frames for image analysis
        frames = self.extract_frames(video_path, num_frames=8)  # Fewer frames for faster processing
        frame_count = len(frames)
        
        # Analyze each frame
        frame_results = []
        for i, frame in enumerate(frames):
            pil_frame = Image.fromarray(frame)
            
            # Process single frame
            inputs = self.processor(pil_frame, return_tensors="pt")
            inputs = {k: v.to(self.device) for k, v in inputs.items()}
            
            # Run inference on frame
            with torch.no_grad():
                outputs = self.model(**inputs)
                logits = outputs.logits
            
            probabilities = torch.nn.functional.softmax(logits, dim=-1)[0]
            fake_prob = probabilities[0].item()  # Assuming 0=fake, 1=real
            frame_results.append(fake_prob)
        
        # Aggregate results across frames
        avg_fake_prob = np.mean(frame_results)
        confidence = max(avg_fake_prob, 1 - avg_fake_prob)  # Confidence in the prediction
        verdict = "FAKE" if avg_fake_prob > 0.5 else "REAL"
        
        processing_time = time.time() - start_time
        
        result = {
            "verdict": verdict,
            "confidence": round(confidence, 4),
            "processing_time": round(processing_time, 2),
            "model": "Image-based fallback",
            "frame_count": frame_count,
            "probabilities": {
                "fake": round(avg_fake_prob, 4),
                "real": round(1 - avg_fake_prob, 4)
            },
            "frame_analysis": [round(prob, 4) for prob in frame_results]
        }
        
        logger.success(f"✅ Image analysis: {verdict} ({confidence:.2%}) in {processing_time:.2f}s")
        return result


# Singleton instance
_video_analyzer: Optional[VideoAnalyzer] = None


def get_video_analyzer() -> VideoAnalyzer:
    """Get or create VideoAnalyzer singleton"""
    global _video_analyzer
    if _video_analyzer is None:
        _video_analyzer = VideoAnalyzer()
    return _video_analyzer
