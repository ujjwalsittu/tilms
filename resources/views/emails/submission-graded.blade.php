<!DOCTYPE html>
<html>
<head>
<style>
    body { font-family: -apple-system, sans-serif; line-height: 1.6; color: #374151; max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { text-align: center; padding: 20px 0; border-bottom: 2px solid #4F46E5; margin-bottom: 20px; }
    .header h1 { color: #4F46E5; margin: 0; font-size: 24px; }
    .button { display: inline-block; padding: 12px 24px; background: #4F46E5; color: white; text-decoration: none; border-radius: 8px; font-weight: 600; }
    .footer { text-align: center; padding: 20px 0; border-top: 1px solid #E5E7EB; color: #9CA3AF; font-size: 12px; margin-top: 30px; }
    .score-box { text-align: center; background: #F0FDF4; border: 2px solid #86EFAC; border-radius: 12px; padding: 20px; margin: 20px 0; }
    .score-number { font-size: 48px; font-weight: bold; color: #16A34A; line-height: 1; }
    .status-passed { color: #16A34A; font-weight: 600; }
    .status-failed { color: #DC2626; font-weight: 600; }
    .status-pending { color: #D97706; font-weight: 600; }
    .detail-row { padding: 6px 0; border-bottom: 1px solid #F3F4F6; }
</style>
</head>
<body>
<div class="header"><h1>TILMS</h1></div>

<p>Hi <strong>{{ $studentName }}</strong>,</p>

<p>Your submission for <strong>{{ $taskName }}</strong> has been graded.</p>

@if(isset($score))
<div class="score-box">
    <div class="score-number">{{ $score }}<span style="font-size: 24px;">/100</span></div>
    <div style="margin-top: 8px;">
        @if($status === 'passed')
            <span class="status-passed">Passed</span>
        @elseif($status === 'failed')
            <span class="status-failed">Needs Improvement</span>
        @else
            <span class="status-pending">{{ ucfirst($status) }}</span>
        @endif
    </div>
</div>
@else
<p>Status: <strong class="status-{{ $status ?? 'pending' }}">{{ ucfirst($status ?? 'Reviewed') }}</strong></p>
@endif

@if(isset($feedback))
<p><strong>Instructor Feedback:</strong></p>
<p style="background: #F9FAFB; padding: 12px 16px; border-radius: 8px; border-left: 3px solid #4F46E5;">{{ $feedback }}</p>
@endif

<p style="text-align: center; margin: 30px 0;">
    <a href="{{ $submissionUrl }}" class="button">View Full Results</a>
</p>

<p>Keep up the great work and continue your learning journey!</p>

<p>Best,<br>The TILMS Team</p>

<div class="footer"><p>© {{ date('Y') }} TILMS. All rights reserved.</p></div>
</body>
</html>
