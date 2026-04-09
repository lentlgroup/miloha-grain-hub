<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('contact_inquiries', function (Blueprint $table): void {
            if (!Schema::hasColumn('contact_inquiries', 'follow_up_note')) {
                $table->text('follow_up_note')->nullable()->after('status');
            }
        });
    }

    public function down(): void
    {
        Schema::table('contact_inquiries', function (Blueprint $table): void {
            $table->dropColumn('follow_up_note');
        });
    }
};
