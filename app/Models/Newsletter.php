<?php

namespace App\Models;

use App\Enums\NewsletterStatus;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Newsletter extends Model
{
    protected $fillable = [
        'author_id',
        'cohort_id',
        'subject',
        'body',
        'recipient_count',
        'status',
        'sent_at',
    ];

    protected function casts(): array
    {
        return [
            'status'  => NewsletterStatus::class,
            'sent_at' => 'datetime',
        ];
    }

    // Relationships

    public function author(): BelongsTo
    {
        return $this->belongsTo(User::class, 'author_id');
    }

    public function cohort(): BelongsTo
    {
        return $this->belongsTo(Cohort::class);
    }
}
