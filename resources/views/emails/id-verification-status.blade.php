<!DOCTYPE html>
<html>
<head>
<style>
    body { font-family: -apple-system, sans-serif; line-height: 1.6; color: #374151; max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { text-align: center; padding: 20px 0; border-bottom: 2px solid #4F46E5; margin-bottom: 20px; }
    .header h1 { color: #4F46E5; margin: 0; font-size: 24px; }
    .button { display: inline-block; padding: 12px 24px; background: #4F46E5; color: white; text-decoration: none; border-radius: 8px; font-weight: 600; }
    .footer { text-align: center; padding: 20px 0; border-top: 1px solid #E5E7EB; color: #9CA3AF; font-size: 12px; margin-top: 30px; }
    .status-approved { background: #D1FAE5; border: 1px solid #6EE7B7; color: #065F46; padding: 16px; border-radius: 8px; margin: 20px 0; text-align: center; font-weight: 600; font-size: 16px; }
    .status-rejected { background: #FEE2E2; border: 1px solid #FCA5A5; color: #991B1B; padding: 16px; border-radius: 8px; margin: 20px 0; text-align: center; font-weight: 600; font-size: 16px; }
    .status-pending { background: #FEF3C7; border: 1px solid #FCD34D; color: #92400E; padding: 16px; border-radius: 8px; margin: 20px 0; text-align: center; font-weight: 600; font-size: 16px; }
</style>
</head>
<body>
<div class="header"><h1>TILMS</h1></div>

<p>Hi <strong>{{ $studentName }}</strong>,</p>

<p>We have an update regarding your ID verification request.</p>

@if($status === 'approved')
<div class="status-approved">
    ✓ Your ID verification has been approved!
</div>
<p>You now have full access to all platform features, including certificate issuance. No further action is needed.</p>
@elseif($status === 'rejected')
<div class="status-rejected">
    ✗ Your ID verification was not approved.
</div>
@if(isset($reason))
<p><strong>Reason:</strong> {{ $reason }}</p>
@endif
<p>Please resubmit your verification with a clearer photo ID. Make sure the document is valid, clearly legible, and matches your registered name.</p>
<p style="text-align: center; margin: 30px 0;">
    <a href="{{ $profileUrl }}" class="button">Resubmit Verification</a>
</p>
@else
<div class="status-pending">
    ⏳ Your ID verification is under review.
</div>
<p>Our team is reviewing your submitted documents. This usually takes 1-2 business days. We'll notify you once a decision has been made.</p>
@endif

<p>If you have questions, please contact support.</p>

<p>Regards,<br>The TILMS Team</p>

<div class="footer"><p>© {{ date('Y') }} TILMS. All rights reserved.</p></div>
</body>
</html>
