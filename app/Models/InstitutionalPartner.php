<?php

namespace App\Models;

use App\Traits\HasUuid;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class InstitutionalPartner extends Model
{
    use HasUuid;

    protected $fillable = [
        'name',
        'contact_name',
        'contact_email',
        'phone',
        'logo_path',
        'affiliate_code',
        'discount_percent',
        'revenue_share_percent',
        'is_active',
        'metadata',
    ];

    protected function casts(): array
    {
        return [
            'discount_percent'      => 'decimal:2',
            'revenue_share_percent' => 'decimal:2',
            'is_active'             => 'boolean',
            'metadata'              => 'json',
        ];
    }

    // Relationships

    public function enrollments(): HasMany
    {
        return $this->hasMany(PartnerEnrollment::class, 'partner_id');
    }
}
