<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->date('date_of_birth')->nullable()->after('phone');
            $table->string('college_name', 255)->nullable()->after('date_of_birth');
            $table->string('course_name', 255)->nullable()->after('college_name');
            $table->string('semester', 50)->nullable()->after('course_name');
            $table->string('github_username', 255)->nullable()->after('semester');
            $table->text('github_token')->nullable()->after('github_username');
        });

        Schema::table('instructor_profiles', function (Blueprint $table) {
            $table->boolean('is_verified')->default(false)->after('revenue_share_percent');
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['date_of_birth', 'college_name', 'course_name', 'semester', 'github_username', 'github_token']);
        });

        Schema::table('instructor_profiles', function (Blueprint $table) {
            $table->dropColumn('is_verified');
        });
    }
};
