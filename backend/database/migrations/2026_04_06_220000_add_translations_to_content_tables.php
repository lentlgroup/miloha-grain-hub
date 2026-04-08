<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('products', function (Blueprint $table) {
            $table->json('translations')->nullable()->after('nutrition');
        });

        Schema::table('faqs', function (Blueprint $table) {
            $table->json('translations')->nullable()->after('answer');
        });

        Schema::table('testimonials', function (Blueprint $table) {
            $table->json('translations')->nullable()->after('role');
        });

        Schema::table('contact_inquiries', function (Blueprint $table) {
            $table->string('language', 5)->default('en')->after('phone');
        });
    }

    public function down(): void
    {
        Schema::table('contact_inquiries', function (Blueprint $table) {
            $table->dropColumn('language');
        });

        Schema::table('testimonials', function (Blueprint $table) {
            $table->dropColumn('translations');
        });

        Schema::table('faqs', function (Blueprint $table) {
            $table->dropColumn('translations');
        });

        Schema::table('products', function (Blueprint $table) {
            $table->dropColumn('translations');
        });
    }
};
