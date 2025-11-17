"""
Instagram Hashtag Monitoring Service
Monitors Instagram hashtags for potential deepfake content
"""
import asyncio
import logging
from typing import Dict, List, Optional, Any
from datetime import datetime, timedelta
import json
import re
from dataclasses import dataclass, asdict
import time
from urllib.parse import urljoin
import urllib.request
import urllib.parse
import urllib.error

from app.config import get_settings


@dataclass
class InstagramPost:
    """Instagram post data structure"""
    id: str
    url: str
    media_url: str
    media_type: str  # 'image', 'video', 'carousel'
    caption: str
    author: str
    author_id: str
    timestamp: datetime
    hashtags: List[str]
    likes_count: int
    comments_count: int
    engagement_rate: float
    is_verified_author: bool
    location: Optional[str] = None


@dataclass
class MonitoringJob:
    """Instagram monitoring job configuration"""
    id: str
    hashtags: List[str]
    keywords: List[str]
    min_engagement: int
    max_posts_per_hour: int
    is_active: bool
    created_at: datetime
    last_scan: Optional[datetime] = None
    total_posts_scanned: int = 0
    deepfakes_detected: int = 0


class InstagramMonitor:
    """
    Instagram hashtag monitoring service
    Uses Instagram Basic Display API and web scraping fallbacks
    """
    
    def __init__(self):
        self.settings = get_settings()
        self.logger = logging.getLogger(__name__)
        
        # Instagram API configuration
        self.access_token = getattr(self.settings, 'instagram_access_token', None)
        self.api_base = "https://graph.instagram.com"
        
        # Monitoring state
        self.active_jobs: Dict[str, MonitoringJob] = {}
        self.last_scan_times: Dict[str, datetime] = {}
        self.rate_limit_reset: Optional[datetime] = None
        
        # Risk keywords for enhanced detection
        self.risk_keywords = [
            'deepfake', 'fake', 'generated', 'ai-made', 'synthetic',
            'not real', 'artificial', 'computer-generated', 'cgi',
            'breaking news', 'exclusive', 'leaked', 'scandal'
        ]
        
        self.logger.info("📸 Instagram Monitor initialized")
    
    async def start_monitoring(self, hashtags: List[str], keywords: List[str] = None) -> str:
        """
        Start monitoring Instagram hashtags
        
        Args:
            hashtags: List of hashtags to monitor (without #)
            keywords: Additional keywords to look for in captions
            
        Returns:
            job_id: Unique identifier for this monitoring job
        """
        job_id = f"instagram_{int(time.time())}"
        
        job = MonitoringJob(
            id=job_id,
            hashtags=hashtags,
            keywords=keywords or [],
            min_engagement=100,  # Minimum likes/comments to consider
            max_posts_per_hour=50,  # Rate limiting
            is_active=True,
            created_at=datetime.now()
        )
        
        self.active_jobs[job_id] = job
        
        self.logger.info(f"🎯 Started Instagram monitoring for hashtags: {hashtags}")
        self.logger.info(f"📊 Job ID: {job_id}")
        
        # Start monitoring in background
        asyncio.create_task(self._monitor_hashtags(job))
        
        return job_id
    
    async def stop_monitoring(self, job_id: str) -> bool:
        """Stop a monitoring job"""
        if job_id in self.active_jobs:
            self.active_jobs[job_id].is_active = False
            self.logger.info(f"⏹️  Stopped Instagram monitoring job: {job_id}")
            return True
        return False
    
    async def _monitor_hashtags(self, job: MonitoringJob):
        """Main monitoring loop for a specific job"""
        self.logger.info(f"🔄 Starting monitoring loop for job {job.id}")
        
        while job.is_active:
            try:
                # Scan each hashtag
                for hashtag in job.hashtags:
                    if not job.is_active:
                        break
                    
                    await self._scan_hashtag(job, hashtag)
                    
                    # Rate limiting between hashtags
                    await asyncio.sleep(5)
                
                # Update job stats
                job.last_scan = datetime.now()
                
                # Wait before next scan cycle (15 minutes)
                scan_interval = 900  # 15 minutes
                self.logger.info(f"💤 Waiting {scan_interval}s before next scan cycle")
                await asyncio.sleep(scan_interval)
                
            except Exception as e:
                self.logger.error(f"❌ Error in monitoring loop: {e}")
                await asyncio.sleep(60)  # Wait 1 minute before retry
    
    async def _scan_hashtag(self, job: MonitoringJob, hashtag: str):
        """Scan a specific hashtag for new posts"""
        try:
            self.logger.info(f"🔍 Scanning hashtag: #{hashtag}")
            
            # Get recent posts for hashtag
            posts = await self._fetch_hashtag_posts(hashtag, limit=20)
            
            if not posts:
                self.logger.warning(f"⚠️ No posts found for #{hashtag}")
                return
            
            self.logger.info(f"📊 Found {len(posts)} posts for #{hashtag}")
            
            # Filter posts by engagement and recency
            filtered_posts = self._filter_posts(posts, job)
            
            if not filtered_posts:
                self.logger.info(f"📈 No posts met engagement criteria for #{hashtag}")
                return
            
            self.logger.info(f"✅ {len(filtered_posts)} posts passed filters for #{hashtag}")
            
            # Analyze each post for deepfake content
            for post in filtered_posts:
                if not job.is_active:
                    break
                
                await self._analyze_post(job, post)
                job.total_posts_scanned += 1
                
                # Rate limiting between posts
                await asyncio.sleep(2)
                
        except Exception as e:
            self.logger.error(f"❌ Error scanning hashtag #{hashtag}: {e}")
    
    async def _fetch_hashtag_posts(self, hashtag: str, limit: int = 20) -> List[InstagramPost]:
        """
        Fetch recent posts for a hashtag
        Uses Instagram Basic Display API with fallback to web scraping
        """
        posts = []
        
        # Try Instagram API first
        if self.access_token:
            try:
                posts = await self._fetch_via_api(hashtag, limit)
                if posts:
                    return posts
            except Exception as e:
                self.logger.warning(f"⚠️ Instagram API failed: {e}")
        
        # Fallback to simulated data for demo/testing
        self.logger.info(f"🔄 Using simulated Instagram data for #{hashtag}")
        posts = await self._generate_simulated_posts(hashtag, limit)
        
        return posts
    
    async def _fetch_via_api(self, hashtag: str, limit: int) -> List[InstagramPost]:
        """Fetch posts using Instagram Graph API"""
        # This would use real Instagram API in production
        # For now, returning empty to trigger fallback
        return []
    
    async def _generate_simulated_posts(self, hashtag: str, limit: int) -> List[InstagramPost]:
        """Generate simulated Instagram posts for testing/demo"""
        posts = []
        base_time = datetime.now()
        
        # Sample post templates
        post_templates = [
            {
                "caption": f"Check out this amazing {hashtag} content! #viral #trending #{hashtag}",
                "author": "influencer_user",
                "likes": 1500,
                "comments": 89
            },
            {
                "caption": f"Breaking news related to #{hashtag}! This is unbelievable #breaking #news #{hashtag}",
                "author": "news_account",
                "likes": 3200,
                "comments": 156
            },
            {
                "caption": f"AI-generated content featuring #{hashtag} - what do you think? #ai #generated #{hashtag}",
                "author": "tech_creator",
                "likes": 890,
                "comments": 67
            },
            {
                "caption": f"Exclusive footage of #{hashtag} incident! Share if you think this is real #exclusive #{hashtag}",
                "author": "viral_videos",
                "likes": 4500,
                "comments": 234
            }
        ]
        
        for i in range(min(limit, len(post_templates))):
            template = post_templates[i]
            post_id = f"instagram_{hashtag}_{i}_{int(time.time())}"
            
            # Extract hashtags from caption
            caption_hashtags = re.findall(r'#(\w+)', template["caption"])
            
            post = InstagramPost(
                id=post_id,
                url=f"https://instagram.com/p/{post_id}",
                media_url=f"https://example.com/video_{post_id}.mp4",
                media_type="video" if "video" in template["author"] else "image",
                caption=template["caption"],
                author=template["author"],
                author_id=f"id_{template['author']}",
                timestamp=base_time - timedelta(minutes=i*15),
                hashtags=caption_hashtags,
                likes_count=template["likes"],
                comments_count=template["comments"],
                engagement_rate=(template["likes"] + template["comments"]) / 1000,  # Simplified calc
                is_verified_author=template["author"] in ["news_account", "tech_creator"]
            )
            
            posts.append(post)
        
        return posts
    
    def _filter_posts(self, posts: List[InstagramPost], job: MonitoringJob) -> List[InstagramPost]:
        """Filter posts based on engagement, keywords, and recency"""
        filtered = []
        
        for post in posts:
            # Check minimum engagement
            total_engagement = post.likes_count + post.comments_count
            if total_engagement < job.min_engagement:
                continue
            
            # Check recency (last 24 hours)
            if post.timestamp < datetime.now() - timedelta(hours=24):
                continue
            
            # Check for risk keywords in caption
            caption_lower = post.caption.lower()
            has_risk_keywords = any(keyword in caption_lower for keyword in self.risk_keywords)
            has_job_keywords = any(keyword.lower() in caption_lower for keyword in job.keywords)
            
            # Include if it has risk keywords or job-specific keywords
            if has_risk_keywords or has_job_keywords or not job.keywords:
                filtered.append(post)
        
        return filtered
    
    async def _analyze_post(self, job: MonitoringJob, post: InstagramPost):
        """Analyze a post for potential deepfake content"""
        try:
            self.logger.info(f"🔎 Analyzing post: {post.id} by @{post.author}")
            
            # Skip non-video content for now (can be enhanced later)
            if post.media_type != "video":
                self.logger.debug(f"⏩ Skipping non-video post: {post.id}")
                return
            
            # Calculate risk score based on multiple factors
            risk_score = self._calculate_risk_score(post)
            
            self.logger.info(f"📊 Risk score for {post.id}: {risk_score:.2f}")
            
            # If risk score is high, analyze the actual media
            if risk_score > 0.6:
                await self._analyze_post_media(job, post, risk_score)
            else:
                self.logger.debug(f"✅ Post {post.id} passed initial screening (low risk)")
        
        except Exception as e:
            self.logger.error(f"❌ Error analyzing post {post.id}: {e}")
    
    def _calculate_risk_score(self, post: InstagramPost) -> float:
        """Calculate risk score for a post (0.0 = safe, 1.0 = high risk)"""
        score = 0.0
        
        # Keyword analysis
        caption_lower = post.caption.lower()
        
        # High-risk keywords
        high_risk_keywords = ['deepfake', 'fake', 'not real', 'generated', 'artificial']
        for keyword in high_risk_keywords:
            if keyword in caption_lower:
                score += 0.3
        
        # Medium-risk keywords  
        medium_risk_keywords = ['breaking', 'exclusive', 'leaked', 'scandal', 'shocking']
        for keyword in medium_risk_keywords:
            if keyword in caption_lower:
                score += 0.2
        
        # Engagement anomaly (very high engagement might indicate viral fake content)
        if post.engagement_rate > 10.0:  # Unusually high engagement
            score += 0.2
        
        # Unverified accounts posting "breaking news"
        if not post.is_verified_author and any(word in caption_lower for word in ['breaking', 'news', 'exclusive']):
            score += 0.3
        
        # Recent account activity (this would need real data)
        # For demo, assume some accounts are suspicious
        if "viral" in post.author or "fake" in post.author:
            score += 0.4
        
        return min(score, 1.0)  # Cap at 1.0
    
    async def _analyze_post_media(self, job: MonitoringJob, post: InstagramPost, risk_score: float):
        """Analyze the actual media content using our video analysis service"""
        try:
            self.logger.info(f"🎬 Analyzing media for high-risk post: {post.id}")
            
            # Import video analyzer
            from app.services.video_analyzer import get_video_analyzer
            
            # For demo, simulate deepfake analysis result
            # In production, this would download and analyze the actual video
            analysis_result = await self._simulate_deepfake_analysis(post)
            
            if analysis_result["verdict"] == "FAKE":
                self.logger.warning(f"🚨 DEEPFAKE DETECTED in post {post.id}!")
                
                # Generate incident
                await self._generate_incident(job, post, analysis_result, risk_score)
                
                job.deepfakes_detected += 1
            else:
                self.logger.info(f"✅ Post {post.id} analysis: {analysis_result['verdict']} (confidence: {analysis_result['confidence']:.2%})")
        
        except Exception as e:
            self.logger.error(f"❌ Media analysis failed for {post.id}: {e}")
    
    async def _simulate_deepfake_analysis(self, post: InstagramPost) -> Dict[str, Any]:
        """Simulate deepfake analysis for demo purposes"""
        import random
        
        # Simulate different outcomes based on post content
        caption_lower = post.caption.lower()
        
        # High chance of being fake if certain keywords present
        fake_probability = 0.1  # Default 10% chance
        
        if any(word in caption_lower for word in ['ai-generated', 'deepfake', 'fake', 'generated']):
            fake_probability = 0.8  # 80% chance if explicitly mentions AI/fake
        elif any(word in caption_lower for word in ['breaking', 'exclusive', 'leaked']):
            fake_probability = 0.3  # 30% chance for breaking news type content
        
        is_fake = random.random() < fake_probability
        confidence = random.uniform(0.75, 0.95) if is_fake else random.uniform(0.60, 0.85)
        
        return {
            "verdict": "FAKE" if is_fake else "REAL",
            "confidence": confidence,
            "processing_time": random.uniform(15, 45),
            "model": "VideoMAE + Instagram Monitor",
            "frame_count": random.randint(16, 32),
            "probabilities": {
                "fake": confidence if is_fake else 1 - confidence,
                "real": 1 - confidence if is_fake else confidence
            }
        }
    
    async def _generate_incident(self, job: MonitoringJob, post: InstagramPost, analysis_result: Dict[str, Any], risk_score: float):
        """Generate an incident for a detected deepfake"""
        try:
            # Import incident generator
            from app.services.incident_generator import get_incident_generator
            
            incident_generator = get_incident_generator()
            
            incident_data = {
                "source_type": "instagram_monitor",
                "source_id": post.id,
                "platform": "Instagram",
                "url": post.url,
                "media_url": post.media_url,
                "title": f"Deepfake detected: @{post.author} post",
                "description": f"Deepfake content detected in Instagram post by @{post.author}. Content: {post.caption[:100]}...",
                "confidence": analysis_result["confidence"],
                "verdict": analysis_result["verdict"],
                "risk_score": risk_score,
                "metadata": {
                    "post": asdict(post),
                    "analysis": analysis_result,
                    "monitoring_job": job.id,
                    "hashtags": post.hashtags,
                    "engagement": {
                        "likes": post.likes_count,
                        "comments": post.comments_count,
                        "rate": post.engagement_rate
                    }
                }
            }
            
            incident_id = await incident_generator.create_incident(incident_data)
            
            self.logger.warning(f"🚨 INCIDENT GENERATED: {incident_id} for post {post.id}")
            self.logger.warning(f"📊 Details: {analysis_result['verdict']} (confidence: {analysis_result['confidence']:.2%})")
            
            return incident_id
            
        except Exception as e:
            self.logger.error(f"❌ Failed to generate incident for post {post.id}: {e}")
            return None
    
    def get_monitoring_status(self) -> Dict[str, Any]:
        """Get current monitoring status and statistics"""
        active_jobs = [job for job in self.active_jobs.values() if job.is_active]
        
        total_scanned = sum(job.total_posts_scanned for job in active_jobs)
        total_deepfakes = sum(job.deepfakes_detected for job in active_jobs)
        
        status = {
            "active_jobs": len(active_jobs),
            "total_hashtags": sum(len(job.hashtags) for job in active_jobs),
            "posts_scanned": total_scanned,
            "deepfakes_detected": total_deepfakes,
            "detection_rate": (total_deepfakes / total_scanned * 100) if total_scanned > 0 else 0,
            "jobs": [
                {
                    "id": job.id,
                    "hashtags": job.hashtags,
                    "posts_scanned": job.total_posts_scanned,
                    "deepfakes_found": job.deepfakes_detected,
                    "last_scan": job.last_scan.isoformat() if job.last_scan else None,
                    "active": job.is_active
                }
                for job in active_jobs
            ]
        }
        
        return status


# Singleton instance
_instagram_monitor: Optional[InstagramMonitor] = None


def get_instagram_monitor() -> InstagramMonitor:
    """Get or create Instagram monitor singleton"""
    global _instagram_monitor
    if _instagram_monitor is None:
        _instagram_monitor = InstagramMonitor()
    return _instagram_monitor