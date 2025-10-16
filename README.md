# EchoBreaker 🚨

<div align="center">

![EchoBreaker Logo](https://img.shields.io/badge/EchoBreaker-Agentic%20AI-blue?style=for-the-badge)
![Status](https://img.shields.io/badge/Status-In%20Development-yellow?style=for-the-badge)
![Competition](https://img.shields.io/badge/Mumbai%20Hacks-2025-orange?style=for-the-badge)

**Autonomous Detection of Deepfakes & Coordinated Propaganda Operations**

An agentic multimodal AI system that continuously monitors social media, detects synthetic media, maps propagation networks, and generates actionable incident reports for journalists and fact-checkers.

[🎯 Problem Statement](./docs/PROBLEM_STATEMENT.md) • [🛠️ Tech Stack](./docs/TECH_STACK.md) • [📊 Analysis](./docs/PROJECT_ANALYSIS.md) • [✅ MVP Checklist](./docs/MVP_CHECKLIST.md)

</div>

---

## 🌟 The Problem

Adversaries exploit digital platforms with **deepfake videos, voice clones, and coordinated bot networks** to spread misinformation at scale. Traditional fact-checking reacts too slowly, and most systems miss **coordinated campaigns** — where separate actors amplify narratives together.

During crises (elections, health emergencies, conflicts), these operations cause:
- 🔥 Violence and social unrest
- 🗳️ Electoral interference
- 📰 Suppression of truth
- 💰 Economic manipulation

**EchoBreaker** detects these operations **before they spread**, providing early warnings to media and defenders.

---

## 💡 Our Solution

EchoBreaker is an **agentic AI system** with 6 autonomous agents working 24/7:

1. **🔍 Continuous Monitoring Agent** — Tracks trending topics and spikes across platforms
2. **🎭 Multimodal Deepfake Detector** — Analyzes video, audio, images, and text
3. **🕸️ Coordination Detection Agent** — Maps propagation networks using Graph Neural Networks
4. **🔎 Causality & Attribution Agent** — Traces origins and identifies coordinating actors
5. **📊 Response & Reporting Agent** — Generates incident reports and alerts
6. **🧠 Self-Improving Agent** — Learns from human feedback and retrains models

### Key Features

- ✅ **Real-time monitoring** across X, YouTube, Telegram, Reddit, RSS feeds
- ✅ **Multimodal detection**: Video frame analysis, audio spectrograms, text verification
- ✅ **Network forensics**: Interactive propagation graphs, cluster detection
- ✅ **Incident reports**: Downloadable PDFs with evidence, timelines, and risk scores
- ✅ **Human-in-the-loop**: Reviewer annotation interface for feedback
- ✅ **Explainable AI**: Natural language explanations for every detection

---

## 🖥️ Pages & Screenshots

### 1. Landing Page
Professional entry with problem statement, solution overview, and CTA

### 2. Real-time Dashboard
Live monitoring feed, statistics, trending threats, and agent status

### 3. Network Analysis
Interactive graph visualization showing coordinated account clusters

### 4. Incidents
Detailed incident reports with evidence, confidence scores, and timelines

### 5. Alerts Center
Real-time notification system with filtering and prioritization

### 6. AI Agents
Monitor autonomous agents with task status, accuracy metrics, and logs

### 7. Analytics
Geographic distribution, trending topics, and export capabilities

### 8. Settings
Configuration for alert thresholds, webhooks, and platform integrations

---

## 🛠️ Tech Stack

### Frontend (Current)
- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite
- **UI Library**: Shadcn/ui (Radix UI)
- **Styling**: Tailwind CSS
- **State Management**: TanStack Query
- **Routing**: React Router v6

### Backend (Planned)
- **API**: FastAPI (Python) or Express.js (Node.js)
- **AI/ML**: 
  - Vision Transformers (deepfake detection)
  - Graph Neural Networks (coordination detection)
  - LangChain/LangGraph (reasoning & reporting)
- **Databases**:
  - PostgreSQL (structured data)
  - MongoDB (metadata)
  - Neo4j (network graphs)
  - Pinecone/FAISS (vector embeddings)
- **Real-time**: WebSocket (Socket.io)
- **Storage**: AWS S3 / MinIO

See full tech stack: [TECH_STACK.md](./docs/TECH_STACK.md)

---

## 🚀 Quick Start

### Prerequisites
```bash
Node.js >= 18.x
npm or bun
Git
```

### Installation

```bash
# Clone the repository
git clone https://github.com/aaryan2720/echo-sentinel-agent.git

# Navigate to project directory
cd echo-sentinel-agent

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:5173`

### Build for Production
```bash
npm run build
npm run preview
```

---

## 📁 Project Structure

```
echo-sentinel-agent/
├── docs/                      # 📚 Documentation
│   ├── PROBLEM_STATEMENT.md  # Problem definition
│   ├── TECH_STACK.md         # Technical specifications
│   ├── PROJECT_ANALYSIS.md   # Gap analysis & recommendations
│   └── MVP_CHECKLIST.md      # Implementation roadmap
├── src/
│   ├── pages/               # 8 main pages
│   │   ├── Landing.tsx      # Home page
│   │   ├── Dashboard.tsx    # Main dashboard
│   │   ├── Network.tsx      # Network analysis
│   │   ├── Incidents.tsx    # Incident reports
│   │   ├── Alerts.tsx       # Alert center
│   │   ├── Agents.tsx       # AI agents monitor
│   │   ├── Analytics.tsx    # Analytics & trends
│   │   └── Settings.tsx     # Configuration
│   ├── components/          # Reusable UI components
│   │   ├── ui/             # Shadcn components
│   │   ├── HeroSection.tsx
│   │   ├── NetworkGraph.tsx
│   │   ├── MonitoringDashboard.tsx
│   │   └── ...
│   ├── integrations/        # External services
│   ├── hooks/              # Custom React hooks
│   └── lib/                # Utilities
└── public/                 # Static assets
```

---

## 📊 Current Status

### ✅ Completed (Frontend)
- [x] 8 fully functional pages
- [x] Responsive UI with Tailwind CSS
- [x] Component library (Shadcn/ui)
- [x] Routing and navigation
- [x] Mock data structures
- [x] Design system and animations

### 🚧 In Progress
- [ ] Backend API implementation
- [ ] Detection services integration
- [ ] Real-time WebSocket connections
- [ ] PDF report generation
- [ ] Interactive network graphs (D3.js/React Flow)
- [ ] Demo scenarios with working data flow

### 🎯 Completion: ~65%
- Frontend: **95%** complete
- Backend: **0%** complete
- Demo Readiness: **40%** complete

---

## 🎯 MVP Checklist for Mumbai Hacks

### Phase 1: Backend Foundation (6-8 hours)
- [ ] FastAPI setup with core endpoints
- [ ] PostgreSQL database models
- [ ] WebSocket for real-time updates

### Phase 2: AI/ML Integration (4-6 hours)
- [ ] Mock/real detection services
- [ ] Network analysis algorithms
- [ ] Report generation logic

### Phase 3: Frontend Integration (3-4 hours)
- [ ] Connect pages to API
- [ ] Real-time data updates
- [ ] Loading and error states

### Phase 4: Key Features (6-8 hours)
- [ ] Media upload & analysis flow
- [ ] PDF report generation
- [ ] Interactive network graph
- [ ] Video/audio players with forensics

### Phase 5: Demo Scenarios (3-4 hours)
- [ ] 3-4 complete end-to-end scenarios
- [ ] Database seeding with realistic data
- [ ] Test all user journeys

**Total Time Estimate**: 30-35 hours over 48 hours

Full checklist: [MVP_CHECKLIST.md](./docs/MVP_CHECKLIST.md)

---

## 🎬 Demo Scenarios

### Scenario 1: Political Deepfake Detection
- Upload deepfake video
- Show frame-by-frame analysis
- Display network of 187 coordinated accounts
- Generate PDF incident report

### Scenario 2: Audio Clone Campaign
- Detect synthetic voice impersonation
- Map cross-platform amplification
- Show timing synchronization
- Alert newsroom via webhook

### Scenario 3: Coordinated Meme Network
- Identify doctored image spread
- Reveal 234 coordinated bot accounts
- Display reused content hashes
- Suggest debunk message

---

## 👥 Target Users

- **Journalists** — Rapid alerts with evidence for investigation
- **Fact-checkers** — Structured incident dossiers
- **Platform safety teams** — Priority moderation signals
- **Election authorities** — Situational awareness during campaigns
- **Public agencies** — Early warning for crisis response

---

## 📈 Impact & Use Cases

### During Elections
- Detect coordinated disinformation before viral spread
- Provide evidence for electoral commission investigations
- Enable media to debunk false claims quickly

### Health Crises
- Identify medical misinformation campaigns
- Track vaccine/treatment conspiracy networks
- Support public health communication

### Social Conflicts
- Detect inflammatory deepfakes during tensions
- Map coordination between provocateur accounts
- Prevent violence escalation

---

## 🏆 Competition: Mumbai Hacks 2025

### Why This Project Matters
Mumbai and India face significant challenges with coordinated misinformation during elections, civic issues, and social tensions. EchoBreaker provides a much-needed technological defense.

### Innovation Points
- **Agentic architecture** — Autonomous AI agents, not just detection
- **Network-level analysis** — Goes beyond individual posts
- **Multimodal fusion** — Video + Audio + Image + Text together
- **Explainable forensics** — Human-readable evidence chains
- **Real-world impact** — Directly addresses election/crisis needs

---

## 📚 Documentation

Complete documentation is available in the `/docs` folder:

- **[PROBLEM_STATEMENT.md](./docs/PROBLEM_STATEMENT.md)** — Full problem definition
- **[TECH_STACK.md](./docs/TECH_STACK.md)** — Technical architecture
- **[PROJECT_ANALYSIS.md](./docs/PROJECT_ANALYSIS.md)** — Gap analysis & recommendations
- **[MVP_CHECKLIST.md](./docs/MVP_CHECKLIST.md)** — Implementation roadmap

---

## 🤝 Contributing

This is a hackathon project for Mumbai Hacks 2025. Development is currently focused on the competition deadline.

---

## 📄 License

[MIT License](./LICENSE) (or specify your license)

---

## 👨‍💻 Team

**Project Lead**: aaryan2720  
**Repository**: [echo-sentinel-agent](https://github.com/aaryan2720/echo-sentinel-agent)  
**Competition**: Mumbai Hacks 2025

---

## 🔗 Links

- **Live Demo**: [Coming Soon]
- **Pitch Deck**: [Coming Soon]
- **Demo Video**: [Coming Soon]
- **Devfolio**: [Coming Soon]

---

<div align="center">

**Built with ❤️ for a safer digital future**

⭐ Star this repo if you believe in fighting misinformation with AI!

</div>
