# TILMS - Technical Internship & Learning Management System

## Tech Stack
- **Backend**: Laravel 13 (PHP 8.4), MySQL/SQLite
- **Frontend**: Inertia.js v2 + React 19 + Chakra UI v3 + Vite 8
- **Real-time**: Laravel Reverb (not yet configured)
- **Payments**: Razorpay (configured via Admin Panel)
- **AI**: Claude API (configured via Admin Panel)
- **Email**: Resend (configured via Admin Panel)

## Minimal .env
Only infrastructure variables go in `.env`:
- APP_NAME, APP_ENV, APP_KEY, APP_URL
- DB_* (auto-injected by Laravel Cloud)
- MAIL_FROM_ADDRESS, MAIL_FROM_NAME
- SESSION_DRIVER, CACHE_STORE, QUEUE_CONNECTION

All API keys (Claude, Razorpay, Resend, GitHub) are stored encrypted in the `api_keys` database table and managed via **Admin Panel > Settings > API Keys**.

## Project Structure
- `app/Http/Controllers/Admin/` - Admin panel controllers (11)
- `app/Http/Controllers/Instructor/` - Instructor panel controllers (12)
- `app/Http/Controllers/Student/` - Student portal controllers (12)
- `app/Http/Controllers/Public/` - Public pages controllers (3)
- `app/Services/` - Business logic services (11)
- `app/Jobs/Ai/` - AI background jobs (5)
- `app/Enums/` - PHP enums for all status types (23)
- `app/Models/` - Eloquent models (36)
- `app/Notifications/` - Laravel notifications (7)
- `resources/js/Pages/` - React pages organized by role
- `resources/js/Components/` - Shared React components
- `resources/js/Layouts/` - Role-specific sidebar layouts

## Key Commands
- `php artisan serve` - Start Laravel dev server
- `npm run dev` - Start Vite dev server
- `php artisan migrate:fresh --seed` - Reset database
- `php artisan test` - Run tests
- `npm run build` - Production build
- `php artisan reports:weekly-progress` - Generate AI progress reports
- `php artisan leaderboard:snapshot` - Snapshot leaderboards

## Roles
- **Admin** (1): Platform-wide control, instructor management, settings
- **Instructor**: Cohort management, task bank, submission review
- **Student**: Enrollment, task completion, AI tools, certificates

## Architecture Patterns
- Service layer for external APIs (never call APIs from controllers directly)
- Events + Listeners for side effects (audit logging, notifications, progress tracking)
- Queued jobs for AI calls, email sending, PDF generation
- Inertia.js for server-driven SPA (no separate API routes needed)
- Role-based middleware (`role:admin`, `role:instructor`, `role:student`)
- API keys stored encrypted in DB, loaded at runtime (not in .env)

## Chakra UI v3 Notes
- Do NOT use: FormControl, FormLabel, FormErrorMessage, Divider, IconButton, Checkbox (v2)
- Use: Box for field wrappers, Text for labels, native HTML checkbox/radio/select
- Table: Table.Root, Table.Header, Table.Row, Table.ColumnHeader, Table.Body, Table.Cell

## Database
- 38 tables, SQLite for dev, MySQL for production
- API keys stored encrypted in `api_keys` table
- Platform settings in `platform_settings` key-value store

## Laravel Cloud Deployment
- Build command: `npm install && npm run build`
- Deploy command: `php artisan migrate --force && php artisan db:seed --force`
- PHP version: 8.4
- Node version: 24
- Add MySQL database in same region as compute
- Add queue worker as background process: `php artisan queue:work --sleep=3 --tries=3`
- Set APP_KEY, APP_URL, MAIL_FROM_ADDRESS in environment variables
- DB_* auto-injected by Laravel Cloud
- After first deploy, login as admin@tilms.com / password and configure API keys
