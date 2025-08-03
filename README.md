# Essentials Egypt Enhanced

This project provides a unified dashboard for social media, analytics and business management. It is built with Next.js 15 using the App Router and Tailwind CSS, and leverages Supabase for authentication, database storage and real‑time functionality. The codebase is designed to be extensible and includes support for multiple OAuth providers, scheduled posting, messaging, analytics and role‑based access control.

## Features

- **Secure authentication** – JSON Web Tokens protect all API routes via reusable middleware. Sign and verify tokens using a single secret defined in your environment.
- **Role‑based access** – Use Supabase tables to associate users with workspaces and roles (`admin`, `member`, `viewer`). Example invitation endpoints are provided.
- **Multiple integrations** – Complete OAuth flows for Facebook, Instagram, TikTok, Google (Ads + YouTube), LinkedIn, Snapchat, Twitter/X and Shopify. Each provider has login, callback, disconnect and fetch routes along with a corresponding service implementing `getToken`, `refreshToken` (where supported) and `fetchData`.
- **Token refresh jobs** – A simple script (`jobs/refreshTokens.js`) scans the connections table and refreshes tokens about to expire for providers that support refresh tokens.
- **Content scheduler** – API endpoints allow users to schedule posts across platforms. A cron‑friendly run endpoint processes scheduled posts and marks them as posted or failed. The front‑end provides a basic scheduling UI.
- **Messaging** – A unified inbox stores direct messages and comments in Supabase. Endpoints allow sending and listing messages. The UI displays messages and lets users send new ones.
- **AI tools** – An example endpoint demonstrates how to call the OpenAI API to generate captions for posts. Extend this pattern for ad copy and content suggestions.
- **Analytics** – A consolidated report endpoint fetches metrics from each connected provider and returns raw results. The dashboard and analytics pages display this data.
- **Settings and connections** – Users can view and disconnect connected platforms. Preferences storage is stubbed for future expansion.
- **Workspaces and invitations** – An invitation endpoint shows how to invite users to workspaces with roles.

## Supabase Schema

The following tables are expected in your Supabase project:

```sql
-- Store external account tokens
CREATE TABLE connections (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users (id),
  provider text,
  access_token text,
  refresh_token text,
  expires_at timestamp,
  shop text,
  inserted_at timestamp default now(),
  updated_at timestamp default now()
);

-- Record scheduled posts
CREATE TABLE scheduled_posts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users (id),
  platform text,
  content text,
  scheduled_at timestamp,
  status text,
  inserted_at timestamp default now(),
  updated_at timestamp default now()
);

-- Store audit logs
CREATE TABLE audit_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users (id),
  platform text,
  action text,
  timestamp timestamp default now(),
  metadata jsonb
);

-- Messages inbox
CREATE TABLE messages (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users (id),
  platform text,
  thread_id text,
  content text,
  created_at timestamp default now()
);

-- User preferences
CREATE TABLE preferences (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users (id),
  key text,
  value text
);

-- Workspace invitations
CREATE TABLE invitations (
  id uuid primary key default gen_random_uuid(),
  inviter_id uuid references auth.users (id),
  email text,
  role text,
  workspace_id uuid,
  status text,
  created_at timestamp default now()
);
```

Configure row‑level security (RLS) policies on each table to ensure users can only access their own records. Supabase's [guides](https://supabase.com/docs/guides/auth/row-level-security) provide detailed instructions.

## Getting Started

1. Copy `.env.example` to `.env` and fill in your Supabase URL, anon key, JWT secret and OAuth credentials for each platform.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
4. Open `http://localhost:3000` in your browser. Log in and start connecting accounts from the Settings page.

## Deployment

Deploy the application to Vercel or your preferred hosting provider. Ensure that all environment variables are set in the deployment environment and that your OAuth provider settings list the correct callback URLs (e.g. `https://yourdomain.com/api/auth/facebook/callback`).

---

Feel free to extend the services with additional endpoints, refine the user interface and add advanced features like real‑time notifications, localisation and offline support.