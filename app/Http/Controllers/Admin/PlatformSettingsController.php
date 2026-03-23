<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\PlatformSetting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class PlatformSettingsController extends Controller
{
    public function edit()
    {
        $settings = PlatformSetting::all()->pluck('value', 'key')->toArray();

        return Inertia::render('Admin/Settings/Platform', [
            'settings' => $settings,
        ]);
    }

    public function update(Request $request)
    {
        $request->validate([
            'logo' => ['nullable', 'image', 'max:2048'],
        ]);

        if ($request->hasFile('logo')) {
            $path = $request->file('logo')->store('public/platform');
            $logoPath = Storage::url($path);

            PlatformSetting::updateOrCreate(
                ['key' => 'logo_path'],
                ['value' => $logoPath, 'type' => 'file', 'group' => 'branding']
            );
        }

        $allowedKeys = [
            'platform_name', 'theme_color',
            'signatory_name', 'signatory_position',
            'claude_default_model', 'razorpay_environment',
            'mail_from_address', 'mail_from_name',
        ];

        foreach ($allowedKeys as $key) {
            if ($request->has($key)) {
                PlatformSetting::updateOrCreate(
                    ['key' => $key],
                    ['value' => $request->input($key)]
                );
            }
        }

        return back()->with('success', 'Platform settings updated.');
    }
}
