<?php

namespace App\Models;

use App\Enums\IdVerificationStatus;
use App\Enums\UserRole;
use App\Traits\HasUuid;
use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    use HasFactory, HasUuid, Notifiable, SoftDeletes;

    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
        'phone',
        'bio',
        'avatar_path',
        'is_active',
        'id_verification_status',
        'id_document_path',
        'referral_code',
        'referred_by_user_id',
        'last_login_at',
        'date_of_birth',
        'college_name',
        'course_name',
        'semester',
        'github_username',
        'github_token',
    ];

    protected $hidden = [
        'password',
        'remember_token',
        'two_factor_secret',
        'two_factor_recovery_codes',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at'          => 'datetime',
            'password'                   => 'hashed',
            'role'                       => UserRole::class,
            'is_active'                  => 'boolean',
            'id_verification_status'     => IdVerificationStatus::class,
            'two_factor_confirmed_at'    => 'datetime',
            'id_verified_at'             => 'datetime',
            'last_login_at'              => 'datetime',
            'deleted_at'                 => 'datetime',
            'date_of_birth'              => 'date',
        ];
    }

    // Relationships

    public function instructorProfile(): HasOne
    {
        return $this->hasOne(InstructorProfile::class);
    }

    public function cohorts(): HasMany
    {
        return $this->hasMany(Cohort::class, 'instructor_id');
    }

    public function enrollments(): HasMany
    {
        return $this->hasMany(CohortEnrollment::class, 'student_id');
    }

    public function submissions(): HasMany
    {
        return $this->hasMany(TaskSubmission::class, 'student_id');
    }

    public function payments(): HasMany
    {
        return $this->hasMany(Payment::class);
    }

    public function certificates(): HasMany
    {
        return $this->hasMany(Certificate::class, 'student_id');
    }

    public function portfolio(): HasOne
    {
        return $this->hasOne(StudentPortfolio::class);
    }

    public function supportTickets(): HasMany
    {
        return $this->hasMany(SupportTicket::class);
    }

    public function badges(): BelongsToMany
    {
        return $this->belongsToMany(Badge::class, 'user_badges')
            ->withPivot('earned_at', 'cohort_id');
    }

    public function referrer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'referred_by_user_id');
    }

    public function referrals(): HasMany
    {
        return $this->hasMany(User::class, 'referred_by_user_id');
    }

    // Helper methods

    public function isAdmin(): bool
    {
        return $this->role === UserRole::Admin;
    }

    public function isInstructor(): bool
    {
        return $this->role === UserRole::Instructor;
    }

    public function isStudent(): bool
    {
        return $this->role === UserRole::Student;
    }
}
