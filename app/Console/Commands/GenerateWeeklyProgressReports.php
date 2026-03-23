<?php

namespace App\Console\Commands;

use App\Jobs\Ai\GenerateWeeklyReport;
use App\Models\CohortEnrollment;
use Illuminate\Console\Command;

class GenerateWeeklyProgressReports extends Command
{
    protected $signature = 'reports:weekly-progress';
    protected $description = 'Generate AI-powered weekly progress reports for all active students';

    public function handle(): int
    {
        $enrollments = CohortEnrollment::where('status', 'enrolled')
            ->with('cohort')
            ->get();

        $count = 0;
        foreach ($enrollments as $enrollment) {
            if ($enrollment->cohort->status === 'in_progress') {
                GenerateWeeklyReport::dispatch($enrollment->student_id, $enrollment->cohort_id);
                $count++;
            }
        }

        $this->info("Dispatched {$count} weekly report generation jobs.");
        return Command::SUCCESS;
    }
}
