<?php

namespace App\Jobs\Ai;

use App\Models\Task;
use App\Services\ClaudeAiService;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class GenerateTask implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public int $tries = 3;
    public int $backoff = 30;

    public function __construct(
        public Task $task,
        public string $domain,
        public ?string $additionalContext = null,
    ) {
        $this->onQueue('ai');
    }

    public function handle(ClaudeAiService $ai): void
    {
        $result = $ai->generateTask(
            $this->domain,
            $this->task->type->value,
            $this->task->difficulty->value,
            $this->additionalContext,
            $this->task->creator_id
        );

        $this->task->update([
            'ai_generated_content' => $result,
            'description' => $result['description'] ?? $this->task->description,
            'test_cases' => $result['test_cases'] ?? $this->task->test_cases,
            'is_ai_generated' => true,
        ]);
    }
}
