<?php

namespace App\Http\Controllers\Instructor;

use App\Http\Controllers\Controller;
use App\Models\Cohort;
use App\Models\CohortTask;
use App\Models\TaskSubmission;
use App\Models\User;
use Inertia\Inertia;

class StudentRosterController extends Controller
{
    public function index(Cohort $cohort)
    {
        $this->authorizeCohortOwnership($cohort);

        $enrollments = $cohort->enrollments()
            ->with('student')
            ->get();

        $cohortTaskIds = $cohort->cohortTasks()->pluck('id');
        $totalTasks = $cohortTaskIds->count();

        $students = $enrollments->map(function ($enrollment) use ($cohortTaskIds, $totalTasks) {
            $student = $enrollment->student;

            $completedTasks = TaskSubmission::where('student_id', $student->id)
                ->whereIn('cohort_task_id', $cohortTaskIds)
                ->whereIn('status', ['graded', 'passed'])
                ->count();

            $avgScore = TaskSubmission::where('student_id', $student->id)
                ->whereIn('cohort_task_id', $cohortTaskIds)
                ->whereNotNull('instructor_score')
                ->avg('instructor_score');

            return [
                'id'              => $student->id,
                'name'            => $student->name,
                'email'           => $student->email,
                'enrollment_status' => $enrollment->status,
                'enrolled_at'     => $enrollment->created_at,
                'completed_tasks' => $completedTasks,
                'total_tasks'     => $totalTasks,
                'progress'        => $totalTasks > 0
                    ? round(($completedTasks / $totalTasks) * 100, 1)
                    : 0,
                'avg_score'       => $avgScore ? round($avgScore, 1) : null,
            ];
        });

        return Inertia::render('Instructor/Roster/Index', compact('cohort', 'students'));
    }

    public function show(Cohort $cohort, User $user)
    {
        $this->authorizeCohortOwnership($cohort);

        $cohortTasks = $cohort->cohortTasks()->with('task')->orderBy('order_index')->get();

        $submissions = TaskSubmission::where('student_id', $user->id)
            ->whereIn('cohort_task_id', $cohortTasks->pluck('id'))
            ->with('cohortTask.task')
            ->get()
            ->keyBy('cohort_task_id');

        $taskProgress = $cohortTasks->map(function ($cohortTask) use ($submissions) {
            $submission = $submissions->get($cohortTask->id);

            return [
                'cohort_task_id' => $cohortTask->id,
                'task_title'     => $cohortTask->task->title,
                'order_index'    => $cohortTask->order_index,
                'due_at'         => $cohortTask->due_at,
                'submission'     => $submission ? [
                    'id'                  => $submission->id,
                    'status'              => $submission->status,
                    'instructor_score'    => $submission->instructor_score,
                    'instructor_feedback' => $submission->instructor_feedback,
                    'submitted_at'        => $submission->submitted_at,
                    'reviewed_at'         => $submission->reviewed_at,
                ] : null,
            ];
        });

        $enrollment = $cohort->enrollments()->where('student_id', $user->id)->first();

        return Inertia::render('Instructor/Roster/Show', compact('cohort', 'user', 'taskProgress', 'enrollment'));
    }

    protected function authorizeCohortOwnership(Cohort $cohort): void
    {
        if ($cohort->instructor_id !== auth()->id()) {
            abort(403, 'You do not have permission to access this cohort roster.');
        }
    }
}
