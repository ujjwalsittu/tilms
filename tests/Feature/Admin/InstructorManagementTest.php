<?php

namespace Tests\Feature\Admin;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class InstructorManagementTest extends TestCase
{
    use RefreshDatabase;

    private User $admin;

    protected function setUp(): void
    {
        parent::setUp();
        $this->admin = User::factory()->create(['role' => 'admin']);
    }

    public function test_admin_can_list_instructors(): void
    {
        User::factory()->count(3)->create(['role' => 'instructor']);

        $response = $this->actingAs($this->admin)->get('/admin/instructors');
        $response->assertStatus(200);
    }

    public function test_admin_can_create_instructor(): void
    {
        $response = $this->actingAs($this->admin)->post('/admin/instructors', [
            'name' => 'Test Instructor',
            'email' => 'instructor@test.com',
            'password' => 'password123',
            'password_confirmation' => 'password123',
        ]);

        $response->assertRedirect();
        $this->assertDatabaseHas('users', ['email' => 'instructor@test.com', 'role' => 'instructor']);
    }

    public function test_admin_can_toggle_instructor_active(): void
    {
        $instructor = User::factory()->create(['role' => 'instructor', 'is_active' => true]);

        $response = $this->actingAs($this->admin)->put("/admin/instructors/{$instructor->id}/toggle-active");
        $response->assertRedirect();

        $instructor->refresh();
        $this->assertFalse($instructor->is_active);
    }
}
