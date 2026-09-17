-- =====================================================
-- Seed Data for EchoBreaker Demo
-- Mumbai Hacks 2025
-- =====================================================

-- =====================================================
-- 1. INSERT 6 AI AGENTS
-- =====================================================
INSERT INTO agents (name, type, status, description, capabilities, tasks_completed, current_task) VALUES
(
    'Monitor Agent',
    'monitor',
    'processing',
    'Scans social media platforms for suspicious content',
    '["Social media scanning", "Content ingestion", "Real-time monitoring", "Multi-platform support"]'::jsonb,
    847,
    'Scanning Twitter'
),
(
    'Detector Agent',
    'detector',
    'processing',
    'Identifies deepfake content using ML models',
    '["Deepfake detection", "ML-based analysis", "Confidence scoring", "Multi-modal detection"]'::jsonb,
    423,
    'Analyzing video'
),
(
    'Analyzer Agent',
    'analyzer',
    'complete',
    'Performs forensic analysis on detected content',
    '["Forensic analysis", "Metadata extraction", "Pattern recognition", "Evidence collection"]'::jsonb,
    312,
    NULL
),
(
    'Verifier Agent',
    'verifier',
    'processing',
    'Cross-references with databases and fact-checks',
    '["Source verification", "Database cross-reference", "Authenticity checking", "Fact verification"]'::jsonb,
    289,
    'Checking sources'
),
(
    'Reporter Agent',
    'reporter',
    'idle',
    'Generates incident reports and alerts',
    '["Report generation", "PDF export", "Alert notification", "Evidence documentation"]'::jsonb,
    156,
    NULL
),
(
    'Coordinator Agent',
    'coordinator',
    'complete',
    'Orchestrates agent workflow and task distribution',
    '["Workflow orchestration", "Task distribution", "System monitoring", "Agent coordination"]'::jsonb,
    1024,
    NULL
);

-- =====================================================
-- 2. INSERT SAMPLE INCIDENTS
-- =====================================================
INSERT INTO incidents (
    incident_id, title, description, platform, severity, status, 
    confidence_score, accounts_involved, reach_estimate, evidence_count,
    media_type, media_url, detected_at, incident_timestamp
) VALUES
(
    'INC-2024-001',
    'Political Deepfake Video Campaign',
    'Coordinated spread of manipulated video showing false political statement. Detected 187 coordinated accounts amplifying across X and Telegram.',
    ARRAY['X', 'Telegram', 'YouTube'],
    'critical',
    'active',
    96,
    187,
    '2.4M',
    43,
    'video',
    'https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/360/Big_Buck_Bunny_360_10s_1MB.mp4',
    NOW() - INTERVAL '4 hours',
    NOW() - INTERVAL '4 hours'
),
(
    'INC-2024-002',
    'Audio Clone Impersonation',
    'Synthetic voice clone of public figure spreading misinformation about health policy. Audio analysis shows clear synthetic artifacts.',
    ARRAY['WhatsApp', 'Telegram'],
    'high',
    'investigating',
    91,
    92,
    '890K',
    28,
    'audio',
    'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    NOW() - INTERVAL '7 hours',
    NOW() - INTERVAL '7 hours'
),
(
    'INC-2024-003',
    'Coordinated Meme Manipulation Network',
    'Bot network spreading doctored images with false claims. Pattern shows synchronized posting across 234 accounts.',
    ARRAY['X', 'Reddit', 'Facebook'],
    'high',
    'active',
    88,
    234,
    '4.1M',
    67,
    'image',
    'https://images.unsplash.com/photo-1614730321146-b6fa6a46bcb4?w=800',
    NOW() - INTERVAL '9 hours',
    NOW() - INTERVAL '9 hours'
),
(
    'INC-2024-004',
    'Synthetic Profile Cluster',
    'Network of AI-generated profile pictures and bios amplifying specific narratives. GNN detected coordination patterns.',
    ARRAY['X', 'Instagram'],
    'medium',
    'resolved',
    84,
    145,
    '1.2M',
    52,
    'image',
    'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400',
    NOW() - INTERVAL '1 day',
    NOW() - INTERVAL '1 day'
),
(
    'INC-2024-005',
    'Deepfake Celebrity Endorsement',
    'Fabricated video of celebrity endorsing cryptocurrency scam. Voice and facial manipulation detected.',
    ARRAY['YouTube', 'Facebook', 'X'],
    'critical',
    'active',
    98,
    312,
    '5.7M',
    89,
    'video',
    'https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/360/Big_Buck_Bunny_360_10s_1MB.mp4',
    NOW() - INTERVAL '2 hours',
    NOW() - INTERVAL '2 hours'
);

-- =====================================================
-- 3. INSERT NETWORK NODES (Sample Accounts)
-- =====================================================
INSERT INTO network_nodes (
    account_id, platform, username, display_name, 
    threat_level, bot_probability, follower_count, post_count
) VALUES
('acc_001', 'X', 'newsbot_247', 'Breaking News 24/7', 'high', 0.92, 15000, 1247),
('acc_002', 'X', 'truth_seeker_99', 'Truth Seeker', 'high', 0.88, 8900, 892),
('acc_003', 'Telegram', 'channel_real_news', 'Real News Channel', 'medium', 0.65, 45000, 567),
('acc_004', 'X', 'political_voice_1', 'Political Voice', 'high', 0.91, 12300, 1056),
('acc_005', 'YouTube', 'viral_clips_today', 'Viral Clips Today', 'medium', 0.71, 89000, 234),
('acc_006', 'X', 'info_warrior_88', 'Info Warrior', 'high', 0.85, 6700, 945),
('acc_007', 'Facebook', 'news_share_group', 'News Share Group', 'medium', 0.68, 23000, 456),
('acc_008', 'X', 'breaking_updates', 'Breaking Updates', 'high', 0.89, 11200, 1123);

