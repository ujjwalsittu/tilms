<?php

namespace App\Jobs\Ai;

use App\Models\TaskSubmission;
use App\Services\ClaudeAiService;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class DetectAiGeneratedCode implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public int $tries = 2;

    public function __construct(public TaskSubmission $submission)
    {
        $this->onQueue('ai');
    }

    public function handle(ClaudeAiService $ai): void
    {
        $result = $ai->detectAiGeneratedCode(
            $this->submission->code_content,
            $this->submission->code_language ?? 'javascript',
            $this->submission->student_id,
            $this->submission
        );

        $this->submission->update([
            'ai_generated_code_score' => $result['ai_probability'] ?? null,
        ]);
    }
}
