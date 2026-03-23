<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('task_submissions', function (Blueprint $table) {
            $table->id();
            $table->char('uuid', 36)->unique();
            $table->unsignedBigInteger('cohort_task_id');
            $table->unsignedBigInteger('student_id');
            $table->enum('type', ['code', 'github']);
            $table->enum('status', ['draft', 'submitted', 'ai_reviewing', 'ai_reviewed', 'instructor_reviewing', 'graded', 'returned'])->default('draft');
            $table->longText('code_content')->nullable();
            $table->string('code_language', 50)->nullable();
            $table->string('github_repo_url', 512)->nullable();
            $table->string('github_commit_sha', 40)->nullable();
            $table->json('ai_evaluation_report')->nullable();
            $table->decimal('ai_score', 5, 2)->nullable();
            $table->text('ai_feedback')->nullable();
            $table->decimal('ai_plagiarism_score', 5, 2)->nullable();
            $table->decimal('ai_generated_code_score', 5, 2)->nullable();
            $table->decimal('instructor_score', 5, 2)->nullable();
            $table->text('instructor_feedback')->nullable();
            $table->timestamp('submitted_at')->nullable();
            $table->timestamp('reviewed_at')->nullable();
            $table->unsignedInteger('attempt_number')->default(1);
            $table->json('metadata')->nullable();
            $table->timestamps();

            $table->foreign('cohort_task_id')->references('id')->on('cohort_tasks')->cascadeOnDelete();
            $table->foreign('student_id')->references('id')->on('users')->cascadeOnDelete();

            $table->index('student_id');
            $table->index('cohort_task_id');
            $table->index('status');
            $table->index(['cohort_task_id', 'student_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('task_submissions');
    }
};
