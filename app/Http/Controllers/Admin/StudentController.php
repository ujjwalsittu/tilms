<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class StudentController extends Controller
{
    public function index(Request $request)
    {
        $query = User::where('role', 'student');

        if ($request->filled('search')) {
            $search = $request->input('search');
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%");
            });
        }

        if ($request->filled('id_verification_status')) {
            $query->where('id_verification_status', $request->input('id_verification_status'));
        }

        $students = $query->latest()->paginate(20)->withQueryString();

        return Inertia::render('Admin/Students/Index', [
            'students' => $students,
            'filters' => $request->only(['search', 'id_verification_status']),
        ]);
    }

    public function show(User $user)
    {
        if ($user->role !== 'student') {
            abort(404);
        }

        $user->load([
            'enrollments.cohort',
            'certificates',
        ]);

        $submissionsCount = $user->submissions()->count();

        return Inertia::render('Admin/Students/Show', [
            'student' => $user,
            'submissionsCount' => $submissionsCount,
        ]);
    }

    public function toggleActive(User $user)
    {
        if ($user->role !== 'student') {
            abort(404);
        }

        $user->update(['is_active' => ! $user->is_active]);

        return back()->with('success', 'Student status updated.');
    }

    public function destroy(User $user)
    {
        if ($user->role !== 'student') {
            abort(404);
        }

        $user->delete();

        return back()->with('success', 'Student deleted successfully.');
    }
}
