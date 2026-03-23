<?php

namespace App\Models;

use App\Enums\TaskDifficulty;
use App\Enums\TaskType;
use App\Traits\HasUuid;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasManyThrough;
use Illuminate\Database\Eloquent\SoftDeletes;

class Task extends Model
{
    use HasUuid, SoftDeletes;

    protected $fillable = [
        'creator_id',
        'title',
        'description',
        'type',
        'difficulty',
        'estimated_minutes',
        'programming_language',
        'tags',
        'starter_code',
        'test_cases',
        'project_requirements',
        'github_repo_template',
        'ai_generation_prompt',
        'ai_generated_content',
        'ai_evaluation_rubric',
        'ai_model_preference',
        'is_ai_generated',
        'metadata',
    ];

    protected function casts(): array
    {
        return [
            'type'                 => TaskType::class,
            'difficulty'           => TaskDifficulty::class,
            'tags'                 => 'json',
            'test_cases'           => 'json',
            'ai_generated_content' => 'json',
            'ai_evaluation_rubric' => 'json',
            'is_ai_generated'      => 'boolean',
            'metadata'             => 'json',
        ];
    }

    // Relationships

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'creator_id');
    }

    public function cohorts(): BelongsToMany
    {
        return $this->belongsToMany(Cohort::class, 'cohort_tasks');
    }

    public function cohortTasks(): HasMany
    {
        return $this->hasMany(CohortTask::class);
    }

    public function discussions(): HasManyThrough
    {
        return $this->hasManyThrough(TaskDiscussion::class, CohortTask::class);
    }
}
