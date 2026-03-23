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
        Schema::create('tasks', function (Blueprint $table) {
            $table->id();
            $table->char('uuid', 36)->unique();
            $table->unsignedBigInteger('creator_id');
            $table->string('title', 255);
            $table->text('description');
            $table->enum('type', ['individual', 'project']);
            $table->enum('difficulty', ['beginner', 'intermediate', 'advanced']);
            $table->unsignedInteger('estimated_minutes')->nullable();
            $table->string('programming_language', 50)->nullable();
            $table->json('tags')->nullable();
            $table->text('starter_code')->nullable();
            $table->json('test_cases')->nullable();
            $table->text('project_requirements')->nullable();
            $table->string('github_repo_template', 255)->nullable();
            $table->text('ai_generation_prompt')->nullable();
            $table->json('ai_generated_content')->nullable();
            $table->json('ai_evaluation_rubric')->nullable();
            $table->string('ai_model_preference', 100)->nullable();
            $table->boolean('is_ai_generated')->default(false);
            $table->json('metadata')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->foreign('creator_id')->references('id')->on('users')->restrictOnDelete();

            $table->index('creator_id');
            $table->index('type');
            $table->index('difficulty');
            $table->index('programming_language');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tasks');
    }
};
