"""
FastAPI application entry point
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import logging

# Use standard library logging instead of loguru to avoid external dependency
logger = logging.getLogger("echo_sentinel_agent")
logger.setLevel(logging.INFO)
if not logger.handlers:
    handler = logging.StreamHandler()
    formatter = logging.Formatter("%(asctime)s - %(levelname)s - %(message)s")
    handler.setFormatter(formatter)
    logger.addHandler(handler)

from app.config import get_settings

# Initialize settings
settings = get_settings()

# Create FastAPI app
app = FastAPI(
    title="Echo Sentinel Agent - Python Backend",
    description="Deepfake detection API using VideoMAE and Hugging Face models",
    version="0.1.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Configure CORS for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        settings.frontend_url,
        "http://localhost:5173",  # Vite default
        "http://localhost:8080",  # Production frontend
        "http://127.0.0.1:5173",
        "http://127.0.0.1:8080",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
async def startup_event():
    """Initialize services on startup"""
    logger.info("🚀 Starting Echo Sentinel Python Backend")
    logger.info(f"📦 Video Model: {settings.video_model_name}")
    logger.info(f"🖼️  Image Model: {settings.image_model_name}")
    logger.info(f"🔧 GPU Enabled: {settings.use_gpu}")
    logger.info(f"🌐 CORS: {settings.frontend_url}")


@app.on_event("shutdown")
async def shutdown_event():
    """Cleanup on shutdown"""
    logger.info("👋 Shutting down Echo Sentinel Python Backend")


@app.get("/")
async def root():
    """Root endpoint - health check"""
    return {
        "status": "online",
        "service": "Echo Sentinel Python Backend",
        "version": "0.1.0",
        "endpoints": {
            "docs": "/docs",
            "health": "/health",
            "analyze": "/api/analyze"
        }
    }


@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "models": {
            "video": settings.video_model_name,
            "image": settings.image_model_name
        },
        "gpu_enabled": settings.use_gpu
    }


# Import and include API routers
from app.api import analyze
app.include_router(analyze.router, prefix="/api", tags=["Analysis"])

# Additional API endpoints for frontend
@app.get("/api/incidents")
async def get_incidents():
    """Get list of incidents"""
    return [
        {
            "id": "INC-001",
            "title": "Political Deepfake Video - Election Campaign", 
            "confidence": 0.94,
            "verdict": "FAKE",
            "timestamp": "2025-11-15T10:30:00Z",
            "platform": "Twitter",
            "network_size": 187,
            "status": "active",
            "description": "Coordinated deepfake video campaign targeting election narratives"
        },
        {
            "id": "INC-002",
            "title": "Coordinated Bot Network - Crypto Manipulation",
            "confidence": 0.89, 
            "verdict": "FAKE",
            "timestamp": "2025-11-15T14:22:00Z",
            "platform": "Instagram", 
            "network_size": 234,
            "status": "investigating",
            "description": "234 bot accounts coordinating crypto pump & dump scheme"
        },
        {
            "id": "INC-003",
            "title": "Audio Deepfake - Celebrity Endorsement",
            "confidence": 0.91,
            "verdict": "FAKE", 
            "timestamp": "2025-11-16T08:45:00Z",
            "platform": "TikTok",
            "network_size": 92,
            "status": "resolved",
            "description": "Synthetic voice clone of celebrity endorsing fake product"
        }
    ]

@app.get("/api/alerts")
async def get_alerts():
    """Get list of active alerts"""
    return [
        {
            "id": "ALR-001",
            "type": "deepfake_detected",
            "severity": "high", 
            "title": "Political Deepfake Video Detected",
            "message": "High-confidence deepfake video detected in viral political content",
            "timestamp": "2025-11-16T09:15:00Z",
            "status": "active",
            "confidence": 0.94
        },
        {
            "id": "ALR-002", 
            "type": "coordination_detected",
            "severity": "medium",
            "title": "Bot Coordination Pattern",
            "message": "187 accounts showing synchronized posting behavior across platforms", 
            "timestamp": "2025-11-16T09:10:00Z",
            "status": "investigating",
            "confidence": 0.89
        },
        {
            "id": "ALR-003",
            "type": "audio_synthetic",
            "severity": "high",
            "title": "Synthetic Voice Detected", 
            "message": "AI-generated voice clone detected in trending audio content",
            "timestamp": "2025-11-16T09:05:00Z",
            "status": "active", 
            "confidence": 0.91
        }
    ]

@app.get("/api/agents")
async def get_agents():
    """Get AI agent status"""
    return [
        {
            "id": 1,
            "name": "Continuous Monitoring Agent",
            "status": "active",
            "accuracy": 0.92,
            "tasks_completed": 1247,
            "last_activity": "2025-11-16T09:16:00Z",
            "current_task": "Scanning trending topics on X/Twitter",
            "performance": {"precision": 0.91, "recall": 0.94}
        },
        {
            "id": 2, 
            "name": "Multimodal Detection Agent",
            "status": "active",
            "accuracy": 0.89,
            "tasks_completed": 428, 
            "last_activity": "2025-11-16T09:15:00Z",
            "current_task": "Analyzing uploaded video content",
            "performance": {"precision": 0.87, "recall": 0.91}
        },
        {
            "id": 3,
            "name": "Coordination Detection Agent", 
            "status": "active",
            "accuracy": 0.91,
            "tasks_completed": 156,
            "last_activity": "2025-11-16T09:14:00Z",
            "current_task": "Mapping propagation networks",
            "performance": {"precision": 0.93, "recall": 0.89}
        },
        {
            "id": 4,
            "name": "Attribution & Causality Agent",
            "status": "active", 
            "accuracy": 0.86,
            "tasks_completed": 89,
            "last_activity": "2025-11-16T09:12:00Z",
            "current_task": "Tracing content origins",
            "performance": {"precision": 0.84, "recall": 0.88}
        },
        {
            "id": 5,
            "name": "Response & Reporting Agent",
            "status": "active",
            "accuracy": 0.95,
            "tasks_completed": 234, 
            "last_activity": "2025-11-16T09:11:00Z",
            "current_task": "Generating incident reports",
            "performance": {"precision": 0.96, "recall": 0.94}
        },
        {
            "id": 6,
            "name": "Self-Improving Agent",
            "status": "active",
            "accuracy": 0.88,
            "tasks_completed": 67,
            "last_activity": "2025-11-16T09:08:00Z", 
            "current_task": "Processing human feedback",
            "performance": {"precision": 0.85, "recall": 0.91}
        }
    ]

@app.get("/api/stats")
async def get_stats():
    """Get dashboard statistics"""
    return {
        "total_incidents": 156,
        "active_alerts": 12,
        "networks_detected": 23,
        "accuracy_rate": 0.91,
        "processing_speed": "2.3s avg",
        "platforms_monitored": 8,
        "last_24h": {
            "incidents": 7,
            "alerts": 15,
            "content_analyzed": 2847
        },
        "confidence_distribution": {
            "high": 67,
            "medium": 23, 
            "low": 10
        }
    }
