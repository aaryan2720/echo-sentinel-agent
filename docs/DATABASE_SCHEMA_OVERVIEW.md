# 📊 EchoBreaker Database Schema - Visual Overview

## 🗂️ Database Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                      ECHOBREAKER DATABASE                        │
│                    (Supabase PostgreSQL)                         │
└─────────────────────────────────────────────────────────────────┘
                                 │
        ┌────────────────────────┼────────────────────────┐
        │                        │                        │
        ▼                        ▼                        ▼
┌──────────────┐        ┌──────────────┐        ┌──────────────┐
│   AGENTS     │        │  INCIDENTS   │        │ NETWORK_NODES│
│              │        │              │        │              │
│ • Monitor    │───────>│ • INC-001   │<───────│ • acc_001   │
│ • Detector   │        │ • INC-002   │        │ • acc_002   │
│ • Analyzer   │        │ • INC-003   │        │ • acc_003   │
│ • Verifier   │        │ • INC-004   │        │   ...       │
│ • Reporter   │        │ • INC-005   │        │              │
│ • Coordinator│        │              │        └──────┬───────┘
└──────┬───────┘        └──────┬───────┘               │
       │                       │                        │
       │                       │                        ▼
       │                       │               ┌──────────────┐
       │                       │               │NETWORK_EDGES │
       │                       │               │              │
       │                       │               │ Connections  │
       │                       │               │ between      │
       │                       │               │ accounts     │
       │                       │               └──────────────┘
       │                       │
       │                       ├──────────────────────┐
       │                       │                      │
       ▼                       ▼                      ▼
┌──────────────┐        ┌──────────────┐    ┌──────────────┐
│  DETECTIONS  │        │ MEDIA_FILES  │    │ REVIEW_QUEUE │
│              │        │              │    │              │
│ AI detection │        │ Videos       │    │ Human review │
│ results      │        │ Images       │    │ workflow     │
│              │        │ Audio        │    │              │
└──────────────┘        └──────────────┘    └──────────────┘
                                                     │
                                                     │
                                                     ▼
                                            ┌──────────────┐
                                            │EVIDENCE_CHAIN│
                                            │              │
                                            │ Forensic     │
                                            │ audit trail  │
                                            └──────────────┘
```

---

## 📋 Table Details

### 1️⃣ **AGENTS** (6 rows)
**Purpose**: Track AI agents and their status

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| name | VARCHAR(100) | Agent name (e.g., "Monitor Agent") |
| type | VARCHAR(50) | Agent type: monitor, detector, analyzer, verifier, reporter, coordinator |
| status | VARCHAR(20) | Current status: idle, processing, complete, error |
| description | TEXT | What the agent does |
| capabilities | JSONB | Array of capabilities |
| tasks_completed | INTEGER | Total tasks completed |
| current_task | TEXT | What it's working on now |

**Sample Data**:
```json
{
  "name": "Detector Agent",
  "type": "detector",
  "status": "processing",
  "tasks_completed": 423,
  "current_task": "Analyzing video"
}
```

---

### 2️⃣ **INCIDENTS** (5 rows)
**Purpose**: Main table for detected deepfake incidents

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| incident_id | VARCHAR(50) | Human-readable ID (e.g., "INC-2024-001") |
| title | VARCHAR(255) | Incident title |
| description | TEXT | Detailed description |
| platform | VARCHAR(50)[] | Array: ['X', 'Telegram', 'YouTube'] |
| severity | VARCHAR(20) | critical, high, medium, low |
| status | VARCHAR(20) | active, investigating, resolved, dismissed |
| confidence_score | INTEGER | 0-100 detection confidence |
| accounts_involved | INTEGER | Number of accounts spreading |
| reach_estimate | VARCHAR(20) | e.g., "2.4M" |
| media_type | VARCHAR(20) | video, audio, image, text |
| media_url | TEXT | URL to media file |

**Sample Data**:
```json
{
  "incident_id": "INC-2024-001",
  "title": "Political Deepfake Video Campaign",
  "severity": "critical",
  "confidence_score": 96,
  "accounts_involved": 187,
  "platforms": ["X", "Telegram", "YouTube"]
}
```

---

### 3️⃣ **MEDIA_FILES** (0 rows initially)
**Purpose**: Store uploaded media evidence

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| incident_id | UUID | Foreign key to incidents |
| file_name | VARCHAR(255) | Original filename |
| file_type | VARCHAR(50) | video, audio, image |
| storage_path | TEXT | Path in Supabase Storage |
| public_url | TEXT | Public access URL |
| duration | INTEGER | For video/audio (seconds) |
| resolution | VARCHAR(20) | e.g., "1920x1080" |
| analyzed | BOOLEAN | Has AI analyzed it? |
| analysis_result | JSONB | Detection results |

---

### 4️⃣ **DETECTIONS** (3 rows)
**Purpose**: Individual AI detection results

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| incident_id | UUID | Foreign key to incidents |
| agent_id | UUID | Which agent detected it |
| detection_type | VARCHAR(50) | face-manipulation, lip-sync-mismatch, audio-anomaly, artifact |
| confidence_score | FLOAT | 0.0 to 1.0 |
| timestamp_in_media | FLOAT | Position in video/audio (seconds) |
| result | JSONB | Detailed detection data |
| description | TEXT | Human-readable explanation |

**Sample Data**:
```json
{
  "detection_type": "face-manipulation",
  "confidence_score": 0.96,
  "timestamp_in_media": 1.5,
  "description": "Facial region shows deep learning manipulation artifacts",
  "result": {
    "method": "CNN-based detection",
    "artifacts_found": ["boundary inconsistencies"]
  }
}
```

---

### 5️⃣ **NETWORK_NODES** (8 rows)
**Purpose**: Social media accounts in coordination network

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| account_id | VARCHAR(100) | Platform-specific ID |
| platform | VARCHAR(50) | X, Telegram, YouTube, etc. |
| username | VARCHAR(100) | @username |
| threat_level | VARCHAR(20) | high, medium, low, unknown |
| bot_probability | FLOAT | 0.0 to 1.0 (how likely a bot) |
| follower_count | INTEGER | Number of followers |
| post_count | INTEGER | Total posts |

**Sample Data**:
```json
{
  "account_id": "acc_001",
  "platform": "X",
  "username": "newsbot_247",
  "threat_level": "high",
  "bot_probability": 0.92
}
```

---

### 6️⃣ **NETWORK_EDGES** (10 rows)
**Purpose**: Connections between accounts

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| source_node_id | UUID | Foreign key to network_nodes |
| target_node_id | UUID | Foreign key to network_nodes |
| relationship_type | VARCHAR(50) | follows, mentions, retweets, coordinates_with |
| strength | FLOAT | 0.0 to 1.0 (connection strength) |
| interaction_count | INTEGER | Number of interactions |

**Sample Data**:
```json
{
  "source": "acc_001",
  "target": "acc_002",
  "relationship_type": "coordinates_with",
  "strength": 0.95,
  "interaction_count": 234
}
```

---

### 7️⃣ **REVIEW_QUEUE** (3 rows)
**Purpose**: Human review workflow

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| incident_id | UUID | Foreign key to incidents |
| priority | VARCHAR(20) | critical, high, medium, low |
| status | VARCHAR(30) | pending, in-review, approved, rejected, needs-info |
| assigned_to | UUID | User ID reviewing |
| review_notes | TEXT | Reviewer's notes |
| decision | VARCHAR(20) | approve, reject, escalate |

---

### 8️⃣ **EVIDENCE_CHAIN** (0 rows initially)
**Purpose**: Forensic audit trail

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| incident_id | UUID | Foreign key to incidents |
| evidence_type | VARCHAR(50) | detection, media_analysis, network_analysis, manual_review |
| evidence_source | VARCHAR(100) | Agent name or reviewer |
| evidence_data | JSONB | Detailed evidence |
| hash | VARCHAR(64) | SHA-256 for integrity |
| previous_evidence_id | UUID | Chain linkage |

---

## 🔒 Security Setup

### Row Level Security (RLS)

```sql
-- Example policy for incidents table
CREATE POLICY "Allow public read access"
ON incidents FOR SELECT
TO public
USING (true);

