<?php

namespace App\Http\Controllers\Instructor;

use App\Http\Controllers\Controller;
use App\Models\Cohort;
use App\Models\CohortTask;
use App\Models\LeaderboardSnapshot;
use App\Models\TaskSubmission;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;

class CohortController extends Controller
{
    public function index(Request $request)
    {
        $query = Cohort::where('instructor_id', auth()->id())
            ->withCount('enrollments');

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        if ($request->filled('search')) {
            $query->where('title', 'like', '%' . $request->search . '%');
        }

        $cohorts = $query->latest()->paginate(15)->withQueryString();

        return Inertia::render('Instructor/Cohorts/Index', [
            'cohorts' => $cohorts,
            'filters' => $request->only(['status', 'search']),
        ]);
    }

    public function create()
    {
        return Inertia::render('Instructor/Cohorts/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title'                  => 'required|string|max:255',
            'slug'                   => 'nullable|string|max:255|unique:cohorts,slug',
            'description'            => 'nullable|string',
            'type'                   => 'required|in:internship,learning',
            'price_amount'           => 'nullable|numeric|min:0',
            'price_currency'         => 'nullable|string|max:3',
            'registration_opens_at'  => 'nullable|date',
            'starts_at'              => 'nullable|date',
            'task_ordering'          => 'nullable|in:sequential,open',
            'has_free_audit'         => 'boolean',
            'has_waitlist'           => 'boolean',
            'has_leaderboard'        => 'boolean',
            'max_students'           => 'nullable|integer|min:1',
            'completion_threshold'   => 'nullable|integer|min:0|max:100',
        ]);

        if (empty($validated['slug'])) {
            $validated['slug'] = Str::slug($validated['title']);
        }

        $validated['instructor_id'] = auth()->id();
        $validated['status'] = 'draft';

        $cohort = Cohort::create($validated);

