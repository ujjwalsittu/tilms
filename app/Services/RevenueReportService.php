<?php

namespace App\Services;

use App\Models\Payment;
use Illuminate\Support\Facades\DB;

class RevenueReportService
{
    public function getOverview(?int $instructorId = null): array
    {
        $query = Payment::where('status', 'captured');
        if ($instructorId) {
            $cohortIds = \App\Models\Cohort::where('instructor_id', $instructorId)->pluck('id');
            $query->whereIn('cohort_id', $cohortIds);
        }

        return [
            'total_revenue' => $query->sum('amount'),
            'monthly_revenue' => (clone $query)->whereMonth('paid_at', now()->month)->whereYear('paid_at', now()->year)->sum('amount'),
            'total_payments' => $query->count(),
            'avg_payment' => $query->avg('amount') ?? 0,
        ];
    }

    public function getMonthlyBreakdown(?int $instructorId = null, ?int $year = null): array
    {
        $year = $year ?? now()->year;
        $query = Payment::where('status', 'captured')->whereYear('paid_at', $year);

        if ($instructorId) {
            $cohortIds = \App\Models\Cohort::where('instructor_id', $instructorId)->pluck('id');
            $query->whereIn('cohort_id', $cohortIds);
        }

        return $query->select(
            DB::raw("MONTH(paid_at) as month"),
            DB::raw('SUM(amount) as revenue'),
            DB::raw('COUNT(*) as count')
        )->groupBy('month')->orderBy('month')->get()->toArray();
    }

    public function getForecast(?int $instructorId = null): array
    {
        $lastMonth = (clone Payment::query())->where('status', 'captured')
            ->whereMonth('paid_at', now()->subMonth()->month)
            ->whereYear('paid_at', now()->subMonth()->year);

        if ($instructorId) {
            $cohortIds = \App\Models\Cohort::where('instructor_id', $instructorId)->pluck('id');
            $lastMonth->whereIn('cohort_id', $cohortIds);
        }

        $lastMonthRevenue = $lastMonth->sum('amount');

        return [
            'last_month_revenue' => $lastMonthRevenue,
            'projected_this_month' => $lastMonthRevenue * 1.05, // Simple 5% growth projection
        ];
    }
}
