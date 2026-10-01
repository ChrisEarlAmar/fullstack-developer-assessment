<?php

namespace Tests\Feature;

use App\Models\Project;
use Database\Seeders\ProjectSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ProjectApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_it_lists_projects_with_the_public_camel_case_contract(): void
    {
        Project::factory()->create([
            'client_name' => 'Northwind Traders',
            'project_name' => 'Commerce Refresh',
            'description' => 'Modernize the customer ordering flow.',
            'status' => 'Planning',
            'priority' => 'Medium',
            'start_date' => '2026-04-01',
            'due_date' => '2026-06-01',
        ]);

        $this->getJson('/api/projects')
            ->assertOk()
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.clientName', 'Northwind Traders')
            ->assertJsonPath('data.0.projectName', 'Commerce Refresh')
            ->assertJsonPath('data.0.startDate', '2026-04-01')
            ->assertJsonPath('data.0.dueDate', '2026-06-01')
            ->assertJsonPath('meta.current_page', 1)
            ->assertJsonPath('meta.per_page', 20)
            ->assertJsonPath('meta.total', 1)
            ->assertJsonMissingPath('data.0.client_name');
    }

    public function test_it_paginates_projects_with_twenty_entries_by_default(): void
    {
        Project::factory()->count(25)->create();

        $this->getJson('/api/projects')
            ->assertOk()
            ->assertJsonCount(20, 'data')
            ->assertJsonPath('meta.current_page', 1)
            ->assertJsonPath('meta.last_page', 2)
            ->assertJsonPath('meta.per_page', 20)
            ->assertJsonPath('meta.from', 1)
            ->assertJsonPath('meta.to', 20)
            ->assertJsonPath('meta.total', 25);

        $this->getJson('/api/projects?page=2')
            ->assertOk()
            ->assertJsonCount(5, 'data')
            ->assertJsonPath('meta.current_page', 2)
            ->assertJsonPath('meta.from', 21)
            ->assertJsonPath('meta.to', 25);

        $this->getJson('/api/projects?page=0&perPage=101')
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['page', 'perPage']);
    }

    public function test_it_filters_searches_and_sorts_projects(): void
    {
        Project::factory()->create([
            'client_name' => 'Acme Agency',
            'project_name' => 'Zebra Portal',
            'status' => 'Planning',
            'priority' => 'High',
        ]);
        Project::factory()->create([
            'client_name' => 'Acme Agency',
            'project_name' => 'Alpha Portal',
            'status' => 'Planning',
            'priority' => 'High',
        ]);
        Project::factory()->create([
            'client_name' => 'Other Client',
            'project_name' => 'Unrelated Work',
            'status' => 'Completed',
            'priority' => 'Low',
        ]);

        $this->getJson('/api/projects?search=Acme&status=Planning&priority=High&sort=projectName&direction=asc')
            ->assertOk()
            ->assertJsonCount(2, 'data')
            ->assertJsonPath('data.0.projectName', 'Alpha Portal')
            ->assertJsonPath('data.1.projectName', 'Zebra Portal');

        $this->getJson('/api/projects?status=Not%20a%20status&sort=unsafe_column')
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['status', 'sort']);
    }

    public function test_it_shows_a_single_project_and_returns_json_for_a_missing_project(): void
    {
        $project = Project::factory()->create(['project_name' => 'Design System']);

        $this->getJson("/api/projects/{$project->id}")
            ->assertOk()
            ->assertJsonPath('data.id', $project->id)
            ->assertJsonPath('data.projectName', 'Design System');

        $this->getJson('/api/projects/999999')
            ->assertNotFound()
            ->assertJsonStructure(['message']);
    }

    public function test_it_creates_a_project_from_a_camel_case_payload(): void
    {
        $payload = $this->projectPayload();

        $response = $this->postJson('/api/projects', $payload);

        $response
            ->assertCreated()
            ->assertJsonPath('data.clientName', $payload['clientName'])
            ->assertJsonPath('data.projectName', $payload['projectName'])
            ->assertJsonPath('data.description', $payload['description'])
            ->assertJsonPath('data.status', $payload['status'])
            ->assertJsonPath('data.priority', $payload['priority']);

        $this->assertDatabaseHas('projects', [
            'client_name' => $payload['clientName'],
            'project_name' => $payload['projectName'],
            'start_date' => $payload['startDate'],
            'due_date' => $payload['dueDate'],
        ]);
    }

    public function test_it_returns_field_level_errors_for_an_invalid_project(): void
    {
        $this->postJson('/api/projects', [
            'clientName' => '',
            'projectName' => '',
            'description' => ['not a string'],
            'status' => 'Unknown',
            'priority' => 'Urgent',
            'startDate' => 'tomorrow-ish',
            'dueDate' => '2026-08-01',
        ])
            ->assertUnprocessable()
            ->assertJsonValidationErrors([
                'clientName',
                'projectName',
                'description',
                'status',
                'priority',
                'startDate',
            ]);

        $this->postJson('/api/projects', $this->projectPayload([
            'startDate' => '2026-08-02',
            'dueDate' => '2026-08-01',
        ]))
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['dueDate'])
            ->assertJsonPath('errors.dueDate.0', 'The due date must be on or after the start date.');
    }

    public function test_it_fully_updates_a_project_and_can_clear_its_optional_description(): void
    {
        $project = Project::factory()->create([
            'client_name' => 'Old Client',
            'description' => 'Old description',
        ]);
        $payload = $this->projectPayload([
            'clientName' => 'New Client',
            'description' => null,
            'status' => 'Completed',
        ]);

        $this->putJson("/api/projects/{$project->id}", $payload)
            ->assertOk()
            ->assertJsonPath('data.id', $project->id)
            ->assertJsonPath('data.clientName', 'New Client')
            ->assertJsonPath('data.description', null)
            ->assertJsonPath('data.status', 'Completed');

        $this->assertDatabaseHas('projects', [
            'id' => $project->id,
            'client_name' => 'New Client',
            'description' => null,
        ]);
    }

    public function test_an_invalid_or_unknown_update_does_not_modify_a_project(): void
    {
        $project = Project::factory()->create(['client_name' => 'Original Client']);

        $this->putJson("/api/projects/{$project->id}", ['clientName' => 'Only one field'])
            ->assertUnprocessable()
            ->assertJsonValidationErrors([
                'projectName',
                'status',
                'priority',
                'startDate',
                'dueDate',
            ]);

        $this->assertDatabaseHas('projects', [
            'id' => $project->id,
            'client_name' => 'Original Client',
        ]);

        $this->putJson('/api/projects/999999', $this->projectPayload())
            ->assertNotFound()
            ->assertJsonStructure(['message']);
    }

    public function test_it_deletes_a_project_and_returns_not_found_when_deleted_again(): void
    {
        $project = Project::factory()->create();

        $this->deleteJson("/api/projects/{$project->id}")
            ->assertNoContent();

        $this->assertDatabaseMissing('projects', ['id' => $project->id]);

        $this->deleteJson("/api/projects/{$project->id}")
            ->assertNotFound()
            ->assertJsonStructure(['message']);
    }

    public function test_the_assessment_fixture_seeds_all_twelve_projects(): void
    {
        $this->seed(ProjectSeeder::class);

        $this->assertDatabaseCount('projects', 12);
        $this->assertDatabaseHas('projects', [
            'id' => 1,
            'client_name' => 'Acme Corporation',
            'project_name' => 'Corporate Website Redesign',
            'status' => 'In Progress',
            'priority' => 'High',
            'start_date' => '2026-06-01',
            'due_date' => '2026-07-15',
        ]);
    }

    /**
     * @param  array<string, mixed>  $overrides
     * @return array<string, mixed>
     */
    private function projectPayload(array $overrides = []): array
    {
        return array_replace([
            'clientName' => 'Example Client',
            'projectName' => 'Website Refresh',
            'description' => 'A focused redesign for the public website.',
            'status' => 'Planning',
            'priority' => 'Medium',
            'startDate' => '2026-08-01',
            'dueDate' => '2026-09-01',
        ], $overrides);
    }
}
