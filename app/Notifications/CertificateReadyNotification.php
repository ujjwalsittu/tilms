<?php

namespace App\Notifications;

use App\Models\Certificate;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class CertificateReadyNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(public Certificate $certificate) {}

    public function via($notifiable): array { return ['mail', 'database']; }

    public function toMail($notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject('Your Certificate is Ready!')
            ->greeting("Congratulations {$notifiable->name}!")
            ->line("Your certificate for **{$this->certificate->cohort->title}** is ready.")
            ->line("Certificate Number: {$this->certificate->certificate_number}")
            ->action('View Certificate', url("/student/certificates/{$this->certificate->id}/download"))
            ->line('Share your achievement with the world!');
    }

    public function toArray($notifiable): array
    {
        return [
            'type' => 'certificate_ready',
            'certificate_id' => $this->certificate->id,
            'cohort_title' => $this->certificate->cohort->title ?? 'Cohort',
        ];
    }
}
