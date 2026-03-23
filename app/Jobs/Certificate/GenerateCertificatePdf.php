<?php
namespace App\Jobs\Certificate;

use App\Models\Certificate;
use App\Models\PlatformSetting;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class GenerateCertificatePdf implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public function __construct(public Certificate $certificate)
    {
        $this->onQueue('certificates');
    }

    public function handle(): void
    {
        $cert = $this->certificate->load(['student', 'cohort.instructor', 'template']);
        $template = $cert->template;
        $layout = is_string($template?->layout) ? json_decode($template->layout, true) : ($template?->layout ?? []);

        $settings = PlatformSetting::pluck('value', 'key')->toArray();

        $data = [
            'platformName'      => $settings['platform_name'] ?? 'TILMS',
            'titleText'         => $layout['title_text'] ?? 'Certificate of Completion',
            'titleFontSize'     => $layout['title_font_size'] ?? 32,
            'bgColor'           => $layout['bg_color'] ?? '#ffffff',
            'borderColor'       => $layout['border_color'] ?? '#1a365d',
            'accentColor'       => $layout['accent_color'] ?? '#4F46E5',
            'studentName'       => $cert->student->name,
            'cohortName'        => $cert->cohort->title,
            'domain'            => $cert->cohort->type->value === 'internship' ? 'Technical Internship' : 'Learning',
            'completionPercent' => $cert->metadata['completion_percent'] ?? '70',
            'completionDate'    => $cert->issued_at->format('F j, Y'),
            'signatoryName'     => $settings['signatory_name'] ?? 'Platform Admin',
            'signatoryPosition' => $settings['signatory_position'] ?? 'Director',
            'instructorName'    => $cert->cohort->instructor->name ?? 'Instructor',
            'certificateNumber' => $cert->certificate_number,
            'verificationUrl'   => $cert->verification_url,
        ];

        $pdf = Pdf::loadView('certificates.template', $data)
            ->setPaper('a4', 'landscape');

        $path = "certificates/{$cert->uuid}.pdf";
        \Storage::put($path, $pdf->output());

        $cert->update(['pdf_path' => $path]);
    }
}
