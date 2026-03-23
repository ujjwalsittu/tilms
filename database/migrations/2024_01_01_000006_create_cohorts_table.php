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
        Schema::create('cohorts', function (Blueprint $table) {
            $table->id();
            $table->char('uuid', 36)->unique();
            $table->unsignedBigInteger('instructor_id');
            $table->string('title', 255);
            $table->string('slug', 255)->unique();
            $table->text('description')->nullable();
            $table->enum('type', ['internship', 'learning']);
            $table->enum('status', ['draft', 'registration_open', 'in_progress', 'closed', 'archived'])->default('draft');
            $table->timestamp('registration_opens_at')->nullable();
            $table->timestamp('registration_closes_at')->nullable();
            $table->timestamp('starts_at')->nullable();
            $table->decimal('price_amount', 10, 2);
            $table->string('price_currency', 3)->default('INR');
            $table->boolean('has_free_audit')->default(false);
            $table->unsignedInteger('max_students')->nullable();
            $table->boolean('has_waitlist')->default(false);
            $table->string('invite_code', 64)->unique()->nullable();
            $table->json('landing_page_content')->nullable();
            $table->boolean('landing_page_published')->default(false);
            $table->enum('task_ordering', ['sequential', 'shuffled'])->default('sequential');
            $table->boolean('has_leaderboard')->default(false);
            $table->decimal('completion_threshold', 5, 2)->default(70.00);
            $table->unsignedBigInteger('certificate_template_id')->nullable();
            $table->unsignedBigInteger('cloned_from_id')->nullable();
            $table->json('metadata')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->foreign('instructor_id')->references('id')->on('users')->restrictOnDelete();
            $table->foreign('cloned_from_id')->references('id')->on('cohorts')->nullOnDelete();

            $table->index('instructor_id');
            $table->index('slug');
            $table->index('status');
            $table->index('type');
            $table->index('invite_code');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('cohorts');
    }
};
