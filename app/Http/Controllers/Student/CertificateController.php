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

        if ($certificate->pdf_path && \Storage::exists($certificate->pdf_path)) {
            return \Storage::download($certificate->pdf_path, "certificate-{$certificate->certificate_number}.pdf");
        }

        // Fallback: show certificate view
        return Inertia::render('Student/Certificates/View', [
            'certificate' => $certificate->load('cohort', 'template'),
        ]);
    }
}
