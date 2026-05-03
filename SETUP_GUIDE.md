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

### 2f. Set the coach profile role

Run in SQL editor (replace the UUID with the actual coach user ID):
```sql
INSERT INTO public.profiles (id, role, full_name)
VALUES ('<coach-user-id>', 'coach', 'Coach Name')
ON CONFLICT (id) DO UPDATE SET role = 'coach';
```

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

For **local testing**, use the Cloudflare tunnel URL (see step 5) as `<your-domain>`.  
For **production**, use the real domain.

---

## 5. Local Testing with Cloudflare Tunnel

Cloudflare Tunnel exposes your localhost to the internet so Calendly can reach it.

### 5a. Install cloudflared

```bash
brew install cloudflared
```

### 5b. Start the tunnel

Run in a separate terminal:
```bash
cloudflared tunnel --url http://localhost:3000
```

It prints a URL like `https://abc123.trycloudflare.com`. Use this as `<your-domain>` in step 4d.

> **Note:** The URL changes every time you restart cloudflared. If you restart it, re-register the webhook with the new URL (step 4d again).

### 5c. Start the dev server

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
| Sessions page shows empty | Coach profile missing or role not set to 'coach' | Run the INSERT in step 2f |
| `profile.getMe` returns null | Same as above | Same fix |
| Webhook not received | Tunnel URL changed after restart | Re-register webhook (step 4d) |
| Port 3000 in use | Old dev server still running | `kill <pid>` then `npm run dev` |
| `.next` cache error | Stale build cache | `rm -rf .next && npm run dev` |

---

## 8. Production Deployment

> To be completed — covers Cloudflare Pages / Vercel deployment.

Key steps when going live:
1. Deploy to your hosting provider
2. Set all environment variables in the hosting dashboard (same as `.env.local`)
3. Re-register the Calendly webhook using the real production URL (no tunnel needed)
4. Confirm the Supabase project is not paused (free tier pauses after inactivity)
