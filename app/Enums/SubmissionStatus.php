<?php

namespace App\Enums;

enum SubmissionStatus: string
{
    case Draft = 'draft';
    case Submitted = 'submitted';
    case AiReviewing = 'ai_reviewing';
    case AiReviewed = 'ai_reviewed';
    case InstructorReviewing = 'instructor_reviewing';
    case Graded = 'graded';
    case Returned = 'returned';

    public function label(): string
    {
        return match ($this) {
            self::Draft => 'Draft',
            self::Submitted => 'Submitted',
            self::AiReviewing => 'AI Reviewing',
            self::AiReviewed => 'AI Reviewed',
            self::InstructorReviewing => 'Instructor Reviewing',
            self::Graded => 'Graded',
            self::Returned => 'Returned',
        };
    }
}
