<?php

namespace App\Http\Controllers\Instructor;

use App\Http\Controllers\Controller;
use App\Models\Cohort;
use App\Models\CohortEnrollment;
use App\Models\Newsletter;
use Illuminate\Http\Request;
use Inertia\Inertia;

class NewsletterController extends Controller
{
    public function compose(Cohort $cohort)
    {
        $this->authorizeCohortOwnership($cohort);

        $studentCount = CohortEnrollment::where('cohort_id', $cohort->id)
            ->where('status', 'enrolled')
            ->count();

        return Inertia::render('Instructor/Newsletter/Compose', compact('cohort', 'studentCount'));
    }

    public function send(Request $request, Cohort $cohort)
    {
        $this->authorizeCohortOwnership($cohort);

        $validated = $request->validate([
            'subject' => 'required|string|max:255',
            'body'    => 'required|string',
        ]);

        Newsletter::create([
            'cohort_id'   => $cohort->id,
            'sender_id'   => auth()->id(),
            'subject'     => $validated['subject'],
            'body'        => $validated['body'],
            'status'      => 'sent',
            'sent_at'     => now(),
        ]);

        return back()->with('success', 'Newsletter sent.');
    }

    protected function authorizeCohortOwnership(Cohort $cohort): void
    {
        if ($cohort->instructor_id !== auth()->id()) {
            abort(403, 'You do not have permission to send newsletters for this cohort.');
        }
    }
}
