# SaaS Dashboard – OAuth2 + API Integration

This project is a complete OAuth2-based system for a SaaS dashboard. It allows users to securely connect their ad and analytics accounts across 7 major platforms, using Next.js API routes and Supabase for token storage and logging.

---

## ✅ Supported Platforms

Each of the following platforms includes:

- `login.js` – starts the OAuth2 flow
- `callback.js` – handles token exchange and stores credentials
- `disconnect.js` – removes the stored token
- `fetch.js` – fetches campaigns or analytics using the stored access_token
- `platform.js` – contains core logic for each integration in `/services/platforms/`

### Platforms:
- Facebook (Marketing API)
- Google (Ads + GA4)
- TikTok (Marketing API)
- LinkedIn (Ads + Page Insights)
- Snapchat (Marketing API)
- Twitter/X (Ads API)
- Shopify (Admin API + Webhooks)

---

## 🛠 System Features

| Feature                        | Description                                |
|-------------------------------|--------------------------------------------|
| Supabase                      | Used as the backend database               |
| JWT Middleware                | Protects all API routes                    |
| `.env.example`                | Holds client IDs, secrets, and Supabase    |
| Retry Logic                   | Prevents 429 errors using backoff retry    |
| Token Refresh Job             | Checks `expires_at` and refreshes tokens   |
| Shopify Webhook Handler       | Validates HMAC and logs events             |
| Meta Webhook Handler          | Handles subscription + events              |
| Audit Logging                 | Logs user actions to Supabase table        |

---

## 🧠 Supabase Schema

### `connections` table
```sql
CREATE TABLE connections (
  user_id TEXT,
  platform TEXT,
  access_token TEXT,
  refresh_token TEXT,
  expires_at TIMESTAMP
);
```

### `audit_logs` table
```sql
CREATE TABLE audit_logs (
  user_id TEXT,
  platform TEXT,
  action TEXT,
  timestamp TIMESTAMP,
  metadata JSON
);
```

---

## 📁 File Structure

```
utils/
  supabaseClient.js
  auth.js
  fetchWithRetry.js

middleware/
  jwt.js

jobs/
  refreshTokens.js

services/
  logging/audit.js
  platforms/{platform}.js

pages/api/
  auth/{platform}/login.js
  auth/{platform}/callback.js
  auth/{platform}/disconnect.js
  {platform}/fetch.js
  webhooks/shopify.js
  webhooks/meta.js
```

---

## ✅ What You Need To Do

1. Fill in each `platform.js` service:
   - `getToken()`
   - `refreshToken()`
   - `fetchData()`

2. Ensure all routes call platform logic correctly.

3. Use JWT to protect all user-specific requests.

4. Store tokens securely with Supabase.

5. Use `fetchWithRetry()` for all API calls.

---

## 🧪 Note

This system is structured for real-world use. Keep token handling, refresh logic, and webhook security tight. Extend the same logic to future platforms.

---

Maintained by: Your SaaS Dev Team 🔒