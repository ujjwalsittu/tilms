<?php

namespace App\Enums;

enum ConversationType: string
{
    case DoubtAssistant = 'doubt_assistant';
    case InterviewSimulator = 'interview_simulator';

    public function label(): string
    {
        return match ($this) {
            self::DoubtAssistant => 'Doubt Assistant',
            self::InterviewSimulator => 'Interview Simulator',
        };
    }
}
