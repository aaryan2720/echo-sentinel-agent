# EchoBreaker — System Architecture

## High-Level Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                         FRONTEND (React + TypeScript)                │
├─────────────────────────────────────────────────────────────────────┤
│  Landing  │ Dashboard │ Network │ Incidents │ Alerts │ Agents │ ... │
└────────────┬────────────────────────────────────────────────────────┘
             │
             │ REST API / WebSocket
             │
┌────────────▼────────────────────────────────────────────────────────┐
│                      API GATEWAY (FastAPI)                           │
├─────────────────────────────────────────────────────────────────────┤
│  • Authentication (JWT)                                              │
│  • Rate Limiting (Redis)                                             │
│  • Request Routing                                                   │
│  • WebSocket Management                                              │
└────────────┬────────────────────────────────────────────────────────┘
             │
             │
    ┌────────┴──────────────────────────────────┐
    │                                            │
    │                                            │
┌───▼─────────────────────┐          ┌──────────▼──────────────────┐
│   AGENTIC AI LAYER      │          │   DATA & STORAGE LAYER      │
├─────────────────────────┤          ├─────────────────────────────┤
│                         │          │                             │
│ 1️⃣ Monitoring Agent     │◄─────────┤  PostgreSQL                │
│    • Poll APIs          │          │  • Users, Incidents         │
│    • Detect spikes      │          │  • Alerts, Agents           │
│                         │          │  • Configuration            │
│ 2️⃣ Detection Agent      │          │                             │
│    • Deepfake Vision    │◄─────────┤  MongoDB                   │
│    • Audio Analysis     │          │  • Content Metadata         │
│    • Text Verification  │          │  • Media Hashes             │
│                         │          │  • Logs                     │
│ 3️⃣ Coordination Agent   │          │                             │
│    • Graph Builder      │◄─────────┤  Neo4j                     │
│    • GNN Clustering     │          │  • Propagation Graph        │
│    • Network Forensics  │          │  • Account Nodes            │
│                         │          │  • Relationship Edges       │
│ 4️⃣ Attribution Agent    │          │                             │
│    • Origin Tracing     │◄─────────┤  Pinecone / FAISS          │
│    • Content Provenance │          │  • Embeddings               │
│    • Actor Profiling    │          │  • Similarity Search        │
│                         │          │  • Vector Store             │
│ 5️⃣ Reporting Agent      │          │                             │
│    • LLM Summarization  │◄─────────┤  S3 / MinIO                │
│    • PDF Generation     │          │  • Media Files              │
│    • Alert Dispatch     │          │  • Evidence Bundles         │
│                         │          │  • Reports (PDFs)           │
│ 6️⃣ Retraining Agent     │          │                             │
│    • Feedback Loop      │◄─────────┤  Redis                     │
│    • Model Updates      │          │  • Cache                    │
│    • Performance Track  │          │  • Rate Limiting            │
└─────────────────────────┘          │  • Session Data             │
                                     └─────────────────────────────┘
             │
             │
┌────────────▼────────────────────────────────────────────────────────┐
│                   ML MODEL SERVING LAYER                             │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  Vision Models          Audio Models         Text Models            │
│  ┌──────────────┐      ┌──────────────┐    ┌──────────────┐       │
│  │ ViT (Video)  │      │ ASVspoof     │    │ BERT / RoBERTa│      │
│  │ EfficientNet │      │ Spectral     │    │ GPT-4 (LLM)   │      │
│  │ (Image)      │      │ Analysis     │    │ Embeddings    │      │
│  └──────────────┘      └──────────────┘    └──────────────┘       │
│                                                                      │
│  Graph Models                     Served via:                       │
│  ┌──────────────┐                • TorchServe                       │
│  │ GNN (PyG)    │                • TensorFlow Serving               │
│  │ GraphSAGE    │                • Hugging Face Inference API       │
│  └──────────────┘                                                   │
└─────────────────────────────────────────────────────────────────────┘
             │
             │
┌────────────▼────────────────────────────────────────────────────────┐
│                    INGESTION & CRAWLING LAYER                        │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  Platform Connectors:                                                │
│  ┌──────┐  ┌──────┐  ┌──────┐  ┌──────┐  ┌──────┐                │
│  │  X   │  │YouTube│ │Telegram│ │Reddit│  │ RSS  │                 │
│  │ API  │  │  API  │ │  API   │ │ PRAW │  │Feeds │                 │
│  └──────┘  └──────┘  └──────┘  └──────┘  └──────┘                │
│                                                                      │
│  Message Queue (Kafka / RabbitMQ)                                   │
│  • Event-driven ingestion                                           │
│  • Rate limiting and queuing                                        │
│  • Retry logic for failed fetches                                   │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Component Breakdown

