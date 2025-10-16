# EchoBreaker — Technology Stack

## Frontend (Current Implementation)

### Core Technologies
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite (for fast development and optimized production builds)
- **Styling**: Tailwind CSS with custom design system
- **UI Components**: Shadcn/ui (Radix UI primitives)
- **Routing**: React Router v6
- **State Management**: TanStack React Query (for server state)
- **Icons**: Lucide React

### Key Libraries
```json
{
  "react": "^18.x",
  "typescript": "^5.x",
  "vite": "^6.x",
  "tailwindcss": "^3.x",
  "@radix-ui/*": "Various components",
  "@tanstack/react-query": "^5.83.0",
  "react-router-dom": "^7.x",
  "lucide-react": "^0.462.0"
}
```

## Backend (To Be Implemented — Recommended Stack)

### API Layer
- **Framework**: FastAPI (Python) or Express.js (Node.js)
- **API Documentation**: OpenAPI/Swagger
- **Authentication**: JWT tokens + OAuth 2.0
- **Rate Limiting**: Redis-based rate limiter

### AI/ML Services

#### 1. Deepfake Detection
- **Vision Models**: 
  - Vision Transformer (ViT) for image/video analysis
  - EfficientNet or ResNet variants for frame classification
  - Pre-trained models from FaceForensics++ dataset
- **Framework**: PyTorch or TensorFlow
- **Model Serving**: TorchServe or TensorFlow Serving

#### 2. Audio Analysis
- **Audio Deepfake Detection**:
  - Spectral analysis using librosa
  - Audio Transformer models
  - ASVspoof pre-trained models
- **ASR (Speech-to-Text)**: 
  - Whisper by OpenAI
  - Google Cloud Speech-to-Text (for Indian languages)

#### 3. Text & NLP
- **LLM Integration**: 
  - LangChain for orchestration
  - LangGraph for agent workflows
  - OpenAI GPT-4 or Anthropic Claude for reasoning
- **Embeddings**: 
  - OpenAI embeddings
  - Sentence Transformers for local deployment
- **Vector Database**: 
  - Pinecone (cloud)
  - FAISS (local)
  - Qdrant (open-source alternative)

#### 4. Graph Neural Networks
- **Framework**: PyTorch Geometric (PyG)
- **Purpose**: Coordination detection and cluster analysis
- **Algorithms**: GraphSAGE, GCN, GAT for node classification

### Data Storage

#### Databases
- **Graph Database**: Neo4j (for propagation networks)
- **Document Database**: MongoDB (for metadata and content)
- **Relational Database**: PostgreSQL (for structured data, users, incidents)
- **Vector Database**: Pinecone/FAISS (for embeddings and similarity search)
- **Cache**: Redis (for real-time data and rate limiting)

#### Object Storage
- **Media Storage**: AWS S3 or MinIO (self-hosted)
- **Purpose**: Store videos, images, audio files, and evidence bundles

### Message Queue & Streaming
- **Message Broker**: Apache Kafka or RabbitMQ
- **Purpose**: Event-driven architecture for real-time processing
- **Stream Processing**: Apache Flink or Kafka Streams

### Ingestion & Crawlers

#### Social Media APIs
- **X (Twitter)**: Twitter API v2
- **YouTube**: YouTube Data API v3
- **Telegram**: Telegram Bot API + MTProto
- **Reddit**: PRAW (Python Reddit API Wrapper)
- **RSS**: Feedparser for news aggregation

#### Web Scraping (where APIs unavailable)
- **Framework**: Scrapy or Playwright
- **Proxy Management**: Bright Data or residential proxies
- **Rate Limiting**: Respect robots.txt and platform TOS

### Monitoring & Observability
- **Application Monitoring**: 
  - Prometheus (metrics)
  - Grafana (dashboards)
  - Sentry (error tracking)
- **Logging**: 
  - ELK Stack (Elasticsearch, Logstash, Kibana)
  - Or Loki + Grafana
- **Tracing**: OpenTelemetry

### Infrastructure & DevOps

#### Containerization
- **Container Runtime**: Docker
- **Orchestration**: Kubernetes (K8s)
- **Service Mesh**: Istio (optional, for advanced networking)

#### CI/CD
- **Version Control**: Git + GitHub
- **CI/CD Pipeline**: GitHub Actions or GitLab CI
- **Automated Testing**: Pytest (backend), Vitest (frontend)

#### Cloud Provider (Recommended)
- **Primary**: AWS, Google Cloud, or Azure
- **Services**:
  - Compute: EC2/GKE/AKS or serverless (Lambda/Cloud Functions)
  - Storage: S3/GCS/Azure Blob
  - Database: RDS, Cloud SQL, or managed MongoDB Atlas
  - CDN: CloudFront, Cloud CDN, or Azure CDN

### Security

#### Authentication & Authorization
- **Auth Provider**: Supabase (currently configured) or Auth0
- **RBAC**: Role-based access control for different user types
- **API Keys**: For third-party integrations

#### Data Security
- **Encryption**: 
  - At rest: AES-256
  - In transit: TLS 1.3
- **Secrets Management**: HashiCorp Vault or AWS Secrets Manager
- **Audit Logs**: Immutable logs with tamper-evidence

### ML Ops

#### Model Management
- **Experiment Tracking**: Weights & Biases (W&B) or MLflow
- **Model Registry**: MLflow Model Registry
- **Model Versioning**: Git LFS + DVC (Data Version Control)

#### Training Infrastructure
- **GPU Instances**: AWS p3/p4 instances or Google Cloud TPUs
- **Distributed Training**: PyTorch DDP or Horovod
- **Hyperparameter Tuning**: Optuna or Ray Tune

### Additional Services

#### PDF Generation
- **Library**: Puppeteer (Node.js) or ReportLab (Python)
- **Purpose**: Generate incident report PDFs

#### Webhooks & Notifications
- **Email**: SendGrid or AWS SES
- **Slack**: Slack Web API
- **SMS**: Twilio (for critical alerts)

## Current Implementation Status

### ✅ Implemented
- Complete frontend UI with all required pages
- Responsive design with Tailwind CSS
- Modern component library (Shadcn/ui)
- Client-side routing
- Basic Supabase configuration

### 🚧 To Be Implemented (Hackathon Priority)
1. **Backend API** (FastAPI with basic endpoints)
2. **Mock Detection Services** (simulated deepfake detection)
3. **Database Setup** (PostgreSQL + MongoDB)
4. **Basic Agent Simulator** (mock AI agents with fake data)
5. **Real-time WebSocket** (for live updates)
6. **PDF Report Generation** (incident reports)

### 🔮 Post-Hackathon Roadmap
1. **Production ML Models** (actual deepfake detection)
2. **Graph Neural Network** (coordination detection)
3. **Multi-platform Ingestion** (real social media APIs)
4. **Advanced Analytics** (time-series analysis)
5. **Multilingual Support** (Indian languages)
6. **Production Infrastructure** (Kubernetes deployment)

## Development Setup

### Prerequisites
```bash
Node.js >= 18.x
npm or bun
Git
```

### Local Development
```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Recommended Folder Structure (Backend)

```
backend/
├── api/                    # API endpoints
├── agents/                 # AI agent implementations
│   ├── monitoring/
│   ├── detection/
│   ├── coordination/
│   ├── attribution/
│   ├── reporting/
│   └── retraining/
├── models/                 # ML model implementations
│   ├── deepfake/
│   ├── audio/
│   ├── text/
│   └── graph/
├── services/              # Business logic
├── db/                    # Database models and migrations
├── utils/                 # Utilities and helpers
├── config/                # Configuration files
└── tests/                 # Test suites
```
