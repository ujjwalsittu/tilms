<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Facades\DB;

class PlatformSettingsSeeder extends Seeder
{
    public function run(): void
    {
        // Platform settings
        $settings = [
            ['key' => 'platform_name', 'value' => 'TILMS', 'type' => 'string', 'group' => 'branding', 'is_encrypted' => false],
            ['key' => 'logo_path', 'value' => null, 'type' => 'file', 'group' => 'branding', 'is_encrypted' => false],
            ['key' => 'theme_color', 'value' => '#4F46E5', 'type' => 'string', 'group' => 'branding', 'is_encrypted' => false],
            ['key' => 'signatory_name', 'value' => 'Platform Admin', 'type' => 'string', 'group' => 'certificates', 'is_encrypted' => false],
            ['key' => 'signatory_position', 'value' => 'Director', 'type' => 'string', 'group' => 'certificates', 'is_encrypted' => false],
            ['key' => 'claude_default_model', 'value' => 'claude-sonnet-4-20250514', 'type' => 'string', 'group' => 'ai', 'is_encrypted' => false],
            ['key' => 'razorpay_environment', 'value' => 'test', 'type' => 'string', 'group' => 'payments', 'is_encrypted' => false],
            ['key' => 'mail_from_address', 'value' => 'noreply@tilms.com', 'type' => 'string', 'group' => 'email', 'is_encrypted' => false],
            ['key' => 'mail_from_name', 'value' => 'TILMS', 'type' => 'string', 'group' => 'email', 'is_encrypted' => false],
        ];

        foreach ($settings as $setting) {
            DB::table('platform_settings')->updateOrInsert(
                ['key' => $setting['key']],
                array_merge($setting, ['updated_at' => now()])
            );
        }

        // Seed API key placeholders (empty - to be configured via Admin Panel)
        $apiKeys = [
            ['service' => 'claude', 'key_name' => 'api_key', 'environment' => 'live'],
            ['service' => 'resend', 'key_name' => 'api_key', 'environment' => 'live'],
            ['service' => 'razorpay', 'key_name' => 'razorpay_test_key_id', 'environment' => 'test'],
            ['service' => 'razorpay', 'key_name' => 'razorpay_test_key_secret', 'environment' => 'test'],
            ['service' => 'razorpay', 'key_name' => 'razorpay_live_key_id', 'environment' => 'live'],
            ['service' => 'razorpay', 'key_name' => 'razorpay_live_key_secret', 'environment' => 'live'],
            ['service' => 'github', 'key_name' => 'personal_access_token', 'environment' => 'live'],
        ];

        foreach ($apiKeys as $key) {
            DB::table('api_keys')->updateOrInsert(
                ['service' => $key['service'], 'key_name' => $key['key_name']],
                [
                    'encrypted_value' => Crypt::encryptString(''),
                    'is_active' => true,
                    'environment' => $key['environment'],
                    'created_at' => now(),
                    'updated_at' => now(),
                ]
            );
        }
    }
}
