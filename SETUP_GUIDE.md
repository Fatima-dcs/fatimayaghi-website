# Coaching Website Setup Guide

Step-by-step guide to deploy a new coaching website from scratch.

---

## Overview

The stack:
- **Next.js 15** — frontend + API routes (Pages + App Router hybrid)
- **Supabase** — database, auth, row-level security
- **tRPC** — type-safe API layer
- **Calendly** — booking widget + webhooks to auto-create sessions
- **Cloudflare Tunnel** — expose localhost for Calendly webhook testing

---

## 1. Start from the Template

```bash
git clone <dashboard-template-repo>
cd dashboard-template/nextjs
npm install
```

---

## 2. Supabase Project

### 2a. Create a project
1. Go to https://supabase.com/dashboard → New Project
2. Note down:
   - **Project URL** (e.g. `https://xxxxxxxxxxx.supabase.co`)
   - **Anon/Publishable Key**
   - **Service Role Key** (Settings → API)
   - **Project Ref** (the `xxxxxxxxxxx` part of the URL)

### 2b. Set environment variables

Create `nextjs/.env.local`:
```
SUPABASE_SECRET_KEY=your_service_role_key
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your_anon_key
COACH_USER_ID=                          # fill after step 2e
CALENDLY_WEBHOOK_SECRET=                # fill after step 4
INNGEST_EVENT_KEY=your_key
INNGEST_SIGNING_KEY=your_key
```

### 2c. Run migrations

Link the project and push migrations:
```bash
cd supabase
npx supabase link --project-ref xxxxxxxxxxx
npx supabase db push
```

> **Important:** Migrations create tables but don't automatically grant `service_role` access. The migrations in this template already include the grants, but for any new table always add:
> ```sql
> GRANT ALL ON public.<table_name> TO service_role;
> ```

### 2d. Grant service_role on all tables (safety check)

Run in the Supabase SQL editor (`https://supabase.com/dashboard/project/<ref>/sql/new`):
```sql
GRANT ALL ON public.profiles TO service_role;
GRANT ALL ON public.sessions TO service_role;
GRANT ALL ON public.next_steps TO service_role;
GRANT ALL ON public.tools TO service_role;
GRANT ALL ON public.site_content TO service_role;
```

### 2e. Create the coach user

1. Go to Supabase Dashboard → Authentication → Users → Add User
2. Enter the coach's email and a temporary password
3. Copy the **User ID** (UUID) — this becomes `COACH_USER_ID` in `.env.local`

The coach role is set **automatically** on first login — no manual SQL needed. The app detects `COACH_USER_ID` from env and upserts `role = 'coach'` in the profiles table automatically.

---

## 3. Customize the Website

### 3a. Branding & content

Edit `nextjs/src/lib/i18n/en.ts` and `ar.ts`:
- `subheadline` — coaching specialty (e.g. "Executive coaching")
- `badge` — credentials (e.g. "ICF ACC Candidate")
- `coachTitle`, `coachDesc` — bio text

### 3b. Calendly booking widget

Edit `nextjs/src/components/landing/Booking.tsx`:
```tsx
// Replace with the coach's Calendly username
src="https://calendly.com/<username>"

// Replace with the coach's WhatsApp number (include country code, no +)
href="https://wa.me/<number>"
```

### 3c. About / Why Arabic text

After deploying, edit live at `/coach/content` — no code changes needed.

---

## 4. Calendly Webhook

This auto-creates sessions in the dashboard when a client books.

### 4a. Generate a webhook secret

```bash
openssl rand -hex 32
```

Copy the output → add to `nextjs/.env.local` as `CALENDLY_WEBHOOK_SECRET`.

> **Never paste real secret values into `SETUP_GUIDE.md` or any other file committed to the repository.**

### 4b. Get a Calendly Personal Access Token

1. Calendly → Account → Integrations → API & Webhooks → Personal Access Tokens
2. Create a token with full scopes
3. Note it down (shown only once)

### 4c. Get the coach's Calendly User URI

```bash
curl -s https://api.calendly.com/users/me \
  -H "Authorization: Bearer <your_token>" | python3 -m json.tool | grep uri
```

