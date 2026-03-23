<?php

namespace App\Services;

use App\Models\Certificate;
use App\Models\CohortEnrollment;
use App\Models\StudentPortfolio;
use App\Models\TaskSubmission;
use App\Models\User;
use App\Models\UserBadge;
use Illuminate\Support\Str;

class PortfolioService
{
    public function getPortfolioData(User $user): array
    {
        $portfolio = StudentPortfolio::firstOrCreate(
            ['user_id' => $user->id],
            ['slug' => Str::slug($user->name) . '-' . Str::random(6), 'is_public' => true]
        );

        $completedCohorts = CohortEnrollment::where('student_id', $user->id)
            ->whereIn('status', ['completed', 'enrolled'])
            ->with('cohort:id,title,type,slug')
            ->get();

        $certificates = Certificate::where('student_id', $user->id)
            ->with('cohort:id,title,type')
            ->get();

        $projectSubmissions = TaskSubmission::where('student_id', $user->id)
            ->where('type', 'github')
            ->where('status', 'graded')
            ->whereNotNull('github_repo_url')
            ->with('cohortTask.task:id,title')
            ->get();

        $badges = UserBadge::where('user_id', $user->id)
            ->with('badge')
            ->get();

        return [
            'portfolio' => $portfolio,
            'user' => $user->only('id', 'name', 'email', 'avatar_path', 'bio'),
            'completedCohorts' => $completedCohorts,
            'certificates' => $certificates,
            'projectSubmissions' => $projectSubmissions,
            'badges' => $badges,
        ];
    }
}
