<?php

namespace App\Http\Controllers\Student;

use App\Events\SubmissionCreated;
use App\Http\Controllers\Controller;
use App\Models\CohortTask;
use App\Models\TaskSubmission;
use Illuminate\Http\Request;

class GitHubSubmissionController extends Controller
{
    public function submit(Request $request, CohortTask $cohortTask)
    {
        $validated = $request->validate([
            'github_repo_url'   => ['required', 'url', 'regex:/github\.com/'],
            'github_commit_sha' => 'nullable|string|max:40',
        ]);

        $student = auth()->user();

        $enrollment = $cohortTask->cohort->enrollments()
            ->where('student_id', $student->id)
            ->firstOrFail();

        abort_if($cohortTask->cohort->status === 'closed', 403, 'This cohort is closed.');

        $attemptNumber = TaskSubmission::where('cohort_task_id', $cohortTask->id)
            ->where('student_id', $student->id)
            ->count() + 1;

        $submission = TaskSubmission::create([
            'cohort_task_id'    => $cohortTask->id,
            'student_id'        => $student->id,
            'type'              => 'github',
            'status'            => 'submitted',
            'github_repo_url'   => $validated['github_repo_url'],
            'github_commit_sha' => $validated['github_commit_sha'],
            'submitted_at'      => now(),
            'attempt_number'    => $attemptNumber,
        ]);

        event(new SubmissionCreated($submission));

        return redirect()->route('student.cohorts.show', $cohortTask->cohort_id)
            ->with('success', 'GitHub project submitted successfully!');
    }
}
