<!DOCTYPE html>
<html>
<head>
<style>
    body { font-family: -apple-system, sans-serif; line-height: 1.6; color: #374151; max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { text-align: center; padding: 20px 0; border-bottom: 2px solid #4F46E5; margin-bottom: 20px; }
    .header h1 { color: #4F46E5; margin: 0; font-size: 24px; }
    .button { display: inline-block; padding: 12px 24px; background: #4F46E5; color: white; text-decoration: none; border-radius: 8px; font-weight: 600; }
    .footer { text-align: center; padding: 20px 0; border-top: 1px solid #E5E7EB; color: #9CA3AF; font-size: 12px; margin-top: 30px; }
    .receipt-box { border: 1px solid #E5E7EB; border-radius: 8px; padding: 20px; margin: 20px 0; }
    .receipt-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #F3F4F6; }
    .receipt-row:last-child { border-bottom: none; font-weight: bold; font-size: 16px; }
    .success-badge { display: inline-block; background: #D1FAE5; color: #065F46; padding: 4px 12px; border-radius: 20px; font-size: 13px; font-weight: 600; }
</style>
</head>
<body>
<div class="header"><h1>TILMS</h1></div>

<p>Hi <strong>{{ $studentName }}</strong>,</p>

<p>Your payment has been successfully processed. <span class="success-badge">Payment Confirmed</span></p>

<div class="receipt-box">
    <div class="receipt-row">
        <span>Invoice Number</span>
        <span>{{ $invoiceNumber }}</span>
    </div>
    <div class="receipt-row">
        <span>Cohort</span>
        <span>{{ $cohortName }}</span>
    </div>
    <div class="receipt-row">
        <span>Payment Date</span>
        <span>{{ $paymentDate }}</span>
    </div>
    <div class="receipt-row">
        <span>Payment Method</span>
        <span>{{ $paymentMethod ?? 'Online Payment' }}</span>
    </div>
    <div class="receipt-row">
        <span>Amount Paid</span>
        <span>{{ $currency ?? '₹' }}{{ $amount }}</span>
    </div>
</div>

<p>Your enrollment is now active and you have full access to your cohort materials.</p>

<p style="text-align: center; margin: 30px 0;">
    <a href="{{ $billingUrl }}" class="button">View Billing & Invoices</a>
</p>

<p>Please save this receipt for your records.</p>

<p>Thank you,<br>The TILMS Team</p>

<div class="footer"><p>© {{ date('Y') }} TILMS. All rights reserved.</p></div>
</body>
</html>
