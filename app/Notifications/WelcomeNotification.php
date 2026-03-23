<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class WelcomeNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public function via($notifiable): array { return ['mail', 'database']; }

    public function toMail($notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject('Welcome to TILMS!')
            ->greeting("Hello {$notifiable->name}!")
            ->line('Welcome to the Technical Internship & Learning Management System.')
            ->line('Start your learning journey by exploring available cohorts.')
            ->action('Go to Dashboard', url('/dashboard'))
            ->line('Happy learning!');
    }

    public function toArray($notifiable): array
    {
        return ['type' => 'welcome', 'message' => 'Welcome to TILMS!'];
    }
}
