<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

Schedule::command('reports:weekly-progress')->weeklyOn(1, '06:00');
Schedule::command('leaderboard:snapshot')->dailyAt('02:00');
