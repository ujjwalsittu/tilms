<?php

namespace App\Http\Controllers\Instructor;

use App\Http\Controllers\Controller;
use App\Models\Task;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TaskBankController extends Controller
{
    public function index(Request $request)
    {
        $query = Task::where('creator_id', auth()->id());

        if ($request->filled('type')) {
            $query->where('type', $request->type);
        }

        if ($request->filled('difficulty')) {
            $query->where('difficulty', $request->difficulty);
        }

        if ($request->filled('search')) {
            $query->where('title', 'like', '%' . $request->search . '%');
        }

        $tasks = $query->latest()->paginate(15)->withQueryString();

        return Inertia::render('Instructor/Tasks/Index', [
            'tasks'   => $tasks,
            'filters' => $request->only(['type', 'difficulty', 'search']),
        ]);
    }

    public function create()
    {
        return Inertia::render('Instructor/Tasks/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title'                => 'required|string|max:255',
            'description'          => 'nullable|string',
            'type'                 => 'required|in:individual,project',
            'difficulty'           => 'nullable|in:beginner,intermediate,advanced',
            'programming_language' => 'nullable|string|max:100',
            'tags'                 => 'nullable|array',
            'tags.*'               => 'string|max:100',
            'starter_code'         => 'nullable|string',
            'test_cases'           => 'nullable|array',
            'project_requirements' => 'nullable|string',
        ]);

        $validated['creator_id'] = auth()->id();

        $task = Task::create($validated);

        return redirect()->route('instructor.tasks.show', $task)
            ->with('success', 'Task created successfully.');
    }

    public function show(Task $task)
    {
        $this->authorizeOwnership($task);

        return Inertia::render('Instructor/Tasks/Show', compact('task'));
    }

    public function edit(Task $task)
    {
        $this->authorizeOwnership($task);

        return Inertia::render('Instructor/Tasks/Edit', compact('task'));
    }

    public function update(Request $request, Task $task)
    {
        $this->authorizeOwnership($task);

        $validated = $request->validate([
            'title'                => 'sometimes|required|string|max:255',
            'description'          => 'nullable|string',
            'type'                 => 'sometimes|required|in:individual,project',
            'difficulty'           => 'nullable|in:beginner,intermediate,advanced',
            'programming_language' => 'nullable|string|max:100',
            'tags'                 => 'nullable|array',
            'tags.*'               => 'string|max:100',
            'starter_code'         => 'nullable|string',
            'test_cases'           => 'nullable|array',
            'project_requirements' => 'nullable|string',
        ]);

        $task->update($validated);

        return redirect()->route('instructor.tasks.show', $task)
            ->with('success', 'Task updated successfully.');
    }

    public function destroy(Task $task)
    {
        $this->authorizeOwnership($task);

        $task->delete();

        return redirect()->route('instructor.tasks.index')
            ->with('success', 'Task deleted.');
    }

    protected function authorizeOwnership(Task $task): void
    {
        if ($task->creator_id !== auth()->id()) {
            abort(403, 'You do not have permission to access this task.');
        }
    }
}
