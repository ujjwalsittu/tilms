<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class LeaderboardSnapshot extends Model
{
    public $timestamps = false;

    protected $dates = ['created_at'];

    protected $fillable = [
        'cohort_id',
        'student_id',
        'rank',
        'score',
        'tasks_completed',
        'average_grade',
        'streak_days',
        'snapshot_date',
    ];

    protected function casts(): array
    {
        return [
            'score'         => 'decimal:2',
            'average_grade' => 'decimal:2',
            'snapshot_date' => 'date',
            'created_at'    => 'datetime',
        ];
    }

    // Relationships

    public function cohort(): BelongsTo
    {
        return $this->belongsTo(Cohort::class);
    }

    public function student(): BelongsTo
    {
        return $this->belongsTo(User::class, 'student_id');
    }
}
