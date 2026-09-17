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
