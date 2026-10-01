<?php

namespace Database\Seeders;

use App\Models\Project;
use Illuminate\Database\Seeder;

class ProjectSeeder extends Seeder
{
    /**
     * Seed the supplied assessment fixture with deterministic IDs.
     */
    public function run(): void
    {
        /** @var list<array{id: int, clientName: string, projectName: string, description: string, status: string, priority: string, startDate: string, dueDate: string}> $projects */
        $projects = json_decode(
            file_get_contents(database_path('seeders/data/projects.json')),
            true,
            512,
            JSON_THROW_ON_ERROR,
        );

        foreach ($projects as $project) {
            Project::query()->updateOrCreate(
                ['id' => $project['id']],
                [
                    'client_name' => $project['clientName'],
                    'project_name' => $project['projectName'],
                    'description' => $project['description'],
                    'status' => $project['status'],
                    'priority' => $project['priority'],
                    'start_date' => $project['startDate'],
                    'due_date' => $project['dueDate'],
                ],
            );
        }
    }
}
