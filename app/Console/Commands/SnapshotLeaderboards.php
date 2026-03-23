<?php

namespace App\Console\Commands;

use App\Models\Cohort;
use App\Services\LeaderboardService;
use Illuminate\Console\Command;

class SnapshotLeaderboards extends Command
{
    protected $signature = 'leaderboard:snapshot';
    protected $description = 'Take daily leaderboard snapshots for all active cohorts';

    public function handle(LeaderboardService $leaderboardService): int
    {
        $cohorts = Cohort::where('status', 'in_progress')->where('has_leaderboard', true)->get();

        foreach ($cohorts as $cohort) {
            $leaderboardService->snapshot($cohort);
        }

        $this->info("Snapshots taken for {$cohorts->count()} cohorts.");
        return Command::SUCCESS;
    }
}
