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
        Schema::create('info_pages', function (Blueprint $table) {
            $table->id();
            $table->timestamps();

            $table->text('title')->nullable();
            $table->string('slug')->unique();
            $table->text('content')->nullable();
            $table->boolean('is_active')->default(true);
            $table->boolean('is_top')->default(false);
            $table->boolean('is_bottom')->default(false);
            $table->boolean('is_required_for_order')->default(false);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('info_pages');
    }
};
