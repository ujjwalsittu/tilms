<?php

namespace App\Http\Controllers\Instructor;

use App\Http\Controllers\Controller;
use App\Models\Cohort;
use App\Models\CohortEnrollment;
use App\Models\CohortTask;
use App\Models\Payment;
use App\Models\TaskSubmission;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $user = auth()->user();
        $cohortIds = Cohort::where('instructor_id', $user->id)->pluck('id');

        $stats = [
            'active_cohorts' => Cohort::where('instructor_id', $user->id)->where('status', 'in_progress')->count(),
            'total_students' => CohortEnrollment::whereIn('cohort_id', $cohortIds)->where('status', 'enrolled')->count(),
            'pending_reviews' => TaskSubmission::whereIn('cohort_task_id',
                CohortTask::whereIn('cohort_id', $cohortIds)->pluck('id')
            )->whereIn('status', ['submitted', 'ai_reviewed'])->count(),
            'total_earnings' => Payment::whereIn('cohort_id', $cohortIds)->where('status', 'captured')->sum('amount'),
        ];

        $recentSubmissions = TaskSubmission::with(['student', 'cohortTask.task', 'cohortTask.cohort'])
            ->whereIn('cohort_task_id', CohortTask::whereIn('cohort_id', $cohortIds)->pluck('id'))
            ->whereIn('status', ['submitted', 'ai_reviewed'])
            ->latest()
            ->take(5)
            ->get();

        $cohorts = Cohort::where('instructor_id', $user->id)
            ->withCount('enrollments')
            ->latest()
            ->take(5)
            ->get();

        return Inertia::render('Instructor/Dashboard', compact('stats', 'recentSubmissions', 'cohorts'));
    }
}
