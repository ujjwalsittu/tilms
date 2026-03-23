<?php

namespace App\Providers;

use App\Events\AuditableEvent;
use App\Events\SubmissionCreated;
use App\Events\SubmissionGraded;
use App\Listeners\LogAuditEntry;
use App\Listeners\UpdateEnrollmentProgress;
use App\Listeners\UpdateStreakOnActivity;
use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Support\Facades\Event;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\Vite;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Vite::prefetch(concurrency: 3);

        // Load Resend API key from admin panel (api_keys table)
        $this->configureMailFromDatabase();

        Event::listen(AuditableEvent::class, LogAuditEntry::class);
        Event::listen(SubmissionCreated::class, UpdateStreakOnActivity::class);
        Event::listen(SubmissionGraded::class, UpdateEnrollmentProgress::class);

        RateLimiter::for('ai', function ($request) {
            return Limit::perMinute(10)->by($request->user()?->id ?: $request->ip());
        });

        RateLimiter::for('auth', function ($request) {
            return Limit::perMinute(5)->by($request->ip());
        });
    }

    private function configureMailFromDatabase(): void
    {
        try {
            if (! Schema::hasTable('api_keys') || ! Schema::hasTable('platform_settings')) {
                return;
            }

            // Load Resend API key
            $resendKey = DB::table('api_keys')
                ->where('service', 'resend')
                ->where('key_name', 'api_key')
                ->where('is_active', true)
                ->value('encrypted_value');

            if ($resendKey) {
                $decrypted = Crypt::decryptString($resendKey);
                if (! empty($decrypted)) {
                    Config::set('services.resend.key', $decrypted);
                    Config::set('mail.default', 'resend');
                }
            }

            // Load mail from address/name from platform settings
            $mailFrom = DB::table('platform_settings')
                ->where('key', 'mail_from_address')
                ->value('value');

            $mailFromName = DB::table('platform_settings')
                ->where('key', 'mail_from_name')
                ->value('value');

            if ($mailFrom) {
                Config::set('mail.from.address', $mailFrom);
            }
            if ($mailFromName) {
                Config::set('mail.from.name', $mailFromName);
            }
        } catch (\Throwable) {
            // Silently fail during migrations or when DB is not yet available
        }
    }
}
