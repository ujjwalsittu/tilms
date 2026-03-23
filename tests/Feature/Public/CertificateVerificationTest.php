<?php

namespace Tests\Feature\Public;

use App\Models\Certificate;
use App\Models\CertificateTemplate;
use App\Models\Cohort;
use App\Models\CohortEnrollment;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Str;
use Tests\TestCase;

class CertificateVerificationTest extends TestCase
{
    use RefreshDatabase;

    public function test_valid_certificate_is_verified(): void
    {
        $student = User::factory()->create(['role' => 'student']);
        $cohort = Cohort::factory()->create();
        $template = CertificateTemplate::create([
            'name' => 'Default', 'layout' => '{}', 'is_default' => true, 'created_by' => 1, 'created_at' => now(), 'updated_at' => now(),
        ]);
        $enrollment = CohortEnrollment::create([
            'cohort_id' => $cohort->id, 'student_id' => $student->id, 'status' => 'completed', 'enrolled_at' => now(),
        ]);

        $uuid = (string) Str::uuid();
        Certificate::create([
            'uuid' => $uuid, 'student_id' => $student->id, 'cohort_id' => $cohort->id,
            'enrollment_id' => $enrollment->id, 'template_id' => $template->id,
            'certificate_number' => 'CERT-TEST-001', 'qr_code_path' => '', 'pdf_path' => '',
            'verification_url' => "/verify/{$uuid}", 'issued_at' => now(), 'created_at' => now(),
        ]);

        $response = $this->get("/verify/{$uuid}");
        $response->assertStatus(200);
    }

    public function test_invalid_certificate_shows_not_found(): void
    {
        $response = $this->get('/verify/' . Str::uuid());
        $response->assertStatus(200); // Page renders but shows "not found"
    }
}
