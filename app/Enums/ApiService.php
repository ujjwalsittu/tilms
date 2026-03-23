<?php

namespace App\Enums;

enum ApiService: string
{
    case Resend = 'resend';
    case Claude = 'claude';
    case Razorpay = 'razorpay';
    case Github = 'github';

    public function label(): string
    {
        return match ($this) {
            self::Resend => 'Resend',
            self::Claude => 'Claude',
            self::Razorpay => 'Razorpay',
            self::Github => 'GitHub',
        };
    }
}
