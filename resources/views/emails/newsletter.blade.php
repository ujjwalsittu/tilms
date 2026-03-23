<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; line-height: 1.6; color: #374151; max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { text-align: center; padding: 20px 0; border-bottom: 2px solid #4F46E5; margin-bottom: 20px; }
        .header h1 { color: #4F46E5; margin: 0; font-size: 24px; }
        .content { padding: 20px 0; }
        .footer { text-align: center; padding: 20px 0; border-top: 1px solid #E5E7EB; color: #9CA3AF; font-size: 12px; }
    </style>
</head>
<body>
    <div class="header">
        <h1>TILMS</h1>
    </div>
    <div class="content">
        {!! $body !!}
    </div>
    <div class="footer">
        <p>&copy; {{ date('Y') }} TILMS. All rights reserved.</p>
        <p>You received this because you are enrolled in a TILMS cohort.</p>
    </div>
</body>
</html>
