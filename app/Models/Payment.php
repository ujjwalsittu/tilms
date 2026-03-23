<?php

namespace App\Models;

use App\Enums\ApiEnvironment;
use App\Enums\PaymentStatus;
use App\Traits\Auditable;
use App\Traits\HasUuid;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Payment extends Model
{
    use Auditable, HasUuid;

    protected $fillable = [
        'user_id',
        'cohort_id',
        'razorpay_order_id',
        'razorpay_payment_id',
        'razorpay_signature',
        'amount',
        'currency',
        'status',
        'discount_coupon_id',
        'discount_amount',
        'referral_code_used',
        'affiliate_code_used',
        'environment',
        'metadata',
        'paid_at',
    ];

    protected $hidden = [
        'razorpay_signature',
    ];

    protected function casts(): array
    {
        return [
            'amount'          => 'decimal:2',
            'status'          => PaymentStatus::class,
            'discount_amount' => 'decimal:2',
            'environment'     => ApiEnvironment::class,
            'metadata'        => 'json',
            'paid_at'         => 'datetime',
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

    public function coupon(): BelongsTo
    {
        return $this->belongsTo(DiscountCoupon::class, 'discount_coupon_id');
    }

    public function invoice(): HasOne
    {
        return $this->hasOne(Invoice::class);
    }
}