        return redirect()->route('instructor.cohorts.show', $cohort)
            ->with('success', 'Cohort created successfully.');
    }

    public function show(Cohort $cohort)
    {
        $this->authorizeOwnership($cohort);

        $cohort->load(['enrollments', 'cohortTasks.task']);
        $cohort->loadCount(['enrollments', 'cohortTasks']);

        $cohortTaskIds = $cohort->cohortTasks->pluck('id');

        $submissionStats = [
            'total'       => TaskSubmission::whereIn('cohort_task_id', $cohortTaskIds)->count(),
            'submitted'   => TaskSubmission::whereIn('cohort_task_id', $cohortTaskIds)->where('status', 'submitted')->count(),
            'ai_reviewed' => TaskSubmission::whereIn('cohort_task_id', $cohortTaskIds)->where('status', 'ai_reviewed')->count(),
            'graded'      => TaskSubmission::whereIn('cohort_task_id', $cohortTaskIds)->where('status', 'graded')->count(),
        ];

        return Inertia::render('Instructor/Cohorts/Show', compact('cohort', 'submissionStats'));
    }

    public function edit(Cohort $cohort)
    {
        $this->authorizeOwnership($cohort);

        return Inertia::render('Instructor/Cohorts/Edit', compact('cohort'));
    }

    public function update(Request $request, Cohort $cohort)
    {
        $this->authorizeOwnership($cohort);

        $validated = $request->validate([
            'title'                  => 'sometimes|required|string|max:255',
            'slug'                   => 'sometimes|required|string|max:255|unique:cohorts,slug,' . $cohort->id,
            'description'            => 'nullable|string',
            'type'                   => 'sometimes|required|in:internship,learning',
            'price_amount'           => 'nullable|numeric|min:0',
            'price_currency'         => 'nullable|string|max:3',
            'registration_opens_at'  => 'nullable|date',
            'starts_at'              => 'nullable|date',
            'task_ordering'          => 'nullable|in:sequential,open',
            'has_free_audit'         => 'boolean',
            'has_waitlist'           => 'boolean',
            'has_leaderboard'        => 'boolean',
            'max_students'           => 'nullable|integer|min:1',
            'completion_threshold'   => 'nullable|integer|min:0|max:100',
            'status'                 => 'sometimes|in:draft,registration_open,in_progress,closed',
        ]);

        $cohort->update($validated);

        return redirect()->route('instructor.cohorts.show', $cohort)
            ->with('success', 'Cohort updated successfully.');
    }

    public function destroy(Cohort $cohort)
    {
        $this->authorizeOwnership($cohort);

        $cohort->delete();

        return redirect()->route('instructor.cohorts.index')
            ->with('success', 'Cohort deleted.');
    }

    public function clone(Cohort $cohort)
    {
        $this->authorizeOwnership($cohort);

        $newCohort = $cohort->replicate(['status', 'cloned_from_id']);
        $newCohort->title = $cohort->title . ' (Clone)';
        $newCohort->slug = Str::slug($newCohort->title) . '-' . now()->timestamp;
        $newCohort->status = 'draft';
        $newCohort->cloned_from_id = $cohort->id;
        $newCohort->save();

        foreach ($cohort->cohortTasks as $cohortTask) {
            $newCohortTask = $cohortTask->replicate();
            $newCohortTask->cohort_id = $newCohort->id;
            $newCohortTask->save();
        }

        return redirect()->route('instructor.cohorts.edit', $newCohort)
            ->with('success', 'Cohort cloned successfully.');
    }

    public function close(Cohort $cohort)
    {
        $this->authorizeOwnership($cohort);

        $cohort->update(['status' => 'closed']);

        return back()->with('success', 'Cohort closed.');
    }

    public function health(Cohort $cohort)
    {
        $this->authorizeOwnership($cohort);

        $totalEnrollments = $cohort->enrollments()->count();
        $activeStudents = $cohort->enrollments()->where('status', 'enrolled')->count();
        $cohortTaskIds = $cohort->cohortTasks()->pluck('id');
        $totalTasks = $cohort->cohortTasks()->count();

        $submissions = TaskSubmission::whereIn('cohort_task_id', $cohortTaskIds);
        $totalSubmissions = $submissions->count();
        $gradedSubmissions = (clone $submissions)->whereIn('status', ['graded', 'passed'])->count();

        $avgTimePerTask = null;
        if ($totalSubmissions > 0) {
            $avgTimePerTask = TaskSubmission::whereIn('cohort_task_id', $cohortTaskIds)
                ->whereNotNull('submitted_at')
                ->selectRaw('AVG(TIMESTAMPDIFF(HOUR, created_at, submitted_at)) as avg_hours')
                ->value('avg_hours');
        }

        $completionRate = $totalTasks > 0 && $activeStudents > 0
            ? round(($gradedSubmissions / ($totalTasks * $activeStudents)) * 100, 2)
            : 0;

        $health = [
            'enrollment_rate'        => $cohort->max_students
                ? round(($totalEnrollments / $cohort->max_students) * 100, 2)
                : null,
            'active_students'        => $activeStudents,
            'inactive_students'      => $totalEnrollments - $activeStudents,
            'task_submission_rate'   => $totalTasks > 0 && $activeStudents > 0
                ? round(($totalSubmissions / ($totalTasks * $activeStudents)) * 100, 2)
                : 0,
            'avg_time_per_task_hours' => $avgTimePerTask ? round($avgTimePerTask, 1) : null,
            'completion_rate'        => $completionRate,
            'completion_projection'  => $cohort->starts_at ? 'on_track' : 'unknown',
        ];

        return Inertia::render('Instructor/Cohorts/Health', compact('cohort', 'health'));
    }

    public function leaderboard(Cohort $cohort)
    {
        $this->authorizeOwnership($cohort);

        $snapshot = LeaderboardSnapshot::where('cohort_id', $cohort->id)
            ->latest()
            ->first();

        return Inertia::render('Instructor/Cohorts/Leaderboard', compact('cohort', 'snapshot'));
    }

    public function updateLandingPage(Request $request, Cohort $cohort)
    {
        $this->authorizeOwnership($cohort);

        $validated = $request->validate([
            'landing_page_content'   => 'nullable|array',
            'landing_page_published' => 'required|boolean',
        ]);

        $cohort->update($validated);

        return back()->with('success', 'Landing page updated.');
    }

    protected function authorizeOwnership(Cohort $cohort): void
    {
        if ($cohort->instructor_id !== auth()->id()) {
            abort(403, 'You do not have permission to access this cohort.');
        }
    }
}
