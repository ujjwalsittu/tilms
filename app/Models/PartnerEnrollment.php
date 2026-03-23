<?php

namespace App\Models;

use App\Enums\PartnerEnrollmentVia;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PartnerEnrollment extends Model
{
    public $timestamps = false;

    protected $dates = ['created_at'];

    protected $fillable = [
        'partner_id',
        'cohort_id',
        'student_id',
        'enrolled_via',
    ];

    protected function casts(): array
    {
        return [
            'enrolled_via' => PartnerEnrollmentVia::class,
            'created_at'   => 'datetime',
        ];
    }

    // Relationships

    public function partner(): BelongsTo
    {
        return $this->belongsTo(InstitutionalPartner::class);
    }

    public function cohort(): BelongsTo
    {
        return $this->belongsTo(Cohort::class);
    }

    public function student(): BelongsTo
    {
        return $this->belongsTo(User::class, 'student_id');
    }
}
