<?php

namespace App\Notifications;

use App\Models\TaskSubmission;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class SubmissionGradedNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(public TaskSubmission $submission) {}

    public function via($notifiable): array { return ['mail', 'database']; }

    public function toMail($notifiable): MailMessage
    {
        $task = $this->submission->cohortTask->task;
        $status = $this->submission->status->value;

        return (new MailMessage)
            ->subject("Task Review: {$task->title}")
            ->greeting("Hello {$notifiable->name}!")
            ->line("Your submission for **{$task->title}** has been reviewed.")
            ->line("Status: " . ucfirst(str_replace('_', ' ', $status)))
            ->when($this->submission->instructor_score, fn($m) => $m->line("Score: {$this->submission->instructor_score}/100"))
            ->action('View Result', url("/student/tasks/{$this->submission->id}/editor"));
    }

    public function toArray($notifiable): array
    {
        return [
            'type' => 'submission_graded',
            'submission_id' => $this->submission->id,
            'task_title' => $this->submission->cohortTask->task->title ?? 'Task',
            'status' => $this->submission->status->value,
        ];
    }
}
