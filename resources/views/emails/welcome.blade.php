<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; line-height: 1.6; color: #374151; max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { text-align: center; padding: 20px 0; }
        .header h1 { color: #4F46E5; margin: 0; }
        .button { display: inline-block; padding: 12px 24px; background: #4F46E5; color: white; text-decoration: none; border-radius: 8px; font-weight: 600; }
        .footer { text-align: center; padding: 20px 0; border-top: 1px solid #E5E7EB; color: #9CA3AF; font-size: 12px; margin-top: 30px; }
    </style>
</head>
<body>
    <div class="header">
        <h1>TILMS</h1>
    </div>
    <h2>Welcome, {{ $name }}!</h2>
    <p>Thank you for joining TILMS. Your learning journey starts now.</p>
    <p style="text-align: center; margin: 30px 0;">
        <a href="{{ url('/dashboard') }}" class="button">Go to Dashboard</a>
    </p>
    <div class="footer">
        <p>&copy; {{ date('Y') }} TILMS. All rights reserved.</p>
    </div>
</body>
</html>
