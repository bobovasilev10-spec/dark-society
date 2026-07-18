<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('cart_items', function (Blueprint $table) {
            $table->json('product_options')->nullable();
        });
        Schema::table('order_items', function (Blueprint $table) {
            $table->json('product_options')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('cart_items', function (Blueprint $table) {
            $table->removeColumn('product_options');
        });
        Schema::table('order_items', function (Blueprint $table) {
            $table->removeColumn('product_options');
        });
    }
};
