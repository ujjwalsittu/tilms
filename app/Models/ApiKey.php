<?php

namespace App\Models;

use App\Enums\ApiEnvironment;
use App\Enums\ApiService;
use Illuminate\Database\Eloquent\Model;

class ApiKey extends Model
{
    protected $fillable = [
        'service',
        'key_name',
        'encrypted_value',
        'is_active',
        'environment',
        'last_rotated_at',
    ];

    protected $hidden = [
        'encrypted_value',
    ];

    protected function casts(): array
    {
        return [
            'service'         => ApiService::class,
            'is_active'       => 'boolean',
            'environment'     => ApiEnvironment::class,
            'last_rotated_at' => 'datetime',
        ];
    }
}
