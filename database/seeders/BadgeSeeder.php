<?php

namespace Database\Seeders;

use App\Models\Badge;
use Illuminate\Database\Seeder;

class BadgeSeeder extends Seeder
{
    public function run(): void
    {
        $badges = [
            ['name' => 'First Steps', 'description' => 'Complete your first task', 'icon_path' => 'badges/first-steps.svg', 'criteria_type' => 'tasks_completed', 'criteria_value' => 1],
            ['name' => 'Getting Started', 'description' => 'Complete 5 tasks', 'icon_path' => 'badges/getting-started.svg', 'criteria_type' => 'tasks_completed', 'criteria_value' => 5],
            ['name' => 'Task Master', 'description' => 'Complete 10 tasks', 'icon_path' => 'badges/task-master.svg', 'criteria_type' => 'tasks_completed', 'criteria_value' => 10],
            ['name' => 'Prolific', 'description' => 'Complete 25 tasks', 'icon_path' => 'badges/prolific.svg', 'criteria_type' => 'tasks_completed', 'criteria_value' => 25],
            ['name' => 'On Fire', 'description' => '3-day activity streak', 'icon_path' => 'badges/on-fire.svg', 'criteria_type' => 'streak_days', 'criteria_value' => 3],
            ['name' => 'Consistent', 'description' => '7-day activity streak', 'icon_path' => 'badges/consistent.svg', 'criteria_type' => 'streak_days', 'criteria_value' => 7],
            ['name' => 'Dedicated', 'description' => '14-day activity streak', 'icon_path' => 'badges/dedicated.svg', 'criteria_type' => 'streak_days', 'criteria_value' => 14],
            ['name' => 'Unstoppable', 'description' => '30-day activity streak', 'icon_path' => 'badges/unstoppable.svg', 'criteria_type' => 'streak_days', 'criteria_value' => 30],
        ];

        foreach ($badges as $badge) {
            Badge::firstOrCreate(['name' => $badge['name']], array_merge($badge, ['created_at' => now()]));
        }
    }
}