Copy the `uri` value (e.g. `https://api.calendly.com/users/XXXXXXXX`).

### 4d. Register the webhook with Calendly API

Replace `<token>`, `<user_uri>`, `<webhook_url>`, and `<secret>`:

```bash
curl -X POST https://api.calendly.com/webhook_subscriptions \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://<your-domain>/api/webhooks/calendly?secret=<secret>",
    "events": ["invitee.created", "invitee.canceled"],
    "organization": "<user_uri>",
    "user": "<user_uri>",
    "scope": "user"
  }'
```

For **local testing**, use `webhook.<your-domain>` (see step 5) as `<your-domain>`.  
For **production**, use the real domain.

---

## 5. Local Testing with Cloudflare Named Tunnel (Permanent URL)

A named tunnel gives a permanent URL that never changes on restart — register the webhook once and forget it.

### 5a. Install cloudflared

```bash
brew install cloudflared
```

### 5b. Create the named tunnel (one-time setup)

```bash
cloudflared tunnel login                          # opens browser, select your domain
cloudflared tunnel create coaching-local          # creates tunnel, note the tunnel ID
cloudflared tunnel route dns coaching-local webhook.<your-domain>
```

Create `~/.cloudflared/config.yml`:
```yaml
tunnel: <tunnel-id>
credentials-file: /Users/<you>/.cloudflared/<tunnel-id>.json

ingress:
  - hostname: webhook.<your-domain>
    service: http://localhost:3000
  - service: http_status:404
```

### 5c. Run the tunnel

```bash
cloudflared tunnel run coaching-local
```

Your permanent webhook URL is now `https://webhook.<your-domain>/api/webhooks/calendly?secret=<secret>`.  
Register this once in step 4d — no need to update it ever again.

### 5d. Start the dev server

In another terminal:
```bash
cd nextjs
npm run dev
```

---

## 6. Testing the Full Flow

1. Start dev server + cloudflared (step 5)
2. Open `http://localhost:3000` → book a session via the Calendly widget
3. Watch the Next.js terminal — you should see `[calendly webhook] event: invitee.created`
4. Go to `http://localhost:3000/coach/sessions` — the session appears automatically
5. Cancel the booking on Calendly → session status updates to "cancelled"

---

## 7. Common Issues & Fixes

| Symptom | Cause | Fix |
|---------|-------|-----|
| Webhook returns 500 | `service_role` missing table grants | Run `GRANT ALL ON public.<table> TO service_role;` in SQL editor |
| Sessions page shows empty | Coach profile missing or role is not `coach` | Set `COACH_USER_ID` in env — role auto-sets on next login |
| `profile.getMe` returns null | Same as above | Same fix |
| Webhook not received | Named tunnel not running | Run `cloudflared tunnel run coaching-local` |
| Port 3000 in use | Old dev server still running | `kill <pid>` then `npm run dev` |
| `.next` cache error | Stale build cache | `rm -rf .next && npm run dev` |

---

## 8. Production Deployment (Vercel)

Vercel is the recommended host — zero config for Next.js, free tier available, handles SSR and API routes natively.

### 8a. Push code to GitHub

Make sure all changes are committed and pushed to `main`:
```bash
git push origin main
```

### 8b. Create a Vercel project

1. Go to https://vercel.com → New Project
2. Import your GitHub repo (`Fatima-dcs/fatimayaghi-website`)
3. Set **Root Directory** to `nextjs`
4. Framework preset: **Next.js** (auto-detected)
5. Click Deploy — the first deploy will fail because env vars aren't set yet. That's fine.

### 8c. Set environment variables in Vercel

Go to your Vercel project → Settings → Environment Variables. Add all of these:

| Variable | Value |
|----------|-------|
| `SUPABASE_SECRET_KEY` | Your Supabase service role key |
| `NEXT_PUBLIC_SUPABASE_URL` | `https://<your-project-ref>.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Your Supabase anon/publishable key |
| `COACH_USER_ID` | `<your-coach-user-id>` (UUID from step 2e) |
| `CALENDLY_WEBHOOK_SECRET` | Run: `openssl rand -hex 32` |
| `NEXT_PUBLIC_APP_URL` | `https://fatimayaghi.com` (your production domain) |
| `INNGEST_EVENT_KEY` | Your Inngest event key |
| `INNGEST_SIGNING_KEY` | Your Inngest signing key |

