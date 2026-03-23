<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\InstitutionalPartner;
use App\Models\PartnerEnrollment;
use App\Models\CohortEnrollment;
use App\Models\User;
use App\Services\CsvEnrollmentService;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;

class PartnerController extends Controller
{
    public function index()
    {
        $partners = InstitutionalPartner::withCount('enrollments')
            ->latest()
            ->paginate(20);

        return Inertia::render('Admin/Partners/Index', [
            'partners' => $partners,
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/Partners/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'contact_name' => 'required|string|max:255',
            'contact_email' => 'required|email|max:255',
            'phone' => 'nullable|string|max:20',
            'discount_percent' => 'nullable|numeric|min:0|max:100',
            'revenue_share_percent' => 'nullable|numeric|min:0|max:100',
        ]);

        InstitutionalPartner::create([
            ...$validated,
            'affiliate_code' => strtoupper(Str::random(8)),
            'is_active' => true,
        ]);

        return redirect()->route('admin.partners.index')->with('success', 'Partner created.');
    }

    public function show(InstitutionalPartner $partner)
    {
        $enrollments = PartnerEnrollment::where('partner_id', $partner->id)
            ->with(['student:id,name,email', 'cohort:id,title'])
            ->latest()
            ->paginate(20);

        $stats = [
            'total_students' => PartnerEnrollment::where('partner_id', $partner->id)->count(),
            'active_cohorts' => PartnerEnrollment::where('partner_id', $partner->id)->distinct('cohort_id')->count('cohort_id'),
        ];

        return Inertia::render('Admin/Partners/Show', [
            'partner' => $partner,
            'enrollments' => $enrollments,
            'stats' => $stats,
        ]);
    }

    public function update(Request $request, InstitutionalPartner $partner)
    {
        $validated = $request->validate([
            'name' => 'string|max:255',
            'contact_name' => 'string|max:255',
            'contact_email' => 'email|max:255',
            'phone' => 'nullable|string|max:20',
            'discount_percent' => 'nullable|numeric|min:0|max:100',
            'revenue_share_percent' => 'nullable|numeric|min:0|max:100',
            'is_active' => 'boolean',
        ]);

        $partner->update($validated);
        return back()->with('success', 'Partner updated.');
    }

    public function destroy(InstitutionalPartner $partner)
    {
        $partner->update(['is_active' => false]);
        return redirect()->route('admin.partners.index')->with('success', 'Partner deactivated.');
    }

    public function bulkEnroll(Request $request, InstitutionalPartner $partner)
    {
        $validated = $request->validate([
            'cohort_id' => 'required|exists:cohorts,id',
            'csv_file' => 'required|file|mimes:csv,txt|max:5120',
        ]);

        $csvService = app(CsvEnrollmentService::class);
        $result = $csvService->processFromPartner($request->file('csv_file'), $validated['cohort_id'], $partner->id);

        return back()->with('success', "Enrolled {$result['enrolled']} students. {$result['errors']} errors.");
    }
}
