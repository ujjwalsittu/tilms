<?php

namespace App\Services;

use Illuminate\Support\Facades\Mail;

class ResendEmailService
{
    public function sendTransactional(string $to, string $subject, string $template, array $data = []): void
    {
        Mail::send("emails.{$template}", $data, function ($message) use ($to, $subject) {
            $message->to($to)->subject($subject);
        });
    }

    public function sendBulk(array $recipients, string $subject, string $body): int
    {
        $sent = 0;
        foreach (array_chunk($recipients, 50) as $chunk) {
            foreach ($chunk as $email) {
                try {
                    Mail::send('emails.newsletter', ['body' => $body], function ($message) use ($email, $subject) {
                        $message->to($email)->subject($subject);
                    });
                    $sent++;
                } catch (\Exception $e) {
                    \Illuminate\Support\Facades\Log::warning("Email send failed: {$email} - {$e->getMessage()}");
                }
            }
        }
        return $sent;
    }
}
