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
        Schema::create('certificate_templates', function (Blueprint $table) {
            $table->id();
            $table->string('name', 255);
            $table->json('layout');
            $table->string('background_image_path', 512)->nullable();
            $table->string('signature_image_path', 512)->nullable();
            $table->boolean('is_default')->default(false);
            $table->unsignedBigInteger('created_by');
            $table->timestamps();

            $table->foreign('created_by')->references('id')->on('users')->restrictOnDelete();
        });

        // Add FK on cohorts.certificate_template_id -> certificate_templates.id
        Schema::table('cohorts', function (Blueprint $table) {
            $table->foreign('certificate_template_id')->references('id')->on('certificate_templates')->nullOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('cohorts', function (Blueprint $table) {
            $table->dropForeign(['certificate_template_id']);
        });

        Schema::dropIfExists('certificate_templates');
    }
};
