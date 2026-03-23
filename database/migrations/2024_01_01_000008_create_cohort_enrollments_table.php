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
        Schema::create('cohort_enrollments', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('cohort_id');
            $table->unsignedBigInteger('student_id');
            $table->enum('status', ['waitlisted', 'enrolled', 'audit', 'completed', 'dropped'])->default('enrolled');
            $table->timestamp('enrolled_at')->nullable();
            $table->timestamp('completed_at')->nullable();
            $table->decimal('completion_percent', 5, 2)->default(0);
            $table->boolean('certificate_issued')->default(false);
            $table->integer('streak_current')->default(0);
            $table->integer('streak_longest')->default(0);
            $table->timestamp('last_activity_at')->nullable();
            $table->timestamps();

            $table->foreign('cohort_id')->references('id')->on('cohorts')->cascadeOnDelete();
            $table->foreign('student_id')->references('id')->on('users')->cascadeOnDelete();

            $table->unique(['cohort_id', 'student_id']);
            $table->index('status');
            $table->index('student_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('cohort_enrollments');
    }
};
