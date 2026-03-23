<?php

namespace App\Models;

use App\Enums\EnrollmentStatus;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;

class CohortEnrollment extends Model
{
    protected $fillable = [
        'cohort_id',
        'student_id',
        'status',
        'enrolled_at',
        'completed_at',
        'completion_percent',
        'certificate_issued',
        'streak_current',
        'streak_longest',
        'last_activity_at',
    ];

    protected function casts(): array
    {
        return [
            'status'             => EnrollmentStatus::class,
            'enrolled_at'        => 'datetime',
            'completed_at'       => 'datetime',
            'completion_percent' => 'decimal:2',
            'certificate_issued' => 'boolean',
            'last_activity_at'   => 'datetime',
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

    public function certificate(): HasOne
    {
        return $this->hasOne(Certificate::class, 'enrollment_id');
    }
}
