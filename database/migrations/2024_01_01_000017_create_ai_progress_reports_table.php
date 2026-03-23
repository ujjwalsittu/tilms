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
        Schema::create('ai_progress_reports', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('student_id');
            $table->unsignedBigInteger('cohort_id');
            $table->date('report_week');
            $table->text('summary');
            $table->json('strengths');
            $table->json('areas_for_improvement');
            $table->json('recommendations');
            $table->json('metrics');
            $table->string('ai_model', 100);
            $table->timestamp('created_at')->nullable();

            $table->foreign('student_id')->references('id')->on('users')->cascadeOnDelete();
            $table->foreign('cohort_id')->references('id')->on('cohorts')->cascadeOnDelete();

            $table->unique(['student_id', 'cohort_id', 'report_week']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('ai_progress_reports');
    }
};
