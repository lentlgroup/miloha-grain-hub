<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('contact_inquiries', function (Blueprint $table): void {
            // Fix: language was in the model/controller but missing from the DB schema
            if (! Schema::hasColumn('contact_inquiries', 'language')) {
                $table->string('language', 10)->nullable()->after('phone');
            }
            // New fields for LeNTL Group inquiry form
            if (! Schema::hasColumn('contact_inquiries', 'company')) {
                $table->string('company', 150)->nullable()->after('language');
            }
            if (! Schema::hasColumn('contact_inquiries', 'interest_area')) {
                $table->string('interest_area', 100)->nullable()->after('company');
            }
            // Distinguishes MILOHA grain form from LeNTL corporate form
            if (! Schema::hasColumn('contact_inquiries', 'form_type')) {
                $table->string('form_type', 30)->default('miloha')->after('interest_area');
            }
        });
    }

    public function down(): void
    {
        Schema::table('contact_inquiries', function (Blueprint $table): void {
            $table->dropColumn(array_filter(
                ['language', 'company', 'interest_area', 'form_type'],
                fn (string $col) => Schema::hasColumn('contact_inquiries', $col),
            ));
        });
    }
};
