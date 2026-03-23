<?php

namespace App\Services;

use App\Models\AiUsageLog;
use App\Models\ApiKey;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\DB;

class ClaudeAiService
{
    private string $baseUrl = 'https://api.anthropic.com/v1';

    private function getApiKey(): string
    {
        $apiKey = ApiKey::where('service', 'claude')
            ->where('key_name', 'api_key')
            ->where('is_active', true)
            ->first();

        if (!$apiKey) {
            throw new \RuntimeException('Claude API key not configured.');
        }

        return Crypt::decryptString($apiKey->encrypted_value);
    }

    private function getModel(string $feature): string
    {
        // Check if there's a feature-specific model setting
        $setting = DB::table('platform_settings')
            ->where('key', "claude_model_{$feature}")
            ->value('value');

        return $setting ?? DB::table('platform_settings')
            ->where('key', 'claude_default_model')
            ->value('value') ?? 'claude-sonnet-4-20250514';
    }

    public function chat(array $messages, string $systemPrompt, string $feature, ?int $userId = null, $related = null): array
    {
        $model = $this->getModel($feature);
        $startTime = microtime(true);

        $response = Http::withHeaders([
            'x-api-key' => $this->getApiKey(),
            'anthropic-version' => '2023-06-01',
            'content-type' => 'application/json',
        ])->timeout(120)->post("{$this->baseUrl}/messages", [
            'model' => $model,
            'max_tokens' => 4096,
            'system' => $systemPrompt,
            'messages' => $messages,
        ]);

        $duration = (int) ((microtime(true) - $startTime) * 1000);

        if (!$response->successful()) {
            throw new \RuntimeException('Claude API error: ' . $response->body());
        }

        $data = $response->json();

        // Log usage
        $inputTokens = $data['usage']['input_tokens'] ?? 0;
        $outputTokens = $data['usage']['output_tokens'] ?? 0;
        $totalTokens = $inputTokens + $outputTokens;

        AiUsageLog::create([
            'user_id' => $userId,
            'feature' => $feature,
            'model' => $model,
            'input_tokens' => $inputTokens,
            'output_tokens' => $outputTokens,
            'total_tokens' => $totalTokens,
            'cost_usd' => $this->calculateCost($model, $inputTokens, $outputTokens),
            'request_duration_ms' => $duration,
            'related_type' => $related ? get_class($related) : null,
            'related_id' => $related?->getKey(),
            'created_at' => now(),
        ]);

        return $data;
    }

    private function calculateCost(string $model, int $inputTokens, int $outputTokens): float
    {
        // Pricing per million tokens (approximate)
        $pricing = [
            'claude-sonnet-4-20250514' => ['input' => 3.0, 'output' => 15.0],
            'claude-haiku-4-5-20251001' => ['input' => 0.80, 'output' => 4.0],
            'claude-opus-4-20250515' => ['input' => 15.0, 'output' => 75.0],
        ];

        $rates = $pricing[$model] ?? ['input' => 3.0, 'output' => 15.0];

        return ($inputTokens * $rates['input'] / 1_000_000) + ($outputTokens * $rates['output'] / 1_000_000);
    }

    public function getResponseText(array $response): string
    {
        return collect($response['content'] ?? [])
            ->where('type', 'text')
            ->pluck('text')
            ->implode("\n");
    }

    // === Feature-specific methods ===

    public function generateTask(string $domain, string $type, string $difficulty, ?string $additionalContext = null, ?int $userId = null): array
    {
        $systemPrompt = "You are an expert technical instructor. Generate a {$difficulty} level {$type} task for the {$domain} domain. Return a JSON object with: title, description, learning_objectives (array), resources (array of {title, url}), test_cases (array of {input, expected_output, description} - for individual tasks only), submission_guidelines (string).";

        $userMessage = "Create a {$type} task for {$domain}.";
        if ($additionalContext) {
            $userMessage .= " Additional context: {$additionalContext}";
        }

        $response = $this->chat(
            [['role' => 'user', 'content' => $userMessage]],
            $systemPrompt,
            'task_generation',
            $userId
        );

        $text = $this->getResponseText($response);

        // Try to parse JSON from the response
        if (preg_match('/\{[\s\S]*\}/', $text, $matches)) {
            return json_decode($matches[0], true) ?? ['raw' => $text];
        }

        return ['raw' => $text];
    }

