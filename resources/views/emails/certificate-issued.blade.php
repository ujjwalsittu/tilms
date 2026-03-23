<!DOCTYPE html>
<html>
<head>
<style>
    body { font-family: -apple-system, sans-serif; line-height: 1.6; color: #374151; max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { text-align: center; padding: 20px 0; border-bottom: 2px solid #4F46E5; margin-bottom: 20px; }
    .header h1 { color: #4F46E5; margin: 0; font-size: 24px; }
    .button { display: inline-block; padding: 12px 24px; background: #4F46E5; color: white; text-decoration: none; border-radius: 8px; font-weight: 600; }
    .footer { text-align: center; padding: 20px 0; border-top: 1px solid #E5E7EB; color: #9CA3AF; font-size: 12px; margin-top: 30px; }
    .congrats-banner { text-align: center; background: linear-gradient(135deg, #667EEA 0%, #764BA2 100%); color: white; padding: 30px; border-radius: 12px; margin: 20px 0; }
    .congrats-banner h2 { margin: 0 0 8px; font-size: 28px; }
    .cert-detail { background: #F9FAFB; border: 1px solid #E5E7EB; border-radius: 8px; padding: 16px; margin: 20px 0; font-size: 14px; }
    .cert-detail p { margin: 4px 0; }
    .verify-link { font-family: monospace; font-size: 12px; color: #6B7280; word-break: break-all; }
</style>
</head>
<body>
<div class="header"><h1>TILMS</h1></div>

<div class="congrats-banner">
    <div style="font-size: 40px; margin-bottom: 8px;">🎓</div>
    <h2>Congratulations, {{ $studentName }}!</h2>
    <p style="margin: 0; opacity: 0.9;">You've earned your certificate</p>
</div>

<p>We're thrilled to announce that your certificate for completing <strong>{{ $cohortName }}</strong> has been issued and is ready to download!</p>

<div class="cert-detail">
    <p><strong>Certificate Number:</strong> {{ $certificateNumber }}</p>
    <p><strong>Program:</strong> {{ $cohortName }}</p>
    <p><strong>Issued On:</strong> {{ $issuedDate }}</p>
    <p><strong>Completion:</strong> {{ $completionPercent }}%</p>
</div>

<p style="text-align: center; margin: 30px 0;">
    <a href="{{ $downloadUrl }}" class="button">Download Certificate (PDF)</a>
</p>

<p>You can also verify your certificate at any time using this link:</p>
<p class="verify-link">{{ $verificationUrl }}</p>

<p>Share your achievement with your network and showcase your new skills!</p>

<p>Proud of you,<br>The TILMS Team</p>

<div class="footer"><p>© {{ date('Y') }} TILMS. All rights reserved.</p></div>
</body>
</html>
