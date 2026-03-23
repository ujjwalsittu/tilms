<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class StreakLog extends Model
{
    public $timestamps = false;

    protected $dates = ['created_at'];

    protected $fillable = [
        'user_id',
        'cohort_id',
        'activity_date',
        'activity_type',
    ];

    protected function casts(): array
    {
        return [
            'activity_date' => 'date',
            'created_at'    => 'datetime',
        ];
    }

    // Relationships

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function cohort(): BelongsTo
    {
        return $this->belongsTo(Cohort::class);
    }
}
