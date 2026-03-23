<!DOCTYPE html>
<html>
<head>
<style>
    body { font-family: -apple-system, sans-serif; line-height: 1.6; color: #374151; max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { text-align: center; padding: 20px 0; border-bottom: 2px solid #4F46E5; margin-bottom: 20px; }
    .header h1 { color: #4F46E5; margin: 0; font-size: 24px; }
    .button { display: inline-block; padding: 12px 24px; background: #4F46E5; color: white; text-decoration: none; border-radius: 8px; font-weight: 600; }
    .footer { text-align: center; padding: 20px 0; border-top: 1px solid #E5E7EB; color: #9CA3AF; font-size: 12px; margin-top: 30px; }
    .start-banner { background: #EEF2FF; border: 2px solid #4F46E5; border-radius: 12px; padding: 24px; text-align: center; margin: 20px 0; }
    .start-banner h2 { color: #4F46E5; margin: 0 0 8px; }
    .info-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #F3F4F6; font-size: 14px; }
    .info-row:last-child { border-bottom: none; }
</style>
</head>
<body>
<div class="header"><h1>TILMS</h1></div>

<p>Hi <strong>{{ $studentName }}</strong>,</p>

<div class="start-banner">
    <div style="font-size: 32px; margin-bottom: 8px;">🚀</div>
    <h2>{{ $cohortName }} Has Started!</h2>
    <p style="margin: 0; color: #4B5563;">Your learning journey begins today</p>
</div>

<p>Great news! Your cohort <strong>{{ $cohortName }}</strong> has officially started. It's time to dive in and begin your first task!</p>

<div style="background: #F9FAFB; border-radius: 8px; padding: 16px; margin: 16px 0;">
    <div class="info-row">
        <span><strong>Cohort</strong></span>
        <span>{{ $cohortName }}</span>
    </div>
    <div class="info-row">
        <span><strong>Instructor</strong></span>
        <span>{{ $instructorName ?? 'Your Instructor' }}</span>
    </div>
    <div class="info-row">
        <span><strong>Start Date</strong></span>
        <span>{{ $startDate }}</span>
    </div>
    @if(isset($firstTaskName))
    <div class="info-row">
        <span><strong>First Task</strong></span>
        <span>{{ $firstTaskName }}</span>
    </div>
    @endif
</div>

<p>Tips for success:</p>
<ul style="color: #4B5563; font-size: 14px;">
    <li>Complete tasks on time to maintain your progress streak</li>
    <li>Use the AI Doubt Assistant whenever you're stuck</li>
    <li>Engage with discussions and your instructor's feedback</li>
    <li>Aim for consistency over perfection</li>
</ul>

<p style="text-align: center; margin: 30px 0;">
    <a href="{{ $cohortUrl }}" class="button">Go to Your Cohort</a>
</p>

<p>Best of luck,<br>The TILMS Team</p>

<div class="footer"><p>© {{ date('Y') }} TILMS. All rights reserved.</p></div>
</body>
</html>
