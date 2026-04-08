<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('contact_inquiries', function (Blueprint $table) {
            $table->id();
            $table->string('buyer_type');
            $table->string('product');
            $table->string('packaging');
            $table->string('quantity')->nullable();
            $table->string('location');
            $table->string('name');
            $table->string('email')->index();
            $table->string('phone');
            $table->text('message')->nullable();
            $table->string('status', 30)->default('new')->index();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('contact_inquiries');
    }
};
