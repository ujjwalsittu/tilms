<?php

namespace App\Listeners;

use App\Events\SubmissionCreated;
use App\Models\CohortEnrollment;
use App\Models\StreakLog;

class UpdateStreakOnActivity
{
    public function handle(SubmissionCreated $event): void
    {
        $submission = $event->submission;
        $cohortId   = $submission->cohortTask->cohort_id;
        $studentId  = $submission->student_id;
        $today      = now()->toDateString();

        // Log activity
        StreakLog::firstOrCreate([
            'user_id'       => $studentId,
            'cohort_id'     => $cohortId,
            'activity_date' => $today,
        ], [
            'activity_type' => 'submission',
            'created_at'    => now(),
        ]);

        // Calculate streak
        $streak = 1;
        $date   = now()->subDay();
        while (StreakLog::where('user_id', $studentId)
            ->where('cohort_id', $cohortId)
            ->where('activity_date', $date->toDateString())
            ->exists()) {
            $streak++;
            $date->subDay();
        }

        $enrollment = CohortEnrollment::where('cohort_id', $cohortId)
            ->where('student_id', $studentId)
            ->first();

        if ($enrollment) {
            $enrollment->update([
                'streak_current'   => $streak,
                'streak_longest'   => max($enrollment->streak_longest, $streak),
                'last_activity_at' => now(),
            ]);
        }
    }
}
