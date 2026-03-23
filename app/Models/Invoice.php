<?php

namespace App\Models;

use App\Traits\HasUuid;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Invoice extends Model
{
    use HasUuid;

    public $timestamps = false;

    protected $dates = ['created_at'];

    protected $fillable = [
        'payment_id',
        'invoice_number',
        'pdf_path',
        'emailed_at',
    ];

    protected function casts(): array
    {
        return [
            'emailed_at'  => 'datetime',
            'created_at'  => 'datetime',
        ];
    }

    // Relationships

    public function payment(): BelongsTo
    {
        return $this->belongsTo(Payment::class);
    }
}
