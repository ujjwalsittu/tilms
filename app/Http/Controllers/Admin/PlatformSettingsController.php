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
        $settings = PlatformSetting::all()
            ->groupBy('group')
            ->map(function ($group) {
                return $group->pluck('value', 'key');
            });

        return Inertia::render('Admin/Settings/Platform', [
            'settings' => $settings,
        ]);
    }

    public function update(Request $request)
    {
        $validated = $request->validate([
            'settings' => ['required', 'array'],
            'settings.*' => ['nullable', 'string'],
            'logo' => ['nullable', 'image', 'max:2048'],
        ]);

        if ($request->hasFile('logo')) {
            $path = $request->file('logo')->store('public/platform');
            $logoPath = Storage::url($path);

            PlatformSetting::updateOrCreate(
                ['key' => 'logo_path'],
                ['value' => $logoPath, 'group' => 'branding']
            );
        }

        foreach ($validated['settings'] as $key => $value) {
            PlatformSetting::where('key', $key)->update(['value' => $value]);
        }

        return back()->with('success', 'Platform settings updated successfully.');
    }
}
