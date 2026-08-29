-- ==============================================================================
-- BuiltWhileBroke: Community Requested Tools, Feedback & Global Usage Schema
-- Database Scope: Used EXCLUSIVELY for the Community Directory & Anonymous Global Use Counters.
-- All developer workbenches (PGlite, SQLime, CyberChef, etc.) remain 100% client-side.
-- ==============================================================================

-- 1. Create table for requested tools
create table if not exists public.tool_requests (
  id text primary key,
  name text not null,
  tagline text not null,
  description text not null,
  category text not null check (category in ('dev', 'diagrams', 'security', 'media')),
  status text not null default 'under-review' check (status in ('under-review', 'planned', 'in-dev', 'shipped')),
  upvotes integer not null default 0,
  github_url text,
  tech_stack text[] default array[]::text[],
  created_at timestamptz default now()
);

-- 2. Create table for real-time community comments
create table if not exists public.tool_comments (
  id uuid primary key default gen_random_uuid(),
  tool_id text not null references public.tool_requests(id) on delete cascade,
  author_name text not null default 'Anonymous Builder',
  content text not null,
  created_at timestamptz default now()
);

-- 3. Create table for unique anonymous upvotes
create table if not exists public.tool_upvotes (
  id uuid primary key default gen_random_uuid(),
  tool_id text not null references public.tool_requests(id) on delete cascade,
  client_id text not null,
  created_at timestamptz default now(),
  unique(tool_id, client_id)
);

-- 4. Create table for anonymous global tool usage counters
create table if not exists public.global_tool_stats (
  tool_id text primary key,
  use_count bigint not null default 0,
  last_used_at timestamptz default now()
);

-- Create index on foreign keys for fast joins & reads
create index if not exists idx_tool_comments_tool_id on public.tool_comments(tool_id);
create index if not exists idx_tool_upvotes_tool_id on public.tool_upvotes(tool_id);
create index if not exists idx_tool_requests_status on public.tool_requests(status);
create index if not exists idx_global_tool_stats_uses on public.global_tool_stats(use_count desc);

-- Enable Row Level Security (RLS)
alter table public.tool_requests enable row level security;
alter table public.tool_comments enable row level security;
alter table public.tool_upvotes enable row level security;
alter table public.global_tool_stats enable row level security;

-- Policies for tool_requests
create policy "Allow public read access on tool_requests"
  on public.tool_requests for select
  using (true);

create policy "Allow public insert on tool_requests"
  on public.tool_requests for insert
  with check (true);

create policy "Allow public update on upvotes for tool_requests"
  on public.tool_requests for update
  using (true)
  with check (true);

-- Policies for tool_comments
create policy "Allow public read access on tool_comments"
  on public.tool_comments for select
  using (true);

create policy "Allow public insert access on tool_comments"
  on public.tool_comments for insert
  with check (length(content) > 0 and length(content) <= 1000);

-- Policies for tool_upvotes
create policy "Allow public read access on tool_upvotes"
  on public.tool_upvotes for select
  using (true);

create policy "Allow public insert access on tool_upvotes"
  on public.tool_upvotes for insert
  with check (true);

create policy "Allow public delete access on tool_upvotes"
  on public.tool_upvotes for delete
  using (true);

-- Policies for global_tool_stats
create policy "Allow public read on global_tool_stats"
  on public.global_tool_stats for select
  using (true);

create policy "Allow public insert on global_tool_stats"
  on public.global_tool_stats for insert
  with check (true);

create policy "Allow public update on global_tool_stats"
  on public.global_tool_stats for update
  using (true)
  with check (true);

-- Atomic increment function for global tool usage
create or replace function public.increment_global_tool_usage(target_tool_id text)
returns bigint
language plpgsql
security definer
as $$
declare
  new_total bigint;
begin
  insert into public.global_tool_stats (tool_id, use_count, last_used_at)
  values (target_tool_id, 1, now())
  on conflict (tool_id)
  do update set
    use_count = public.global_tool_stats.use_count + 1,
    last_used_at = now()
  returning use_count into new_total;

  return new_total;
end;
$$;
