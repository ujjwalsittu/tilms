<?php

namespace App\Http\Controllers\Instructor;

use App\Http\Controllers\Controller;
use App\Models\OfficeHoursSlot;
use Illuminate\Http\Request;
use Inertia\Inertia;

class OfficeHoursController extends Controller
{
    public function index()
    {
        $slots = OfficeHoursSlot::where('instructor_id', auth()->id())
            ->withCount('bookings')
            ->orderBy('starts_at')
            ->get();

        return Inertia::render('Instructor/OfficeHours/Index', compact('slots'));
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'starts_at'       => 'required|date|after:now',
            'ends_at'         => 'required|date|after:starts_at',
            'max_attendees'   => 'required|integer|min:1',
            'meeting_url'     => 'nullable|url',
            'cohort_id'       => 'nullable|exists:cohorts,id',
            'is_recurring'    => 'boolean',
            'recurrence_rule' => 'nullable|string|max:500',
        ]);

        $validated['instructor_id'] = auth()->id();

        $slot = OfficeHoursSlot::create($validated);

        return back()->with('success', 'Office hours slot created.');
    }

    public function update(Request $request, OfficeHoursSlot $slot)
    {
        $this->authorizeOwnership($slot);

        $validated = $request->validate([
            'starts_at'       => 'sometimes|required|date',
            'ends_at'         => 'sometimes|required|date|after:starts_at',
            'max_attendees'   => 'sometimes|required|integer|min:1',
            'meeting_url'     => 'nullable|url',
            'cohort_id'       => 'nullable|exists:cohorts,id',
            'is_recurring'    => 'boolean',
            'recurrence_rule' => 'nullable|string|max:500',
        ]);

        $slot->update($validated);

        return back()->with('success', 'Office hours slot updated.');
    }

    public function destroy(OfficeHoursSlot $slot)
    {
        $this->authorizeOwnership($slot);

        $slot->delete();

        return back()->with('success', 'Office hours slot deleted.');
    }

    protected function authorizeOwnership(OfficeHoursSlot $slot): void
    {
        if ($slot->instructor_id !== auth()->id()) {
            abort(403, 'You do not have permission to manage this office hours slot.');
        }
    }
}
