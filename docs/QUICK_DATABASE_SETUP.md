# 🚀 Database Setup - Quick Start (5 Minutes)

## Step 1: Create Supabase Project
1. Go to https://supabase.com → Sign up
2. New Project → Name: `echobreaker`
3. Copy **Project URL** and **anon key**

## Step 2: Environment Variables
Create `.env`:
```bash
VITE_SUPABASE_URL=your-project-url
VITE_SUPABASE_ANON_KEY=your-anon-key
```

## Step 3: Run SQL Scripts
In Supabase Dashboard → SQL Editor:

1. **Schema** (paste `001_initial_schema.sql`) → Run
2. **RLS** (paste `002_rls_policies.sql`) → Run  
3. **Seed** (paste `003_seed_data.sql`) → Run

## Step 4: Create Storage Buckets
Storage → Create bucket:
- Name: `media-evidence` (public)
- Name: `generated-reports` (public)

## Step 5: Install Client
```bash
npm install @supabase/supabase-js
```

Create `src/lib/supabase.ts` (copy from docs)

## ✅ Done! 
Test: Visit `/db-test` to verify connection

---

**Full Guide**: See `docs/DATABASE_SETUP.md`
