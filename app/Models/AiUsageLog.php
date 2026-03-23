<?php

namespace App\Models;

use App\Enums\AiFeature;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphTo;

class AiUsageLog extends Model
{
    public $timestamps = false;

    protected $dates = ['created_at'];

    protected $fillable = [
        'user_id',
        'feature',
        'model',
        'input_tokens',
        'output_tokens',
        'total_tokens',
        'cost_usd',
        'request_duration_ms',
        'related_type',
        'related_id',
        'metadata',
    ];

    protected function casts(): array
    {
        return [
            'feature'    => AiFeature::class,
            'metadata'   => 'json',
            'cost_usd'   => 'decimal:6',
            'created_at' => 'datetime',
        ];
    }

    // Relationships

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function related(): MorphTo
    {
        return $this->morphTo();
    }
}
