<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Models\AiConversation;
use App\Services\ClaudeAiService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AiInterviewSimController extends Controller
{
    public function index()
    {
        $interviews = AiConversation::where('user_id', auth()->id())
            ->where('type', 'interview_simulator')
            ->latest()
            ->paginate(20);

        return Inertia::render('Student/Ai/InterviewSimulator', [
            'interviews' => $interviews,
        ]);
    }

    public function start(Request $request, ClaudeAiService $ai)
    {
        $validated = $request->validate([
            'domain' => 'required|string|max:100',
            'difficulty' => 'required|in:beginner,intermediate,advanced',
        ]);

        $systemPrompt = "You are a technical interviewer conducting a {$validated['difficulty']} level interview for a {$validated['domain']} position. Ask one question at a time. After the candidate answers, provide brief feedback and follow up with a related question to assess depth. Keep it professional and realistic.";

        $firstMessage = "Let's begin the {$validated['domain']} technical interview ({$validated['difficulty']} level). I'll ask you questions one at a time.";

        $messages = [['role' => 'user', 'content' => "Start the interview for {$validated['domain']} at {$validated['difficulty']} level."]];

        try {
            $response = $ai->chat($messages, $systemPrompt, 'interview_simulator', auth()->id());
            $assistantText = $ai->getResponseText($response);

            $storedMessages = [
                ['role' => 'assistant', 'content' => $assistantText, 'timestamp' => now()->toIso8601String()],
            ];
        } catch (\Exception $e) {
            $storedMessages = [
                ['role' => 'assistant', 'content' => 'Welcome! Let\'s start your interview. Tell me about your experience with ' . $validated['domain'] . '.', 'timestamp' => now()->toIso8601String()],
            ];
        }

        $conversation = AiConversation::create([
            'user_id' => auth()->id(),
            'type' => 'interview_simulator',
            'title' => "{$validated['domain']} Interview ({$validated['difficulty']})",
            'messages' => $storedMessages,
            'model' => 'claude-sonnet-4-20250514',
        ]);

        return redirect()->route('student.ai.interview.show', $conversation->id);
    }

    public function show(AiConversation $conversation)
    {
        abort_if($conversation->user_id !== auth()->id(), 403);

        return Inertia::render('Student/Ai/InterviewChat', [
            'conversation' => $conversation,
        ]);
    }

    public function respond(Request $request, AiConversation $conversation, ClaudeAiService $ai)
    {
        abort_if($conversation->user_id !== auth()->id(), 403);

        $validated = $request->validate([
            'message' => 'required|string|max:5000',
        ]);

        $messages = $conversation->messages ?? [];
        $messages[] = ['role' => 'user', 'content' => $validated['message'], 'timestamp' => now()->toIso8601String()];

        $systemPrompt = "You are a technical interviewer. Continue the interview. After the candidate's answer, briefly evaluate it (strengths and areas to improve), then ask a follow-up question. If you've asked 5+ questions, you may wrap up and provide a summary feedback report.";

        $apiMessages = collect($messages)->map(fn($m) => ['role' => $m['role'], 'content' => $m['content']])->toArray();

        try {
            $response = $ai->chat($apiMessages, $systemPrompt, 'interview_simulator', auth()->id(), $conversation);
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
