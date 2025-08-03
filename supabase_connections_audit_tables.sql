-- Supabase Connections Table Schema
create table if not exists connections (
  user_id uuid references auth.users not null,
  provider text not null,
  access_token text not null,
  refresh_token text,
  expires_at timestamp with time zone,
  advertiser_id text,
  shop text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  primary key (user_id, provider)
);

create index if not exists idx_connections_user_id on connections(user_id);
create index if not exists idx_connections_provider on connections(provider);
create index if not exists idx_connections_expires_at on connections(expires_at);

-- Supabase Audit Logs Table Schema
create table if not exists audit_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users not null,
  platform text not null,
  action text not null,
  metadata jsonb,
  timestamp timestamp with time zone default timezone('utc'::text, now()) not null
);

create index if not exists idx_audit_logs_user_id on audit_logs(user_id);
create index if not exists idx_audit_logs_platform on audit_logs(platform);
create index if not exists idx_audit_logs_timestamp on audit_logs(timestamp);
