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
        Schema::create('partner_enrollments', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('partner_id');
            $table->unsignedBigInteger('cohort_id');
            $table->unsignedBigInteger('student_id');
            $table->enum('enrolled_via', ['csv_bulk', 'affiliate_link', 'manual']);
            $table->timestamp('created_at')->nullable();

            $table->foreign('partner_id')->references('id')->on('institutional_partners')->cascadeOnDelete();
            $table->foreign('cohort_id')->references('id')->on('cohorts')->cascadeOnDelete();
            $table->foreign('student_id')->references('id')->on('users')->cascadeOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('partner_enrollments');
    }
};
