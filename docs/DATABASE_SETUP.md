# 🗄️ EchoBreaker Database Setup Guide

## 📋 Overview

This guide will help you set up the Supabase database for EchoBreaker in **30 minutes**.

**What you'll create:**
- ✅ 8 database tables with relationships
- ✅ Row Level Security (RLS) policies
- ✅ 2 storage buckets for media files
- ✅ Authentication configuration
- ✅ Demo data (5 incidents, 6 agents, network graph)

---

## 🚀 Step 1: Create Supabase Project (5 minutes)

### 1.1 Sign Up / Log In
1. Go to [https://supabase.com](https://supabase.com)
2. Click **"Start your project"**
3. Sign in with GitHub (recommended) or email

### 1.2 Create New Project
1. Click **"New Project"**
2. Fill in details:
   - **Name**: `echobreaker` (or your choice)
   - **Database Password**: Generate a strong password (SAVE THIS!)
   - **Region**: Choose closest to you (e.g., `ap-south-1` for India)
   - **Plan**: Free tier is perfect for this project
3. Click **"Create new project"**
4. ⏳ Wait 2-3 minutes for provisioning

---

## 🔑 Step 2: Get Your API Keys (2 minutes)

Once your project is ready:

1. Go to **Settings** > **API** (in left sidebar)
2. You'll see:
   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon public key**: `eyJhbGc...` (long string)
   - **service_role key**: `eyJhbGc...` (keep this SECRET!)

### 2.1 Save to Environment Variables

Create `.env` file in your project root:

```bash
# EchoBreaker Environment Variables

# Supabase Configuration
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGc...your-anon-key
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...your-service-role-key

# App Configuration
VITE_APP_NAME=EchoBreaker
VITE_APP_ENV=development
```

**⚠️ Important:**
- Add `.env` to your `.gitignore` (should already be there)
- Never commit API keys to GitHub!
- Use `VITE_` prefix for frontend environment variables (Vite requirement)

---

## 🗂️ Step 3: Create Database Schema (5 minutes)

### 3.1 Open SQL Editor
1. In Supabase Dashboard, go to **SQL Editor** (left sidebar)
2. Click **"New query"**

### 3.2 Run Schema Migration
1. Copy the contents of `supabase/migrations/001_initial_schema.sql`
2. Paste into the SQL Editor
3. Click **"Run"** (or press `Ctrl+Enter`)
4. ✅ You should see: "Success. No rows returned"

**What this creates:**
- ✅ `agents` table (6 AI agents)
- ✅ `incidents` table (deepfake detections)
- ✅ `media_files` table (uploaded videos/images/audio)
- ✅ `detections` table (AI detection results)
- ✅ `network_nodes` table (social media accounts)
- ✅ `network_edges` table (account connections)
- ✅ `review_queue` table (human review workflow)
- ✅ `evidence_chain` table (forensic audit trail)

### 3.3 Verify Tables Created
1. Go to **Table Editor** (left sidebar)
2. You should see all 8 tables listed
3. Click on `agents` table - it should be empty for now

---

## 🔒 Step 4: Enable Row Level Security (3 minutes)

### 4.1 Run RLS Policies
1. Back to **SQL Editor**
2. Create a new query
3. Copy contents of `supabase/migrations/002_rls_policies.sql`
4. Paste and click **"Run"**
5. ✅ Should complete successfully

**What this does:**
- ✅ Enables RLS on all tables
- ✅ Allows public read access (for demo)
- ✅ Requires authentication for writes
- ✅ Service role has full access (for backend)

### 4.2 Verify RLS Enabled
1. Go to **Authentication** > **Policies**
2. You should see policies for all 8 tables
3. Each table should show "RLS enabled: true"

---

## 📦 Step 5: Create Storage Buckets (3 minutes)

### 5.1 Create Media Evidence Bucket
1. Go to **Storage** (left sidebar)
2. Click **"Create a new bucket"**
3. Settings:
   - **Name**: `media-evidence`
   - **Public bucket**: ✅ Yes (check this)
   - **File size limit**: 100 MB
   - **Allowed MIME types**: Leave empty (allow all)
4. Click **"Create bucket"**

### 5.2 Create Reports Bucket
1. Click **"Create a new bucket"** again
2. Settings:
   - **Name**: `generated-reports`
   - **Public bucket**: ✅ Yes
   - **File size limit**: 10 MB
3. Click **"Create bucket"**

### 5.3 Set Storage Policies
For each bucket:
1. Click on bucket name
2. Go to **Policies** tab
3. Click **"New policy"**
4. Select **"Allow public access"** template
5. Configure:
   - **Policy name**: `Public Access`
   - **Allowed operations**: SELECT
   - **Target roles**: public
6. Click **"Save"**

Repeat for uploads (if you want public uploads):
- **Policy name**: `Public Upload`
- **Allowed operations**: INSERT
- **Target roles**: authenticated

---

## 🎯 Step 6: Seed Demo Data (5 minutes)

### 6.1 Run Seed Script
1. Back to **SQL Editor**
2. New query
3. Copy contents of `supabase/migrations/003_seed_data.sql`
4. Paste and click **"Run"**
5. ✅ Should see success messages

**What this adds:**
- ✅ 6 AI agents (Monitor, Detector, Analyzer, Verifier, Reporter, Coordinator)
- ✅ 5 sample incidents with different severities
- ✅ 8 network nodes (accounts involved in campaigns)
- ✅ 10 network edges (connections between accounts)
- ✅ 3 review queue items
- ✅ 3 sample detections

### 6.2 Verify Data Loaded
1. Go to **Table Editor**
2. Click **`agents`** - should see 6 rows
3. Click **`incidents`** - should see 5 rows
4. Click **`network_nodes`** - should see 8 rows
5. All good? ✅ Database is ready!

---

## 🔐 Step 7: Configure Authentication (3 minutes)

### 7.1 Enable Email Auth
1. Go to **Authentication** > **Providers** (left sidebar)
2. Find **"Email"** provider
3. Toggle it **ON**
4. Settings:
   - **Enable email confirmations**: OFF (for demo)
   - **Enable email change**: ON
5. Click **"Save"**

### 7.2 Configure Site URL
1. Go to **Authentication** > **URL Configuration**
2. Set:
   - **Site URL**: `http://localhost:5173` (for development)
   - **Redirect URLs**: Add `http://localhost:5173/**`
3. Click **"Save"**

### 7.3 (Optional) Create Test User
1. Go to **Authentication** > **Users**
2. Click **"Add user"** > **"Create new user"**
3. Fill in:
   - **Email**: `demo@echobreaker.com`
   - **Password**: `Demo123!@#`
   - **Auto Confirm User**: ✅ Yes
4. Click **"Create user"**

---

## 📱 Step 8: Install Supabase Client (5 minutes)

### 8.1 Install Package
In your terminal:

```bash
npm install @supabase/supabase-js
```

### 8.2 Create Supabase Client

Create `src/lib/supabase.ts`:

```typescript
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Types for our database tables
export type Agent = {
  id: string
  name: string
  type: string
  status: 'idle' | 'processing' | 'complete' | 'error'
  description: string
  capabilities: string[]
  tasks_completed: number
  current_task?: string
  last_active: string
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
  created_at: string
  updated_at: string
}

export type NetworkNode = {
  id: string
  account_id: string
  platform: string
  username?: string
  display_name?: string
  threat_level?: 'high' | 'medium' | 'low' | 'unknown'
  bot_probability?: number
  follower_count?: number
  post_count?: number
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
  created_at: string
}

export type ReviewQueueItem = {
  id: string
  incident_id: string
  priority: 'critical' | 'high' | 'medium' | 'low'
  status: 'pending' | 'in-review' | 'approved' | 'rejected' | 'needs-info'
  assigned_to?: string
  review_notes?: string
  submitted_at: string
  reviewed_at?: string
}
```

---

## ✅ Step 9: Test Connection (2 minutes)

### 9.1 Create Test Page

Create `src/pages/DatabaseTest.tsx`:

```typescript
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import type { Agent, Incident } from '@/lib/supabase'

export default function DatabaseTest() {
  const [agents, setAgents] = useState<Agent[]>([])
  const [incidents, setIncidents] = useState<Incident[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchData() {
      try {
        // Test agents query
        const { data: agentsData, error: agentsError } = await supabase
          .from('agents')
          .select('*')
          .order('name')

        if (agentsError) throw agentsError
        setAgents(agentsData || [])

        // Test incidents query
        const { data: incidentsData, error: incidentsError } = await supabase
          .from('incidents')
          .select('*')
          .order('detected_at', { ascending: false })
          .limit(5)

        if (incidentsError) throw incidentsError
        setIncidents(incidentsData || [])

        setLoading(false)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error')
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">✅ Database Connection Test</h1>
      
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Agents ({agents.length})</h2>
        <div className="grid gap-4">
          {agents.map(agent => (
            <div key={agent.id} className="p-4 border rounded">
              <h3 className="font-bold">{agent.name}</h3>
              <p className="text-sm text-gray-600">{agent.description}</p>
              <p className="text-sm mt-2">Status: {agent.status} | Tasks: {agent.tasks_completed}</p>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-4">Recent Incidents ({incidents.length})</h2>
        <div className="grid gap-4">
          {incidents.map(incident => (
            <div key={incident.id} className="p-4 border rounded">
              <h3 className="font-bold">{incident.title}</h3>
              <p className="text-sm text-gray-600">{incident.description}</p>
              <p className="text-sm mt-2">
                Severity: {incident.severity} | Confidence: {incident.confidence_score}%
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
```

### 9.2 Add Route (temporarily)

In `src/App.tsx`, add:

```typescript
import DatabaseTest from '@/pages/DatabaseTest'

// Inside your routes:
<Route path="/db-test" element={<DatabaseTest />} />
```

### 9.3 Test It!

1. Start your dev server: `npm run dev`
2. Visit: `http://localhost:5173/db-test`
3. You should see:
   - ✅ 6 agents listed
   - ✅ 5 recent incidents listed
   - ✅ No errors!

---

## 🎉 Success Checklist

- [ ] Supabase project created
- [ ] Environment variables configured (`.env` file)
- [ ] Database schema created (8 tables)
- [ ] RLS policies enabled
- [ ] 2 storage buckets created (`media-evidence`, `generated-reports`)
- [ ] Demo data seeded (agents, incidents, network)
- [ ] Authentication configured
- [ ] Supabase client installed (`@supabase/supabase-js`)
- [ ] Test connection successful

---

## 📊 What You Have Now

### Database Structure
```
agents (6 rows) ──┐
                  ├──> incidents (5 rows)
                  │         │
                  │         ├──> detections (3 rows)
                  │         ├──> media_files (0 rows - will populate on upload)
                  │         └──> review_queue (3 rows)
                  │
network_nodes (8 rows) ──> network_edges (10 rows)
                  │
                  └──> evidence_chain (0 rows - will populate during analysis)
```

### Storage Buckets
- `media-evidence/` - For videos, images, audio files
- `generated-reports/` - For PDF incident reports

---

## 🐛 Troubleshooting

### Error: "Invalid API Key"
- Double-check your `.env` file
- Make sure you're using the **anon key** (not service role) for frontend
- Restart dev server after changing `.env`

### Error: "relation does not exist"
- Run the schema migration SQL again
- Check **Table Editor** to confirm tables exist
- Make sure you're connected to the right project

### Error: "RLS policy violation"
- Check that RLS policies were created successfully
- Go to **Authentication > Policies** and verify
- For testing, you can temporarily disable RLS (not recommended for production)

### Storage upload fails
- Check bucket policies (should allow public INSERT for authenticated users)
- Verify bucket is set to "Public"
- Check file size limits

---

## 🚀 Next Steps

Now that your database is set up, you can:

1. ✅ **Connect Frontend to API** - Replace mock data with real Supabase queries
2. ✅ **Build Backend API** - Create Express/Fastify server for agent orchestration
3. ✅ **Implement File Upload** - Allow users to upload media for analysis
4. ✅ **Add Real-time Updates** - Use Supabase Realtime for live feed
5. ✅ **Build AI Agents** - Create detection services that write to database

---

## 📚 Useful Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase JavaScript Client](https://supabase.com/docs/reference/javascript/introduction)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)
- [Storage Documentation](https://supabase.com/docs/guides/storage)

---

## 💡 Pro Tips

1. **Use Supabase Studio** for quick data browsing and testing queries
2. **Enable Realtime** on tables for live updates (go to Database > Replication)
3. **Create database backups** regularly (Settings > Database > Backups)
4. **Monitor usage** to stay within free tier limits
5. **Use transactions** for complex operations to maintain data consistency

---

**🎯 Database setup complete! Ready to build the API layer next!**
