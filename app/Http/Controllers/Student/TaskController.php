<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Models\Cohort;
use App\Models\CohortTask;
use App\Models\TaskSubmission;
use Inertia\Inertia;

class TaskController extends Controller
{
    public function show(Cohort $cohort, CohortTask $cohortTask)
    {
        $student = auth()->user();

        // Verify enrollment
        $enrollment = $cohort->enrollments()->where('student_id', $student->id)->firstOrFail();
        abort_if($enrollment->status === 'dropped', 403);

        // Check if task is unlocked
        abort_unless($this->isTaskUnlocked($cohort, $cohortTask, $student->id), 403, 'This task is locked.');

        $cohortTask->load('task');

        // Get existing submission for this task
        $submission = TaskSubmission::where('cohort_task_id', $cohortTask->id)
            ->where('student_id', $student->id)
            ->latest()
            ->first();

        // Get discussion messages
        $discussions = $cohortTask->discussions()
            ->with('user', 'replies.user')
            ->whereNull('parent_id')
            ->latest()
            ->take(20)
            ->get();

        return Inertia::render('Student/Tasks/Show', [
            'cohort'     => $cohort,
            'cohortTask' => $cohortTask,
            'task'       => $cohortTask->task,
            'submission' => $submission,
            'discussions' => $discussions,
        ]);
    }

    private function isTaskUnlocked(Cohort $cohort, CohortTask $cohortTask, int $studentId): bool
    {
        if (!$cohortTask->is_published) return false;
        if ($cohortTask->opens_at && now()->lt($cohortTask->opens_at)) return false;

        // Get ordered tasks for this cohort
        $orderedTasks = $cohort->cohortTasks()
            ->where('is_published', true)
            ->orderBy('order_index')
            ->get();

        // Find index of current task
        $currentIndex = $orderedTasks->search(fn($t) => $t->id === $cohortTask->id);

        // First task is always unlocked
        if ($currentIndex === 0) return true;

        // Check if previous task has been submitted (not necessarily approved)
        $previousTask = $orderedTasks[$currentIndex - 1];
        return TaskSubmission::where('cohort_task_id', $previousTask->id)
            ->where('student_id', $studentId)
            ->whereNotIn('status', ['draft'])
            ->exists();
    }
}
