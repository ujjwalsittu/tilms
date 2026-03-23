<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Payment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class FinancialReportController extends Controller
{
    public function index(Request $request)
    {
        $year = $request->input('year', now()->year);
        $month = $request->input('month');
        $instructorId = $request->input('instructor_id');

        $query = Payment::where('status', 'captured');

        if ($month) {
            $query->whereMonth('paid_at', $month)->whereYear('paid_at', $year);
        } else {
            $query->whereYear('paid_at', $year);
        }

        if ($instructorId) {
            $query->whereHas('cohort', function ($q) use ($instructorId) {
                $q->where('instructor_id', $instructorId);
            });
        }

        $totalRevenue = $query->sum('amount');
        $totalRefunded = Payment::where('status', 'refunded')
            ->when($month, fn ($q) => $q->whereMonth('paid_at', $month)->whereYear('paid_at', $year))
            ->when(! $month, fn ($q) => $q->whereYear('paid_at', $year))
            ->when($instructorId, fn ($q) => $q->whereHas('cohort', fn ($q2) => $q2->where('instructor_id', $instructorId)))
            ->sum('amount');

        $monthlyBreakdown = Payment::where('status', 'captured')
            ->whereYear('paid_at', $year)
            ->when($instructorId, fn ($q) => $q->whereHas('cohort', fn ($q2) => $q2->where('instructor_id', $instructorId)))
            ->select(
                DB::raw('MONTH(paid_at) as month'),
                DB::raw('SUM(amount) as total'),
                DB::raw('COUNT(*) as count')
            )
            ->groupBy(DB::raw('MONTH(paid_at)'))
            ->orderBy(DB::raw('MONTH(paid_at)'))
            ->get();

        return Inertia::render('Admin/Finance/Index', [
            'totalRevenue' => $totalRevenue,
            'totalRefunded' => $totalRefunded,
            'monthlyBreakdown' => $monthlyBreakdown,
            'filters' => $request->only(['month', 'year', 'instructor_id']),
        ]);
    }

    public function transactions(Request $request)
    {
        $query = Payment::with(['user', 'cohort']);

        if ($request->filled('status')) {
            $query->where('status', $request->input('status'));
        }

        if ($request->filled('month')) {
            $query->whereMonth('paid_at', $request->input('month'));
        }

        if ($request->filled('year')) {
            $query->whereYear('paid_at', $request->input('year'));
        }

        if ($request->filled('instructor_id')) {
            $query->whereHas('cohort', function ($q) use ($request) {
                $q->where('instructor_id', $request->input('instructor_id'));
            });
        }

        $transactions = $query->latest('paid_at')->paginate(50)->withQueryString();

        return Inertia::render('Admin/Finance/Transactions', [
            'transactions' => $transactions,
            'filters' => $request->only(['status', 'month', 'year', 'instructor_id']),
        ]);
    }
}
