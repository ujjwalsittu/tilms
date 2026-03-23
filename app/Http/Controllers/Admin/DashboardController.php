<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\AiUsageLog;
use App\Models\AuditLog;
use App\Models\Cohort;
use App\Models\Payment;
use App\Models\SupportTicket;
use App\Models\User;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $stats = [
            'total_students' => User::where('role', 'student')->count(),
            'total_instructors' => User::where('role', 'instructor')->count(),
            'active_cohorts' => Cohort::where('status', 'in_progress')->count(),
            'total_revenue' => Payment::where('status', 'captured')->sum('amount'),
            'monthly_revenue' => Payment::where('status', 'captured')
                ->whereMonth('paid_at', now()->month)
                ->whereYear('paid_at', now()->year)
                ->sum('amount'),
            'ai_api_calls' => AiUsageLog::count(),
            'ai_cost_total' => AiUsageLog::sum('cost_usd'),
            'pending_verifications' => User::where('id_verification_status', 'pending')->count(),
            'open_tickets' => SupportTicket::whereIn('status', ['open', 'in_progress'])->count(),
        ];

        $recentActivity = AuditLog::with('user')
            ->latest('created_at')
            ->take(10)
            ->get();

        return Inertia::render('Admin/Dashboard', [
            'stats' => $stats,
            'recentActivity' => $recentActivity,
        ]);
    }
}