-- =====================================================
-- 4. INSERT NETWORK EDGES (Connections)
-- =====================================================
-- Get node IDs for creating edges
DO $$
DECLARE
    node1_id UUID;
    node2_id UUID;
    node3_id UUID;
    node4_id UUID;
    node5_id UUID;
    node6_id UUID;
    node7_id UUID;
    node8_id UUID;
BEGIN
    -- Get node IDs
    SELECT id INTO node1_id FROM network_nodes WHERE account_id = 'acc_001';
    SELECT id INTO node2_id FROM network_nodes WHERE account_id = 'acc_002';
    SELECT id INTO node3_id FROM network_nodes WHERE account_id = 'acc_003';
    SELECT id INTO node4_id FROM network_nodes WHERE account_id = 'acc_004';
    SELECT id INTO node5_id FROM network_nodes WHERE account_id = 'acc_005';
    SELECT id INTO node6_id FROM network_nodes WHERE account_id = 'acc_006';
    SELECT id INTO node7_id FROM network_nodes WHERE account_id = 'acc_007';
    SELECT id INTO node8_id FROM network_nodes WHERE account_id = 'acc_008';

    -- Create edges
    INSERT INTO network_edges (source_node_id, target_node_id, relationship_type, strength, interaction_count) VALUES
    (node1_id, node2_id, 'coordinates_with', 0.95, 234),
    (node1_id, node4_id, 'retweets', 0.88, 156),
    (node1_id, node8_id, 'mentions', 0.82, 98),
    (node2_id, node4_id, 'coordinates_with', 0.91, 198),
    (node2_id, node6_id, 'retweets', 0.76, 87),
    (node3_id, node5_id, 'mentions', 0.68, 45),
    (node4_id, node6_id, 'coordinates_with', 0.89, 167),
    (node4_id, node8_id, 'retweets', 0.85, 134),
    (node6_id, node8_id, 'coordinates_with', 0.93, 201),
    (node7_id, node3_id, 'mentions', 0.62, 56);
END $$;

-- =====================================================
-- 5. INSERT REVIEW QUEUE ITEMS
-- =====================================================
-- Get incident IDs
DO $$
DECLARE
    inc1_id UUID;
    inc2_id UUID;
    inc3_id UUID;
BEGIN
    SELECT id INTO inc1_id FROM incidents WHERE incident_id = 'INC-2024-001';
    SELECT id INTO inc2_id FROM incidents WHERE incident_id = 'INC-2024-002';
    SELECT id INTO inc3_id FROM incidents WHERE incident_id = 'INC-2024-003';

    INSERT INTO review_queue (incident_id, priority, status, submitted_at) VALUES
    (inc1_id, 'critical', 'pending', NOW() - INTERVAL '2 hours'),
    (inc2_id, 'high', 'in-review', NOW() - INTERVAL '5 hours'),
    (inc3_id, 'medium', 'pending', NOW() - INTERVAL '8 hours');
END $$;

-- =====================================================
-- 6. INSERT SAMPLE DETECTIONS
-- =====================================================
DO $$
DECLARE
    inc1_id UUID;
    agent2_id UUID;
    agent3_id UUID;
BEGIN
    SELECT id INTO inc1_id FROM incidents WHERE incident_id = 'INC-2024-001';
    SELECT id INTO agent2_id FROM agents WHERE name = 'Detector Agent';
    SELECT id INTO agent3_id FROM agents WHERE name = 'Analyzer Agent';

    INSERT INTO detections (
        incident_id, agent_id, detection_type, confidence_score, 
        timestamp_in_media, description, result
    ) VALUES
    (
        inc1_id, agent2_id, 'face-manipulation', 0.96, 1.5,
        'Facial region shows deep learning manipulation artifacts',
        '{"method": "CNN-based detection", "artifacts_found": ["boundary inconsistencies", "unnatural blending"], "model_version": "2.1.0"}'::jsonb
    ),
    (
        inc1_id, agent2_id, 'lip-sync-mismatch', 0.89, 4.2,
        'Lip movements don''t match audio waveform',
        '{"sync_error": 0.34, "confidence": 0.89, "frames_analyzed": 124}'::jsonb
    ),
    (
        inc1_id, agent3_id, 'artifact', 0.74, 7.8,
        'Digital artifacts detected around facial boundaries',
        '{"artifact_type": "compression anomaly", "location": "facial boundary", "severity": "medium"}'::jsonb
    );
END $$;

-- =====================================================
-- SUCCESS MESSAGE
-- =====================================================
DO $$
BEGIN
    RAISE NOTICE '✅ Demo data seeded successfully!';
    RAISE NOTICE '🤖 6 AI agents created';
    RAISE NOTICE '📊 5 sample incidents added';
    RAISE NOTICE '👥 8 network nodes created';
    RAISE NOTICE '🔗 10 network edges established';
    RAISE NOTICE '📝 3 review queue items added';
    RAISE NOTICE '🔍 3 detections recorded';
    RAISE NOTICE '🎯 Database ready for demo!';
END $$;
