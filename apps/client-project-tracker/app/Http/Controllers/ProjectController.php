<?php

namespace App\Http\Controllers;

use App\Http\Requests\ListProjectsRequest;
use App\Http\Requests\StoreProjectRequest;
use App\Http\Requests\UpdateProjectRequest;
use App\Http\Resources\ProjectResource;
use App\Models\Project;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Symfony\Component\HttpFoundation\Response;

class ProjectController extends Controller
{
    public function index(ListProjectsRequest $request): AnonymousResourceCollection
    {
        $validated = $request->validated();
        $projects = Project::query();

        if ($search = $validated['search'] ?? null) {
            $projects->where(function ($query) use ($search): void {
                $query
                    ->where('client_name', 'like', "%{$search}%")
                    ->orWhere('project_name', 'like', "%{$search}%");
            });
        }

        if ($status = $validated['status'] ?? null) {
            $projects->where('status', $status);
        }

        if ($priority = $validated['priority'] ?? null) {
            $projects->where('priority', $priority);
        }

        $sortColumns = [
            'clientName' => 'client_name',
            'projectName' => 'project_name',
            'status' => 'status',
            'priority' => 'priority',
            'startDate' => 'start_date',
            'dueDate' => 'due_date',
        ];
        $sort = $validated['sort'] ?? null;
        $sortColumn = $sort ? $sortColumns[$sort] : 'id';
        $direction = $validated['direction'] ?? 'asc';

        $perPage = $validated['perPage'] ?? 20;

        return ProjectResource::collection(
            $projects->orderBy($sortColumn, $direction)->paginate($perPage)->withQueryString(),
        );
    }

    public function store(StoreProjectRequest $request): JsonResponse
    {
        $project = Project::query()->create($this->projectAttributes($request->validated()));

        return (new ProjectResource($project))->response()->setStatusCode(Response::HTTP_CREATED);
    }

    public function show(Project $project): ProjectResource
    {
        return new ProjectResource($project);
    }

    public function update(UpdateProjectRequest $request, Project $project): ProjectResource
    {
        $project->update($this->projectAttributes($request->validated()));

        return new ProjectResource($project->fresh());
    }

    public function destroy(Project $project): Response
    {
        $project->delete();

        return response()->noContent();
    }

    /**
     * Translate the public camelCase request contract to database attributes.
     *
     * @param  array<string, mixed>  $validated
     * @return array<string, mixed>
     */
    private function projectAttributes(array $validated): array
    {
        return [
            'client_name' => $validated['clientName'],
            'project_name' => $validated['projectName'],
            'description' => $validated['description'] ?? null,
            'status' => $validated['status'],
            'priority' => $validated['priority'],
            'start_date' => $validated['startDate'],
            'due_date' => $validated['dueDate'],
        ];
    }
}
