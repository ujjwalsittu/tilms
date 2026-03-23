<?php

namespace App\Models;

use App\Enums\CouponType;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class DiscountCoupon extends Model
{
    protected $fillable = [
        'code',
        'type',
        'value',
        'max_uses',
        'times_used',
        'cohort_id',
        'valid_from',
        'valid_until',
        'is_active',
        'created_by',
    ];

    protected function casts(): array
    {
        return [
            'type'        => CouponType::class,
            'value'       => 'decimal:2',
            'is_active'   => 'boolean',
            'valid_from'  => 'datetime',
            'valid_until' => 'datetime',
        ];
    }

    // Relationships

    public function cohort(): BelongsTo
    {
        return $this->belongsTo(Cohort::class);
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function payments(): HasMany
    {
        return $this->hasMany(Payment::class, 'discount_coupon_id');
    }

    public function isValid(?int $cohortId = null): bool
    {
        if (! $this->is_active) {
            return false;
        }

        if ($this->max_uses !== null && $this->times_used >= $this->max_uses) {
            return false;
        }

        if ($this->valid_from && now()->lt($this->valid_from)) {
            return false;
        }

        if ($this->valid_until && now()->gt($this->valid_until)) {
            return false;
        }

        if ($this->cohort_id && $cohortId && $this->cohort_id !== $cohortId) {
            return false;
        }

        return true;
    }

    public function calculateDiscount(float $originalPrice): float
    {
        return match ($this->type) {
            CouponType::Percentage => min($originalPrice, $originalPrice * ($this->value / 100)),
            CouponType::Fixed => min($originalPrice, $this->value),
        };
    }
}
