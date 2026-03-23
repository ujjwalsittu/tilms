<?php

namespace App\Services;

use App\Models\Badge;
use App\Models\UserBadge;

class StreakService
{
    public function checkBadgeEligibility(int $userId, int $cohortId, int $streakDays, int $tasksCompleted): void
    {
        $badges = Badge::all();

        foreach ($badges as $badge) {
            $eligible = match ($badge->criteria_type) {
                'streak_days' => $streakDays >= $badge->criteria_value,
                'tasks_completed' => $tasksCompleted >= $badge->criteria_value,
                default => false,
            };

            if ($eligible) {
                UserBadge::firstOrCreate([
                    'user_id' => $userId,
                    'badge_id' => $badge->id,
                    'cohort_id' => $cohortId,
                ], [
                    'earned_at' => now(),
                ]);
            }
        }
    }
}
