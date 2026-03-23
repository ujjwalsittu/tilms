<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class IdVerificationQueueController extends Controller
{
    public function index(Request $request)
    {
        $users = User::where('id_verification_status', 'pending')
            ->latest()
            ->paginate(20)
            ->withQueryString();

        return Inertia::render('Admin/IdVerification/Queue', [
            'users' => $users,
        ]);
    }

    public function update(Request $request, User $user)
    {
        $validated = $request->validate([
            'id_verification_status' => ['required', 'string', 'in:approved,rejected'],
            'rejection_reason' => ['nullable', 'string', 'required_if:id_verification_status,rejected'],
        ]);

        $updateData = [
            'id_verification_status' => $validated['id_verification_status'],
        ];

        if ($validated['id_verification_status'] === 'approved') {
            $updateData['id_verified_at'] = now();
        }

        if (isset($validated['rejection_reason'])) {
            $updateData['id_rejection_reason'] = $validated['rejection_reason'];
        }

        $user->update($updateData);

        return back()->with('success', 'Verification status updated successfully.');
    }
}
