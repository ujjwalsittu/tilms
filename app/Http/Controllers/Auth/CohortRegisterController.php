<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\Cohort;
use App\Models\CohortEnrollment;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Inertia\Inertia;

class CohortRegisterController extends Controller
{
    public function create(Cohort $cohort)
    {
        return Inertia::render('Auth/CohortRegister', [
            'cohort' => $cohort->only('id', 'title', 'slug', 'description', 'type', 'price_amount', 'price_currency', 'has_free_audit'),
        ]);
    }

    public function store(Request $request, Cohort $cohort)
    {
        $validated = $request->validate([
            'name'             => 'required|string|max:255',
            'email'            => 'required|string|email|max:255|unique:users',
            'password'         => 'required|string|min:8|confirmed',
            'phone'            => 'required|string|max:20',
            'date_of_birth'    => 'required|date|before:today',
            'college_name'     => 'required|string|max:255',
            'course_name'      => 'required|string|max:255',
            'semester'         => 'required|string|max:50',
            'id_document'      => 'nullable|file|max:5120|mimes:pdf,jpg,jpeg,png',
            'govt_id_document' => 'nullable|file|max:5120|mimes:pdf,jpg,jpeg,png',
        ]);

        $idDocPath = null;
        if ($request->hasFile('id_document')) {
            $idDocPath = $request->file('id_document')->store('id-documents', 'local');
        }

        $user = User::create([
            'name'                   => $validated['name'],
            'email'                  => $validated['email'],
            'password'               => Hash::make($validated['password']),
            'role'                   => 'student',
            'uuid'                   => (string) Str::uuid(),
            'phone'                  => $validated['phone'],
            'date_of_birth'          => $validated['date_of_birth'],
            'college_name'           => $validated['college_name'],
            'course_name'            => $validated['course_name'],
            'semester'               => $validated['semester'],
            'is_active'              => true,
            'id_verification_status' => $idDocPath ? 'pending' : 'not_submitted',
            'id_document_path'       => $idDocPath,
            'referral_code'          => strtoupper(Str::random(8)),
        ]);

        event(new Registered($user));
        auth()->login($user);

        // If free cohort or free audit, enroll directly
        if ($cohort->price_amount <= 0 || $request->boolean('audit')) {
            CohortEnrollment::create([
                'cohort_id'   => $cohort->id,
                'student_id'  => $user->id,
                'status'      => $request->boolean('audit') ? 'audit' : 'enrolled',
                'enrolled_at' => now(),
            ]);

            return redirect()->route('student.cohorts.show', $cohort->id);
        }

        // Redirect to payment checkout
        return redirect()->route('student.checkout', $cohort->id);
    }
}
