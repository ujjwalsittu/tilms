<?php

namespace App\Services;

use App\Models\AiUsageLog;
use Illuminate\Support\Facades\DB;

class AiUsageTrackingService
{
    public function getTotalStats(?string $startDate = null, ?string $endDate = null): array
    {
        $query = AiUsageLog::query();

        if ($startDate) $query->where('created_at', '>=', $startDate);
        if ($endDate) $query->where('created_at', '<=', $endDate);

        return [
            'total_calls' => $query->count(),
            'total_tokens' => $query->sum('total_tokens'),
            'total_cost' => $query->sum('cost_usd'),
            'avg_duration_ms' => $query->avg('request_duration_ms'),
        ];
    }

    public function getUsageByFeature(?string $startDate = null, ?string $endDate = null): array
    {
        $query = AiUsageLog::select(
            'feature',
            DB::raw('COUNT(*) as count'),
            DB::raw('SUM(total_tokens) as tokens'),
            DB::raw('SUM(cost_usd) as cost')
        )->groupBy('feature');

        if ($startDate) $query->where('created_at', '>=', $startDate);
        if ($endDate) $query->where('created_at', '<=', $endDate);

        return $query->get()->toArray();
    }

    public function getUsageByModel(?string $startDate = null, ?string $endDate = null): array
    {
        $query = AiUsageLog::select(
            'model',
            DB::raw('COUNT(*) as count'),
            DB::raw('SUM(total_tokens) as tokens'),
            DB::raw('SUM(cost_usd) as cost')
        )->groupBy('model');

        if ($startDate) $query->where('created_at', '>=', $startDate);
        if ($endDate) $query->where('created_at', '<=', $endDate);

        return $query->get()->toArray();
    }
}