### 1. Frontend (React + TypeScript)
**Tech**: Vite, React 18, TypeScript, Tailwind CSS, Shadcn/ui  
**Pages**: 8 main pages (Landing, Dashboard, Network, Incidents, Alerts, Agents, Analytics, Settings)  
**Communication**: REST API + WebSocket for real-time updates  
**State**: TanStack Query for server state

---

### 2. API Gateway (FastAPI)
**Responsibilities**:
- Route requests to appropriate services
- Handle authentication (JWT tokens)
- Rate limiting (Redis-backed)
- WebSocket connections for real-time
- CORS configuration
- API documentation (OpenAPI/Swagger)

**Key Endpoints**:
```
GET    /api/health
GET    /api/incidents
GET    /api/incidents/{id}
POST   /api/incidents/{id}/feedback
GET    /api/alerts
GET    /api/agents
POST   /api/analyze
GET    /api/stats
WS     /ws
```

---

### 3. Agentic AI Layer (6 Autonomous Agents)

#### 🤖 Agent 1: Continuous Monitoring Agent
- **Purpose**: Track trending topics and spikes
- **Actions**: 
  - Poll platform APIs on schedule
  - Detect velocity spikes (trending)
  - Prioritize streams for analysis
  - Trigger downstream agents

#### 🎭 Agent 2: Multimodal Detection Agent
- **Purpose**: Detect synthetic media
- **Actions**:
  - Run video frame analysis (ViT)
  - Perform audio deepfake detection
  - Extract and verify text claims
  - Generate confidence scores

#### 🕸️ Agent 3: Coordination Detection Agent
- **Purpose**: Map propagation networks
- **Actions**:
  - Build graph (nodes = accounts, edges = shares)
  - Run GNN for cluster detection
  - Identify synchronized behavior
  - Compute coordination scores

#### 🔍 Agent 4: Causality & Attribution Agent
- **Purpose**: Trace origins and actors
- **Actions**:
  - Find seed accounts
  - Match content hashes (reused assets)
  - Profile coordinating actors
  - Suggest attribution

#### 📊 Agent 5: Response & Reporting Agent
- **Purpose**: Generate reports and alerts
- **Actions**:
  - Use LLM (GPT-4) for natural language summaries
  - Create PDF incident reports
  - Send push alerts (webhook/email/Slack)
  - Prepare debunk snippets

#### 🧠 Agent 6: Self-Improving Agent
- **Purpose**: Learn from feedback
- **Actions**:
  - Collect human annotations
  - Update training datasets
  - Retrain models periodically
  - Track performance metrics

---

### 4. ML Model Serving Layer

#### Vision Models
- **ViT (Vision Transformer)**: Video frame classification
- **EfficientNet / ResNet**: Image deepfake detection
- **Pre-trained**: FaceForensics++, DFDC datasets

#### Audio Models
- **ASVspoof**: Audio deepfake detection
- **Spectral Analysis**: Frequency domain features (librosa)
- **Whisper**: Speech-to-Text (ASR) for transcription

#### Text Models
- **BERT / RoBERTa**: Claim extraction, sentiment analysis
- **GPT-4 / Claude**: LLM reasoning and explanation
- **Sentence Transformers**: Text embeddings for similarity

#### Graph Models
- **GNN (PyTorch Geometric)**: Coordination detection
- **GraphSAGE / GCN**: Node classification in networks
- **Community Detection**: Louvain, Label Propagation

**Serving Options**:
- TorchServe (PyTorch models)
- TensorFlow Serving (TF models)
- Hugging Face Inference API (cloud option)

---

### 5. Data & Storage Layer

#### PostgreSQL (Relational DB)
**Stores**:
- User accounts and authentication
- Incidents (structured metadata)
- Alerts and notifications
- Agent status and tasks
- Configuration settings

#### MongoDB (Document DB)
**Stores**:
- Content metadata (posts, videos, images)
- Media hashes and provenance
- Unstructured logs
- Platform API responses

#### Neo4j (Graph DB)
**Stores**:
- Propagation graphs
- Account nodes (users, bots)
- Relationship edges (shares, reposts, quotes)
- Cluster metadata

#### Pinecone / FAISS (Vector DB)
**Stores**:
- Image embeddings (for similarity search)
- Text embeddings (for RAG)
- Audio embeddings
- Fast nearest-neighbor queries

#### S3 / MinIO (Object Storage)
**Stores**:
- Video files
- Audio clips
- Images
- Evidence bundles (zipped forensic data)
- Generated PDF reports

#### Redis (Cache & Session)
**Uses**:
- API rate limiting
- Session storage
- Real-time data cache (hot data)
- Message queue (Pub/Sub)

---

### 6. Ingestion & Crawling Layer

#### Platform Connectors
- **X (Twitter)**: Twitter API v2 (elevated access)
- **YouTube**: YouTube Data API v3 (trending, search)
- **Telegram**: Telegram Bot API (public channels)
- **Reddit**: PRAW (Python Reddit API Wrapper)
- **RSS**: Feedparser (news aggregation)

