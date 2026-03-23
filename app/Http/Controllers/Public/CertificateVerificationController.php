<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\Certificate;
use Inertia\Inertia;

class CertificateVerificationController extends Controller
{
    public function show(string $uuid)
    {
        $certificate = Certificate::where('uuid', $uuid)
            ->with(['student:id,name', 'cohort:id,title,type', 'template'])
            ->first();

        return Inertia::render('Public/CertificateVerify', [
            'certificate' => $certificate,
            'verified' => $certificate !== null,
        ]);
    }
}
