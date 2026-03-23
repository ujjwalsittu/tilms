<?php

namespace App\Models;

use App\Enums\RewardStatus;
use App\Enums\RewardType;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ReferralReward extends Model
{
    public $timestamps = false;

    protected $dates = ['created_at'];

    protected $fillable = [
        'referrer_id',
        'referred_id',
        'payment_id',
        'reward_type',
        'reward_value',
        'status',
        'credited_at',
    ];

    protected function casts(): array
    {
        return [
            'reward_type'  => RewardType::class,
            'reward_value' => 'decimal:2',
            'status'       => RewardStatus::class,
            'credited_at'  => 'datetime',
            'created_at'   => 'datetime',
        ];
    }

    // Relationships

    public function referrer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'referrer_id');
    }

    public function referred(): BelongsTo
    {
        return $this->belongsTo(User::class, 'referred_id');
    }

    public function payment(): BelongsTo
    {
        return $this->belongsTo(Payment::class);
    }
}
