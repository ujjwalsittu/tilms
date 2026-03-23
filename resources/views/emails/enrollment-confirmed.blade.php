<!DOCTYPE html>
<html>
<head>
<style>
    body { font-family: -apple-system, sans-serif; line-height: 1.6; color: #374151; max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { text-align: center; padding: 20px 0; border-bottom: 2px solid #4F46E5; margin-bottom: 20px; }
    .header h1 { color: #4F46E5; margin: 0; font-size: 24px; }
    .button { display: inline-block; padding: 12px 24px; background: #4F46E5; color: white; text-decoration: none; border-radius: 8px; font-weight: 600; }
    .footer { text-align: center; padding: 20px 0; border-top: 1px solid #E5E7EB; color: #9CA3AF; font-size: 12px; margin-top: 30px; }
    .highlight { background: #EEF2FF; border-left: 4px solid #4F46E5; padding: 12px 16px; border-radius: 0 8px 8px 0; margin: 16px 0; }
</style>
</head>
<body>
<div class="header"><h1>TILMS</h1></div>

<p>Hi <strong>{{ $studentName }}</strong>,</p>

<p>Welcome aboard! Your enrollment in <strong>{{ $cohortName }}</strong> has been confirmed.</p>

<div class="highlight">
    <strong>Cohort:</strong> {{ $cohortName }}<br>
    <strong>Start Date:</strong> {{ $startDate ?? 'To be announced' }}<br>
    <strong>Instructor:</strong> {{ $instructorName ?? 'Your Instructor' }}
</div>

<p>You can now access your cohort dashboard, view tasks, and start learning. We're excited to have you on this journey!</p>

<p style="text-align: center; margin: 30px 0;">
    <a href="{{ $cohortUrl }}" class="button">View Your Cohort</a>
</p>

<p>If you have any questions, feel free to reach out through the support portal.</p>

<p>Best of luck,<br>The TILMS Team</p>

<div class="footer"><p>© {{ date('Y') }} TILMS. All rights reserved.</p></div>
</body>
</html>
