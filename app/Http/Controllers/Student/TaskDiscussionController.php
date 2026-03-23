<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Models\CohortTask;
use App\Models\TaskDiscussion;
use Illuminate\Http\Request;

class TaskDiscussionController extends Controller
{
    public function store(Request $request, CohortTask $cohortTask)
    {
        $validated = $request->validate([
            'body'      => 'required|string|max:5000',
            'parent_id' => 'nullable|exists:task_discussions,id',
        ]);

        // Verify enrollment in the cohort
        $cohortTask->cohort->enrollments()
            ->where('student_id', auth()->id())
            ->firstOrFail();

        TaskDiscussion::create([
            'cohort_task_id' => $cohortTask->id,
            'user_id'        => auth()->id(),
            'parent_id'      => $validated['parent_id'] ?? null,
            'body'           => $validated['body'],
        ]);

        return back()->with('success', 'Comment posted.');
    }

    public function destroy(TaskDiscussion $discussion)
    {
        abort_if($discussion->user_id !== auth()->id(), 403);
        $discussion->delete();
        return back()->with('success', 'Comment deleted.');
    }
}
