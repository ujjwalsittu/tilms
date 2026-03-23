<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        $user = $request->user();

        return [
            ...parent::share($request),
            'auth' => [
                'user' => $user ? [
                    'id'                     => $user->id,
                    'name'                   => $user->name,
                    'email'                  => $user->email,
                    'role'                   => $user->role?->value,
                    'avatar_path'            => $user->avatar_path,
                    'is_active'              => $user->is_active,
                    'phone'                  => $user->phone,
                    'date_of_birth'          => $user->date_of_birth?->format('Y-m-d'),
                    'college_name'           => $user->college_name,
                    'course_name'            => $user->course_name,
                    'semester'               => $user->semester,
                    'github_username'        => $user->github_username,
                    'id_verification_status' => $user->id_verification_status instanceof \BackedEnum
                        ? $user->id_verification_status->value
                        : $user->id_verification_status,
                ] : null,
            ],
            'flash' => [
                'success' => fn () => $request->session()->get('success'),
                'error' => fn () => $request->session()->get('error'),
                'warning' => fn () => $request->session()->get('warning'),
            ],
        ];
    }
}
