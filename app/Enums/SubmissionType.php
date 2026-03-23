<?php

namespace App\Enums;

enum SubmissionType: string
{
    case Code = 'code';
    case Github = 'github';

    public function label(): string
    {
        return match ($this) {
            self::Code => 'Code',
            self::Github => 'GitHub',
        };
    }
}
