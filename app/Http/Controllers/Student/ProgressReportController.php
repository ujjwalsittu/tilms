<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Models\AiProgressReport;
use Inertia\Inertia;

class ProgressReportController extends Controller
{
    public function index()
    {
        $reports = AiProgressReport::where('student_id', auth()->id())
            ->with('cohort')
            ->latest('report_week')
            ->paginate(20);

        return Inertia::render('Student/Ai/ProgressReports', [
            'reports' => $reports,
        ]);
    }

    public function show(AiProgressReport $report)
    {
        abort_if($report->student_id !== auth()->id(), 403);
        $report->load('cohort');

        return Inertia::render('Student/Ai/ProgressReportDetail', [
            'report' => $report,
        ]);
    }
}
