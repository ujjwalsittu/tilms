<?php

namespace App\Http\Controllers\Student;

use App\Events\SubmissionCreated;
use App\Http\Controllers\Controller;
use App\Models\CohortTask;
use App\Models\TaskSubmission;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CodeEditorController extends Controller
{
    public function show(TaskSubmission $submission)
    {
        abort_if($submission->student_id !== auth()->id(), 403);
        $submission->load('cohortTask.task', 'cohortTask.cohort');

        return Inertia::render('Student/Tasks/CodeEditor', [
            'submission' => $submission,
            'task'       => $submission->cohortTask->task,
            'cohort'     => $submission->cohortTask->cohort,
        ]);
    }

    public function submit(Request $request, CohortTask $cohortTask)
    {
        $validated = $request->validate([
            'code_content'  => 'required|string',
            'code_language' => 'required|string|max:50',
        ]);

        $student = auth()->user();

        // Check enrollment
        $enrollment = $cohortTask->cohort->enrollments()
            ->where('student_id', $student->id)
            ->firstOrFail();

        // Check if cohort is closed - no new submissions
        abort_if($cohortTask->cohort->status === 'closed', 403, 'This cohort is closed.');

        // Get attempt number
        $attemptNumber = TaskSubmission::where('cohort_task_id', $cohortTask->id)
            ->where('student_id', $student->id)
            ->count() + 1;

        $submission = TaskSubmission::create([
            'cohort_task_id' => $cohortTask->id,
            'student_id'     => $student->id,
            'type'           => 'code',
            'status'         => 'submitted',
            'code_content'   => $validated['code_content'],
            'code_language'  => $validated['code_language'],
            'submitted_at'   => now(),
            'attempt_number' => $attemptNumber,
        ]);

        event(new SubmissionCreated($submission));

        return redirect()->route('student.cohorts.show', $cohortTask->cohort_id)
            ->with('success', 'Code submitted successfully!');
    }

    public function saveDraft(Request $request, TaskSubmission $submission)
    {
        abort_if($submission->student_id !== auth()->id(), 403);
        abort_unless($submission->status === 'draft', 403);

        $submission->update([
            'code_content'  => $request->input('code_content'),
            'code_language' => $request->input('code_language'),
        ]);

        return back()->with('success', 'Draft saved.');
    }
}
