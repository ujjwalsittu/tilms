<!DOCTYPE html>
<html>
<head>
<style>
    body { font-family: -apple-system, sans-serif; line-height: 1.6; color: #374151; max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { text-align: center; padding: 20px 0; border-bottom: 2px solid #4F46E5; margin-bottom: 20px; }
    .header h1 { color: #4F46E5; margin: 0; font-size: 24px; }
    .button { display: inline-block; padding: 12px 24px; background: #4F46E5; color: white; text-decoration: none; border-radius: 8px; font-weight: 600; }
    .footer { text-align: center; padding: 20px 0; border-top: 1px solid #E5E7EB; color: #9CA3AF; font-size: 12px; margin-top: 30px; }
    .stats-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin: 20px 0; }
    .stat-card { background: #F9FAFB; border: 1px solid #E5E7EB; border-radius: 8px; padding: 16px; text-align: center; }
    .stat-value { font-size: 28px; font-weight: bold; color: #4F46E5; }
    .stat-label { font-size: 12px; color: #6B7280; margin-top: 4px; }
    .progress-bar-bg { background: #E5E7EB; border-radius: 99px; height: 10px; margin: 8px 0; }
    .progress-bar-fill { background: #4F46E5; border-radius: 99px; height: 10px; }
    .recommendation { background: #EEF2FF; border-left: 4px solid #4F46E5; padding: 10px 14px; border-radius: 0 6px 6px 0; margin: 8px 0; font-size: 14px; }
</style>
</head>
<body>
<div class="header"><h1>TILMS</h1></div>

<p>Hi <strong>{{ $studentName }}</strong>,</p>

<p>Here's your weekly progress summary for <strong>{{ $cohortName }}</strong> (week ending {{ $weekEnding ?? now()->format('M j, Y') }}).</p>

<div class="stats-grid">
    <div class="stat-card">
        <div class="stat-value">{{ $completionPercent }}%</div>
        <div class="stat-label">Overall Completion</div>
    </div>
    <div class="stat-card">
        <div class="stat-value">{{ $tasksDone }}</div>
        <div class="stat-label">Tasks Completed</div>
    </div>
    <div class="stat-card">
        <div class="stat-value">{{ $tasksTotal }}</div>
        <div class="stat-label">Total Tasks</div>
    </div>
    <div class="stat-card">
        <div class="stat-value">{{ $averageScore ?? 'N/A' }}</div>
        <div class="stat-label">Avg. Score</div>
    </div>
</div>

<p><strong>Completion Progress</strong></p>
<div class="progress-bar-bg">
    <div class="progress-bar-fill" style="width: {{ min($completionPercent, 100) }}%;"></div>
</div>
<p style="font-size: 13px; color: #6B7280; text-align: right;">{{ $completionPercent }}% complete</p>

@if(!empty($recommendations))
<p><strong>Recommendations for Next Week</strong></p>
@foreach($recommendations as $rec)
<div class="recommendation">{{ $rec }}</div>
@endforeach
@endif

@if(isset($summary))
<p><strong>Summary</strong></p>
<p style="color: #4B5563; font-size: 14px;">{{ $summary }}</p>
@endif

<p style="text-align: center; margin: 30px 0;">
    <a href="{{ $reportUrl }}" class="button">View Full Progress Report</a>
</p>

<p>Keep going — consistency is the key to mastery!</p>

<p>Your learning team,<br>TILMS</p>

<div class="footer"><p>© {{ date('Y') }} TILMS. All rights reserved.</p></div>
</body>
</html>
