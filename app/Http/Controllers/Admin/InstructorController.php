<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\InstructorProfile;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;

class InstructorController extends Controller
{
    public function index(Request $request)
    {
        $query = User::where('role', 'instructor')
            ->with('instructorProfile');

        if ($request->filled('search')) {
            $search = $request->input('search');
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%");
            });
        }

        $instructors = $query->latest()->paginate(20)->withQueryString();

        return Inertia::render('Admin/Instructors/Index', [
            'instructors' => $instructors,
            'filters' => $request->only(['search']),
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/Instructors/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users'],
            'password' => ['required', 'string', 'min:8'],
            'specialization' => ['nullable', 'string', 'max:255'],
            'title' => ['nullable', 'string', 'max:255'],
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'role' => 'instructor',
        ]);

        InstructorProfile::create([
            'user_id' => $user->id,
            'specialization' => $validated['specialization'] ?? null,
            'title' => $validated['title'] ?? null,
        ]);

        return redirect()->route('admin.instructors.index')
            ->with('success', 'Instructor created successfully.');
    }

    public function show(User $user)
    {
        if (($user->role?->value ?? $user->role) !== 'instructor') {
            abort(404);
        }

        $user->load('instructorProfile');

        $stats = [
            'cohorts_count' => $user->cohorts()->count(),
            'total_students' => $user->cohorts()
                ->withCount('enrollments')
                ->get()
                ->sum('enrollments_count'),
            'total_revenue' => $user->cohorts()
                ->join('payments', 'cohorts.id', '=', 'payments.cohort_id')
                ->where('payments.status', 'captured')
                ->sum('payments.amount'),
        ];

        return Inertia::render('Admin/Instructors/Show', [
            'instructor' => $user,
            'stats' => $stats,
        ]);
    }

    public function edit(User $user)
    {
        if (($user->role?->value ?? $user->role) !== 'instructor') {
            abort(404);
        }

        $user->load('instructorProfile');

        return Inertia::render('Admin/Instructors/Edit', [
            'instructor' => $user,
        ]);
    }

    public function update(Request $request, User $user)
    {
        if (($user->role?->value ?? $user->role) !== 'instructor') {
            abort(404);
        }

        $validated = $request->validate([
            'name'           => ['required', 'string', 'max:255'],
            'email'          => ['required', 'string', 'email', 'max:255', 'unique:users,email,' . $user->id],
            'password'       => ['nullable', 'string', 'min:8'],
            'specialization' => ['nullable', 'string', 'max:255'],
            'title'          => ['nullable', 'string', 'max:255'],
            'is_verified'    => ['nullable', 'boolean'],
        ]);

        $user->update([
            'name' => $validated['name'],
            'email' => $validated['email'],
            ...($validated['password'] ? ['password' => Hash::make($validated['password'])] : []),
        ]);

        $user->instructorProfile()->updateOrCreate(
            ['user_id' => $user->id],
            [
                'specialization' => $validated['specialization'] ?? null,
                'title'          => $validated['title'] ?? null,
                'is_verified'    => $request->boolean('is_verified'),
            ]
        );

        return redirect()->route('admin.instructors.index')
            ->with('success', 'Instructor updated successfully.');
    }

    public function destroy(User $user)
    {
        if (($user->role?->value ?? $user->role) !== 'instructor') {
            abort(404);
        }

        $user->delete();

        return redirect()->route('admin.instructors.index')
            ->with('success', 'Instructor deleted successfully.');
    }

    public function toggleActive(User $user)
    {
        if (($user->role?->value ?? $user->role) !== 'instructor') {
            abort(404);
        }

        $user->update(['is_active' => ! $user->is_active]);

        return back()->with('success', 'Instructor status updated.');
    }
}
