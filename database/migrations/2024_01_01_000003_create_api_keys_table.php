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
        Schema::create('api_keys', function (Blueprint $table) {
            $table->id();
            $table->enum('service', ['resend', 'claude', 'razorpay', 'github']);
            $table->string('key_name', 255);
            $table->text('encrypted_value');
            $table->boolean('is_active')->default(true);
            $table->enum('environment', ['live', 'test'])->default('test');
            $table->timestamp('last_rotated_at')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('api_keys');
    }
};
