<?php

namespace App\Enums;

enum RewardStatus: string
{
    case Pending = 'pending';
    case Credited = 'credited';
    case Expired = 'expired';

    public function label(): string
    {
        return match ($this) {
            self::Pending => 'Pending',
            self::Credited => 'Credited',
            self::Expired => 'Expired',
        };
    }
}
