<?php

namespace App\Jobs\Ai;

use App\Models\AiProgressReport;
use App\Models\CohortEnrollment;
use App\Models\TaskSubmission;
use App\Models\User;
use App\Services\ClaudeAiService;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class GenerateWeeklyReport implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public function __construct(
        public int $studentId,
        public int $cohortId,
    ) {
        $this->onQueue('ai');
    }

    public function handle(ClaudeAiService $ai): void
    {
        $student = User::find($this->studentId);
        $enrollment = CohortEnrollment::where('student_id', $this->studentId)
            ->where('cohort_id', $this->cohortId)
            ->first();

        if (!$student || !$enrollment) return;

        $cohort = $enrollment->cohort;
        $weekStart = now()->startOfWeek();

        // Gather metrics
        $metrics = [
            'completion_percent' => $enrollment->completion_percent,
            'streak_current' => $enrollment->streak_current,
            'tasks_completed_this_week' => TaskSubmission::where('student_id', $this->studentId)
                ->whereIn('cohort_task_id', $cohort->cohortTasks()->pluck('id'))
                ->where('status', 'graded')
                ->where('reviewed_at', '>=', $weekStart)
                ->count(),
            'tasks_submitted_this_week' => TaskSubmission::where('student_id', $this->studentId)
                ->whereIn('cohort_task_id', $cohort->cohortTasks()->pluck('id'))
                ->where('submitted_at', '>=', $weekStart)
                ->count(),
            'average_score' => TaskSubmission::where('student_id', $this->studentId)
                ->whereIn('cohort_task_id', $cohort->cohortTasks()->pluck('id'))
                ->whereNotNull('instructor_score')
                ->avg('instructor_score'),
        ];

        $result = $ai->generateProgressReport($metrics, $student->name, $cohort->title, $this->studentId);

        AiProgressReport::updateOrCreate(
            [
                'student_id' => $this->studentId,
                'cohort_id' => $this->cohortId,
                'report_week' => $weekStart->toDateString(),
            ],
            [
                'summary' => $result['summary'] ?? $result['raw'] ?? '',
                'strengths' => $result['strengths'] ?? [],
                'areas_for_improvement' => $result['areas_for_improvement'] ?? [],
                'recommendations' => $result['recommendations'] ?? [],
                'metrics' => $metrics,
                'ai_model' => 'claude-sonnet-4-20250514',
                'created_at' => now(),
            ]
        );
    }
}
