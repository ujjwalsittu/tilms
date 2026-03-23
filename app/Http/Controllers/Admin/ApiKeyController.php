<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ApiKey;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Crypt;
use Inertia\Inertia;

class ApiKeyController extends Controller
{
    public function index()
    {
        $apiKeys = ApiKey::all()->map(function ($key) {
            try {
                $decrypted = Crypt::decryptString($key->encrypted_value);
                $masked = empty($decrypted)
                    ? '(not set)'
                    : str_repeat('*', max(0, strlen($decrypted) - 4)) . substr($decrypted, -4);
            } catch (\Throwable) {
                $masked = '(invalid)';
            }

            return [
                'id' => $key->id,
                'service' => $key->service,
                'key_name' => $key->key_name,
                'masked_value' => $masked,
                'is_active' => $key->is_active,
                'environment' => $key->environment,
                'last_rotated_at' => $key->last_rotated_at,
            ];
        });

        return Inertia::render('Admin/Settings/ApiKeys', [
            'apiKeys' => $apiKeys,
        ]);
    }

    public function update(Request $request, ApiKey $apiKey)
    {
        $validated = $request->validate([
            'value' => ['nullable', 'string'],
            'is_active' => ['nullable', 'boolean'],
        ]);

        $updateData = [];

        if (! empty($validated['value'])) {
            $updateData['encrypted_value'] = Crypt::encryptString($validated['value']);
            $updateData['last_rotated_at'] = now();
        }

        if (isset($validated['is_active'])) {
            $updateData['is_active'] = $validated['is_active'];
        }

        if (! empty($updateData)) {
            $apiKey->update($updateData);
        }

        return back()->with('success', "API key '{$apiKey->key_name}' updated.");
    }
}
