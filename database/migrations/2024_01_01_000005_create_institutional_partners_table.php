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
        Schema::create('institutional_partners', function (Blueprint $table) {
            $table->id();
            $table->char('uuid', 36)->unique();
            $table->string('name', 255);
            $table->string('contact_name', 255);
            $table->string('contact_email', 255);
            $table->string('phone', 20)->nullable();
            $table->string('logo_path', 512)->nullable();
            $table->string('affiliate_code', 32)->unique();
            $table->decimal('discount_percent', 5, 2)->default(0);
            $table->decimal('revenue_share_percent', 5, 2)->default(0);
            $table->boolean('is_active')->default(true);
            $table->json('metadata')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('institutional_partners');
    }
};
