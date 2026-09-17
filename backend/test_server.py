"""
Quick test server to verify basic functionality
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import logging

# Simple test app
app = FastAPI(title="EchoBreaker Test API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:8080"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"status": "working", "message": "Backend is alive!"}

@app.get("/health")
async def health():
    return {
        "status": "healthy",
        "backend": "operational",
        "models": "loading...",
        "timestamp": "2025-11-16"
    }

@app.get("/api/incidents")
async def get_incidents():
    """Mock incidents for testing"""
    return [
        {
            "id": "INC-001",
            "title": "Political Deepfake Video - Election Campaign",
            "confidence": 0.94,
            "verdict": "FAKE",
            "timestamp": "2025-11-15T10:30:00Z",
            "platform": "Twitter",
            "network_size": 187
        },
        {
            "id": "INC-002", 
            "title": "Coordinated Bot Network - Crypto Pump",
            "confidence": 0.89,
            "verdict": "FAKE",
            "timestamp": "2025-11-15T14:22:00Z",
            "platform": "Instagram",
            "network_size": 234
        }
    ]

@app.get("/api/alerts")
async def get_alerts():
    """Mock alerts for testing"""
    return [
        {
            "id": "ALR-001",
            "type": "deepfake_detected",
            "severity": "high",
            "message": "Potential deepfake video detected in viral political content",
            "timestamp": "2025-11-16T09:15:00Z"
        },
        {
            "id": "ALR-002",
            "type": "coordination_detected", 
            "severity": "medium",
            "message": "187 accounts showing synchronized posting behavior",
            "timestamp": "2025-11-16T09:10:00Z"
        }
    ]

@app.get("/api/agents")
async def get_agents():
    """Mock agent status"""
    return [
        {
            "id": 1,
            "name": "Monitoring Agent",
            "status": "active",
            "accuracy": 0.92,
            "tasks_completed": 1247,
            "last_activity": "2025-11-16T09:16:00Z"
        },
        {
            "id": 2,
            "name": "Detection Agent", 
            "status": "active",
            "accuracy": 0.89,
            "tasks_completed": 428,
            "last_activity": "2025-11-16T09:15:00Z"
        },
        {
            "id": 3,
            "name": "Coordination Agent",
            "status": "active", 
            "accuracy": 0.91,
            "tasks_completed": 156,
            "last_activity": "2025-11-16T09:14:00Z"
        }
    ]

@app.post("/api/analyze")
async def analyze_media():
    """Mock analysis endpoint"""
    return {
        "verdict": "FAKE",
        "confidence": 0.94,
        "processing_time": 2.3,
        "model": "VideoMAE (simulated)",
        "frame_count": 32,
        "probabilities": {
            "fake": 0.94,
            "real": 0.06
        }
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)