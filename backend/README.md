# Echo Sentinel - Python Backend

FastAPI backend for deepfake detection using VideoMAE models.

## 🚀 Quick Start

### 1. Install Dependencies

```bash
# Navigate to backend folder
cd backend

# Activate virtual environment
.\venv\Scripts\activate  # Windows
# source venv/bin/activate  # Linux/Mac

# Install dependencies
pip install -r requirements.txt
```

### 2. Configure Environment

```bash
# Copy example env file
cp .env.example .env

# Edit .env and add your keys:
# - HUGGING_FACE_API_KEY (get from https://huggingface.co/settings/tokens)
# - VITE_SUPABASE_URL (copy from frontend .env)
# - VITE_SUPABASE_ANON_KEY (copy from frontend .env)
```

### 3. Run Server

```bash
# Development mode (auto-reload)
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

# Production mode
uvicorn app.main:app --host 0.0.0.0 --port 8000 --workers 4
```

### 4. Test API

Open browser: **http://localhost:8000/docs**

You'll see interactive Swagger UI with all endpoints.

## 📡 API Endpoints

### Health Check
```bash
GET http://localhost:8000/health
```

### Analyze Video (Upload)
```bash
POST http://localhost:8000/api/analyze/video
Content-Type: multipart/form-data

file: <video-file.mp4>
```

### Analyze Video (URL)
```bash
POST http://localhost:8000/api/analyze/video-url
Content-Type: application/json

{
  "url": "https://example.com/video.mp4"
}
```

### Get Models Info
```bash
GET http://localhost:8000/api/models
```

## 🧪 Testing with cURL

### Test video upload:
```bash
curl -X POST "http://localhost:8000/api/analyze/video" \
  -F "file=@path/to/video.mp4"
```

### Test video URL:
```bash
curl -X POST "http://localhost:8000/api/analyze/video-url" \
  -H "Content-Type: application/json" \
  -d '{"url": "https://example.com/video.mp4"}'
```

## 🎬 VideoMAE Model

This backend uses **VideoMAE** (Video Masked Autoencoders) for native video deepfake detection.

- **Model**: `shylhy/videomae-large-finetuned-deepfake-subset`
- **Accuracy**: 85-90%
- **Speed**: 2-5 seconds per video
- **Method**: Native video processing (not frame-by-frame)

### How it works:
1. Extracts 16 frames uniformly from video
2. Preprocesses frames using VideoMAEImageProcessor
3. Runs inference on GPU (if available) or CPU
4. Returns verdict (REAL/FAKE) with confidence score

## 🏗️ Architecture

```
backend/
├── app/
│   ├── __init__.py          # Package init
│   ├── main.py              # FastAPI app, CORS, startup
│   ├── config.py            # Settings from .env
│   ├── api/
│   │   ├── __init__.py
│   │   └── analyze.py       # Analysis endpoints
│   └── services/
│       ├── __init__.py
│       └── video_analyzer.py # VideoMAE integration
├── .env                      # Environment variables
├── .env.example             # Example env file
└── requirements.txt         # Python dependencies
```

## ⚙️ Configuration

Edit `.env` to configure:

- **API_HOST**: Server host (default: 0.0.0.0)
- **API_PORT**: Server port (default: 8000)
- **DEBUG**: Enable debug mode (default: True)
- **MAX_VIDEO_SIZE_MB**: Max upload size (default: 100MB)
- **USE_GPU**: Enable GPU acceleration (default: True)
- **FRONTEND_URL**: Frontend URL for CORS (default: http://localhost:8080)

## 🔥 GPU Acceleration

The backend automatically uses GPU if available:

```python
# Check GPU status
device = "cuda" if torch.cuda.is_available() else "cpu"
```

For NVIDIA GPUs, install CUDA version of PyTorch:
```bash
pip install torch --index-url https://download.pytorch.org/whl/cu118
```

## 📊 Performance

- **Image Analysis**: ~2-3 seconds
- **Video Analysis**: ~2-5 seconds (16 frames)
- **GPU**: 10x faster than CPU
- **Memory**: ~2GB for model + ~1GB per video

## 🐛 Troubleshooting

### Model not loading?
```bash
# Check Hugging Face access
python -c "from transformers import VideoMAEForVideoClassification; print('OK')"

# Download model manually
python -c "from transformers import VideoMAEForVideoClassification; VideoMAEForVideoClassification.from_pretrained('shylhy/videomae-large-finetuned-deepfake-subset')"
```

### CORS errors?
- Update `FRONTEND_URL` in `.env`
- Check `app/main.py` CORS configuration

### Out of memory?
- Reduce `MAX_VIDEO_SIZE_MB`
- Use CPU instead of GPU: `USE_GPU=False`
- Reduce number of workers

### Slow processing?
- Enable GPU: `USE_GPU=True`
- Install CUDA version of PyTorch
- Reduce video resolution before upload

## 🚀 Deployment

### Railway / Render / Fly.io

1. Add environment variables in dashboard
2. Set build command: `pip install -r requirements.txt`
3. Set start command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`

### Docker

```dockerfile
FROM python:3.11-slim

WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt

COPY app/ ./app/
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

## 📚 Documentation

See `docs/` folder:
- **PYTHON_BACKEND_ARCHITECTURE.md** - Complete architecture guide
- **PYTHON_PRODUCTION_ROADMAP.md** - Implementation roadmap
- **VIDEO_ANALYSIS_EXPLAINED.md** - How VideoMAE works

## 🎯 Next Steps

1. ✅ Install dependencies
2. ✅ Configure `.env`
3. ✅ Run server
4. ✅ Test with Swagger UI
5. ⏳ Integrate with React frontend
6. ⏳ Deploy to production

## 💡 Tips

- Use `/docs` for interactive API testing
- Check `/health` to verify models loaded
- Monitor logs with `loguru` (colored output)
- Test with small videos first (<10MB)
- GPU makes huge difference in speed

## 🔗 Links

- **VideoMAE Model**: https://huggingface.co/shylhy/videomae-large-finetuned-deepfake-subset
- **FastAPI Docs**: https://fastapi.tiangolo.com/
- **Hugging Face**: https://huggingface.co/

---

Built with ❤️ for Echo Sentinel Agent
