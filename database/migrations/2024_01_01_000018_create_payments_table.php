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
        Schema::create('payments', function (Blueprint $table) {
            $table->id();
            $table->char('uuid', 36)->unique();
            $table->unsignedBigInteger('user_id');
            $table->unsignedBigInteger('cohort_id');
            $table->string('razorpay_order_id', 255)->unique();
            $table->string('razorpay_payment_id', 255)->unique()->nullable();
            $table->string('razorpay_signature', 255)->nullable();
            $table->decimal('amount', 10, 2);
            $table->string('currency', 3)->default('INR');
            $table->enum('status', ['created', 'authorized', 'captured', 'failed', 'refunded'])->default('created');
            $table->unsignedBigInteger('discount_coupon_id')->nullable();
            $table->decimal('discount_amount', 10, 2)->default(0);
            $table->string('referral_code_used', 32)->nullable();
            $table->string('affiliate_code_used', 32)->nullable();
            $table->enum('environment', ['live', 'test']);
            $table->json('metadata')->nullable();
            $table->timestamp('paid_at')->nullable();
            $table->timestamps();

            $table->foreign('user_id')->references('id')->on('users')->cascadeOnDelete();
            $table->foreign('cohort_id')->references('id')->on('cohorts')->cascadeOnDelete();

            $table->index('user_id');
            $table->index('cohort_id');
            $table->index('status');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('payments');
    }
};
