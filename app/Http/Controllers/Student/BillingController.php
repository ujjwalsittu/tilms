<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Models\Payment;
use App\Models\Invoice;
use Inertia\Inertia;

class BillingController extends Controller
{
    public function index()
    {
        $payments = Payment::where('user_id', auth()->id())
            ->with(['cohort:id,title', 'invoice'])
            ->latest()
            ->paginate(20);

        return Inertia::render('Student/Billing/Index', [
            'payments' => $payments,
        ]);
    }

    public function downloadInvoice(Invoice $invoice)
    {
        abort_if($invoice->payment->user_id !== auth()->id(), 403);

        // For now return invoice data as JSON; PDF generation comes later
        return Inertia::render('Student/Billing/InvoiceView', [
            'invoice' => $invoice->load('payment.cohort', 'payment.user'),
        ]);
    }
}
