<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\Cohort;
use Inertia\Inertia;

class CohortLandingController extends Controller
{
    public function show(string $slug)
    {
        $cohort = Cohort::where('slug', $slug)
            ->with('instructor:id,name,bio,avatar')
            ->withCount(['cohortTasks', 'enrollments'])
            ->firstOrFail();

        return Inertia::render('Public/CohortLanding', compact('cohort'));
    }
}
