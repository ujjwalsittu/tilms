<?php

namespace App\Http\Controllers\Instructor;

use App\Http\Controllers\Controller;
use App\Models\Cohort;
use App\Models\CohortTask;
use App\Models\Task;
use Illuminate\Http\Request;

class CohortTaskController extends Controller
{
    public function store(Request $request, Cohort $cohort)
    {
        $this->authorizeOwnership($cohort);

        $validated = $request->validate([
            'task_id'     => 'required|exists:tasks,id',
            'order_index' => 'required|integer|min:0',
            'opens_at'    => 'nullable|date',
            'due_at'      => 'nullable|date|after_or_equal:opens_at',
        ]);

        $validated['cohort_id'] = $cohort->id;

        $cohortTask = CohortTask::create($validated);

        return back()->with('success', 'Task assigned to cohort.');
    }

    public function reorder(Request $request, Cohort $cohort, Task $task)
    {
        $this->authorizeOwnership($cohort);

        $validated = $request->validate([
            'order_index' => 'required|integer|min:0',
        ]);

        CohortTask::where('cohort_id', $cohort->id)
            ->where('task_id', $task->id)
            ->update(['order_index' => $validated['order_index']]);

        return back()->with('success', 'Task order updated.');
    }

    public function destroy(Cohort $cohort, Task $task)
    {
        $this->authorizeOwnership($cohort);

        CohortTask::where('cohort_id', $cohort->id)
            ->where('task_id', $task->id)
            ->delete();

        return back()->with('success', 'Task removed from cohort.');
    }

    protected function authorizeOwnership(Cohort $cohort): void
    {
        if ($cohort->instructor_id !== auth()->id()) {
            abort(403, 'You do not have permission to manage tasks for this cohort.');
        }
    }
}
