<?php

namespace Database\Factories;

use App\Enums\ProjectPriority;
use App\Enums\ProjectStatus;
use App\Models\Project;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Project>
 */
class ProjectFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $startDate = fake()->dateTimeBetween('-3 months', '+1 month');
        $dueDate = (clone $startDate)->modify(sprintf('+%d days', fake()->numberBetween(7, 120)));

        return [
            'client_name' => fake()->company(),
            'project_name' => fake()->sentence(3),
            'description' => fake()->paragraph(),
            'status' => fake()->randomElement(ProjectStatus::cases())->value,
            'priority' => fake()->randomElement(ProjectPriority::cases())->value,
            'start_date' => $startDate->format('Y-m-d'),
            'due_date' => $dueDate->format('Y-m-d'),
        ];
    }
}
