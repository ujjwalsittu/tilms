<?php

namespace Tests\Feature\Student;

use App\Models\Cohort;
use App\Models\CohortEnrollment;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class EnrollmentTest extends TestCase
{
    use RefreshDatabase;

    private User $student;

    protected function setUp(): void
    {
        parent::setUp();
        $this->student = User::factory()->create(['role' => 'student']);
    }

    public function test_student_can_view_dashboard(): void
    {
        $response = $this->actingAs($this->student)->get('/student/dashboard');
        $response->assertStatus(200);
    }

    public function test_student_can_list_cohorts(): void
    {
        $response = $this->actingAs($this->student)->get('/student/cohorts');
        $response->assertStatus(200);
    }

    public function test_student_can_view_enrolled_cohort(): void
    {
        $cohort = Cohort::factory()->create(['status' => 'in_progress']);
        CohortEnrollment::create([
            'cohort_id' => $cohort->id,
            'student_id' => $this->student->id,
            'status' => 'enrolled',
            'enrolled_at' => now(),
        ]);

        $response = $this->actingAs($this->student)->get("/student/cohorts/{$cohort->id}");
        $response->assertStatus(200);
    }
}
