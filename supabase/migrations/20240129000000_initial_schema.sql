-- Enable PostGIS for geospatial queries (optional but recommended for future)
create extension if not exists postgis;

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ============================================
-- 1. Lakes Table
-- ============================================
create table lakes (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  slug text not null unique,
  location jsonb not null, -- { latitude: number, longitude: number }
  description text,
  area_sq_km numeric,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Index on slug for fast lookups
create index idx_lakes_slug on lakes(slug);

-- ============================================
-- 2. Health Scores Table
-- ============================================
create type health_band as enum ('healthy', 'at_risk', 'degrading', 'critical');

create table health_scores (
  id uuid primary key default uuid_generate_v4(),
  lake_id uuid references lakes(id) on delete cascade not null,
  score numeric not null check (score >= 0 and score <= 100),
  band health_band not null,
  components jsonb not null, -- { dissolvedOxygen: number, ... }
  confidence numeric not null check (confidence >= 0 and confidence <= 1),
  timestamp timestamptz default now() not null
);

-- Index for time-series queries
create index idx_health_scores_lake_timestamp on health_scores(lake_id, timestamp desc);

-- ============================================
-- 3. Sensor Readings Table
-- ============================================
create table sensor_readings (
  id uuid primary key default uuid_generate_v4(),
  lake_id uuid references lakes(id) on delete cascade not null,
  sensor_type text not null,
  value numeric not null,
  unit text,
  confidence numeric not null,
  metadata jsonb,
  timestamp timestamptz default now() not null
);

-- Index for fetching latest sensors
create index idx_sensor_readings_lake_type_time on sensor_readings(lake_id, sensor_type, timestamp desc);

-- ============================================
-- 4. Predictions Table
-- ============================================
create type prediction_window as enum ('24h', '48h', '72h');
create type risk_level as enum ('low', 'medium', 'high', 'critical');

create table predictions (
  id uuid primary key default uuid_generate_v4(),
  lake_id uuid references lakes(id) on delete cascade not null,
  window prediction_window not null,
  predicted_score numeric not null,
  current_score numeric not null,
  score_delta numeric not null,
  risk_level risk_level not null,
  confidence numeric not null,
  causes jsonb default '[]'::jsonb,
  recommendations jsonb default '[]'::jsonb,
  explanation text,
  generated_at timestamptz default now() not null,
  valid_until timestamptz not null
);

-- Index for active predictions
create index idx_predictions_lake_validity on predictions(lake_id, valid_until);

-- ============================================
-- 5. Alerts Table
-- ============================================
create type alert_severity as enum ('info', 'warning', 'critical');
create type alert_status as enum ('active', 'acknowledged', 'resolved');

create table alerts (
  id uuid primary key default uuid_generate_v4(),
  lake_id uuid references lakes(id) on delete cascade,
  title text not null,
  description text,
  severity alert_severity not null,
  status alert_status default 'active' not null,
  cause text,
  recommendation text,
  triggered_by text,
  metadata jsonb,
  created_at timestamptz default now() not null,
  acknowledged_at timestamptz,
  resolved_at timestamptz
);

-- Index for active alerts by lake
create index idx_alerts_lake_status on alerts(lake_id, status);

-- ============================================
-- 6. Citizen Reports Table
-- ============================================
create type report_status as enum ('pending', 'analyzing', 'verified', 'rejected');

create table citizen_reports (
  id uuid primary key default uuid_generate_v4(),
  lake_id uuid references lakes(id) on delete set null, -- keep report even if lake deleted? maybe not, but safe
  report_type text not null,
  description text,
  location jsonb not null,
  image_url text not null,
  image_analysis jsonb, -- { detectedIssues: [], severity: number }
  status report_status default 'pending' not null,
  submitted_at timestamptz default now() not null,
  processed_at timestamptz
);

-- Index for pending reports
create index idx_reports_status on citizen_reports(status);
create index idx_reports_lake on citizen_reports(lake_id);

-- ============================================
-- Row Level Security (RLS) Policies
-- ============================================

-- Enable RLS on all tables
alter table lakes enable row level security;
alter table health_scores enable row level security;
alter table sensor_readings enable row level security;
alter table predictions enable row level security;
alter table alerts enable row level security;
alter table citizen_reports enable row level security;

-- Public Read Policies (Anonymous users can view data)
create policy "Allow public read access on lakes" on lakes for select using (true);
create policy "Allow public read access on health_scores" on health_scores for select using (true);
create policy "Allow public read access on sensor_readings" on sensor_readings for select using (true);
create policy "Allow public read access on predictions" on predictions for select using (true);
create policy "Allow public read access on alerts" on alerts for select using (true);

-- Citizen Reports: Public create, but only view own (if auth) or public view (if desired). 
-- For MVP, let's allow public read for now to show on dashboard potentially, or restrict. 
-- Let's restrict read to service role (admin) mostly, but allow creating.
create policy "Allow public insert on citizen_reports" on citizen_reports for insert with check (true);
-- Optionally allow reading their own if we had auth, for now allow all read for demo purposes
create policy "Allow public read on citizen_reports" on citizen_reports for select using (true);

-- Storage Buckets (via Supabase Storage API usually, but SQL can define RLS)
-- Bucket: 'reports'
insert into storage.buckets (id, name, public) values ('reports', 'reports', true)
on conflict (id) do nothing;

create policy "Public Access" on storage.objects for select using ( bucket_id = 'reports' );
create policy "Public Upload" on storage.objects for insert with check ( bucket_id = 'reports' );

