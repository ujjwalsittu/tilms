<?php

namespace App\Enums;

enum TaskType: string
{
    case Individual = 'individual';
    case Project = 'project';

    public function label(): string
    {
        return match ($this) {
            self::Individual => 'Individual',
            self::Project => 'Project',
        };
    }
}