    public function evaluateSubmission(string $code, string $language, string $taskDescription, ?array $rubric = null, ?int $userId = null, $related = null): array
    {
        $rubricText = $rubric ? "\n\nEvaluation Rubric:\n" . json_encode($rubric) : '';

        $systemPrompt = "You are an expert code reviewer evaluating a student submission. Provide Socratic feedback - guide the student toward understanding without giving away the complete answer. Return a JSON object with: score (0-100), passed (boolean), feedback (string - Socratic guidance), strengths (array of strings), improvements (array of strings), code_quality (string: excellent/good/fair/poor).{$rubricText}";

        $response = $this->chat(
            [['role' => 'user', 'content' => "Task: {$taskDescription}\n\nLanguage: {$language}\n\nStudent's code:\n```{$language}\n{$code}\n```\n\nEvaluate this submission."]],
            $systemPrompt,
            'code_evaluation',
            $userId,
            $related
        );

        $text = $this->getResponseText($response);

        if (preg_match('/\{[\s\S]*\}/', $text, $matches)) {
            return json_decode($matches[0], true) ?? ['raw' => $text];
        }

        return ['raw' => $text, 'score' => 0];
    }

    public function generateProjectScaffolding(string $description, array $languages, ?string $modelType = null, ?int $userId = null): array
    {
        $langList = implode(', ', $languages);
        $mlContext = $modelType ? " The project involves {$modelType}." : '';

        $systemPrompt = "You are an expert software architect. Generate project scaffolding for a student project. Return a JSON object with: project_structure (object - directory tree), readme_content (string - markdown), help_book (string - detailed reference guide), task_breakdown (array of {milestone, description, deliverables}), setup_instructions (string).{$mlContext}";

        $response = $this->chat(
            [['role' => 'user', 'content' => "Project: {$description}\nLanguages/Stack: {$langList}\n\nGenerate the complete project scaffolding."]],
            $systemPrompt,
            'project_scaffolding',
            $userId
        );

        $text = $this->getResponseText($response);

        if (preg_match('/\{[\s\S]*\}/', $text, $matches)) {
            return json_decode($matches[0], true) ?? ['raw' => $text];
        }

        return ['raw' => $text];
    }

    public function analyzePlagiarism(string $code1, string $code2, ?int $userId = null, $related = null): array
    {
        $systemPrompt = "You are a plagiarism detection expert. Compare two code submissions and determine if they are suspiciously similar. Return a JSON object with: similarity_score (0-100), is_suspicious (boolean), similar_sections (array of {description, code1_lines, code2_lines}), analysis (string).";

        $response = $this->chat(
            [['role' => 'user', 'content' => "Submission 1:\n```\n{$code1}\n```\n\nSubmission 2:\n```\n{$code2}\n```\n\nAnalyze for plagiarism."]],
            $systemPrompt,
            'plagiarism_analysis',
            $userId,
            $related
        );

        $text = $this->getResponseText($response);

        if (preg_match('/\{[\s\S]*\}/', $text, $matches)) {
            return json_decode($matches[0], true) ?? ['raw' => $text];
        }

        return ['raw' => $text, 'similarity_score' => 0];
    }

    public function detectAiGeneratedCode(string $code, string $language, ?int $userId = null, $related = null): array
    {
        $systemPrompt = "You are an expert at detecting AI-generated code. Analyze the code and determine the likelihood it was generated by an AI. Return a JSON object with: ai_probability (0-100), indicators (array of strings describing why), human_indicators (array of strings suggesting human authorship), verdict (string: likely_human/mixed/likely_ai).";

        $response = $this->chat(
            [['role' => 'user', 'content' => "Language: {$language}\n\nCode:\n```{$language}\n{$code}\n```\n\nAnalyze whether this code was AI-generated."]],
            $systemPrompt,
            'ai_code_detection',
            $userId,
            $related
        );

        $text = $this->getResponseText($response);

        if (preg_match('/\{[\s\S]*\}/', $text, $matches)) {
            return json_decode($matches[0], true) ?? ['raw' => $text];
        }

        return ['raw' => $text, 'ai_probability' => 0];
    }

    public function generateProgressReport(array $metrics, string $studentName, string $cohortName, ?int $userId = null): array
    {
        $systemPrompt = "You are an encouraging learning mentor. Generate a weekly progress report for a student. Be constructive and motivating. Return a JSON object with: summary (string), strengths (array of strings), areas_for_improvement (array of strings), recommendations (array of strings), encouragement (string).";

        $response = $this->chat(
            [['role' => 'user', 'content' => "Student: {$studentName}\nCohort: {$cohortName}\nMetrics: " . json_encode($metrics) . "\n\nGenerate their weekly progress report."]],
            $systemPrompt,
            'progress_report',
            $userId
        );

        $text = $this->getResponseText($response);

        if (preg_match('/\{[\s\S]*\}/', $text, $matches)) {
            return json_decode($matches[0], true) ?? ['raw' => $text];
        }

        return ['raw' => $text];
    }
}
