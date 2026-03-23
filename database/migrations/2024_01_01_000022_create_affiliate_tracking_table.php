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
        Schema::create('affiliate_tracking', function (Blueprint $table) {
            $table->id();
            $table->string('affiliate_code', 32);
            $table->string('source_type', 255);
            $table->unsignedBigInteger('source_id');
            $table->unsignedBigInteger('payment_id')->nullable();
            $table->unsignedInteger('click_count')->default(0);
            $table->boolean('conversion')->default(false);
            $table->decimal('commission_amount', 10, 2)->nullable();
            $table->boolean('commission_paid')->default(false);
            $table->timestamps();

            $table->foreign('payment_id')->references('id')->on('payments')->nullOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('affiliate_tracking');
    }
};
