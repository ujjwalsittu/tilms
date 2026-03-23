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
            $decrypted = Crypt::decryptString($key->encrypted_value);
            $masked = str_repeat('*', max(0, strlen($decrypted) - 4)) . substr($decrypted, -4);

            return array_merge($key->toArray(), [
                'masked_value' => $masked,
            ]);
        });

        return Inertia::render('Admin/Settings/ApiKeys', [
            'apiKeys' => $apiKeys,
        ]);
    }

    public function update(Request $request, ApiKey $apiKey)
    {
        $validated = $request->validate([
            'key_name' => ['required', 'string', 'max:255'],
            'value' => ['nullable', 'string'],
            'is_active' => ['required', 'boolean'],
            'environment' => ['required', 'string', 'in:production,staging,development'],
        ]);

        $updateData = [
            'key_name' => $validated['key_name'],
            'is_active' => $validated['is_active'],
            'environment' => $validated['environment'],
        ];

        if (! empty($validated['value'])) {
            $updateData['encrypted_value'] = Crypt::encryptString($validated['value']);
        }

        $apiKey->update($updateData);

        return back()->with('success', 'API key updated successfully.');
    }
}
