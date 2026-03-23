<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Models\ReferralReward;
use App\Models\User;
use Illuminate\Support\Str;
use Inertia\Inertia;

class ReferralController extends Controller
{
    public function index()
    {
        $user = auth()->user();

        // Generate referral code if not exists
        if (!$user->referral_code) {
            $user->update(['referral_code' => strtoupper(Str::random(8))]);
        }

        $rewards = ReferralReward::where('referrer_id', $user->id)
            ->with('referred:id,name,email')
            ->latest()
            ->get();

        $stats = [
            'total_referrals' => $rewards->count(),
            'total_earned' => $rewards->where('status', 'credited')->sum('reward_value'),
            'pending' => $rewards->where('status', 'pending')->sum('reward_value'),
        ];

        return Inertia::render('Student/Referrals/Index', [
            'referralCode' => $user->referral_code,
            'rewards' => $rewards,
            'stats' => $stats,
        ]);
    }
}
