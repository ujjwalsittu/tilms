<?php

namespace Tests\Feature\Instructor;

use App\Models\Cohort;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CohortTest extends TestCase
{
    use RefreshDatabase;

    private User $instructor;

    protected function setUp(): void
    {
        parent::setUp();
        $this->instructor = User::factory()->create(['role' => 'instructor']);
    }

    public function test_instructor_can_list_cohorts(): void
    {
        $response = $this->actingAs($this->instructor)->get('/instructor/cohorts');
        $response->assertStatus(200);
    }

    public function test_instructor_can_create_cohort(): void
    {
        $response = $this->actingAs($this->instructor)->post('/instructor/cohorts', [
            'title' => 'Test Cohort',
            'description' => 'A test cohort',
            'type' => 'internship',
            'price_amount' => 999,
            'task_ordering' => 'sequential',
            'completion_threshold' => 70,
        ]);

        $response->assertRedirect();
        $this->assertDatabaseHas('cohorts', ['title' => 'Test Cohort', 'instructor_id' => $this->instructor->id]);
    }

    public function test_instructor_cannot_access_other_instructors_cohort(): void
    {
        $otherInstructor = User::factory()->create(['role' => 'instructor']);
        $cohort = Cohort::factory()->create(['instructor_id' => $otherInstructor->id]);

        $response = $this->actingAs($this->instructor)->get("/instructor/cohorts/{$cohort->id}");
        $response->assertStatus(403);
    }
}
