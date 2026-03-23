<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class OfficeHoursSlot extends Model
{
    protected $fillable = [
        'instructor_id',
        'cohort_id',
        'title',
        'starts_at',
        'ends_at',
        'max_attendees',
        'meeting_url',
        'is_recurring',
        'recurrence_rule',
    ];

    protected function casts(): array
    {
        return [
            'starts_at'    => 'datetime',
            'ends_at'      => 'datetime',
            'is_recurring' => 'boolean',
        ];
    }

    // Relationships

    public function instructor(): BelongsTo
    {
        return $this->belongsTo(User::class, 'instructor_id');
    }

    public function cohort(): BelongsTo
    {
        return $this->belongsTo(Cohort::class);
    }

    public function bookings(): HasMany
    {
        return $this->hasMany(OfficeHoursBooking::class, 'slot_id');
    }
}