After adding all variables, trigger a redeploy: Deployments → ⋯ → Redeploy.

### 8d. Add custom domain

1. Vercel project → Settings → Domains
2. Add `fatimayaghi.com` and `www.fatimayaghi.com`
3. Vercel gives you DNS records to add in Cloudflare:
   - Go to Cloudflare → fatimayaghi.com → DNS
   - Add the CNAME record Vercel provides (points `@` or `www` to `cname.vercel-dns.com`)
4. Wait a few minutes → site goes live at `https://fatimayaghi.com`

### 8e. Update Calendly webhook to production URL

The production webhook URL never changes — register it once:

```bash
# Delete old webhook (the one pointing to webhook.fatimayaghi.com)
curl -X DELETE "https://api.calendly.com/webhook_subscriptions/<old-id>" \
  -H "Authorization: Bearer <your-token>"

# Create production webhook
curl -X POST https://api.calendly.com/webhook_subscriptions \
  -H "Authorization: Bearer <your-token>" \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://fatimayaghi.com/api/webhooks/calendly?secret=<your-calendly-webhook-secret>",
    "events": ["invitee.created", "invitee.canceled"],
    "organization": "<your-calendly-org-uri>",
    "user": "<your-calendly-user-uri>",
    "scope": "user"
  }'
```

> After going to production, the local `webhook.fatimayaghi.com` tunnel is only needed for local development and testing — not for live traffic.

### 8f. Verify production

1. Visit `https://fatimayaghi.com` — landing page loads
2. Sign in as coach → `/coach` dashboard loads
3. Book a test session via Calendly → session appears in `/coach/sessions`
4. Sign in as a client → `/dashboard/sessions` shows their sessions

---

## 9. Access Control — Enabling Specific Content per Client

By default all clients see the same sessions, tools, and content. Here's how to restrict access.

### 9a. Current access model

| What | Who sees it |
|------|-------------|
| Sessions | Client sees only sessions where `client_id = their user ID` |
| Tools | All authenticated users |
| Content (About, Why Arabic) | Public — anyone on the landing page |
| Coach dashboard | Only the user whose ID matches `COACH_USER_ID` |

### 9b. Restrict tools to specific clients (future)

Add a `tier` column to `profiles`:
```sql
ALTER TABLE public.profiles ADD COLUMN tier TEXT NOT NULL DEFAULT 'free' CHECK (tier IN ('free', 'premium'));
```

Add a `tier_required` column to `tools`:
```sql
ALTER TABLE public.tools ADD COLUMN tier_required TEXT NOT NULL DEFAULT 'free';
```

Update the RLS policy:
```sql
DROP POLICY "Authenticated users can view tools" ON public.tools;
CREATE POLICY "Clients can view tools by tier" ON public.tools
  FOR SELECT TO authenticated
  USING (
    tier_required = 'free'
    OR EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid() AND p.tier = tier_required
    )
  );
```

To upgrade a client to premium, run in the SQL editor:
```sql
UPDATE public.profiles SET tier = 'premium' WHERE id = '<client-user-id>';
```

Or build a toggle in the coach's client list UI to do this without SQL.

### 9c. Invite-only sign-up

To prevent random sign-ups and only allow clients you invite:

In `nextjs/src/config/app.ts`, set:
```ts
enableSignUp: false
```

Clients can only join via the coach's invite flow (`/coach/clients` → Invite Client button). Supabase sends them a magic-link email to set their password.

### 9d. How the coach manages client access (summary)

| Action | Where |
|--------|-------|
| Invite a new client | `/coach/clients` → Invite Client |
| Link a Calendly booking to a client | `/coach/sessions/[id]` → Link to User |
| Upgrade client to premium tier | SQL editor or future UI toggle |
| Revoke access | Supabase Dashboard → Auth → Users → Delete user |
