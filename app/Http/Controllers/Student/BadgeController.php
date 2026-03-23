<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Models\UserBadge;
use Inertia\Inertia;

class BadgeController extends Controller
{
    public function index()
    {
        $badges = UserBadge::where('user_id', auth()->id())
            ->with(['badge', 'cohort:id,title'])
            ->latest('earned_at')
            ->get();

        return Inertia::render('Student/Badges/Index', [
            'badges' => $badges,
        ]);
    }
}
