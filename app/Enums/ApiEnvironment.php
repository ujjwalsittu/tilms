<?php

namespace App\Enums;

enum ApiEnvironment: string
{
    case Live = 'live';
    case Test = 'test';

    public function label(): string
    {
        return match ($this) {
            self::Live => 'Live',
            self::Test => 'Test',
        };
    }
}
