<?php

namespace App\Providers;

use App\Events\AuditableEvent;
use App\Events\SubmissionCreated;
use App\Events\SubmissionGraded;
use App\Listeners\LogAuditEntry;
use App\Listeners\UpdateEnrollmentProgress;
use App\Listeners\UpdateStreakOnActivity;
use Illuminate\Support\Facades\Event;
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

        Event::listen(AuditableEvent::class, LogAuditEntry::class);
        Event::listen(SubmissionCreated::class, UpdateStreakOnActivity::class);
        Event::listen(SubmissionGraded::class, UpdateEnrollmentProgress::class);
    }
}
