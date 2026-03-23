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
        Schema::create('certificates', function (Blueprint $table) {
            $table->id();
            $table->char('uuid', 36)->unique();
            $table->unsignedBigInteger('student_id');
            $table->unsignedBigInteger('cohort_id');
            $table->unsignedBigInteger('enrollment_id');
            $table->unsignedBigInteger('template_id');
            $table->string('certificate_number', 50)->unique();
            $table->string('qr_code_path', 512);
            $table->string('pdf_path', 512);
            $table->string('verification_url', 512);
            $table->timestamp('issued_at');
            $table->timestamp('emailed_at')->nullable();
            $table->text('digital_signature')->nullable();
            $table->json('metadata')->nullable();
            $table->timestamp('created_at')->nullable();

            $table->foreign('student_id')->references('id')->on('users')->cascadeOnDelete();
            $table->foreign('cohort_id')->references('id')->on('cohorts')->cascadeOnDelete();
            $table->foreign('enrollment_id')->references('id')->on('cohort_enrollments')->cascadeOnDelete();
            $table->foreign('template_id')->references('id')->on('certificate_templates')->restrictOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('certificates');
    }
};
