<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\AffiliateTracking;
use Illuminate\Http\Request;

class AffiliateRedirectController extends Controller
{
    public function redirect(string $code, Request $request)
    {
        // Track click
        $tracking = AffiliateTracking::where('affiliate_code', $code)->first();
        if ($tracking) {
            $tracking->increment('click_count');
        }

        // Store code in cookie for 30 days
        return redirect('/')->withCookie(cookie('affiliate_code', $code, 43200));
    }
}
