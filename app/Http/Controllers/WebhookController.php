<?php

namespace App\Http\Controllers;

use App\Models\Payment;
use App\Models\CohortEnrollment;
use Illuminate\Http\Request;

class WebhookController extends Controller
{
    public function razorpay(Request $request)
    {
        $payload = $request->all();
        $event = $payload['event'] ?? null;

        if ($event === 'payment.captured') {
            $paymentEntity = $payload['payload']['payment']['entity'] ?? null;
            if (!$paymentEntity) return response()->json(['status' => 'ignored']);

            $payment = Payment::where('razorpay_order_id', $paymentEntity['order_id'])->first();
            if ($payment && $payment->status !== 'captured') {
                $payment->update([
                    'razorpay_payment_id' => $paymentEntity['id'],
                    'status' => 'captured',
                    'paid_at' => now(),
                ]);

                CohortEnrollment::firstOrCreate(
                    ['cohort_id' => $payment->cohort_id, 'student_id' => $payment->user_id],
                    ['status' => 'enrolled', 'enrolled_at' => now()]
                );
            }
        }

        if ($event === 'refund.processed') {
            $refundEntity = $payload['payload']['refund']['entity'] ?? null;
            if ($refundEntity) {
                Payment::where('razorpay_payment_id', $refundEntity['payment_id'])
                    ->update(['status' => 'refunded']);
            }
        }

        return response()->json(['status' => 'ok']);
    }
}
