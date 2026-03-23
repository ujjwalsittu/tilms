<?php

namespace App\Jobs\Ai;

use App\Models\TaskSubmission;
use App\Services\ClaudeAiService;
use App\Events\SubmissionGraded;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class EvaluateSubmission implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public int $tries = 3;
    public int $backoff = 30;

    public function __construct(public TaskSubmission $submission)
    {
        $this->onQueue('ai');
    }

    public function handle(ClaudeAiService $ai): void
    {
        $this->submission->update(['status' => 'ai_reviewing']);

        $task = $this->submission->cohortTask->task;

        $result = $ai->evaluateSubmission(
            $this->submission->code_content,
            $this->submission->code_language ?? 'javascript',
            $task->description,
            $task->ai_evaluation_rubric,
            $this->submission->student_id,
            $this->submission
        );

        $this->submission->update([
            'status' => 'ai_reviewed',
            'ai_evaluation_report' => $result,
            'ai_score' => $result['score'] ?? null,
            'ai_feedback' => $result['feedback'] ?? $result['raw'] ?? null,
        ]);
    }
}
