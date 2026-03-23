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
        Schema::create('office_hours_slots', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('instructor_id');
            $table->unsignedBigInteger('cohort_id')->nullable();
            $table->string('title', 255)->nullable();
            $table->timestamp('starts_at');
            $table->timestamp('ends_at');
            $table->unsignedInteger('max_attendees')->default(1);
            $table->string('meeting_url', 512)->nullable();
            $table->boolean('is_recurring')->default(false);
            $table->string('recurrence_rule', 255)->nullable();
            $table->timestamps();

            $table->foreign('instructor_id')->references('id')->on('users')->cascadeOnDelete();
            $table->foreign('cohort_id')->references('id')->on('cohorts')->nullOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('office_hours_slots');
    }
};
