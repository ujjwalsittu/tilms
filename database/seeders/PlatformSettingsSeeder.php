<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class PlatformSettingsSeeder extends Seeder
{
    public function run(): void
    {
        $settings = [
            ['key' => 'platform_name', 'value' => 'TILMS', 'type' => 'string', 'group' => 'branding', 'is_encrypted' => false],
            ['key' => 'logo_path', 'value' => null, 'type' => 'file', 'group' => 'branding', 'is_encrypted' => false],
            ['key' => 'theme_color', 'value' => '#4F46E5', 'type' => 'string', 'group' => 'branding', 'is_encrypted' => false],
            ['key' => 'signatory_name', 'value' => 'Platform Admin', 'type' => 'string', 'group' => 'certificates', 'is_encrypted' => false],
            ['key' => 'signatory_position', 'value' => 'Director', 'type' => 'string', 'group' => 'certificates', 'is_encrypted' => false],
            ['key' => 'claude_default_model', 'value' => 'claude-sonnet-4-20250514', 'type' => 'string', 'group' => 'ai', 'is_encrypted' => false],
            ['key' => 'razorpay_environment', 'value' => 'test', 'type' => 'string', 'group' => 'payments', 'is_encrypted' => false],
        ];

        foreach ($settings as $setting) {
            DB::table('platform_settings')->updateOrInsert(
                ['key' => $setting['key']],
                array_merge($setting, ['updated_at' => now()])
            );
        }
    }
}
