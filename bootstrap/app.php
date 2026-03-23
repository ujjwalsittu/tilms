<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        $middleware->web(append: [
            \App\Http\Middleware\HandleInertiaRequests::class,
            \Illuminate\Http\Middleware\AddLinkHeadersForPreloadedAssets::class,
            \App\Http\Middleware\TrackLastActivity::class,
            \App\Http\Middleware\EnsurePlatformConfigured::class,
        ]);

        $middleware->alias([
            'role' => \App\Http\Middleware\EnsureRole::class,
        ]);

        $middleware->validateCsrfTokens(except: ['webhooks/*']);
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        // Log all exceptions to file for debugging
        $exceptions->report(function (\Throwable $e) {
            \Illuminate\Support\Facades\Log::channel('single')->error($e->getMessage(), [
                'url' => request()->fullUrl(),
                'method' => request()->method(),
                'user_id' => auth()->id(),
                'file' => $e->getFile() . ':' . $e->getLine(),
                'trace' => collect($e->getTrace())->take(5)->map(fn($t) => ($t['file'] ?? '') . ':' . ($t['line'] ?? ''))->toArray(),
            ]);
        });
    })->create();
