<?php

namespace App\Http\Controllers\Instructor;

use App\Http\Controllers\Controller;
use App\Models\Cohort;
use App\Models\Payment;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class FinanceController extends Controller
{
    public function index()
    {
        $user = auth()->user();
        $cohortIds = Cohort::where('instructor_id', $user->id)->pluck('id');

        $totalEarnings = Payment::whereIn('cohort_id', $cohortIds)
            ->where('status', 'captured')
            ->sum('amount');

        $monthlyBreakdown = Payment::whereIn('cohort_id', $cohortIds)
            ->where('status', 'captured')
            ->select(
                DB::raw('YEAR(created_at) as year'),
                DB::raw('MONTH(created_at) as month'),
                DB::raw('SUM(amount) as total'),
                DB::raw('COUNT(*) as count')
            )
            ->groupBy('year', 'month')
            ->orderByDesc('year')
            ->orderByDesc('month')
            ->get();

        $perCohortBreakdown = Cohort::where('instructor_id', $user->id)
            ->with(['payments' => function ($query) {
                $query->where('status', 'captured')
                    ->select('cohort_id', DB::raw('SUM(amount) as total'), DB::raw('COUNT(*) as count'))
                    ->groupBy('cohort_id');
            }])
            ->select('id', 'title', 'status')
            ->get()
            ->map(function ($cohort) {
                return [
                    'id'       => $cohort->id,
                    'title'    => $cohort->title,
                    'status'   => $cohort->status,
                    'earnings' => $cohort->payments->sum('total'),
                    'payments' => $cohort->payments->sum('count'),
                ];
            });

        return Inertia::render('Instructor/Finance/Overview', compact(
            'totalEarnings',
            'monthlyBreakdown',
            'perCohortBreakdown'
        ));
    }
}
