-- Supabase Alerts Table Schema

create table if not exists alerts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users not null,
  type text not null,
  platform text not null,
  message text not null,
  status text check (status in ('pending', 'sent', 'resolved')) default 'pending',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create index if not exists idx_alerts_user_id on alerts(user_id);
create index if not exists idx_alerts_status on alerts(status);
create index if not exists idx_alerts_created_at on alerts(created_at);
