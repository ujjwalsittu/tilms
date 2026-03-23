<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class CohortTask extends Model
{
    protected $fillable = [
        'cohort_id',
        'task_id',
        'order_index',
        'is_published',
        'opens_at',
        'due_at',
    ];

    protected function casts(): array
    {
        return [
            'is_published' => 'boolean',
            'opens_at'     => 'datetime',
            'due_at'       => 'datetime',
        ];
    }

    // Relationships

    public function cohort(): BelongsTo
    {
        return $this->belongsTo(Cohort::class);
    }

    public function task(): BelongsTo
    {
        return $this->belongsTo(Task::class);
    }

    public function submissions(): HasMany
    {
        return $this->hasMany(TaskSubmission::class);
    }

    public function discussions(): HasMany
    {
        return $this->hasMany(TaskDiscussion::class);
    }
}
