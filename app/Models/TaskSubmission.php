<?php

namespace App\Models;

use App\Enums\SubmissionStatus;
use App\Enums\SubmissionType;
use App\Traits\HasUuid;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class TaskSubmission extends Model
{
    use HasUuid;

    protected $fillable = [
        'cohort_task_id',
        'student_id',
        'type',
        'status',
        'code_content',
        'code_language',
        'github_repo_url',
        'github_commit_sha',
        'ai_evaluation_report',
        'ai_score',
        'ai_feedback',
        'ai_plagiarism_score',
        'ai_generated_code_score',
        'instructor_score',
        'instructor_feedback',
        'submitted_at',
        'reviewed_at',
        'attempt_number',
        'metadata',
    ];

    protected function casts(): array
    {
        return [
            'type'                    => SubmissionType::class,
            'status'                  => SubmissionStatus::class,
            'ai_evaluation_report'    => 'json',
            'ai_score'                => 'decimal:2',
            'ai_plagiarism_score'     => 'decimal:2',
            'ai_generated_code_score' => 'decimal:2',
            'instructor_score'        => 'decimal:2',
            'submitted_at'            => 'datetime',
            'reviewed_at'             => 'datetime',
            'metadata'                => 'json',
        ];
    }

    // Relationships

    public function cohortTask(): BelongsTo
    {
        return $this->belongsTo(CohortTask::class);
    }

    public function student(): BelongsTo
    {
        return $this->belongsTo(User::class, 'student_id');
    }
}
