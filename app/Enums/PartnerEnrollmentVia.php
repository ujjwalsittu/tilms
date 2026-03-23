<?php

namespace App\Enums;

enum PartnerEnrollmentVia: string
{
    case CsvBulk = 'csv_bulk';
    case AffiliateLink = 'affiliate_link';
    case Manual = 'manual';

    public function label(): string
    {
        return match ($this) {
            self::CsvBulk => 'CSV Bulk',
            self::AffiliateLink => 'Affiliate Link',
            self::Manual => 'Manual',
        };
    }
}
