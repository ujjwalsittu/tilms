<?php

namespace App\Notifications;

use App\Models\Cohort;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class EnrollmentConfirmed extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(public Cohort $cohort) {}

    public function via($notifiable): array { return ['mail', 'database']; }

    public function toMail($notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject("Enrollment Confirmed: {$this->cohort->title}")
            ->greeting("Hello {$notifiable->name}!")
            ->line("You have been successfully enrolled in **{$this->cohort->title}**.")
            ->line("Type: " . ucfirst($this->cohort->type->value))
            ->action('View Cohort', url("/student/cohorts/{$this->cohort->id}"))
            ->line('Good luck with your learning!');
    }

    public function toArray($notifiable): array
    {
        return ['type' => 'enrollment_confirmed', 'cohort_id' => $this->cohort->id, 'cohort_title' => $this->cohort->title];
    }
}
