<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class TaskDiscussion extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'cohort_task_id',
        'user_id',
        'parent_id',
        'body',
        'is_pinned',
    ];

    protected function casts(): array
    {
        return [
            'is_pinned' => 'boolean',
        ];
    }

    // Relationships

    public function cohortTask(): BelongsTo
    {
        return $this->belongsTo(CohortTask::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function parent(): BelongsTo
    {
        return $this->belongsTo(TaskDiscussion::class, 'parent_id');
    }

    public function replies(): HasMany
    {
        return $this->hasMany(TaskDiscussion::class, 'parent_id');
    }
}
