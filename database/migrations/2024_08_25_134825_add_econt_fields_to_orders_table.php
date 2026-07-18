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
        Schema::table('orders', function (Blueprint $table) {
            $table->string('delivery_type')->nullable();
            $table->integer('econt_city_id')->nullable();
            $table->integer('econt_office_id')->nullable();
            $table->integer('econt_street_id')->nullable();
            $table->string('econt_street_number')->nullable();
            $table->string('econt_entrance')->nullable();
            $table->string('econt_floor')->nullable();
            $table->string('econt_apartment_number')->nullable();
            $table->string('econt_label')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->removeColumn('delivery_type');
            $table->removeColumn('econt_city_id');
            $table->removeColumn('econt_office_id');
            $table->removeColumn('econt_street_id');
            $table->removeColumn('econt_street_number');
            $table->removeColumn('econt_entrance');
            $table->removeColumn('econt_floor');
            $table->removeColumn('econt_apartment_number');
            $table->removeColumn('econt_label');
        });
    }
};
