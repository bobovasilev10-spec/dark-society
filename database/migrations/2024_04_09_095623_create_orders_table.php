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
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->timestamps();
            $table->foreignId('user_id')->nullable();
            $table->longText('additional_info')->nullable();
            $table->decimal('total_price', 10, 2)->default(0);

            $table->string('session_id')->nullable();
            $table->string('name');
            $table->string('email');
            $table->string('phone');
            $table->boolean('invoice')->default(false);
            $table->json('invoice_data')->nullable();
            $table->string('invoice_path')->nullable();
            $table->string('payment_method')->default('at_delivery');
            $table->json('payment_data')->nullable();
            $table->string('payment_status')->default('pending');
            $table->json('delivery_data')->nullable();
            $table->string('delivery_status')->default('pending');
            $table->decimal('delivery_fee', 10, 2)->default(0);
            $table->string('status')->default('pending')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};
