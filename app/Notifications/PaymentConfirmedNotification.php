<?php

namespace App\Notifications;

use App\Models\Payment;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class PaymentConfirmedNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(public Payment $payment) {}

    public function via($notifiable): array { return ['mail', 'database']; }

    public function toMail($notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject('Payment Confirmation')
            ->greeting("Hello {$notifiable->name}!")
            ->line("Your payment of {$this->payment->currency} {$this->payment->amount} has been confirmed.")
            ->line("Cohort: {$this->payment->cohort->title}")
            ->action('View Billing', url('/student/billing'))
            ->line('Thank you for your enrollment!');
    }

    public function toArray($notifiable): array
    {
        return [
            'type' => 'payment_confirmed',
            'payment_id' => $this->payment->id,
            'amount' => $this->payment->amount,
        ];
    }
}
