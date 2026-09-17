-- =====================================================
-- EchoBreaker Database Schema
-- Mumbai Hacks 2025
-- Created: October 19, 2025
-- =====================================================

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm"; -- For text search

-- =====================================================
-- 1. AGENTS TABLE
-- Tracks the 6 AI agents and their current status
-- =====================================================
CREATE TABLE agents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL UNIQUE,
    type VARCHAR(50) NOT NULL, -- 'monitor', 'detector', 'analyzer', 'verifier', 'reporter', 'coordinator'
    status VARCHAR(20) DEFAULT 'idle', -- 'idle', 'processing', 'complete', 'error'
    description TEXT,
    capabilities JSONB, -- Array of capabilities
    tasks_completed INTEGER DEFAULT 0,
    current_task TEXT,
    last_active TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for faster agent queries
CREATE INDEX idx_agents_status ON agents(status);
CREATE INDEX idx_agents_type ON agents(type);

-- =====================================================
-- 2. INCIDENTS TABLE
-- Main table for detected deepfake incidents
-- =====================================================
CREATE TABLE incidents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    incident_id VARCHAR(50) UNIQUE NOT NULL, -- e.g., "INC-2024-001"
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    platform VARCHAR(50)[], -- Array: ['X', 'Telegram', 'YouTube']
    severity VARCHAR(20) NOT NULL, -- 'critical', 'high', 'medium', 'low'
    status VARCHAR(20) DEFAULT 'active', -- 'active', 'investigating', 'resolved', 'dismissed'
    confidence_score INTEGER CHECK (confidence_score >= 0 AND confidence_score <= 100),
    
    -- Metrics
    accounts_involved INTEGER DEFAULT 0,
    reach_estimate VARCHAR(20), -- e.g., "2.4M"
    evidence_count INTEGER DEFAULT 0,
    
    -- Media info
    media_type VARCHAR(20), -- 'video', 'audio', 'image', 'text'
    media_url TEXT,
    
    -- Timestamps
    detected_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    incident_timestamp TIMESTAMP WITH TIME ZONE,
    resolved_at TIMESTAMP WITH TIME ZONE,
    
    -- Relationships
    detected_by_agent_id UUID REFERENCES agents(id),
    
    -- Additional data
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for faster queries
CREATE INDEX idx_incidents_status ON incidents(status);
CREATE INDEX idx_incidents_severity ON incidents(severity);
CREATE INDEX idx_incidents_detected_at ON incidents(detected_at DESC);
CREATE INDEX idx_incidents_confidence ON incidents(confidence_score DESC);
CREATE INDEX idx_incidents_platform ON incidents USING GIN(platform);

