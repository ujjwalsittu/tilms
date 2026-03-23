<!DOCTYPE html>
<html>
<head>
<style>
    body { font-family: -apple-system, sans-serif; line-height: 1.6; color: #374151; max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { text-align: center; padding: 20px 0; border-bottom: 2px solid #4F46E5; margin-bottom: 20px; }
    .header h1 { color: #4F46E5; margin: 0; font-size: 24px; }
    .button { display: inline-block; padding: 12px 24px; background: #4F46E5; color: white; text-decoration: none; border-radius: 8px; font-weight: 600; }
    .footer { text-align: center; padding: 20px 0; border-top: 1px solid #E5E7EB; color: #9CA3AF; font-size: 12px; margin-top: 30px; }
    .ticket-info { background: #EFF6FF; border: 1px solid #BFDBFE; border-radius: 8px; padding: 16px; margin: 16px 0; }
    .reply-preview { background: #F9FAFB; border-left: 4px solid #4F46E5; padding: 12px 16px; border-radius: 0 8px 8px 0; margin: 16px 0; font-style: italic; color: #4B5563; }
</style>
</head>
<body>
<div class="header"><h1>TILMS</h1></div>

<p>Hi <strong>{{ $studentName }}</strong>,</p>

<p>There is a new reply on your support ticket.</p>

<div class="ticket-info">
    <strong>Ticket Subject:</strong> {{ $ticketSubject }}<br>
    <strong>Ticket #:</strong> {{ $ticketId }}<br>
    <strong>Status:</strong> {{ ucfirst($ticketStatus ?? 'open') }}
</div>

@if(isset($replyPreview))
<p><strong>Latest reply:</strong></p>
<div class="reply-preview">{{ Str::limit($replyPreview, 300) }}</div>
@endif

<p style="text-align: center; margin: 30px 0;">
    <a href="{{ $ticketUrl }}" class="button">View Ticket & Reply</a>
</p>

<p>If you believe your issue is resolved, you can mark the ticket as closed from the support portal.</p>

<p>Support Team,<br>TILMS</p>

<div class="footer"><p>© {{ date('Y') }} TILMS. All rights reserved.</p></div>
</body>
</html>
