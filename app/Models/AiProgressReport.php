<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AiProgressReport extends Model
{
    public $timestamps = false;

    protected $dates = ['created_at'];

    protected $fillable = [
        'student_id',
        'cohort_id',
        'report_week',
        'summary',
        'strengths',
        'areas_for_improvement',
        'recommendations',
        'metrics',
        'ai_model',
    ];

    protected function casts(): array
    {
        return [
            'report_week'           => 'date',
            'strengths'             => 'json',
            'areas_for_improvement' => 'json',
            'recommendations'       => 'json',
            'metrics'               => 'json',
            'created_at'            => 'datetime',
        ];
    }

    // Relationships

    public function student(): BelongsTo
    {
        return $this->belongsTo(User::class, 'student_id');
    }

    public function cohort(): BelongsTo
    {
        return $this->belongsTo(Cohort::class);
    }
}
