<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Symfony\Component\HttpFoundation\Response;

class EnsurePlatformConfigured
{
    public function handle(Request $request, Closure $next): Response
    {
        // Skip for admin settings routes (so admin can configure)
        if ($request->is('admin/settings*') || $request->is('admin/dashboard') || $request->is('login') || $request->is('logout')) {
            return $next($request);
        }

        // Only check for admin users
        if ($request->user()?->role?->value !== 'admin') {
            return $next($request);
        }

        try {
            if (! Schema::hasTable('api_keys')) {
                return $next($request);
            }

            // Check if essential API keys are configured (non-empty)
            $unconfigured = DB::table('api_keys')
                ->where('is_active', true)
                ->whereIn('key_name', ['api_key']) // Check main keys
                ->get()
                ->filter(function ($key) {
                    try {
                        $value = \Illuminate\Support\Facades\Crypt::decryptString($key->encrypted_value);
                        return empty($value);
                    } catch (\Throwable) {
                        return true;
                    }
                });

            if ($unconfigured->isNotEmpty()) {
                session()->flash('warning', 'Some API keys are not configured. Visit Settings > API Keys to complete setup.');
            }
        } catch (\Throwable) {
            // Silently ignore during initial setup
        }

        return $next($request);
    }
}
