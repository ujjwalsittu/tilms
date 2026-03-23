<?php

namespace App\Models;

use App\Enums\BookingStatus;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class OfficeHoursBooking extends Model
{
    public $timestamps = false;

    protected $dates = ['created_at'];

    protected $fillable = [
        'slot_id',
        'student_id',
        'status',
        'notes',
    ];

    protected function casts(): array
    {
        return [
            'status'     => BookingStatus::class,
            'created_at' => 'datetime',
        ];
    }

    // Relationships

    public function slot(): BelongsTo
    {
        return $this->belongsTo(OfficeHoursSlot::class, 'slot_id');
    }

    public function student(): BelongsTo
    {
        return $this->belongsTo(User::class, 'student_id');
    }
}
