<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class InstructorProfile extends Model
{
    protected $fillable = [
        'user_id',
        'title',
        'specialization',
        'website_url',
        'linkedin_url',
        'github_username',
        'payout_details',
        'revenue_share_percent',
    ];

    protected function casts(): array
    {
        return [
            'payout_details'        => 'encrypted:json',
            'revenue_share_percent' => 'decimal:2',
        ];
    }

    // Relationships

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
