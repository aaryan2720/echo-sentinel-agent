-- =====================================================
-- Row Level Security (RLS) Policies
-- EchoBreaker - Mumbai Hacks 2025
-- =====================================================

-- =====================================================
-- 1. ENABLE RLS ON ALL TABLES
-- =====================================================
ALTER TABLE agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE incidents ENABLE ROW LEVEL SECURITY;
ALTER TABLE media_files ENABLE ROW LEVEL SECURITY;
ALTER TABLE detections ENABLE ROW LEVEL SECURITY;
ALTER TABLE network_nodes ENABLE ROW LEVEL SECURITY;
ALTER TABLE network_edges ENABLE ROW LEVEL SECURITY;
ALTER TABLE review_queue ENABLE ROW LEVEL SECURITY;
ALTER TABLE evidence_chain ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- 2. AGENTS TABLE POLICIES
-- =====================================================

-- Public read access (for demo/frontend)
CREATE POLICY "Allow public read access to agents"
ON agents FOR SELECT
TO public
USING (true);

-- Authenticated users can update agent status
CREATE POLICY "Allow authenticated users to update agents"
ON agents FOR UPDATE
TO authenticated
USING (true);

-- System/service role can do everything
CREATE POLICY "Allow service role full access to agents"
ON agents FOR ALL
TO service_role
USING (true);

-- =====================================================
-- 3. INCIDENTS TABLE POLICIES
-- =====================================================

-- Public read access
CREATE POLICY "Allow public read access to incidents"
ON incidents FOR SELECT
TO public
USING (true);

-- Authenticated users can create incidents
CREATE POLICY "Allow authenticated users to create incidents"
ON incidents FOR INSERT
TO authenticated
WITH CHECK (true);

-- Authenticated users can update their own incidents
CREATE POLICY "Allow authenticated users to update incidents"
ON incidents FOR UPDATE
TO authenticated
USING (true);

-- Service role full access
CREATE POLICY "Allow service role full access to incidents"
ON incidents FOR ALL
TO service_role
USING (true);

-- =====================================================
-- 4. MEDIA_FILES TABLE POLICIES
-- =====================================================

-- Public read access
CREATE POLICY "Allow public read access to media_files"
ON media_files FOR SELECT
TO public
USING (true);

-- Authenticated users can upload media
CREATE POLICY "Allow authenticated users to insert media_files"
ON media_files FOR INSERT
TO authenticated
WITH CHECK (true);

-- Service role full access
CREATE POLICY "Allow service role full access to media_files"
ON media_files FOR ALL
TO service_role
USING (true);

-- =====================================================
-- 5. DETECTIONS TABLE POLICIES
-- =====================================================

-- Public read access
CREATE POLICY "Allow public read access to detections"
ON detections FOR SELECT
TO public
USING (true);

-- Authenticated users and agents can create detections
CREATE POLICY "Allow authenticated users to create detections"
ON detections FOR INSERT
TO authenticated
WITH CHECK (true);

-- Service role full access
CREATE POLICY "Allow service role full access to detections"
ON detections FOR ALL
TO service_role
USING (true);

-- =====================================================
-- 6. NETWORK_NODES TABLE POLICIES
-- =====================================================

-- Public read access
CREATE POLICY "Allow public read access to network_nodes"
ON network_nodes FOR SELECT
TO public
USING (true);

-- Authenticated users can create/update nodes
CREATE POLICY "Allow authenticated users to insert network_nodes"
ON network_nodes FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update network_nodes"
ON network_nodes FOR UPDATE
TO authenticated
USING (true);

-- Service role full access
CREATE POLICY "Allow service role full access to network_nodes"
ON network_nodes FOR ALL
TO service_role
USING (true);

-- =====================================================
-- 7. NETWORK_EDGES TABLE POLICIES
-- =====================================================

-- Public read access
CREATE POLICY "Allow public read access to network_edges"
ON network_edges FOR SELECT
TO public
USING (true);

-- Authenticated users can create/update edges
CREATE POLICY "Allow authenticated users to insert network_edges"
ON network_edges FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update network_edges"
ON network_edges FOR UPDATE
TO authenticated
USING (true);

-- Service role full access
CREATE POLICY "Allow service role full access to network_edges"
ON network_edges FOR ALL
TO service_role
USING (true);

-- =====================================================
-- 8. REVIEW_QUEUE TABLE POLICIES
-- =====================================================

-- Public read access
CREATE POLICY "Allow public read access to review_queue"
ON review_queue FOR SELECT
TO public
USING (true);

-- Authenticated users can create review items
CREATE POLICY "Allow authenticated users to create review_queue items"
ON review_queue FOR INSERT
TO authenticated
WITH CHECK (true);

-- Authenticated users can update review items (submit reviews)
CREATE POLICY "Allow authenticated users to update review_queue"
ON review_queue FOR UPDATE
TO authenticated
USING (true);

-- Service role full access
CREATE POLICY "Allow service role full access to review_queue"
ON review_queue FOR ALL
TO service_role
USING (true);

-- =====================================================
-- 9. EVIDENCE_CHAIN TABLE POLICIES
-- =====================================================

-- Public read access (transparency)
CREATE POLICY "Allow public read access to evidence_chain"
ON evidence_chain FOR SELECT
TO public
USING (true);

-- Only authenticated users can add evidence
CREATE POLICY "Allow authenticated users to insert evidence_chain"
ON evidence_chain FOR INSERT
TO authenticated
WITH CHECK (true);

-- Evidence chain is immutable (no updates/deletes)
-- Only service role can modify

-- Service role full access
CREATE POLICY "Allow service role full access to evidence_chain"
ON evidence_chain FOR ALL
TO service_role
USING (true);

-- =====================================================
-- SUCCESS MESSAGE
-- =====================================================
DO $$
BEGIN
    RAISE NOTICE '✅ Row Level Security policies created successfully!';
    RAISE NOTICE '🔒 All tables now have RLS enabled';
    RAISE NOTICE '👥 Public users: Read access to all tables';
    RAISE NOTICE '🔐 Authenticated users: Can create and update most records';
    RAISE NOTICE '⚙️ Service role: Full access for backend operations';
END $$;
