-- Supabase Scheduled Posts Table Schema
create table if not exists scheduled_posts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users not null,
  platform text not null,
  content text not null,
  scheduled_at timestamptz not null,
  status text not null default 'scheduled', -- scheduled, posted, failed
  created_at timestamptz default timezone('utc'::text, now()) not null,
  updated_at timestamptz default timezone('utc'::text, now()) not null
);

create index if not exists idx_scheduled_posts_user_id on scheduled_posts(user_id);
create index if not exists idx_scheduled_posts_platform on scheduled_posts(platform);
create index if not exists idx_scheduled_posts_scheduled_at on scheduled_posts(scheduled_at);
create index if not exists idx_scheduled_posts_status on scheduled_posts(status);
