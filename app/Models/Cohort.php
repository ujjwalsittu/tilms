<?php

namespace App\Models;

use App\Enums\CohortStatus;
use App\Enums\CohortType;
use App\Traits\Auditable;
use App\Traits\HasUuid;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasManyThrough;
use Illuminate\Database\Eloquent\SoftDeletes;

class Cohort extends Model
{
    use Auditable, HasFactory, HasUuid, SoftDeletes;

    protected $fillable = [
        'instructor_id',
        'title',
        'slug',
        'description',
        'type',
        'status',
        'registration_opens_at',
        'registration_closes_at',
        'starts_at',
        'price_amount',
        'price_currency',
        'has_free_audit',
        'max_students',
        'has_waitlist',
        'invite_code',
        'landing_page_content',
        'landing_page_published',
        'task_ordering',
        'has_leaderboard',
        'completion_threshold',
        'certificate_template_id',
        'cloned_from_id',
        'metadata',
    ];

    protected function casts(): array
    {
        return [
            'type'                    => CohortType::class,
            'status'                  => CohortStatus::class,
            'registration_opens_at'   => 'datetime',
            'registration_closes_at'  => 'datetime',
            'starts_at'               => 'datetime',
            'price_amount'            => 'decimal:2',
            'has_free_audit'          => 'boolean',
            'has_waitlist'            => 'boolean',
            'landing_page_content'    => 'json',
            'landing_page_published'  => 'boolean',
            'has_leaderboard'         => 'boolean',
            'completion_threshold'    => 'decimal:2',
            'metadata'                => 'json',
        ];
    }

    // Relationships

    public function instructor(): BelongsTo
    {
        return $this->belongsTo(User::class, 'instructor_id');
    }

    public function coInstructors(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'cohort_co_instructors')
            ->withPivot('permissions');
    }

    public function enrollments(): HasMany
    {
        return $this->hasMany(CohortEnrollment::class);
    }

    public function students(): HasManyThrough
    {
        return $this->hasManyThrough(User::class, CohortEnrollment::class, 'cohort_id', 'id', 'id', 'student_id');
    }

    public function tasks(): BelongsToMany
    {
        return $this->belongsToMany(Task::class, 'cohort_tasks')
            ->withPivot('order_index', 'is_published', 'opens_at', 'due_at');
    }

    public function cohortTasks(): HasMany
    {
        return $this->hasMany(CohortTask::class);
    }

    public function waitlists(): HasMany
    {
        return $this->hasMany(Waitlist::class);
    }

    public function announcements(): HasMany
    {
        return $this->hasMany(Announcement::class);
    }

    public function certificates(): HasMany
    {
        return $this->hasMany(Certificate::class);
    }

    public function certificateTemplate(): BelongsTo
    {
        return $this->belongsTo(CertificateTemplate::class);
    }

    public function clonedFrom(): BelongsTo
    {
        return $this->belongsTo(Cohort::class, 'cloned_from_id');
    }

    public function payments(): HasMany
    {
        return $this->hasMany(Payment::class);
    }

    // Helpers

    public function generateInviteCode(): string
    {
        $code = strtoupper(\Illuminate\Support\Str::random(8));
        $this->update(['invite_code' => $code]);
        return $code;
    }

    public function isRegistrationOpen(): bool
    {
        if ($this->status->value !== 'registration_open') {
            return false;
        }

        if ($this->registration_closes_at && now()->gt($this->registration_closes_at)) {
            return false;
        }

        if ($this->max_students && $this->enrollments()->where('status', '!=', 'dropped')->count() >= $this->max_students) {
            return false;
        }

        return true;
    }

    public function isFull(): bool
    {
        if (! $this->max_students) {
            return false;
        }

        return $this->enrollments()->where('status', '!=', 'dropped')->count() >= $this->max_students;
    }
}
