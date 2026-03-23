<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Models\Certificate;
use Inertia\Inertia;

class CertificateController extends Controller
{
    public function index()
    {
        $certificates = Certificate::where('student_id', auth()->id())
            ->with('cohort:id,title,type')
            ->latest('issued_at')
            ->get();

        return Inertia::render('Student/Certificates/Index', [
            'certificates' => $certificates,
        ]);
    }

    public function download(Certificate $certificate)
    {
        abort_if($certificate->student_id !== auth()->id(), 403);

        if ($certificate->pdf_path && file_exists(storage_path('app/' . $certificate->pdf_path))) {
            return response()->download(storage_path('app/' . $certificate->pdf_path));
        }

        // Fallback: show certificate view
        return Inertia::render('Student/Certificates/View', [
            'certificate' => $certificate->load('cohort', 'template'),
        ]);
    }
}
