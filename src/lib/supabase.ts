import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables! Please check your .env file.')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// =====================================================
// TypeScript Types for Database Tables
// =====================================================

export type Agent = {
  id: string
  name: string
  type: 'monitor' | 'detector' | 'analyzer' | 'verifier' | 'reporter' | 'coordinator'
  status: 'idle' | 'processing' | 'complete' | 'error'
  description: string
  capabilities: string[]
  tasks_completed: number
  current_task?: string
  last_active: string
  metadata?: Record<string, any>
  created_at: string
  updated_at: string
}

export type Incident = {
  id: string
  incident_id: string
  title: string
  description: string
  platform: string[]
  severity: 'critical' | 'high' | 'medium' | 'low'
  status: 'active' | 'investigating' | 'resolved' | 'dismissed'
  confidence_score: number
  accounts_involved: number
  reach_estimate: string
  evidence_count: number
  media_type: 'video' | 'audio' | 'image' | 'text'
  media_url?: string
  detected_at: string
  incident_timestamp?: string
  resolved_at?: string
  detected_by_agent_id?: string
  metadata?: Record<string, any>
  created_at: string
  updated_at: string
}

export type MediaFile = {
  id: string
  incident_id: string
  file_name: string
  file_type: 'video' | 'audio' | 'image'
  file_size?: number
  mime_type?: string
  storage_path: string
  public_url?: string
  thumbnail_url?: string
  duration?: number
  resolution?: string
  format?: string
  analyzed: boolean
  analysis_result?: Record<string, any>
  uploaded_at: string
  created_at: string
  updated_at: string
}

export type Detection = {
  id: string
  incident_id: string
  agent_id?: string
  media_file_id?: string
  detection_type: string
  confidence_score: number
  timestamp_in_media?: number
  result: Record<string, any>
  description?: string
  verified: boolean
  false_positive: boolean
  detected_at: string
  created_at: string
  updated_at: string
}

export type NetworkNode = {
  id: string
  account_id: string
  platform: string
  username?: string
  display_name?: string
  profile_image_url?: string
  bio?: string
  follower_count?: number
  following_count?: number
  account_created_at?: string
  threat_level?: 'high' | 'medium' | 'low' | 'unknown'
  bot_probability?: number
  is_verified: boolean
  post_count: number
  last_activity?: string
  incidents_involved?: string[]
  metadata?: Record<string, any>
  created_at: string
  updated_at: string
}

export type NetworkEdge = {
  id: string
  source_node_id: string
  target_node_id: string
  relationship_type: string
  strength: number
  interaction_count: number
  last_interaction?: string
  incidents_involved?: string[]
  metadata?: Record<string, any>
  created_at: string
  updated_at: string
}

export type ReviewQueueItem = {
  id: string
  incident_id: string
  detection_id?: string
  priority: 'critical' | 'high' | 'medium' | 'low'
  status: 'pending' | 'in-review' | 'approved' | 'rejected' | 'needs-info'
  assigned_to?: string
  assigned_at?: string
  review_notes?: string
  rejection_reason?: string
  decision?: 'approve' | 'reject' | 'escalate'
  decision_metadata?: Record<string, any>
  submitted_at: string
  reviewed_at?: string
  created_at: string
  updated_at: string
}

export type EvidenceChain = {
  id: string
  incident_id: string
  evidence_type: string
  evidence_source?: string
  evidence_data: Record<string, any>
  hash?: string
  previous_evidence_id?: string
  collected_at: string
  created_at: string
}

// =====================================================
// Helper Functions
// =====================================================

/**
 * Fetch all agents with their current status
 */
export async function getAgents() {
  const { data, error } = await supabase
    .from('agents')
    .select('*')
    .order('name')
  
  if (error) throw error
  return data as Agent[]
}

/**
 * Fetch recent incidents with pagination
 */
export async function getIncidents(limit = 10, offset = 0) {
  const { data, error } = await supabase
    .from('incidents')
    .select('*')
    .order('detected_at', { ascending: false })
    .range(offset, offset + limit - 1)
  
  if (error) throw error
  return data as Incident[]
}

/**
 * Fetch a single incident by ID with all related data
 */
export async function getIncidentById(id: string) {
  const { data, error } = await supabase
    .from('incidents')
    .select(`
      *,
      detections(*),
      media_files(*),
      review_queue(*)
    `)
    .eq('id', id)
    .single()
  
  if (error) throw error
  return data
}

/**
 * Fetch network nodes and edges for graph visualization
 */
export async function getNetworkGraph() {
  const [nodesResult, edgesResult] = await Promise.all([
    supabase.from('network_nodes').select('*'),
    supabase.from('network_edges').select('*')
  ])
  
  if (nodesResult.error) throw nodesResult.error
  if (edgesResult.error) throw edgesResult.error
  
  return {
    nodes: nodesResult.data as NetworkNode[],
    edges: edgesResult.data as NetworkEdge[]
  }
}

/**
 * Fetch review queue items
 */
export async function getReviewQueue(status?: ReviewQueueItem['status']) {
  let query = supabase
    .from('review_queue')
    .select(`
      *,
      incidents(*)
    `)
    .order('submitted_at', { ascending: false })
  
  if (status) {
    query = query.eq('status', status)
  }
  
  const { data, error } = await query
  if (error) throw error
  return data
}

/**
 * Update agent status
 */
export async function updateAgentStatus(
  agentId: string, 
  status: Agent['status'], 
  currentTask?: string
) {
  const { data, error } = await supabase
    .from('agents')
    .update({ 
      status, 
      current_task: currentTask,
      last_active: new Date().toISOString()
    })
    .eq('id', agentId)
    .select()
  
  if (error) throw error
  return data
}

/**
 * Create a new incident
 */
export async function createIncident(incident: Partial<Incident>) {
  const { data, error } = await supabase
    .from('incidents')
    .insert([incident])
    .select()
  
  if (error) throw error
  return data[0] as Incident
}

/**
 * Upload media file to Supabase Storage
 */
export async function uploadMediaFile(
  file: File,
  bucket: 'media-evidence' | 'generated-reports' = 'media-evidence'
) {
  const fileExt = file.name.split('.').pop()
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
  const filePath = `${fileName}`

  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(filePath, file)

  if (error) throw error

  // Get public URL
  const { data: { publicUrl } } = supabase.storage
    .from(bucket)
    .getPublicUrl(filePath)

  return {
    path: data.path,
    publicUrl
  }
}

/**
 * Subscribe to real-time changes on a table
 */
export function subscribeToTable(
  table: string,
  callback: (payload: any) => void
) {
  const subscription = supabase
    .channel(`${table}_changes`)
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table },
      callback
    )
    .subscribe()

  return subscription
}

/**
 * Test database connection
 */
export async function testConnection() {
  try {
    const { data, error } = await supabase
      .from('agents')
      .select('count')
      .limit(1)
    
    if (error) throw error
    return { success: true, message: 'Connected to Supabase!' }
  } catch (error) {
    return { 
      success: false, 
      message: error instanceof Error ? error.message : 'Connection failed' 
    }
  }
}
