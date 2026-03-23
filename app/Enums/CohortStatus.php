<?php

namespace App\Enums;

enum CohortStatus: string
{
    case Draft = 'draft';
    case RegistrationOpen = 'registration_open';
    case InProgress = 'in_progress';
    case Closed = 'closed';
    case Archived = 'archived';

    public function label(): string
    {
        return match ($this) {
            self::Draft => 'Draft',
            self::RegistrationOpen => 'Registration Open',
            self::InProgress => 'In Progress',
            self::Closed => 'Closed',
            self::Archived => 'Archived',
        };
    }
}
