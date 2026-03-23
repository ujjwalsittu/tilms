<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class CohortFactory extends Factory
{
    public function definition(): array
    {
        $title = fake()->sentence(3);
        return [
            'uuid' => fake()->uuid(),
            'instructor_id' => User::factory()->state(['role' => 'instructor']),
            'title' => $title,
            'slug' => Str::slug($title) . '-' . Str::random(4),
            'description' => fake()->paragraph(),
            'type' => fake()->randomElement(['internship', 'learning']),
            'status' => 'in_progress',
            'price_amount' => fake()->randomFloat(2, 0, 9999),
            'price_currency' => 'INR',
            'task_ordering' => 'sequential',
            'completion_threshold' => 70,
        ];
    }
}
