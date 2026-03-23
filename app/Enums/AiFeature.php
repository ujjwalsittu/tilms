<?php

namespace App\Enums;

enum AiFeature: string
{
    case TaskGeneration = 'task_generation';
    case CodeEvaluation = 'code_evaluation';
    case ProjectScaffolding = 'project_scaffolding';
    case PlagiarismAnalysis = 'plagiarism_analysis';
    case AiCodeDetection = 'ai_code_detection';
    case DoubtAssistant = 'doubt_assistant';
    case InterviewSimulator = 'interview_simulator';
    case ProgressReport = 'progress_report';

    public function label(): string
    {
        return match ($this) {
            self::TaskGeneration => 'Task Generation',
            self::CodeEvaluation => 'Code Evaluation',
            self::ProjectScaffolding => 'Project Scaffolding',
            self::PlagiarismAnalysis => 'Plagiarism Analysis',
            self::AiCodeDetection => 'AI Code Detection',
            self::DoubtAssistant => 'Doubt Assistant',
            self::InterviewSimulator => 'Interview Simulator',
            self::ProgressReport => 'Progress Report',
        };
    }
}
