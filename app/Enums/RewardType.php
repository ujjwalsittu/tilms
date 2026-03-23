<?php

namespace App\Enums;

enum RewardType: string
{
    case Discount = 'discount';
    case Credit = 'credit';
    case Cash = 'cash';

    public function label(): string
    {
        return match ($this) {
            self::Discount => 'Discount',
            self::Credit => 'Credit',
            self::Cash => 'Cash',
        };
    }
}
