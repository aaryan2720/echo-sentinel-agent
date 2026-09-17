# EchoBreaker — AI Inference & Backend Engine ⚡

FastAPI & PyTorch microservice powering deep learning deepfake detection, spatiotemporal video classification, and URL stream analysis for the **EchoBreaker Sentinel SOC (AI-03)**.

---

## 🎯 Purpose & AI-03 Alignment

Provides high-throughput, GPU-accelerated inference endpoints to **identify and address misinformation on digital platforms** by detecting manipulated visual media, synthetic faces, and deepfake video clips in real time.

---

## 🚀 Quick Start

### 1. Environment Setup

```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows (PowerShell):
.\venv\Scripts\activate
# Linux / macOS:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

### 2. Configuration (`.env`)

```bash
# Copy example environment file
cp .env.example .env

# Edit .env:
# - HUGGING_FACE_API_KEY (optional for authenticated model download)
# - API_PORT=8000
# - FRONTEND_URL=http://localhost:5173
```

### 3. Start Server

```bash
# Development mode with hot-reload
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

# Production mode with multiple workers
uvicorn app.main:app --host 0.0.0.0 --port 8000 --workers 4
```

### 4. Interactive Documentation

- **Swagger UI**: [`http://localhost:8000/docs`](http://localhost:8000/docs)
- **ReDoc**: [`http://localhost:8000/redoc`](http://localhost:8000/redoc)
- **Health Check**: [`http://localhost:8000/health`](http://localhost:8000/health)

---

## 📡 Core API Endpoints

### 1. Health & Readiness Probe
```http
GET /health
```
**Response**:
```json
{
  "status": "healthy",
  "version": "1.0.0",
  "models_loaded": true,
  "device": "cuda:0"
}
```

### 2. Video Deepfake Analysis (Direct Upload)
```http
POST /api/analyze/video
Content-Type: multipart/form-data

file: <video-file.mp4>
```
**Response**:
```json
{
  "verdict": "FAKE",
  "confidence": 0.942,
  "manipulation_type": "face_swap_synthetic",
  "frames_analyzed": 16,
  "processing_time_sec": 1.84,
  "explanation": "High spatial artifact variance detected in facial bounding regions across frames 4-12."
}
```

### 3. Digital Platform Video Analysis (URL Stream)
```http
POST /api/analyze/video-url
Content-Type: application/json

{
  "url": "https://www.instagram.com/reel/example_url"
}
```

### 4. Active Models & Inference Metadata
```http
GET /api/models
```

---

## 🎬 Deep Learning Model Architecture

This backend utilizes **VideoMAE (Video Masked Autoencoders)** fine-tuned for spatiotemporal synthetic media classification.

- **Primary Model**: `shylhy/videomae-large-finetuned-deepfake-subset`
- **Architecture**: Vision Transformer (ViT) with temporal attention heads
- **Accuracy**: 89.4% on standard benchmark datasets
- **Throughput**: ~1.5–3.0s per video stream on GPU

### Inference Pipeline
1. **Uniform Frame Extraction**: Extracts 16 representative frames across video duration.
2. **Preprocessing**: Normalized via `VideoMAEImageProcessor` (224x224 RGB tensors).
3. **Spatiotemporal Embedding**: Analyzes joint spatial and motion artifacts rather than isolated still frames.
4. **Classification & Scoring**: Softmax probability layer outputs verdict (`REAL` / `FAKE`) with confidence score.

---

## 🏗️ Directory Layout

```
backend/
├── app/
│   ├── __init__.py          # Package init
│   ├── main.py              # FastAPI app setup, CORS, lifespan handlers
│   ├── config.py            # Pydantic settings & environment loaders
│   ├── api/
│   │   ├── __init__.py
│   │   └── analyze.py       # REST route handlers
│   └── services/
│       ├── __init__.py
│       └── video_analyzer.py# VideoMAE inference engine & frame extractor
├── .env                      # Local configuration
├── .env.example             # Template configuration
└── requirements.txt         # Pinned Python dependencies
```

---

## ⚡ GPU Acceleration

GPU acceleration is enabled automatically when CUDA is present:

```bash
# Verify GPU availability
python -c "import torch; print('CUDA Available:', torch.cuda.is_available(), 'Device:', torch.cuda.get_device_name(0) if torch.cuda.is_available() else 'CPU')"
```

To install CUDA-enabled PyTorch:
```bash
pip install torch torchvision --index-url https://download.pytorch.org/whl/cu121
```

---

## 📊 Features & Status

- [x] **VideoMAE Deep Learning Integration**: Fully operational.
- [x] **URL & Direct Video Upload Pipelines**: Both routes active and tested.
- [x] **CORS & Multi-Origin Handling**: Configured for local and production frontends.
- [x] **Swagger & ReDoc API Specs**: Auto-generated and interactive.
- [x] **Zero TypeScript/Python Type Warnings**: Verified.

---

<div align="center">

**EchoBreaker Backend Engine — Powered by FastAPI & PyTorch**

</div>

<!-- EchoBreaker Sentinel (AI-03) -->
