<?php

namespace App\Http\Controllers\Instructor;

use App\Http\Controllers\Controller;
use App\Models\Cohort;
use App\Services\CertificateService;

class CertificationController extends Controller
{
    public function generate(Cohort $cohort, CertificateService $certificateService)
    {
        abort_if($cohort->instructor_id !== auth()->id(), 403);

        $certificates = $certificateService->generateForCohort($cohort);

        return back()->with('success', count($certificates) . ' certificates generated.');
    }
}
