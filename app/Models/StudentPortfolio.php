<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class StudentPortfolio extends Model
{
    protected $fillable = [
        'user_id',
        'slug',
        'headline',
        'about',
        'skills',
        'is_public',
        'custom_theme',
    ];

    protected function casts(): array
    {
        return [
            'skills'       => 'json',
            'is_public'    => 'boolean',
            'custom_theme' => 'json',
        ];
    }

    // Relationships

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
