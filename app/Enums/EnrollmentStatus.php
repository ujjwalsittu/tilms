<?php

namespace App\Enums;

enum EnrollmentStatus: string
{
    case Waitlisted = 'waitlisted';
    case Enrolled = 'enrolled';
    case Audit = 'audit';
    case Completed = 'completed';
    case Dropped = 'dropped';

    public function label(): string
    {
        return match ($this) {
            self::Waitlisted => 'Waitlisted',
            self::Enrolled => 'Enrolled',
            self::Audit => 'Audit',
            self::Completed => 'Completed',
            self::Dropped => 'Dropped',
        };
    }
}
