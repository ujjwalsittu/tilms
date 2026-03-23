<?php

namespace App\Http\Controllers\Instructor;

use App\Http\Controllers\Controller;
use App\Models\Announcement;
use App\Models\Cohort;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AnnouncementController extends Controller
{
    public function index(Cohort $cohort)
    {
        $this->authorizeCohortOwnership($cohort);

        $announcements = $cohort->announcements()
            ->orderByDesc('is_pinned')
            ->latest()
            ->get();

        return Inertia::render('Instructor/Announcements/Index', compact('cohort', 'announcements'));
    }

    public function store(Request $request, Cohort $cohort)
    {
        $this->authorizeCohortOwnership($cohort);

        $validated = $request->validate([
            'title'     => 'required|string|max:255',
            'body'      => 'required|string',
            'is_pinned' => 'boolean',
        ]);

        $validated['cohort_id'] = $cohort->id;
        $validated['author_id'] = auth()->id();

        Announcement::create($validated);

        return back()->with('success', 'Announcement created.');
    }

    public function update(Request $request, Announcement $announcement)
    {
        $this->authorizeAnnouncementOwnership($announcement);

        $validated = $request->validate([
            'title'     => 'sometimes|required|string|max:255',
            'body'      => 'sometimes|required|string',
            'is_pinned' => 'boolean',
        ]);

        $announcement->update($validated);

        return back()->with('success', 'Announcement updated.');
    }

    public function destroy(Announcement $announcement)
    {
        $this->authorizeAnnouncementOwnership($announcement);

        $announcement->delete();

        return back()->with('success', 'Announcement deleted.');
    }

    protected function authorizeCohortOwnership(Cohort $cohort): void
    {
        if ($cohort->instructor_id !== auth()->id()) {
            abort(403, 'You do not have permission to manage announcements for this cohort.');
        }
    }

    protected function authorizeAnnouncementOwnership(Announcement $announcement): void
    {
        $announcement->load('cohort');

        if ($announcement->cohort->instructor_id !== auth()->id()) {
            abort(403, 'You do not have permission to manage this announcement.');
        }
    }
}
