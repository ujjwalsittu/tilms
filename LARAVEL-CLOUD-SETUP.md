# TILMS — Laravel Cloud Deployment Guide

## Prerequisites
- GitHub account with TILMS repo pushed
- Laravel Cloud account at https://cloud.laravel.com
- (Optional) Custom domain

---

## Step 1: Push Code to GitHub

```bash
cd D:\projects\tilms
git init
git add -A
git commit -m "Initial TILMS platform"
git remote add origin https://github.com/YOUR_USERNAME/tilms.git
git branch -M main
git push -u origin main
```

---

## Step 2: Create Laravel Cloud Project

1. Go to **https://cloud.laravel.com**
2. Click **"New Project"**
3. Connect your **GitHub account** if not already connected
4. Select your **tilms** repository
5. Give your project a name (e.g., "TILMS")

---

## Step 3: Create an Environment

1. Inside your project, click **"New Environment"**
2. Name it **"production"** (or "staging" for testing first)
3. Select your preferred **region** (choose closest to your users)
4. Laravel Cloud will create a compute cluster automatically

---

## Step 4: Add MySQL Database

1. In your environment's **Infrastructure Canvas**, click **"Add Database"**
2. Select **"Laravel MySQL"**
3. Configure:
   - **Cluster name**: `tilms-db`
   - **Instance size**: Start with Flex (auto-scales)
   - **Storage**: 5GB to start (can increase later)
   - **Region**: Must match your compute cluster region
4. Specify database name: `tilms`
5. Click **Create**

> Laravel Cloud **automatically injects** `DB_HOST`, `DB_DATABASE`, `DB_USERNAME`, `DB_PASSWORD` into your environment. You do NOT need to set these manually.

---

## Step 5: Set Environment Variables

Go to your environment's **Settings > Environment Variables** and add:

```
APP_NAME=TILMS
APP_ENV=production
APP_DEBUG=false
APP_KEY=base64:YOUR_KEY_HERE
DB_CONNECTION=mysql
SESSION_DRIVER=database
CACHE_STORE=database
QUEUE_CONNECTION=database
MAIL_MAILER=resend
FILESYSTEM_DISK=local
VITE_APP_NAME=TILMS
```

### How to generate APP_KEY:
Run locally:
```bash
php artisan key:generate --show
```
Copy the output (e.g., `base64:rUMu...Aek=`) and paste as `APP_KEY` value.

### What you DON'T need in .env:
- `APP_URL` — Laravel Cloud sets this automatically based on your domain
- `DB_HOST`, `DB_DATABASE`, `DB_USERNAME`, `DB_PASSWORD` — Auto-injected by Laravel Cloud
- API keys for Claude, Razorpay, Resend, GitHub — Configured via Admin Panel after first deploy
- `MAIL_FROM_ADDRESS`, `MAIL_FROM_NAME` — Configured via Admin Panel
- Any Redis/Cache config — Laravel Cloud manages this

---

## Step 6: Configure Build & Deploy Commands

Go to your environment's **Settings > Build & Deploy**:

### Build Command:
```
npm install && npm run build
```

### Deploy Command:
```
php artisan migrate --force && php artisan db:seed --force && php artisan config:cache && php artisan route:cache && php artisan view:cache
```

### PHP Version: **8.4**
### Node Version: **24** (default)

---

## Step 7: Add Queue Worker

Your platform uses background jobs for AI processing, emails, and more.

1. Go to your environment's **Infrastructure Canvas**
2. Click on your **compute cluster**
3. Scroll to **"Background Processes"**
4. Click **"New Background Process"**
5. Configure:
   - **Command**: `php artisan queue:work --sleep=3 --tries=3 --timeout=120 --queue=ai,payments,email,github,certificates,analytics`
   - **Processes**: 2 (start small, scale up as needed)
6. Click **Save**

---

## Step 8: Deploy

1. Click **"Deploy"** button in your environment
2. Laravel Cloud will:
   - Pull your code from GitHub
   - Run `npm install && npm run build` (builds Vite/React assets)
   - Create a Docker image
   - Run `php artisan migrate --force && php artisan db:seed --force` (creates all 38 tables + seeds admin user, settings, badges)
   - Deploy with zero downtime
3. Wait for deployment to complete (2-5 minutes typically)

---

## Step 9: First Login & Platform Configuration

### Login as Admin:
1. Visit your Laravel Cloud URL (e.g., `https://tilms-production-xxxxx.laravel.cloud`)
2. Login with:
   - **Email**: `admin@tilms.com`
   - **Password**: `password`
3. **IMMEDIATELY change your admin password** via Profile page

### Configure API Keys (Admin > Settings > API Keys):

