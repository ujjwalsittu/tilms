<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\DiscountCoupon;
use Inertia\Inertia;

class CouponController extends Controller
{
    public function index()
    {
        $coupons = DiscountCoupon::with(['cohort:id,title', 'creator:id,name'])
            ->orderByDesc('created_at')
            ->get()
            ->map(function ($coupon) {
                return [
                    'id'           => $coupon->id,
                    'code'         => $coupon->code,
                    'type'         => $coupon->type instanceof \BackedEnum ? $coupon->type->value : $coupon->type,
                    'value'        => $coupon->value,
                    'max_uses'     => $coupon->max_uses,
                    'times_used'   => $coupon->times_used,
                    'is_active'    => $coupon->is_active,
                    'valid_from'   => $coupon->valid_from?->toDateTimeString(),
                    'valid_until'  => $coupon->valid_until?->toDateTimeString(),
                    'created_at'   => $coupon->created_at?->toDateTimeString(),
                    'cohort'       => $coupon->cohort ? ['id' => $coupon->cohort->id, 'title' => $coupon->cohort->title] : null,
                    'creator'      => $coupon->creator ? ['id' => $coupon->creator->id, 'name' => $coupon->creator->name] : null,
                ];
            });

        return Inertia::render('Admin/Coupons/Index', [
            'coupons' => $coupons,
        ]);
    }
}
