<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Models\Cohort;
use App\Models\CohortEnrollment;
use App\Models\DiscountCoupon;
use App\Models\Payment;
use App\Models\Invoice;
use App\Models\ReferralReward;
use App\Services\RazorpayService;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;

class PaymentController extends Controller
{
    public function checkout(Cohort $cohort, RazorpayService $razorpay)
    {
        // Check if already enrolled
        $existing = CohortEnrollment::where('cohort_id', $cohort->id)
            ->where('student_id', auth()->id())
            ->whereIn('status', ['enrolled', 'completed'])
            ->first();

        if ($existing) {
            return redirect()->route('student.cohorts.show', $cohort->id)
                ->with('error', 'You are already enrolled in this cohort.');
        }

        return Inertia::render('Student/Payment/Checkout', [
            'cohort' => $cohort->only('id', 'title', 'slug', 'price_amount', 'price_currency', 'description', 'type'),
            'razorpayKeyId' => $razorpay->getKeyId(),
            'environment' => $razorpay->getEnvironment(),
        ]);
    }

    public function createOrder(Request $request, Cohort $cohort, RazorpayService $razorpay)
    {
        $validated = $request->validate([
            'coupon_code' => 'nullable|string|max:50',
            'referral_code' => 'nullable|string|max:32',
        ]);

        $amount = $cohort->price_amount;
        $discountAmount = 0;
        $couponId = null;

        // Apply coupon
        if (!empty($validated['coupon_code'])) {
            $coupon = DiscountCoupon::where('code', $validated['coupon_code'])->first();
            if ($coupon && $coupon->isValid($cohort->id)) {
                $discountAmount = $coupon->calculateDiscount($amount);
                $couponId = $coupon->id;
            }
        }

        $finalAmount = max(0, $amount - $discountAmount);

        // If free after discount, enroll directly
        if ($finalAmount <= 0) {
            return $this->enrollFree($cohort, $couponId, $discountAmount, $validated['referral_code'] ?? null);
        }

        $order = $razorpay->createOrder($finalAmount, $cohort->price_currency ?? 'INR', [
            'cohort_id' => $cohort->id,
            'student_id' => auth()->id(),
        ]);

        // Create payment record
        $payment = Payment::create([
            'user_id' => auth()->id(),
            'cohort_id' => $cohort->id,
            'razorpay_order_id' => $order['id'],
            'amount' => $finalAmount,
            'currency' => $cohort->price_currency ?? 'INR',
            'status' => 'created',
            'discount_coupon_id' => $couponId,
            'discount_amount' => $discountAmount,
            'referral_code_used' => $validated['referral_code'] ?? null,
            'affiliate_code_used' => $request->cookie('affiliate_code'),
            'environment' => $razorpay->getEnvironment(),
        ]);

        return response()->json([
            'order_id' => $order['id'],
            'amount' => $finalAmount * 100,
            'currency' => $cohort->price_currency ?? 'INR',
            'payment_id' => $payment->id,
        ]);
    }

    public function verify(Request $request, RazorpayService $razorpay)
    {
        $validated = $request->validate([
            'razorpay_order_id' => 'required|string',
            'razorpay_payment_id' => 'required|string',
            'razorpay_signature' => 'required|string',
        ]);

        $payment = Payment::where('razorpay_order_id', $validated['razorpay_order_id'])
            ->where('user_id', auth()->id())
            ->firstOrFail();

        // Verify signature
        $isValid = $razorpay->verifySignature(
            $validated['razorpay_order_id'],
            $validated['razorpay_payment_id'],
            $validated['razorpay_signature']
        );

        if (!$isValid) {
            $payment->update(['status' => 'failed']);
            return redirect()->route('student.cohorts.index')->with('error', 'Payment verification failed.');
        }

        $payment->update([
            'razorpay_payment_id' => $validated['razorpay_payment_id'],
            'razorpay_signature' => $validated['razorpay_signature'],
            'status' => 'captured',
            'paid_at' => now(),
        ]);

        // Create enrollment
        CohortEnrollment::firstOrCreate(
            ['cohort_id' => $payment->cohort_id, 'student_id' => auth()->id()],
            ['status' => 'enrolled', 'enrolled_at' => now()]
        );

        // Increment coupon usage
        if ($payment->discount_coupon_id) {
            DiscountCoupon::where('id', $payment->discount_coupon_id)->increment('times_used');
        }

        // Process referral reward
        if ($payment->referral_code_used) {
            $this->processReferral($payment);
        }

        // Generate invoice
        $this->generateInvoice($payment);

        return redirect()->route('student.cohorts.show', $payment->cohort_id)
            ->with('success', 'Payment successful! Welcome to the cohort.');
    }

    private function enrollFree(Cohort $cohort, ?int $couponId, float $discountAmount, ?string $referralCode)
    {
        $payment = Payment::create([
            'user_id' => auth()->id(),
            'cohort_id' => $cohort->id,
            'razorpay_order_id' => 'free_' . Str::random(20),
            'amount' => 0,
            'currency' => $cohort->price_currency ?? 'INR',
            'status' => 'captured',
            'discount_coupon_id' => $couponId,
            'discount_amount' => $discountAmount,
            'referral_code_used' => $referralCode,
            'environment' => 'live',
            'paid_at' => now(),
        ]);

        CohortEnrollment::firstOrCreate(
            ['cohort_id' => $cohort->id, 'student_id' => auth()->id()],
            ['status' => 'enrolled', 'enrolled_at' => now()]
        );

        if ($couponId) {
            DiscountCoupon::where('id', $couponId)->increment('times_used');
        }

        $this->generateInvoice($payment);

        return redirect()->route('student.cohorts.show', $cohort->id)
            ->with('success', 'Enrolled successfully!');
    }

    private function processReferral(Payment $payment): void
    {
        $referrer = \App\Models\User::where('referral_code', $payment->referral_code_used)->first();
        if (!$referrer || $referrer->id === $payment->user_id) return;

        ReferralReward::create([
            'referrer_id' => $referrer->id,
            'referred_id' => $payment->user_id,
            'payment_id' => $payment->id,
            'reward_type' => 'credit',
            'reward_value' => min($payment->amount * 0.10, 500), // 10% or max 500
            'status' => 'pending',
            'created_at' => now(),
        ]);
    }

    private function generateInvoice(Payment $payment): void
    {
        Invoice::create([
            'payment_id' => $payment->id,
            'invoice_number' => 'INV-' . now()->format('Ymd') . '-' . str_pad($payment->id, 5, '0', STR_PAD_LEFT),
            'created_at' => now(),
        ]);
    }
}
