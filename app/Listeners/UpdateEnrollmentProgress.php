<?php

namespace App\Listeners;

use App\Events\SubmissionGraded;
use App\Models\CohortEnrollment;
use App\Models\CohortTask;
use App\Models\TaskSubmission;

class UpdateEnrollmentProgress
{
    public function handle(SubmissionGraded $event): void
    {
        $submission = $event->submission;
        $cohortTask = $submission->cohortTask;
        $cohort = $cohortTask->cohort;

        $totalTasks = $cohort->cohortTasks()->where('is_published', true)->count();
        if ($totalTasks === 0) return;

        $completedTasks = TaskSubmission::whereIn(
                'cohort_task_id',
                $cohort->cohortTasks()->where('is_published', true)->pluck('id')
            )
            ->where('student_id', $submission->student_id)
            ->where('status', 'graded')
            ->distinct('cohort_task_id')
            ->count('cohort_task_id');

        $percent = round(($completedTasks / $totalTasks) * 100, 2);

        CohortEnrollment::where('cohort_id', $cohort->id)
            ->where('student_id', $submission->student_id)
            ->update([
                'completion_percent' => $percent,
                'completed_at'       => $percent >= 100 ? now() : null,
                'status'             => $percent >= 100 ? 'completed' : 'enrolled',
            ]);
    }
}