#### Message Queue
- **Kafka or RabbitMQ**: Event-driven architecture
- **Topics**: `content.video`, `content.audio`, `content.text`, `alerts`
- **Consumers**: Agents subscribe to relevant topics
- **Benefits**: Decoupling, scalability, fault tolerance

---

## Data Flow Example: Deepfake Video Detection

### Step-by-Step Flow

```
1. User uploads video via /api/analyze
   │
   ├─► API Gateway receives file
   │   └─► Stores in S3/MinIO
   │
2. Monitoring Agent detects new upload
   │
   ├─► Publishes event to Kafka: content.video
   │
3. Detection Agent consumes event
   │
   ├─► Downloads video from S3
   ├─► Extracts frames (every 1 sec)
   ├─► Sends frames to Vision Model (ViT)
   │   └─► Model returns confidence scores per frame
   ├─► Extracts audio track
   ├─► Sends audio to Audio Model (ASVspoof)
   │   └─► Model returns audio authenticity score
   │
4. Detection Agent aggregates results
   │
   ├─► Overall confidence: 94% deepfake
   ├─► Stores results in MongoDB (metadata)
   ├─► Publishes event: detection.completed
   │
5. Coordination Agent consumes detection event
   │
   ├─► Queries Neo4j for propagation graph
   ├─► Finds 187 accounts sharing similar content
   ├─► Runs GNN to detect coordination clusters
   ├─► Updates graph with cluster IDs
   │
6. Attribution Agent attempts origin trace
   │
   ├─► Computes content hash
   ├─► Searches vector DB for similar uploads
   ├─► Finds original seed account (earliest post)
   ├─► Profiles coordinating actors
   │
7. Reporting Agent generates output
   │
   ├─► Uses GPT-4 to write natural language summary
   ├─► Creates incident record in PostgreSQL
   ├─► Generates PDF report (Puppeteer)
   ├─► Stores PDF in S3
   ├─► Publishes alert to /ws WebSocket
   ├─► Sends webhook to configured endpoints
   │
8. Frontend receives WebSocket alert
   │
   ├─► Updates Dashboard with new incident
   ├─► Shows notification badge on Alerts page
   ├─► User clicks to view detailed incident report
```

**Total Time**: 5-10 seconds for video analysis

---

## Infrastructure & DevOps

### Containerization
```
┌─────────────────────────────────────┐
│       Kubernetes Cluster            │
├─────────────────────────────────────┤
│                                     │
│  ┌─────────┐  ┌─────────┐         │
│  │ Frontend│  │  API    │         │
│  │ (Nginx) │  │ Gateway │         │
│  └─────────┘  └─────────┘         │
│                                     │
│  ┌─────────┐  ┌─────────┐         │
│  │ Agent 1 │  │ Agent 2 │  ...    │
│  └─────────┘  └─────────┘         │
│                                     │
│  ┌─────────┐  ┌─────────┐         │
│  │  Model  │  │  Model  │         │
│  │ Serving │  │ Serving │         │
│  └─────────┘  └─────────┘         │
│                                     │
│  ┌─────────┐  ┌─────────┐         │
│  │  Redis  │  │  Kafka  │         │
│  └─────────┘  └─────────┘         │
└─────────────────────────────────────┘
```

### Deployment Architecture
- **Frontend**: Vercel or Netlify (CDN-backed)
- **Backend**: AWS ECS / GKE / AKS (Kubernetes)
- **Databases**: Managed services (RDS, Atlas, Neo4j Aura)
- **Storage**: S3 / GCS / Azure Blob
- **Monitoring**: Prometheus + Grafana
- **Logging**: ELK Stack or Loki
- **CI/CD**: GitHub Actions

---

## Scalability Considerations

### Horizontal Scaling
- **API Gateway**: Multiple replicas behind load balancer
- **Agents**: Each agent can run in multiple instances
- **Model Serving**: GPU instances with autoscaling
- **Databases**: Read replicas, sharding (if needed)

### Performance Optimizations
- **Caching**: Redis for hot data (trending topics, recent alerts)
- **CDN**: CloudFront for static assets and media
- **Database Indexes**: Proper indexing on query-heavy tables
- **Lazy Loading**: Frontend components load on demand
- **Compression**: Gzip/Brotli for API responses

### Rate Limiting
- **Per-user limits**: 100 requests/min (API)
- **Per-IP limits**: 1000 requests/hour (frontend)
- **Platform API limits**: Respect Twitter/YouTube quotas
- **Retry with backoff**: Exponential backoff for failed requests

---

## Security Architecture

