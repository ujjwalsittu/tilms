<?php

namespace App\Services;

use App\Models\Cohort;
use App\Models\CohortEnrollment;
use App\Models\LeaderboardSnapshot;
use App\Models\TaskSubmission;

class LeaderboardService
{
    public function snapshot(Cohort $cohort): void
    {
        $enrollments = CohortEnrollment::where('cohort_id', $cohort->id)
            ->where('status', 'enrolled')
            ->with('student:id,name')
            ->get();

        $cohortTaskIds = $cohort->cohortTasks()->pluck('id');
        $today = now()->toDateString();

        $scores = $enrollments->map(function ($enrollment) use ($cohortTaskIds) {
            $submissions = TaskSubmission::where('student_id', $enrollment->student_id)
                ->whereIn('cohort_task_id', $cohortTaskIds)
                ->where('status', 'graded')
                ->get();

            return [
                'student_id' => $enrollment->student_id,
                'score' => $submissions->avg('instructor_score') ?? 0,
                'tasks_completed' => $submissions->unique('cohort_task_id')->count(),
                'average_grade' => $submissions->avg('instructor_score') ?? 0,
                'streak_days' => $enrollment->streak_current,
            ];
        })->sortByDesc('score')->values();

        // Delete old snapshot for today
        LeaderboardSnapshot::where('cohort_id', $cohort->id)->where('snapshot_date', $today)->delete();

        foreach ($scores as $rank => $entry) {
            LeaderboardSnapshot::create([
                'cohort_id' => $cohort->id,
                'student_id' => $entry['student_id'],
                'rank' => $rank + 1,
                'score' => $entry['score'],
                'tasks_completed' => $entry['tasks_completed'],
                'average_grade' => $entry['average_grade'],
                'streak_days' => $entry['streak_days'],
                'snapshot_date' => $today,
                'created_at' => now(),
            ]);
        }
    }
}
