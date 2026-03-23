<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Models\Cohort;
use App\Models\CohortEnrollment;
use App\Models\CohortTask;
use App\Models\TaskSubmission;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CohortController extends Controller
{
    public function index()
    {
        $user = auth()->user();

        $enrollments = CohortEnrollment::where('student_id', $user->id)
            ->with('cohort')
            ->get();

        $cohorts = $enrollments->map(function ($enrollment) use ($user) {
            $cohort = $enrollment->cohort;
            $cohortTaskIds = $cohort->cohortTasks()->pluck('id');
            $totalTasks = $cohortTaskIds->count();

            $completedTasks = TaskSubmission::where('student_id', $user->id)
                ->whereIn('cohort_task_id', $cohortTaskIds)
                ->whereIn('status', ['graded', 'passed'])
                ->count();

            return [
                'id'               => $cohort->id,
                'title'            => $cohort->title,
                'slug'             => $cohort->slug,
                'status'           => $cohort->status,
                'type'             => $cohort->type,
                'enrollment_status' => $enrollment->status,
                'enrolled_at'      => $enrollment->created_at,
                'total_tasks'      => $totalTasks,
                'completed_tasks'  => $completedTasks,
                'progress'         => $totalTasks > 0
                    ? round(($completedTasks / $totalTasks) * 100, 1)
                    : 0,
            ];
        });

        return Inertia::render('Student/Cohorts/Index', compact('cohorts'));
    }

    public function show(Cohort $cohort)
    {
        $user = auth()->user();

        $enrollment = CohortEnrollment::where('cohort_id', $cohort->id)
            ->where('student_id', $user->id)
            ->first();

        if (! $enrollment) {
            abort(403, 'You are not enrolled in this cohort.');
        }

        $cohortTasks = CohortTask::where('cohort_id', $cohort->id)
            ->with('task')
            ->orderBy('order_index')
            ->get();

        $submissions = TaskSubmission::where('student_id', $user->id)
            ->whereIn('cohort_task_id', $cohortTasks->pluck('id'))
            ->get()
            ->keyBy('cohort_task_id');

        $tasks = $cohortTasks->map(function ($cohortTask) use ($submissions) {
            return [
                'cohort_task_id' => $cohortTask->id,
                'task'           => $cohortTask->task,
                'order_index'    => $cohortTask->order_index,
                'opens_at'       => $cohortTask->opens_at,
                'due_at'         => $cohortTask->due_at,
                'submission'     => $submissions->get($cohortTask->id),
            ];
        });

        $announcements = $cohort->announcements()
            ->orderByDesc('is_pinned')
            ->latest()
            ->take(10)
            ->get();

        return Inertia::render('Student/Cohorts/Show', compact('cohort', 'enrollment', 'tasks', 'announcements'));
    }

    public function enroll(Request $request, Cohort $cohort)
    {
        $user = auth()->user();

        $validated = $request->validate([
            'coupon_code' => 'nullable|string|max:100',
        ]);

        $existing = CohortEnrollment::where('cohort_id', $cohort->id)
            ->where('student_id', $user->id)
            ->first();

        if ($existing) {
            return back()->with('error', 'You are already enrolled in this cohort.');
        }

        if ($cohort->max_students) {
            $currentCount = CohortEnrollment::where('cohort_id', $cohort->id)
                ->where('status', 'enrolled')
                ->count();

            if ($currentCount >= $cohort->max_students) {
                if ($cohort->has_waitlist) {
                    CohortEnrollment::create([
                        'cohort_id'   => $cohort->id,
                        'student_id'  => $user->id,
                        'status'      => 'waitlisted',
                        'coupon_code' => $validated['coupon_code'] ?? null,
                    ]);

                    return back()->with('success', 'You have been added to the waitlist.');
                }

                return back()->with('error', 'This cohort is full.');
            }
        }

        CohortEnrollment::create([
            'cohort_id'   => $cohort->id,
            'student_id'  => $user->id,
            'status'      => 'enrolled',
            'coupon_code' => $validated['coupon_code'] ?? null,
        ]);

        return redirect()->route('student.cohorts.show', $cohort)
            ->with('success', 'Successfully enrolled in cohort.');
    }
}
