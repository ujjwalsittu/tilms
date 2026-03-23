<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Models\AiConversation;
use App\Services\ClaudeAiService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AiDoubtAssistantController extends Controller
{
    public function index()
    {
        $conversations = AiConversation::where('user_id', auth()->id())
            ->where('type', 'doubt_assistant')
            ->latest()
            ->paginate(20);

        return Inertia::render('Student/Ai/DoubtAssistant', [
            'conversations' => $conversations,
        ]);
    }

    public function show(AiConversation $conversation)
    {
        abort_if($conversation->user_id !== auth()->id(), 403);

        return Inertia::render('Student/Ai/DoubtChat', [
            'conversation' => $conversation,
        ]);
    }

    public function ask(Request $request, ClaudeAiService $ai)
    {
        $validated = $request->validate([
            'message' => 'required|string|max:5000',
            'conversation_id' => 'nullable|exists:ai_conversations,id',
            'cohort_id' => 'nullable|exists:cohorts,id',
            'task_id' => 'nullable|exists:tasks,id',
        ]);

        // Get or create conversation
        if ($validated['conversation_id'] ?? null) {
            $conversation = AiConversation::findOrFail($validated['conversation_id']);
            abort_if($conversation->user_id !== auth()->id(), 403);
        } else {
            $conversation = AiConversation::create([
                'user_id' => auth()->id(),
                'type' => 'doubt_assistant',
                'cohort_id' => $validated['cohort_id'] ?? null,
                'task_id' => $validated['task_id'] ?? null,
                'title' => substr($validated['message'], 0, 100),
                'messages' => [],
                'model' => 'claude-sonnet-4-20250514',
            ]);
        }

        // Add user message
        $messages = $conversation->messages ?? [];
        $messages[] = ['role' => 'user', 'content' => $validated['message'], 'timestamp' => now()->toIso8601String()];

        // Build context
        $systemPrompt = "You are a helpful AI teaching assistant for a technical learning platform. Help students understand concepts without giving away complete solutions. Use the Socratic method - ask guiding questions. Be encouraging and patient.";

        // Build API messages (just role + content)
        $apiMessages = collect($messages)->map(fn($m) => ['role' => $m['role'], 'content' => $m['content']])->toArray();

        try {
            $response = $ai->chat($apiMessages, $systemPrompt, 'doubt_assistant', auth()->id(), $conversation);
            $assistantText = $ai->getResponseText($response);

            $messages[] = ['role' => 'assistant', 'content' => $assistantText, 'timestamp' => now()->toIso8601String()];

            $conversation->update([
                'messages' => $messages,
                'total_tokens_used' => $conversation->total_tokens_used + ($response['usage']['input_tokens'] ?? 0) + ($response['usage']['output_tokens'] ?? 0),
            ]);
        } catch (\Exception $e) {
            $messages[] = ['role' => 'assistant', 'content' => 'Sorry, I encountered an error. Please try again.', 'timestamp' => now()->toIso8601String()];
            $conversation->update(['messages' => $messages]);
        }

        return back();
    }
}