| Service | Key Name | Where to Get It |
|---------|----------|-----------------|
| **Resend** | api_key | https://resend.com/api-keys |
| **Claude AI** | api_key | https://console.anthropic.com/settings/keys |
| **Razorpay** (test) | razorpay_test_key_id | https://dashboard.razorpay.com/app/keys |
| **Razorpay** (test) | razorpay_test_key_secret | Same as above |
| **Razorpay** (live) | razorpay_live_key_id | Same, toggle to Live mode |
| **Razorpay** (live) | razorpay_live_key_secret | Same |
| **GitHub** | personal_access_token | https://github.com/settings/tokens |

For each key:
1. Go to **Admin > Settings > API Keys**
2. Click the key row
3. Enter the actual API key value
4. Click **Update**

### Configure Platform Settings (Admin > Settings > Platform):

| Setting | What to Set |
|---------|------------|
| **Platform Name** | Your platform name |
| **Logo** | Upload your logo image |
| **Theme Color** | Pick your brand color |
| **From Email Address** | e.g., `noreply@yourdomain.com` (must match Resend verified domain) |
| **From Name** | e.g., `TILMS` or your platform name |
| **Signatory Name** | Name on certificates |
| **Signatory Position** | Title on certificates |
| **Claude Model** | claude-sonnet-4 recommended (balance of quality + cost) |
| **Razorpay Environment** | `test` initially, switch to `live` when ready |

---

## Step 10: Custom Domain (Optional)

1. Go to your environment's **Settings > Domains**
2. Click **"Add Domain"**
3. Enter your domain (e.g., `learn.yourdomain.com`)
4. Laravel Cloud will provide DNS records to add:
   - Add a **CNAME** record pointing to the provided Laravel Cloud hostname
5. Laravel Cloud automatically provisions **TLS/SSL certificates**
6. Once DNS propagates, your app is live on your custom domain

---

## Step 11: Enable Push-to-Deploy (Automatic)

By default, Laravel Cloud deploys automatically when you push to your configured branch (usually `main`).

To configure:
1. Go to **Settings > Build & Deploy**
2. Under **"Push to Deploy"**, ensure it's enabled
3. Select the branch (`main`)

Now every `git push origin main` triggers an automatic deployment.

---

## Step 12: Scheduled Tasks

For AI weekly progress reports and leaderboard snapshots, add scheduled tasks:

1. Go to **Settings > Scheduler** (or use background processes)
2. Add:
   - `php artisan reports:weekly-progress` — Run weekly (Monday 6:00 AM)
   - `php artisan leaderboard:snapshot` — Run daily (2:00 AM)

If Laravel Cloud doesn't have a built-in scheduler UI, add this to your compute cluster as background processes, or use Laravel's built-in scheduler by ensuring `php artisan schedule:work` runs as a background process.

---

## Architecture on Laravel Cloud

```
┌─────────────────────────────────────────┐
│           Laravel Cloud                  │
│                                          │
│  ┌──────────────┐   ┌────────────────┐  │
│  │  Compute      │   │  MySQL         │  │
│  │  Cluster      │   │  Database      │  │
│  │              │   │               │  │
│  │  PHP 8.4     │   │  38 tables    │  │
│  │  + Vite      │   │  Auto-backup  │  │
│  │  assets      │   │               │  │
│  └──────┬───────┘   └───────────────┘  │
│         │                                │
│  ┌──────┴───────┐                       │
│  │  Queue        │                       │
│  │  Workers      │                       │
│  │              │                       │
│  │  AI jobs     │                       │
│  │  Email jobs  │                       │
│  │  PDF jobs    │                       │
│  └──────────────┘                       │
│                                          │
│  Auto TLS ─ CDN ─ DDoS Protection      │
└─────────────────────────────────────────┘
         │
    External APIs (configured via Admin Panel)
    ├── Claude API (Anthropic)
    ├── Razorpay (Payments)
    ├── Resend (Email)
    └── GitHub API (Student repos)
```

---

## Summary: What Goes Where

| Configuration | Where |
|--------------|-------|
| APP_KEY, DB_CONNECTION, SESSION_DRIVER, CACHE_STORE, QUEUE_CONNECTION, MAIL_MAILER | `.env` on Laravel Cloud |
| DB_HOST, DB_DATABASE, DB_USERNAME, DB_PASSWORD | Auto-injected by Laravel Cloud |
| APP_URL, TLS/SSL | Managed by Laravel Cloud |
| Claude API Key | Admin Panel > API Keys |
| Razorpay Keys | Admin Panel > API Keys |
| Resend API Key | Admin Panel > API Keys |
| GitHub Token | Admin Panel > API Keys |
| From Email & Name | Admin Panel > Platform Settings |
| Platform Branding | Admin Panel > Platform Settings |
| Certificate Config | Admin Panel > Platform Settings |
| AI Model Selection | Admin Panel > Platform Settings |
| Payment Mode (test/live) | Admin Panel > Platform Settings |

**Total .env variables needed: ~8 (most are single-word values)**
**Everything else: Admin Panel**
