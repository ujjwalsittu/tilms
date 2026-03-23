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
        Schema::create('ai_conversations', function (Blueprint $table) {
            $table->id();
            $table->char('uuid', 36)->unique();
            $table->unsignedBigInteger('user_id');
            $table->enum('type', ['doubt_assistant', 'interview_simulator']);
            $table->unsignedBigInteger('cohort_id')->nullable();
            $table->unsignedBigInteger('task_id')->nullable();
            $table->string('title', 255)->nullable();
            $table->json('messages');
            $table->string('model', 100);
            $table->unsignedInteger('total_tokens_used')->default(0);
            $table->timestamps();

            $table->foreign('user_id')->references('id')->on('users')->cascadeOnDelete();
            $table->foreign('cohort_id')->references('id')->on('cohorts')->nullOnDelete();
            $table->foreign('task_id')->references('id')->on('tasks')->nullOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('ai_conversations');
    }
};
