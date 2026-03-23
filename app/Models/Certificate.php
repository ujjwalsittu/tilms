<?php

namespace App\Models;

use App\Traits\HasUuid;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Certificate extends Model
{
    use HasUuid;

    public $timestamps = false;

    protected $dates = ['created_at'];

    protected $fillable = [
        'student_id',
        'cohort_id',
        'enrollment_id',
        'template_id',
        'certificate_number',
        'qr_code_path',
        'pdf_path',
        'verification_url',
        'issued_at',
        'emailed_at',
        'digital_signature',
        'metadata',
    ];

    protected function casts(): array
    {
        return [
            'issued_at'   => 'datetime',
            'emailed_at'  => 'datetime',
            'metadata'    => 'json',
            'created_at'  => 'datetime',
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

    public function enrollment(): BelongsTo
    {
        return $this->belongsTo(CohortEnrollment::class, 'enrollment_id');
    }

    public function template(): BelongsTo
    {
        return $this->belongsTo(CertificateTemplate::class, 'template_id');
    }
}
