<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class AdminSeeder extends Seeder
{
    public function run(): void
    {
        User::firstOrCreate(
            ['email' => 'admin@tilms.com'],
            [
                'name' => 'Platform Admin',
                'password' => bcrypt('password'),
                'role' => 'admin',
                'uuid' => Str::uuid(),
                'is_active' => true,
                'email_verified_at' => now(),
                'id_verification_status' => 'approved',
            ]
        );
    }
}
