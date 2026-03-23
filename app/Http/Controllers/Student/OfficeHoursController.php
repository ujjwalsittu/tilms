<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Models\CohortEnrollment;
use App\Models\OfficeHoursBooking;
use App\Models\OfficeHoursSlot;
use Illuminate\Http\Request;
use Inertia\Inertia;

class OfficeHoursController extends Controller
{
    public function index()
    {
        $student = auth()->user();

        // Get instructor IDs for cohorts the student is enrolled in
        $enrolledCohortIds = CohortEnrollment::where('user_id', $student->id)
            ->where('status', 'active')
            ->pluck('cohort_id');

        // Get upcoming slots from those cohorts' instructors
        $slots = OfficeHoursSlot::whereIn('cohort_id', $enrolledCohortIds)
            ->where('starts_at', '>', now())
            ->withCount('bookings')
            ->with('instructor:id,name')
            ->orderBy('starts_at')
            ->get()
            ->map(function ($slot) use ($student) {
                $isBooked = OfficeHoursBooking::where('slot_id', $slot->id)
                    ->where('student_id', $student->id)
                    ->exists();

                return [
                    'id'             => $slot->id,
                    'starts_at'      => $slot->starts_at?->toIso8601String(),
                    'ends_at'        => $slot->ends_at?->toIso8601String(),
                    'capacity'       => $slot->max_attendees,
                    'bookings_count' => $slot->bookings_count,
                    'meeting_url'    => $slot->meeting_url,
                    'is_booked'      => $isBooked,
                    'instructor'     => $slot->instructor ? ['name' => $slot->instructor->name] : null,
                ];
            });

        return Inertia::render('Student/OfficeHours/Available', [
            'slots' => $slots,
        ]);
    }

    public function book(Request $request, OfficeHoursSlot $slot)
    {
        $student = auth()->user();

        // Check already booked
        $alreadyBooked = OfficeHoursBooking::where('slot_id', $slot->id)
            ->where('student_id', $student->id)
            ->exists();

        if ($alreadyBooked) {
            return back()->with('error', 'You have already booked this slot.');
        }

        // Check capacity
        $bookingsCount = OfficeHoursBooking::where('slot_id', $slot->id)->count();
        if ($bookingsCount >= ($slot->max_attendees ?? 1)) {
            return back()->with('error', 'This slot is fully booked.');
        }

        OfficeHoursBooking::create([
            'slot_id'    => $slot->id,
            'student_id' => $student->id,
            'status'     => 'confirmed',
        ]);

        return back()->with('success', 'Office hours slot booked successfully!');
    }
}