### Authentication Flow
```
User Login
   │
   ├─► Frontend sends credentials to /auth/login
   │
   ├─► API Gateway validates with Supabase Auth
   │   └─► Returns JWT token (access + refresh)
   │
   ├─► Frontend stores JWT in localStorage
   │
   └─► All API requests include JWT in Authorization header
       └─► API Gateway validates JWT before routing
```

### Data Security
- **Encryption at Rest**: AES-256 for all stored data
- **Encryption in Transit**: TLS 1.3 for all connections
- **Secrets Management**: HashiCorp Vault or AWS Secrets Manager
- **API Keys**: Rotating keys for third-party services
- **Audit Logs**: Immutable logs with tamper-evidence (blockchain-like)

### RBAC (Role-Based Access Control)
- **Admin**: Full system access, configuration, user management
- **Analyst**: View incidents, annotations, export reports
- **Reviewer**: Human-in-the-loop review, mark true/false
- **API Consumer**: Third-party integrations (read-only)

---

## Monitoring & Observability

### Metrics (Prometheus)
- **System Metrics**: CPU, memory, disk, network
- **Application Metrics**: 
  - API request rate, latency, error rate
  - Agent task completion time
  - Model inference latency
  - Detection accuracy (precision, recall)
- **Business Metrics**:
  - Incidents detected per hour
  - Alert response time
  - Human review acceptance rate

### Dashboards (Grafana)
- **Operational Dashboard**: System health, service status
- **Detection Dashboard**: Model performance, confidence distributions
- **User Dashboard**: Active users, API usage, engagement

### Alerts (Alertmanager)
- **Critical**: API downtime, database connection loss
- **Warning**: High CPU/memory, slow inference, API errors
- **Info**: New incidents, completed tasks

---

## Backup & Disaster Recovery

### Backup Strategy
- **Databases**: Daily automated backups (7-day retention)
- **Object Storage**: Versioning enabled (S3 versioning)
- **Code**: Git repository (GitHub with branch protection)
- **Configuration**: Infrastructure as Code (Terraform)

### Disaster Recovery
- **RTO (Recovery Time Objective)**: 1 hour
- **RPO (Recovery Point Objective)**: 4 hours
- **Multi-region**: Active-passive setup (if budget allows)
- **Restore Procedure**: Documented runbooks for all services

---

## Cost Optimization

### Cloud Costs (Estimated Monthly for MVP)
- **Compute**: $200-$400 (EC2/GKE instances)
- **Database**: $150-$300 (RDS + MongoDB Atlas)
- **Storage**: $50-$100 (S3 + CDN)
- **AI/ML APIs**: $100-$300 (Hugging Face, OpenAI)
- **Monitoring**: $50 (Prometheus + Grafana Cloud)
- **Total MVP**: **$550-$1,100/month**

### Production Scale (10K+ users)
- Estimated: $3,000-$5,000/month
- Optimization: Spot instances, reserved capacity, caching

---

## Technology Choices Rationale

| Component | Choice | Why? |
|-----------|--------|------|
| **Frontend** | React + TypeScript | Modern, type-safe, great ecosystem |
| **UI Library** | Shadcn/ui | Beautiful, accessible, customizable |
| **Backend** | FastAPI | Fast, async, great for ML integration |
| **Database** | PostgreSQL | Reliable, ACID, good for structured data |
| **Graph DB** | Neo4j | Best-in-class for graph queries |
| **Vector DB** | Pinecone | Managed, fast, easy to use |
| **Message Queue** | Kafka | Scalable, durable, battle-tested |
| **ML Framework** | PyTorch | Flexible, great for research & production |
| **LLM** | GPT-4 / Claude | State-of-the-art reasoning |
| **Hosting** | AWS / GCP | Reliable, full-featured, scalable |

---

## Future Enhancements (Post-Hackathon)

### Phase 2 Features
- [ ] Mobile app (React Native)
- [ ] Browser extension (Chrome/Firefox)
- [ ] Real-time collaboration (multiple analysts)
- [ ] Advanced analytics (time-series forecasting)
- [ ] Multilingual support (Hindi, Marathi, Bengali, etc.)

### Phase 3 Features
- [ ] On-device detection (mobile SDK)
- [ ] Blockchain-based evidence storage
- [ ] Federated learning (privacy-preserving)
- [ ] Integration with fact-checking APIs
- [ ] Public API marketplace

---

## Summary

EchoBreaker's architecture is designed for:
- ✅ **Scalability**: Microservices, message queues, horizontal scaling
- ✅ **Reliability**: Redundancy, failover, monitoring
- ✅ **Performance**: Caching, CDN, optimized queries
- ✅ **Security**: Encryption, RBAC, audit logs
- ✅ **Maintainability**: Modular design, IaC, CI/CD

**Status**: Architecture designed, frontend complete, backend to be implemented.

---

**Last Updated**: October 16, 2025  
**Version**: 1.0

<!-- EchoBreaker Sentinel (AI-03) -->
