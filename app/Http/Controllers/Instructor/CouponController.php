<?php

namespace App\Http\Controllers\Instructor;

use App\Http\Controllers\Controller;
use App\Models\Cohort;
use App\Models\DiscountCoupon;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CouponController extends Controller
{
    public function index(Cohort $cohort)
    {
        abort_if($cohort->instructor_id !== auth()->id(), 403);

        $coupons = DiscountCoupon::where('cohort_id', $cohort->id)
            ->latest()
            ->get();

        return Inertia::render('Instructor/Cohorts/Coupons', [
            'cohort' => $cohort,
            'coupons' => $coupons,
        ]);
    }

    public function store(Request $request, Cohort $cohort)
    {
        abort_if($cohort->instructor_id !== auth()->id(), 403);

        $validated = $request->validate([
            'code' => 'required|string|max:50|unique:discount_coupons,code',
            'type' => 'required|in:percentage,fixed',
            'value' => 'required|numeric|min:0',
            'max_uses' => 'nullable|integer|min:1',
            'valid_from' => 'nullable|date',
            'valid_until' => 'nullable|date|after:valid_from',
        ]);

        DiscountCoupon::create([
            ...$validated,
            'cohort_id' => $cohort->id,
            'created_by' => auth()->id(),
            'is_active' => true,
        ]);

        return back()->with('success', 'Coupon created successfully.');
    }

    public function destroy(DiscountCoupon $coupon)
    {
        $cohort = $coupon->cohort;
        abort_if($cohort && $cohort->instructor_id !== auth()->id(), 403);

        $coupon->update(['is_active' => false]);

        return back()->with('success', 'Coupon deactivated.');
    }
}
