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
        Schema::create('instructor_profiles', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id')->unique();
            $table->string('title', 255)->nullable();
            $table->string('specialization', 255)->nullable();
            $table->string('website_url', 512)->nullable();
            $table->string('linkedin_url', 512)->nullable();
            $table->string('github_username', 255)->nullable();
            $table->json('payout_details')->nullable();
            $table->decimal('revenue_share_percent', 5, 2)->default(70.00);
            $table->timestamps();

            $table->foreign('user_id')->references('id')->on('users')->cascadeOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('instructor_profiles');
    }
};
