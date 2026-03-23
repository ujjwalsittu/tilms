<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphTo;

class AffiliateTracking extends Model
{
    protected $fillable = [
        'affiliate_code',
        'source_type',
        'source_id',
        'payment_id',
        'click_count',
        'conversion',
        'commission_amount',
        'commission_paid',
    ];

    protected function casts(): array
    {
        return [
            'conversion'        => 'boolean',
            'commission_amount' => 'decimal:2',
            'commission_paid'   => 'boolean',
        ];
    }

    // Relationships

    public function payment(): BelongsTo
    {
        return $this->belongsTo(Payment::class);
    }

    public function source(): MorphTo
    {
        return $this->morphTo();
    }
}
