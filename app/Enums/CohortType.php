<?php

namespace App\Enums;

enum CohortType: string
{
    case Internship = 'internship';
    case Learning = 'learning';

    public function label(): string
    {
        return match ($this) {
            self::Internship => 'Internship',
            self::Learning => 'Learning',
        };
    }
}