CREATE POLICY "Allow authenticated insert"
ON incidents FOR INSERT
TO authenticated
WITH CHECK (true);
```

**Access Levels**:
- 🌐 **Public**: Read access to all tables (for demo)
- 🔐 **Authenticated**: Create and update records
- ⚙️ **Service Role**: Full access (backend operations)

---

## 📦 Storage Buckets

### 1. `media-evidence/`
- **Purpose**: Store uploaded videos, images, audio
- **Access**: Public read, authenticated write
- **Limit**: 100MB per file
- **Path structure**: `/{incident_id}/{filename}`

### 2. `generated-reports/`
- **Purpose**: Store PDF incident reports
- **Access**: Public read
- **Limit**: 10MB per file
- **Path structure**: `/{incident_id}/{report_date}.pdf`

---

## 🔗 Relationships

```
agents ──1:N──> incidents
                    │
                    ├──1:N──> detections
                    ├──1:N──> media_files
                    ├──1:N──> review_queue
                    └──1:N──> evidence_chain

network_nodes ──1:N──> network_edges ──N:1──> network_nodes
       │
       └──────────────> incidents (many-to-many via array)
```

---

## 📊 Sample Data Summary

After running seed script:

| Table | Rows | Description |
|-------|------|-------------|
| agents | 6 | All 6 AI agents with status |
| incidents | 5 | Sample deepfake detections |
| media_files | 0 | Empty (populated on upload) |
| detections | 3 | Sample AI detection results |
| network_nodes | 8 | Social media accounts |
| network_edges | 10 | Connections between accounts |
| review_queue | 3 | Items pending human review |
| evidence_chain | 0 | Empty (populated during analysis) |

**Total**: 35 demo records ready for testing!

---

## 🎯 Key Features

✅ **UUID Primary Keys** - Universally unique identifiers  
✅ **JSONB Metadata** - Flexible schema for complex data  
✅ **Timestamp Tracking** - created_at, updated_at on all tables  
✅ **Foreign Key Constraints** - Data integrity enforced  
✅ **Indexes** - Optimized queries on common filters  
✅ **Triggers** - Auto-update timestamps  
✅ **Full Text Search** - pg_trgm extension enabled  

---

## 🚀 Next Steps

After database setup:

1. ✅ **Install Supabase Client** - `npm install @supabase/supabase-js`
2. ✅ **Create API Service** - `src/lib/supabase.ts`
3. ✅ **Test Connection** - Create DatabaseTest page
4. ✅ **Replace Mock Data** - Update components to use real data
5. ✅ **Add Real-time** - Enable Supabase Realtime subscriptions
6. ✅ **Build Backend API** - Express/Fastify for agent orchestration

---

**📚 Full Setup Guide**: See `docs/DATABASE_SETUP.md`  
**⚡ Quick Start**: See `docs/QUICK_DATABASE_SETUP.md`
