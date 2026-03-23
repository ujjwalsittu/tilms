<!DOCTYPE html>
<html>
<head>
<style>
    body { font-family: -apple-system, sans-serif; line-height: 1.6; color: #374151; max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { text-align: center; padding: 20px 0; border-bottom: 2px solid #4F46E5; margin-bottom: 20px; }
    .header h1 { color: #4F46E5; margin: 0; font-size: 24px; }
    .button { display: inline-block; padding: 12px 24px; background: #4F46E5; color: white; text-decoration: none; border-radius: 8px; font-weight: 600; }
    .footer { text-align: center; padding: 20px 0; border-top: 1px solid #E5E7EB; color: #9CA3AF; font-size: 12px; margin-top: 30px; }
    .unlock-card { background: linear-gradient(135deg, #F0FDF4 0%, #ECFDF5 100%); border: 2px solid #6EE7B7; border-radius: 12px; padding: 24px; text-align: center; margin: 20px 0; }
    .unlock-card h2 { color: #065F46; margin: 0 0 8px; }
    .task-detail { background: #F9FAFB; border: 1px solid #E5E7EB; border-radius: 8px; padding: 16px; margin: 16px 0; }
    .badge { display: inline-block; padding: 2px 10px; border-radius: 20px; font-size: 12px; font-weight: 600; }
    .badge-beginner { background: #D1FAE5; color: #065F46; }
    .badge-intermediate { background: #FEF3C7; color: #92400E; }
    .badge-advanced { background: #FEE2E2; color: #991B1B; }
</style>
</head>
<body>
<div class="header"><h1>TILMS</h1></div>

<p>Hi <strong>{{ $studentName }}</strong>,</p>

<div class="unlock-card">
    <div style="font-size: 36px; margin-bottom: 8px;">🔓</div>
    <h2>New Task Unlocked!</h2>
    <p style="margin: 0; color: #065F46;">A new challenge awaits you</p>
</div>

<div class="task-detail">
    <p style="margin: 0 0 8px;"><strong style="font-size: 18px;">{{ $taskName }}</strong></p>
    @if(isset($difficulty))
    <p style="margin: 4px 0;">
        Difficulty: <span class="badge badge-{{ $difficulty }}">{{ ucfirst($difficulty) }}</span>
    </p>
    @endif
    @if(isset($estimatedMinutes))
    <p style="margin: 4px 0; font-size: 14px; color: #6B7280;">Estimated time: {{ $estimatedMinutes }} minutes</p>
    @endif
    @if(isset($taskDescription))
    <p style="margin: 8px 0 0; font-size: 14px; color: #4B5563;">{{ Str::limit($taskDescription, 200) }}</p>
    @endif
</div>

<p>Don't wait — tackle this task while it's fresh. Each completed task brings you one step closer to your certificate!</p>

<p style="text-align: center; margin: 30px 0;">
    <a href="{{ $taskUrl }}" class="button">Start Working on This Task</a>
</p>

<p>Go get it,<br>The TILMS Team</p>

<div class="footer"><p>© {{ date('Y') }} TILMS. All rights reserved.</p></div>
</body>
</html>
