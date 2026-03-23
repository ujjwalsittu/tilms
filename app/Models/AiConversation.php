<?php

namespace App\Models;

use App\Enums\ConversationType;
use App\Traits\HasUuid;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AiConversation extends Model
{
    use HasUuid;

    protected $fillable = [
        'user_id',
        'type',
        'cohort_id',
        'task_id',
        'title',
        'messages',
        'model',
        'total_tokens_used',
    ];

    protected function casts(): array
    {
        return [
            'type'     => ConversationType::class,
            'messages' => 'json',
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

    public function task(): BelongsTo
    {
        return $this->belongsTo(Task::class);
    }
}
