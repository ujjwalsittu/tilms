<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Models\Certificate;
use App\Models\Cohort;
use App\Models\CohortEnrollment;
use App\Models\CohortTask;
use App\Models\TaskSubmission;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $user = auth()->user();

        $enrollments = CohortEnrollment::where('student_id', $user->id)
            ->where('status', 'enrolled')
            ->with('cohort')
            ->get();

        $enrolledCohortIds = $enrollments->pluck('cohort.id');

        $enrolledCohorts = $enrollments->map(function ($enrollment) use ($user) {
            $cohort = $enrollment->cohort;
            $cohortTaskIds = $cohort->cohortTasks()->pluck('id');
            $totalTasks = $cohortTaskIds->count();

            $completedTasks = TaskSubmission::where('student_id', $user->id)
                ->whereIn('cohort_task_id', $cohortTaskIds)
                ->whereIn('status', ['graded', 'passed'])
                ->count();

            return [
                'id'              => $cohort->id,
                'title'           => $cohort->title,
                'slug'            => $cohort->slug,
                'status'          => $cohort->status,
                'total_tasks'     => $totalTasks,
                'completed_tasks' => $completedTasks,
                'progress'        => $totalTasks > 0
                    ? round(($completedTasks / $totalTasks) * 100, 1)
                    : 0,
            ];
        });

        $allCohortTaskIds = CohortTask::whereIn('cohort_id', $enrolledCohortIds)->pluck('id');

        $activeTasks = CohortTask::whereIn('cohort_id', $enrolledCohortIds)
            ->where(function ($query) {
                $query->whereNull('due_at')->orWhere('due_at', '>=', now());
            })
            ->whereDoesntHave('submissions', function ($query) use ($user) {
                $query->where('student_id', $user->id)
                    ->whereIn('status', ['graded', 'passed', 'submitted', 'ai_reviewed']);
            })
            ->with('task', 'cohort')
            ->orderBy('due_at')
            ->take(10)
            ->get();

        $certificatesCount = Certificate::where('student_id', $user->id)->count();

        return Inertia::render('Student/Dashboard', compact(
            'enrolledCohorts',
            'activeTasks',
            'certificatesCount'
        ));
    }
}
