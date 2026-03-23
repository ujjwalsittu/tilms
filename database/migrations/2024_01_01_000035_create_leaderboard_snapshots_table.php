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
        Schema::create('leaderboard_snapshots', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('cohort_id');
            $table->unsignedBigInteger('student_id');
            $table->unsignedInteger('rank');
            $table->decimal('score', 10, 2);
            $table->unsignedInteger('tasks_completed');
            $table->decimal('average_grade', 5, 2);
            $table->unsignedInteger('streak_days');
            $table->date('snapshot_date');
            $table->timestamp('created_at')->nullable();

            $table->foreign('cohort_id')->references('id')->on('cohorts')->cascadeOnDelete();
            $table->foreign('student_id')->references('id')->on('users')->cascadeOnDelete();

            $table->index(['cohort_id', 'snapshot_date', 'rank']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('leaderboard_snapshots');
    }
};