-- =====================================================
-- 3. MEDIA_FILES TABLE
-- Stores information about uploaded media evidence
-- =====================================================
CREATE TABLE media_files (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    incident_id UUID REFERENCES incidents(id) ON DELETE CASCADE,
    
    -- File info
    file_name VARCHAR(255) NOT NULL,
    file_type VARCHAR(50) NOT NULL, -- 'video', 'audio', 'image'
    file_size BIGINT, -- in bytes
    mime_type VARCHAR(100),
    
    -- Storage
    storage_path TEXT NOT NULL, -- Path in Supabase Storage
    public_url TEXT, -- Public URL for access
    thumbnail_url TEXT,
    
    -- Media metadata
    duration INTEGER, -- For video/audio (in seconds)
    resolution VARCHAR(20), -- e.g., "1920x1080"
    format VARCHAR(20), -- e.g., "MP4", "MP3", "JPEG"
    
    -- Analysis metadata
    analyzed BOOLEAN DEFAULT FALSE,
    analysis_result JSONB,
    
    -- Timestamps
    uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_media_files_incident ON media_files(incident_id);
CREATE INDEX idx_media_files_type ON media_files(file_type);
CREATE INDEX idx_media_files_analyzed ON media_files(analyzed);

-- =====================================================
-- 4. DETECTIONS TABLE
-- Individual detection results from AI agents
-- =====================================================
CREATE TABLE detections (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    incident_id UUID REFERENCES incidents(id) ON DELETE CASCADE,
    agent_id UUID REFERENCES agents(id),
    media_file_id UUID REFERENCES media_files(id) ON DELETE CASCADE,
    
    -- Detection details
    detection_type VARCHAR(50) NOT NULL, -- 'face-manipulation', 'lip-sync-mismatch', 'audio-anomaly', 'artifact'
    confidence_score FLOAT CHECK (confidence_score >= 0 AND confidence_score <= 1),
    timestamp_in_media FLOAT, -- Position in video/audio (seconds)
    
    -- Results
    result JSONB NOT NULL, -- Detailed detection data
    description TEXT,
    
    -- Status
    verified BOOLEAN DEFAULT FALSE,
    false_positive BOOLEAN DEFAULT FALSE,
    
    -- Timestamps
    detected_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_detections_incident ON detections(incident_id);
CREATE INDEX idx_detections_agent ON detections(agent_id);
CREATE INDEX idx_detections_confidence ON detections(confidence_score DESC);
CREATE INDEX idx_detections_type ON detections(detection_type);

-- =====================================================
-- 5. NETWORK_NODES TABLE
-- Represents accounts/entities in the coordination network
-- =====================================================
CREATE TABLE network_nodes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Account info
    account_id VARCHAR(100) NOT NULL, -- Platform-specific ID
    platform VARCHAR(50) NOT NULL, -- 'X', 'Telegram', 'YouTube', etc.
    username VARCHAR(100),
    display_name VARCHAR(255),
    
    -- Profile
    profile_image_url TEXT,
    bio TEXT,
    follower_count INTEGER,
    following_count INTEGER,
    account_created_at TIMESTAMP WITH TIME ZONE,
    
    -- Analysis
    threat_level VARCHAR(20), -- 'high', 'medium', 'low', 'unknown'
    bot_probability FLOAT, -- 0.0 to 1.0
    is_verified BOOLEAN DEFAULT FALSE,
    
    -- Activity
    post_count INTEGER DEFAULT 0,
    last_activity TIMESTAMP WITH TIME ZONE,
    
    -- Relationships
    incidents_involved UUID[], -- Array of incident IDs
    
    -- Metadata
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Unique constraint
    UNIQUE(account_id, platform)
);

-- Indexes
CREATE INDEX idx_network_nodes_platform ON network_nodes(platform);
CREATE INDEX idx_network_nodes_threat ON network_nodes(threat_level);
CREATE INDEX idx_network_nodes_bot_prob ON network_nodes(bot_probability DESC);
CREATE INDEX idx_network_nodes_incidents ON network_nodes USING GIN(incidents_involved);

-- =====================================================
-- 6. NETWORK_EDGES TABLE
-- Represents connections between accounts (coordination)
-- =====================================================
CREATE TABLE network_edges (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Connection
    source_node_id UUID REFERENCES network_nodes(id) ON DELETE CASCADE,
    target_node_id UUID REFERENCES network_nodes(id) ON DELETE CASCADE,
    
    -- Relationship
    relationship_type VARCHAR(50), -- 'follows', 'mentions', 'retweets', 'coordinates_with'
    strength FLOAT DEFAULT 0.5, -- 0.0 to 1.0 (connection strength)
    
    -- Evidence
    interaction_count INTEGER DEFAULT 0,
    last_interaction TIMESTAMP WITH TIME ZONE,
    
    -- Related incidents
    incidents_involved UUID[], -- Array of incident IDs
    
    -- Metadata
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Prevent duplicate edges
    UNIQUE(source_node_id, target_node_id, relationship_type)
);

-- Indexes
CREATE INDEX idx_network_edges_source ON network_edges(source_node_id);
CREATE INDEX idx_network_edges_target ON network_edges(target_node_id);
CREATE INDEX idx_network_edges_strength ON network_edges(strength DESC);
CREATE INDEX idx_network_edges_incidents ON network_edges USING GIN(incidents_involved);

-- =====================================================
-- 7. REVIEW_QUEUE TABLE
-- Human review workflow for uncertain detections
-- =====================================================
CREATE TABLE review_queue (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    incident_id UUID REFERENCES incidents(id) ON DELETE CASCADE,
    detection_id UUID REFERENCES detections(id) ON DELETE CASCADE,
    
    -- Queue info
    priority VARCHAR(20) DEFAULT 'medium', -- 'critical', 'high', 'medium', 'low'
    status VARCHAR(30) DEFAULT 'pending', -- 'pending', 'in-review', 'approved', 'rejected', 'needs-info'
    
    -- Assignment
    assigned_to UUID, -- User ID who is reviewing
    assigned_at TIMESTAMP WITH TIME ZONE,
    
    -- Review details
    review_notes TEXT,
    rejection_reason VARCHAR(100),
    decision VARCHAR(20), -- 'approve', 'reject', 'escalate'
    decision_metadata JSONB,
    
    -- Timestamps
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    reviewed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_review_queue_status ON review_queue(status);
CREATE INDEX idx_review_queue_priority ON review_queue(priority);
CREATE INDEX idx_review_queue_assigned ON review_queue(assigned_to);
CREATE INDEX idx_review_queue_submitted ON review_queue(submitted_at DESC);

-- =====================================================
-- 8. EVIDENCE_CHAIN TABLE
-- Forensic evidence tracking for audit trail
-- =====================================================
CREATE TABLE evidence_chain (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    incident_id UUID REFERENCES incidents(id) ON DELETE CASCADE,
    
    -- Evidence info
    evidence_type VARCHAR(50) NOT NULL, -- 'detection', 'media_analysis', 'network_analysis', 'manual_review'
    evidence_source VARCHAR(100), -- Agent name or reviewer
    
    -- Data
    evidence_data JSONB NOT NULL, -- Detailed evidence information
    hash VARCHAR(64), -- SHA-256 hash for integrity
    
    -- Chain
    previous_evidence_id UUID REFERENCES evidence_chain(id),
    
    -- Timestamps
    collected_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_evidence_chain_incident ON evidence_chain(incident_id);
CREATE INDEX idx_evidence_chain_type ON evidence_chain(evidence_type);
CREATE INDEX idx_evidence_chain_collected ON evidence_chain(collected_at DESC);

-- =====================================================
-- TRIGGERS FOR UPDATED_AT TIMESTAMPS
-- =====================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to all tables with updated_at
CREATE TRIGGER update_agents_updated_at BEFORE UPDATE ON agents
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_incidents_updated_at BEFORE UPDATE ON incidents
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_media_files_updated_at BEFORE UPDATE ON media_files
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_detections_updated_at BEFORE UPDATE ON detections
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_network_nodes_updated_at BEFORE UPDATE ON network_nodes
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_network_edges_updated_at BEFORE UPDATE ON network_edges
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_review_queue_updated_at BEFORE UPDATE ON review_queue
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- COMMENTS FOR DOCUMENTATION
-- =====================================================
COMMENT ON TABLE agents IS 'AI agents that perform detection and analysis tasks';
COMMENT ON TABLE incidents IS 'Detected deepfake incidents with metadata';
COMMENT ON TABLE media_files IS 'Uploaded media files (videos, images, audio) for analysis';
COMMENT ON TABLE detections IS 'Individual detection results from AI agents';
COMMENT ON TABLE network_nodes IS 'Social media accounts involved in coordination networks';
COMMENT ON TABLE network_edges IS 'Connections and relationships between accounts';
COMMENT ON TABLE review_queue IS 'Human review queue for uncertain detections';
COMMENT ON TABLE evidence_chain IS 'Forensic evidence chain for audit trail';

-- =====================================================
-- SUCCESS MESSAGE
-- =====================================================
DO $$
BEGIN
    RAISE NOTICE '✅ Database schema created successfully!';
    RAISE NOTICE '📊 8 tables created: agents, incidents, media_files, detections, network_nodes, network_edges, review_queue, evidence_chain';
    RAISE NOTICE '🔒 Row Level Security policies should be configured next';
    RAISE NOTICE '📦 Storage buckets should be created: media-evidence, generated-reports';
END $$;
