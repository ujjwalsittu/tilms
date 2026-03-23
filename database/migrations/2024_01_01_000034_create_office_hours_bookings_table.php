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
        Schema::create('office_hours_bookings', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('slot_id');
            $table->unsignedBigInteger('student_id');
            $table->enum('status', ['booked', 'cancelled', 'completed', 'no_show'])->default('booked');
            $table->text('notes')->nullable();
            $table->timestamp('created_at')->nullable();

            $table->foreign('slot_id')->references('id')->on('office_hours_slots')->cascadeOnDelete();
            $table->foreign('student_id')->references('id')->on('users')->cascadeOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('office_hours_bookings');
    }
};
