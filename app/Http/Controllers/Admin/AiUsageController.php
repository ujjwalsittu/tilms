<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\AiUsageLog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class AiUsageController extends Controller
{
    public function index(Request $request)
    {
        $query = AiUsageLog::query();

        if ($request->filled('date_from')) {
            $query->whereDate('created_at', '>=', $request->input('date_from'));
        }

        if ($request->filled('date_to')) {
            $query->whereDate('created_at', '<=', $request->input('date_to'));
        }

        $byFeature = (clone $query)
            ->select(
                'feature',
                DB::raw('SUM(total_tokens) as total_tokens'),
                DB::raw('SUM(cost_usd) as total_cost'),
                DB::raw('COUNT(*) as call_count')
            )
            ->groupBy('feature')
            ->orderByDesc('total_cost')
            ->get();

        $byModel = (clone $query)
            ->select(
                'model',
                DB::raw('SUM(total_tokens) as total_tokens'),
                DB::raw('SUM(cost_usd) as total_cost'),
                DB::raw('COUNT(*) as call_count')
            )
            ->groupBy('model')
            ->orderByDesc('total_cost')
            ->get();

        $totals = (clone $query)
            ->select(
                DB::raw('SUM(total_tokens) as total_tokens'),
                DB::raw('SUM(cost_usd) as total_cost'),
                DB::raw('COUNT(*) as total_calls')
            )
            ->first();

        return Inertia::render('Admin/AiUsage/Index', [
            'byFeature' => $byFeature,
            'byModel' => $byModel,
            'totals' => $totals,
            'filters' => $request->only(['date_from', 'date_to']),
        ]);
    }
}
