<?php

namespace App\Http\Controllers\Instructor;

use App\Events\SubmissionGraded;
use App\Http\Controllers\Controller;
use App\Models\Cohort;
use App\Models\CohortTask;
use App\Models\TaskSubmission;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SubmissionReviewController extends Controller
{
    public function index(Request $request)
    {
        $instructorCohortIds = Cohort::where('instructor_id', auth()->id())->pluck('id');
        $cohortTaskIds = CohortTask::whereIn('cohort_id', $instructorCohortIds)->pluck('id');

        $query = TaskSubmission::with(['student', 'cohortTask.task', 'cohortTask.cohort'])
            ->whereIn('cohort_task_id', $cohortTaskIds);

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        if ($request->filled('cohort_id')) {
            $filteredTaskIds = CohortTask::where('cohort_id', $request->cohort_id)->pluck('id');
            $query->whereIn('cohort_task_id', $filteredTaskIds);
        }

        $submissions = $query->latest()->paginate(20)->withQueryString();

        $cohorts = Cohort::where('instructor_id', auth()->id())
            ->select('id', 'title')
            ->get();

        return Inertia::render('Instructor/Submissions/Index', [
            'submissions' => $submissions,
            'cohorts'     => $cohorts,
            'filters'     => $request->only(['status', 'cohort_id']),
        ]);
    }

    public function show(TaskSubmission $submission)
    {
        $this->authorizeSubmission($submission);

        $submission->load([
            'student',
            'cohortTask.task',
            'cohortTask.cohort',
            'aiEvaluationReport',
        ]);

        return Inertia::render('Instructor/Submissions/Show', compact('submission'));
    }

    public function grade(Request $request, TaskSubmission $submission)
    {
        $this->authorizeSubmission($submission);

        $validated = $request->validate([
            'instructor_score'    => 'required|integer|min:0|max:100',
            'instructor_feedback' => 'nullable|string',
            'decision'            => 'required|in:approve,reject,return',
        ]);

        $status = match ($validated['decision']) {
            'approve' => 'graded',
            'reject'  => 'graded',
            'return'  => 'returned',
        };

        $submission->update([
            'instructor_score'    => $validated['instructor_score'],
            'instructor_feedback' => $validated['instructor_feedback'],
            'status'              => $status,
            'reviewed_at'         => now(),
        ]);

        event(new SubmissionGraded($submission));

        return back()->with('success', 'Submission graded.');
    }

    protected function authorizeSubmission(TaskSubmission $submission): void
    {
        $instructorCohortIds = Cohort::where('instructor_id', auth()->id())->pluck('id');
        $cohortTaskIds = CohortTask::whereIn('cohort_id', $instructorCohortIds)->pluck('id');

        if (! $cohortTaskIds->contains($submission->cohort_task_id)) {
            abort(403, 'You do not have permission to access this submission.');
        }
    }
}
